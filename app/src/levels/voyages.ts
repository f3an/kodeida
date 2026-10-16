/*
 * Заставки переходу між світами: «лад відновлено» → «у дорогу» → «новий світ».
 * Ключ — номер світу, ЯКИЙ ЗАВЕРШЕНО (from); перехід веде до світу from + 1.
 * На межі пісень у «дорозі» — інтерлюдія Юнони з Вовком (наскрізна лінія з docs/STORY.md).
 * Репліка: [хто, укр, англ]; «хто» — ключ портрета в VOICE (ui/Voyage.tsx).
 */
export type Who = 'fox' | 'enei' | 'juno' | 'wolf' | 'sibyl' | 'eol' | 'dido' | 'lion' | 'mitten' | 'sotnyk' | 'acestes' | 'ox' | 'charon';
export interface Slide { title: [string, string]; narr: [string, string]; lines: [Who, string, string][] }
export interface Voyage { leave: Slide; sail: Slide; arrive: Slide }

export const VOYAGES: Record<number, Voyage> = {
  1: {
    leave: {
      title: ['Море вгамувалось', 'The sea calms down'],
      narr: ['Флот іде ладом, і Еол ховає вітри назад у міх. На хвилі гойдається уламок Писанки — і на вишиванці Енея проступають «хвилі».', 'The fleet sails in order, and Aeolus stuffs the winds back into his bag. A shard of the Pysanka bobs on a wave — and “waves” appear on Aeneas’s shirt.'],
      lines: [
        ['eol', 'Ну, пливіть уже. І передайте Юноні, що я старався… для вигляду.', 'Well, off you sail. And tell Juno I tried… for appearances.'],
        ['fox', 'Уламок у нас. Я його чую, як рибу під водою.', 'The shard is ours. I can sense it, like a fish under water.'],
      ],
    },
    sail: {
      title: ['Пісня II. Гостини', 'Song II. Visits'],
      narr: ['Корабель пропливає тріщиною між світами. А на Олімпі Юнона дивиться в чашу з водою — і не радіє.', 'The ship sails through a crack between worlds. And on Olympus Juno looks into a bowl of water — and is not pleased.'],
      lines: [
        ['juno', 'Ще один уламок? Вовче!', 'Another shard? Wolf!'],
        ['wolf', 'Я тут! Я голодний!', 'I’m here! I’m hungry!'],
        ['juno', 'Наступний уламок у Карфагені. Будь там першим — і отримаєш свій ліс на обід.', 'The next shard is in Carthage. Be there first — and you’ll have your forest for dinner.'],
      ],
    },
    arrive: {
      title: ['Карфаген', 'Carthage'],
      narr: ['Дидона засновує місто: їй віддадуть стільки землі, скільки обгородить волячою шкурою. Але уламок заплутав мірки, і стіни не сходяться.', 'Dido is founding a city: she will be given as much land as an ox hide can fence. But a shard has tangled the measures, and the walls won’t meet.'],
      lines: [
        ['dido', 'Чужинці? Якщо ви вмієте міряти — ласкаво просимо до Карфагена.', 'Strangers? If you can measure — welcome to Carthage.'],
        ['fox', 'Тірський пурпур! Енею, як я виглядаю?', 'Tyrian purple! Aeneas, how do I look?'],
        ['enei', 'Як лис, що запізниться на свій кінець стрічки.', 'Like a fox who’ll be late for his end of the tape.'],
      ],
    },
  },
  2: {
    leave: {
      title: ['Мур зійшовся', 'The wall closes'],
      narr: ['Стовпи стали як слід, вода стоїть, у Карфагена є межі. На вишиванці — «два зустрічні ромби».', 'The posts stand as they should, the water holds, Carthage has its borders. On the shirt — “two meeting rhombuses”.'],
      lines: [
        ['dido', 'Лишайтеся… Ні? Тоді хоч пам\'ятайте Карфаген.', 'Stay… No? Then at least remember Carthage.'],
        ['enei', 'Пам\'ятатимемо. Але уламки самі себе не зберуть.', 'We will. But the shards won’t gather themselves.'],
      ],
    },
    sail: {
      title: ['Знайомий запах', 'A familiar smell'],
      narr: ['Микита раптом нюхає повітря й замовкає. Цей запах він упізнав би з будь-якого світу: хвоя, мох і трохи курника.', 'Mykyta suddenly sniffs the air and falls silent. He would know this smell in any world: pine, moss and a hint of henhouse.'],
      lines: [
        ['fox', 'Енею… це мій ліс. Я вдома.', 'Aeneas… this is my forest. I’m home.'],
        ['enei', 'То чого ж ти не радий?', 'Then why aren’t you happy?'],
        ['fox', 'Бо звірі мене теж пам\'ятають. І не з найкращого боку.', 'Because the animals remember me too. And not fondly.'],
      ],
    },
    arrive: {
      title: ['Ліс Лиса Микити', 'Mykyta’s Forest'],
      narr: ['З тріщини в лісі сиплються речі з інших світів. На звіриному ярмарку все переплуталось: хто що продає, ніхто не пам\'ятає.', 'Things from other worlds pour through a crack in the forest. At the animals’ fair everything is mixed up: nobody remembers who sells what.'],
      lines: [
        ['lion', 'Микита? Той самий? Ну-ну. Ярмарок у безладі, а тут ще й ти.', 'Mykyta? The same one? Well, well. The fair is a mess, and now you as well.'],
        ['fox', 'Тепер я рудий, без жодної фарби. І навчу Енея пам\'ятати, щоб не шукати щоразу заново.', 'Now I’m ginger, without any paint. And I’ll teach Aeneas to remember, so he doesn’t search afresh every time.'],
      ],
    },
  },
  3: {
    leave: {
      title: ['Ярмарок ожив', 'The fair comes alive'],
      narr: ['Цар Лев знову торгує, а Микита цілу хвилину був канцлером. На вишиванці — «скриня з комірками».', 'King Lion trades again, and Mykyta was chancellor for a whole minute. On the shirt — “a chest of cells”.'],
      lines: [
        ['lion', 'Іди вже, канцлере. Поки я не передумав.', 'Off you go, chancellor. Before I change my mind.'],
        ['fox', 'Хвилина канцлерства — найкраща хвилина мого життя.', 'A minute as chancellor — the best minute of my life.'],
      ],
    },
    sail: {
      title: ['Зима', 'Winter'],
      narr: ['Корабель вмерзає в лід, і далі доводиться йти пішки. Сніг, мороз — а посеред поля лежить чиясь рукавичка.', 'The ship freezes into the ice, and they have to go on foot. Snow, frost — and in the middle of a field lies someone’s mitten.'],
      lines: [
        ['enei', 'Хтось загубив рукавичку.', 'Someone lost a mitten.'],
        ['fox', 'Хтось у ній живе. І, здається, не один.', 'Someone lives in it. And not alone, it seems.'],
      ],
    },
    arrive: {
      title: ['Рукавичка', 'The Mitten'],
      narr: ['У рукавичці жили звірі, як у казці, але уламок зламав порядок: лізуть хто куди, і рукавичка тріщить по швах.', 'Animals lived in the mitten, as in the tale, but a shard broke the order: they climb in any old way, and the mitten is splitting at the seams.'],
      lines: [
        ['mitten', 'Рятуйте! Ще один — і ми лопнемо!', 'Help! One more and we’ll burst!'],
        ['fox', 'Я білий, як сніг. Ідеально, щоб залізти першим… і застрягнути на дні.', 'I’m white as snow. Perfect for getting in first… and getting stuck at the bottom.'],
      ],
    },
  },
  4: {
    leave: {
      title: ['Потепліло', 'It gets warmer'],
      narr: ['Прийшла весна, і звірі вилазять по одному: хто заліз останнім, той і перший. На вишиванці — «вежа».', 'Spring has come, and the animals climb out one by one: last in, first out. On the shirt — “a tower”.'],
      lines: [
        ['mitten', 'Дякуємо! Тепер хоч дихати можна.', 'Thank you! At least we can breathe now.'],
        ['fox', 'Я виліз останнім. Але хвіст цілий.', 'I got out last. But my tail is intact.'],
      ],
    },
    sail: {
      title: ['Пісня III. Випробування', 'Song III. Trials'],
      narr: ['На Олімпі Юнона кидає чашу об підлогу. Чотири уламки вже зібрано, а Вовк досі голодний.', 'On Olympus Juno throws her bowl to the floor. Four shards are already gathered, and the Wolf is still hungry.'],
      lines: [
        ['juno', 'Ти обіцяв їх зупинити!', 'You promised to stop them!'],
        ['wolf', 'Я пробував! Кожного з кожним! Але вони хитріші…', 'I tried! Every one with every other! But they’re craftier…'],
        ['juno', 'Тоді випробуй їх засухою. Конотоп — твій.', 'Then try them with a drought. Konotop is yours.'],
      ],
    },
    arrive: {
      title: ['Конотоп', 'Konotop'],
      narr: ['У Конотопі засуха. Сотник Забрьоха шукає відьом: кидає в став кожну по черзі й дивиться, тоне чи пливе. Уламок зробив цю перевірку безкінечною.', 'Konotop is in a drought. Captain Zabrokha hunts for witches: he throws each one into the pond in turn to see if she sinks or swims. A shard made this check endless.'],
      lines: [
        ['sotnyk', 'Хто такі? Відьми? У став!', 'Who are you? Witches? Into the pond!'],
        ['fox', 'Ми не відьми. Ми — ті, хто ділить навпіл. І я фіолетовий не через чари, чесно.', 'We aren’t witches. We’re the ones who split in half. And I’m not purple because of spells, honestly.'],
      ],
    },
  },
  5: {
    leave: {
      title: ['Дощ над Конотопом', 'Rain over Konotop'],
      narr: ['Перевірку навпіл зроблено, сотник дивується, а з неба нарешті капає. На вишиванці — «ромб навпіл».', 'The halving is done, the captain is astonished, and at last it’s raining. On the shirt — “a halved rhombus”.'],
      lines: [
        ['sotnyk', 'Чотирнадцять поглядів… І жодної відьми в ставі. Дивні часи.', 'Fourteen looks… And not a single witch in the pond. Strange times.'],
        ['fox', 'А Вовк таки наївся пирогів. Рівно скільки треба.', 'And the Wolf did eat his pies. Exactly as many as needed.'],
      ],
    },
    sail: {
      title: ['Сицилія на обрії', 'Sicily on the horizon'],
      narr: ['Попереду острів Ацеста. Тут рік тому помер Анхіз, і Еней хоче вшанувати батька іграми.', 'Ahead lies Acestes’s island. Anchises died here a year ago, and Aeneas wants to honour his father with games.'],
      lines: [
        ['enei', 'Ігри на честь батька. Він би радів.', 'Games in my father’s honour. He would be glad.'],
        ['fox', 'А я суддюватиму. І, може, трохи робитиму ставки.', 'And I’ll be judging. And maybe placing a few bets.'],
      ],
    },
    arrive: {
      title: ['Ігри Ацеста', 'Acestes’s games'],
      narr: ['Ацест справляє поминальні ігри за Анхізом, але уламок збив таблицю результатів, і ніхто не знає, хто переміг.', 'Acestes holds funeral games for Anchises, but a shard has scrambled the scoreboard, and nobody knows who won.'],
      lines: [
        ['acestes', 'Енею! Ласкаво просимо. Тільки табло зламалось.', 'Aeneas! Welcome. Only the scoreboard is broken.'],
        ['fox', 'Сонячна вохра — колір суддів. Почнімо.', 'Sunny ochre — the judges’ colour. Let’s begin.'],
      ],
    },
  },
  6: {
    leave: {
      title: ['Табло ожило', 'The scoreboard lives'],
      narr: ['Переможці знають свої місця, Ацест задоволений. На вишиванці — «рамка».', 'The winners know their places, Acestes is pleased. On the shirt — “a frame”.'],
      lines: [
        ['acestes', 'Анхіз би пишався. Пливіть, а ми ще погуляємо.', 'Anchises would be proud. Sail on, we’ll celebrate a little longer.'],
        ['fox', 'Вінок судді — мій. Ставки — ні. Чесно.', 'The judge’s wreath — mine. The bets — not. Honestly.'],
      ],
    },
    sail: {
      title: ['Степ під зорями', 'The steppe under the stars'],
      narr: ['Корабель виносить на суходіл: безкраїй степ, а на небі розлився Чумацький шлях.', 'The ship is carried onto dry land: an endless steppe, and the Milky Way — the Chumak Way — spills across the sky.'],
      lines: [
        ['enei', 'Ніч, степ… і рипіння возів.', 'Night, steppe… and the creak of carts.'],
        ['fox', 'Зорі як вузли, з\'єднані лінією. Мені це щось нагадує.', 'Stars like nodes joined by a line. That reminds me of something.'],
      ],
    },
    arrive: {
      title: ['Чумацький шлях', 'The Chumak Way'],
      narr: ['Чумацька валка везе сіль із Криму, і кожен віз зачеплено за попередній. Уламок переплутав зачіпки, і валка ходить по колу.', 'A chumak train carries salt from Crimea, each cart hooked to the one before. A shard tangled the links, and the train goes in circles.'],
      lines: [
        ['ox', 'Мууу. Третю ніч ходимо по колу.', 'Moooo. Third night we’re going in circles.'],
        ['fox', 'Я тепер зоряний, синьо-білий. І швидкий. А ти, Віле, повільний. Знадобимося обидва.', 'I’m starry now, blue and white. And quick. And you, Ox, are slow. We’ll both come in handy.'],
      ],
    },
  },
  7: {
    leave: {
      title: ['Валка рушила', 'The train moves on'],
      narr: ['Хвіст перечеплено, і валка йде додому, до Криму. На вишиванці — «ланцюжок».', 'The tail is re-hooked, and the train heads home to Crimea. On the shirt — “a chain”.'],
      lines: [
        ['ox', 'Мууу! Дякую, що розплутали.', 'Moooo! Thank you for untangling us.'],
        ['fox', 'А тепер куди? Я чую уламок… десь глибоко-глибоко.', 'And now where? I hear a shard… somewhere deep, deep down.'],
      ],
    },
    sail: {
      title: ['Пісня IV. Пекло', 'Song IV. Hell'],
      narr: ['Сивілла виводить їх до входу в підземний світ. Із темряви тягне сіркою.', 'The Sibyl leads them to the entrance of the underworld. Sulphur drifts out of the dark.'],
      lines: [
        ['sibyl', 'Твій батько чекає на дні, Енею. Спускатимемося по одному колу.', 'Your father waits at the bottom, Aeneas. We’ll go down one circle at a time.'],
        ['juno', 'Хай спускаються. Звідти мало хто повертається.', 'Let them go down. Few come back from there.'],
        ['wolf', 'А там є що поїсти?', 'Is there anything to eat down there?'],
      ],
    },
    arrive: {
      title: ['Пекло', 'Hell'],
      narr: ['Уламок упав у пекло, і грішників порозкидало по чужих котлах. Без нього з пекла не вийти.', 'A shard fell into hell, and the sinners got scattered into the wrong cauldrons. Without it, there is no way out.'],
      lines: [
        ['charon', 'Живі? У моєму човні? Платіть.', 'The living? In my boat? Pay up.'],
        ['fox', 'Я вугільно-червоний. Тут це, здається, звичайний колір.', 'I’m coal-red. That seems to be an ordinary colour down here.'],
      ],
    },
  },
};
