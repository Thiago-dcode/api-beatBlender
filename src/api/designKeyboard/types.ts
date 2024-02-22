export interface designKeyboardToCreate {
  name: string;
  colors: string[];
  path: string;
  isPremium?: boolean;
}
export interface designKeyboardToUpdate {
  name?: string;
  colors?: string[];
  path?: string;
}
