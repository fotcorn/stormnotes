import markdownIt from 'markdown-it';
import highlightjs from 'markdown-it-highlightjs';
import checkbox from './markdown-it-checkbox';
import katex from 'markdown-it-katex';
import link from './markdown-it-link';

const md = markdownIt({ breaks: true, linkify: true })
  .use(highlightjs)
  .use(checkbox)
  .use(link)
  .use(katex);

export default function render(markdown: string, currentPage: string): string {
  return md.render(markdown, { currentPage });
}
