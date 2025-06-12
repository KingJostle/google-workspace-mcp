import {
  GetContactsParams,
  GetContactsResponse,
  CreateContactParams,
  CreateContactResponse,
  UpdateContactParams,
  UpdateContactResponse,
  DeleteContactParams,
  SearchContactsParams,
  SearchContactsResponse,
  ContactsError
} from "../modules/contacts/types.js";
import { ContactsService } from "../services/contacts/index.js";
import { validateEmail } from "../utils/account.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { getAccountManager } from "../modules/accounts/index.js";

// Singleton instances - Initialize or inject as per project pattern
let contactsService: ContactsService;
let accountManager: ReturnType<typeof getAccountManager>;

/**
 * Initialize required services.
 * This should likely be integrated into a central initialization process.
 */
async function initializeServices() {
  if (!contactsService) {
    // Assuming ContactsService has a static getInstance or similar
    // or needs to be instantiated here. Using direct instantiation for now.
    contactsService = new ContactsService();
    // If ContactsService requires async initialization await it here.
    // await contactsService.initialize();
  }
  if (!accountManager) {
    accountManager = getAccountManager();
  }
}

/**
 * Handler function for retrieving Google Contacts.
 */
export async function handleGetContacts(
  params: GetContactsParams
): Promise<GetContactsResponse> {
  await initializeServices(); // Ensure services are ready

  const { email, personFields, pageSize, pageToken } = params;

  if (!email) {
    throw new McpError(ErrorCode.InvalidParams, "Email address is required");
  }

  validateEmail(email);

  if (!personFields) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'personFields parameter is required (e.g. "names,emailAddresses")'
    );
  }

  // Use accountManager for token renewal like in Gmail handlers
  return accountManager.withTokenRenewal(email, async () => {
    try {
      const result = await contactsService.getContacts({
        email,
        personFields,
        pageSize,
        pageToken
      });
      return result;
    } catch (error) {
      if (error instanceof ContactsError) {
        // Map ContactsError to McpError
        throw new McpError(
          ErrorCode.InternalError, // Or map specific error codes
          `Contacts API Error: ${error.message}`,
          { code: error.code, details: error.details }
        );
      } else if (error instanceof McpError) {
        // Re-throw existing McpErrors (like auth errors from token renewal)
        throw error;
      } else {
        // Catch unexpected errors
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to get contacts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  });
}

/**
 * Handler function for creating a new Google Contact.
 */
export async function handleCreateContact(
  params: CreateContactParams
): Promise<CreateContactResponse> {
  await initializeServices();

  const { email, contact } = params;

  if (!email) {
    throw new McpError(ErrorCode.InvalidParams, "Email address is required");
  }

  validateEmail(email);

  if (!contact) {
    throw new McpError(ErrorCode.InvalidParams, "Contact data is required");
  }

  return accountManager.withTokenRenewal(email, async () => {
    try {
      const result = await contactsService.createContact({
        email,
        contact
      });
      return result;
    } catch (error) {
      if (error instanceof ContactsError) {
        throw new McpError(
          ErrorCode.InternalError,
          `Contacts API Error: ${error.message}`,
          { code: error.code, details: error.details }
        );
      } else if (error instanceof McpError) {
        throw error;
      } else {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to create contact: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  });
}

/**
 * Handler function for updating an existing Google Contact.
 */
export async function handleUpdateContact(
  params: UpdateContactParams
): Promise<UpdateContactResponse> {
  await initializeServices();

  const { email, resourceName, contact, updatePersonFields } = params;

  if (!email) {
    throw new McpError(ErrorCode.InvalidParams, "Email address is required");
  }

  validateEmail(email);

  if (!resourceName) {
    throw new McpError(ErrorCode.InvalidParams, "Resource name is required");
  }

  if (!contact) {
    throw new McpError(ErrorCode.InvalidParams, "Contact data is required");
  }

  return accountManager.withTokenRenewal(email, async () => {
    try {
      const result = await contactsService.updateContact({
        email,
        resourceName,
        contact,
        updatePersonFields
      });
      return result;
    } catch (error) {
      if (error instanceof ContactsError) {
        throw new McpError(
          ErrorCode.InternalError,
          `Contacts API Error: ${error.message}`,
          { code: error.code, details: error.details }
        );
      } else if (error instanceof McpError) {
        throw error;
      } else {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to update contact: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  });
}

/**
 * Handler function for deleting a Google Contact.
 */
export async function handleDeleteContact(
  params: DeleteContactParams
): Promise<{ success: boolean; message: string }> {
  await initializeServices();

  const { email, resourceName } = params;

  if (!email) {
    throw new McpError(ErrorCode.InvalidParams, "Email address is required");
  }

  validateEmail(email);

  if (!resourceName) {
    throw new McpError(ErrorCode.InvalidParams, "Resource name is required");
  }

  return accountManager.withTokenRenewal(email, async () => {
    try {
      await contactsService.deleteContact({
        email,
        resourceName
      });
      return {
        success: true,
        message: `Contact ${resourceName} deleted successfully`
      };
    } catch (error) {
      if (error instanceof ContactsError) {
        throw new McpError(
          ErrorCode.InternalError,
          `Contacts API Error: ${error.message}`,
          { code: error.code, details: error.details }
        );
      } else if (error instanceof McpError) {
        throw error;
      } else {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to delete contact: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  });
}

/**
 * Handler function for searching Google Contacts.
 */
export async function handleSearchContacts(
  params: SearchContactsParams
): Promise<SearchContactsResponse> {
  await initializeServices();

  const { email, query, pageSize, readMask } = params;

  if (!email) {
    throw new McpError(ErrorCode.InvalidParams, "Email address is required");
  }

  validateEmail(email);

  if (!query) {
    throw new McpError(ErrorCode.InvalidParams, "Search query is required");
  }

  return accountManager.withTokenRenewal(email, async () => {
    try {
      const result = await contactsService.searchContacts({
        email,
        query,
        pageSize,
        readMask
      });
      return result;
    } catch (error) {
      if (error instanceof ContactsError) {
        throw new McpError(
          ErrorCode.InternalError,
          `Contacts API Error: ${error.message}`,
          { code: error.code, details: error.details }
        );
      } else if (error instanceof McpError) {
        throw error;
      } else {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to search contacts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  });
}
