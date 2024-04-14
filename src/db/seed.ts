import { seed as freeResourcesSeeder } from "./seeders/freeResources.js";
import { seed as membershipSeeder } from "./seeders/membership.js";
import { seed as designKeyboardSeeder } from "./seeders/designKeyboard.js";
import { db } from "./db.js";
import { seed as usersSeeder } from "./seeders/users.js";
import { seed as soundsSeeder } from "./seeders/sounds.js";
import { seed as userInfosSeeder } from "./seeders/usersInfo.js";
import { seed as keysSeeder } from "./seeders/keys.js";
import { getManyFreeSoundFolderContent } from "../services/storage/getFreeResources.js";

const main = async () => {
  try {
    console.log("--- SEED INIT ---");
    const users = await usersSeeder(db());
    console.log("--- USER SEED FINISH ---");
    await userInfosSeeder(db(), users);
    console.log("--- USERINFO SEED FINISH ---");
    const soundsFolders = ["piano",'hip-hop','lofi','register','login'];
    const freeSoundsFolders = await getManyFreeSoundFolderContent(soundsFolders);
    const sounds = await soundsSeeder(db(), users,freeSoundsFolders);
    console.log("--- SOUND SEED FINISH ---");
   await keysSeeder(db(), sounds);
    console.log("--- KEY SEED FINISH ---");
    await designKeyboardSeeder(db());
    console.log("--- KEY SEED FINISH ---");
    await freeResourcesSeeder(db(),freeSoundsFolders);
    console.log("--- FREERESOURCESSEEDER SEED FINISH ---");
    await membershipSeeder(db());
    console.log("--- MEMBERSHIP SEED FINISH ---");
  } catch (error) {
    console.error("---ERROR SEEDING---", error);
  } finally {
    db().$disconnect();
  }
};
main();
