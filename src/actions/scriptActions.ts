import { checkbox, confirm } from "@inquirer/prompts";
import type { Platforms, Modalities } from "@/types/plataforms.types.js";

interface Questions {
  askForPlatform(): Promise<Platforms[]>
  askForModalitie(): Promise<Modalities[]>
  askForConfirmation(): Promise<boolean>
}

export class ScriptActions implements Questions {
  async askForPlatform(): Promise<Platforms[]> {
    return await checkbox({
      message: "Escolha uma plataforma",
      choices: [{
        name: "Ciee",
        value: "ciee",
      },
      {
        name: "Solides",
        value: "solides"
      },
      {
        name: "Catho",
        value: "catho"
      },
      {
        name: "IEL",
        value: "iel"
      }
      ]
    })

  }

  async askForModalitie(): Promise<Modalities[]> {
    return await checkbox({
      message: "Selecione uma ou mais modalidades",
      choices: [
        {
          name: "Estágio",
          value: "internship"
        },
        {
          name: "Efetivo",
          value: "clt"
        }
      ]
    })

  }
  async askForConfirmation(): Promise<boolean> {
    return await confirm({
      message: "Confirmar escolhas? ",
      default: false,
    })

  }
}

