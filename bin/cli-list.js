#!/usr/bin/env node

import { Command } from 'commander';
const program = new Command();
import axios from 'axios';
import path from 'path';
import inquirer from 'inquirer';

program.usage('<project-name>').parse(process.argv);

// 获取项目列表
const getRepoList = async () => {
    const { data } = await axios.get('https://gitee.com/organizations/cnjm-cli-tempalte/projects');
    console.log(data)
    const resultArr = data.map(item => {
        return item.name;
    });
    return resultArr;
};
console.log(getRepoList())