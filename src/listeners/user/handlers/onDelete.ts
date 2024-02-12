import { UserData, UserEvents } from "../type.js";
import storageFacade from "../../../core/facade/services/storageFacade.js";

export default async function onDelete(data: UserData[UserEvents.Delete]) {
  //delete storage

  await storageFacade.storageService.deleteManyByFolder(
    `user-${data.user.id}`
  );
}
