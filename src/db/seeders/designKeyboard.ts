import { PrismaClient } from "@prisma/client";
import config from "../../config/config.js";
import DesignKeyboardRepository from "../../api/designKeyboard/designKeyboardRepository.js";
import storageFacade from "../../core/facade/services/storageFacade.js";
import { StorageError } from "../../errors/general/general.js";
import ColorRepository from "../../api/color/colorRepository.js";
export const seed = async (prisma: PrismaClient) => {
  const { premium, free } = config.design;
  const colors = ["rgb(38 38 38)", "rgb(245 245 245)"];
  const colorRepo = new ColorRepository(prisma);
  await Promise.all(
    colors.map(async (color) => {
      const colorExist = await colorRepo.findFirstByName(color);
      if (!colorExist) {
        await colorRepo.create(color);
      }
    })
  );
  const result = await Promise.all(
    free.names.map(async (name) => {
      const path = `${free.path}/${name}.css`;
      //get the css file of the storage
      const result = await storageFacade.storageService.get(path);
      if (!result) {
        throw new StorageError("Not found design with key: " + path, {});
      }

      const defaultDesignKeyboard = await new DesignKeyboardRepository(
        prisma
      ).create({
        name,
        path,
        colors,
      });
      return defaultDesignKeyboard;
    })
  );

  console.log("DESIGNKEYBOARD SEED COMPLETED", result);
};
