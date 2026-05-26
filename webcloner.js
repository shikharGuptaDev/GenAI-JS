import 'dotenv/config';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getWebsiteBriefByUrl(url = '') {
  const { data: html } = await axios.get(url, { responseType: 'text' });
  const $ = cheerio.load(html);

  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content') || '';
  const headings = $('h1, h2, h3')
    .slice(0, 12)
    .map((_, el) => $(el).text().trim())
    .get();

  return JSON.stringify({
    url,
    title,
    description,
    headings,
  });
}

const TOOL_MAP = {
  getWebsiteBriefByUrl,
};

async function main() {
  const SYSTEM_PROMPT = `
You are a website analysis assistant.

Rules:
- Do NOT copy or clone full websites.
- Do NOT reproduce proprietary text, images, logos, or exact styling.
- Only analyze high-level structure and generate an original starter layout.
- Output must be valid JSON in one of these steps:
  START, THINK, TOOL, OBSERVE, OUTPUT

Output JSON Format:
{ "step": "START | THINK | TOOL | OBSERVE | OUTPUT", "content": "string", "tool_name": "string", "input": "string" }

Goal:
1. Inspect the provided URL.
2. Summarize its structure.
3. Generate an original React or HTML/CSS/JS starter template inspired by the structure, not copied.
`;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: 'Analyze https://chaicode.com and generate a safe local starter layout.',
    },
  ];

  while (true) {
    const response = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      response_format: { type: 'json_object' },
      messages,
    });

    const rawContent = response.choices[0].message.content;
    const parsedContent = JSON.parse(rawContent);

    messages.push({
      role: 'assistant',
      content: JSON.stringify(parsedContent),
    });

    if (parsedContent.step === 'START') {
      console.log('🔥', parsedContent.content);
      continue;
    }

    if (parsedContent.step === 'THINK') {
      console.log('🧠', parsedContent.content);
      continue;
    }

    if (parsedContent.step === 'TOOL') {
      const toolToCall = parsedContent.tool_name;
      if (!TOOL_MAP[toolToCall]) {
        messages.push({
          role: 'developer',
          content: JSON.stringify({
            step: 'OBSERVE',
            content: `No such tool: ${toolToCall}`,
          }),
        });
        continue;
      }

      const responseFromTool = await TOOL_MAP[toolToCall](parsedContent.input);
      console.log(`🛠️ ${toolToCall}(${parsedContent.input}) =`, responseFromTool);

      messages.push({
        role: 'developer',
        content: JSON.stringify({
          step: 'OBSERVE',
          content: responseFromTool,
        }),
      });
      continue;
    }

    if (parsedContent.step === 'OUTPUT') {
      console.log('🤖', parsedContent.content);
      break;
    }
  }

  console.log('Done...');
}

main().catch(console.error);