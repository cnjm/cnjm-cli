#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import inquirer from 'inquirer';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import { promisify } from 'util';
import downloadGitRepo from 'download-git-repo';
import { github } from '../config.js';
const downloadAsync = promisify(downloadGitRepo);
const program = new Command();


program.usage('<project-name>').parse(process.argv);

const projectName = program.args[0] || 'cnjm-cli-project'; // 当前指令
// const rootName = path.basename(process.cwd()); // 获取当前进程的根目录名称

// 获取仓库列表
const getRepoList = async () => {
    const { data } = await axios.get(github.repos);
    const resultArr = data.map(item => {
        return {
            value: item.name,
            name: `${item.name}(${item.description})`,
        }
    });
    return resultArr;
};

// 下载仓库
const download = async (answers) => {
    let api = `${github.organizations}/${answers.cliTemplate}/`;
    // 下载到当前目录rootName
    // console.log(process.cwd(), rootName, answers.projectName)
    const dest = path.resolve(process.cwd(), answers.projectName);
    await downloadAsync(api, dest);
};

// 修改下载后项目的package.json 中的配置
const rewritePackage = answers => {
    return new Promise((resolve, reject) => {
        try {
            const file = path.resolve(process.cwd(), answers.projectName + '/package.json');
            let data = fs.readFileSync(file, 'utf-8');
            const dataObj = JSON.parse(data);
            dataObj.version = answers.projectVersion;
            dataObj.author = answers.projectAuthor;
            dataObj.name = answers.projectName;
            dataObj.description = answers.projectDescription;
            data = JSON.stringify(dataObj, null, 4);
            fs.writeFileSync(file, data, 'utf8');
            resolve();
        } catch (error) {
            reject(error);
        }
    })
};

// 开始请求仓库列表
const spinner = ora();
spinner.start();
console.log(chalk.gray('begin:Get Repo List'));
const list = await getRepoList();
spinner.succeed(chalk.green('success:Get Repo List'))

// 命令交互
inquirer.prompt([{
    type: 'list',
    name: 'cliTemplate',
    message: 'select project',
    pageSize: 10,
    choices: list,
}, {
    name: 'projectName',
    message: 'project-name',
    default: projectName
}, {
    name: 'projectAuthor',
    message: 'project-author',
    default: ""
}, {
    name: 'projectVersion',
    message: 'project-version',
    default: '0.0.1'
}, {
    name: 'projectDescription',
    message: 'project-description',
    default: 'No profile'
}]).then(async (answers) => {
    spinner.start();
    console.log(chalk.gray(`download:${answers.cliTemplate}`));
    await download(answers);
    await rewritePackage(answers);
    spinner.succeed(chalk.green(`success:${answers.cliTemplate}`))
    console.log(chalk.green(`
    Run project at dev:
    - 1: cd ${answers.projectName}
    - 2: npm/yarn install
    - 3: npm/yarn run start:dev
    `));
})