export interface Faculty {
  id: string;
  name: string;
  email: string;
  roles: string[];
  type: string;
  dateAdded: string;
  initials?: string;
  hasPhoto?: boolean;
}