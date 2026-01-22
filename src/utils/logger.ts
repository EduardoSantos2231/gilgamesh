import chalk from "chalk";

export const logger = {
  success: (msg: string) => {
    console.log(`${chalk.green.bold('✔')} ${chalk.white(msg)}`);
  },

  error: (msg: string) => {
    console.log(`\n${chalk.bgRed.white.bold(' ERROR ')} ${chalk.red(msg)}`);
  },

  warn: (msg: string) => {
    console.log(`${chalk.yellow.bold('⚠')} ${chalk.yellow(msg)}`);
  },

  info: (msg: string) => {
    console.log(`${chalk.blue.bold('ℹ')} ${chalk.blue(msg)}`);
  }
};

