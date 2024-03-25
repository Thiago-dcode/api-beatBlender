import userInfoFacade from "../../../core/facade/userInfoFacade.js";
import userFacade from "../../../core/facade/userFacade.js";
import updateUserInfoData from "../../_global/updateUserInfoData.js";
import { SoundFolderData, SoundFolderEvents } from "../type.js";
import SoundFolderListener from "../SoundFolderListener.js";

export default async function onDeleteStorage(
  data: SoundFolderData[SoundFolderEvents.DeleteStorage]
) {
  console.log('THIS SHOULD BE PRINTED:',data)
  await updateUserInfoData(
    data.userId,
    userInfoFacade().userInfoService,
    userFacade().userService,
    SoundFolderListener
  );
}
