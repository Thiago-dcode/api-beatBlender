import StorageService from "../../../services/storage/storage.js";

import ResizeService from "../../../services/resize/resize.js";

class StorageFacade {
  readonly storageService: StorageService;

  /**
   * Constructs a new instance of storageFacade.
   * @param storageService The auth information service to be used.
   */
  constructor(storageService: StorageService) {
    this.storageService = storageService;
  }
}

// Instantiate storageFacade with dependencies
const storageFacade = new StorageFacade(
  new StorageService(new ResizeService())
);

export default storageFacade;
