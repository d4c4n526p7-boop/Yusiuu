const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const postsDir = path.join(root, 'content', 'posts');
const outFile = path.join(root, 'posts.js');
const defaultImage = 'assets/default-card.png';

function slugify(input) {
  return String(input || 'post')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'post';
}

function normalizePath(value) {
  if (!value) return '';
  return String(value).trim().replace(/^\/+/, '');
}

function parseFrontmatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: text };
  const raw = match[1].split(/\r?\n/);
  const data = {};
  let activeKey = null;

  for (const line of raw) {
    if (!line.trim()) continue;
    const listItem = line.match(/^\s*-\s*(.*)$/);
    if (listItem && activeKey) {
      if (!Array.isArray(data[activeKey])) data[activeKey] = [];
      data[activeKey].push(listItem[1].replace(/^['"]|['"]$/g, ''));
      continue;
    }
    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (pair) {
      activeKey = pair[1];
      let value = pair[2].trim();
      if (value === '[]') value = [];
      else if (value === '') value = '';
      else value = value.replace(/^['"]|['"]$/g, '');
      data[activeKey] = value;
    }
  }
  return { data, body: match[2].trim() };
}

function markdownToParagraphs(md) {
  return String(md || '')
    .split(/\n\s*\n/g)
    .map(p => p.replace(/\n/g, '<br>').trim())
    .filter(Boolean);
}

function formatDate(date) {
  if (!date) return '';
  const s = String(date).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  return s;
}

function readPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const full = path.join(postsDir, file);
      const { data, body } = parseFrontmatter(fs.readFileSync(full, 'utf8'));
      const images = [];
      if (data.cover) images.push(normalizePath(data.cover));
      if (Array.isArray(data.images)) {
        for (const img of data.images) {
          const normalized = normalizePath(img);
          if (normalized && !images.includes(normalized)) images.push(normalized);
        }
      }
      return {
        id: slugify(file.replace(/\.md$/, '')),
        title: data.title || file.replace(/\.md$/, ''),
        date: formatDate(data.date),
        excerpt: data.excerpt || '',
        paragraphs: markdownToParagraphs(body),
        images: images.slice(0, 3),
        defaultImage,
      };
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

const posts = readPosts();
const js = `// This file is generated automatically from content/posts/*.md.\n// Edit posts in /admin, not by hand.\nwindow.DEFAULT_CARD_IMAGE = ${JSON.stringify(defaultImage)};\nwindow.POSTS = ${JSON.stringify(posts, null, 2)};\n`;
fs.writeFileSync(outFile, js, 'utf8');
console.log(`Generated ${posts.length} post(s) into posts.js`);
