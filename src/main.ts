import { scriptActions } from "@/actions/imports.js";
import { displayOptions, displayWelcome } from "@/actions/imports.js";
import { ErrorHandler } from "./utils/errorHandler.js";

const errorHandler = new ErrorHandler()

async function init() {
  try {
    displayWelcome()
    const platforms = await scriptActions.askForPlatform()
    const modalities = await scriptActions.askForModalitie()
    const keepGoing = await scriptActions.askForConfirmation()
    displayOptions(platforms, modalities, keepGoing)

  }
  catch (error: any) {
    errorHandler.handleError(error)
  }
}


init()

