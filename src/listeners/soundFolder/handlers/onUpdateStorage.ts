import { Sound, Sound_folder } from "@prisma/client";
import { extractFolderAndFileName } from "../../../api/sound/helper.js";
import SoundRepository from "../../../api/sound/soundRepository.js";
import { db } from "../../../db/db.js";
const soundRepository = new SoundRepository(db());
export default async function onUpdateStorage(data: {
  sounds: Sound[];
  userId: number;
  foldername: string;
}) {
  const soundsToUpdate = await Promise.all(
    data.sounds.map(async (sound) => {
      const { filename } = extractFolderAndFileName(sound.path);

      const result = await soundRepository.update(sound.id, {
        id: sound.id,
        path: `user-${data.userId}/sounds/${data.foldername}/${filename}`,
      });
      return result;
    })
  );
}
