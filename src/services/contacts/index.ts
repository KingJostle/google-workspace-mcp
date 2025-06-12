import { google } from "googleapis";
import {
  BaseGoogleService,
  GoogleServiceError
} from "../base/BaseGoogleService.js";
import { McpError } from "@modelcontextprotocol/sdk/types.js";
import {
  GetContactsParams,
  GetContactsResponse,
  CreateContactParams,
  CreateContactResponse,
  UpdateContactParams,
  UpdateContactResponse,
  DeleteContactParams,
  ContactsError
} from "../../modules/contacts/types.js";
import { CONTACTS_SCOPES } from "../../modules/contacts/scopes.js";

// Type alias for the Google People API client
type PeopleApiClient = ReturnType<typeof google.people>;

/**
 * Contacts service implementation extending BaseGoogleService.
 * Handles Google Contacts (People API) specific operations.
 */
export class ContactsService extends BaseGoogleService<PeopleApiClient> {
  constructor() {
    super({
      serviceName: "people", // Use 'people' for the People API
      version: "v1"
    });
    // Initialize immediately or ensure initialized before first use
    this.initialize();
  }

  /**
   * Gets an authenticated People API client for the specified account.
   */
  private async getPeopleClient(email: string): Promise<PeopleApiClient> {
    // The clientFactory function tells BaseGoogleService how to create the specific client
    return this.getAuthenticatedClient(email, (auth) =>
      google.people({ version: "v1", auth })
    );
  }

  /**
   * Retrieves contacts for the specified user account.
   */
  async getContacts(params: GetContactsParams): Promise<GetContactsResponse> {
    const { email, pageSize, pageToken, personFields } = params;

    if (!personFields) {
      throw new ContactsError(
        "Missing required parameter: personFields",
        "INVALID_PARAMS",
        'Specify the fields to retrieve (e.g. "names,emailAddresses")'
      );
    }

    try {
      // Ensure necessary scopes are granted
      await this.validateScopes(email, [CONTACTS_SCOPES.READONLY]);

      const peopleApi = await this.getPeopleClient(email);

      const response = await peopleApi.people.connections.list({
        resourceName: "people/me", // 'people/me' refers to the authenticated user
        pageSize: pageSize,
        pageToken: pageToken,
        personFields: personFields,
        // requestSyncToken: true // Consider adding for sync capabilities later
      });

      // We might want to add more robust mapping/validation here
      // For now we assume the response structure matches GetContactsResponse
      // Note: googleapis types might use 'null' where we defined optional fields ('undefined')
      // Need to handle potential nulls if strict null checks are enabled
      return response.data as GetContactsResponse;
    } catch (error) {
      // Handle known GoogleServiceError specifically
      if (error instanceof GoogleServiceError) {
        // Assuming GoogleServiceError inherits message and data from McpError
        // Use type assertion as the linter seems unsure
        const gError = error as McpError & {
          data?: { code?: string; details?: string };
        };
        throw new ContactsError(
          gError.message || "Error retrieving contacts", // Fallback message
          gError.data?.code || "GOOGLE_SERVICE_ERROR", // Code from data
          gError.data?.details // Details from data
        );
      }
      // Handle other potential errors (e.g. network errors)
      else if (error instanceof Error) {
        throw new ContactsError(
          `Failed to retrieve contacts: ${error.message}`,
          "UNKNOWN_API_ERROR" // More specific code
        );
      }
      // Handle non-Error throws
      else {
        throw new ContactsError(
          "Failed to retrieve contacts due to an unknown issue",
          "UNKNOWN_INTERNAL_ERROR" // More specific code
        );
      }
    }
  }

  /**
   * Creates a new contact
   */
  async createContact(params: CreateContactParams): Promise<CreateContactResponse> {
    const { email, contact } = params;

    if (!contact) {
      throw new ContactsError(
        "Missing required parameter: contact",
        "INVALID_PARAMS",
        "Contact data is required to create a contact"
      );
    }

    try {
      // Ensure write scope is granted
      await this.validateScopes(email, [CONTACTS_SCOPES.READWRITE]);

      const peopleApi = await this.getPeopleClient(email);

      const response = await peopleApi.people.createContact({
        requestBody: contact
      });

      if (!response.data.resourceName) {
        throw new ContactsError(
          "Failed to create contact",
          "CREATE_ERROR",
          "Contact creation response was incomplete"
        );
      }

      return {
        resourceName: response.data.resourceName,
        etag: response.data.etag || '',
        contact: response.data
      };
    } catch (error) {
      throw this.handleContactError(error, 'Failed to create contact');
    }
  }

  /**
   * Updates an existing contact
   */
  async updateContact(params: UpdateContactParams): Promise<UpdateContactResponse> {
    const { email, resourceName, contact, updatePersonFields } = params;

    if (!resourceName || !contact) {
      throw new ContactsError(
        "Missing required parameters: resourceName and contact",
        "INVALID_PARAMS",
        "Both resourceName and contact data are required to update a contact"
      );
    }

    try {
      // Ensure write scope is granted
      await this.validateScopes(email, [CONTACTS_SCOPES.READWRITE]);

      const peopleApi = await this.getPeopleClient(email);

      const response = await peopleApi.people.updateContact({
        resourceName,
        updatePersonFields: updatePersonFields || 'names,emailAddresses,phoneNumbers',
        requestBody: contact
      });

      if (!response.data.resourceName) {
        throw new ContactsError(
          "Failed to update contact",
          "UPDATE_ERROR",
          "Contact update response was incomplete"
        );
      }

      return {
        resourceName: response.data.resourceName,
        etag: response.data.etag || '',
        contact: response.data
      };
    } catch (error) {
      throw this.handleContactError(error, 'Failed to update contact');
    }
  }

  /**
   * Deletes a contact
   */
  async deleteContact(params: DeleteContactParams): Promise<void> {
    const { email, resourceName } = params;

    if (!resourceName) {
      throw new ContactsError(
        "Missing required parameter: resourceName",
        "INVALID_PARAMS",
        "resourceName is required to delete a contact"
      );
    }

    try {
      // Ensure write scope is granted
      await this.validateScopes(email, [CONTACTS_SCOPES.READWRITE]);

      const peopleApi = await this.getPeopleClient(email);

      await peopleApi.people.deleteContact({
        resourceName
      });

      // Delete operation returns no data on success
    } catch (error) {
      throw this.handleContactError(error, 'Failed to delete contact');
    }
  }

  /**
   * Search contacts by query
   */
  async searchContacts(params: {
    email: string;
    query: string;
    pageSize?: number;
    readMask?: string;
  }): Promise<any> {
    const { email, query, pageSize = 10, readMask = 'names,emailAddresses,phoneNumbers' } = params;

    if (!query) {
      throw new ContactsError(
        "Missing required parameter: query",
        "INVALID_PARAMS",
        "Search query is required"
      );
    }

    try {
      await this.validateScopes(email, [CONTACTS_SCOPES.READONLY]);

      const peopleApi = await this.getPeopleClient(email);

      const response = await peopleApi.people.searchContacts({
        query,
        pageSize,
        readMask
      });

      return response.data;
    } catch (error) {
      throw this.handleContactError(error, 'Failed to search contacts');
    }
  }

  /**
   * Helper method to handle contact-related errors consistently
   */
  private handleContactError(error: any, message: string): ContactsError {
    if (error instanceof GoogleServiceError) {
      const gError = error as McpError & {
        data?: { code?: string; details?: string };
      };
      return new ContactsError(
        gError.message || message,
        gError.data?.code || "GOOGLE_SERVICE_ERROR",
        gError.data?.details
      );
    } else if (error instanceof Error) {
      return new ContactsError(
        `${message}: ${error.message}`,
        "UNKNOWN_API_ERROR"
      );
    } else {
      return new ContactsError(
        `${message} due to an unknown issue`,
        "UNKNOWN_INTERNAL_ERROR"
      );
    }
  }
}

// Optional: Export a singleton instance if needed by the module structure
// let contactsServiceInstance: ContactsService | null = null;
// export function getContactsService(): ContactsService {
//   if (!contactsServiceInstance) {
//     contactsServiceInstance = new ContactsService();
//   }
//   return contactsServiceInstance;
// }
