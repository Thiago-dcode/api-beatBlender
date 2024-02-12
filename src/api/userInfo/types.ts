export interface userInfoToCreate {
  id: number;
  space: number;
  keyboards: number;
  sounds: number;
}
export interface UserInfoToUpdate {
  space?: number;
  sounds?: number;
  keyboards?: number;
}