import { characterController } from "./controllers/characters";
import { proxyController } from "./controllers/image";

export const handlers = {
    ...characterController,
    ...proxyController
}