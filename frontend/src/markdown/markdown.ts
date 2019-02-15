const md = require('markdown-it')({ breaks: true, linkify: true })
  .use(require('markdown-it-highlightjs'))
  .use(require('./markdown-it-checkbox'))
  .use(require('./markdown-it-link'));

export default function render(markdown: string, currentPage: string): string {
  md.context = { currentPage };
  return md.render(markdown);
}
