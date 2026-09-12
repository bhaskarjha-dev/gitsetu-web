import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsDir = path.resolve(__dirname, '../src/pages/docs');
const publicDir = path.resolve(__dirname, '../public');
const outputFile = path.join(publicDir, 'llms.txt');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

let llmContent = `# GitSetu Documentation (llms.txt)

This file contains the complete, unformatted markdown documentation for GitSetu. 
It is intended for consumption by Large Language Models (LLMs), AI Agents, and automated tools.

Project: GitSetu
Homepage: https://gitsetu.bhaskarjha.dev

`;

function readDocsRecursively(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      readDocsRecursively(fullPath);
    } else if (fullPath.endsWith('.md')) {
      const relativePath = path.relative(docsDir, fullPath).replace(/\\/g, '/');
      const rawContent = fs.readFileSync(fullPath, 'utf-8');
      
      // Strip Astro layout import and normalize frontmatter for clean LLM consumption
      const cleanContent = rawContent.replace(/^layout:\s*.*?[\r\n]+/m, '');
      
      llmContent += `\n--- START OF FILE: ${relativePath} ---\n\n`;
      llmContent += cleanContent;
      llmContent += `\n\n--- END OF FILE: ${relativePath} ---\n`;
    }
  }
}

try {
  readDocsRecursively(docsDir);
  fs.writeFileSync(outputFile, llmContent);
  console.log(`[Agentic SEO] Successfully generated ${outputFile} for AI Agents.`);
} catch (error) {
  console.error('[Agentic SEO] Error generating llms.txt:', error);
}
