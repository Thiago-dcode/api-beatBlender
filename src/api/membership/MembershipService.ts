import { EntityNotFoundError } from "../../errors/db/db.js";
import MembershipRepository from "./membershipRepository.js";
export default class MembershipService {
  constructor(private readonly membershipRepo: MembershipRepository) {}

  //This function must only be called when user is register by the first time
  async getByIdOrError(id: number) {
    const membership = await this.membershipRepo.findFirstById(id);
    if (!membership) {
      throw new EntityNotFoundError(
        `Membership with id ${id} not found`,
        {},
        500
      );
    }
    return membership
  }
}
