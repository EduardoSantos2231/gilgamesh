import { checkbox, confirm, select } from "@inquirer/prompts";
import { type Platform, type Modalitie, type RegionKey, SUPPORTED_REGIONS } from "@/types/imports.js";

interface Questions {
  askForPlatform(): Promise<Platform[]>
  askForModalitie(): Promise<Modalitie[]>
  askForConfirmation(): Promise<boolean>
  askLocation(): Promise<RegionKey>
}

export const scriptActions: Questions = {
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

  },

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

  },
  async askLocation(): Promise<RegionKey> {
    const regionKeys = Object.keys(SUPPORTED_REGIONS) as RegionKey[];

    const regionChoices = regionKeys.map((key) => {
      const region = SUPPORTED_REGIONS[key];
      // Formatamos o nome para ficar bonito no terminal (ex: Salvador (BA))
      const displayName = `${region.city.charAt(0).toUpperCase() + region.city.slice(1)} (${region.state.toUpperCase()})`;

      return {
        name: displayName,
        value: key,
      };
    });

    return await select({
      message: "Selecione a localidade da busca",
      choices: regionChoices,
    });
  },


  async askForConfirmation(): Promise<boolean> {
    return await confirm({
      message: "Confirmar escolhas? ",
      default: true,
    })

  },
}

