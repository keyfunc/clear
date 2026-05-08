/**
 * @description 模版配置
 */

import chalk from "chalk";
import tiged from "tiged";

// 仓库模版前缀
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
        throw new Error(`无法获取远程模版配置: ${getErrorMessage(error)}`);
    }

    if (!response.ok) {
        throw new Error(`无法获取远程模版配置: ${response.status} ${response.statusText}`);
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
        throw new Error("远程模版配置格式错误: templates.json 必须是数组");
    }

    return data.map((item, index) => {
        if (!isTemplate(item)) {
            throw new Error(`远程模版配置格式错误: 第 ${index + 1} 项不合法`);
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
 * @description 从github拉取模板
 * @param templateName 模版名称
 * @param targetDir 目标路径
 * @param options 拉取配置
 */
export const pullTemplate = async (
    templateName: string,
    targetDir: string,
    options: PullTemplateOptions,
): Promise<void> => {
    const repoPath = options.templates.find((item) => item.name === templateName)?.repoPath;
    if (!repoPath) {
        throw new Error(`模板 ${templateName} 不存在`);
    }

    console.log(`${chalk.dim("模板来源")} ${chalk.cyan(repoPath)}`);
    console.log(chalk.dim("正在下载模板文件..."));

    const emitter = tiged(repoPath, {
        disableCache: true,
        force: options.force ?? false,
        verbose: false,
    });

    try {
        await emitter.clone(targetDir);
        console.log(chalk.green("模板下载完成"));
    } catch (error: unknown) {
        console.error(chalk.red(`模板下载失败: ${getErrorMessage(error)}`));
        throw error;
    }
};

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
