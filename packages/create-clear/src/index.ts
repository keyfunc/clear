#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import chalk from "chalk";
import prompts from "prompts";
import { getChoicesList, getTemplates, pullTemplate } from "./template";

async function init() {
    try {
        printIntro();
        console.log(chalk.dim("正在读取远程模板配置..."));
        const templates = await getTemplates();
        console.log(chalk.green(`已加载 ${templates.length} 个模板`));
        console.log();

        const response = await prompts(
            [
                {
                    type: "text",
                    name: "projectName",
                    message: "项目名称",
                    validate: validateProjectName,
                },
                {
                    type: "select",
                    name: "template",
                    message: "选择项目模板",
                    choices: getChoicesList(templates),
                    initial: 0,
                },
            ],
            { onCancel },
        );

        const projectName = response.projectName?.trim();
        const template = response.template;

        if (!projectName || !template) {
            return;
        }

        const targetDir = path.resolve(process.cwd(), projectName);
        let force = false;

        if (existsSync(targetDir)) {
            const { overwrite } = await prompts(
                {
                    type: "confirm",
                    name: "overwrite",
                    message: `目录 "${projectName}" 已存在，是否覆盖？`,
                    initial: false,
                },
                { onCancel },
            );

            if (!overwrite) {
                console.log(chalk.yellow("已取消创建。"));
                return;
            }

            force = true;
        }

        console.log();
        console.log(`${chalk.dim("目标目录")} ${chalk.cyan(targetDir)}`);
        await pullTemplate(template, targetDir, { force, templates });
        printNextSteps(projectName);
    } catch (error) {
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exitCode = 1;
    }
}

function printIntro() {
    console.log();
    console.log(chalk.bold.cyan("create-clear"));
    console.log(chalk.dim("快速创建前端/后端项目模板"));
    console.log();
}

function validPackageName(projectName: string): boolean {
    return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
        projectName,
    );
}

function validateProjectName(input: string): true | string {
    const projectName = String(input).trim();

    if (!projectName) {
        return "请输入项目名称";
    }

    return validPackageName(projectName) || "项目名称格式不合法";
}

function onCancel() {
    console.log();
    console.log(chalk.yellow("已取消创建。"));
    process.exit(0);
}

function printNextSteps(projectName: string) {
    console.log();
    console.log(chalk.green("创建完成"));
    console.log(chalk.dim("接下来可以执行："));
    console.log();
    console.log(`  ${chalk.cyan(`cd ${projectName}`)}`);
    console.log(`  ${chalk.cyan("pnpm install")}`);
    console.log(`  ${chalk.cyan("pnpm dev")}`);
    console.log();
}

init().catch((error) => {
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
});
