import { seed as freeResourcesSeeder } from "./seeders/freeResources.js";
import { seed as membershipSeeder } from "./seeders/membership.js";
import { seed as designKeyboardSeeder } from "./seeders/designKeyboard.js";
import { db } from "./db.js";
import { seed as usersSeeder } from "./seeders/users.js";
import { seed as soundsSeeder } from "./seeders/sounds.js";
import { seed as userInfosSeeder } from "./seeders/usersInfo.js";
import { seed as keysSeeder } from "./seeders/keys.js";

const main = async () => {
  try {
    console.log("--- SEED INIT ---");
    const users = await usersSeeder(db());
    await userInfosSeeder(db(), users);
    const sounds = await soundsSeeder(db(), users);
    await keysSeeder(db(), sounds);
    await designKeyboardSeeder(db());
    await freeResourcesSeeder(db());
    await membershipSeeder(db());
  } catch (error) {
    console.error("---ERROR SEEDING---", error);
  } finally {
    db().$disconnect();
  }
};
main();
