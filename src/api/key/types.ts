export interface keyToCreate {
  letter: string;
  userId: number;
  design_keyId?: number;
  soundId?: number;
}
export interface keyToUpdate {
  letter?: string;
  userId: number;
  design_keyId?: number;
  soundId?: number;
}
