import OpenAI from "openai";
import { execSync } from 'node:child_process';

const client = new OpenAI({
  apiKey: "YOUR_API_KEY",
  baseURL: "https://openrouter.ai/api/v1",
});

const SYSTEM_PROMPT = `You are an expert AI assistant that controls the user's machine.
You MUST respond ONLY with a raw JSON object, no markdown, no backticks, no explanation.
Use this exact format:
{"type":"tool_call","tool_call":{"tool_name":"executeCommand","params":["the shell command"]}}
OR if no command is needed:
{"type":"text","text_content":"your response here"}`;

function executeCommand(cmd = '') {
  const result = execSync(cmd, { encoding: 'utf8' });
  return result.toString();
}

export async function run(query = "") {
  const result = await client.chat.completions.create({
    model: "stepfun/step-3.5-flash:free",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
  });

  const raw = result.choices[0].message.content.trim();
  console.log("Raw response:", raw);

  // Robustly extract JSON from anywhere in the response
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response: " + raw);
  
  const parsed = JSON.parse(jsonMatch[0]);
  console.log("Agent Says:", JSON.stringify(parsed, null, 2));

  if (parsed.type === 'tool_call' && parsed.tool_call?.tool_name === 'executeCommand') {
    const output = executeCommand(parsed.tool_call.params[0]);
    console.log('Command output:', output);
    return { parsed, commandOutput: output };
  }

  return parsed;
}