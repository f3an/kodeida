/*
 * Заставки переходу між світами: «лад відновлено» → «у дорогу» → «новий світ».
 * Ключ — номер світу, ЯКИЙ ЗАВЕРШЕНО (from); перехід веде до світу from + 1.
 * На межі пісень у «дорозі» — інтерлюдія Юнони з Вовком (наскрізна лінія з docs/STORY.md).
 * Репліка: [хто, укр, англ]; «хто» — ключ портрета в VOICE (ui/Voyage.tsx).
 */
export type Who = 'fox' | 'enei' | 'juno' | 'wolf' | 'sibyl' | 'eol' | 'dido' | 'lion' | 'mitten' | 'sotnyk' | 'acestes' | 'ox' | 'charon' | 'anchises' | 'mavka' | 'molfar' | 'kozhumyaka' | 'turn' | 'vulcan' | 'venus';
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
  8: {
    leave: {
      title: ['Пекло відпускає', 'Hell lets go'],
      narr: ['Грішники сидять у своїх котлах, Харон рахує плату. На вишиванці Енея закручується «спіраль».', 'The sinners sit in their own cauldrons, Charon counts the fare. A “spiral” curls onto Aeneas’s shirt.'],
      lines: [
        ['charon', 'Рідко хто виходить звідси з решткою. Пливіть, поки я добрий.', 'Few leave here with change. Off you go while I’m kind.'],
        ['fox', 'То я ношу в собі частку Писанки… Тепер ясно, чого мене так перефарбовує.', 'So I carry a piece of the Pysanka inside me… Now it’s clear why I keep changing colour.'],
      ],
    },
    sail: {
      title: ['Луги Елісію', 'The meadows of Elysium'],
      narr: ['За пеклом — тихі луги, де живуть праведні душі. Анхіз іде попереду й не озирається.', 'Beyond hell lie quiet meadows where the righteous souls live. Anchises walks ahead and doesn’t look back.'],
      lines: [
        ['anchises', 'Сюди Вовка не пустять. Тут лише ті, хто вміє повертатися.', 'They won’t let the Wolf in here. Only those who know how to come back.'],
        ['wolf', '(здалеку) Я й не хотів! Я біля брами посиджу…', '(from afar) I didn’t want to anyway! I’ll sit by the gate…'],
      ],
    },
    arrive: {
      title: ['Родовід Анхіза', 'The family tree of Anchises'],
      narr: ['Анхіз показує Енеєві його нащадків, аж до тих, хто збудує Рим. Але уламок переплутав гілки родоводу.', 'Anchises shows Aeneas his descendants, all the way to those who will build Rome. But a shard has tangled the branches of the family tree.'],
      lines: [
        ['anchises', 'Ось твій рід, сину. Тільки хтось переставив гілки.', 'Here is your line, son. Only someone has rearranged the branches.'],
        ['fox', 'Я золотавий, як листя на родовому дереві. Почнімо з коріння.', 'I’m golden, like the leaves on a family tree. Let’s start from the roots.'],
      ],
    },
  },
  9: {
    leave: {
      title: ['Рід цілий', 'The line is whole'],
      narr: ['Гілки родоводу знову на своїх місцях, і Анхіз прощається з сином. На вишиванці проростає «дерево життя».', 'The branches of the family tree are back in place, and Anchises bids his son farewell. A “tree of life” grows on the shirt.'],
      lines: [
        ['anchises', 'Іди, сину. І бережи лиса: він носить у собі більше, ніж здається.', 'Go, son. And look after the fox: he carries more inside him than it seems.'],
        ['fox', 'Я лише трохи золотавий. Ну, і трохи Писанки.', 'I’m just a little golden. Well, and a little Pysanka.'],
      ],
    },
    sail: {
      title: ['Пісня V. Ліси й гори', 'Song V. Forests and mountains'],
      narr: ['На Олімпі Юнона слухає, що підслухав Вовк біля брами Елісію. І вперше всміхається.', 'On Olympus Juno listens to what the Wolf overheard by the gate of Elysium. And for the first time she smiles.'],
      lines: [
        ['wolf', 'Лис носить у собі частку Писанки! Я сам чув!', 'The fox carries a piece of the Pysanka inside him! I heard it myself!'],
        ['juno', 'Отже, лис і є уламок. Цікаво… Поки що хай збирають. Чим більше зберуть — тим більше заберу я.', 'So the fox is a shard. Interesting… Let them gather for now. The more they gather, the more I take.'],
        ['wolf', 'А ліс на обід?', 'And the forest for dinner?'],
        ['juno', 'Ось тобі ліс. Лісова пісня. Тільки не з\'їж Мавку.', 'Here’s a forest for you. The Forest Song. Just don’t eat Mavka.'],
      ],
    },
    arrive: {
      title: ['Лісова пісня', 'The Forest Song'],
      narr: ['У лісі Мавки кожне дерево мало своє місце: молодші ліворуч, старші праворуч. Уламок пересадив дерева, і ліс засинає.', 'In Mavka’s forest every tree had its place: younger to the left, older to the right. A shard has replanted the trees, and the forest is falling asleep.'],
      lines: [
        ['mavka', 'Хто ви? Не рубайте нічого. Ліс і так ледве дихає.', 'Who are you? Don’t cut anything. The forest can barely breathe as it is.'],
        ['fox', 'Я весняний зелений. Мене тут ніхто не помітить — і це вперше добре.', 'I’m spring green. Nobody will notice me here — and for once that’s good.'],
      ],
    },
  },
  10: {
    leave: {
      title: ['Ліс прокинувся', 'The forest wakes'],
      narr: ['Сопілка Лукаша будить дерева одне за одним, і ліс шумить, як колись. На вишиванці розцвітає «барвінок».', 'Lukash’s pipe wakes the trees one by one, and the forest rustles as it used to. A “periwinkle” blooms on the shirt.'],
      lines: [
        ['mavka', 'Я не вмираю, поки ліс співає. Ідіть, і несіть пісню далі.', 'I don’t die while the forest sings. Go, and carry the song on.'],
        ['fox', 'Я б лишився… але зелений мені не дуже личить.', 'I’d stay… but green doesn’t really suit me.'],
      ],
    },
    sail: {
      title: ['Через перевал', 'Over the pass'],
      narr: ['Стежка піднімається в гори. Унизу шумить Черемош, а вище — лише туман і мовчазні полонини.', 'The path climbs into the mountains. Below, the Cheremosh roars, and above there is only fog and silent meadows.'],
      lines: [
        ['enei', 'Тихо як. Навіть вівці не мекають.', 'How quiet. Even the sheep aren’t bleating.'],
        ['fox', 'Бо не чують одна одну. Тут хтось має озватися першим.', 'Because they can’t hear each other. Someone here has to call out first.'],
      ],
    },
    arrive: {
      title: ['Карпати', 'The Carpathians'],
      narr: ['Полонини оповив туман: гуцули не можуть знайти одне одного, а трембіти мовчать. На скелі сидить мольфар і щось шепоче вітрові.', 'Fog has wrapped the meadows: the Hutsuls can’t find each other, and the trembitas are silent. A molfar sits on a rock and whispers something to the wind.'],
      lines: [
        ['molfar', 'Знаю, чого ви прийшли. Уламок сховався в тумані. Знайдете — туман зійде.', 'I know why you came. The shard is hiding in the fog. Find it — and the fog will lift.'],
        ['fox', 'Я хвойний смарагд. У тумані мене не видно, зате я все чую.', 'I’m pine emerald. You can’t see me in the fog, but I hear everything.'],
      ],
    },
  },
  11: {
    leave: {
      title: ['Трембіти озвались', 'The trembitas sound'],
      narr: ['Туман сходить, і з кожної вершини озивається трембіта. Полонини знову перегукуються. На вишиванці — «розетка».', 'The fog lifts, and a trembita sounds from every peak. The meadows call to each other again. On the shirt — “a rosette”.'],
      lines: [
        ['molfar', 'Вітер каже, що далі вас чекає степ і старі вали. І Змій, що ще не забув свого плуга.', 'The wind says that ahead lie the steppe and the old walls. And a Serpent who hasn’t forgotten his plough.'],
        ['fox', 'Змій? Енею, а ти колись орав на змієві?', 'A Serpent? Aeneas, have you ever ploughed with a serpent?'],
      ],
    },
    sail: {
      title: ['Униз до степу', 'Down to the steppe'],
      narr: ['З гір стежка спускається в степ. На обрії, наче шрами на землі, тягнуться довгі вали.', 'From the mountains the path descends into the steppe. On the horizon long walls stretch like scars on the earth.'],
      lines: [
        ['enei', 'Хто ж насипав такі вали?', 'Who raised walls like these?'],
        ['fox', 'Кажуть, їх проорав Змій. Під батогом одного кожум\'яки.', 'They say a Serpent ploughed them. Under the whip of one tanner.'],
      ],
    },
    arrive: {
      title: ['Змієві вали', 'The Serpent’s Walls'],
      narr: ['Кирило Кожум\'яка заорав Змія й проклав вали від моря до моря. Але уламок порізав їх на шматки, що налазять один на один, і змії лізуть крізь щілини.', 'Kyrylo Kozhumyaka harnessed the Serpent and ploughed walls from sea to sea. But a shard cut them into overlapping pieces, and serpents crawl through the gaps.'],
      lines: [
        ['kozhumyaka', 'Вали мої посічено! А зміїне кодло вже лізе. Допоможете — нагодую.', 'My walls are cut to pieces! And the serpent brood is already crawling in. Help me — and I’ll feed you.'],
        ['fox', 'Я теракотовий, як зорана земля. Тут я майже свій.', 'I’m terracotta, like ploughed earth. I almost belong here.'],
      ],
    },
  },
  12: {
    leave: {
      title: ['Вали стоять', 'The walls stand'],
      narr: ['Змії відбиті, вали цілі, а Кожум\'яка вже лагодить плуг. На вишиванці — «зигзаг». Попереду — Лаціум, кінець дороги.', 'The serpents are beaten back, the walls are whole, and Kozhumyaka is already mending his plough. On the shirt — “a zigzag”. Ahead lies Latium, the end of the road.'],
      lines: [
        ['kozhumyaka', 'Добре стріляєте. Як буде скрута — кличте, я Змія ще раз запряжу.', 'You shoot well. If you’re ever in trouble — call me, I’ll harness the Serpent again.'],
        ['fox', 'Лаціум… Звідти пахне чимось недобрим. І вовком.', 'Latium… Something bad smells from there. And wolf.'],
      ],
    },
    sail: {
      title: ['Пісня VI. Лаціум', 'Song VI. Latium'],
      narr: ['Уночі, поки всі сплять, Вовк крадеться до табору троянців. Юнона дивиться згори.', 'At night, while everyone sleeps, the Wolf creeps into the Trojan camp. Juno watches from above.'],
      lines: [
        ['juno', 'Лис носить у собі Писанку. Принеси мені лиса — і вони ніколи її не зберуть.', 'The fox carries the Pysanka inside him. Bring me the fox — and they will never put it together.'],
        ['wolf', 'Пробач, руда… тобто темно-синя. Я голодний, а вона обіцяла ліс.', 'Sorry, ginger… I mean, navy. I’m hungry, and she promised me a forest.'],
        ['fox', 'Енею-у-у!..', 'Aeneas-s-s!..'],
      ],
    },
    arrive: {
      title: ['Табір Турна', 'Turnus’s camp'],
      narr: ['Еней прокидається — а Микити немає. Його тримають у таборі Турна, на пагорбах за частоколом. Уперше Еней мусить іти без лиса. Але з ним Низ і Евріал.', 'Aeneas wakes up — and Mykyta is gone. He is held in Turnus’s camp, on the hills behind the palisade. For the first time Aeneas has to go without the fox. But Nisus and Euryalus are with him.'],
      lines: [
        ['turn', 'Лис у мене, троянцю. Хочеш назад — приходь сам.', 'The fox is mine, Trojan. Want him back — come yourself.'],
        ['enei', 'Прийду. І цього разу без підказок.', 'I will. And this time without hints.'],
      ],
    },
  },
  13: {
    leave: {
      title: ['Микита на волі', 'Mykyta is free'],
      narr: ['Мотузки розрізано, і Микита спалахує всіма кольорами одразу. Вовк дивиться на порожню клітку й чухає потилицю. На вишиванці — «ключ» від тієї клітки.', 'The ropes are cut, and Mykyta flares up in every colour at once. The Wolf stares at the empty cage and scratches his head. On the shirt — “a key” to that cage.'],
      lines: [
        ['fox', 'Енею! Ти прийшов сам, без моїх підказок. Я майже ображений. Майже.', 'Aeneas! You came on your own, without my hints. I’m almost offended. Almost.'],
        ['wolf', 'Юнона знову скаже, що я винен. А я ж стеріг! Усіма стежками одразу…', 'Juno will say it’s my fault again. But I was guarding! Every path at once…'],
      ],
    },
    sail: {
      title: ['Прохання Венери', 'Venus’s plea'],
      narr: ['До двобою з Турном лишилось кілька днів. Венера біжить до свого чоловіка, кульгавого коваля Вулкана.', 'Only a few days remain before the duel with Turnus. Venus runs to her husband, the lame smith Vulcan.'],
      lines: [
        ['venus', 'Мій син іде на Турна з голими руками. Вулкане, тільки ти можеш допомогти.', 'My son is going against Turnus empty-handed. Vulcan, only you can help.'],
        ['enei', 'Мамо, я впораюсь…', 'Mother, I’ll manage…'],
        ['venus', 'Впораєшся. У новій зброї.', 'You will. In new armour.'],
      ],
    },
    arrive: {
      title: ['Кузня Вулкана', 'Vulcan’s forge'],
      narr: ['Кузня під вулканом мала б гриміти день і ніч. Але уламок погасив горн: кожен удар доводиться повторювати з нуля, і жодна деталь не встигає вистигнути.', 'The forge beneath the volcano should thunder day and night. But a shard has put out the fire: every blow has to be repeated from scratch, and no piece has time to cool.'],
      lines: [
        ['vulcan', 'Знову ти, Венеро? І з цілим військом. Ну, проходьте… обережно, тут гаряче.', 'You again, Venus? And with a whole army. Well, come in… careful, it’s hot here.'],
        ['fox', 'Я розжарений помаранчевий. Нарешті колір, у якому мені тепло.', 'I’m red-hot orange. At last a colour I feel warm in.'],
      ],
    },
  },
  14: {
    leave: {
      title: ['Зброя готова', 'The weapon is ready'],
      narr: ['Горн палає, циклопи б\'ють у лад, і Вулкан вручає Енеєві меч і щит. На вишиванці — «соти». Лишився один уламок.', 'The forge blazes, the Cyclopes strike in time, and Vulcan hands Aeneas a sword and shield. On the shirt — “honeycomb”. One shard is left.'],
      lines: [
        ['vulcan', 'Найкраща моя робота. Ну, після сітки для Марса.', 'My best work. Well, after the net for Mars.'],
        ['venus', 'Тепер іди, сину. І повернись.', 'Now go, son. And come back.'],
      ],
    },
    sail: {
      title: ['Остання пісня', 'The last song'],
      narr: ['На Олімпі Юнона віддає Турнові останній уламок як оберіг. А Вовк сидить у кутку й рахує, скільки разів йому обіцяли ліс.', 'On Olympus Juno gives Turnus the last shard as a charm. And the Wolf sits in a corner counting how many times he was promised a forest.'],
      lines: [
        ['juno', 'Тримай, Турне. Поки він у тебе — троянець не переможе.', 'Take it, Turnus. While you hold it — the Trojan won’t win.'],
        ['wolf', 'Чотирнадцять. Чотирнадцять разів «ліс на обід». А обіду так і нема.', 'Fourteen. Fourteen times “a forest for dinner”. And still no dinner.'],
      ],
    },
    arrive: {
      title: ['Двобій з Турном', 'The duel with Turnus'],
      narr: ['Два війська стоять одне проти одного. Турн виходить наперед: задачі цього двобою незнайомі, і ніхто не скаже, яка в них хитрість. Тепер — тільки Еней.', 'Two armies stand facing each other. Turnus steps forward: the problems of this duel are unfamiliar, and nobody will say which trick they need. Now it’s Aeneas alone.'],
      lines: [
        ['turn', 'Ну що, троянцю, без лиса й без підказок? Почнімо.', 'Well, Trojan, without the fox and without hints? Let’s begin.'],
        ['fox', 'Я тут, я веселковий! Підказувати не буду. Тільки вболівати.', 'I’m here, I’m rainbow! I won’t hint. Only cheer.'],
      ],
    },
  },
  15: {
    leave: {
      title: ['Писанка ціла', 'The Pysanka is whole'],
      narr: ['Оберіг вилітає з рук Турна, і тринадцять уламків злітаються докупи. Писанка знову сяє, межі між книжками стають на місце. Вишиванка Енея вишита до останнього стібка.', 'The charm flies out of Turnus’s hands, and the thirteen shards fly together. The Pysanka shines again, the borders between the books fall into place. Aeneas’s shirt is embroidered to the last stitch.'],
      lines: [
        ['turn', 'Як у Вергілія… Я програв. Але чесно.', 'Just like in Virgil… I lost. But fairly.'],
        ['juno', 'Добре. Цього разу — ваша взяла.', 'Fine. This time — you win.'],
      ],
    },
    sail: {
      title: ['Бенкет', 'The feast'],
      narr: ['Як у Котляревського — бенкет на всю губу: варенуха, галушки, ковбаси, пиріжки, книші й узвар. За столом — троянці, Сивілла, Дидона, Мавка, Кожум\'яка… і Вовк, якого нарешті нагодували.', 'As in Kotliarevsky — a feast to burst: varenukha, halushky, sausages, pies, knyshi and uzvar. At the table — the Trojans, the Sibyl, Dido, Mavka, Kozhumyaka… and the Wolf, fed at last.'],
      lines: [
        ['wolf', 'Ось він, обід! Не ліс, але краще. Енею, я з вами назавжди. Принаймні до вечері.', 'Here it is, dinner! Not a forest, but better. Aeneas, I’m with you forever. At least until supper.'],
        ['fox', 'А я знову рудий. Без жодної фарби. Додому, до лісу, — але спершу пиріжок.', 'And I’m ginger again. No paint at all. Home to the forest — but first a pie.'],
      ],
    },
    arrive: {
      title: ['Одна порожня комірка', 'One empty cell'],
      narr: ['Еней засновує нову землю. Але пізно вночі Микита дивиться на Писанку й бачить: одна комірка порожня. Юнона встигла сховати ще один уламок…', 'Aeneas founds a new land. But late at night Mykyta looks at the Pysanka and sees: one cell is empty. Juno managed to hide one more shard…'],
      lines: [
        ['fox', 'Енею… ти це бачиш? Тут бракує шматочка.', 'Aeneas… do you see this? A piece is missing here.'],
        ['enei', 'Бачу. Значить, наша дорога ще не скінчилась.', 'I see it. So our road isn’t over yet.'],
        ['juno', 'Далі буде.', 'To be continued.'],
      ],
    },
  },
};
