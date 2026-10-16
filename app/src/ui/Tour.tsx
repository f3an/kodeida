/* Тур Сивілли (сцена 11 онбордингу): поповер біля кожної частини інтерфейсу, решта екрана притемнена. */
import { useEffect, useLayoutEffect, useState } from 'react';
import { PixelCanvas } from './PixelCanvas.tsx';
import { makeSibyl } from '../world/sprites.js';
import { L } from '../i18n.ts';

export interface TourStep { target: string; title: string; text: string }

/** kind — яка вправа: вулиця світу 0, масив кампанії чи сувій «Абетки». */
export const SIBYL_TOUR = (kind: 'street' | 'array' | 'abc' = 'street', lang: 'ts' | 'js' | 'py' = 'ts'): TourStep[] => [...TOUR_BASE(lang)].map((s) => ({ ...s, ...TOUR_ALT[kind]?.(lang)[s.target] }));

const print = (lang: string) => (lang === 'py' ? 'print' : 'console.log');
/** Підміни текстів для інших вправ, за ціллю кроку. */
const TOUR_ALT: Partial<Record<'street' | 'array' | 'abc', (lang: string) => Record<string, Partial<TourStep>>>> = {
  array: () => ({
    '.canvas-wrap': { text: L('Тут видно, як світ виконує слово: на які предмети дивиться код, що змінюється, де стоять Еней і Микита.', 'Here you see how the world carries out the word: which objects the code looks at, what changes, where Aeneas and Mykyta stand.') },
  }),
  abc: (lang) => ({
    '.canvas-wrap': { title: L('Сувій', 'The scroll'), text: L(`Усе, що виведе ${print(lang)}, з'являється тут рядок за рядком. Перевіряю саме вивід: до літери й коми.`, `Everything ${print(lang)} prints appears here line by line. I check exactly the output: to the letter and comma.`) },
    '.speech': { text: L('Тут говоримо ми з Енеєм: я підказую, коли щось не так, і пояснюю помилки з номером рядка.', 'This is where Aeneas and I talk: I tell you when something is off and explain errors with a line number.') },
    '.panel': { text: L(`Тут вердикт кожного тесту, а в «Консолі» — усе, що вивів ${print(lang)}.`, `The verdict of every test is here, and “Console” shows everything ${print(lang)} printed.`) },
    '.side': { text: L('Уроки цієї казки. Кожен відкривається, щойно пройдеш попередній.', 'The lessons of this tale. Each opens once you pass the previous one.') },
    '.act': { text: L('Абетка, мапа світів, Книга хитрощів і налаштування. А тепер — до першого слова!', 'The ABC, the world map, the Book of Tricks and settings. And now — to the first word!') },
  }),
};

const TOUR_BASE = (lang: string): TourStep[] => [
  { target: '.ed .center', title: L('Слово ладу', 'The word of order'), text: L('Ліворуч — слово ладу, твій код. Без AI-підказок: лише ти і мова. Скажеш криво — і світ піде криво.', 'On the left is the word of order — your code. No AI hints: just you and the language. Say it crooked and the world goes crooked.') },
  { target: '.btn.run', title: L('Запустити', 'Run'), text: L('«Запустити» (⌘↵) виконує слово на прикладі. Світ праворуч робить рівно те, що сказано, — не більше.', '“Run” (⌘↵) runs the word on an example. The world on the right does exactly what is said — nothing more.') },
  { target: '.canvas-wrap', title: L('Світ', 'The world'), text: L('Тут видно, як світ виконує кожне слово: куди йде Еней, на що дивиться код, що змінюється.', 'Here you see how the world carries out every word: where Aeneas goes, what the code looks at, what changes.') },
  { target: '.wh .btn.step', title: L('Крок', 'Step'), text: L('«Крок» проходить виконання по одному слову. Зручно, коли треба зрозуміти, де саме все пішло не так.', '“Step” goes through the run one word at a time. Handy when you need to see exactly where things went wrong.') },
  { target: '.speed', title: L('Швидкість', 'Speed'), text: L('Швидкість анімації, а ⏭ — одразу до кінця.', 'Animation speed; ⏭ skips straight to the end.') },
  { target: '.speech', title: L('Голоси світу', 'Voices of the world'), text: L('Тут говорять: Микита підказує й жартує, Юнона глузує, а світ пояснює помилки з номером рядка.', 'This is where they talk: Mykyta helps and jokes, Juno mocks, and the world explains errors with a line number.') },
  { target: '.btn.judge', title: L('Суд богів', 'Judgement of the Gods'), text: L('«Суд богів» (⌘⇧↵) перевіряє слово на всіх тестах, зокрема прихованих і великих. Лише він дає зірки.', '“Judgement” (⌘⇧↵) checks the word on all tests, including hidden and big ones. Only it awards stars.') },
  { target: '.panel', title: L('Вердикт і консоль', 'Verdict and console'), text: L(`Тут вердикт кожного тесту, а в «Консолі» — усе, що виведе ${print(lang)}.`, `The verdict of every test is here, and “Console” shows everything ${print(lang)} prints.`) },
  { target: '.tabs [data-tab=hints]', title: L('Мої підказки', 'My hints'), text: L('Застрягнеш — клич мене: натяк, ідея, псевдокод. Кожна підказка забирає третю зірку.', 'Stuck? Call me: a nudge, an idea, pseudocode. Each hint costs the third star.') },
  { target: '.side', title: L('Вправи', 'Exercises'), text: L('Вправи світу. Кожна відкривається, щойно розв\'яжеш попередню; ★ — фінальна задача світу.', 'The exercises of this world. Each opens once you solve the previous one; ★ is the world’s final problem.') },
  { target: '.act', title: L('Мандрівка', 'The journey'), text: L('Мапа світів, Книга хитрощів, вишиванка Енея й налаштування. А тепер — на Суд богів!', 'The world map, the Book of Tricks, Aeneas’s shirt and settings. And now — to the Judgement of the Gods!') },
];

const SIBYL = makeSibyl();

export function Tour({ steps, onDone }: { steps: TourStep[]; onDone: () => void }) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[i];

  useLayoutEffect(() => {
    const el = document.querySelector(step.target);
    const update = () => setRect(el ? el.getBoundingClientRect() : null);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [step.target]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone();
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); i < steps.length - 1 ? setI(i + 1) : onDone(); }
      if (e.key === 'ArrowLeft') setI(Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [i, steps.length, onDone]);

  const r = rect ?? new DOMRect(innerWidth / 2 - 100, innerHeight / 2 - 40, 200, 80);
  // Великі панелі підсвічуємо точно по межах, малі кнопки — з відступом; рамка не виходить за вікно.
  const pad = r.width > 360 || r.height > 280 ? 0 : 6;
  const x0 = Math.max(3, r.left - pad), y0 = Math.max(3, r.top - pad);
  const x1 = Math.min(innerWidth - 3, r.right + pad), y1 = Math.min(innerHeight - 3, r.bottom + pad);
  const box = { left: x0, top: y0, width: x1 - x0, height: y1 - y0 };
  // поповер: праворуч від цілі, якщо є місце, інакше ліворуч; по вертикалі — у межах вікна
  const W = 340, H = 190;
  const right = box.left + box.width + 14 + W < innerWidth;
  const left = right ? box.left + box.width + 14 : Math.max(12, box.left - W - 14);
  const fits = right || box.left - W - 14 > 0;
  const top = fits ? Math.min(innerHeight - H - 12, Math.max(12, box.top)) : Math.min(innerHeight - H - 12, box.top + box.height + 14);
  const popLeft = fits ? left : Math.min(innerWidth - W - 12, Math.max(12, box.left));

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      <div className="tour-hole" style={box} />
      <div className="tour-pop" style={{ left: popLeft, top, width: W }}>
        <div className="tour-head">
          <PixelCanvas width={40} height={70} draw={(ctx) => SIBYL.draw(ctx, 0, 0, 1)} className="tour-sibyl" label={L('Сивілла', 'Sibyl')} />
          <div>
            <div className="eyebrow">{L('Сивілла', 'Sibyl')} · {i + 1} {L('з', 'of')} {steps.length}</div>
            <h3 id="tour-title">{step.title}</h3>
          </div>
        </div>
        <p>{step.text}</p>
        <div className="tour-actions">
          <button className="btn" onClick={onDone}>{L('Пропустити', 'Skip')}</button>
          <span className="grow" />
          {i > 0 && <button className="btn" onClick={() => setI(i - 1)}>←</button>}
          <button className="btn run" autoFocus onClick={() => (i < steps.length - 1 ? setI(i + 1) : onDone())}>{i < steps.length - 1 ? L('Далі →', 'Next →') : L('Зрозуміло', 'Got it')}</button>
        </div>
      </div>
    </div>
  );
}
