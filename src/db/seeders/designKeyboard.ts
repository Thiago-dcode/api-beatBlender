import { PrismaClient } from "@prisma/client";
import config from "../../config/config.js";
import DesignKeyboardRepository from "../../api/designKeyboard/designKeyboardRepository.js";
import storageFacade from "../../core/facade/services/storageFacade.js";
import { StorageError } from "../../errors/general/general.js";
import ColorRepository from "../../api/color/colorRepository.js";
export const seed = async (prisma: PrismaClient) => {
  try {
    const { premium, free } = config.design;

    const colorRepo = new ColorRepository(prisma);
    // let colorsMemo: { [key: string]: boolean } = {};

    const allColors = free.designs.flatMap((d) => d.colors);
    const uniqueColors = Array.from(new Set(allColors));
    await Promise.all(
      uniqueColors.map(async (color) => {
        await colorRepo.create(color);
      })
    );

    const result = await Promise.all(
      free.designs.map(async (design) => {
        const colors = design.colors;

        const path = `${free.path}/${design.name}.css`;
        //get the css file of the storage
        const result = await storageFacade().storageService.get(path);
        if (!result) {
          throw new StorageError("Not found design with key: " + path, {});
        }

        const defaultDesignKeyboard = await new DesignKeyboardRepository(
          prisma
        ).create({
          name: design.name,
          path,
          colors,
        });
        return defaultDesignKeyboard;
      })
    );

    console.log("DESIGNKEYBOARD SEEdCOMPLETED");
  } catch (error) {
    console.log("ERROR SEEDING DESIGNKEYBOARD", error);
  }
};
