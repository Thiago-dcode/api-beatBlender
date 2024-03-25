//effectFacade.ts
import EffectRepository from "../../api/effect/effectRepository.js";
import EffectService from "../../api/effect/effectService.js";
import { db } from "../../db/db.js";

class EffectFacade {
  constructor(readonly effectService: EffectService) {}
  // Add more methods as needed...
}

let singleton: EffectFacade;

export default () => {
  if (!(singleton instanceof EffectFacade)) {
    singleton = new EffectFacade(new EffectService(new EffectRepository(db())));
  }
  return singleton;
};
