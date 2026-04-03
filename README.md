# AI.sh

AI.sh is a CLI tool that converts natural language into safe shell commands, powered by Groq LLM.

## Install

```bash
npm install -g @atharvaspatil5/aish
```

## Setup

Get a free API key at [console.groq.com](https://console.groq.com), then create a `.env` file in your working directory:

```env
GROQ_API_KEY=your_groq_api_key
```

## Usage

```bash
ai "list files"
ai "delete node_modules"
ai "find files larger than 100MB"
```

## Options

```bash
-y, --yes    skip confirmation prompt
```

## How it works

1. Takes user input from CLI
2. Sends it to Groq (LLM)
3. Converts it into a shell command
4. Validates the command for safety
5. Asks for confirmation (optional)
6. Executes the command

## Example

```bash
ai "list all files"
# → ls

ai "delete everything"
# → rm -i *
```

## Safety

* Warns on risky operations (like file deletion)
* Requires confirmation before execution
* Dangerous commands always prompt, even with `-y`

## Structure

```
bin/        CLI entry
src/        core logic
  llm.js
  executor.js
  index.js
```

## Notes

Use carefully when executing destructive commands. The `.env` file must be present in the directory where you run `ai`.