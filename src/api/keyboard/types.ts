export interface keyboardToCreate {
  name: string;
  userId: number;
  design_keyboardId?: number;
}
export interface keyboardToUpdate {
  name?: string;
  userId: number;
  design_keyboardId?: number;
  private?: boolean;
}
