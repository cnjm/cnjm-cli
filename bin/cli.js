#! /usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";

const program = new Command();

// const chalk = require('chalk');

console.log(chalk.green("Welcome to use CNJM CLI"));

program.version("1.1.0").usage("<command> [project name]");

program
  .command("create", "create a defau project")
  .option("-a, --agenda", "print human-readable agenda");
program.command("list", "see template list");

program.parse(process.argv);
