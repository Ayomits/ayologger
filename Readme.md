
# ayologger

A customizable, extensible, and lightweight logging library for Node.js.

## Features

- **Customizable Themes**: Define colors for log levels, dates, and messages.
- **Template-Based Output**: Use templates to format logs.
- **Date Formatting**: Set custom date formats.
- **Log Levels**: Includes `info`, `warn`, `error`, `success`, and `debug`.
- **Base Color Support**: Apply a consistent base color to all non-template text.
- **Custom Log Level Names**: Personalize log level names for better readability.
- **Flexible Formatting**: Set custom date format and base color for logs.

> This module required ES6 Syntax in your project
> In package.json set "type": "module"

## Installation

To install the `ayologger` package, use either npm or yarn:

```bash
npm install ayologger
```

```bash
yarn add ayologger
```

## Usage

### Basic Usage

To use the logger, you can import it into your project and use different log levels:

```typescript
import { Logger } from "ayologger";

const logger = new Logger();

logger.info("Hello, World!");
logger.warn("This is a warning.");
logger.error("An error occurred.");
logger.success("Operation successful!");
logger.debug("Debugging information.");
```

Each method corresponds to a specific log level (`info`, `warn`, `error`, `success`, `debug`). Logs are printed in the console with appropriate color formatting for each level.

## Themes

### Custom Themes

You can customize the appearance of each log level (e.g., changing colors for the log level, message, or date). Below is a detailed example of how to apply a custom theme to different log levels.

```typescript
const logger = new Logger({
    global: {
        // Global settings for log level and message formatting
        level: { text: "#ffffff", background: "#0000ff" },  // White text on blue background for the log level
        date: { text: "#ff0000" },  // Red text for the date
    },
    theme: {
        // Custom theme for each log level
        info: {
            level: { background: "#00ff00" },  // Green background for info level
            message: { text: "#ffffff" },  // White text for the message
            date: { text: "#00ff00" },  // Green text for the date
        },
        warn: {
            level: { background: "#ffff00" },  // Yellow background for warn level
            message: { text: "#000000" },  // Black text for the message
            date: { text: "#ff9900" },  // Orange text for the date
        },
        error: {
            level: { text: "#ff0000", background: "#000000" },  // Red text on black background for error level
            message: { text: "#ffffff" },  // White text for the message
            date: { text: "#ff3300" },  // Light red text for the date
        },
        success: {
            level: { background: "#00cc00" },  // Green background for success level
            message: { text: "#ffffff" },  // White text for the message
            date: { text: "#009900" },  // Dark green text for the date
        },
        debug: {
            level: { background: "#800080" },  // Purple background for debug level
            message: { text: "#ffffff" },  // White text for the message
            date: { text: "#ff00ff" },  // Magenta text for the date
        },
    },
    formatting: {
        // Custom date format and base color for all logs
        dateFormat: "YYYY-MM-DD HH:mm:ss",  // Custom date format (year-month-day hour:minute:second)
        baseColor: "#cccccc",  // Base color for all logs (light gray)
    },
});

// Test logs with the custom theme
logger.info("Custom theme applied!");
logger.warn("Warning with custom theme.");
logger.error("Error with custom theme.");
logger.success("Success with custom theme!");
logger.debug("Debugging with custom theme.");
```

### Custom Log Level Names

You can also change the names of the log levels, providing more descriptive names for logs. For example, you could rename `info` to `notice`, `warn` to `alert`, etc.

```typescript
const logger = new Logger({
    logNames: {
        info: "notice",  // Rename info to notice
        warn: "alert",   // Rename warn to alert
        error: "failure",  // Rename error to failure
        success: "achievement",  // Rename success to achievement
        debug: "trace",   // Rename debug to trace
    },
});

logger.info("This is a notice level log.");
logger.warn("This is an alert level log.");
logger.error("This is a failure level log.");
logger.success("This is an achievement level log.");
logger.debug("This is a trace level log.");
```

### Full Configuration Example

Here is an example of a complete configuration for the `Logger` class, with a custom theme, custom date format, base color, and custom log level names:

```typescript
const logger = new Logger({
    global: {
        level: { text: "#ffffff", background: "#0000ff" },
        date: { text: "#ff0000" },
    },
    theme: {
        info: {
            level: { background: "#00ff00" },
            message: { text: "#ffffff" },
            date: { text: "#00ff00" },
        },
        warn: {
            level: { background: "#ffff00" },
            message: { text: "#000000" },
            date: { text: "#ff9900" },
        },
        error: {
            level: { text: "#ff0000", background: "#000000" },
            message: { text: "#ffffff" },
            date: { text: "#ff3300" },
        },
        success: {
            level: { background: "#00cc00" },
            message: { text: "#ffffff" },
            date: { text: "#009900" },
        },
        debug: {
            level: { background: "#800080" },
            message: { text: "#ffffff" },
            date: { text: "#ff00ff" },
        },
    },
    formatting: {
        dateFormat: "YYYY-MM-DD HH:mm:ss",
        baseColor: "#cccccc",
    },
    logNames: {
        info: "notice",
        warn: "alert",
        error: "failure",
        success: "achievement",
        debug: "trace",
    },
});

logger.info("Custom notice log.");
logger.warn("Custom alert log.");
logger.error("Custom failure log.");
logger.success("Custom achievement log.");
logger.debug("Custom trace log.");
```

## Custom Templates
Variables:
`level` - using for display log level
`date` - using for display when this log was printed
`message` - using for display content from function parametr

Example:
```ts
const logger = new Logger({
    templates: {
        info: () => `{date} {level} with {message}`
    }
})
logger.info("Hello my custom template!")
```

## Conclusion

`ayologger` provides a powerful and flexible logging system for Node.js. With customizable themes, templates, and formatting, you can make your log output as unique as your application. Whether you need simple log messages or complex structured output, `ayologger` can be tailored to meet your needs.
