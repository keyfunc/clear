/**
 * @description Template configuration
 */

import chalk from "chalk";
import tiged from "tiged";

// Template repository prefix.
const prefix = "keyfunc/template";
const templatesUrl = `https://raw.githubusercontent.com/${prefix}/master/templates.json`;

export interface Template {
    name: string;
    description: string;
    repoPath: string;
}

interface PullTemplateOptions {
    force?: boolean;
    templates: Template[];
}

export const getTemplates = async (): Promise<Template[]> => {
    let response: Response;

    try {
        response = await fetch(templatesUrl);
    } catch (error) {
        throw new Error(`Failed to load templates: ${getErrorMessage(error)}`);
    }

    if (!response.ok) {
        throw new Error(`Failed to load templates: ${response.status} ${response.statusText}`);
    }

    const data: unknown = await response.json();
    return validateTemplates(data).map((template) => {
        return {
            ...template,
            repoPath: normalizeRepoPath(template.repoPath),
        };
    });
};

export const getChoicesList = (templates: Template[]) => {
    return templates.map((item) => {
        return {
            title: chalk.cyan(item.name),
            description: chalk.dim(item.description),
            value: item.name,
        };
    });
};

const validateTemplates = (data: unknown): Template[] => {
    if (!Array.isArray(data)) {
        throw new Error("Invalid templates.json: expected an array");
    }

    return data.map((item, index) => {
        if (!isTemplate(item)) {
            throw new Error(`Invalid templates.json: item ${index + 1} is invalid`);
        }

        return item;
    });
};

const isTemplate = (item: unknown): item is Template => {
    if (!item || typeof item !== "object") {
        return false;
    }

    const template = item as Record<string, unknown>;
    return (
        typeof template.name === "string" &&
        typeof template.description === "string" &&
        typeof template.repoPath === "string"
    );
};

const normalizeRepoPath = (repoPath: string): string => {
    if (repoPath.startsWith(`${prefix}/`)) {
        return repoPath;
    }

    return `${prefix}/${repoPath.replace(/^\/+/, "")}`;
};

/**
 * @description Pull a template from GitHub
 * @param templateName Template name
 * @param targetDir Target path
 * @param options Pull options
 */
export const pullTemplate = async (
    templateName: string,
    targetDir: string,
    options: PullTemplateOptions,
): Promise<void> => {
    const repoPath = options.templates.find((item) => item.name === templateName)?.repoPath;
    if (!repoPath) {
        throw new Error(`Unknown template: ${templateName}`);
    }

    console.log(`${chalk.dim("Source")} ${chalk.cyan(repoPath)}`);
    console.log(chalk.dim("Downloading..."));

    const emitter = tiged(repoPath, {
        disableCache: true,
        force: options.force ?? false,
        verbose: false,
    });

    try {
        await emitter.clone(targetDir);
        console.log(chalk.green("Downloaded"));
    } catch (error: unknown) {
        console.error(chalk.red(`Download failed: ${getErrorMessage(error)}`));
        throw error;
    }
};

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
