import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import userFacade from "../../../core/facade/userFacade.js";
import { SoundEventData, SoundEvents } from "../type.js";
import updateUserInfoData from "../../_global/updateUserInfoData.js";
import SoundListener from "../SoundListener.js";

export default async function onCreateMany(
  data: SoundEventData[SoundEvents.CreateMany]
) {
  await updateUserInfoData(
    data.userId,
    userInfoFacade.userInfoService,
    userFacade.userService,
    SoundListener
  );
}
