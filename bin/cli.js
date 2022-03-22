#! /usr/bin/env node

import fs from 'fs';
import chalk from 'chalk';
import { Command } from 'commander';
const program = new Command();
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))

// const chalk = require('chalk');

console.log(chalk.green("Welcome to use CNJM CLI"));

program.version(packageJson.version).usage('<command> [project name]');

program.command('create', 'create a defau project')
    .option('-a, --agenda', 'print human-readable agenda');
program.command('list', 'see template list');

program.parse(process.argv);