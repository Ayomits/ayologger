import { Chalk } from "chalk";
import moment from "moment";
import { TemplateResolver } from "./Templates";

// Interface defining logger methods
export interface ILogger {
    info: (...content: unknown[]) => void;
    warn: (...content: unknown[]) => void;
    success: (...content: unknown[]) => void;
    error: (...content: unknown[]) => void;
    debug: (...content: unknown[]) => void;
}

// Interface defining the color scheme for logger themes
export interface ILoggerThemeColor {
    text?: string; // Text color
    background?: string | null; // Background color
}

// Interface for theming different parts of the log output
export interface ILoggerTheme {
    message?: ILoggerThemeColor; // Theme for the log message
    level?: ILoggerThemeColor; // Theme for the log level
    date?: ILoggerThemeColor; // Theme for the timestamp
}

// Type for defining logger templates
export type TLoggerTemplate = () => string;

// Interface for logger options, including global theme, specific themes, and formatting
export interface ILoggerOptions {
    global?: ILoggerTheme; // Global theme applied to all logs
    theme?: Partial<Record<TLogLevel, ILoggerTheme>>; // Per-log-level themes
    formatting?: {
        dateFormat?: string; // Custom date format
    };
    templates?: Partial<Record<TLogLevel, TLoggerTemplate>>; // Custom templates for log messages
}

// Enum for log level types
export enum LogLevelType {
    INFO = "INFO",
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    WARN = "WARN",
    DEBUG = "DEBUG",
}

// Type for log levels as string keys
export type TLogLevel = "info" | "success" | "error" | "warn" | "debug";

// Default constants for logger colors and templates
export enum DefaultOptionConstants {
    FUNCTION_CLASS_NAMES = "#a3cdff",
    TEXT_COLOR = "#e9eef7",
    DATE_COLOR = "#ff9d5c",
    INFO_BACKGROUND = "#72a1f7",
    WARN_BACKGROUND = "#ffeb8a",
    ERROR_BACKGROUND = "#ff2e3f",
    SUCCESS_BACKGROUND = "#68fc68",
    DEBUG_BACKGROUND = "#ff8cf2",
    BASE_TEMPLATE = "{level}  | {date} | {message}",
}

// Main Logger class implementing the ILogger interface
export class Logger implements ILogger {
    private options: ILoggerOptions; // Logger configuration options

    constructor(options?: ILoggerOptions) {
        this.options = { ...this.defaultSettings(), ...options }; // Merge default settings with custom options
    }

    // Define default logger settings
    private defaultSettings(): ILoggerOptions {
        return {
            global: {
                level: { text: DefaultOptionConstants.TEXT_COLOR },
                message: { text: DefaultOptionConstants.TEXT_COLOR },
                date: { text: DefaultOptionConstants.TEXT_COLOR },
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
            templates: {
                info: () => DefaultOptionConstants.BASE_TEMPLATE,
                warn: () => DefaultOptionConstants.BASE_TEMPLATE,
                debug: () => DefaultOptionConstants.BASE_TEMPLATE,
                success: () => DefaultOptionConstants.BASE_TEMPLATE,
                error: () => DefaultOptionConstants.BASE_TEMPLATE,
            },
        };
    }

    // Generic method for handling log output
    private universalLog(level: LogLevelType, ...content: unknown[]): void {
        const { theme, global, templates } = this.options;

        // Get the theme for the current log level
        const themeSet =
            theme?.[level.toLowerCase() as keyof ILoggerOptions["theme"]] ||
            ({} as any);

        // Apply themes to log components
        const logLevel = this.applyTheme(
            themeSet.level,
            global?.level
        )(` ${level} `);
        const logDate = this.applyTheme(
            themeSet.date,
            global?.date
        )(this.getDate());
        const logMessage = this.applyTheme(
            themeSet.message,
            global?.message
        )(content.join(" "));

        // Resolve the template for the log message
        const templateFunc = templates?.[
            level.toLowerCase() as keyof ILoggerOptions["templates"]
        ] as unknown as TLoggerTemplate;
        const templateStr = templateFunc
            ? templateFunc()
            : DefaultOptionConstants.BASE_TEMPLATE;

        // Output the log message to the console
        console.log(
            TemplateResolver.resolveTempalate(templateStr, {
                level: logLevel,
                date: logDate,
                message: logMessage,
            })
        );
    }

    // Apply theming for text and background colors
    private applyTheme(
        local: ILoggerThemeColor = {},
        global: ILoggerThemeColor = {}
    ) {
        const { text, background } = { ...global, ...local };
        let styled = new Chalk({ level: 3 }); // Initialize Chalk with support for colors
        if (text) {
            styled = styled.hex(text.toUpperCase());
        }
        if (background) {
            styled = styled.bgHex(background);
        }
        return styled;
    }

    // Get the current date in the specified format
    private getDate(): string {
        const format =
            this.options.formatting?.dateFormat || "D MMM YYYY HH:mm:ss";
        return moment().format(format);
    }

    // Specific log methods for different log levels
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
