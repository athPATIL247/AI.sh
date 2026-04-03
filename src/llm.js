import Groq from "groq-sdk";
import 'dotenv/config';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function getCommand(query) {
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: `You are a shell command generator. Your ONLY output must be a single raw JSON object. No markdown, no code blocks, no backticks, no explanations, no extra text — just the JSON.

The JSON must have exactly these two fields:
- "command": the shell command as a string
- "risk_level": one of "safe", "warning", or "danger"

Example output:
{"command":"ls -lh","risk_level":"safe"}`,
            },
            {
                role: "user",
                content: query,
            },
        ],
    });

    const content = response.choices[0].message.content.trim();

    // Strip markdown code blocks if model misbehaves
    let jsonString = content;
    if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
    }

    // Extract first JSON object if there's extra text
    const match = jsonString.match(/\{[\s\S]*?\}/);
    if (match) {
        jsonString = match[0];
    }

    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return {
            command: content,
            risk_level: "safe",
        };
    }
}