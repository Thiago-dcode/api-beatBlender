import { EntityNotFoundError } from "../../errors/db/db.js";
import MembershipSatusRepository from "./membershipStatusRepository.js";
import { membershipStatusToCreate } from "./types.js";
export default class MembershipStatusService {
  constructor(
    private readonly memberShipStatusRepo: MembershipSatusRepository
  ) {}

  //This function must only be called when user is register by the first time
  // async getByIdOrError(id: number) {
  //   const membership = await this.memberShipStatusRepo.findFirstById(id);
  //   if (!membership) {
  //     throw new EntityNotFoundError(
  //       `Membership with id ${id} not found`,
  //       {},
  //       500
  //     );
  //   }
  //   return membership
  // }
  async createOrError(data: membershipStatusToCreate) {
    const membershipStatusExists = await this.memberShipStatusRepo.findFirstByUserInfo(data.user_infoId)
    if(membershipStatusExists){
      
    }
    const membershipStatusCreated = await this.memberShipStatusRepo.create(
      data
    );
    return membershipStatusCreated;
  }
}
