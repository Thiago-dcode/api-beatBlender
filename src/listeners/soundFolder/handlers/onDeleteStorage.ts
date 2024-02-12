import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import userFacade from "../../../core/facade/userFacade.js";
import updateUserInfoData from "../../_global/updateUserInfoData.js";
import Listener from "../../Listener.js";
import { SoundFolderData, SoundFolderEvents } from "../type.js";

export default async function onDeleteStorage(
  data: SoundFolderData[SoundFolderEvents.DeleteStorage]
) {
  await updateUserInfoData(
    data.userId,
    userInfoFacade.userInfoService,
    userFacade.userService,
    Listener
  );
}
