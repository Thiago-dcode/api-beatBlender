//effectFacade.ts
import EffectRepository from "../../api/effect/effectRepository.js";
import EffectService from "../../api/effect/effectService.js";
import { db } from "../../db/db.js";
/**
 * Facade for interacting with free-related functionality.
 * Provides a simplified interface for accessing KEY services.
 */
class EffectFacade {
  readonly effectService: EffectService;

  /**
   * Constructs a new instance of effectFacade.
   * @param effectService The free service to be used.
   */
  constructor(effectService: EffectService) {
    this.effectService = effectService;
  }

  // Add more methods as needed...
}

// Instantiate effectFacade with dependencies
const effectFacade = new EffectFacade(
  new EffectService(new EffectRepository(db()))
);

export default effectFacade;
