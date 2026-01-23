import { scriptActions, displayOptions, displayWelcome } from "@/actions/imports.js";
import { ErrorHandler } from "@/utils/errorHandler.js";
import { BrowserManager, scraperHandler } from "@/utils/imports.js";
import type { SearchConfig } from "./types/searchConfigs.types.js";


async function init() {
  const errorHandler = new ErrorHandler()
  const browserInstance = new BrowserManager()
  try {
    await browserInstance.init()
    displayWelcome()
    const platforms = await scriptActions.askForPlatform()
    const modalities = await scriptActions.askForModalitie()
    const location = await scriptActions.askLocation()
    const keepGoing = await scriptActions.askForConfirmation()
    if (!keepGoing) return
    displayOptions(platforms, modalities)
    const configs: SearchConfig =
    {
      area: "",
      modalities: modalities,
      platforms: platforms,
      location: location,
    }

    await scraperHandler(configs, browserInstance)

  }
  catch (error: any) {
    errorHandler.handleError(error)
  } finally {
    browserInstance.close()
  }
}


init()

