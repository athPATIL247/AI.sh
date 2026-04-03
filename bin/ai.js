#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { getCommand } from "../src/llm.js";
import { askConfirmation, runCommand } from "../src/executor.js";

const program = new Command();

program
  .name("ai")
  .description("AI-powered shell assistant")
  .argument("<query>", "What you want to do")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(async (query, options) => {
    const result = await getCommand(query);

    let coloredCommand;
    if (result.risk_level === "danger") {
      coloredCommand = chalk.red(result.command);
    } else if (result.risk_level === "warning") {
      coloredCommand = chalk.yellow(result.command);
    } else {
      coloredCommand = chalk.green(result.command);
    }

    console.log(coloredCommand);

    let confirm = true;

    if (!options.yes || result.risk_level === "danger") {
      confirm = await askConfirmation("Run this? (y/n) ");
    }

    if (!confirm) {
      console.log(chalk.blue("Command execution cancelled."));
      return;
    }

    try {
      const output = await runCommand(result.command);
      console.log(output);
    } catch (error) {
      console.error(chalk.red("Error: "));
      console.error(chalk.red(error.message));
    }
  });

program.parse();