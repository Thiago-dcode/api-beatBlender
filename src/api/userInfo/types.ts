export interface userInfoToCreate {
  space: number;
  keyboards: number;
  sounds: number;
  userId: number;
}
export interface UserInfoToUpdate {
  space?: number;
  sounds?: number;
  keyboards?: number;
}