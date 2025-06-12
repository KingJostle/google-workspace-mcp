// Update your contacts/scopes.ts file with this content

export const CONTACTS_SCOPES = {
  READONLY: 'https://www.googleapis.com/auth/contacts.readonly',
  READWRITE: 'https://www.googleapis.com/auth/contacts', // Full read/write access
  OTHER_READONLY: 'https://www.googleapis.com/auth/contacts.other.readonly',
  DIRECTORY_READONLY: 'https://www.googleapis.com/auth/directory.readonly'
} as const;

export type ContactsScope = typeof CONTACTS_SCOPES[keyof typeof CONTACTS_SCOPES];
