import { checkbox, confirm, select } from "@inquirer/prompts";
import { type Platform, type Modalitie, type RegionKey, } from "@/types/imports.js";
import { SUPPORTED_REGIONS } from "@/constants/supportedRegions.js";
import chalk from "chalk";

interface Questions {
  askForPlatform(): Promise<Platform[]>
  askForModalitie(): Promise<Modalitie[]>
  askForConfirmation(): Promise<boolean>
  askLocation(): Promise<RegionKey>
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

      ],
      required: true
    })

  }
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
  }


  async askForConfirmation(): Promise<boolean> {
    return await confirm({
      message: "Confirmar escolhas? ",
      default: true,
    })
  }


  displayWelcome() {
    const line = chalk.blue('─'.repeat(50));
    const star = chalk.yellow('★');

    console.log('\n' + line);
    console.log(
      chalk.bold.bgBlue('  GILGAMESH  ') +
      chalk.blue(' - O Buscador de Oportunidades')
    );
    console.log(line);

    console.log(
      `🚀 ${chalk.cyan('Obrigado por utilizar este script!')}\n` +
      `Espero que ele facilite sua busca por estágios.`
    );

    console.log(
      `\n${star}  ${chalk.bold('Gostou do projeto?')} ` +
      `Dê uma estrela no GitHub:\n ${chalk.underline.yellow('https://github.com/EduardoSantos2231/gilgamesh')}`
    );
    console.log(line + '\n');
  }

  displayOptions(platforms: Platform[], modalities: Modalitie[]) {
    console.log(`\n${chalk.cyan.bold('➔ Configuração da Busca:')}`);

    console.log(`${chalk.gray('Plataformas:')} ${chalk.green(platforms.join(', ').toUpperCase())}`);

    const modText = modalities.length > 0 ? modalities.join(', ') : 'Todas';
    console.log(`${chalk.gray('Modalidades:')} ${chalk.magenta(modText)}`);

    console.log(`\n${chalk.yellow('ℹ')} ${chalk.italic('Iniciando motores de busca do Gilgamesh...')}\n`);
  }

}

