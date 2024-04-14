import { _Object } from "@aws-sdk/client-s3";
import storageFacade from "../../core/facade/services/storageFacade";
import { StorageError } from "../../errors/general/general";

export const getFreeSoundFolderContent = async (soundFolder: string) => {
  const resource = await storageFacade().storageService.getManyByFolder(
    `free/sounds/${soundFolder}`
  );
  if (!resource.Contents) {
    throw new StorageError(
      "No contents found in free/sounds " + soundFolder,
      {}
    );
  }
  return resource.Contents;
};
export const getManyFreeSoundFolderContent = async (
  soundFolders: string[]
): Promise<[folder: string, contents: _Object[]][]> => {
  const result = await Promise.all(
    soundFolders.map(
      async (folder): Promise<[folder: string, contents: _Object[]]> => {
        const contents = await getFreeSoundFolderContent(folder);

        return [folder, contents];
      }
    )
  );
  return result;
};
