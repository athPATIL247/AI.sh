# AI.sh

AI.sh is a CLI tool that converts natural language into safe shell commands.

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

* Blocks critical system-level commands
* Warns on risky operations (like file deletion)
* Requires confirmation before execution

## Setup

```bash
npm install
npm link
```

Create a `.env` file:

```env
GROQ_API_KEY=your_api_key
```

## Structure

```
bin/        CLI entry
src/        core logic
  llm.js
  validator.js
  executor.js
  index.js
```

## Notes

This is a local CLI tool. Use carefully when executing destructive commands.
