import soundFolderRoute from "./soundFolderRoute.js";

import { db } from "../../db/db.js";

import SoundFolderRepository from "./soundFolderRepository.js";
import SoundFolderService from "./soundFolderService.js";
import SoundFolderHandler from "./soundFolderHandler.js";

const soundFolderRepository = new SoundFolderRepository(db());
const soundFolderService = new SoundFolderService(soundFolderRepository);
const soundFolderHandler = new SoundFolderHandler(soundFolderService);

export default soundFolderRoute(soundFolderHandler);
