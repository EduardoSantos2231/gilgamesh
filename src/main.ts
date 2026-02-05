import { ScriptActions } from "./actions/scriptActions.js";
import { ScraperHandler } from "./orchestration/scraper-handler.js";
import { ErrorHandler } from "./utils/errorHandler.utils.js";
import type { SearchConfig } from "./types/searchConfigs.types.js";

async function init() {
  const errorHandler = new ErrorHandler();
  const scraperHandler = new ScraperHandler();
  const scriptActions = new ScriptActions();

  try {
    scriptActions.displayWelcome();
    const platforms = await scriptActions.askForPlatform();
    const modalities = await scriptActions.askForModalitie();
    const location = await scriptActions.askLocation();
    const keepGoing = await scriptActions.askForConfirmation();

    if (!keepGoing) return;

    scriptActions.displayOptions(platforms, modalities);

    const configs: SearchConfig = {
      modalities,
      platforms,
      location,
    };

    await scraperHandler.execute(configs);
  } catch (error) {
    errorHandler.handleError(error);
  }
}

init();
