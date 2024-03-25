import soundFolderRoute from "./soundFolderRoute.js";
import soundFolderFacade from "../../core/facade/soundFolderFacade.js";
import SoundFolderHandler from "./soundFolderHandler.js";

const soundFolderHandler = new SoundFolderHandler(soundFolderFacade().soundFolderService);

export default soundFolderRoute(soundFolderHandler);
