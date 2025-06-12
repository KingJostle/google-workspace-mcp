// Add these types to your existing contacts/types.ts file

/**
 * Parameters for creating a new contact
 */
export interface CreateContactParams {
  email: string;
  contact: {
    names?: Array<{
      givenName?: string;
      familyName?: string;
      displayName?: string;
      middleName?: string;
    }>;
    emailAddresses?: Array<{
      value: string;
      type?: string;
      formattedType?: string;
    }>;
    phoneNumbers?: Array<{
      value: string;
      type?: string;
      formattedType?: string;
    }>;
    addresses?: Array<{
      streetAddress?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      country?: string;
      type?: string;
    }>;
    organizations?: Array<{
      name?: string;
      title?: string;
      department?: string;
      type?: string;
    }>;
    biographies?: Array<{
      value: string;
      contentType?: string;
    }>;
  };
}

/**
 * Response from creating a contact
 */
export interface CreateContactResponse {
  resourceName: string;
  etag: string;
  contact: any; // Full contact object returned from API
}

/**
 * Parameters for updating an existing contact
 */
export interface UpdateContactParams {
  email: string;
  resourceName: string;
  contact: {
    etag?: string; // Required for updates to prevent conflicts
    names?: Array<{
      givenName?: string;
      familyName?: string;
      displayName?: string;
      middleName?: string;
    }>;
    emailAddresses?: Array<{
      value: string;
      type?: string;
      formattedType?: string;
    }>;
    phoneNumbers?: Array<{
      value: string;
      type?: string;
      formattedType?: string;
    }>;
    addresses?: Array<{
      streetAddress?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      country?: string;
      type?: string;
    }>;
    organizations?: Array<{
      name?: string;
      title?: string;
      department?: string;
      type?: string;
    }>;
    biographies?: Array<{
      value: string;
      contentType?: string;
    }>;
  };
  updatePersonFields?: string; // Fields to update, e.g., 'names,emailAddresses,phoneNumbers'
}

/**
 * Response from updating a contact
 */
export interface UpdateContactResponse {
  resourceName: string;
  etag: string;
  contact: any; // Full updated contact object returned from API
}

/**
 * Parameters for deleting a contact
 */
export interface DeleteContactParams {
  email: string;
  resourceName: string;
}

/**
 * Parameters for searching contacts
 */
export interface SearchContactsParams {
  email: string;
  query: string;
  pageSize?: number;
  readMask?: string;
}

/**
 * Response from searching contacts
 */
export interface SearchContactsResponse {
  results?: Array<{
    person: any; // Contact object
  }>;
  nextPageToken?: string;
}
