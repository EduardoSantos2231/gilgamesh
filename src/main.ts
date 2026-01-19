import { ScriptActions } from "@/actions/imports.js";
import { displayOptions, displayWelcome } from "@/actions/imports.js";
import { ErrorHandler } from "./utils/errorHandler.js";

const errorHandler = new ErrorHandler()
const script = new ScriptActions()

async function init() {
  try {
    displayWelcome()
    const platforms = await script.askForPlatform()
    const modalities = await script.askForModalitie()
    const keepGoing = await script.askForConfirmation()
    displayOptions(platforms, modalities, keepGoing)

  }
  catch (error: any) {
    errorHandler.handleError(error)
  }
}


init()

