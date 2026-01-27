import { ScriptActions } from "@/actions/scriptActions.js";
import { BrowserManager, scraperHandler, ErrorHandler } from "@/utils/imports.js";
import type { SearchConfig } from "./types/imports.ts";


async function init() {
  const errorHandler = new ErrorHandler()
  const browserInstance = new BrowserManager()
  const scriptActions = new ScriptActions()
  try {
    await browserInstance.init()
    scriptActions.displayWelcome()
    const platforms = await scriptActions.askForPlatform()
    const modalities = await scriptActions.askForModalitie()
    const location = await scriptActions.askLocation()
    const keepGoing = await scriptActions.askForConfirmation()
    if (!keepGoing) return
    scriptActions.displayOptions(platforms, modalities)
    const configs: SearchConfig =
    {
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

