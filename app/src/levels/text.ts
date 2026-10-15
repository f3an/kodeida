/* Тексти рівнів і світів поточною мовою інтерфейсу. */
import type { Level, World } from '../engine/level.ts';
import type { Lang } from '../engine/types.ts';
import { uiLang, siteT } from '../i18n.ts';
import { LEVELS_EN, WORLDS_EN } from './en.ts';
import { PY, pyStarter, pyText, pyTool } from './python.ts';

export function lt(level: Level, lang: Lang = 'ts') {
  const en = uiLang() === 'en' ? LEVELS_EN[level.id] : undefined;
  const base = {
    title: en?.title ?? level.title,
    topic: en?.topic ?? level.topic,
    brief: en?.brief ?? level.brief,
    statement: en?.statement ?? level.statement,
    hints: en?.hints ?? level.hints,
    lesson: en?.lesson ?? level.lesson,
    tool: level.tool && (en?.tool ?? level.tool),
    talk: level.talk?.map((l, i) => ({ who: l.who, text: en?.talk?.[i] ?? l.text })),
    quip: level.quip && { who: level.quip.who, text: en?.quip ?? level.quip.text },
  };
  const part = PY[level.id];
  if (lang !== 'py' || !part) return base;
  const m = !!level.memory;
  return {
    ...base,
    brief: pyText(base.brief, m),
    statement: base.statement.map((t) => pyText(t, m)),
    hints: [pyText(base.hints[0], m), pyText(base.hints[1], m), part.hint] as [string, string, string],
    lesson: pyText(base.lesson, m),
    tool: base.tool && pyTool(level, base.tool),
  };
}

/** Стартовий код: для англійської — коментар-умова англійською, решта коду та сама. */
export function starterOf(level: Level, lang: Lang): string {
  if (lang === 'py') {
    const en = uiLang() === 'en' ? LEVELS_EN[level.id] : undefined;
    return pyStarter(level, en?.doc, en ? '# Your code here' : undefined);
  }
  const code = level.starter[lang];
  const en = uiLang() === 'en' ? LEVELS_EN[level.id] : undefined;
  if (!en) return code;
  const lines = code.split('\n');
  const end = lines.indexOf(' */');
  const tags = lines.slice(1, end).filter((l) => l.startsWith(' * @'));
  return ['/**', ...en.doc.map((d) => ` * ${d}`), ...tags, ...lines.slice(end)].join('\n').replace('// Слово ладу пиши тут', '// Your code here');
}

export function wt(world: World) {
  const en = uiLang() === 'en' ? WORLDS_EN[world.n] : undefined;
  return {
    name: siteT(world.name),
    song: uiLang() === 'en' ? world.song.replace(/^Пісня ([IVX]+) · (.+)$/, (_m, n, t) => `Song ${n} · ${siteT(t)}`) : world.song,
    topic: siteT(world.topic),
    host: en?.host ?? world.host,
    trick: en?.trick ?? world.trick,
  };
}
