export declare global {
  interface Window {
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
  }
  interface Navigator {
    readonly contacts: ContactsManager;
  }
}

type ContactProperty = keyof IContactInfoAPI;

interface IContactAddressAPI {
  object: JSON;
  city: string;
  country: string;
  dependentLocality: string;
  organization: string;
  phone: string;
  postalCode: string;
  recipient: string;
  region: string;
  sortingCode: string;
  addressLine: string[];
}
interface IContactInfoAPI {
  address: IContactAddressAPI;
  email: string;
  icon: Blob;
  name: string;
  tel: string;
}

interface IContactsSelectOptionsAPI {
  multiple: boolean;
}

interface ContactsManager {
  getProperties(): Promise<IContactInfoAPI[]>;
  select(
    properties: ContactProperty[],
    options?: IContactsSelectOptionsAPI
  ): Promise<IContactInfoAPI[]>;
}
