import 'dotenv/config';

import OpenAI from 'openai';
import FirecrawlApp from '@mendable/firecrawl-js';

import fs from 'fs';
import path from 'path';

import prettier from 'prettier';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});
async function scrapeWebsite(url) {

  const scrapeResult = await app.scrape(
  url,
  {
    formats: ['markdown'],
  }
);

  return scrapeResult.markdown;
}

async function generateWebsite(markdownContent) {

  const prompt = `
Generate a modern original website.

Based on this website content:

${markdownContent.slice(0, 5000)}

Return JSON only:

{
  "indexHtml": "...",
  "styleCss": "...",
  "scriptJs": "..."
}
`;

  const response =
    await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      response_format: {
        type: 'json_object',
      },
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

  return JSON.parse(
    response.choices[0].message.content
  );
}

async function saveFiles(projectName, files) {

  const projectPath =
    path.join(process.cwd(), projectName);

  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
  }

  const html = await prettier.format(
    files.indexHtml,
    {
      parser: 'html',
    }
  );

  const css = await prettier.format(
    files.styleCss,
    {
      parser: 'css',
    }
  );

  const js = await prettier.format(
    files.scriptJs,
    {
      parser: 'babel',
    }
  );

  fs.writeFileSync(
    path.join(projectPath, 'index.html'),
    html
  );

  fs.writeFileSync(
    path.join(projectPath, 'style.css'),
    css
  );

  fs.writeFileSync(
    path.join(projectPath, 'script.js'),
    js
  );

  console.log('✅ Website generated successfully');
}

async function main() {

  const url = 'https://chaicode.com';

  console.log('🔍 Scraping website...');

  const markdown =
    await scrapeWebsite(url);

  console.log('🧠 Generating UI...');

  const files =
    await generateWebsite(markdown);

  console.log('📁 Saving files...');

  await saveFiles(
    'generated-site',
    files
  );

  console.log('🚀 Done');
}

main().catch(console.error);