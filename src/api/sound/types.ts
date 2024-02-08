export interface soundToCreate {
  name: string;
  path: string;
  userId: number;
  sound_folderId: number;
}
export interface soundToUpdate {
  id?: number;
  name?: string;
  path?: string;
  userId?: number;
  sound_folderId?: number;
}
