// source: https://github.com/mcecot/markdown-it-checkbox/blob/master/index.js
// changes: disable checkbox on line 39

import { extend } from 'lodash';

function checkboxReplace(md: any, options: any) {
  const arrayReplaceAt = md.utils.arrayReplaceAt;
  let lastId = 0;
  const defaults = {
    divWrap: false,
    divClass: 'checkbox',
    idPrefix: 'checkbox',
  };
  options = extend(defaults, options);
  const pattern = /\[(X|\s|\_|\-)\]\s(.*)/i;

  const createTokens = (checked: boolean, label: string, Token: any) => {
    let token;
    const nodes = [];

    /**
     * <div class="checkbox">
     */
    if (options.divWrap) {
      token = new Token('checkbox_open', 'div', 1);
      token.attrs = [['class', options.divClass]];
      nodes.push(token);
    }

    /**
     * <input type="checkbox" id="checkbox{n}" checked="true">
     */
    const id = options.idPrefix + lastId;
    lastId += 1;
    token = new Token('checkbox_input', 'input', 0);
    token.attrs = [['type', 'checkbox'], ['id', id], ['disabled', 'disabled']];
    if (checked === true) {
      token.attrs.push(['checked', 'true']);
    }
    nodes.push(token);

    /**
     * <label for="checkbox{n}">
     */
    token = new Token('label_open', 'label', 1);
    token.attrs = [['for', id]];
    nodes.push(token);

    /**
     * content of label tag
     */
    token = new Token('text', '', 0);
    token.content = label;
    nodes.push(token);

    /**
     * closing tags
     */
    nodes.push(new Token('label_close', 'label', -1));
    if (options.divWrap) {
      nodes.push(new Token('checkbox_close', 'div', -1));
    }
    return nodes;
  };
  const splitTextToken = (original: any, Token: any) => {
    const text = original.content;
    const matches = text.match(pattern);
    if (matches === null) {
      return original;
    }
    let checked = false;
    const value = matches[1];
    const label = matches[2];
    if (value === 'X' || value === 'x') {
      checked = true;
    }
    return createTokens(checked, label, Token);
  };
  return (state: any) => {
    const blockTokens = state.tokens;
    let j = 0;
    const l = blockTokens.length;
    while (j < l) {
      if (blockTokens[j].type !== 'inline') {
        j++;
        continue;
      }
      let tokens = blockTokens[j].children;
      let i = tokens.length - 1;
      while (i >= 0) {
        const token = tokens[i];
        blockTokens[j].children = tokens = arrayReplaceAt(
          tokens,
          i,
          splitTextToken(token, state.Token)
        );
        i--;
      }
      j++;
    }
  };
}

/*global module */

export default function(md: any, options: any) {
  md.core.ruler.push('checkbox', checkboxReplace(md, options));
}
