export interface keyToCreate {
  key: string;
  userId: number;
  displayName?: string;
  soundId?: number;
  bgColor?: string;
  keyColor?: string;
  order?: number;
  name?: string;
}
export interface keyToUpdate {
  key?: string;
  displayName?: string;
  userId: number;
  name?: string;
  design_keyId?: number;
  soundId?: number;
}
