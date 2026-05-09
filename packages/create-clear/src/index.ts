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
        console.log(chalk.dim("Loading templates..."));
        const templates = await getTemplates();
        console.log(
            chalk.green(
                `Loaded ${templates.length} template${templates.length === 1 ? "" : "s"}`,
            ),
        );
        console.log();

        const response = await prompts(
            [
                {
                    type: "text",
                    name: "projectName",
                    message: "Project name",
                    validate: validateProjectName,
                },
                {
                    type: "select",
                    name: "template",
                    message: "Template",
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
                    message: `Directory "${projectName}" exists. Overwrite?`,
                    initial: false,
                },
                { onCancel },
            );

            if (!overwrite) {
                console.log(chalk.yellow("Cancelled."));
                return;
            }

            force = true;
        }

        console.log();
        console.log(`${chalk.dim("Target")} ${chalk.cyan(targetDir)}`);
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
    console.log(chalk.dim("Frontend, backend, and DevOps templates"));
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
        return "Enter a project name";
    }

    return validPackageName(projectName) || "Invalid project name";
}

function onCancel() {
    console.log();
    console.log(chalk.yellow("Cancelled."));
    process.exit(0);
}

function printNextSteps(projectName: string) {
    console.log();
    console.log(chalk.green("Done"));
    console.log(chalk.dim("Next steps:"));
    console.log();
    console.log(`  ${chalk.cyan(`cd ${projectName}`)}`);
    console.log();
}

init().catch((error) => {
    console.error(chalk.red(error instanceof Error ? error.message : String(error)));
    process.exitCode = 1;
});
