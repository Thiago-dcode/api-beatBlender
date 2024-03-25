import { SoundFolderData, SoundFolderEvents } from "../type.js";
import { CustomError } from "../../../errors/CustomError.js";
import soundFacade from "../../../core/facade/soundFacade.js";
import Listener from "../../Listener.js";

export default async function onUpdateStorage(
  data: SoundFolderData[SoundFolderEvents.UpdateStorage]
) {
  try {
    await soundFacade().soundService.updateManyPathOrError(
      data.sounds,
      data.userId,
      data.foldername
    );
  } catch (error) {
    if (error instanceof Error)
      Listener.emit(
        "error",
        error instanceof Error
          ? error
          : new CustomError(
              "Unknown error in onUpdateStorage soundFolderLISTENER",
              {},
              500
            )
      );
  }
}
