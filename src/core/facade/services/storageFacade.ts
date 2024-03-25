import StorageService from "../../../services/storage/storage.js";

import ResizeService from "../../../services/resize/resize.js";
console.log("STORAGE FACADE");
class StorageFacade {
  /**
   * Constructs a new instance of storageFacade.
   * @param storageService The auth information service to be used.
   */
  readonly storageService: StorageService;

  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }
}

let singleton: StorageFacade;

// Instantiate storageFacade with dependencies

export default () => {
  if (!(singleton instanceof StorageFacade)) {
    singleton = new StorageFacade(new StorageService(new ResizeService()));
  }
  return singleton;
};
