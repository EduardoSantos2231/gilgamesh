import { checkbox, confirm } from "@inquirer/prompts";
import type { Platform, Modalitie } from "@/types/imports.js";

interface Questions {
  askForPlatform(): Promise<Platform[]>
  askForModalitie(): Promise<Modalitie[]>
  askForConfirmation(): Promise<boolean>
}

export class ScriptActions implements Questions {
  async askForPlatform(): Promise<Platform[]> {
    return await checkbox({
      message: "Escolha uma plataforma ou mais plataformas",
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
      },
      ],
      required: true
    })

  }

  async askForModalitie(): Promise<Modalitie[]> {
    return await checkbox({
      message: "Selecione uma ou mais modalidades",
      choices: [
        {
          name: "Estágio",
          value: "estagio"
        },
        {
          name: "Efetivo",
          value: "efetivo"
        }
      ],
      required: true
    })

  }
  async askForConfirmation(): Promise<boolean> {
    return await confirm({
      message: "Confirmar escolhas? ",
      default: true,
    })

  }
}

