import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import userFacade from "../../../core/facade/userFacade.js";
import { SoundEventData, SoundEvents } from "../type.js";
import Listener from "../../Listener.js";
import updateUserInfoData from "../../_global/updateUserInfoData.js";

export default async function onDelete(
  data: SoundEventData[SoundEvents.Delete]
) {
  await updateUserInfoData(
    data.userId,
    userInfoFacade().userInfoService,
    userFacade().userService,
    Listener
  );
}
