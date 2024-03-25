import EffectRepository from "./effectRepository.js";
import { Effects } from "./types.js";
export default class EffectService {
  constructor(private readonly effectRepo: EffectRepository) {}

  //This function must only be called when user is register by the first time
  async create(data: Effects) {
    const effect = await this.effectRepo.create(data);
    return effect;
  }
  async createMany(data: Effects[]) {
    const result = await this.effectRepo.createMany(data);
    return result;
  }
  async getManyByKey(keyId: number) {
    const result = await this.effectRepo.findManyWhere({ keyId });
    return result;
  }
}
