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

/** Дерево в тесті: масив по рівнях, як на LeetCode ([3, 9, 20, null, null, 15, 7]). */
export const tree = (v: (number | null)[]) => ({ $tree: v });
export interface T { val: number; left: T | null; right: T | null }
/** Звичайне дерево з масиву по рівнях — для еталонних рішень. */
export function buildTree(a: unknown): T | null {
  const v = (a as { $tree: (number | null)[] }).$tree;
  if (!v.length || v[0] === null) return null;
  const nodes: T[] = [{ val: v[0], left: null, right: null }];
  for (let q = 0, k = 1; q < nodes.length && k < v.length; q++) {
    const p = nodes[q];
    if (k < v.length && v[k] !== null) nodes.push(p.left = { val: v[k]!, left: null, right: null }); k++;
    if (k < v.length && v[k] !== null) nodes.push(p.right = { val: v[k]!, left: null, right: null }); k++;
  }
  return nodes[0];
}
/** Дерево назад у масив по рівнях без хвостових null — так рушій показує TreeNode у відповіді. */
export function treeArray(root: T | null): (number | null)[] {
  const out: (number | null)[] = [];
  const q: (T | null)[] = [root];
  for (let k = 0; k < q.length; k++) { const n = q[k]; if (!n) { out.push(null); continue; } out.push(n.val); q.push(n.left, n.right); }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
