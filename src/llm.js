import Groq from "groq-sdk";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');
for (const line of envLines) {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
        process.env[key.trim()] = valueParts.join('=').trim();
    }
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function getCommand(query){
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: `You are a Linux shell expert. Convert user instructions into a single shell command and assess its risk level.

Output ONLY a JSON object with exactly these fields:
- command: the shell command (string)
- risk_level: "safe", "warning", or "danger" (string)

Do not output any other text, explanations, code blocks, or notes. Just the raw JSON.`,
            },
            {
                role: "user",
                content: query,
            },
        ],
    });

    const content = response.choices[0].message.content.trim();
    // Remove markdown code blocks if present
    let jsonString = content;
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    try {
        const result = JSON.parse(jsonString);
        return result;
    } catch (e) {
        // Fallback: assume safe if parsing fails
        return {
            command: content,
            risk_level: "safe",
            reason: "Unable to assess risk"
        };
    }
}