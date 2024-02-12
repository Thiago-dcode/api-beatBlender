import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import userFacade from "../../../core/facade/userFacade.js";
import SoundListener from "../SoundListener.js";
import { SoundEventData, SoundEvents } from "../type.js";
import updateUserInfoData from "../../_global/updateUserInfoData.js";
import Listener from "../../Listener.js";

export default async function onUpdate(
  data: SoundEventData[SoundEvents.Update]
) {
  await updateUserInfoData(
    data.userId,
    userInfoFacade.userInfoService,
    userFacade.userService,
    Listener
  );
}
