import categoryRoute from "./categoryRoutes.js";
import categoryHandler from "./categoryHandler.js";
import categoryFacade from "../../core/facade/categoryFacade.js";

export default categoryRoute(
  new categoryHandler(categoryFacade().categoryService)
);
