import chalk from "chalk";
import { ScriptActions } from "@/actions/scriptActions.js";


const script = new ScriptActions()

await script.askForPlatform()
await script.askForModalitie()
await script.askForConfirmation()
