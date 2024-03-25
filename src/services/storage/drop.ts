import storageFacade from "../../core/facade/services/storageFacade.js";
import userFacade from "../../core/facade/userFacade.js";
export const dropAllUsersFolders = async () => {
  const allUsers = await userFacade().userService.getAll();
  if (allUsers.length === 0) return;
  const result = await Promise.all(
    allUsers.map(async (user) => {
      console.log(`user-${user.id}`);
      const result = await storageFacade().storageService.deleteManyByFolder(
        `user-${user.id}`
      );
      return result;
    })
  );
  console.log("DROPPED ALL USER FOLDERS");
  return result;
};

(async function () {
  console.log("--- DROP INIT ---");
  await dropAllUsersFolders();
})();
