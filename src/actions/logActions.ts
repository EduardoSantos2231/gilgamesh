import type { Modalitie, Platform } from "@/types/imports.js";
import chalk from "chalk";


export function displayWelcome() {
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

export function displayOptions(platforms: Platform[], modalities: Modalitie[]) {
  console.log(`\n${chalk.cyan.bold('➔ Configuração da Busca:')}`);

  console.log(`${chalk.gray('Plataformas:')} ${chalk.green(platforms.join(', ').toUpperCase())}`);

  const modText = modalities.length > 0 ? modalities.join(', ') : 'Todas';
  console.log(`${chalk.gray('Modalidades:')} ${chalk.magenta(modText)}`);

  console.log(`\n${chalk.yellow('ℹ')} ${chalk.italic('Iniciando motores de busca do Gilgamesh...')}\n`);
}


