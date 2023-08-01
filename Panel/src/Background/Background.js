import { checkIntegrity } from "../../../Helpers/Integrity/checkIntegrity";

setInterval(async () => {
  await checkIntegrity({ isWorker: true });
}, 1000 * 20);
