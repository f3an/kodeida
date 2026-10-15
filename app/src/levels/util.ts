/** Стартовий код у TS і JS з однаковим коментарем-умовою. */
export function starter(
  name: string,
  params: [string, string][],
  ret: string,
  doc: string[],
  body = '  // Слово ладу пиши тут\n',
): { ts: string; js: string } {
  const comment = ['/**', ...doc.map((l) => ` * ${l}`)];
  const ts = `${comment.join('\n')}\n */\nfunction ${name}(${params.map(([n, t]) => `${n}: ${t}`).join(', ')}): ${ret} {\n${body}}\n`;
  const jsDoc = [...params.map(([n, t]) => ` * @param {${t}} ${n}`), ...(ret === 'void' ? [] : [` * @return {${ret}}`])];
  const js = `${[...comment, ...jsDoc].join('\n')}\n */\nfunction ${name}(${params.map(([n]) => n).join(', ')}) {\n${body}}\n`;
  return { ts, js };
}

export const lc = (n: number, title: string) => ({ n, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '') });
