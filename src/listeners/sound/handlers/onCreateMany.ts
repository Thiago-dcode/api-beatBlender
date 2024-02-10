import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import userFacade from "../../../core/facade/userFacade.js";
import { EntityNotFoundError } from "../../../errors/db/db.js";

export default async function onCreateMany(data: { userId: number }) {
  const { userId } = data;
  
  await userInfoFacade.userInfoService.extractUserInfoFromUserAndUpdateOrError(data.userId,userFacade.userService)
 
}
