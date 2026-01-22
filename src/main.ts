import { scriptActions } from "@/actions/imports.js";
import { displayOptions, displayWelcome } from "@/actions/imports.js";
import { ErrorHandler } from "@/utils/errorHandler.js";
import { BrowserManager } from "@/utils/browserManager.js";


async function init() {
  const errorHandler = new ErrorHandler()
  const browserInstance = new BrowserManager()
  try {
    await browserInstance.init()
    displayWelcome()
    const platforms = await scriptActions.askForPlatform()
    const modalities = await scriptActions.askForModalitie()
    const keepGoing = await scriptActions.askForConfirmation()
    if (!keepGoing) return
    displayOptions(platforms, modalities)
    await browserInstance.close()
  }
  catch (error: any) {
    errorHandler.handleError(error)
  }
}


init()

