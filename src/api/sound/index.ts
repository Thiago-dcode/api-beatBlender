import soundRoutes from "./soundRoutes.js";
import StorageService from "../../services/logger/storage/storage.js";
import SoundRepository from "./soundRepository.js";
import ResizeService from "../../services/resize/resize.js";
import { db } from "../../db/db.js";
import SoundHandler from "./soundHandler.js";
import SoundService from "./soundService.js";
import SoundFolderRepository from "../soundFolder/soundFolderRepository.js";
import SoundFolderService from "../soundFolder/soundFolderService.js";
const storageService = new StorageService(new ResizeService());
const soundRepo = new SoundRepository(db());
const soundService = new SoundService(
  soundRepo,
  new SoundFolderService(new SoundFolderRepository(db()), storageService),
  storageService
);
const soundHandler = new SoundHandler(soundService);

export default soundRoutes(soundHandler);
