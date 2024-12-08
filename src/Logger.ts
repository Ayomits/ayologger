import chalk from "chalk";
import moment from "moment";
import { TemplateResolver } from "Templates";

/**
 * Interface for the Logger class methods.
 */
export interface ILogger {
    info: (...content: unknown[]) => void;
    warn: (...content: unknown[]) => void;
    success: (...content: unknown[]) => void;
    error: (...content: unknown[]) => void;
    debug: (...content: unknown[]) => void;
}

/**
 * Represents color configuration for individual log parts.
 */
export interface ILoggerThemeColor {
    text?: string;
    background?: string | null;
}

/**
 * Defines the theme configuration for different log components.
 */
export interface ILoggerTheme {
    message?: ILoggerThemeColor;
    level?: ILoggerThemeColor;
    date?: ILoggerThemeColor;
}

/**
 * Logger template function type.
 */
export type TLoggerTemplate = () => string;

/**
 * Logger configuration options.
 */
export interface ILoggerOptions {
    global?: ILoggerTheme;
    theme?: Partial<Record<TLogLevel, ILoggerTheme>>;
    formatting?: {
        dateFormat?: string;
        baseColor?: string; // New option for base text color
    };
    templates?: Partial<Record<TLogLevel, TLoggerTemplate>>;
    logNames?: Partial<Record<TLogLevel, string>>;
}

/**
 * Enum for log levels.
 */
export enum LogLevelType {
    INFO = "INFO",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    WARN = "WARN",
    DEBUG = "DEBUG",
}

/**
 * Log level type as a string.
 */
export type TLogLevel = "info" | "success" | "error" | "warn" | "debug";

/**
 * Default constant values for logger configuration.
 */
export enum DefaultOptionConstants {
    FUNCTION_CLASS_NAMES = "#a3cdff",
    TEXT_COLOR = "#e9eef7",
    MESSAGE_COLOR = "#83ff75",
    DATE_COLOR = "#ff9d5c",
    INFO_BACKGROUND = "#72a1f7",
    WARN_BACKGROUND = "#ffeb8a",
    ERROR_BACKGROUND = "#ff2e3f",
    SUCCESS_BACKGROUND = "#68fc68",
    DEBUG_BACKGROUND = "#ff8cf2",
    BASE_TEMPLATE = "{level} | {date} | {message}",
}

/**
 * Logger implementation with customizable templates, colors, and formats.
 */
export class Logger implements ILogger {
    private options: ILoggerOptions;

    /**
     * Constructs a Logger instance with optional configuration.
     * @param options Configuration options for the Logger.
     */
    constructor(options?: ILoggerOptions) {
        this.options = { ...this.defaultSettings(), ...options };
    }

    /**
     * Returns default logger settings.
     * @returns Default ILoggerOptions object.
     */
    private defaultSettings(): ILoggerOptions {
        return {
            global: {
                level: { text: DefaultOptionConstants.TEXT_COLOR },
                message: { text: DefaultOptionConstants.MESSAGE_COLOR },
                date: { text: DefaultOptionConstants.DATE_COLOR },
            },
            theme: {
                info: {
                    level: {
                        background: DefaultOptionConstants.INFO_BACKGROUND,
                    },
                },
                warn: {
                    level: {
                        background: DefaultOptionConstants.WARN_BACKGROUND,
                    },
                },
                error: {
                    level: {
                        background: DefaultOptionConstants.ERROR_BACKGROUND,
                    },
                },
                success: {
                    level: {
                        background: DefaultOptionConstants.SUCCESS_BACKGROUND,
                    },
                },
                debug: {
                    level: {
                        background: DefaultOptionConstants.DEBUG_BACKGROUND,
                    },
                },
            },
            formatting: {
                dateFormat: "D MMM YYYY HH:mm:ss",
                baseColor: DefaultOptionConstants.TEXT_COLOR,
            },
            templates: {
                info: () => DefaultOptionConstants.BASE_TEMPLATE,
                warn: () => DefaultOptionConstants.BASE_TEMPLATE,
                debug: () => DefaultOptionConstants.BASE_TEMPLATE,
                success: () => DefaultOptionConstants.BASE_TEMPLATE,
                error: () => DefaultOptionConstants.BASE_TEMPLATE,
            },
        };
    }

    /**
     * Universal log function for all log levels.
     * @param level The log level.
     * @param content The log content.
     */
    private universalLog(level: LogLevelType | TLogLevel, ...content: unknown[]): void {
        const { theme, global, templates, formatting } = this.options;

        const themeSet =
            theme?.[level.toLowerCase() as keyof ILoggerOptions["theme"]] ||
            ({} as ILoggerTheme);

        const logLevel = this.applyTheme(
            themeSet.level,
            global?.level
        )(
            ` ${
                this.options.logNames?.[
                    level as keyof ILoggerOptions["logNames"]
                ] || level
            } `
        );
        const logDate = this.applyTheme(
            themeSet.date,
            global?.date
        )(this.getDate());
        const logMessage = this.applyTheme(
            themeSet.message,
            global?.message
        )(content.join(" "));

        const templateFunc = templates?.[
            level.toLowerCase() as keyof ILoggerOptions["templates"]
        ] as unknown as TLoggerTemplate;
        const templateStr = templateFunc
            ? templateFunc()
            : DefaultOptionConstants.BASE_TEMPLATE;

        const baseColor =
            formatting?.baseColor || DefaultOptionConstants.TEXT_COLOR;
        const coloredTemplate = chalk.hex(baseColor.toUpperCase())(templateStr);

        console.log(
            TemplateResolver.resolveTempalate(coloredTemplate, {
                level: logLevel,
                date: logDate,
                message: logMessage,
            })
        );
    }

    /**
     * Applies theme styles to log parts.
     * @param local Local theme configuration.
     * @param global Global theme configuration.
     * @returns A styled Chalk instance.
     */
    private applyTheme(
        local: ILoggerThemeColor = {},
        global: ILoggerThemeColor = {}
    ) {
        let styled = chalk;
        const { text, background } = { ...global, ...local };
        if (background) styled = styled.bgHex(background.toUpperCase());
        if (text) styled = styled.hex(text.toUpperCase());

        return styled;
    }

    /**
     * Returns the current date in the configured format.
     * @returns Formatted date string.
     */
    private getDate(): string {
        const format =
            this.options.formatting?.dateFormat || "D MMM YYYY HH:mm:ss";
        return moment().format(format);
    }

    info(...content: unknown[]): void {
        this.universalLog(LogLevelType.INFO, ...content);
    }

    warn(...content: unknown[]): void {
        this.universalLog(LogLevelType.WARN, ...content);
    }

    success(...content: unknown[]): void {
        this.universalLog(LogLevelType.SUCCESS, ...content);
    }

    debug(...content: unknown[]): void {
        this.universalLog(LogLevelType.DEBUG, ...content);
    }

    error(...content: unknown[]): void {
        this.universalLog(LogLevelType.ERROR, ...content);
    }
}
