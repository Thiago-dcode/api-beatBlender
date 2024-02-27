export interface keyToCreate {
  key: string;
  userId: number;
  displayName: string;
  design_keyId?: number;
  soundId?: number;
}
export interface keyToUpdate {
  key?: string;
  displayName?: string;
  userId: number;
  design_keyId?: number;
  soundId?: number;
}
