import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import userFacade from "../../../core/facade/userFacade.js";
import { KeyboardEventData, KeyboardEvents } from "../type.js";
import updateUserInfoData from "../../_global/updateUserInfoData.js";
import KeyboardListener from "../KeyboardLIstener.js";

export default async function onDelete(
  data: KeyboardEventData[KeyboardEvents.Delete]
) {
  console.log('THIS SHOULD BE PRINTEND: ',data)
  await updateUserInfoData(
    data.userId,
    userInfoFacade.userInfoService,
    userFacade.userService,
    KeyboardListener
  );
}
