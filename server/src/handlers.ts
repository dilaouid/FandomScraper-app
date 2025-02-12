import { characterController } from "./controllers/characters";
import { proxyController } from "./controllers/proxy";

export const handlers = {
    ...characterController,
    ...proxyController
}