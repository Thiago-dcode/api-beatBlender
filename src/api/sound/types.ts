export interface soundToCreate {
  name: string;
  path: string;
  userId: number;
  sound_folderId: number;
}
export interface soundToUpdate {
  name?: string;
  path?: string;
  userId?: number;
}
