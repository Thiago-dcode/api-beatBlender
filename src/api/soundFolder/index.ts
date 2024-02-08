import soundFolderRoute from "./soundFolderRoute.js";
import { db } from "../../db/db.js";
import ResizeService from "../../services/resize/resize.js";
import StorageService from "../../services/logger/storage/storage.js";
import SoundFolderRepository from "./soundFolderRepository.js";
import SoundFolderService from "./soundFolderService.js";
import SoundFolderHandler from "./soundFolderHandler.js";
const storageService = new StorageService(new ResizeService());
const soundFolderRepository = new SoundFolderRepository(db());
const soundFolderService = new SoundFolderService(
  soundFolderRepository,
  storageService,
);
const soundFolderHandler = new SoundFolderHandler(soundFolderService);

export default soundFolderRoute(soundFolderHandler);
