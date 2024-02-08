export interface SoundFolderToCreate {
  name: string;
  userId: number;
  is_default?: boolean
}
export interface SoundFolderToUpdate {
  name?: string;
  is_default?: boolean
}