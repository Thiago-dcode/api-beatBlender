export interface SoundFolderToCreate {
  name: string;
  userId: number;
  isDefault?: boolean
}
export interface SoundFolderToUpdate {
  name?: string;
  isDefault?: boolean
}