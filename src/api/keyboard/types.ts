export interface keyboardToCreate {
  name: string;
  userId: number;
  design_keyboardName?: string;
}
export interface keyboardToUpdate {
  name?: string;
  userId: number;
  design_keyboardName?: string;
  private?: boolean;
}
