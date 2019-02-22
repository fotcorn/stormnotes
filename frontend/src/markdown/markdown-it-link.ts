// based on https://github.com/markdown-it/markdown-it-sup/blob/master/index.js

// same as UNESCAPE_MD_RE plus a space
const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;

function linkify(state: any, silent: boolean) {
  let found;
  let content;
  let token;
  const max = state.posMax;
  const start = state.pos;

  if (state.src.charCodeAt(start) !== 0x5b /* [ */) {
    return false;
  }
  if (silent) {
    return false;
  } // don't run any pairs in validation mode
  if (start + 2 >= max) {
    return false;
  }

  state.pos = start + 1;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) === 0x5d /* ] */) {
      found = true;
      break;
    }

    state.md.inline.skipToken(state);
  }

  if (!found || start + 1 === state.pos) {
    state.pos = start;
    return false;
  }

  content = state.src.slice(start + 1, state.pos);

  // skip completed checkboxes [x]
  if (content === 'x') {
    state.pos = start;
    return false;
  }

  // don't allow unescaped spaces/newlines inside
  if (content.match(/(^|[^\\])(\\\\)*\s/)) {
    state.pos = start;
    return false;
  }

  if (content.charAt(0) === ':') {
    content = state.md.options.currentPage + content;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 1;

  // Earlier we checked !silent, but this implementation does not need it
  token = state.push('link_open', 'span', 1);
  token.attrs = [
    ['class', 'wiki-page-link'],
    ['data-wiki-page', content],
    ['href', '/wiki/' + content],
  ];
  token.markup = '^';

  token = state.push('text', '', 0);
  token.content = content.replace(UNESCAPE_RE, '$1');

  token = state.push('link_close', 'span', -1);
  token.markup = '^';

  state.pos = state.posMax + 1;
  state.posMax = max;
  return true;
}

export default function sup_plugin(md: any) {
  md.inline.ruler.after('emphasis', 'link', linkify);
}
