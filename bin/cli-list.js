#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();
import axios from 'axios';
import ora from 'ora';
import chalk from 'chalk';
import { github } from '../config.js';


program.usage('<project-name>').parse(process.argv);

// 获取项目列表
export const getRepoList = async () => {
    const { data } = await axios.get(github.repos);
    const resultArr = data.map(item => {
        return {
            value: item.name,
            name: `${item.name}(${item.description})`,
            description: item.description
        }
    });
    return resultArr;
};
const spinner = ora();
spinner.start();
console.log(chalk.gray('begin:Get Repo List'));
const list = await getRepoList();
let listStr = `[`;
list.forEach(element => {
    listStr += `
    {
        value:${element.value},
        description:${element.description},
    },`
});
listStr += `
]`;
spinner.succeed(chalk.green('success:Get Repo List'));
console.log(chalk.green(listStr));