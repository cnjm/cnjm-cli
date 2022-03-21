#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import inquirer from 'inquirer';
const program = new Command();


program.usage('<project-name>').parse(process.argv);

const projectName = program.args[0];
const rootName = path.basename(process.cwd()); // 获取当前进程的根目录名称
console.log(projectName, rootName, program.opts());

// 命令交互
inquirer.prompt([{
    name: 'projectName',
    message: 'project-name',
    default: projectName
}, {
    name: 'projectVersion',
    message: 'project-version',
    default: '0.0.1'
}, {
    name: 'projectDescription',
    message: 'project-description',
    default: 'No profile'
}]).then(answers => {
    console.log(answers);
})