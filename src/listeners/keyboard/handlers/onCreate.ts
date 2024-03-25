import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import userFacade from "../../../core/facade/userFacade.js";
import { KeyboardEventData, KeyboardEvents } from "../type.js";
import updateUserInfoData from "../../_global/updateUserInfoData.js";
import KeyboardListener from "../KeyboardLIstener.js";


export default async function onCreate(
  data: KeyboardEventData[KeyboardEvents.Create]
) {
  // const userInfo =
  //   await userInfoFacade.userInfoService.getFirstByUserAuthOrError(data.userId);
  // //add effects to keyboard
  // const isPremium =
  //   userInfo.membership_status?.membership_id !== config.membership.free.id;

  await updateUserInfoData(
    data.userId,
    userInfoFacade().userInfoService,
    userFacade().userService,
    KeyboardListener
  );
}
