import soundRoutes from "./soundRoutes.js";
import soundFacade from "../../core/facade/soundFacade.js";
import SoundHandler from "./soundHandler.js";

const soundHandler = new SoundHandler(soundFacade().soundService);

export default soundRoutes(soundHandler);
