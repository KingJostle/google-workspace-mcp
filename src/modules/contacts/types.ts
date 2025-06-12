/**
 * Complete types for Google Contacts operations
 */

// Original types for getting contacts
export interface GetContactsParams {
  email: string;
  pageSize?: number;
  pageToken?: string;
  personFields: string;
}

export interface GetContactsResponse {
  connections?: Array<{
    resourceName: string;
    etag: string;
    names?: Array<{
      metadata: any;
      displayName: string;
      familyName?: string;
      givenName?: string;
      middleName?: string;
      displayNameLastFirst?: string;
      unstructuredName?: string;
    }>;
    emailAddresses?: Array<{
      metadata: any;
      value: string;
      type?: string;
      formattedType?: string;
      displayName?: string;
    }>;
    phoneNumbers?: Array<{
      metadata: any;
      value: string;
      canonicalForm?: string;
      type?: string;
      formattedType?: string;
    }>;
    addresses?: Array<{
      metadata: any;
      streetAddress?: string;
      city?: string;
      region?: string;
      postalCode?: string;
      country?: string;
      type?: string;
      formattedType?: string;
    }>;
    organizations?: Array<{
      metadata: any;
      name?: string;
      title?: string;
      department?: string;
      type?: string;
      formattedType?: string;
    }>;
    biographies?: Array<{
      metadata: any;
      value: string;
      contentType?: string;
    }>;
  }>;
  nextPageToken?: string;
  totalPeople?: number;
  totalItems?: number;
}

// Custom error class for contacts operations
export class ContactsError extends Error {
  public readonly code: string;
  public readonly details?: string;

  constructor(message: string, code: string, details?: string) {
    super(message);
    this.name = 'ContactsError';
    this.code = code;
    this.details = details;
  }
}

// New types for creating contacts
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

export interface CreateContactResponse {
  resourceName: string;
  etag: string;
  contact: any; // Full contact object returned from API
}

// Types for updating contacts
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

export interface UpdateContactResponse {
  resourceName: string;
  etag: string;
  contact: any; // Full updated contact object returned from API
}

// Types for deleting contacts
export interface DeleteContactParams {
  email: string;
  resourceName: string;
}

// Types for searching contacts
export interface SearchContactsParams {
  email: string;
  query: string;
  pageSize?: number;
  readMask?: string;
}

export interface SearchContactsResponse {
  results?: Array<{
    person: any; // Contact object
  }>;
  nextPageToken?: string;
}
