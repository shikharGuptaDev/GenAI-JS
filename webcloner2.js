import 'dotenv/config';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

import fs from 'fs';
import path from 'path';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getWebsiteBriefByUrl(url = '') {
  const { data: html } = await axios.get(url);

  const $ = cheerio.load(html);

  const title = $('title').text().trim();

  const headings = $('h1,h2,h3')
    .slice(0, 10)
    .map((i, el) => $(el).text().trim())
    .get();

  return {
    title,
    headings,
  };
}

async function generateWebsiteCode(websiteInfo) {

  const prompt = `
Generate a modern ORIGINAL website starter.

Website Title:
${websiteInfo.title}

Headings:
${websiteInfo.headings.join('\n')}

Requirements:
- Create index.html
- Create style.css
- Create script.js
- Modern responsive UI
- Original design
- Return JSON only

Format:
{
  "indexHtml": "...",
  "styleCss": "...",
  "scriptJs": "..."
}
`;

  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return JSON.parse(response.choices[0].message.content);
}

async function createProjectFiles(projectName, files) {

  const projectPath = path.join(process.cwd(), projectName);

  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
  }

  fs.writeFileSync(
    path.join(projectPath, 'index.html'),
    files.indexHtml
  );

  fs.writeFileSync(
    path.join(projectPath, 'style.css'),
    files.styleCss
  );

  fs.writeFileSync(
    path.join(projectPath, 'script.js'),
    files.scriptJs
  );

  console.log('✅ Project created at:', projectPath);
}

async function main() {

  const websiteUrl = 'https://chaicode.com';

  console.log('🔍 Analyzing website...');

  const websiteInfo = await getWebsiteBriefByUrl(websiteUrl);

  console.log('🧠 Generating website files...');

  const generatedFiles = await generateWebsiteCode(websiteInfo);

  console.log('📁 Creating local folder...');

  await createProjectFiles(
    'generated-site',
    generatedFiles
  );

  console.log('🚀 Done');
}

main().catch(console.error);