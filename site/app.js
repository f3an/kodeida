
(function(){
/* ================= МОВА: UA / EN ================= */
const DICT={
"Apple Silicon і Intel · .dmg":"Apple Silicon and Intel · .dmg",
"Для Mac з Intel ↓":"For Intel Macs ↓",
// завантаження
"Завантажити ·":"Download ·",
"Завантажити гру ↓":"Download the game ↓",
"Завантажити гру":"Download the game",
"Завантажити":"Download",
"остання версія":"latest version",
"Грай на своєму комп'ютері":"Play on your computer",
"Безкоштовно й офлайн, без реєстрації. Гра сама оновлюється, щойно виходить нова версія.":"Free and offline, no sign-up. The game updates itself as soon as a new version is out.",
"твоя система":"your system",
"Apple Silicon (M1 і новіші) · .dmg":"Apple Silicon (M1 and newer) · .dmg",
"Завантажити для Mac":"Download for Mac",
"Підписано й нотаризовано Apple: відкривається без попереджень.":"Signed and notarized by Apple: opens without warnings.",
"Windows 10 і 11 · інсталятор .exe":"Windows 10 and 11 · .exe installer",
"Завантажити для Windows":"Download for Windows",
"Якщо SmartScreen попередить: «Докладніше» → «Усе одно запустити».":"If SmartScreen warns you: “More info” → “Run anyway”.",
"x64 · AppImage, без встановлення":"x64 · AppImage, no installation",
"Завантажити для Linux":"Download for Linux",
"Дозволь запуск: chmod +x Kodeida-*.AppImage — і відкривай.":"Allow it to run: chmod +x Kodeida-*.AppImage — then open it.",
"Усі версії й нотатки до релізів →":"All versions and release notes →",
"вийшла 0.1":"0.1 is out",
"Вправи":"Exercises",
"Мапа":"Map",
// артбук
"Артбук · концепт v0.3":"Artbook · concept v0.3",
"Як влаштована":"Inside",
"Кодеїда":"Kodeida",
"Усе, що не потрапило на головну: анімації героїв, вишиванка-прогрес, Кришталева Писанка, карта екранів, UI-кіт, онбординг на 14 сцен, айдентика, іконка і голос гри.":"Everything that didn't fit on the main page: hero animations, the embroidered-shirt progress, the Crystal Pysanka, the screen map, the UI kit, the 14-scene onboarding, identity, the icon and the game's voice.",
"← На головну":"← Main page",
"Почати з анімацій ↓":"Start with animations ↓",
"Анімації":"Animations",
"Прогрес":"Progress",
"Писанка":"Pysanka",
"Карта екранів":"Screen map",
"UI-кіт":"UI kit",
"Онбординг":"Onboarding",
"Айдентика":"Identity",
"Іконка":"Icon",
"Голос":"Voice",
"Аркуш 1 · Анімації":"Sheet 1 · Animations",
"Спрайт-шити героїв":"Hero sprite sheets",
"Чотири стани для кожного героя: стоїть, іде, радіє, помиляється. Кожна клітинка — справжній цикл кадрів, який піде в гру.":"Four states for every hero: idle, walking, cheering, making a mistake. Each cell is a real frame loop that goes into the game.",
"Стоїть":"Idle",
"Іде":"Walks",
"Радіє":"Cheers",
"Помилка":"Error",
"Аркуш 2 · Прогрес":"Sheet 2 · Progress",
"Вишиванка Енея як карта навичок":"Aeneas's shirt as a skill map",
"Чиста сорочка на старті, перші візерунки після Карфагену, повністю вишита у фіналі. Сорочкою можна поділитися як резюме.":"A plain shirt at the start, the first patterns after Carthage, fully embroidered at the finale. The shirt can be shared like a résumé.",
"Світ 0 · Попелище Трої. Сорочка ще чиста.":"World 0 · Ashes of Troy. The shirt is still plain.",
"Після Карфагену · хвилі і два зустрічні ромби.":"After Carthage · waves and two meeting rhombs.",
"Фінал · усі 13 візерунків.":"Finale · all 13 patterns.",
"Аркуш 3 · Артефакт":"Sheet 3 · Artifact",
"Кришталева Писанка":"The Crystal Pysanka",
"Тримає світи української літератури в ладу. Шторм Еола розбив її, і кожен уламок несе один візерунок, тобто одну хитрість.":"It keeps the worlds of Ukrainian literature in order. Aeolus's storm shattered it, and every shard carries one pattern — one trick.",
"Ціла, на Олімпі":"Whole, on Olympus",
"Після шторму Еола":"After Aeolus's storm",
"хвилі":"waves",
"два зустрічні ромби":"two meeting rhombs",
"скриня з комірками":"chest with cells",
"вежа":"tower",
"ромб навпіл":"halved rhomb",
"рамка":"frame",
"ланцюжок":"chain",
"спіраль":"spiral",
"дерево життя":"tree of life",
"барвінок":"periwinkle",
"розетка":"rosette",
"зигзаг":"zigzag",
"соти":"honeycomb",
"Аркуш 4 · Карта екранів":"Sheet 4 · Screen map",
"Як гравець рухається застосунком":"How the player moves through the app",
"Сім екранів і переходи між ними. Жовтий квадратик пробігає основний шлях: заставка, меню, мапа, рівень, суд богів і назад на мапу.":"Seven screens and the transitions between them. The yellow square runs the main path: splash, menu, map, level, judgement and back to the map.",
"старт":"start",
"грати":"play",
"світ":"world",
"Запустити":"Run",
"Профіль":"Profile",
"новий візерунок":"new pattern",
"Налаштування":"Settings",
"Заставка":"Splash",
"онбординг, 14 сцен":"onboarding, 14 scenes",
"Головне меню":"Main menu",
"Продовжити мандрівку":"Continue the journey",
"Мапа світів":"World map",
"16 світів, 6 пісень":"16 worlds, 6 songs",
"Рівень":"Level",
"редактор · світ · тести":"editor · world · tests",
"5 / 5 тестів · O(n)":"5 / 5 tests · O(n)",
"Вовк: не встиг":"Wolf: too slow",
"Далі →":"Next →",
"Хитрун":"Trickster",
"2 / 13 візерунків":"2 / 13 patterns",
"Мова коду":"Code language",
"Звук":"Sound",
"Менше руху":"Reduced motion",
"Мова UI":"UI language",
"Аркуш 5 · UI-кіт":"Sheet 5 · UI kit",
"Компоненти інтерфейсу":"Interface components",
"Кнопки, вкладки, мітки, рядки тестів, репліки персонажів, сповіщення і тема редактора «Mykyta Dark».":"Buttons, tabs, tags, test rows, character lines, notifications and the “Mykyta Dark” editor theme.",
"Кнопки":"Buttons",
"🔒 Підказка":"🔒 Hint",
"Вкладки і мітки":"Tabs and tags",
"Тести":"Tests",
"✗ [1,1] → 0, очікували 1":"✗ [1,1] → 0, expected 1",
"Репліки":"Lines",
"Микита":"Mykyta",
"Оце по-лисячому! Вовк ще рахує пари.":"That's the fox way! The Wolf is still counting pairs.",
"А що, як іти з обох кінців одночасно?":"What if you walk from both ends at once?",
"Мій шторм ще не скінчився, а ти вже видихся.":"My storm isn't over and you're already worn out.",
"Вовк":"Wolf",
"Я перевірю всі пари. Всі-всі.":"I'll check every pair. Every single one.",
"Сповіщення":"Notifications",
"На вишиванці новий візерунок: «два зустрічні ромби»":"A new pattern on the shirt: “two meeting rhombs”",
"Цар Лев жалує тобі звання Хитруна":"King Lion grants you the rank of Trickster",
"Тема редактора · Mykyta Dark":"Editor theme · Mykyta Dark",
"фон":"background",
"// два вказівники":"// two pointers",
"Аркуш 6 · Онбординг":"Sheet 6 · Onboarding",
"Зачин за чотирнадцять сцен":"The opening in fourteen scenes",
"Сцени 1–10 — заставка приблизно на дві хвилини, яку можна пропустити. З одинадцятої гравець пише код. Гортайте текст праворуч (смуга прокрутки збоку) або натискайте крапки.":"Scenes 1–10 are a skippable cutscene of about two minutes. From the eleventh the player writes code. Scroll the text on the right (scrollbar on the side) or press the dots.",
"заставка":"cutscene",
"інтерактив":"interactive",
"Гравець:":"Player:",
"Дивиться.":"Watches.",
"Олімп":"Olympus",
"Змова":"The plot",
"Мішок вітрів":"The bag of winds",
"Уламки по книжках":"Shards in the books",
"Прохання Венери":"Venus's plea",
"Ліс Франка":"Franko's forest",
"Вовк і уламок":"The Wolf and the shard",
"Присяга":"The oath",
"Перший крок":"First step",
"Збори ватаги":"Gathering the crew",
"Відплиття":"Setting sail",
"Давно колись, як іще світи стояли в ладу, на Олімпі сяяла Кришталева Писанка. На її візерунках трималось усе: море в берегах, звірі в казках, задачі у відповідях. А боги бенкетували.":"Long ago, when the worlds still stood in order, the Crystal Pysanka shone on Olympus. Everything held on its patterns: seas in their shores, beasts in their tales, problems in their answers. And the gods feasted.",
"Зевс:":"Zeus:",
"Вакх:":"Bacchus:",
"Аполлон:":"Apollo:",
"Юнона:":"Juno:",
"Еол:":"Aeolus:",
"Венера:":"Venus:",
"Вовк:":"Wolf:",
"Еней:":"Aeneas:",
"Сивілла:":"Sibyl:",
"Наливай! Поки Писанка ціла, світ сам себе порахує.":"Pour it! While the Pysanka is whole, the world counts itself.",
"За лад! За задачі, що мають відповіді!":"To order! To problems that have answers!",
"А я заспіваю — гекзаметром, як годиться!":"And I shall sing — in hexameter, as is proper!",
"Святкуйте, святкуйте… Доля Енея теж у тій Писанці.":"Feast away, feast away… The fate of Aeneas is in that Pysanka too.",
"Юнона кличе Еола: доля Енея записана в Писанці, тож Писанку треба розбити.":"Juno summons Aeolus: the fate of Aeneas is written in the Pysanka, so the Pysanka must be broken.",
"Розбий її, і долі не буде. Плачу щедро: мішок золота і вічний вихідний.":"Break it, and there will be no fate. I pay well: a sack of gold and an eternal day off.",
"Ну… для вас хоч ураган.":"Well… for you, even a hurricane.",
"Еол розв'язує мішок, і вітри вириваються на волю. Хмари крутяться над Олімпом.":"Aeolus unties the bag and the winds burst free. Clouds whirl over Olympus.",
"Ану, хлопці, гуляйте!":"Off you go, lads, have fun!",
"Бахнуло так, що Зевс протверезів. Писанка на друзки, а друзки по книжках. І в кожній книжці, куди впав уламок, лад пішов шкереберть.":"The bang was so loud that Zeus sobered up. The Pysanka shattered, and the shards flew into books. In every book a shard fell into, order went topsy-turvy.",
"Бачить тизер мапи: 13 міток спалахують і гаснуть.":"Sees a teaser of the map: 13 marks flare up and fade.",
"Тринадцять уламків влітають у корінці книжок. Мапа спалахує тринадцятьма мітками і гасне.":"Thirteen shards fly into the spines of books. The map flares up with thirteen marks and goes dark.",
"Бачить тизер мапи світів.":"Sees a teaser of the world map.",
"Венера, мати Енея, біжить до Зевса. Той ще тримається за голову після бенкету, але слухає.":"Venus, the mother of Aeneas, runs to Zeus. He is still holding his head after the feast, but he listens.",
"Зевсе, батечку! Без Писанки мій Еней пропаде: його доля розсипалась по книжках.":"Zeus, dear father! Without the Pysanka my Aeneas is lost: his fate is scattered across the books.",
"Ой, голова… Добре. Хай сам збере тринадцять уламків. Слово ладу йому в поміч, а Сивілла — в провідниці.":"Oh, my head… Fine. Let him gather the thirteen shards himself. The word of order will help him, and the Sibyl will guide him.",
"А Юнона?":"And Juno?",
"А Юнона хай спробує.":"Juno can try.",
"Хто знає казку, той знає: Микита в діжу таки впаде. Але цього разу діжа була з дірою в інший світ.":"Anyone who knows the tale knows Mykyta will fall into the vat. But this time the vat had a hole into another world.",
"О, а це що за ласощі?":"Oh, and what treat is this?",
"Неподалік у траві світиться ще один уламок. Вовк Неситий, як завжди, спершу ковтає, а потім думає.":"Nearby another shard glows in the grass. The Greedy Wolf, as always, swallows first and thinks later.",
"Не пропадати ж добру!":"Can't let good food go to waste!",
"…гик!":"…hic!",
"Вовк Неситий ковтає інший уламок і гепається на підлогу палат Юнони, вже олюднений.":"The Greedy Wolf swallows another shard and thuds onto the floor of Juno's halls, already humanised.",
"Служитимеш мені, матимеш весь ліс на обід.":"Serve me, and the whole forest is yours for dinner.",
"Весь-весь? І зайців?":"The whole whole forest? Hares too?",
"Еней був парубок моторний / І кодер хоч куди козак, / На всяку задачу проворний, / Завзятіший од всіх бурлак.":"Aeneas was a lively lad / and a coder, Cossack-bold, / quick at every task he had, / keener than the boatmen old.",
"Це… Троя? А де мій ліс? І чому на мені штани?":"Is this… Troy? Where is my forest? And why am I wearing trousers?",
"Звідки ти, рудий? Тобто… сірий?":"Where are you from, ginger? I mean… grey?",
"Тисне «Перший крок» і вперше бачить редактор.":"Presses “First step” and sees the editor for the first time.",
"Уперше відкривається редактор. У ньому вже стоїть рядок enei.move(). Кнопка «Запустити» пульсує.":"The editor opens for the first time. The line enei.move() is already there. The “Run” button pulses.",
"Скажи слово, і світ послухає.":"Say the word and the world will obey.",
"Тисне «Запустити»: Еней робить крок і подає Микиті руку.":"Presses “Run”: Aeneas takes a step and gives Mykyta a hand.",
"Лад тримається на точному слові. Ліворуч слово, праворуч світ, а «Крок» показує, як світ виконує кожне слово.":"Order rests on the exact word. On the left the word, on the right the world, and “Step” shows how the world carries out every word.",
"Скажеш криво, і світ піде криво. Скажеш точно, і світ послухає.":"Say it crooked and the world goes crooked. Say it right and the world obeys.",
"Проходить тур: Сивілла показує кожну частину інтерфейсу, а потім веде на Суд богів.":"Takes the tour: the Sibyl shows every part of the interface, then leads to the Judgement of the Gods.",
"Еней збирає вцілілих троянців і зерно. Перші вправи світу 0: цикл, умова, змінна-лічильник.":"Aeneas gathers the surviving Trojans and the grain. The first exercises of world 0: a loop, a condition, a counter.",
"Збираймо своїх, і зерно не лишаймо.":"Let's gather our people and leave no grain behind.",
"Можна й руками кожен мішок… але цикл хитріший.":"You could pick up every sack by hand… but a loop is craftier.",
"Проходить вправи світу 0 і фінальну задачу Running Sum.":"Solves the exercises of world 0 and the final problem Running Sum.",
"Корабель заходить у тріщину між світами, Микита перефарбовується в морський синій. Так почалась Кодеїда.":"The ship sails into a crack between worlds, and Mykyta turns sea blue. That is how Kodeida began.",
"Чую… пахне морем і уламком. Туди!":"I smell… the sea and a shard. That way!",
"Після фінальної задачі світу 0 бачить заставку, потім відкривається мапа світів.":"After the final problem of world 0 sees this cutscene, then the world map opens.",
"Поточна сцена онбордингу":"Current onboarding scene",
"Тексти сцен онбордингу":"Onboarding scene texts",
"Аркуш 7 · Айдентика":"Sheet 7 · Identity",
"Логотип, кольори, шрифти":"Logo, colours, fonts",
"A · Голова Енея з оселедцем":"A · Aeneas's head with the forelock",
"поруч із назвою. Основний варіант.":"next to the name. The main version.",
"Коде":"Kode",
"да":"da",
"B · Крапки над «ї» стали двома уламками Писанки: червоним і лисячим.":"B · The dots over the “i” became two shards of the Pysanka: a red one and a fox one.",
"{К}":"{K}",
"C · Монограма в формі писанки для іконки застосунку.":"C · A pysanka-shaped monogram for the app icon.",
"Червона нитка":"Red thread",
"#B3202A · помилки, Юнона, орнамент":"#B3202A · errors, Juno, ornament",
"Лисячий рудий":"Fox ginger",
"#E2702B · акцент, кнопки, Микита":"#E2702B · accent, buttons, Mykyta",
"Чорна нитка":"Black thread",
"#1F1B16 · текст, контури":"#1F1B16 · text, outlines",
"Льон":"Linen",
"#EFE6D2 · тло для ілюстрацій":"#EFE6D2 · illustration background",
"Шаровари":"Sharovary",
"#2F55A0 · Еней, посилання":"#2F55A0 · Aeneas, links",
"Пояс":"Sash",
"#D9A521 · нагороди, візерунки":"#D9A521 · rewards, patterns",
"Нічний ліс":"Night forest",
"#141B17 · тема редактора":"#141B17 · editor theme",
"Кришталь":"Crystal",
"#D4ECF3 · Писанка, уламки":"#D4ECF3 · Pysanka, shards",
"Заголовки":"Headings",
"Твоя мандрівка алгоритмами":"Your journey through algorithms",
"Текст":"Body text",
"Еней дістався Карфагену. Дидона просить обгородити найбільшу ділянку, а Вовк уже перебирає всі пари стовпів.":"Aeneas has reached Carthage. Dido asks him to fence the largest plot, and the Wolf is already trying every pair of posts.",
"Код":"Code",
"Голова Енея з оселедцем-дужкою":"Aeneas's head with the brace forelock",
"Аркуш 8 · Іконка і заставка":"Sheet 8 · Icon and splash",
"Іконка застосунку і заставка запуску":"App icon and launch splash",
"Кришталева Писанка на нічному тлі з оселедцем-дужкою зліва. Заставка показує поради Сивілли, поки вантажиться застосунок.":"The Crystal Pysanka on a night background with the brace forelock on the left. The splash shows the Sibyl's tips while the app loads.",
"Порада Сивілли: якщо масив відсортований, спробуй іти з двох кінців.":"Sibyl's tip: if the array is sorted, try walking from both ends.",
"Порада Сивілли: шукаєш пару? Запам'ятовуй, що вже бачив.":"Sibyl's tip: looking for a pair? Remember what you've already seen.",
"Порада Сивілли: «так/ні» можна ділити навпіл.":"Sibyl's tip: a yes/no question can be split in half.",
"Порада Сивілли: не куй двічі те, що вже викував.":"Sibyl's tip: don't forge twice what you've already forged.",
"Іконка в доку macOS":"Icon in the macOS dock",
"Заставка запуску":"Launch splash",
"Аркуш 9 · Голос":"Sheet 9 · Voice",
"Як говорить гра":"How the game talks",
"Бурлеск Котляревського та іронія Франка. Сміємося з Юнони і Вовка, ніколи з гравця.":"Kotliarevsky's burlesque and Franko's irony. We laugh at Juno and the Wolf, never at the player.",
"Оптимальне рішення · Микита":"Optimal solution · Mykyta",
"Оце по-лисячому! Вовк ще рахує пари, а ми вже пливемо далі.":"That's the fox way! The Wolf is still counting pairs and we're already sailing on.",
"Працює, але повільно · Микита":"Works, but slowly · Mykyta",
"Так розв'язав би Вовк Неситий: O(n²). Пошукай хитрість.":"That's how the Greedy Wolf would solve it: O(n²). Look for a trick.",
"Time Limit · Юнона":"Time Limit · Juno",
"Ха! Мій шторм ще не скінчився, а ти вже видихся.":"Ha! My storm isn't over and you're already worn out.",
"Помилка · система":"Error · system",
"Еней спіткнувся на рядку 12: змінна right не оголошена.":"Aeneas stumbled on line 12: variable right is not declared.",
"Підказка · Сивілла":"Hint · Sibyl",
"Новий візерунок · система":"New pattern · system",
"На вишиванці Енея з'явилися «два зустрічні ромби».":"“Two meeting rhombs” appeared on Aeneas's shirt.",
"Ціла Писанка":"The whole Pysanka",
"Розбита Писанка":"The broken Pysanka",
// написи на полотні заставок
"дзень!":"clink!","хм…":"hmm…","ам!":"chomp!","гик!":"hic!","ватага":"crew",
// hero & static
"Open source · українською · без AI-підказок":"Open source · in Ukrainian and English · no AI hints",
"Гра, де твій код рухає героя. Разом з Енеєм і Лисом Микитою ти вивчаєш прийоми задач рівня LeetCode: два вказівники, хеш-мапи, графи, динамічне програмування. І бачиш, як працює кожен рядок.":"A game where your code moves the hero. Together with Aeneas and Mykyta the Fox you learn the techniques behind LeetCode-style problems: two pointers, hash maps, graphs, dynamic programming. And you see what every line does.",
"Подивитись, як це працює ↓":"See how it works ↓","★ GitHub · скоро":"★ GitHub · soon",
"Застосунок для Mac, Windows, Linux · офлайн":"Desktop app for Mac, Windows, Linux · works offline",
"TypeScript · JavaScript · Python, далі C# · C++ · Go":"TypeScript · JavaScript · Python, then C# · C++ · Go",
// три шляхи й Абетка
"Сім екранів і переходи між ними. Жовтий квадратик пробігає основний шлях: заставка, меню, мапа, рівень, суд богів і назад на мапу. Новий гравець у меню обирає рівень: з нуля — Абетка, трохи — світ 0, хочу задач — світ 1.":"Seven screens and the transitions between them. The yellow square runs the main path: splash, menu, map, level, judgement and back to the map. A new player picks a level in the menu: from scratch — the ABC, a little — world 0, give me problems — world 1.","Сцени 1–10 — заставка приблизно на дві хвилини, яку можна пропустити. З одинадцятої гравець пише код. Хто починає з нуля, бачить ще пролог «Абетка»: «Ніч перед бурею» після сцени 6 і «Заграву» перед сценою 7. Гортайте текст праворуч (смуга прокрутки збоку) або натискайте крапки.":"Scenes 1–10 are a skippable cutscene of about two minutes. From the eleventh the player writes code. Those starting from scratch also see the ABC prologue: “The night before the storm” after scene 6 and “The glow” before scene 7. Scroll the text on the right (scrollbar on the side) or press the dots.","🌱 Ні, з нуля":"🌱 No, from scratch","🧭 Трохи вмію":"🧭 A little","⚔️ Хочу задач":"⚔️ Give me problems",
"Три шляхи":"Three ways","Для будь-якого рівня":"For any level","Три шляхи в гру":"Three ways into the game","На старті гра питає: «Чи вмієш ти програмувати?» Від відповіді залежить, звідки почнеш. Змінити можна будь-коли, прогрес не губиться.":"At the start the game asks: “Can you code?” Your answer decides where you begin. You can change it any time without losing progress.","🌱 Ні, з нуля → Абетка":"🌱 No, from scratch → The ABC","Перша мова з нуля: Python, JavaScript чи TypeScript. Кожен урок написано саме для обраної мови, а вивід програми з'являється на сувої. Сивілла вчить Енея на українських казках у ніч перед падінням Трої.":"A first language from scratch: Python, JavaScript or TypeScript. Every lesson is written for the language you pick, and the program’s output appears on a scroll. The Sibyl teaches Aeneas on Ukrainian fairy tales the night before Troy falls.","🧭 Трохи вмію → Світ 0":"🧭 A little → World 0","Попелище Трої: одна нова ідея на вправу — команда, цикл, умова, лічильник — і перша задача з LeetCode.":"Ashes of Troy: one new idea per exercise — a command, a loop, a condition, a counter — and the first LeetCode problem.","⚔️ Так, хочу задач → Світ 1":"⚔️ Yes, give me problems → World 1","Одразу в море Еола й далі: два вказівники, хеш-мапи, стек, бінарний пошук. Світ 0 лишається відкритим для повторення.":"Straight to the sea of Aeolus and on: two pointers, hash maps, a stack, binary search. World 0 stays open for review.","Абетка, розділ 1 «Колобок»: програма виводить пісеньку, а сувій показує кожен рядок.":"The ABC, chapter 1 “The Bun”: the program prints the song, and the scroll shows every line.","Виконання Python прямо в застосунку, без встановлення, і Ліс Лиса Микити.":"Python runs right in the app, nothing to install, plus Mykyta’s Forest.","вийшла 0.2":"out in 0.2","вийшла 0.3":"out in 0.3","Абетка й світи 4–8":"The ABC and worlds 4–8","Перша мова з нуля на казках, три шляхи на старті, Рукавичка, Конотоп, Сицилія, Чумацький шлях, Пекло.":"A first language from scratch on fairy tales, three ways in, the Mitten, Konotop, Sicily, the Chumak Way, Hell.","наступний реліз":"next release","Уся кампанія від Трої до двобою з Турном, усі розділи Абетки, Книга хитрощів, вишиванка-прогрес.":"The whole campaign from Troy to the duel with Turnus, every ABC chapter, the Book of Tricks, the embroidered-shirt progress.","Новачкам — Абетка: мова з нуля":"New to code? The ABC: a language from scratch",
"Чому Кодеїда":"Why Kodeida","▶ Дивитися трейлер":"▶ Watch the trailer","Трейлер":"Trailer","Кодеїда за 50 секунд":"Kodeida in 50 seconds","Від бенкету богів до справжньої задачі з LeetCode і Абетки для новачків: як код рухає героя і чому Вовк програє хитрості.":"From the gods’ feast to a real LeetCode problem and the ABC for beginners: how code moves the hero and why the Wolf loses to a trick.","Трейлер Кодеїди":"Kodeida trailer","LeetCode без зубріння":"LeetCode without cramming",
"Більшість застосунків дають задачі. Кодеїда вчить бачити в задачі прийом і розуміти, чому він працює.":"Most apps hand you problems. Kodeida teaches you to spot the technique inside a problem and understand why it works.",
"Хитрощі, а не відповіді":"Tricks, not answers",
"Кожен світ — один прийом: два вказівники, ковзне вікно, хеш-мапа, графи, DP. Підвідні вправи ведуть до справжньої задачі.":"Each world is one technique: two pointers, sliding window, hash map, graphs, DP. Warm-up exercises lead to a real problem.",
"Бачиш, як працює код":"See your code run",
"Кнопка «Крок» виконує рядок за рядком, а герої у світі показують, що відбувається з даними.":"The Step button runs your code line by line, and the heroes in the world show what happens to the data.",
"Вовк проти Микити":"Wolf vs Mykyta",
"Після кожного рішення видно, скільки кроків зробив би перебір. Складність O(n²) і O(n) стає наочною.":"After every solution you see how many steps brute force would take. O(n²) versus O(n) becomes something you can see.",
"Українська класика":"Ukrainian classics",
"Енеїда, Франко, Леся Українка й народні казки. Сюжет, гумор і персонажі, які хочеться проходити далі.":"The Aeneid, Franko, Lesya Ukrainka and folk tales. A story, humour and characters that make you want to keep going.",
"Як це працює":"How it works","Пишеш код — світ оживає":"Write code, watch the world come alive",
"Редактор без AI, справжні тести і світ, що виконує твій код крок за кроком. Наприкінці — порівняння з рішенням Вовка, щоб було видно, навіщо хитрість.":"An editor without AI, real tests and a world that runs your code step by step. At the end you compare with the Wolf's solution, so you see why the trick matters.",
"16 світів":"16 worlds","Мандрівка світами української літератури":"A journey through Ukrainian literature",
"Від попелища Трої до кузні Вулкана: Енеїда, Франко, Леся Українка, Коцюбинський, народні казки. Кожен світ — один прийом і його мешканці.":"From the ashes of Troy to Vulcan's forge: the Aeneid, Franko, Lesya Ukrainka, Kotsiubynsky, folk tales. Each world is one technique and its inhabitants.",
"Герої":"Heroes","Еней, Лис Микита і ще 17 персонажів":"Aeneas, Mykyta the Fox and 17 more characters",
"Гравець керує Енеєм, Микита підказує і жартує, а Вовк Неситий розв'язує все перебором і програє. Звірі поза своїм світом олюднені чарами Писанки.":"You control Aeneas, Mykyta gives hints and jokes, and the Greedy Wolf brute-forces everything and loses. Outside their own world, animals are humanised by the Pysanka's magic.",
"Книга хитрощів":"Book of Tricks","Вчимо прийомів, а не відповідей":"We teach techniques, not answers",
"Кожен пройдений світ відкриває сторінку: коли брати прийом, шаблон коду, складність і живий приклад.":"Every world you finish unlocks a page: when to use the technique, a code template, complexity and a live example.",
"Фінал":"Finale","Двобій з Турном":"Duel with Turnus",
"Режим співбесіди: незнайомі задачі, таймер і жодної підказки. Перевірка, чи ти справді навчився впізнавати прийоми.":"Interview mode: unfamiliar problems, a timer and no hints. A test of whether you really learned to recognise the techniques.",
"Дорожня карта · open source":"Roadmap · open source","Що буде і коли":"What's coming and when",
"Проєкт відкритий: код, сюжет і арт можна дивитися, обговорювати й покращувати разом.":"The project is open: code, story and art are there to read, discuss and improve together.",
"MVP":"MVP","Онбординг, Попелище Трої, Море Еола, Карфаген. TypeScript і JavaScript.":"Onboarding, the Ashes of Troy, the Sea of Aeolus, Carthage. TypeScript and JavaScript.",
"зараз":"now","далі":"next","потім":"later",
"Виконання Python прямо в застосунку, без встановлення.":"Python runs right inside the app, nothing to install.",
"Уся кампанія від Трої до двобою з Турном, Книга хитрощів, вишиванка-прогрес.":"The whole campaign from Troy to the duel with Turnus, the Book of Tricks, the embroidered-shirt progress.",
"C#, C++, Go":"C#, C++, Go","Ще три мови для тих, хто готується до співбесід.":"Three more languages for interview prep.",
"Нові кампанії":"New campaigns","Алгоритми, структури даних, ООП — за останнім уламком Писанки.":"Algorithms, data structures, OOP — behind the last Pysanka shard.",
"Хочеш спробувати першим?":"Want to try it first?",
"Шукаємо перших гравців і контриб'юторів: розробників, художників, методистів.":"We're looking for first players and contributors: developers, artists, teachers.",
"★ Зірочка на GitHub":"★ Star on GitHub","Запропонувати ідею":"Suggest an idea",
"Кодеїда — open-source гра про алгоритми. Персонажі намальовані з нуля за текстами в суспільному надбанні: Котляревський, Франко, Леся Українка, Коцюбинський, Квітка-Основ'яненко, народні казки.":"Kodeida is an open-source game about algorithms. Characters are drawn from scratch after public-domain texts: Kotliarevsky, Franko, Lesya Ukrainka, Kotsiubynsky, Kvitka-Osnovianenko, folk tales.",
// journey card
"Микита:":"Mykyta:","Мешканці:":"Locals:",
// app stage
"Кодеїда · Пісня II · Карфаген Дидони":"Kodeida · Song II · Dido's Carthage","TS ▾":"TS ▾",
"Світ 2 · Карфаген":"World 2 · Carthage","✓ Зустрітися посередині":"✓ Meet in the middle","★ Задача Дидони":"★ Dido's problem",
"◇ Два вказівники":"◇ Two pointers","◇ Хвилі":"◇ Waves","світ 1":"world 1","Вишиванка":"Shirt",
"Умова":"Problem","Підказки Сивілли":"Sibyl's hints","Задача Дидони.":"Dido's problem.",
"Стовпи стоять у ряд, висота кожного в масиві":"Posts stand in a row; each height is in the array",
". Обгородь двома стовпами ділянку, що вміщає найбільше води.":". Use two posts to fence the plot that holds the most water.",
"Суд богів":"Judgement of the gods","Консоль":"Console","Світ 2 ·":"World 2 ·",
"▶ Запустити":"▶ Run","Крок":"Step","найкраще":"best",
"Оце по-лисячому! Вовк ще перебирає пари, а ми вже обгородили 49.":"Now that's foxy! The Wolf is still checking pairs, and we've already fenced 49.",
"Вовк Неситий":"Greedy Wolf","Еней і Микита":"Aeneas & Mykyta",
"● Попелище → Карфаген":"● Ashes → Carthage","Складність:":"Complexity:",
"// Задача Дидони: Еней зліва, Микита справа":"// Dido's problem: Aeneas on the left, Mykyta on the right","// Еней":"// Aeneas","// Микита":"// Mykyta",
"готово до запуску":"ready to run","перевіряємо…":"checking…","5 / 5 тестів":"5 / 5 tests","чекає":"waiting","n = 100 000: не встиг":"n = 100 000: too slow","0,8 мс":"0.8 ms",
// book
"Хитрість №2 · Карфаген":"Trick #2 · Carthage","Два вказівники":"Two pointers",
"Еней іде зліва, Микита справа, і вони рухаються назустріч.":"Aeneas starts on the left, Mykyta on the right, and they walk towards each other.",
"Коли брати":"When to use it","Масив або рядок":"The array or string is","відсортований":"sorted",
"Шукаєш":"You're looking for a","пару":"pair","з умовою: сума, площа, паліндром.":"with a condition: sum, area, palindrome.",
"Після кожного порівняння можна відкинути одну сторону.":"After each comparison you can drop one side.",
"Шаблон":"Template","час O(n)":"time O(n)","пам'ять O(1)":"memory O(1)","Задачі: 125, 167, 11, 15":"Problems: 125, 167, 11, 15",
"Живий приклад · Two Sum II":"Live example · Two Sum II","✓ знайшли":"✓ found","→ мало, Еней крок уперед":"→ too small, Aeneas steps right","← багато, Микита крок назад":"← too big, Mykyta steps left","кроки":"steps",
// boss
"Лад Енея":"Aeneas' order","Турн":"Turnus","Влучно!":"Hit!","Перемога! Писанку зібрано":"Victory! The Pysanka is whole",
"Задачі двобою":"Duel problems","Незнайома задача":"Unknown problem","Medium · тему не підказують":"Medium · topic not revealed","Фінальний удар":"Final blow","🔒 Сивілла мовчить":"🔒 The Sibyl is silent",
// characters gallery
"Усі":"All","Антагоністи":"Villains","Мешканці світів":"Locals","Варіації":"Variants",
"Еней":"Aeneas","Лис Микита":"Mykyta the Fox","Юнона":"Juno","Еол":"Aeolus","Дидона":"Dido","Цар Лев":"King Lion","Мешканці рукавички":"Mitten dwellers","Сотник Забрьоха":"Captain Zabrioha","Харон":"Charon","Анхіз":"Anchises","Мольфар":"Molfar","Сивілла":"Sibyl","Ацест":"Acestes","Чумацький віл":"Chumak ox","Мавка":"Mavka","Кирило Кожум'яка":"Kyrylo Kozhumiaka","Вулкан":"Vulcan",
"Котляревський, «Енеїда»":"Kotliarevsky, «Aeneid»","Франко, «Фарбований лис»":"Franko, «The Painted Fox»","Франко, «Лис Микита»":"Franko, «Mykyta the Fox»",
"Енеїда · Світ 1":"Aeneid · World 1","Енеїда · Світ 2":"Aeneid · World 2","Франко · Світ 3":"Franko · World 3","Народна казка · Світ 4":"Folk tale · World 4","Квітка-Основ'яненко · Світ 5":"Kvitka-Osnovianenko · World 5","Енеїда · Світ 6":"Aeneid · World 6","Чумацькі пісні · Світ 7":"Chumak songs · World 7","Енеїда · Світ 8":"Aeneid · World 8","Енеїда · Світи 8–9":"Aeneid · Worlds 8–9","Леся Українка · Світ 10":"Lesya Ukrainka · World 10","Коцюбинський · Світ 11":"Kotsiubynsky · World 11","Легенда · Світ 12":"Legend · World 12","Енеїда · Світ 14":"Aeneid · World 14","Енеїда · онбординг":"Aeneid · onboarding",
"Головний герой. Гравець завжди керує ним кодом.":"The main hero. The player always controls him with code.",
"Оселедець закручений у дужку {. Головна впізнавана риса і основа логотипа.":"His Cossack forelock curls into a { brace — his signature look and the base of the logo.",
"Вишиванка росте з гравцем: кожен уламок додає візерунок.":"His embroidered shirt grows with the player: every shard adds a pattern.",
"Статний, руки в боки, шабля при боці.":"Broad-shouldered, hands on hips, sabre at his side.",
"Основний":"Default","На старті":"At the start","Чиста сорочка, світ 0.":"Plain shirt, world 0.","У жупані":"In a zhupan","Холодні світи і мандри.":"Cold worlds and travel.","До бою":"Ready to fight","Фінальні задачі, двобій з Турном.":"Final problems, the duel with Turnus.","На бенкеті":"At the feast","Після кожного уламка.":"After every shard.",
"Маскот і помічник. Підказує, жартує, носить Книгу хитрощів.":"Mascot and sidekick. Gives hints, jokes, carries the Book of Tricks.",
"Поза своїм лісом олюднений чарами Писанки.":"Outside his forest he's humanised by the Pysanka's magic.",
"Кожен перехід між світами перефарбовує його. Оберіть колір нижче.":"Every jump between worlds repaints him. Pick a colour below.",
"Білий кінчик хвоста блимає, як курсор.":"The white tip of his tail blinks like a text cursor.",
"Олюднений":"Humanised","У рідному лісі":"In his home forest","Без чарів, на чотирьох лапах.":"No magic, on four paws.","Остромисл":"Ostromysl","Режим експерта, у короні.":"Expert mode, with a crown.","У полоні":"Captive","Табір Турна, без Книги.":"Turnus' camp, no Book.",
"Головна злодійка. Підкупила Еола розбити Писанку.":"The main villain. She bribed Aeolus to shatter the Pysanka.",
"Накладає обмеження: Time Limit, Memory Limit, великі входи.":"Imposes limits: Time Limit, Memory Limit, huge inputs.",
"Символ — павине перо, кольори фіолет і золото.":"Her symbol is the peacock feather; her colours are purple and gold.",
"У фіналі визнає поразку.":"Admits defeat in the finale.","Основна":"Default",
"Суперник-brute force на службі Юнони.":"The brute-force rival in Juno's service.",
"Проковтнув уламок і потрапив до Юнони.":"Swallowed a shard and ended up with Juno.",
"У кожному світі розв'язує в лоб і програє на великих тестах.":"In every world he brute-forces and fails on big tests.",
"У фіналі переходить на бік Енея заради бенкету.":"In the finale he switches to Aeneas' side for the feast.",
"У лівреї Юнони":"In Juno's livery","До уламка.":"Before the shard.","Жадібний":"Greedy","Заїдає провал перебором.":"Eats away the brute-force failure.","Фінал.":"Finale.",
"Фінальний бос, чемпіон Юнони в Лаціумі.":"The final boss, Juno's champion in Latium.","Двобій з ним — режим співбесіди без підказок.":"Fighting him is interview mode with no hints.","На щиті павине око Юнони.":"Juno's peacock eye is on his shield.",
"Бог вітрів із мішком вітрів. Розбив Писанку за плату.":"God of winds with a bag of winds. Shattered the Pysanka for a fee.","Затихає, коли гравець вишикує флот.":"Calms down once you line up the fleet.","На хмарі":"On a cloud",
"Цариця Карфагена з волячою шкурою.":"Queen of Carthage with an ox hide.","Задача Дидони = Container With Most Water.":"Dido's problem = Container With Most War."
};
DICT["Задача Дидони = Container With Most Water."]="Dido's problem = Container With Most Water.";
Object.assign(DICT,{
"Правитель звіриного ярмарку. Удома звірі не олюднені.":"Ruler of the animal fair. At home animals aren't humanised.","Повертає Микиті звання канцлера на мить.":"Makes Mykyta chancellor again, for a moment.",
"Мишка, жабка і зайчик у рукавичці.":"A mouse, a frog and a hare in a mitten.","Хто заліз останнім, вилазить першим: Stack.":"Last in, first out: Stack.","Рукавичка":"The Mitten",
"«Перевіряє відьом» водою, поки Еней не ділить навпіл.":"Tests «witches» with water until Aeneas starts halving.","Бінарний пошук через «тоне чи пливе».":"Binary search via «sinks or floats».","З перначем":"With a mace",
"Перевізник у пеклі, човен на двох.":"Ferryman of the underworld, a boat for two.","Boats to Save People.":"Boats to Save People.","У човні":"In the boat",
"Батько Енея. Базовий випадок рекурсії і корінь родоводу.":"Aeneas' father. The base case of recursion and the root of the family tree.","Показує Енеєві нащадків: дерева.":"Shows Aeneas his descendants: trees.","В Елісії":"In Elysium",
"Гуцульський чарівник із трембітою.":"A Hutsul wizard with a trembita.","Трембіта кличе хвилями: BFS.":"The trembita calls in waves: BFS.","З трембітою":"With a trembita",
"Провидиця. Вчить «слова ладу» і дає підказки.":"The seer. Teaches the «word of order» and gives hints.","Три рівні підказок: натяк, ідея, псевдокод.":"Three hint levels: nudge, idea, pseudocode.","З сувоєм":"With a scroll",
"Цар Сицилії, влаштовує ігри на честь Анхіза.":"King of Sicily, hosts games in Anchises' honour.","Живе табло призерів: Sliding Window і купа.":"A live leaderboard: sliding window and a heap.",
"Тягне валку степом. Повільний вказівник проти швидкого лиса.":"Pulls the wagon train across the steppe. The slow pointer against the fast fox.","Linked List Cycle: зустрінуться чи ні.":"Linked List Cycle: will they meet or not.","У ярмі":"In the yoke",
"Дух лісу. Власний образ, не з мультфільму.":"Spirit of the forest. Our own design, not the cartoon one.","Кожне дерево на своєму місці: BST.":"Every tree in its place: BST.","Весняна":"Spring",
"Заорав Змія і проклав Змієві вали.":"Ploughed the Dragon into the Serpent's Walls.","Інтервали: зшити вали, що перекриваються.":"Intervals: stitch the overlapping walls.","Зі шкурою":"With a hide",
"Коваль богів, кує Енеєві зброю.":"Smith of the gods, forges Aeneas' weapons.","Динамічне програмування: не кувати двічі.":"Dynamic programming: never forge twice.","Біля ковадла":"At the anvil",
// worlds
"Шторм":"Storm","Гостини":"Visits","Випробування":"Trials","Пекло":"Underworld","Ліси й гори":"Forests & mountains","Лаціум":"Latium",
"Попелище Трої":"Ashes of Troy","Море Еола":"Sea of Aeolus","Карфаген Дидони":"Dido's Carthage","Ліс Лиса Микити":"Mykyta's Forest","Конотоп":"Konotop","Сицилія: ігри Ацеста":"Sicily: Acestes' games","Чумацький шлях":"The Milky Way","Родовід Анхіза":"Anchises' family tree","Лісова пісня":"The Forest Song","Карпати":"Carpathians","Змієві вали":"Serpent's Walls","Табір Турна":"Turnus' camp","Кузня Вулкана":"Vulcan's forge",
"Основи: змінні, цикли, умови":"Basics: variables, loops, conditions","Масиви, сортування":"Arrays, sorting","Рекурсія, Backtracking":"Recursion, backtracking","Дерева":"Trees","Графи, BFS / DFS":"Graphs, BFS / DFS","Інтервали, Greedy":"Intervals, greedy","Найкоротший шлях":"Shortest path","Динамічне програмування":"Dynamic programming","Фінал: усі хитрощі":"Finale: every trick","Режим співбесіди":"Interview mode",
"попелястий":"ash grey","морський синій":"sea blue","тірський пурпур":"Tyrian purple","рудий, без фарби":"ginger, no paint","сніжно-білий":"snow white","нічний фіолетовий":"night violet","сонячна вохра":"sunny ochre","зоряний":"starlight","вугільно-червоний":"ember red","золотавий":"golden","весняний зелений":"spring green","хвойний смарагд":"pine emerald","теракотовий":"terracotta","темно-синій (полон)":"dark blue (captive)","розжарений помаранчевий":"forge orange","усі кольори":"all colours",
"Еней збирає ватагу і припаси на згарищі. Микита ще звикає до штанів.":"Aeneas gathers his crew and supplies in the ruins. Mykyta is still getting used to trousers.",
"Шикують розкиданий штормом флот. Микита вистежує кораблі з щогли.":"They line up the storm-scattered fleet. Mykyta spots ships from the mast.",
"Обгороджують Дидоні найбільшу ділянку, йдучи з двох кінців назустріч.":"They fence the biggest plot for Dido, walking towards each other from both ends.",
"Наводять лад на звіриному ярмарку. Микита вчить Енея запам'ятовувати.":"They bring order to the animal fair. Mykyta teaches Aeneas to remember things.",
"Впускають і випускають звірів: хто заліз останнім, вилазить першим.":"They let animals in and out: last in, first out.",
"Замість кидати в став усіх по черзі, щоразу ділять навпіл.":"Instead of dunking everyone in turn, they halve the range each time.",
"Еней змагається, Микита суддює й веде живе табло призерів.":"Aeneas competes while Mykyta judges and keeps a live leaderboard.",
"Розплутують чумацьку валку, що ходить по колу в степу.":"They untangle the chumak wagon train circling the steppe.",
"Спускаються до Анхіза і повертаються тим самим шляхом, як рекурсія.":"They descend to Anchises and climb back the same way, like recursion.",
"Відновлюють переплутаний родовід Енея.":"They restore Aeneas' tangled family tree.",
"Повертають кожне дерево Мавчиного лісу на своє місце.":"They put every tree of Mavka's forest back in its place.",
"Відновлюють зв'язок між полонинами хвилями трембіти.":"They reconnect the mountain meadows with waves of the trembita.",
"Зшивають порізані вали в суцільну оборону від зміїв.":"They stitch the cut walls into one defence against serpents.",
"Еней сам, без Микити, пробирається табором до полоненого друга.":"Alone, without Mykyta, Aeneas sneaks through the camp to his captured friend.",
"Кують зброю, не повторюючи вже викуваного.":"They forge weapons without re-forging what's already done.",
"Двобій з Турном: незнайомі задачі без підказок, лише власна тямка.":"The duel with Turnus: unfamiliar problems, no hints, only your own wits.",
"Анхіз і вцілілі троянці":"Anchises and the surviving Trojans","Еол, бог вітрів":"Aeolus, god of winds","Дидона, цариця Карфагена":"Dido, queen of Carthage","Цар Лев і звірі ярмарку":"King Lion and the fair animals","Ацест, цар Сицилії":"Acestes, king of Sicily","Чумаки та їхні воли":"Chumaks and their oxen","Харон, перевізник":"Charon the ferryman","Анхіз в Елісії":"Anchises in Elysium","Кирило Кожум'яка":"Kyrylo Kozhumiaka","Вулкан, коваль богів":"Vulcan, smith of the gods","Турн, чемпіон Юнони":"Turnus, Juno's champion",
"Сину, збирай людей і зерно. Нова земля чекає, але спершу порахуй, що лишилось.":"Son, gather the people and the grain. A new land awaits, but first count what's left.",
"Юнона заплатила за шторм, а не за порядок. Вишикуй флот, і я затихну.":"Juno paid for a storm, not for order. Line up the fleet and I'll calm down.",
"Скільки землі обгородиш шкурою, стільки й моя. Стовпи вже стоять, обери два.":"As much land as you fence with the hide is mine. The posts are up — pick two.",
"Хто що продає — ніхто не пам'ятає. Наведи лад, і Микита знову буде канцлером. На хвилинку.":"Nobody remembers who sells what. Sort it out and Mykyta is chancellor again. For a minute.",
"Хто заліз останнім, той і вилазить першим. Інакше рукавичка лусне!":"Whoever climbed in last climbs out first. Otherwise the mitten bursts!",
"Кидаємо в став кожну по черзі! Що значить «ділити навпіл»? Ну, спробуй.":"We dunk them in the pond one by one! What do you mean «split in half»? Go on, try it.",
"Ігри на честь Анхіза! Тільки табло зламалось. Хто ж переміг?":"Games in Anchises' honour! Only the scoreboard broke. So who won?",
"Валка ходить по колу третю ніч. Віл повільний, а лис швидкий — хай перевірять, чи зустрінуться.":"The wagon train has circled for three nights. The ox is slow, the fox is fast — let's see if they meet.",
"Човен на двох, і вага обмежена. Хто з ким пливе, вирішуй сам.":"The boat holds two and weight is limited. Who goes with whom is up to you.",
"Ось твій рід, сину: від кореня до найменшого листка. Знайди, де дві гілки сходяться.":"Here is your line, son, from root to the smallest leaf. Find where two branches meet.",
"Кожне дерево має своє місце: молодші ліворуч, старші праворуч. Поверни ліс, поки він не заснув.":"Every tree has its place: younger on the left, older on the right. Restore the forest before it falls asleep.",
"Трембіта кличе хвилями: спершу найближчі полонини, потім дальші. Так і шукай.":"The trembita calls in waves: the nearest meadows first, then the farther ones. Search the same way.",
"Заорав я Змія, а вали порізало на шматки. Зший їх, де перекриваються, і жодна змія не пролізе.":"I ploughed the Dragon, but the walls got cut to pieces. Stitch them where they overlap and no serpent gets through.",
"Варта всюди. Найкоротший шлях до Микити — той, де найменше дозорів.":"Guards everywhere. The shortest way to Mykyta is the one with the fewest patrols.",
"Не куй двічі те, що вже викував. Запиши — і спирайся на зроблене.":"Never forge twice what you've already forged. Write it down and build on it.",
"Ні підказок, ні Сивілли. Лише ти, твої хитрощі і мій меч.":"No hints, no Sibyl. Just you, your tricks and my sword.",
"Вцілілі троянці":"Surviving Trojans","Ацест і учасники ігор":"Acestes and the competitors","Чумаки":"Chumaks","Лукаш і Мавка":"Lukash and Mavka","Низ і Евріал":"Nisus and Euryalus","Мешканці рукавички":"Mitten dwellers"
});
Object.assign(DICT,{"Тема":"Theme","Як у системі":"Match system","Світла тема":"Light theme","Темна тема":"Dark theme","{Кодеїда":"{Kodeida","Гра":"Game","Артбук":"Artbook","Сайт":"Site","Артбук →":"Artbook →",
"Розділи":"Sections","Обкладинка":"Cover","Чому":"Why","Світи":"Worlds","Хитрощі":"Tricks","Бос-файт":"Boss fight","Дорожня карта":"Roadmap","Мова / Language":"Language / Мова",
"Еней, Кришталева Писанка і Лис Микита":"Aeneas, the Crystal Pysanka and Mykyta the Fox",
"Анімований макет застосунку Кодеїда: розв'язок задачі Дидони крок за кроком":"Animated mock-up of the Kodeida app: solving Dido's problem step by step",
"Мапа світів і картка поточного світу. Стрілки ← → перемикають світи.":"World map and the current world card. Arrow keys ← → switch worlds.",
"Мапа мандрівки Енея: шість островів-пісень і шістнадцять світів, з'єднаних маршрутом":"Map of Aeneas' journey: six song-islands and sixteen worlds joined by a route",
"Попередній світ":"Previous world","Наступний світ":"Next world","Еней і Микита в поточному світі":"Aeneas and Mykyta in the current world",
"Категорія":"Category","Персонажі":"Characters","Обраний персонаж":"Selected character","Фарба світу":"World paint",
"Візерунок «два зустрічні ромби»":"The «two meeting diamonds» pattern","Два вказівники шукають пару з сумою 31":"Two pointers look for a pair that sums to 31",
"Графік кількості кроків: O(n²) проти O(n)":"Chart of step counts: O(n²) versus O(n)","Еней з шаблею проти Турна на полі Лаціуму":"Aeneas with a sabre against Turnus on the field of Latium",
"Як це працює":"How it works"
});
const RULES=[
 [/^Завантажити для (\S+) ↓$/,(m)=>`Download for ${m[1]} ↓`],
 [/^версія ([\d.]+)(?: · (.+))?$/,(m)=>`version ${m[1]}${m[2]?' · '+m[2]:''}`],
 [/^(.+) · (\d+) МБ$/,(m)=>`${m[1]} · ${m[2]} MB`],
 [/^Сцена (\d+) · (.+)$/,(m)=>`Scene ${m[1]} · ${tr(m[2])}`],
 [/^Сцена (\d+): (.+)$/,(m)=>`Scene ${m[1]}: ${tr(m[2])}`],
 [/^(\d+) \/ (\d+) · (.+)$/,(m)=>`${m[1]} / ${m[2]} · ${tr(m[3])}`],
 [/^(\d+) кадр(?:ів|и|) · (\d+) fps$/,(m)=>`${m[1]} frames · ${m[2]} fps`],
 [/^Світ (\d+) · Пісня ([IVX]+) · (.+)$/,(m)=>`World ${m[1]} · Song ${m[2]} · ${tr(m[3])}`],
 [/^Світ (\d+): (.+)$/,(m)=>`World ${m[1]}: ${tr(m[2])}`],
 [/^Фарба світу (\d+): (.+)$/,(m)=>`World ${m[1]} paint: ${tr(m[2])}`],
 [/^Еней і Микита у світі (.+)$/,(m)=>`Aeneas and Mykyta in ${tr(m[1])}`],
 [/^крок (\d+) \/ 8 · left=(\d+) right=(\d+) · площа (\d+)$/,(m)=>`step ${m[1]} / 8 · left=${m[2]} right=${m[3]} · area ${m[4]}`],
 [/^найкраще: (\d+)$/,(m)=>`best: ${m[1]}`],
 [/^([IVX]+) · (.+)$/,(m)=>`${m[1]} · ${tr(m[2])}`],
 [/^(.*) → 0,8 мс$/,(m)=>`${m[1]} → 0.8 ms`],
 [/^(\d+) \/ 36 пар$/,(m)=>`${m[1]} / 36 pairs`],
 [/^(\d+) кроків$/,(m)=>`${m[1]} steps`],
 [/^пробує \((\d+), (\d+)\)…$/,(m)=>`trying (${m[1]}, ${m[2]})…`],
 [/^ціль (\d+) · сума (\d+)\+(\d+)=(\d+) (.+)$/,(m)=>`target ${m[1]} · sum ${m[2]}+${m[3]}=${m[4]} ${tr(m[5])}`],
 [/^Вовк O\(n²\): (\d+)$/,(m)=>`Wolf O(n²): ${m[1]}`],
 [/^Микита O\(n\): (\d+)$/,(m)=>`Mykyta O(n): ${m[1]}`],
];
function tr(s){if(DICT[s]!==undefined)return DICT[s];for(const [re,fn] of RULES){const m=s.match(re);if(m)return fn(m);}return s;}
let LANG='uk';
const IS_ARTBOOK=document.body&&document.body.dataset.page==='artbook';
try{LANG=localStorage.getItem('kd-lang')||((navigator.language||'').toLowerCase().startsWith('uk')?'uk':'en');}catch(e){LANG=(navigator.language||'').toLowerCase().startsWith('uk')?'uk':'en';}
const T=s=>LANG==='en'?tr(s):s;
globalThis.__kodeidaT=T;
const UA=new WeakMap();
function trNode(n){const v=n.nodeValue;if(n.__tr!==undefined&&v===n.__tr)return;UA.set(n,v);const m=v.match(/^(\s*)([\s\S]*?)(\s*)$/);const out=LANG==='en'?m[1]+tr(m[2])+m[3]:v;n.__tr=out;if(out!==v)n.nodeValue=out;}
function retranslate(root){
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest('script,style,.stash'))return NodeFilter.FILTER_REJECT;return /[А-Яа-яЇїІіЄєҐґ]/.test(UA.get(n)??n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;}});
  let n;while((n=w.nextNode())){const ua=UA.get(n)??n.nodeValue;n.__tr=undefined;n.nodeValue=ua;trNode(n);}
  root.querySelectorAll('[aria-label]').forEach(el=>{if(el.closest('.stash'))return;if(el.__ariaUA===undefined)el.__ariaUA=el.getAttribute('aria-label');el.setAttribute('aria-label',LANG==='en'?tr(el.__ariaUA):el.__ariaUA);});
  root.querySelectorAll('[title]').forEach(el=>{if(el.closest('.stash'))return;if(el.__titleUA===undefined)el.__titleUA=el.getAttribute('title');el.setAttribute('title',LANG==='en'?tr(el.__titleUA):el.__titleUA);});
}
const mo=new MutationObserver(ms=>{for(const m of ms){
  if(m.type==='characterData'){const n=m.target;if(n.parentElement&&!n.parentElement.closest('script,style,.stash'))trNode(n);}
  else m.addedNodes.forEach(a=>{if(a.nodeType===3){if(a.parentElement&&!a.parentElement.closest('.stash'))trNode(a);}else if(a.nodeType===1&&!a.closest('.stash'))retranslateLight(a);});}});
function retranslateLight(el){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(/[А-Яа-яЇїІіЄєҐґ]/.test(n.nodeValue))trNode(n);
  if(LANG==='en')[el,...el.querySelectorAll('[aria-label]')].forEach(e=>{if(!e.getAttribute)return;const a=e.getAttribute('aria-label');if(a&&/[А-Яа-яЇїІіЄєҐґ]/.test(a)){e.__ariaUA=a;e.setAttribute('aria-label',tr(a));}});}
function setLang(l){
  LANG=l;try{localStorage.setItem('kd-lang',l);}catch(e){}
  document.documentElement.lang=l==='en'?'en':'uk';document.title=IS_ARTBOOK?(l==='en'?'Kodeida Artbook':'Артбук Кодеїди'):(l==='en'?'Kodeida':'Кодеїда');
  const tv=document.getElementById('trailerVideo');if(tv){const b=tv.dataset[l==='en'?'en':'uk'];if(tv.getAttribute('src')!==b+'.mp4'){tv.pause();tv.poster=b+'.jpg';tv.src=b+'.mp4';}}
  document.querySelectorAll('img[data-uk]').forEach(i=>{const s=i.dataset[l==='en'?'en':'uk'];if(i.getAttribute('src')!==s)i.src=s;if(i.dataset.altEn){if(i.__altUA===undefined)i.__altUA=i.alt;i.alt=l==='en'?i.dataset.altEn:i.__altUA;}});
  const word=document.querySelector('#heroTitle [data-split]:not(.brace)');if(word)word.textContent=l==='en'?'Kodeida':'Кодеїда';
  mo.disconnect();retranslate(document.body);mo.observe(document.body,{subtree:true,childList:true,characterData:true});
  document.querySelectorAll('#lang button').forEach(b=>{const on=b.dataset.l===l;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
  if(typeof fitAllPublic==='function')fitAllPublic();
}

const DPR = Math.min(window.devicePixelRatio || 1, 2);
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- colour helpers ---------- */
/* Переклад написів на полотні сцен: сайт і гра підставляють свою функцію в globalThis.__kodeidaT. */
const ST=s=>(typeof globalThis!=='undefined'&&typeof globalThis.__kodeidaT==='function')?globalThis.__kodeidaT(s):s;
function toRgb(c){
  if(c.startsWith('rgb'))return c.match(/\d+/g).slice(0,3).map(Number);
  let h=c.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');
  const n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];
}
function shade(c,a){const [r,g,b]=toRgb(c);const t=a<0?0:255,p=Math.abs(a);const f=v=>Math.round((t-v)*p+v);return `rgb(${f(r)},${f(g)},${f(b)})`;}
function luminance(c){const [r,g,b]=toRgb(c).map(v=>v/255);return .2126*r+.7152*g+.0722*b;}
function hash(x,y){const s=Math.sin(x*12.9898+y*78.233)*43758.5453;return s-Math.floor(s);}

/* ---------- canvas ---------- */
function setup(canvas,w,h,fluid){
  canvas.width=Math.round(w*DPR);canvas.height=Math.round(h*DPR);
  canvas.style.width=fluid?'100%':w+'px';
  const ctx=canvas.getContext('2d');ctx.setTransform(DPR,0,0,DPR,0,0);ctx.imageSmoothingEnabled=false;
  return ctx;
}
const RGB_CACHE=new Map();
function rgbOf(c){let v=RGB_CACHE.get(c);if(!v){v=toRgb(c);RGB_CACHE.set(c,v);}return v;}
function px(ctx,x,y,s,col){ctx.fillStyle=col;ctx.fillRect(Math.round(x),Math.round(y),s,s);}

/* ---------- tiny pixel rasteriser ---------- */
class Spr{
  constructor(w,h){this.w=w;this.h=h;this.p=new Array(w*h).fill(null);this.v=0;}
  set(x,y,c){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=this.w||y>=this.h)return;this.p[y*this.w+x]=c;this.v++;}
  get(x,y){if(x<0||y<0||x>=this.w||y>=this.h)return null;return this.p[y*this.w+x];}
  fill(pts,c){pts.forEach(([x,y])=>{const col=typeof c==='function'?c(x,y):c;if(col)this.set(x,y,col);});return this;}
  /* Очистити для повторного малювання: той самий буфер і те саме полотно, без нових текстур щокадру. */
  clear(){this.p.fill(null);this.v++;return this;}
  erase(pts){pts.forEach(([x,y])=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<this.w&&y<this.h)this.p[y*this.w+x]=null;});this.v++;return this;}
  outline(amt){
    const out=[];
    for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){
      if(this.get(x,y))continue;
      const n=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>this.get(x+a,y+b)).find(Boolean);
      if(n)out.push([x,y,n]);
    }
    out.forEach(([x,y,n])=>this.set(x,y,shade(n,-amt)));
    this.ol=new Set(out.map(([x,y])=>y*this.w+x));
    return this;
  }
  /* Швидкий шлях: спрайт один раз стає маленьким полотном (ImageData), далі — один drawImage з масштабом.
     Кеш скидається, коли спрайт змінюється (set/erase). Без DOM (Node) — малюємо по пікселю, як раніше. */
  canvas(){
    if(this._cv&&this._cvV===this.v)return this._cv;
    const cv=this._cv||document.createElement('canvas');cv.width=this.w;cv.height=this.h;
    const c=cv.getContext('2d'),img=c.createImageData(this.w,this.h),d=img.data;
    for(let i=0;i<this.p.length;i++){const col=this.p[i];if(!col)continue;const q=rgbOf(col);d[i*4]=q[0];d[i*4+1]=q[1];d[i*4+2]=q[2];d[i*4+3]=255;}
    c.putImageData(img,0,0);this._cv=cv;this._cvV=this.v;return cv;
  }
  draw(ctx,ox,oy,s,crop){
    const [x0,y0,x1,y1]=crop||[0,0,this.w,this.h];
    if(typeof document!=='undefined'&&ctx.drawImage){
      const smooth=ctx.imageSmoothingEnabled;ctx.imageSmoothingEnabled=false;
      ctx.drawImage(this.canvas(),x0,y0,x1-x0,y1-y0,Math.round(ox),Math.round(oy),(x1-x0)*s,(y1-y0)*s);
      ctx.imageSmoothingEnabled=smooth;return;
    }
    for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const c=this.p[y*this.w+x];if(c)px(ctx,ox+(x-x0)*s,oy+(y-y0)*s,s,c);}
  }
}
/* draw sprite A dissolving into sprite B (same size); p = 0..1 */
function drawMix(ctx,a,b,p,ox,oy,s){
  for(let y=0;y<a.h;y++)for(let x=0;x<a.w;x++){const c=(hash(x,y)<p?b:a).p[y*a.w+x];if(c)px(ctx,ox+x*s,oy+y*s,s,c);}
}
function ell(cx,cy,rx,ry){const p=[];for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const dx=(x-cx)/rx,dy=(y-cy)/ry;if(dx*dx+dy*dy<=1)p.push([x,y]);}return p;}
function rect(x,y,w,h){const p=[];for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)p.push([i,j]);return p;}
function poly(pts){
  const p=[],ys=pts.map(q=>q[1]);
  for(let y=Math.floor(Math.min(...ys));y<=Math.ceil(Math.max(...ys));y++){
    const sy=y+0.5,xs=[];
    for(let i=0;i<pts.length;i++){const [ax,ay]=pts[i],[bx,by]=pts[(i+1)%pts.length];if((ay<=sy&&by>sy)||(by<=sy&&ay>sy))xs.push(ax+(sy-ay)*(bx-ax)/(by-ay));}
    xs.sort((a,b)=>a-b);
    for(let k=0;k+1<xs.length;k+=2)for(let x=Math.ceil(xs[k]-0.5);x<=Math.floor(xs[k+1]-0.5);x++)p.push([x,y]);
  }
  return p;
}
function line(x0,y0,x1,y1,t=1){
  const p=[],n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))*2+1;
  for(let i=0;i<=n;i++){
    const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;
    if(t<=1){p.push([Math.round(x),Math.round(y)]);continue;}
    const r=t/2;
    for(let yy=Math.floor(y-r);yy<=Math.ceil(y+r);yy++)for(let xx=Math.floor(x-r);xx<=Math.ceil(x+r);xx++)if((xx-x)**2+(yy-y)**2<=r*r)p.push([xx,yy]);
  }
  return p;
}
function path(pts,t){return pts.slice(1).flatMap((q,i)=>line(pts[i][0],pts[i][1],q[0],q[1],t));}

const BK='#1f1b16',RD='#b3202a',RDs='#7e1219',GD='#d9a521',GDs='#a87a12',WH='#f6f1e6';

/* ================= ГЕРОЇ ================= */

/* Еней. level: 0 чиста сорочка, 1 частково, 2 повністю вишита.
   o.pose: 'akimbo' | 'sabre' | 'mug';  o.coat: жупан;  o.blink: кліпає */
function makeEnei(level=2,o={}){
  const s=new Spr(46,72);
  const pose=o.pose||'akimbo';
  const SK='#eab48a',SKs='#c98a62',SC='#dba57c',HR='#2b1a10',HRh='#6a4428',
        SH=o.coat?'#7a1f2b':'#f4efe3',SHs=o.coat?'#561520':'#d3c9b6',SHIRT='#f4efe3',SHIRTs='#d3c9b6',
        BL='#2f55a0',BLs='#203a72',BLh='#4b76c4',BT='#8e2020',BTs='#5e1414',ST='#cdd2da',STs='#8d949e';
  // чоботи і шаровари
  s.fill(poly([[12,59],[20,59],[20,66],[21,68],[8,68],[8,66],[11,64]]),(x,y)=>y>65?BTs:BT);
  s.fill(poly([[26,59],[34,59],[35,64],[38,66],[38,68],[25,68],[26,66]]),(x,y)=>(y>65||x>31)?BTs:BT);
  s.fill(poly([[14,44],[32,44],[37,52],[34,60],[25,60],[23,53],[21,60],[12,60],[9,52]]),(x,y)=>x>28?BLs:BL);
  [[13,47,11,57],[19,46,18,58],[28,46,29,58],[34,48,35,56]].forEach(([a,b,c,d])=>s.fill(line(a,b,c,d),BLs));
  s.fill(line(16,46,14,56),BLh);s.fill(line(25,47,26,57),BLh);
  // сорочка з орнаментом
  const orn=(x,y)=>{if(level===0)return null;const d=Math.abs(x-23);if(d>2)return null;if(level===1&&y>32)return null;const k=(d+y)%4;return k===0?RD:(k===2?BK:null);};
  s.fill(poly([[11,25],[35,25],[33,31],[31,41],[15,41],[13,31]]),(x,y)=>orn(x,y)||(x>28?SHIRTs:SHIRT));
  if(level===2)[[17,30],[29,30],[17,36],[29,36]].forEach(([x,y])=>{s.set(x,y,RD);s.set(x-1,y+1,RD);s.set(x+1,y+1,RD);s.set(x,y+2,RD);});
  // ліва рука в бік
  s.fill(poly([[11,25],[15,27],[11,35],[6,34]]),(x,y)=>y>31?SHs:SH);
  s.fill(poly([[6,33],[11,34],[16,40],[13,43]]),(x,y)=>(level>0&&y>=38&&!o.coat)?RD:SHs);
  // права рука за позою
  if(pose==='akimbo'){
    s.fill(poly([[35,25],[31,27],[35,35],[40,34]]),SHs);
    s.fill(poly([[40,33],[35,34],[30,40],[33,43]]),(x,y)=>(level>0&&y>=38&&!o.coat)?RDs:SHs);
  }else if(pose==='sabre'){
    s.fill(poly([[33,25],[36,27],[41,14],[38,12]]),(x,y)=>(level>0&&y<17&&!o.coat)?RD:SHs);
  }else if(pose==='mug'){
    s.fill(poly([[35,25],[31,27],[35,35],[40,34]]),SHs);
    s.fill(poly([[36,34],[40,33],[38,27],[34,28]]),SHs);
  }
  if(level>0&&!o.coat){s.fill(line(8,30,13,28),RD);s.fill(line(38,30,33,28),RD);}
  if(level===2&&!o.coat){s.fill(line(8,31,13,29),BK);s.fill(line(38,31,33,29),BK);}
  // жупан
  if(o.coat){
    const CO='#7a1f2b',COs='#561520';
    s.fill(poly([[11,25],[19,25],[19,57],[10,57],[12,41]]),(x,y)=>CO);
    s.fill(poly([[35,25],[27,25],[27,57],[36,57],[34,41]]),(x,y)=>COs);
    s.fill(line(19,25,19,57),GD);s.fill(line(27,25,27,57),GD);
    s.fill(line(10,57,19,57),GD);s.fill(line(27,57,36,57),GD);
  }
  // комір
  s.fill(rect(19,24,9,2),level>0?RD:SHIRTs);
  if(level===2)s.fill(rect(19,24,9,1),(x)=>x%2?GD:RD);
  // пояс
  s.fill(rect(14,40,19,4),(x,y)=>y===41?GD:(y===43?RDs:RD));
  s.fill(poly([[15,43],[19,43],[18,53],[14,52]]),(x,y)=>y>=51?GD:RD);
  // долоні
  s.fill(ell(14.5,41.5,2.2,2.2),SK);
  if(pose==='akimbo')s.fill(ell(31.5,41.5,2.2,2.2),SKs);
  // шабля
  if(pose==='sabre'){
    s.fill(line(34,44,40,64,1.6),'#3a2a1c');
    s.fill(line(40,10,45,0,1.6),ST);s.fill(line(41,10,45,1),STs);
    s.fill(rect(37,11,5,1),GD);s.fill(ell(39.5,12.5,2,2),SKs);
  }else{
    s.fill(line(34,44,40,64,1.6),ST);s.fill(line(35,45,41,64),STs);
    s.fill(rect(33,42,3,2),GD);s.fill(rect(32,44,5,1),GDs);
  }
  if(pose==='mug'){
    s.fill(rect(33,19,6,7),(x,y)=>y===19?WH:(x>36?'#6b4420':'#8b5a2b'));
    s.fill(rect(33,20,6,1),'#e9dcb8');
    s.set(39,21,'#6b4420');s.set(40,22,'#6b4420');s.set(40,23,'#6b4420');s.set(39,24,'#6b4420');
    s.fill(ell(36,27,2,2),SKs);
  }
  // голова
  s.fill(rect(20,21,7,4),(x)=>x>24?SKs:SK);
  s.fill(ell(16.5,16,1.6,2.2),SKs);s.fill(ell(29.5,16,1.6,2.2),SKs);
  s.fill(ell(23,15,6.6,7.6),(x,y)=>y<10?SC:(x>25?SKs:SK));
  s.fill(rect(19,12,3,1),HR);s.fill(rect(25,12,3,1),HR);
  s.fill(rect(20,14,2,1),o.blink?SKs:BK);s.fill(rect(25,14,2,1),o.blink?SKs:BK);
  if(pose==='mug'){s.set(19,16,'#e0897a');s.set(27,16,'#e0897a');}
  s.fill(line(23,14,23,17),SKs);s.set(24,17,SKs);
  s.fill(path([[23,18],[20,18],[18,19],[17,21],[16,25]],2),HR);
  s.fill(path([[23,18],[26,18],[28,19],[29,21],[30,25]],2),HR);
  // оселедець у формі {
  s.fill(path([[23,9],[22,6],[20,3]],2),HR);
  s.fill(path([[20,3],[17,2],[15,3],[14,5],[14,10],[13,12],[11,13],[13,14],[14,16],[14,22],[15,25],[17,26]],1),HR);
  s.fill(path([[21,4],[19,3]],1),HRh);
  return s.outline(0.62);
}

/* Лис Микита, олюднений. o: rainbow, cursorOff, crown, chains, sad */
const RAINBOW=['#b3202a','#e2702b','#d9a521','#4f9d4a','#2f6db5','#6b3fa0'];
function makeFox(fur,o={}){
  const s=new Spr(42,60);
  const F=(x,y)=>o.rainbow?RAINBOW[Math.floor((y+x/2)/5)%RAINBOW.length]:fur;
  const Fs=(x,y)=>shade(F(x,y),-0.24);
  const W='#f7f3ea',Ws='#d9d2c3',DK='#2a211a',VE='#24302b',VEs='#18201c',TR='#6b4b2a',TRs='#4d361e',SH='#f4efe3',SHs='#d3c9b6';
  s.fill(poly([[24,44],[30,47],[36,43],[39,35],[38,28],[34,29],[34,37],[28,42]]),(x,y)=>x>35?Fs(x,y):F(x,y));
  if(!o.cursorOff)s.fill(ell(36.5,27.5,2.6,2.8),W);
  s.fill(poly([[9,52],[16,52],[16,57],[6,57],[6,55]]),DK);
  s.fill(poly([[20,52],[27,52],[30,55],[30,57],[20,57]]),DK);
  s.fill(poly([[11,41],[26,41],[27,53],[20,53],[18,47],[16,53],[9,53]]),(x,y)=>x>22?TRs:TR);
  s.fill(poly([[11,26],[25,26],[27,41],[9,41]]),(x,y)=>{if(x>=16&&x<=20)return (x===16||x===20)?GD:W;return x>22?VEs:VE;});
  s.fill(rect(10,39,17,1),(x)=>x%2?RD:GD);
  s.fill(rect(10,40,17,2),'#1f6b4a');
  s.fill(poly([[11,27],[13,30],[10,36],[7,34]]),SH);
  s.fill(poly([[7,33],[10,36],[16,37],[15,34]]),SHs);
  s.fill(rect(11,32,9,8),(x,y)=>(x===11||y===39)?RDs:RD);
  [[13,34],[13,35],[12,36],[13,37],[13,38],[18,34],[18,35],[19,36],[18,37],[18,38]].forEach(([x,y])=>s.set(x,y,GD));
  s.fill(ell(15.5,36,1.5,1.3),DK);
  if(o.chains){
    // руки скуті, книга відібрана
    s.erase(rect(11,32,9,8));s.fill(rect(11,32,9,8),(x,y)=>x>=16&&x<=20?W:VE);
    s.fill(poly([[25,27],[29,31],[23,37],[21,35]]),SHs);
    s.fill(ell(15,36,1.6,1.4),DK);s.fill(ell(21,36,1.6,1.4),DK);
    s.fill(rect(13,35,10,2),(x)=>x%2?'#9aa1a9':'#5f666e');
    s.fill(line(18,37,24,50),'#7f868e');s.fill(ell(24,52,2.2,2.2),'#4a5058');
  }else{
    s.fill(poly([[25,27],[29,31],[27,33],[24,30]]),SH);
    s.fill(poly([[27,32],[29,31],[31,23],[29,23]]),SHs);
    s.fill(rect(28,25,4,2),RD);
    s.fill(ell(30,22,1.7,1.7),DK);s.set(30,19,DK);s.set(30,20,DK);
  }
  s.fill(ell(18,25,4,2.5),W);
  s.fill(poly([[10,10],[12,0],[17,7]]),F);s.fill(poly([[12,8],[12.5,3],[15,7]]),DK);
  s.fill(poly([[19,7],[24,0],[26,10]]),Fs);s.fill(poly([[21,7],[23.5,3],[24,8]]),DK);
  s.fill(ell(18,12,8,6),(x,y)=>x>21?Fs(x,y):F(x,y));
  s.fill(poly([[10,12],[26,12],[23,19],[18,24],[13,19]]),(x,y)=>x>21?Fs(x,y):F(x,y));
  s.fill(poly([[10,13],[15,15],[18,24],[12,18]]),W);
  s.fill(poly([[26,13],[21,15],[18,24],[24,18]]),Ws);
  if(o.sad){
    s.fill(rect(13,14,3,1),BK);s.fill(rect(20,14,3,1),BK);
    s.fill(line(12,11,15,12),BK);s.fill(line(24,11,21,12),BK);
    s.fill(line(16,24,19,24),DK);
  }else{
    s.fill(rect(13,13,3,1),'#f0b429');s.set(15,13,BK);s.fill(line(12,12,16,12),BK);
    s.fill(rect(20,13,3,1),'#f0b429');s.set(20,13,BK);s.fill(line(20,12,24,12),BK);
    s.fill(line(16,24,19,23),DK);
  }
  s.fill(rect(17,21,3,2),BK);
  if(o.crown){s.fill(poly([[13,7],[24,7],[24,2],[22,4.5],[18.5,1],[15,4.5],[13,2]]),GD);s.set(18,4,RD);s.set(15,5,'#1fa3a3');s.set(22,5,'#1fa3a3');}
  return s.outline(0.62);
}

/* Лис у рідному лісі: звичайний звір на чотирьох лапах */
function makeFoxWild(fur){
  const s=new Spr(50,32),Fs=shade(fur,-0.24),W='#f7f3ea',DK='#2a211a';
  s.fill(poly([[12,14],[4,8],[0,12],[1,18],[6,22],[13,19]]),fur);s.fill(ell(2,11,2.6,2.6),W);
  [[14,20],[19,21],[30,21],[35,20]].forEach(([x,y],i)=>s.fill(rect(x,y,3,10),(xx,yy)=>yy>=y+5?DK:(i%2?Fs:fur)));
  s.fill(ell(25,17,12,6),(x,y)=>y>19?Fs:fur);
  s.fill(ell(36,19,3,4),W);
  s.fill(ell(40,12,6,5),fur);
  s.fill(poly([[43,10],[49,14],[43,17]]),fur);s.fill(poly([[42,14],[49,14],[44,17]]),W);
  s.set(49,13,BK);s.set(48,13,BK);
  s.fill(poly([[36,9],[37,2],[40,7]]),fur);s.fill(poly([[39,7],[42,2],[43,9]]),Fs);s.set(37,5,DK);s.set(41,5,DK);
  s.fill(rect(41,10,2,1),BK);
  return s.outline(0.62);
}

/* Вовк Неситий у лівреї Юнони. o: drool (1..4), food, feast */
function makeWolf(o={}){
  const s=new Spr(48,66);
  const G='#6f747c',Gs='#50545b',Gh='#959ba3',ML='#b9bdc2',MLs='#9a9ea4',PU='#5b3591',PUs='#41246d',TE='#1fa3a3',TR='#5e4630',TRs='#45321f',RP='#8b6b3e',CL='#f4efe3';
  s.fill(ell(14,61,5.5,2.6),G);s.fill(ell(33,61,5.5,2.6),Gs);
  [[9,62],[11,63],[13,63],[30,63],[32,63],[34,62]].forEach(([x,y])=>s.set(x,y,CL));
  s.fill(poly([[12,46],[35,46],[37,59],[28,59],[24,52],[20,59],[10,59]]),(x,y)=>(y>=58&&x%3===0)?null:(x>28?TRs:TR));
  s.fill(rect(14,52,3,3),'#7a6040');
  s.fill(rect(12,44,23,2),RP);s.fill(line(15,46,14,51),RP);
  s.fill(poly([[10,26],[15,28],[11,43],[6,45],[4,38]]),(x,y)=>x<8?Gh:G);
  s.fill(poly([[37,26],[32,28],[36,43],[41,45],[43,38]]),Gs);
  [[5,46],[7,47],[9,46],[38,46],[40,47],[42,46]].forEach(([x,y])=>s.set(x,y,CL));
  s.fill(poly([[11,25],[36,25],[35,45],[12,45]]),(x,y)=>(x===12||x===35||y===44)?GD:(x>28?PUs:PU));
  s.fill(ell(23.5,34,4.2,4.2),GD);s.fill(ell(23.5,34,2.8,2.8),TE);s.fill(ell(23.5,34,1.2,1.2),'#1b3f8f');
  if(o.feast){
    s.fill(poly([[16,25],[31,25],[27,35],[20,35]]),(x,y)=>y>=33?RD:CL);
    s.fill(line(41,40,45,30),'#c9ced6');s.fill(ell(45,29,1.3,1.6),'#c9ced6');
  }
  if(o.food){
    s.fill(line(7,46,6,35,1.6),CL);s.fill(ell(6,30,4.6,5.2),'#9a4a24');s.fill(ell(5,28.5,2.2,2),'#c46a3c');s.fill(ell(7.5,33,1.4,1),'#7a3418');
    s.fill(ell(4.8,24,1.4,1.3),CL);s.fill(ell(7.2,24,1.4,1.3),CL);s.fill(ell(7,45.5,2.6,2.2),'#6f747c');
  }
  s.fill(poly([[14,12],[15,1],[21,9]]),G);s.fill(poly([[16,10],[16,4],[19,9]]),'#3a2f2a');
  s.fill(poly([[26,9],[32,1],[33,12]]),Gs);s.fill(poly([[28,9],[31,4],[31,10]]),'#3a2f2a');
  s.fill(ell(23.5,16,9.5,7.5),(x,y)=>x>27?Gs:G);
  s.fill(poly([[17,17],[30,17],[28,26],[19,26]]),(x,y)=>x>26?MLs:ML);
  s.fill(rect(21,17,5,2),BK);
  s.fill(rect(19,22,9,3),'#6e1212');
  [[19,22],[21,22],[23,22],[25,22],[27,22],[20,24],[24,24],[26,24]].forEach(([x,y])=>s.set(x,y,CL));
  s.set(22,24,'#d0505a');s.set(23,24,'#d0505a');
  if(o.feast){
    [[17,14],[18,13],[19,13],[20,14],[26,14],[27,13],[28,13],[29,14]].forEach(([x,y])=>s.set(x,y,BK));
  }else{
    s.fill(rect(18,14,2,1),'#f2c230');s.fill(rect(27,14,2,1),'#f2c230');
    s.fill(line(16,12,20,13),BK);s.fill(line(31,12,27,13),BK);
  }
  const d=o.drool===undefined?3:o.drool;
  for(let i=0;i<d;i++)s.set(27,25+i,'#bfe3f2');
  return s.outline(0.62);
}

/* Вовк у рідному лісі */
function makeWolfWild(){
  const s=new Spr(56,36),G='#6f747c',Gs='#50545b',ML='#b9bdc2';
  s.fill(poly([[13,14],[5,18],[2,26],[6,27],[13,20]]),Gs);
  [[15,22],[21,23],[34,23],[40,22]].forEach(([x,y],i)=>s.fill(rect(x,y,4,12),i%2?Gs:G));
  s.fill(ell(28,18,15,7),(x,y)=>y>21?Gs:G);
  s.fill(ell(26,13,10,2.4),'#858a92');
  s.fill(ell(44,13,7,6),G);
  s.fill(poly([[47,11],[55,15],[54,18],[46,18]]),ML);
  s.set(55,14,BK);s.set(54,14,BK);
  s.fill(rect(49,18,4,2),'#c0392b');
  s.fill(poly([[40,9],[41,1],[44,7]]),G);s.fill(poly([[44,7],[47,1],[48,9]]),Gs);
  s.fill(rect(45,11,2,1),'#f2c230');
  return s.outline(0.62);
}

/* Юнона. o.shimmer — інший кадр павиних очей */
function makeJuno(o={}){
  const s=new Spr(52,76);
  const GR='#2e8b57',TE=o.shimmer?'#5fd0cf':'#1fa3a3',DB='#1b3f8f',PU='#6b3fa0',PUs='#4a2a78',SK='#eec09a',SKs='#cf9b75',HR='#2a1d14';
  for(let i=0;i<9;i++){
    const a=(-152+i*15.5)*Math.PI/180,ex=26+Math.cos(a)*26,ey=40+Math.sin(a)*27;
    s.fill(line(26,40,ex,ey,2),GR);s.fill(ell(ex,ey,3,3.4),TE);s.fill(ell(ex,ey,1.6,1.8),DB);s.set(ex,ey,GD);
  }
  s.fill(poly([[19,28],[33,28],[37,50],[42,72],[10,72],[15,50]]),(x,y)=>x>28?PUs:PU);
  s.fill(rect(10,70,33,2),GD);
  s.fill(rect(16,40,20,2),(x)=>x%3?GD:GDs);
  s.fill(line(26,42,26,70),PUs);s.fill(line(20,46,17,70),PUs);s.fill(line(32,46,36,70),'#3b2163');
  s.fill(poly([[19,29],[15,31],[14,40],[18,41],[18,33]]),PU);
  s.fill(ell(17,41,1.8,1.6),SK);
  s.fill(poly([[33,29],[37,31],[39,41],[36,42],[34,33]]),PUs);
  s.fill(line(39,24,39,70,1.6),'#6b4420');s.fill(line(39,24,39,30,1.6),GD);
  s.fill(ell(39,21,2.6,2.8),GD);s.fill(ell(39,21,1.5,1.7),TE);s.set(39,21,DB);
  s.fill(ell(38,42,1.8,1.6),SKs);
  s.fill(rect(23,23,6,5),SK);
  s.fill(ell(26,16,8,8),HR);
  s.fill(poly([[18,16],[21,16],[21,30],[17,32]]),HR);
  s.fill(poly([[34,16],[31,16],[31,30],[35,32]]),HR);
  s.fill(path([[21,27],[26,30],[31,27]],1),GD);s.set(26,30,RD);
  s.fill(ell(26,18,5.6,6.6),(x,y)=>x>28?SKs:SK);
  s.fill(poly([[19,11],[33,11],[33,6],[31,9],[29,4],[26,8],[23,4],[21,9],[19,6]]),(x,y)=>x>29?GDs:GD);
  s.set(26,9,RD);s.set(22,9,'#1fa3a3');s.set(30,9,'#1fa3a3');
  s.fill(rect(23,18,2,1),BK);s.fill(rect(28,18,2,1),BK);
  s.fill(line(22,16,25,15),HR);s.fill(line(27,15,30,16),HR);
  s.fill(rect(25,22,3,1),RD);
  return s.outline(0.62);
}

/* ================= NPC СВІТІВ ================= */

/* Еол на хмарі з мішком вітрів */
function makeEol(){
  const s=new Spr(64,60);
  const SK='#e8b892',SKs='#c98f6c',CH='#f0a08a',HR='#e2eaf2',HRs='#b9c7d6',RO='#3a6ea5',ROs='#2b5487',BAG='#8b5a2b';
  s.fill(poly([[20,30],[44,30],[46,46],[18,46]]),(x)=>x>36?ROs:RO);
  s.fill(ell(10,30,7,8),(x,y)=>y>33?'#6b4420':BAG);s.fill(rect(9,21,3,2),GD);
  s.fill(poly([[20,31],[13,35],[11,32],[19,29]]),SK);
  s.fill(poly([[44,31],[52,26],[54,29],[45,35]]),SKs);s.fill(ell(54,26,2,2),SKs);
  s.fill(ell(32,10,11,7),HR);
  [[22,8,15,2],[24,5,19,0],[42,8,49,2],[40,5,45,0],[32,3,32,0]].forEach(([a,b,c,d])=>s.fill(line(a,b,c,d,2),HR));
  s.fill(ell(32,18,9,10),(x,y)=>x>35?SKs:SK);
  s.fill(ell(24,21,4,4),CH);s.fill(ell(40,21,4,4),shade(CH,-0.12));
  s.fill(rect(27,15,3,1),BK);s.fill(rect(35,15,3,1),BK);
  s.fill(rect(26,13,5,1),HRs);s.fill(rect(34,13,5,1),HRs);
  s.fill(ell(32,24,1.6,1.6),'#7a2a2a');
  s.fill(poly([[24,26],[40,26],[36,40],[28,40]]),(x)=>x>33?HRs:HR);
  s.fill(ell(16,50,14,9),(x,y)=>y>52?'#b8c6d4':'#e4ebf2');
  s.fill(ell(32,47,16,11),(x,y)=>y>52?'#b8c6d4':'#eef3f8');
  s.fill(ell(48,50,14,9),(x,y)=>y>52?'#b8c6d4':'#e4ebf2');
  return s.outline(0.6);
}

/* Боги Олімпу. o.raise — права рука вгору (кадр анімації: тост, акорд, змах тризубом). */
function makeGod(kind,o={}){
  const s=new Spr(48,74);
  const P={
    zeus:{ro:'#f1ece0',ros:'#cfc6b4',sa:GD,sk:'#efbf98',sks:'#cf9b75',hr:'#f4f4f4',hrs:'#cfd3d8',beard:1},
    apollo:{ro:'#e9a23b',ros:'#b9761f',sa:'#f6efe0',sk:'#f0c49c',sks:'#cf9b75',hr:'#f2cf5a',hrs:'#c9a13a'},
    bacchus:{ro:'#6b3fa0',ros:'#4a2a78',sa:'#5fa04a',sk:'#f0b48e',sks:'#cf8f6c',hr:'#5b3a20',hrs:'#3a2414',beard:1},
    neptune:{ro:'#1fa3a3',ros:'#16797a',sa:'#d4ecf3',sk:'#e8b892',sks:'#c98f6c',hr:'#9fe3c8',hrs:'#5fb79c',beard:1},
    venus:{ro:'#f2a7b8',ros:'#d47e93',sa:'#f6efe0',sk:'#f6d0b0',sks:'#dcae8c',hr:'#f2cf5a',hrs:'#c9a13a'},
  }[kind];
  const cx=24;
  // тога
  s.fill(poly([[16,30],[32,30],[36,52],[40,72],[8,72],[12,52]]),(x)=>x>27?P.ros:P.ro);
  s.fill(line(15,32,33,52,2),P.sa);
  s.fill(rect(8,70,33,2),P.ros);
  [[19,52,17,70],[26,50,27,70],[32,54,35,70]].forEach(([a,b,c,d])=>s.fill(line(a,b,c,d),P.ros));
  // ліва рука вниз
  s.fill(poly([[16,31],[11,34],[10,46],[14,46],[15,36]]),P.ro);s.fill(ell(12,47,2,2),P.sk);
  // права рука: вниз або вгору з річчю
  const up=!!o.raise,hx=up?40:37,hy=up?14:46;
  if(up)s.fill(poly([[31,31],[36,30],[42,16],[39,14],[34,26]]),P.ros);
  else s.fill(poly([[32,31],[37,34],[38,46],[34,46],[33,36]]),P.ros);
  s.fill(ell(hx,hy,2,2),P.sks);
  // шия й голова
  s.fill(rect(21,24,6,6),P.sk);
  s.fill(ell(cx,16,7,8),P.hr);
  s.fill(ell(cx,18,5.6,6.6),(x)=>x>cx+2?P.sks:P.sk);
  s.fill(rect(cx-4,17,2,1),BK);s.fill(rect(cx+2,17,2,1),BK);
  if(kind==='zeus'||kind==='bacchus'){s.fill(ell(cx-4,20,1.6,1.2),'#f08a8a');s.fill(ell(cx+4,20,1.6,1.2),'#f08a8a');}
  if(kind==='bacchus')s.fill(ell(cx,20,1.6,1.4),'#e0504a');
  if(P.beard){s.fill(poly([[cx-6,20],[cx+6,20],[cx+5,29],[cx,33],[cx-5,29]]),(x)=>x>cx+1?P.hrs:P.hr);s.fill(rect(cx-2,22,4,1),'#7a2a2a');}
  else s.fill(rect(cx-1,22,3,1),'#b3202a');
  if(kind==='venus'){s.fill(poly([[cx-8,14],[cx-5,14],[cx-6,34],[cx-9,32]]),P.hr);s.fill(poly([[cx+8,14],[cx+5,14],[cx+6,34],[cx+9,32]]),P.hrs);}
  // корони й вінки
  if(kind==='zeus'){s.fill(poly([[cx-6,10],[cx+6,10],[cx+6,5],[cx+4,8],[cx+2,3],[cx,7],[cx-2,3],[cx-4,8],[cx-6,5]]),(x)=>x>cx+2?GDs:GD);s.set(cx,8,RD);}
  if(kind==='apollo'||kind==='bacchus'){const c=kind==='apollo'?'#3f7a3a':'#5fa04a';for(let a=0;a<9;a++){const an=Math.PI*(1.05+a*0.11);s.fill(ell(cx+Math.cos(an)*8,13+Math.sin(an)*5,1.6,1.2),c);}
    if(kind==='bacchus')[[cx-7,12],[cx+7,12],[cx-8,15]].forEach(([x,y])=>s.fill(ell(x,y,1.6,1.6),'#6b3fa0'));}
  if(kind==='neptune')s.fill(poly([[cx-6,10],[cx+6,10],[cx+5,6],[cx+3,9],[cx,5],[cx-3,9],[cx-5,6]]),'#d4ecf3');
  if(kind==='venus')s.fill(ell(cx+6,10,2,2),'#e0504a');
  // речі
  if(kind==='zeus'){const gx=hx,gy=hy-6;s.fill(rect(gx-2,gy,5,5),GD);s.fill(rect(gx-1,gy+5,3,2),GDs);s.fill(rect(gx-2,gy-1,5,1),'#f7e3a1');
    s.fill(path([[9,40],[6,48],[9,48],[5,58]],1.4),'#f7e27a');}
  if(kind==='apollo'){const lx=up?hx-4:hx-6,ly=up?hy-10:hy-8;s.fill(path([[lx,ly+12],[lx-2,ly],[lx+1,ly-2]],1.2),GD);s.fill(path([[lx+8,ly+12],[lx+10,ly],[lx+7,ly-2]],1.2),GD);s.fill(rect(lx,ly+11,9,2),GDs);[2,4,6].forEach(k=>s.fill(line(lx+k,ly+1,lx+k,ly+11),'#f6efe0'));}
  if(kind==='bacchus'){const ax=hx,ay=hy-8;s.fill(ell(ax,ay+3,4,5),(x,y)=>y>ay+4?'#8a4a24':'#b8693a');s.fill(rect(ax-1,ay-4,3,3),'#8a4a24');s.fill(line(ax-4,ay,ax-5,ay+4),'#8a4a24');}
  if(kind==='neptune'){s.fill(line(hx,hy+20,hx,hy-14,1.4),'#c9a466');s.fill(path([[hx-4,hy-18],[hx-4,hy-12],[hx+4,hy-12],[hx+4,hy-18]],1.2),GD);s.fill(line(hx,hy-12,hx,hy-20,1.2),GD);}
  if(kind==='venus'){s.fill(ell(hx,hy-3,2.4,2.4),'#e0504a');s.fill(line(hx,hy,hx,hy+5),'#3f7a3a');}
  return s.outline(0.6);
}

/* Дидона з волячою шкурою-стрічкою */
function makeDido(){
  const s=new Spr(46,72);
  const SK='#d9a77e',SKs='#b8875f',HR='#1a1210',RO='#7b2d6b',ROs='#5a1f4f',HIDE='#9a6a3a';
  s.fill(poly([[15,26],[31,26],[34,48],[39,70],[7,70],[12,48]]),(x)=>x>27?ROs:RO);
  s.fill(rect(7,68,33,2),GD);s.fill(rect(13,40,20,2),(x)=>x%3?GD:GDs);
  s.fill(line(23,42,23,68),ROs);s.fill(line(17,46,13,68),ROs);
  s.fill(poly([[31,27],[35,30],[37,39],[34,40],[32,32]]),ROs);s.fill(ell(35,40,1.8,1.6),SKs);
  s.fill(poly([[15,27],[11,30],[9,38],[12,39],[14,32]]),RO);
  s.fill(ell(9,42,6,6),HIDE);s.erase(ell(9,42,2.6,2.6));s.fill(ell(9,42,4.3,4.3).filter(([x,y])=>(x+y)%3===0),'#6e4a26');
  s.fill(path([[13,46],[18,58],[16,66]],1.6),HIDE);
  s.fill(ell(11,38,1.8,1.6),SK);
  s.fill(rect(20,21,7,5),SK);
  s.fill(ell(23,14,7,8),HR);
  s.fill(poly([[15,14],[18,14],[18,34],[14,36]]),HR);s.fill(poly([[31,14],[28,14],[28,34],[32,36]]),HR);
  s.fill(ell(23,16,5.5,6.6),(x)=>x>25?SKs:SK);
  s.fill(rect(17,9,13,2),GD);s.set(23,8,RD);s.set(23,9,RD);
  s.fill(rect(20,15,2,1),BK);s.fill(rect(25,15,2,1),BK);s.set(19,15,BK);s.set(27,15,BK);
  s.fill(rect(22,20,3,1),'#a3243a');
  s.fill(path([[19,26],[23,29],[27,26]],1),GD);
  return s.outline(0.6);
}

/* Рукавичка з мешканцями */
function makeMitten(){
  const s=new Spr(76,58),R='#c0242e',Rs='#8a1620',CU='#f4eee2',CUs='#d6cdbb',HOLE='#5a2a20';
  // тіло рукавички і великий палець
  s.fill(ell(64,23,6,8.5),(x,y)=>x>66?Rs:R);
  s.fill(ell(46,38,27,15),(x,y)=>y>44?Rs:R);
  for(let x=26;x<72;x++)for(let y=35;y<=40;y++){const k=(Math.round(Math.abs(y-37.5))+x)%5;if(k===0)s.set(x,y,GD);else if(k===2)s.set(x,y,WH);}
  // віконце: рукавичка стала хаткою
  s.fill(rect(50,26,7,6),'#f2c75c');s.fill(rect(53,26,1,6),'#6b4420');s.fill(rect(50,28,7,1),'#6b4420');
  // хутряний манжет з отвором, повернутим до глядача
  s.fill(ell(19,38,10,17),(x,y)=>x>24?CUs:CU);
  for(let y=23;y<54;y+=3){const hw=Math.floor(10*Math.sqrt(Math.max(0,1-((y-38)/17)**2)))-1;if(hw<2)continue;s.set(19-hw+((y>>1)%2),y,RD);s.set(19+hw-((y>>1)%2),y,BK);}
  s.fill(ell(19,38,6.5,13),HOLE);
  // мешканці малюються окремим шаром і отримують власний темний контур, щоб читатися на тлі отвору
  const L=new Spr(76,58);
  {const s=L;
  // заєць: вуха стирчать з отвору догори
    s.fill(line(16,27,13,8,2.2),'#d8d2c8');s.fill(line(22,27,25,8,2.2),'#d8d2c8');
    s.fill(line(15.5,24,13.5,11),'#e7a3ad');s.fill(line(22.5,24,24.5,11),'#e7a3ad');
    s.fill(ell(19,29,4.5,3.4),'#e3ddd3');s.set(17,29,BK);s.set(21,29,BK);s.set(19,31,'#e58a9a');
    // мишка
    s.fill(ell(15,35.5,1.8,1.8),'#a39c96');s.fill(ell(15,35.5,1,1),'#e9a8b2');s.fill(ell(17,38,3.2,2.8),'#a39c96');s.set(16,37,BK);s.set(18,37,BK);s.set(17,39,'#e58a9a');
    // жабка
    s.fill(ell(21,44,4.2,2.6),'#5fa04a');s.fill(ell(19.2,41.5,1.6,1.6),'#5fa04a');s.fill(ell(22.8,41.5,1.6,1.6),'#5fa04a');
    s.set(19,41,WH);s.set(23,41,WH);s.set(19,42,BK);s.set(23,42,BK);s.fill(line(19,45,23,45),'#2f5a28');
  }
  const mask=new Set();
  for(let y=0;y<58;y++)for(let x=0;x<76;x++){const c=L.get(x,y);if(c){s.set(x,y,c);mask.add(y*76+x);}}
  s.kind='mitten';s.animMask=mask;
  return s.outline(0.6);
}

/* Сотник Забрьоха з перначем */
function makeSotnyk(){
  const s=new Spr(46,72);
  const SK='#e6ad85',SKs='#c58660',CO='#8e1c22',COs='#651419',BL='#2f55a0',BLs='#203a72',FUR='#2a1d14';
  s.fill(poly([[11,61],[20,61],[20,68],[7,68]]),'#3a2416');s.fill(poly([[26,61],[35,61],[39,68],[26,68]]),'#2a1a10');
  s.fill(poly([[12,50],[34,50],[36,62],[25,62],[23,56],[21,62],[10,62]]),(x)=>x>27?BLs:BL);
  s.fill(ell(23,40,14,13),(x,y)=>x>28?COs:CO);
  s.fill(poly([[13,26],[33,26],[36,40],[10,40]]),(x)=>x>28?COs:CO);
  s.fill(line(23,27,23,52),GD);
  s.fill(rect(11,44,25,3),(x,y)=>y===45?'#e6c15a':GD);
  s.fill(poly([[13,27],[8,40],[11,42],[15,31]]),CO);s.fill(ell(10,42,2,2),SK);
  s.fill(poly([[33,27],[38,36],[36,38],[31,31]]),COs);s.fill(ell(37,37,2,2),SKs);
  s.fill(line(37,30,37,52,1.6),GDs);s.fill(ell(37,28,2.6,3),GD);
  s.fill(rect(19,22,9,4),SK);
  s.fill(ell(23,17,7.5,7.5),(x)=>x>26?SKs:SK);
  s.fill(ell(17,19,1.8,1.8),'#e48a7a');s.fill(ell(29,19,1.8,1.8),'#e48a7a');
  s.fill(rect(16,4,15,7),FUR);s.fill(poly([[18,4],[28,4],[33,1],[30,6]]),RD);s.set(32,1,GD);
  s.fill(rect(19,15,2,1),BK);s.fill(rect(26,15,2,1),BK);
  s.fill(path([[23,20],[19,21],[16,24],[15,28]],2),'#4a3220');s.fill(path([[23,20],[27,21],[30,24],[31,28]],2),'#4a3220');
  return s.outline(0.6);
}

/* Харон у човні */
function makeCharon(){
  const s=new Spr(60,76);
  const RO='#3b3a40',ROs='#26252a',BONE='#d8d2c3',WOOD='#4b2e1c';
  s.fill(line(46,2,49,74,1.8),'#6b4a2a');
  s.fill(poly([[19,22],[35,22],[40,62],[14,62]]),(x)=>x>30?ROs:RO);
  s.fill(ell(27,15,8,9),RO);s.fill(ell(27,17,4.6,5.4),'#0b0a0c');
  s.set(25,17,'#f2c230');s.set(29,17,'#f2c230');
  s.fill(poly([[34,27],[45,30],[45,33],[34,32]]),ROs);s.fill(ell(46,31,2,2),BONE);
  s.fill(poly([[20,28],[11,36],[13,38],[22,32]]),RO);s.fill(ell(11,38,2.2,1.8),BONE);s.set(10,36,GD);s.set(11,36,GD);
  s.fill(poly([[2,62],[58,62],[50,73],[10,73]]),(x,y)=>y>68?'#2f1c10':WOOD);
  s.fill(line(4,63,56,63),'#6b4a2a');
  return s.outline(0.6);
}

/* Мольфар з трембітою */
function makeMolfar(){
  const s=new Spr(50,76);
  const SK='#e2ad86',SKs='#bf8a64',SH='#f4efe3',SHs='#d3c9b6',KE='#efe2c3',KEs='#d3c29a',FUR='#2a211a',PA='#b3202a',PAs='#7e1219',BE='#cfd3d8';
  s.fill(line(41,74,45,2,2.2),'#c9b48a');s.fill(line(42,74,46,3),'#9c8458');s.fill(ell(45.5,3,2.4,2),'#9c8458');
  s.fill(poly([[11,66],[20,66],[20,71],[8,71]]),'#7a5432');s.fill(poly([[26,66],[35,66],[38,71],[26,71]]),'#5c3e24');
  s.fill(poly([[13,46],[33,46],[35,67],[25,67],[23,56],[21,67],[11,67]]),(x)=>x>27?PAs:PA);
  s.fill(poly([[12,25],[34,25],[33,47],[13,47]]),(x)=>x>28?SHs:SH);
  s.fill(poly([[12,25],[19,25],[19,47],[11,47]]),KE);s.fill(poly([[34,25],[27,25],[27,47],[35,47]]),KEs);
  s.fill(line(19,25,19,47),FUR);s.fill(line(27,25,27,47),FUR);s.fill(rect(11,46,25,1),FUR);
  [[14,29,RD],[16,32,'#2e8b57'],[14,36,GD],[16,40,RD],[30,29,RD],[32,32,'#2e8b57'],[30,36,GD],[32,40,RD]].forEach(([x,y,c])=>{s.set(x,y,c);s.set(x+1,y,c);s.set(x,y+1,c);s.set(x+1,y+1,c);});
  s.fill(rect(12,44,23,3),(x)=>x%2?'#6b4420':'#8b5a2b');
  s.fill(poly([[12,26],[8,40],[11,42],[15,31]]),SHs);s.fill(ell(10,42,2,2),SKs);
  s.fill(poly([[34,26],[41,30],[41,33],[34,31]]),SHs);s.fill(ell(42,31,2,2),SK);
  s.fill(rect(20,21,7,5),SK);
  s.fill(ell(23,16,6.4,7.2),(x)=>x>25?SKs:SK);
  s.fill(poly([[17,19],[29,19],[27,30],[19,30]]),BE);
  s.fill(path([[23,20],[19,21],[17,25]],2),BE);s.fill(path([[23,20],[27,21],[29,25]],2),BE);
  s.fill(rect(19,15,2,1),BK);s.fill(rect(25,15,2,1),BK);s.fill(rect(18,13,4,1),BE);s.fill(rect(24,13,4,1),BE);
  s.fill(rect(11,9,25,3),BK);s.fill(rect(15,2,17,8),BK);
  s.fill(rect(15,7,17,2),(x)=>['#b3202a','#d9a521','#2e8b57','#2f55a0'][x%4]);
  s.fill(line(31,3,37,0),'#d9a521');s.set(36,0,RD);
  return s.outline(0.6);
}

/* ================= HD: подвоєна роздільність, світло, тінь, фактура, дрібні деталі ================= */
function tagged(fn,kind){return function(...a){const s=fn(...a);s.kind=kind;s.args=a;return s;};}
makeEnei=tagged(makeEnei,'enei');makeFox=tagged(makeFox,'fox');makeWolf=tagged(makeWolf,'wolf');makeJuno=tagged(makeJuno,'juno');
makeFoxWild=tagged(makeFoxWild,'foxwild');makeWolfWild=tagged(makeWolfWild,'wolfwild');
function colDist(a,b){const p=toRgb(a),q=toRgb(b);return Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])+Math.abs(p[2]-q[2]);}
function lum(c){const [r,g,b]=toRgb(c);return .2126*r+.7152*g+.0722*b;}
/* HD: без старого контуру → scale2x → світло/тінь → деталі → cel-лінії між частинами → тонкий зовнішній контур */
function makeHD(b){
  const PAD=1,W=b.w*2+PAD*2,H=b.h*2+PAD*2,h=new Spr(W,H);h.noHD=true;h.pad=PAD;
  const base=(x,y)=>{if(x<0||y<0||x>=b.w||y>=b.h)return null;const i=y*b.w+x;return (b.ol&&b.ol.has(i))?null:b.p[i];};
  for(let y=0;y<b.h;y++)for(let x=0;x<b.w;x++){
    const P=base(x,y),A=base(x,y-1),B=base(x+1,y),C=base(x-1,y),D=base(x,y+1);
    const q=[C===A&&C!==D&&A!==B?A:P,A===B&&A!==C&&B!==D?B:P,D===C&&D!==B&&C!==A?C:P,B===D&&B!==A&&D!==C?D:P];
    q.forEach((c,k)=>{if(c)h.p[(y*2+(k>>1)+PAD)*W+x*2+(k&1)+PAD]=c;});
  }
  const src=h.p.slice(),empty=(x,y)=>x<0||y<0||x>=W||y>=H||!src[y*W+x];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x,c=src[i];if(!c)continue;
    const L=empty(x-2,y-2)||empty(x-1,y-2),D=empty(x+2,y+2)||empty(x+1,y+2);
    let out=c;
    if(L&&!D)out=shade(c,0.16);else if(D&&!L)out=shade(c,-0.18);
    else if(hash(x,y)<0.04&&src[i-1]===c&&src[i+1]===c&&src[i-W]===c&&src[i+W]===c)out=shade(c,-0.07);
    h.p[i]=out;
  }
  hdDetails(b,h);
  // cel-лінії: межа між різними матеріалами темнішає з боку темнішого пікселя
  const cur=h.p.slice(),mark=new Uint8Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,a=cur[i];if(!a)continue;
    [[1,0],[0,1]].forEach(([dx,dy])=>{const j=(y+dy)*W+x+dx;if(x+dx>=W||y+dy>=H)return;const c=cur[j];if(!c)return;
      if(colDist(a,c)>150)mark[lum(a)<lum(c)?i:j]=1;});}
  for(let i=0;i<W*H;i++)if(mark[i])h.p[i]=shade(cur[i],-0.55);
  // зовнішній контур 1 HD-піксель
  const fin=h.p.slice();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(fin[y*W+x])continue;
    const n=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,c])=>{const X=x+a,Y=y+c;return X<0||Y<0||X>=W||Y>=H?null:fin[Y*W+X];}).find(Boolean);
    if(n)h.p[y*W+x]=shade(n,-0.72);}
  return h;
}
function hdDetails(b,h){
  const P=h.pad,get=(x,y)=>h.get(x+P,y+P),put=(x,y,c)=>h.set(x+P,y+P,c),set=(x,y,c)=>{if(get(x,y))put(x,y,c);};
  const fur=(k,amt)=>{for(let y=0;y<h.h;y++)for(let x=0;x<h.w;x++){if(hash(x*3+k,y*7)<0.03&&h.get(x,y)&&h.get(x+1,y+1)){h.set(x,y,shade(h.get(x,y),-amt));h.set(x+1,y+1,shade(h.get(x+1,y+1),-amt));}}};
  const o=(b.args&&b.args[1])||{};
  if(b.kind==='enei'&&!o.blink){
    // спокійні очі: темні зіниці 2×3 з відблиском, без «білків»
    [[40,50],[50,60]].forEach(([x0])=>{for(let x=x0-1;x<=x0+4;x++){const sk=get(x,31)||get(x,32);for(let y=27;y<=30;y++)if(get(x,y))put(x,y,sk);}
      for(let y=27;y<=29;y++){put(x0+1,y,'#2a1a10');put(x0+2,y,'#2a1a10');}put(x0+1,27,'#ffffff');});
    if((o.pose||'akimbo')!=='sabre'){set(71,95,'#ffffff');set(74,103,'#ffffff');}
  }
  if(b.kind==='fox'){
    const d='#2a211a';
    [[33,44,29,43],[33,46,29,47],[41,44,45,43],[41,46,45,47]].forEach(([a,c,e,f])=>line(a,c,e,f).forEach(([x,y])=>{if(get(x,y))put(x,y,'#5a4a40');}));
    fur(1,0.1);
  }
  if(b.kind==='wolf'||b.kind==='wolfwild'){fur(2,0.2);if(!o.feast&&b.kind==='wolf'){set(36,28,'#ffffff');set(54,28,'#ffffff');}}
  if(b.kind==='foxwild')fur(3,0.1);
  if(b.kind==='mitten'&&b.animMask){
    // тонкий контур навколо звірят: 1 HD-піксель (≈2px на екрані)
    const W=h.w,H=h.h,A=new Uint8Array(W*H);
    b.animMask.forEach(i=>{const x=i%b.w,y=(i/b.w)|0;for(let k=0;k<4;k++){const X=x*2+(k&1)+P,Y=y*2+(k>>1)+P;A[Y*W+X]=1;}});
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(A[i]||!h.p[i])continue;
      if((x>0&&A[i-1])||(x<W-1&&A[i+1])||(y>0&&A[i-W])||(y<H-1&&A[i+W]))h.p[i]='#1f1b16';}
  }
  if(b.kind==='juno'){[[52,17],[44,17],[60,17],[52,59]].forEach(([x,y])=>set(x,y,'#ffffff'));}
}
const hdOf=s=>s.noHD?s:(s.hd||(s.hd=makeHD(s)));
const _sprDraw=Spr.prototype.draw;
Spr.prototype.draw=function(ctx,ox,oy,s,crop){
  if(!this.noHD&&s>=2&&s%2===0){const h=hdOf(this),q=s/2;return _sprDraw.call(h,ctx,ox-q*h.pad,oy-q*h.pad,q,crop&&crop.map(v=>v*2+h.pad));}
  return _sprDraw.call(this,ctx,ox,oy,s,crop);
};

/* ================= КРИШТАЛЕВА ПИСАНКА ================= */
function eggCells(W,H){
  const cx=(W-1)/2,cy=(H-1)/2,mask=[];
  for(let y=0;y<H;y++){mask.push([]);const v=(y-cy)/cy;const half=(W/2)*Math.sqrt(Math.max(0,1-v*v))*(1+0.12*v);for(let x=0;x<W;x++)mask[y].push(Math.abs(x-cx)<=half-0.35);}
  const b1=Math.floor(H*0.3),b2=Math.floor(H*0.66),cells=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    if(!mask[y][x])continue;
    const edge=!(mask[y-1]&&mask[y-1][x])||!(mask[y+1]&&mask[y+1][x])||!mask[y][x-1]||!mask[y][x+1];
    const facet=((x*2+y)%5===0)?'j':((x>cx+W*0.18)?'s':'i');
    let c;
    if(edge)c='k';
    else if(y===b1||y===b2||y===b1+1||y===b2+1)c=(y===b1||y===b2)?'y':'z';
    else if(y<b1)c=((Math.abs(x-Math.round(cx))+y)%4===0)?'r':facet;
    else if(y>b2)c=(((y-b2)%3)===(Math.abs((x%4)-2)%3))?'r':facet;
    else{const a=(x+y)%6,b=((x-y)%6+6)%6;c=(a===0||b===0)?'r':((a===3&&b===3)?'k':facet);}
    cells.push({x,y,c});
  }
  return {cells,cx,cy};
}
const EGG_PAL={k:'#1f1b16',y:GD,z:GDs,r:RD,i:'#d4ecf3',j:'#a7d6e6',s:'#b6dcea'};
function drawEgg(ctx,W,H,ox,oy,s,broken,glow,spread=0.16,glowR=0.95){
  const {cells,cx,cy}=eggCells(W,H);
  if(glow){const R=W*glowR;for(let y=Math.floor(cy-R);y<=cy+R;y++)for(let x=Math.floor(cx-R);x<=cx+R;x++){const d=Math.hypot(x-cx,(y-cy)*0.85);
    if(d<R*0.6||(d<R*0.8&&(x+y)%2===0)||(d<R&&x%2===0&&y%2===0))px(ctx,ox+x*s,oy+y*s,s,'#f7e3a1');}}
  const N=7,sec={};
  cells.forEach(c=>{const a=Math.atan2(c.y-cy,c.x-cx)+Math.PI;sec[c.x+','+c.y]=Math.floor((a/(2*Math.PI)*N+(hash(c.x,c.y)-.5)*.35+N)%N);});
  cells.forEach(c=>{
    let dx=0,dy=0;
    if(broken){
      const k=sec[c.x+','+c.y];
      if([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const v=sec[(c.x+a)+','+(c.y+b)];return v!==undefined&&v!==k;}))return;
      const ang=(k+.5)/N*2*Math.PI-Math.PI;dx=Math.round(Math.cos(ang)*W*spread);dy=Math.round(Math.sin(ang)*W*spread);
    }
    px(ctx,ox+(c.x+dx)*s,oy+(c.y+dy)*s,s,EGG_PAL[c.c]);
  });
}

/* ================= ВІЗЕРУНКИ ================= */
const P=r=>{const out=r.map(x=>x.padEnd(9,'.'));while(out.length<9){out.length%2?out.push('.........'):out.unshift('.........');}return out;};
const MOTIFS={
  ship:P(["....x....","....xx...","....xxx..","....xxxx.","....x....","xxxxxxxxx",".xxxxxxx.","..xxxxx.."]),
  waves:P(["..x...x..",".x.x.x.x.","x...x...x",".........","..x...x..",".x.x.x.x.","x...x...x"]),
  rhombs:P(["..x...x..",".x.x.x.x.","x...x...x",".x.x.x.x.","..x...x.."]),
  chest:P([".xxxxxxx.",".x..x..x.",".x..x..x.",".xxxxxxx.",".x..x..x.",".x..x..x.",".xxxxxxx."]),
  tower:P(["...xxx...","...x.x...","..xxxxx..","..x...x..",".xxxxxxx.",".x.....x.","xxxxxxxxx"]),
  halved:P(["....x....","...xxx...","..x.x.x..",".x..x..x.","x...x...x",".x..x..x.","..x.x.x..","...xxx...","....x...."]),
  frame:P(["xxxxx....","x...x....","x.x.x.x.x","x...x....","xxxxx...."]),
  chain:P(["xxx......","x.xxx....","xxx.xxx..","..xxx.xxx","....xxx.x","......xxx"]),
  spiral:P([".xxxxxxx.",".......x.",".xxxxx.x.",".x...x.x.",".x.xxx.x.",".x.....x.",".xxxxxxx."]),
  tree:P(["....x....","..x.x.x..","...xxx...",".x..x..x.","..x.x.x..","...xxx...","....x....","...xxx...","..x...x.."]),
  periwinkle:P(["...x.x...","..xxxxx..",".x.xxx.x.","xxxx.xxxx",".x.xxx.x.","..xxxxx..","...x.x..."]),
  rose:P(["x...x...x",".x..x..x.","..x.x.x..","...xxx...","xxxx.xxxx","...xxx...","..x.x.x..",".x..x..x.","x...x...x"]),
  zigzag:P(["x...x...x",".x.x.x.x.","..x...x..",".........","x...x...x",".x.x.x.x.","..x...x.."]),
  key:P([".xxx.....","x...x....","x...xxxxx","x...x.x.x",".xxx....."]),
  combs:P([".xx..xx..","x..xx..x.","x..xx..x.",".xx..xx..","x..xx..x.","x..xx..x.",".xx..xx.."]),
};
const MOTIF_NAMES={waves:'хвилі',rhombs:'два зустрічні ромби',chest:'скриня з комірками',tower:'вежа',halved:'ромб навпіл',frame:'рамка',chain:'ланцюжок',spiral:'спіраль',tree:'дерево життя',periwinkle:'барвінок',rose:'розетка',zigzag:'зигзаг',combs:'соти'};
function drawMotif(ctx,rows,ox,oy,s,col,upto=9){rows.forEach((r,y)=>{if(y>=upto)return;for(let x=0;x<r.length;x++)if(r[x]==='x')px(ctx,ox+x*s,oy+y*s,s,col);});}

/* ================= СВІТИ ================= */
const SONGS=[
  {n:'I',title:'Шторм',worlds:[
    {n:0,name:'Попелище Трої',topic:'Основи: змінні, цикли, умови',task:'Running Sum · 1480',motif:'ship',fox:'#8d8780',foxName:'попелястий',bg:'#3b3633',mvp:true},
    {n:1,name:'Море Еола',topic:'Масиви, сортування',task:'Sort Colors · 75',motif:'waves',fox:'#3f7fd0',foxName:'морський синій',bg:'#173049',mvp:true}]},
  {n:'II',title:'Гостини',worlds:[
    {n:2,name:'Карфаген Дидони',topic:'Two Pointers',task:'Container With Most Water · 11',motif:'rhombs',fox:'#9b3a87',foxName:'тірський пурпур',bg:'#e9d9b4',mvp:true},
    {n:3,name:'Ліс Лиса Микити',topic:'Hash Map',task:'Top K Frequent · 347',motif:'chest',fox:'#e2702b',foxName:'рудий, без фарби',bg:'#2d4a33'},
    {n:4,name:'Рукавичка',topic:'Stack',task:'Daily Temperatures · 739',motif:'tower',fox:'#eef2f5',foxName:'сніжно-білий',bg:'#5b7186'}]},
  {n:'III',title:'Випробування',worlds:[
    {n:5,name:'Конотоп',topic:'Binary Search',task:'Koko Eating Bananas · 875',motif:'halved',fox:'#a68ae6',foxName:'нічний фіолетовий',bg:'#1e1a33'},
    {n:6,name:'Сицилія: ігри Ацеста',topic:'Sliding Window, Heap',task:'Kth Largest in Stream · 703',motif:'frame',fox:'#d9a032',foxName:'сонячна вохра',bg:'#256a74'},
    {n:7,name:'Чумацький шлях',topic:'Linked List',task:'Linked List Cycle · 141',motif:'chain',fox:'#d3e0f7',foxName:'зоряний',bg:'#121d36'}]},
  {n:'IV',title:'Пекло',worlds:[
    {n:8,name:'Пекло',topic:'Рекурсія, Backtracking',task:'Combination Sum · 39',motif:'spiral',fox:'#c9302a',foxName:'вугільно-червоний',bg:'#1b0f0d'},
    {n:9,name:'Родовід Анхіза',topic:'Дерева',task:'LCA of Binary Tree · 236',motif:'tree',fox:'#e7b843',foxName:'золотавий',bg:'#5f4f80'}]},
  {n:'V',title:'Ліси й гори',worlds:[
    {n:10,name:'Лісова пісня',topic:'BST',task:'Kth Smallest in BST · 230',motif:'periwinkle',fox:'#86c95f',foxName:'весняний зелений',bg:'#1f3d2a'},
    {n:11,name:'Карпати',topic:'Графи, BFS / DFS',task:'Pacific Atlantic · 417',motif:'rose',fox:'#1f8a5b',foxName:'хвойний смарагд',bg:'#c8d5cd'},
    {n:12,name:'Змієві вали',topic:'Інтервали, Greedy',task:'Min Arrows · 452',motif:'zigzag',fox:'#c0623a',foxName:'теракотовий',bg:'#e6d3ae'}]},
  {n:'VI',title:'Лаціум',worlds:[
    {n:13,name:'Табір Турна',topic:'Найкоротший шлях',task:'Path With Min Effort · 1631',motif:'key',fox:'#33467a',foxName:'темно-синій (полон)',bg:'#d6c49c'},
    {n:14,name:'Кузня Вулкана',topic:'Динамічне програмування',task:'LIS · 300',motif:'combs',fox:'#ff8a1f',foxName:'розжарений помаранчевий',bg:'#2a1a14'},
    {n:15,name:'Двобій з Турном',topic:'Фінал: усі хитрощі',task:'Режим співбесіди',motif:'egg',fox:'rainbow',foxName:'усі кольори',bg:'#1c2c66'}]},
];
const ALL_WORLDS=SONGS.flatMap(s=>s.worlds);
const GINGER='#e2702b';
const FOX_GINGER=makeFox(GINGER);
const foxCache={};
function foxFor(w){if(!foxCache[w.n])foxCache[w.n]=w.fox==='rainbow'?makeFox(GINGER,{rainbow:true}):makeFox(w.fox);return foxCache[w.n];}

/* ================= СЦЕНИ ================= */
const SW=200,SH_=130;
function sky(sp,cols,y0,y1){for(let y=y0;y<y1;y++){const t=(y-y0)/(y1-y0)*(cols.length-1),i=Math.floor(t),f=t-i;for(let x=0;x<SW;x++){const c=(f>0.66||(f>0.33&&(x+y)%2===0))?cols[Math.min(i+1,cols.length-1)]:cols[i];sp.set(x,y,c);}}}
function ridge(sp,base,amp,fr,ph,col,y1,fn){for(let x=0;x<SW;x++){const h=Math.round(base+Math.sin(x*fr+ph)*amp+Math.sin(x*fr*2.3+ph*1.7)*amp*0.4);for(let y=h;y<y1;y++)sp.set(x,y,fn?fn(x,y,h):col);}}
function spruce(sp,x,y,h,col,snow){for(let i=0;i<h;i++){const w=Math.floor(i*0.45)+1;for(let k=-w;k<=w;k++)sp.set(x+k,y-h+i,(snow&&i%5===0&&Math.abs(k)<w)?'#f4f7fa':col);}sp.set(x,y,'#3a2414');sp.set(x,y+1,'#3a2414');}
function columns(sp,xs,y0,y1,c,cs){xs.forEach(x=>{sp.fill(rect(x,y0,8,y1-y0),(xx)=>xx>x+5?cs:((xx-x)%3===1?cs:c));sp.fill(rect(x-2,y0-3,12,3),c);sp.fill(rect(x-2,y1,12,2),cs);});}
function sea(sp,f,y0,c1,c2,crest){for(let y=y0;y<SH_;y++)for(let x=0;x<SW;x++){const w=(x+f*2+Math.round(Math.sin(y*0.7)*4))%18;sp.set(x,y,w<2&&y%5===0?crest:(y>y0+28?c2:c1));}}

const WORLD_SCENES={
  1:{npc:'Еол, бог вітрів',quote:'Юнона заплатила за шторм, а не за порядок. Вишикуй флот, і я затихну.',npcSpr:makeEol(),npcPos:[128,8],float:true,
   bg:(sp,f)=>{
     sky(sp,['#0b1626','#152a45','#22405f','#2c4a6e'],0,74);
     [[30,18,18,7],[60,12,14,6],[150,30,22,8],[110,22,16,6]].forEach(([x,y,rx,ry],i)=>sp.fill(ell(x+((f+i)%4<2?0:1),y,rx,ry),(xx,yy)=>yy<y-ry/3?'#55708f':'#3d5675'));
     if(f%9<2)sp.fill(path([[96,8],[90,24],[96,26],[88,44]],1.6),'#f7e27a');
     sea(sp,f,72,'#1a446b','#123251','#7fb6d9');
     sp.fill(poly([[96,82],[132,82],[127,90],[100,90]]),'#5b3a20');sp.fill(line(114,82,114,56),'#3a2414');sp.fill(poly([[115,58],[130,66],[115,78]]),(x,y)=>y===68?RD:'#e9e1cc');
     sp.fill(poly([[0,106],[40,100],[70,104],[100,112],[100,130],[0,130]]),(x,y)=>y<104?'#5a6168':'#3a3f45');
   }},
  2:{npc:'Дидона, цариця Карфагена',quote:'Скільки землі обгородиш шкурою, стільки й моя. Стовпи вже стоять, обери два.',npcSpr:makeDido(),npcPos:[146,56],
   bg:(sp,f)=>{
     sky(sp,['#6fb6e3','#9fd0ee','#d4eaf5'],0,64);
     sp.fill(ell(170,18,8,8),'#fff1b8');
     sp.fill(rect(0,58,SW,8),(x,y)=>(x+f)%12===0&&y===60?'#9fd0ee':'#2f7fb8');
     for(let x=70;x<SW;x++)for(let y=36;y<70;y++){const top=(x%10<6)?36:40;if(y>=top)sp.set(x,y,(x%22===3&&y>48&&y<54)?'#7a5a32':(x>150?'#c9a466':'#d9b77a'));}
     sp.fill(rect(120,26,14,44),'#c9a466');for(let x=120;x<134;x+=4)sp.fill(rect(x,22,2,4),'#c9a466');sp.fill(rect(125,34,4,6),'#7a5a32');
     for(let y=66;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x*7+y*3)%11===0?'#d4b073':'#e3c58e');
     sp.fill(path([[30,70],[28,52],[30,38]],2),'#7a5a32');[[30,38,18,34],[30,38,42,33],[30,38,22,44],[30,38,40,45],[30,38,30,30]].forEach(([a,b,c,d])=>sp.fill(line(a,b,c,d,2),'#3f7a3a'));
     const posts=[3,9,7,2,6,5,9,4,8];posts.forEach((h,i)=>{const x=10+i*10;sp.fill(rect(x,92-h*2,2,h*2),'#7a4a24');sp.set(x,91-h*2,GD);sp.set(x+1,91-h*2,GD);});
   }},
  4:{npc:'Мешканці рукавички',quote:'Хто заліз останнім, той і вилазить першим. Інакше рукавичка лусне!',npcSpr:makeMitten(),npcPos:[130,78],
   bg:(sp,f)=>{
     sky(sp,['#9fb6d0','#c3d3e4','#e3ebf3'],0,84);
     ridge(sp,70,6,0.05,1,'#c9d7e4',84);
     [[14,82,26],[40,80,30],[70,84,22],[178,84,28],[100,80,18]].forEach(([x,y,h])=>spruce(sp,x,y,h,'#2c5040',true));
     for(let y=84;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%9===0?'#d6e2ee':'#f4f7fa');
     for(let i=0;i<40;i++){const x=Math.floor(hash(i,1)*SW),y=Math.floor((hash(i,2)*SH_+f*2+i)%SH_);sp.set(x,y,'#ffffff');}
   }},
  5:{npc:'Сотник Забрьоха',quote:'Кидаємо в став кожну по черзі! Що значить «ділити навпіл»? Ну, спробуй.',npcSpr:makeSotnyk(),npcPos:[146,56],
   bg:(sp,f)=>{
     sky(sp,['#0a0c22','#161a3f','#262a5c'],0,88);
     for(let i=0;i<50;i++){const x=Math.floor(hash(i,3)*SW),y=Math.floor(hash(i,4)*80);if((i+f)%7)sp.set(x,y,(i%5)?'#cfd6ff':'#fff4c2');}
     sp.fill(ell(150,26,15,15),'#f3eac2');[[145,22,2],[156,30,3],[150,34,1.6]].forEach(([x,y,r])=>sp.fill(ell(x,y,r,r),'#ddd2a6'));
     const wx=(f*3)%260-40;sp.fill(line(wx,36,wx+22,30,1),'#3a2414');sp.fill(poly([[wx+20,28],[wx+26,26],[wx+27,32],[wx+21,33]]),'#120f1c');sp.fill(ell(wx+14,28,3,3),'#120f1c');sp.fill(poly([[wx+11,26],[wx+14,18],[wx+17,26]]),'#120f1c');
     ridge(sp,88,2,0.08,0,'#1c2a1b',SH_);
     sp.fill(poly([[16,72],[52,72],[60,62],[34,48],[8,62]]),(x,y)=>(x+y)%3?'#8a6a3a':'#6e5229');sp.fill(rect(14,72,40,20),'#e9e4d6');sp.fill(rect(28,78,8,8),'#f2c75c');sp.fill(rect(31,78,2,8),'#6e5229');
     sp.fill(ell(112,96,30,4),(x,y)=>(x+f)%9===0?'#3a4a8a':'#141b3a');sp.fill(rect(108,95,8,1),'#f3eac2');
   }},
  8:{npc:'Харон, перевізник',quote:'Човен на двох, і вага обмежена. Хто з ким пливе, вирішуй сам.',npcSpr:makeCharon(),npcPos:[132,52],
   bg:(sp,f)=>{
     sky(sp,['#110607','#22090a','#3b100d','#56170f'],0,110);
     for(let x=0;x<SW;x+=13){const h=6+Math.floor(hash(x,7)*16);for(let i=0;i<h;i++){const w=Math.max(0,Math.floor((h-i)/4));for(let k=-w;k<=w;k++)sp.set(x+k,i,'#0b0405');}}
     [[40,86],[96,80]].forEach(([x,y],j)=>{sp.fill(ell(x,y,12,8),'#141010');sp.fill(rect(x-12,y-8,24,2),'#2a2424');for(let k=-10;k<=10;k+=2){const h=3+((k+f+j)%4);sp.fill(rect(x+k,y+8,2,h),k%4?'#f7a541':'#d9431e');}});
     for(let y=104;y<SH_;y++)for(let x=96;x<SW;x++){const w=(x+f*3+Math.round(Math.sin(y)*5))%14;sp.set(x,y,w<2?'#f7d26a':(w<6?'#f08a2a':'#d9431e'));}
     sp.fill(poly([[0,108],[60,104],[100,112],[104,130],[0,130]]),(x,y)=>(x+y)%7===0?'#3a1a14':'#2a1512');
   }},
  11:{npc:'Мольфар',quote:'Трембіта кличе хвилями: спершу найближчі полонини, потім дальші. Так і шукай.',npcSpr:makeMolfar(),npcPos:[146,52],
   bg:(sp,f)=>{
     sky(sp,['#86bde4','#b5d7ee','#e3eff6'],0,70);
     sp.fill(ell(162,20,10,10),'#ffe08a');
     ridge(sp,52,10,0.045,0.3,'#9fb6c8',SH_);
     ridge(sp,66,8,0.06,2,'#6f9a8a',SH_);
     for(let y=60;y<70;y++)for(let x=0;x<SW;x++)if((x+y+f)%3===0)sp.set(x,y,'#e3eff6');
     ridge(sp,84,6,0.08,4,'#3f7a56',SH_);
     [[12,90,22],[30,88,26],[52,92,18],[176,90,24],[192,92,18]].forEach(([x,y,h])=>spruce(sp,x,y,h,'#1f4a33',false));
     for(let y=98;y<SH_;y++)for(let x=0;x<SW;x++){const r=hash(x,y);sp.set(x,y,r<0.03?(r<0.015?RD:'#f2c230'):((x+y)%5===0?'#548d42':'#5f9a4a'));}
   }},
};
/* ================= НОВІ МЕШКАНЦІ ================= */
function recolor(spr,map){const s=new Spr(spr.w,spr.h);s.p=spr.p.map(c=>c&&map[c]?map[c]:c);s.ol=spr.ol;return s;}
function makeAcestes(){const a=makeAnchises();const r=recolor(a,{'#f1ece0':'#3a6ea5','#d8d0bf':'#2b5487','#5fa04a':GD,'#3f7a3a':GDs,'#f2f2f2':'#d9d4cc','#cfcfcf':'#b5aea4'});return r;}
function makeMavka(){
  const s=new Spr(40,72),SK='#f3dcc8',SKs='#d9bea8',HA='#3f7a3a',HAs='#2f5a28',DR='#9fd18b',DRs='#7fb46b';
  s.fill(poly([[12,10],[28,10],[33,62],[7,62]]),(x)=>x>24?HAs:HA);
  s.fill(poly([[14,26],[26,26],[32,68],[8,68]]),(x)=>x>24?DRs:DR);
  for(let x=8;x<33;x+=4){s.fill(poly([[x,68],[x+2,64],[x+4,68]]),'#5f9a4a');}
  s.fill(rect(15,68,3,2),SK);s.fill(rect(23,68,3,2),SKs);
  s.fill(poly([[14,27],[10,40],[12,42],[16,31]]),SK);
  s.fill(poly([[26,27],[31,22],[33,24],[27,31]]),SKs);s.fill(ell(32,21,1.8,1.8),SKs);
  s.fill(ell(33,18,2,2),'#5b7fd6');s.set(33,18,'#f2c230');s.fill(line(32,20,32,23),'#3f7a3a');
  s.fill(rect(18,21,5,5),SK);
  s.fill(ell(20,15,5.2,6.2),(x)=>x>22?SKs:SK);
  s.fill(poly([[13,11],[17,11],[16,40],[11,44]]),HA);s.fill(poly([[27,11],[23,11],[25,40],[29,44]]),HAs);
  s.fill(rect(17,15,2,1),'#2f5a28');s.fill(rect(22,15,2,1),'#2f5a28');s.fill(rect(19,19,3,1),'#d97a8a');
  [[13,9,RD],[15,8,'#f2c230'],[17,7,'#5b7fd6'],[19,7,WH],[21,7,RD],[23,7,'#f2c230'],[25,8,'#5b7fd6'],[27,9,WH]].forEach(([x,y,c])=>{s.set(x,y,c);s.set(x+1,y,c);s.set(x,y+1,c);});
  return s.outline(0.6);
}
function makeKozhumyaka(){
  const s=new Spr(52,74),SK='#e2a77d',SKs='#c08158',SH='#f4efe3',SHs='#d3c9b6',AP='#7a4a24',APs='#5b3418',PA='#2f3f6a';
  s.fill(poly([[13,62],[22,62],[22,70],[10,70]]),'#3a2416');s.fill(poly([[28,62],[37,62],[40,70],[28,70]]),'#2a1a10');
  s.fill(poly([[14,46],[36,46],[38,63],[27,63],[25,55],[23,63],[12,63]]),PA);
  s.fill(poly([[11,24],[39,24],[37,48],[13,48]]),(x)=>x>31?SHs:SH);
  s.fill(poly([[16,30],[34,30],[36,60],[14,60]]),(x)=>x>29?APs:AP);s.fill(line(16,30,22,24),APs);s.fill(line(34,30,28,24),APs);
  s.fill(poly([[11,25],[5,40],[9,42],[15,30]]),SK);s.fill(ell(7,42,2.6,2.4),SK);
  s.fill(poly([[39,25],[45,38],[42,40],[36,30]]),SKs);s.fill(ell(44,40,2.6,2.4),SKs);
  s.fill(poly([[40,36],[51,40],[49,64],[38,58]]),(x,y)=>(x+y)%5===0?'#9a6a3a':'#b07a44');
  s.fill(rect(21,20,9,5),SK);
  s.fill(ell(25,14,7,8),(x)=>x>27?SKs:SK);
  s.fill(rect(21,12,3,1),'#3a2414');s.fill(rect(27,12,3,1),'#3a2414');s.fill(rect(22,14,2,1),BK);s.fill(rect(27,14,2,1),BK);
  s.fill(path([[25,18],[21,19],[19,22],[18,26]],2),'#3a2414');s.fill(path([[25,18],[29,19],[31,22],[32,26]],2),'#3a2414');
  s.fill(path([[25,7],[24,4],[22,2]],2),'#3a2414');
  return s.outline(0.6);
}
function makeVulcan(){
  const s=new Spr(60,72),SK='#c98a5e',SKs='#a36a42',BE='#6e2a18',AP='#4a3020',APs='#33200f';
  s.fill(poly([[40,52],[58,52],[56,58],[50,58],[50,66],[54,70],[42,70],[46,66],[46,58],[40,58]]),(x,y)=>y<55?'#8d949e':'#5f666e');
  s.fill(poly([[10,62],[19,62],[19,70],[7,70]]),'#2a1a10');s.fill(poly([[23,62],[32,62],[34,70],[23,70]]),'#1f140b');
  s.fill(poly([[11,44],[32,44],[33,63],[22,63],[21,55],[20,63],[9,63]]),'#3a3a40');
  s.fill(poly([[9,24],[34,24],[33,47],[10,47]]),(x)=>x>27?SKs:SK);
  s.fill(poly([[12,30],[31,30],[33,58],[10,58]]),(x)=>x>26?APs:AP);
  s.fill(poly([[9,25],[3,36],[7,39],[13,30]]),SK);s.fill(ell(5,39,2.6,2.4),SK);
  s.fill(poly([[34,25],[42,16],[45,19],[37,30]]),SKs);s.fill(ell(44,16,2.6,2.6),SKs);
  s.fill(line(44,16,40,2,1.8),'#6b4420');s.fill(rect(34,0,12,6),'#8d949e');s.fill(rect(34,0,12,2),'#c9ced6');
  s.fill(rect(18,19,8,6),SK);
  s.fill(ell(22,13,7,8),(x)=>x>24?SKs:SK);
  s.fill(poly([[15,15],[29,15],[27,32],[17,32]]),BE);
  s.fill(rect(18,11,3,1),BE);s.fill(rect(24,11,3,1),BE);s.fill(rect(19,13,2,1),BK);s.fill(rect(24,13,2,1),BK);
  return s.outline(0.6);
}
function makeOx(){
  const s=new Spr(62,42),O='#d8d2c4',Os='#b3ab9a',H='#e9e1cc';
  [[16,28],[22,29],[40,29],[46,28]].forEach(([x,y],i)=>s.fill(rect(x,y,4,12),(xx,yy)=>yy>37?'#3a2a20':(i%2?Os:O)));
  s.fill(ell(32,24,18,9),(x,y)=>y>28?Os:O);
  s.fill(path([[50,22],[56,28],[54,32]],2),Os);
  s.fill(ell(12,22,7,6),O);s.fill(poly([[6,22],[12,22],[10,30],[4,28]]),'#c9a98a');s.set(5,26,BK);
  s.fill(path([[9,16],[5,12],[4,8]],1.6),H);s.fill(path([[15,16],[19,12],[20,8]],1.6),H);
  s.fill(rect(10,20,2,1),BK);
  s.fill(rect(17,12,4,22),'#7a4a24');s.fill(rect(15,12,8,3),'#6b4420');
  return s.outline(0.6);
}
const W_ANCHISES=makeAnchises(),W_ACESTES=makeAcestes(),W_LION=makeLion(),W_OX=makeOx(),W_MAVKA=makeMavka(),W_KOZH=makeKozhumyaka(),W_TURN=makeTurn(),W_VULCAN=makeVulcan();
function stars(sp,n,k,f,ymax){for(let i=0;i<n;i++){const x=Math.floor(hash(i,k)*SW),y=Math.floor(hash(i,k+1)*ymax);if((i+f)%7)sp.set(x,y,(i%5)?'#cfd6ff':'#fff4c2');}}
function tent(sp,x,y,w,h,c,cs){sp.fill(poly([[x,y],[x+w/2,y-h],[x+w,y]]),(xx)=>xx>x+w/2?cs:c);sp.fill(poly([[x+w/2-2,y],[x+w/2,y-5],[x+w/2+2,y]]),'#1a0f0a');}
Object.assign(WORLD_SCENES,{
  0:{npc:'Анхіз і вцілілі троянці',quote:'Сину, збирай людей і зерно. Нова земля чекає, але спершу порахуй, що лишилось.',npcSpr:W_ANCHISES,npcPos:[146,56],
     bg:(sp,f)=>{ruins(sp,f);for(let i=0;i<5;i++){const x=70+i*14;sp.fill(ell(x,114,4,5),(xx,yy)=>yy<111?'#c9a466':'#a8844a');}}},
  3:{npc:'Цар Лев і звірі ярмарку',quote:'Хто що продає — ніхто не пам\'ятає. Наведи лад, і Микита знову буде канцлером. На хвилинку.',npcSpr:W_LION,npcPos:[140,80],
     bg:(sp,f)=>{sky(sp,['#bfe0c8','#d9eed9','#eef6ea'],0,92);[[10,92,30],[30,90,26],[186,92,30]].forEach(([x,y,h])=>spruce(sp,x,y,h,'#2d5a3a',false));for(let y=92;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%6===0?'#4f8a4a':'#5f9a4a');
       [[60,'#b3202a'],[96,'#2f55a0'],[132,'#d9a521']].forEach(([x,c],k)=>{sp.fill(rect(x,72,30,20),'#c9a466');for(let i=0;i<30;i+=4)sp.fill(rect(x+i,64,4,8),i%8?WH:c);sp.fill(rect(x+2,80,26,3),'#8a6a3a');[[x+5,'#e2702b'],[x+12,'#5fa04a'],[x+19,'#c0392b']].forEach(([xx,cc])=>sp.fill(ell(xx,78,2.5,2),cc));});}},
  6:{npc:'Ацест, цар Сицилії',quote:'Ігри на честь Анхіза! Тільки табло зламалось. Хто ж переміг?',npcSpr:W_ACESTES,npcPos:[148,56],
     bg:(sp,f)=>{sky(sp,['#7fc0e8','#a9d6ef','#dceef6'],0,60);sp.fill(ell(40,18,9,9),'#ffe08a');sea(sp,f,60,'#2a7aa8','#1f5f86','#bfe3f2');for(let y=82;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%7===0?'#d4b073':'#e3c58e');columns(sp,[150,170,190],40,82,'#f1ece0','#cfc6b4');
       [[30,'#b3202a'],[70,'#2f55a0'],[110,'#d9a521']].forEach(([x,c],k)=>{const bx=(x+f*(1+k*0.3))%220-20;sp.fill(poly([[bx,72],[bx+16,72],[bx+13,76],[bx+3,76]]),'#5b3a20');sp.fill(rect(bx+7,64,1,8),'#3a2414');sp.fill(poly([[bx+8,64],[bx+14,68],[bx+8,71]]),c);});}},
  7:{npc:'Чумаки та їхні воли',quote:'Валка ходить по колу третю ніч. Віл повільний, а лис швидкий — хай перевірять, чи зустрінуться.',npcSpr:W_OX,npcPos:[132,86],
     bg:(sp,f)=>{sky(sp,['#070a1c','#111a3a','#1e2a52'],0,96);stars(sp,90,11,f,92);for(let x=0;x<SW;x++){const yy=Math.round(70-x*0.28);for(let k=-6;k<=6;k++)if(hash(x,k+50)<0.28-Math.abs(k)*0.035)sp.set(x,yy+k,'#e8ecff');}
       ridge(sp,96,2,0.05,1,'#1c2a1b',SH_);sp.fill(rect(40,96,40,10),'#5b3a20');sp.fill(ell(46,108,5,5),'#3a2414');sp.fill(ell(74,108,5,5),'#3a2414');sp.fill(ell(60,92,18,6),'#d9d2c4');}},
  9:{npc:'Анхіз в Елісії',quote:'Ось твій рід, сину: від кореня до найменшого листка. Знайди, де дві гілки сходяться.',npcSpr:W_ANCHISES,npcPos:[148,56],
     bg:(sp,f)=>{sky(sp,['#f6dca0','#f2c98a','#e9b3a0'],0,SH_);[[30,100,30,8],[170,104,30,8],[100,112,60,10]].forEach(([x,y,rx,ry])=>sp.fill(ell(x,y,rx,ry),'#fbf3e6'));
       const tr=(x,y,len,ang,d)=>{if(d>5)return;const x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len;sp.fill(line(x,y,x2,y2,Math.max(1,4-d*0.7)),'#7a5a32');if(d>=3)sp.fill(ell(x2,y2,2.5,2.2),(d+((f>>2)%2))%2?'#e7b843':'#d9a521');tr(x2,y2,len*0.7,ang-0.45,d+1);tr(x2,y2,len*0.7,ang+0.45,d+1);};tr(96,118,26,-Math.PI/2,0);}},
  10:{npc:'Мавка',quote:'Кожне дерево має своє місце: молодші ліворуч, старші праворуч. Поверни ліс, поки він не заснув.',npcSpr:W_MAVKA,npcPos:[150,56],
     bg:(sp,f)=>{sky(sp,['#a9d8c0','#cfe9d6','#eef7ea'],0,90);for(let y=90;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%5===0?'#6fae55':'#7fbf63');sp.fill(ell(100,104,46,7),(x,y)=>(x+f)%9===0?'#bfe3f2':'#6fb2d9');
       [[20,'#f4f1ea'],[44,'#f4f1ea'],[176,'#f4f1ea'],[196,'#f4f1ea']].forEach(([x])=>{sp.fill(rect(x,40,4,52),'#f4f1ea');for(let y=44;y<90;y+=7)sp.fill(rect(x+(y%2),y,2,1),'#2a2a2a');sp.fill(ell(x+2,38,12,10),'#86c95f');});
       for(let i=0;i<30;i++){const x=Math.floor(hash(i,61)*SW),y=92+Math.floor(hash(i,62)*36);sp.set(x,y,i%3?'#5b7fd6':'#f2c230');}}},
  12:{npc:'Кирило Кожум\'яка',quote:'Заорав я Змія, а вали порізало на шматки. Зший їх, де перекриваються, і жодна змія не пролізе.',npcSpr:W_KOZH,npcPos:[144,54],
     bg:(sp,f)=>{sky(sp,['#c9d6e0','#e3e3d6','#f0e6cc'],0,80);sp.fill(path([[160,20],[170,16],[180,20],[190,14]],1.6),'#5a5048');for(let y=80;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(Math.floor(x/6)+y)%4===0?'#b88a52':'#c9a06a');
       [[10,60,88],[50,110,84],[90,140,90],[120,190,86]].forEach(([a,b,y])=>{for(let x=a;x<b;x++){const h=Math.round(5+Math.sin((x-a)/(b-a)*Math.PI)*3);sp.fill(rect(x,y-h,1,h),'#8a6a3a');sp.set(x,y-h-1,'#5f9a4a');}});}},
  13:{npc:'Табір Турна',quote:'Варта всюди. Найкоротший шлях до Микити — той, де найменше дозорів.',npcSpr:W_TURN,npcPos:[146,52],
     bg:(sp,f)=>{sky(sp,['#0a0c22','#161a3f','#262a5c'],0,92);stars(sp,40,21,f,80);ridge(sp,92,2,0.08,0,'#1c2a1b',SH_);[[20,96,26,20],[60,94,30,24],[100,96,26,20]].forEach(([x,y,w,h])=>tent(sp,x,y,w,h,'#9b1c1c','#701313'));
       for(let x=0;x<SW;x+=6)sp.fill(rect(x,84,3,10),'#4a3220');[[50,104],[124,106]].forEach(([x,y],k)=>{for(let i=-3;i<=3;i++){const hh=3+((i+f+k)%4);sp.fill(rect(x+i,y-hh,1,hh),i%2?'#f7a541':'#d9431e');}});}},
  14:{npc:'Вулкан, коваль богів',quote:'Не куй двічі те, що вже викував. Запиши — і спирайся на зроблене.',npcSpr:W_VULCAN,npcPos:[136,56],
     bg:(sp,f)=>{sky(sp,['#1a0f0b','#2a1610','#3a1c12'],0,SH_);for(let y=100;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%6===0?'#2a1a14':'#3a2418');
       sp.fill(rect(60,60,40,40),'#3a2a24');sp.fill(rect(66,70,28,22),(x,y)=>((x+y+f)%3===0)?'#ffd27a':'#f08a2a');sp.fill(rect(70,40,20,20),'#2a1e1a');
       for(let i=0;i<14;i++){const p=((f*2+i*7)%30)/30,x=80+(hash(i,71)-.5)*60*p,y=70-p*50;sp.set(x,y,i%2?'#ffd27a':'#f7a541');}}},
  15:{npc:'Турн, чемпіон Юнони',quote:'Ні підказок, ні Сивілли. Лише ти, твої хитрощі і мій меч.',npcSpr:W_TURN,npcPos:[146,52],
     bg:(sp,f)=>{sky(sp,['#3a1c3a','#8a3a3a','#e98a50'],0,90);sp.fill(ell(100,90,22,22),'#ffcf7a');ridge(sp,92,3,0.05,2,'#4a2a1a',SH_);for(let y=96;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%6===0?'#6b4a2a':'#7a5632');
       [[30,'#2f55a0'],[60,'#b3202a'],[170,'#6b3fa0']].forEach(([x,c])=>{sp.fill(rect(x,56,1,40),'#3a2414');sp.fill(poly([[x+1,56],[x+14+((f%2)?1:0),60],[x+1,66]]),c);});}},
});

/* ================= АТМОСФЕРА СВІТІВ: деталі тла, частинки, світло ================= */
function cloudSp(sp,x,y,w,c1,c2,c3){const h=Math.max(4,Math.round(w*0.32));
  [[0,0.55,0.5],[0.25,0.3,0.42],[0.55,0.45,0.38],[0.8,0.6,0.3]].forEach(([dx,dy,r])=>sp.fill(ell(x+w*dx,y+h*dy,w*r,h*r*1.3),(xx,yy)=>yy<y+h*0.35?c1:(yy>y+h*0.75?c3:c2)));}
function tufts(sp,y0,y1,c,c2,k){for(let i=0;i<70;i++){const x=Math.floor(hash(i,k)*SW),y=y0+Math.floor(hash(i,k+1)*(y1-y0));sp.set(x,y,c);sp.set(x-1,y+1,c2);sp.set(x+1,y+1,c2);sp.set(x,y-1,c2);}}
function flowers(sp,y0,y1,k,cols){for(let i=0;i<40;i++){const x=Math.floor(hash(i,k)*SW),y=y0+Math.floor(hash(i,k+3)*(y1-y0));const c=cols[i%cols.length];sp.set(x,y,c);sp.set(x+1,y,c);sp.set(x,y+1,'#3f7a3a');}}
const EXTRAS={
  2:(sp,f)=>{cloudSp(sp,18,10,40,'#ffffff','#e9f4fb','#c9e2f1');cloudSp(sp,96+(f%40)/8,6,32,'#ffffff','#e9f4fb','#c9e2f1');for(let x=0;x<SW;x++){const y=Math.round(104+Math.sin(x*0.06)*3);sp.set(x,y,'#d4b073');sp.set(x,y+1,'#d4b073');}},
  3:(sp,f)=>{tufts(sp,96,128,'#3f7a3a','#4f8a4a',31);flowers(sp,100,128,33,[RD,'#f2c230',WH]);},
  6:(sp,f)=>{cloudSp(sp,70,8,36,'#ffffff','#eef6fb','#d0e6f2');cloudSp(sp,120,14,26,'#ffffff','#eef6fb','#d0e6f2');},
  10:(sp,f)=>{tufts(sp,92,128,'#5f9a4a','#6fae55',41);flowers(sp,94,128,43,['#5b7fd6','#f2c230',WH,'#e7a3ad']);},
  11:(sp,f)=>{cloudSp(sp,20,14,40,'#ffffff','#eaf3f8','#cfe0ea');cloudSp(sp,110,8,30,'#ffffff','#eaf3f8','#cfe0ea');tufts(sp,100,128,'#3f7a3a','#548d42',51);},
  12:(sp,f)=>{cloudSp(sp,40,12,40,'#f6f2e6','#e3dccb','#c9c0ac');tufts(sp,96,128,'#8a6a3a','#a07a44',61);},
  0:(sp,f)=>{for(let x=0;x<SW;x+=3){const y=100+Math.floor(hash(x,71)*4);sp.set(x,y,'#3a3330');}},
  9:(sp,f)=>{flowers(sp,108,128,91,['#fff3c4','#f2c230',WH]);},
};
Object.entries(EXTRAS).forEach(([n,fn])=>{const ws=WORLD_SCENES[n];if(!ws)return;const ob=ws.bg;ws.bg=(sp,f)=>{ob(sp,f);fn(sp,f);};});

/* частинки малюються поверх тла (back) і поверх героїв (front); усе залежить лише від часу t */
const FXP=(ctx,x,y,c,z=2)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x/2)*2,Math.round(y/2)*2,z,z);};
const FXW=400,FXH=260;
const FXK={
  embers(ctx,t,o={}){const n=o.n||20,[x0,x1]=o.x||[0,FXW],yb=o.y||FXH;for(let i=0;i<n;i++){const v=18+30*hash(i,1),ph=((t*v+hash(i,2)*yb)%yb),y=yb-ph,x=x0+hash(i,3)*(x1-x0)+Math.sin(t*2+i)*6;ctx.globalAlpha=Math.max(0,1-ph/yb);FXP(ctx,x,y,['#f7d26a','#f08a2a','#d9431e'][(i+Math.floor(t*8))%3]);}ctx.globalAlpha=1;},
  ash(ctx,t,o={}){for(let i=0;i<(o.n||14);i++){const v=8+10*hash(i,4),y=(t*v+hash(i,5)*FXH)%FXH,x=(hash(i,6)*FXW+Math.sin(t*0.8+i)*14+t*6)%FXW;ctx.globalAlpha=.7;FXP(ctx,x,y,'#cfc6bd');}ctx.globalAlpha=1;},
  snow(ctx,t,o={}){for(let i=0;i<(o.n||50);i++){const near=hash(i,7)<0.25,v=near?34:14+10*hash(i,8),y=(t*v+hash(i,9)*FXH)%FXH,x=(hash(i,10)*FXW+Math.sin(t*(near?1.4:0.8)+i)*(near?12:6))%FXW;ctx.globalAlpha=near?1:.75;FXP(ctx,x,y,'#ffffff',near?4:2);}ctx.globalAlpha=1;},
  rain(ctx,t,o={}){ctx.strokeStyle='rgba(180,205,235,.55)';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<(o.n||60);i++){const v=320,y=(t*v+hash(i,11)*FXH)%FXH,x=(hash(i,12)*(FXW+80)-t*v*0.35)%(FXW+80);const X=(x+FXW+80)%(FXW+80)-40;ctx.moveTo(X,y);ctx.lineTo(X-4,y+10);}ctx.stroke();},
  spray(ctx,t,o={}){for(let i=0;i<(o.n||14);i++){const a=(t*1.3+hash(i,13))%1,x=hash(i,14)*FXW,y=(o.y||150)-Math.sin(a*Math.PI)*16;ctx.globalAlpha=1-a;FXP(ctx,x,y,'#e6f2fb');}ctx.globalAlpha=1;},
  dust(ctx,t,o={}){for(let i=0;i<(o.n||18);i++){const x=(hash(i,15)*FXW+t*(8+10*hash(i,16)))%FXW,y=hash(i,17)*FXH*0.9+Math.sin(t+i)*6;ctx.globalAlpha=.35+.35*Math.sin(t*2+i);FXP(ctx,x,y,o.col||'#f3dfb0');}ctx.globalAlpha=1;},
  leaves(ctx,t,o={}){const cols=o.col||['#e2702b','#d9a521','#c0392b','#5f9a4a'];for(let i=0;i<(o.n||10);i++){const v=16+12*hash(i,18),y=(t*v+hash(i,19)*FXH)%FXH,x=(hash(i,20)*FXW+Math.sin(t*1.5+i)*18)%FXW,c=cols[i%cols.length];FXP(ctx,x,y,c);FXP(ctx,x+2,y+(Math.floor(t*4+i)%2?2:-2),shade(c,-0.2));}},
  petals(ctx,t,o={}){for(let i=0;i<(o.n||12);i++){const v=12+8*hash(i,21),y=(t*v+hash(i,22)*FXH)%FXH,x=(hash(i,23)*FXW+Math.sin(t*1.2+i)*20)%FXW;FXP(ctx,x,y,i%2?'#f6d3dc':'#ffffff');}},
  fireflies(ctx,t,o={}){for(let i=0;i<(o.n||12);i++){const bx=hash(i,24)*FXW,by=(o.y0||90)+hash(i,25)*((o.y1||230)-(o.y0||90)),x=bx+Math.sin(t*0.7+i)*22,y=by+Math.cos(t*0.9+i*1.3)*12,a=.5+.5*Math.sin(t*3+i*2);ctx.globalAlpha=a*.35;ctx.fillStyle=o.day?'#fff6b0':'#d6ff8a';ctx.fillRect(Math.round(x/2)*2-2,Math.round(y/2)*2-2,6,6);ctx.globalAlpha=a;FXP(ctx,x,y,o.day?'#fffbe0':'#f4ffc8');}ctx.globalAlpha=1;},
  motes(ctx,t,o={}){for(let i=0;i<(o.n||24);i++){const v=6+8*hash(i,26),y=FXH-((t*v+hash(i,27)*FXH)%FXH),x=hash(i,28)*FXW+Math.sin(t+i)*8,tw=Math.sin(t*4+i)>0.6;ctx.globalAlpha=.8;FXP(ctx,x,y,o.col||'#ffe9a8');if(tw){FXP(ctx,x-2,y,o.col||'#ffe9a8');FXP(ctx,x+2,y,o.col||'#ffe9a8');FXP(ctx,x,y-2,o.col||'#ffe9a8');FXP(ctx,x,y+2,o.col||'#ffe9a8');}}ctx.globalAlpha=1;},
  sparks(ctx,t,o={}){const [sx,sy]=o.at||[160,150];for(let i=0;i<(o.n||30);i++){const age=(t*1.1+hash(i,29))%1,vx=(hash(i,30)-.5)*2.4,vy=1+hash(i,31)*1.6,x=sx+vx*age*70,y=sy-vy*age*70+age*age*90;ctx.globalAlpha=1-age;FXP(ctx,x,y,age<.3?'#fff2b0':(age<.6?'#ffb340':'#e2502a'));}ctx.globalAlpha=1;},
  smoke(ctx,t,o={}){const [x0,x1]=o.x||[0,FXW];for(let i=0;i<(o.n||6);i++){const age=(t*0.18+hash(i,32))%1,x=x0+hash(i,33)*(x1-x0)+Math.sin(t*0.6+i)*8+age*20,y=(o.y||200)-age*170,r=4+age*16;ctx.globalAlpha=(1-age)*.35;ctx.fillStyle=o.col||'#2a2420';for(let a=-r;a<=r;a+=2)for(let b=-r;b<=r;b+=2){if(a*a+b*b<=r*r&&((a+b)/2)%2===0)ctx.fillRect(Math.round((x+a)/2)*2,Math.round((y+b)/2)*2,2,2);}}ctx.globalAlpha=1;},
  rays(ctx,t,o={}){const c=o.col||'255,240,190',x=o.x||300;for(let k=0;k<5;k++){const a=.05+.03*Math.sin(t*0.8+k);ctx.fillStyle=`rgba(${c},${a.toFixed(3)})`;ctx.beginPath();ctx.moveTo(x-10+k*14,0);ctx.lineTo(x+6+k*14,0);ctx.lineTo(x-90+k*50,FXH);ctx.lineTo(x-130+k*50,FXH);ctx.fill();}},
  birds(ctx,t,o={}){ctx.fillStyle=o.col||'#2a2a30';for(let i=0;i<(o.n||3);i++){const x=(t*(18+8*hash(i,34))+hash(i,35)*FXW)%(FXW+40)-20,y=(o.y||40)+hash(i,36)*30+Math.sin(t*2+i)*3,up=Math.floor(t*6+i)%2;ctx.fillRect(Math.round(x),Math.round(y),2,2);ctx.fillRect(Math.round(x)-4,Math.round(y)-(up?2:0),4,2);ctx.fillRect(Math.round(x)+2,Math.round(y)-(up?2:0),4,2);}},
  lightning(ctx,t){const k=Math.floor(t*2.2);if(k%7===0&&(t*2.2)%1<0.25){ctx.fillStyle='rgba(220,235,255,.22)';ctx.fillRect(0,0,FXW,FXH);}},
  moonhalo(ctx,t,o={}){const [x,y]=o.at||[300,52];for(let r=36;r<=60;r+=8){ctx.globalAlpha=.07*(1+Math.sin(t+r));ctx.fillStyle='#f3eac2';for(let a=0;a<64;a++){const an=a/64*6.283;ctx.fillRect(Math.round((x+Math.cos(an)*r)/2)*2,Math.round((y+Math.sin(an)*r)/2)*2,2,2);}}ctx.globalAlpha=1;},
  shooting(ctx,t){const per=5.5,k=t%per;if(k<0.9){const p=k/0.9,x=60+p*220,y=20+p*60;for(let j=0;j<12;j++){ctx.globalAlpha=(1-j/12)*(1-p*.5);FXP(ctx,x-j*5,y-j*1.4,'#ffffff');}ctx.globalAlpha=1;}},
  glitter(ctx,t,o={}){for(let i=0;i<24;i++){if(Math.sin(t*5+i*3)>.7){const x=hash(i,37)*FXW,y=(o.y||124)+hash(i,38)*((o.y2||160)-(o.y||124));FXP(ctx,x,y,'#ffffff');}}},
  campfire(ctx,t,o={}){const [x,y]=o.at||[180,200];for(let i=-3;i<=3;i++){const h=4+((i+Math.floor(t*10))%4+4)%4*2;ctx.fillStyle=i%2?'#f7a541':'#d9431e';ctx.fillRect(x+i*2,y-h,2,h);}ctx.fillStyle='#fff2b0';ctx.fillRect(x,y-4,2,2);ctx.globalAlpha=.18+.06*Math.sin(t*9);ctx.fillStyle='#ffb340';ctx.fillRect(x-14,y-18,30,20);ctx.globalAlpha=1;},
  lavaglow(ctx,t){const a=.12+.06*Math.sin(t*2);for(let k=0;k<5;k++){ctx.fillStyle=`rgba(255,90,30,${(a*(1-k/5)).toFixed(3)})`;ctx.fillRect(0,FXH-60-k*12,FXW,12);}},
  forgeglow(ctx,t){const a=.16+.08*Math.sin(t*3);for(let r=70;r>10;r-=12){ctx.fillStyle=`rgba(255,150,60,${(a*(1-r/80)).toFixed(3)})`;ctx.fillRect(160-r,160-r*0.7,r*2,r*1.4);}},
  mist(ctx,t,o={}){const y=o.y||120,a=o.a||.35;for(let b=0;b<3;b++){const off=(t*(6+b*3))%40;ctx.globalAlpha=a*(1-b*0.25);ctx.fillStyle='#f4f8fb';for(let x=-40;x<FXW;x+=4)for(let yy=0;yy<10;yy+=2){if(((x/4|0)+(yy/2|0)+b)%3===0)ctx.fillRect(Math.round(x+off),y+b*10+yy+Math.round(Math.sin((x+t*20)/40)*3),2,2);}}ctx.globalAlpha=1;},
  dragon(ctx,t){const x=(t*14)%(FXW+120)-60,y=40+Math.sin(t*0.8)*8,up=Math.floor(t*3)%2;ctx.fillStyle='rgba(60,50,45,.55)';ctx.fillRect(Math.round(x),Math.round(y),18,3);ctx.fillRect(Math.round(x)+18,Math.round(y)-2,4,3);ctx.fillRect(Math.round(x)-8,Math.round(y)+2,8,2);ctx.fillRect(Math.round(x)+4,Math.round(y)-(up?8:-4),8,up?8:4);},
  bunting(ctx,t){const y0=118,cols=[RD,'#f2c230','#2f55a0',WH];for(let x=120;x<390;x+=10){const sag=Math.sin((x-120)/270*Math.PI)*10,sw=Math.round(Math.sin(t*2+x/30));ctx.fillStyle='#5b3a20';ctx.fillRect(x,y0+sag,10,1);ctx.fillStyle=cols[(x/10|0)%4];ctx.beginPath();ctx.moveTo(x+1,y0+sag+1);ctx.lineTo(x+9,y0+sag+1);ctx.lineTo(x+5+sw,y0+sag+9);ctx.fill();}},
  ripples(ctx,t,o={}){const y=o.y||208;for(let i=0;i<3;i++){const p=((t*0.5+i/3)%1),rx=8+p*40,ry=2+p*5,x=200+(i-1)*40;ctx.globalAlpha=(1-p)*.6;ctx.fillStyle='#e6f4fb';for(let a=0;a<40;a++){const an=a/40*6.283;ctx.fillRect(Math.round((x+Math.cos(an)*rx)/2)*2,Math.round((y+Math.sin(an)*ry)/2)*2,2,2);}}ctx.globalAlpha=1;},
  windowglow(ctx,t,o={}){const [x,y]=o.at||[0,0];ctx.globalAlpha=.18+.05*Math.sin(t*2);ctx.fillStyle='#ffd27a';ctx.fillRect(x-8,y-8,30,26);ctx.globalAlpha=1;},
};
const WORLD_FX={
  0:{grade:'rgba(255,110,40,.07)',back:[['smoke',{x:[20,140],y:200,col:'#2a2420',n:7}]],front:[['embers',{n:26}],['ash',{n:16}]],vig:.35},
  1:{grade:'rgba(10,25,50,.14)',back:[['lightning']],front:[['rain',{n:70}],['spray',{n:16,y:150}]],vig:.45},
  2:{back:[['rays',{x:330,col:'255,240,190'}],['birds',{n:3,y:30}]],front:[['dust',{n:18,col:'#f6e4b8'}]],vig:.18},
  3:{back:[['bunting']],front:[['leaves',{n:12}]],vig:.2},
  4:{back:[],front:[['snow',{n:60}]],vig:.25},
  5:{back:[['moonhalo',{at:[300,52]}],['shooting']],front:[['fireflies',{n:14,y0:120,y1:240}]],vig:.5},
  6:{back:[['rays',{x:90,col:'255,244,205'}],['birds',{n:4,y:24}],['glitter',{y:124,y2:162}]],front:[['dust',{n:10,col:'#fff3cf'}]],vig:.18},
  7:{back:[['shooting'],['campfire',{at:[180,206]}]],front:[['embers',{n:10,x:[168,196],y:206}],['fireflies',{n:6,y0:150,y1:240}]],vig:.5},
  8:{back:[['lavaglow']],front:[['embers',{n:40}],['smoke',{x:[60,200],y:190,col:'#1a0e0c',n:6}]],vig:.55},
  9:{back:[['rays',{x:200,col:'255,236,170'}]],front:[['motes',{n:30}]],vig:.18},
  10:{back:[['ripples',{y:208}]],front:[['fireflies',{n:10,day:true,y0:80,y1:220}],['petals',{n:14}]],vig:.22},
  11:{back:[['mist',{y:118,a:.35}],['birds',{n:3,y:40}]],front:[['leaves',{n:8,col:['#3f7a56','#d9a521','#5f9a4a']}],['mist',{y:206,a:.18}]],vig:.22},
  12:{back:[['dragon']],front:[['dust',{n:24,col:'#e2cc96'}]],vig:.25},
  13:{back:[],front:[['embers',{n:24,y:220}],['fireflies',{n:5,y0:150,y1:240}]],vig:.55},
  14:{back:[['forgeglow']],front:[['sparks',{n:40,at:[160,150]}],['smoke',{x:[146,176],y:90,col:'#1a1210',n:5}]],vig:.5},
  15:{back:[['rays',{x:210,col:'255,180,120'}]],front:[['dust',{n:26,col:'#ecb890'}],['embers',{n:12}]],vig:.4},
};
function fxLayer(ctx,n,t,which){const cfg=WORLD_FX[n];if(!cfg)return;(cfg[which]||[]).forEach(([k,o])=>FXK[k]&&FXK[k](ctx,t,o||{}));
  if(which==='front'){if(cfg.grade){ctx.fillStyle=cfg.grade;ctx.fillRect(0,0,FXW,FXH);}
    if(cfg.vig){for(let k=0;k<4;k++){const a=cfg.vig*(1-k/4)*0.45;ctx.fillStyle=`rgba(10,8,14,${a.toFixed(3)})`;const d=k*6;ctx.fillRect(d,d,FXW-d*2,6);ctx.fillRect(d,FXH-d-6,FXW-d*2,6);ctx.fillRect(d,d+6,6,FXH-d*2-12);ctx.fillRect(FXW-d-6,d+6,6,FXH-d*2-12);}}}}

/* загальна сцена для світів без окремої ілюстрації */
function genericBg(w){
  const light=luminance(w.bg)>0.5,top=shade(w.bg,light?0.25:0.18),mid=w.bg,low=shade(w.bg,light?-0.12:-0.3);
  return (sp,f)=>{
    sky(sp,[top,mid,low],0,96);
    const mc=shade(w.bg,light?-0.22:0.3);
    if(w.motif!=='egg'){const m=MOTIFS[w.motif];m.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(r[x]==='x')sp.fill(rect(120+x*7,10+y*7,6,6),mc);});}
    for(let i=0;i<24;i++){const x=Math.floor(hash(i,w.n)*SW),y=Math.floor(hash(i,w.n+20)*90);if((i+f)%5)sp.set(x,y,shade(w.bg,light?-0.35:0.5));}
    for(let y=96;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%6===0?shade(low,-0.1):low);
  };
}
const WORLD_INFO={
  0:{npc:'Вцілілі троянці',does:'Еней збирає ватагу і припаси на згарищі. Микита ще звикає до штанів.'},
  1:{does:'Шикують розкиданий штормом флот. Микита вистежує кораблі з щогли.'},
  2:{does:'Обгороджують Дидоні найбільшу ділянку, йдучи з двох кінців назустріч.'},
  3:{npc:'Цар Лев і звірі ярмарку',does:'Наводять лад на звіриному ярмарку. Микита вчить Енея запам\'ятовувати.'},
  4:{does:'Впускають і випускають звірів: хто заліз останнім, вилазить першим.'},
  5:{does:'Замість кидати в став усіх по черзі, щоразу ділять навпіл.'},
  6:{npc:'Ацест і учасники ігор',does:'Еней змагається, Микита суддює й веде живе табло призерів.'},
  7:{npc:'Чумаки',does:'Розплутують чумацьку валку, що ходить по колу в степу.'},
  8:{does:'Спускаються до Анхіза і повертаються тим самим шляхом, як рекурсія.'},
  9:{npc:'Анхіз',does:'Відновлюють переплутаний родовід Енея.'},
  10:{npc:'Лукаш і Мавка',does:'Повертають кожне дерево Мавчиного лісу на своє місце.'},
  11:{does:'Відновлюють зв\'язок між полонинами хвилями трембіти.'},
  12:{npc:'Кирило Кожум\'яка',does:'Зшивають порізані вали в суцільну оборону від зміїв.'},
  13:{npc:'Низ і Евріал',does:'Еней сам, без Микити, пробирається табором до полоненого друга.'},
  14:{npc:'Вулкан',does:'Кують зброю, не повторюючи вже викуваного.'},
  15:{npc:'Турн',does:'Двобій з Турном: незнайомі задачі без підказок, лише власна тямка.'},
};
const ENEI_SCENE=makeEnei(2);
function sceneDrawer(c,bg,fox,npc,npcPos,floatNpc,extra){
  return f=>{
    const sp=new Spr(SW,SH_);bg(sp,f);
    const s=2,ctx=setup(c,SW*s,SH_*s,true);sp.draw(ctx,0,0,s);
    if(extra)extra(ctx,f,s);
    ENEI_SCENE.draw(ctx,4*s,(SH_-70)*s,s);
    if(fox)fox.draw(ctx,52*s,(SH_-59)*s,s);
    if(npc){const [nx,ny]=npcPos;npc.draw(ctx,nx*s,(ny+(floatNpc?Math.round(Math.sin(f*0.6)):0))*s,s);}
  };
}

/* ================= ОНБОРДИНГ: закріплена сцена ================= */
function makeSibyl(){
  const s=new Spr(40,70),RO='#4a5a3a',ROs='#34402a',SK='#d9b08c',SKs='#b88d6a',HAIR='#cfd3d8',SC='#f1e8d2';
  s.fill(poly([[12,22],[28,22],[33,66],[7,66]]),(x)=>x>23?ROs:RO);
  s.fill(rect(7,64,27,2),'#2a3320');
  s.fill(ell(20,15,9,10),RO);
  s.fill(ell(20,17,5.5,6.5),(x)=>x>21?SKs:SK);
  s.fill(line(15,20,13,34,1.6),HAIR);s.fill(line(25,20,27,34,1.6),HAIR);
  [[13,8],[15,6],[18,5],[22,5],[25,6],[27,8]].forEach(([x,y])=>{s.set(x,y,'#5fa04a');s.set(x,y+1,'#3f7a3a');});
  s.set(18,17,'#9fe3ff');s.set(22,17,'#9fe3ff');s.fill(line(17,15,19,15),SKs);s.fill(line(21,15,23,15),SKs);
  s.fill(line(18,21,22,21),SKs);
  s.fill(rect(12,34,16,6),SC);s.fill(ell(12,37,1.6,3),'#d6c9a6');s.fill(ell(28,37,1.6,3),'#d6c9a6');s.set(20,37,RD);
  s.fill(ell(12,38,2,2),SK);s.fill(ell(28,38,2,2),SKs);
  return s.outline(0.6);
}
const GLYPHS={'{':["..xx",".x..",".x..","x...",".x..",".x..","..xx"],'}':["xx..","..x.","..x.","...x","..x.","..x.","xx.."],'(':["..x",".x.","x..","x..","x..",".x.","..x"],')':["x..",".x.","..x","..x","..x",".x.","x.."]};
function glyph(sp,g,x,y,c){GLYPHS[g].forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]==='x')sp.fill(rect(x+i*2,y+j*2,2,2),c);});}
const OLYMPUS_GODS=Object.fromEntries(['zeus','apollo','bacchus','neptune','venus'].map(k=>[k,[makeGod(k),makeGod(k,{raise:true})]]));
const JUNO_S=makeJuno(),EOL_S=makeEol(),WOLF_S=makeWolf({drool:2}),SIBYL_S=makeSibyl(),FOX_ASH=makeFox('#8d8780'),FOX_SEA=makeFox('#3f7fd0'),FOX_WILD=makeFoxWild(GINGER);
function palace(sp){sky(sp,['#24143a','#3a2360','#55357c'],0,100);columns(sp,[14,44,150,180],22,100,'#7a5aa8','#5b3f86');for(let y=100;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,((x>>3)+(y>>3))%2?'#2a1a42':'#33204f');}
function ruins(sp,f){sky(sp,['#3e3430','#5e4e44','#8c7464'],0,100);[[20,60,10],[60,74,8],[150,56,10],[178,70,8]].forEach(([x,y,w])=>{sp.fill(rect(x,y,w,100-y),'#3a3330');sp.fill(poly([[x,y],[x+w,y],[x+w-2,y-4],[x+2,y-2]]),'#4a423e');});for(let y=100;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%5===0?'#4a4440':'#5a534e');for(let i=0;i<20;i++){const x=Math.floor(hash(i,30)*SW),y=Math.floor(((hash(i,31)*100)-f*1.5-i*3)%100+100)%100;sp.set(x,y,i%3?'#f08a2a':'#f7d26a');}}
const OB_OLD=[
  {kind:'заставка',title:'Олімп',narr:'Давно колись, як іще світи стояли в ладу, на Олімпі сяяла Кришталева Писанка. На її візерунках трималось усе: море в берегах, звірі в казках, задачі у відповідях. А боги бенкетували.',
   lines:[['Зевс','Наливай! Поки Писанка ціла, світ сам себе порахує.'],['Вакх','За лад! За задачі, що мають відповіді!'],['Аполлон','А я заспіваю — гекзаметром, як годиться!'],['Юнона','Святкуйте, святкуйте… Доля Енея теж у тій Писанці.']],act:'Дивиться.',
   bg:(sp,f)=>{sky(sp,['#f6d9a8','#f2c08a','#e9a6a0'],0,100);[[20,96,26,8],[90,104,40,10],[176,98,28,8]].forEach(([x,y,rx,ry])=>sp.fill(ell(x,y,rx,ry),'#fbf3e6'));columns(sp,[6,26,166,186],34,100,'#eee8dc','#cfc6b4');
     for(let y=100;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,((x>>3)+(y>>3))%2?'#e9e2d2':'#d9d0bc');
     // гірлянди між колонами
     for(let x=10;x<190;x++){const y=36+Math.round(Math.sin((x-10)/180*Math.PI)*10);if(x%3)sp.set(x,y,(x>>3)%2?RD:GD);}
     for(let k=0;k<10;k++){const a=(k/10)*6.28+f*0.05;line(100,34,100+Math.cos(a)*70,34+Math.sin(a)*44).forEach(([x,y],j)=>{if(j%3===0&&j>10)sp.set(x,y,'#f7e3a1');});}},
   fg:(ctx,f,s)=>{
     drawEgg(ctx,17,22,(100-8)*s,12*s,s,false,true,0,f%2?0.85:0.95);
     const G=OLYMPUS_GODS,base=SH_*s-66;
     const bob=(k)=>Math.round(Math.sin((f+k*3)*0.35)*2);
     // хто що робить у кадрі f
     const pose=[['apollo',4,f%6<3],['bacchus',54,f%10<5],['zeus',146,f%16<8],['neptune',236,f%18<9],['venus',290,f%12<6]];
     pose.forEach(([k,x,up],i)=>{const sp=up?G[k][1]:G[k][0];const dy=k==='bacchus'?Math.abs(Math.sin(f*0.3))*-6:bob(i);sp.draw(ctx,x,Math.round(base-sp.h+dy),1);});
     JUNO_S.draw(ctx,344,base-JUNO_S.h+2,1);
     if(f%30<8){ctx.fillStyle='#f4ecda';ctx.fillRect(330,base-JUNO_S.h-18,30,14);ctx.fillStyle='#4a2a78';ctx.font='bold 10px "Fira Code", monospace';ctx.fillText(ST('хм…'),334,base-JUNO_S.h-7);}
     // стіл: скатертина з орнаментом і наїдки
     const ty=base-14;ctx.fillStyle='#7a4a24';ctx.fillRect(40,ty,300,6);ctx.fillStyle='#f6efe0';ctx.fillRect(40,ty+6,300,14);
     for(let x=40;x<340;x+=6){ctx.fillStyle=(x/6)%2?RD:BK;ctx.fillRect(x+1,ty+15,3,3);}
     ctx.fillStyle='#5b3a20';ctx.fillRect(48,ty+20,6,14);ctx.fillRect(326,ty+20,6,14);
     [[70,'#b3202a'],[120,'#d9a521'],[200,'#6b3fa0'],[262,'#b3202a'],[300,'#d9a521']].forEach(([x,c],i)=>{ctx.fillStyle=GD;ctx.fillRect(x,ty-8,6,8);ctx.fillStyle=c;ctx.fillRect(x+1,ty-7,4,3);});
     ctx.fillStyle='#c9773a';[[96,ty-6],[104,ty-7],[112,ty-6]].forEach(([x,y])=>{ctx.fillRect(x,y,7,6);});
     ctx.fillStyle='#8b3a2a';ctx.beginPath();ctx.arc(170,ty-4,8,Math.PI,0);ctx.fill();ctx.fillStyle='#5fa04a';ctx.fillRect(164,ty-12,3,4);
     ctx.fillStyle='#6b3fa0';[[226,ty-6],[230,ty-9],[234,ty-6],[230,ty-4]].forEach(([x,y])=>ctx.fillRect(x,y,4,4));
     // «дзень!» — тост Зевса
     if(f%16<3){ctx.fillStyle='#fff6c8';ctx.font='bold 11px "Fira Code", monospace';ctx.fillText(ST('дзень!'),174,base-84);for(let i=0;i<6;i++){const a=i/6*6.28;ctx.fillRect(194+Math.cos(a)*10,base-70+Math.sin(a)*8,3,3);}}
     // ноти Аполлона
     for(let i=0;i<4;i++){const t=((f*0.3+i*5)%20)/20,x=34+i*6+Math.sin((f+i)*0.3)*6,y=base-70-t*60;ctx.globalAlpha=1-t;ctx.fillStyle='#4a2a78';ctx.fillRect(Math.round(x),Math.round(y),3,3);ctx.fillRect(Math.round(x)+2,Math.round(y)-7,1,8);ctx.globalAlpha=1;}
     // серця Венери
     for(let i=0;i<3;i++){const t=((f*0.25+i*7)%21)/21,x=316+i*8+Math.sin(f*0.25+i)*5,y=base-80-t*50;ctx.globalAlpha=1-t;ctx.fillStyle='#e0504a';ctx.fillRect(x,y,2,2);ctx.fillRect(x+3,y,2,2);ctx.fillRect(x,y+2,5,2);ctx.fillRect(x+1,y+4,3,1);ctx.globalAlpha=1;}
     // конфеті
     for(let i=0;i<34;i++){const x=(hash(i,70)*400+Math.sin((f+i)*0.2)*6)%400,y=((hash(i,71)*260+f*(1+i%2))%260);ctx.fillStyle=RAINBOW[i%6];ctx.fillRect(Math.round(x),Math.round(y),i%3?3:2,i%2?3:2);}
   }},
  {kind:'заставка',title:'Змова',narr:'Юнона кличе Еола: доля Енея записана в Писанці, тож Писанку треба розбити.',lines:[['Юнона','Розбий її, і долі не буде. Плачу щедро: мішок золота і вічний вихідний.'],['Еол','Ну… для вас хоч ураган.']],act:'Дивиться.',
   bg:palace,fg:(ctx,f,s)=>{EOL_S.draw(ctx,6*s,(46+(f%2))*s,s);JUNO_S.draw(ctx,120*s,52*s,s);const gl=f%3===0;ctx.fillStyle=GD;ctx.fillRect(96*s,112*s,10*s,8*s);if(gl){ctx.fillStyle='#fff6c8';ctx.fillRect(99*s,111*s,s,s);}}},
  {kind:'заставка',title:'Шторм',narr:'Бахнуло так, що Зевс протверезів. Писанка на друзки, а друзки по книжках. І в кожній книжці, куди впав уламок, лад пішов шкереберть.',lines:[],act:'Бачить тизер мапи: 13 міток спалахують і гаснуть.',
   bg:(sp,f)=>{sky(sp,['#0b1626','#152a45','#22405f'],0,SH_);[[40,20,24,8],[160,28,26,9],[100,14,18,6]].forEach(([x,y,rx,ry])=>sp.fill(ell(x+(f%3),y,rx,ry),'#3d5675'));if(f%6<2)sp.fill(path([[150,10],[142,30],[150,32],[138,60]],1.6),'#f7e27a');for(let i=0;i<30;i++){const x=Math.floor((hash(i,40)*SW+f*6)%SW),y=Math.floor(hash(i,41)*SH_);sp.fill(line(x,y,x-6,y+2),'#5f7f9f');}
     sp.fill(rect(10,108,180,4),'#5b3a20');[[16,'#b3202a'],[28,'#2f55a0'],[38,'#4f9d4a'],[50,'#d9a521'],[62,'#6b3fa0'],[132,'#e2702b'],[146,'#2e8b57'],[158,'#7b2d6b'],[170,'#1fa3a3']].forEach(([x,c],k)=>{sp.fill(rect(x,90-(k%3)*2,9,18+(k%3)*2),c);sp.fill(rect(x+1,96,7,1),GD);});},
   fg:(ctx,f,s)=>drawEgg(ctx,34,44,(83)*s,(16)*s,s,true,false,0.08+0.2*((f%14)/14))},
  {kind:'заставка',title:'Ліс Франка',narr:'Хто знає казку, той знає: Микита в діжу таки впаде. Але цього разу діжа була з дірою в інший світ.',lines:[['Микита','О, а це що за ласощі?']],act:'Дивиться.',
   bg:(sp,f)=>{sky(sp,['#bfe0c8','#d9eed9','#eef6ea'],0,92);[[12,92,36],[34,90,30],[160,92,34],[186,90,30],[60,92,22]].forEach(([x,y,h])=>spruce(sp,x,y,h,'#2d5a3a',false));for(let y=92;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%6===0?'#4f8a4a':'#5f9a4a');sp.fill(rect(120,50,60,44),'#e9e4d6');sp.fill(poly([[114,52],[186,52],[150,30]]),'#8a6a3a');
     const bx=96,by=96;sp.fill(rect(bx,by,20,18),'#7a4a24');sp.fill(rect(bx,by+4,20,2),'#3a2414');sp.fill(rect(bx,by+12,20,2),'#3a2414');sp.fill(rect(bx+1,by,18,2),RAINBOW[f%RAINBOW.length]);
     const t=f%26;if(t>=19){for(let i=0;i<14;i++){const a=i/14*3.14,r=(t-18)*3;sp.set(bx+10+Math.cos(a)*r,by-Math.sin(a)*r,RAINBOW[i%6]);}}},
   fg:(ctx,f,s)=>{const t=f%26;if(t<19){const p=t/18,x=40+p*56,y=82-Math.sin(p*3.14)*40-(p>0.8?(p-0.8)*60:0);FOX_WILD.draw(ctx,Math.round(x)*s,Math.round(y)*s,s);}}},
  {kind:'заставка',title:'Присяга',narr:'Вовк Неситий ковтає інший уламок і гепається на підлогу палат Юнони, вже олюднений.',lines:[['Юнона','Служитимеш мені, матимеш весь ліс на обід.'],['Вовк','Весь-весь? І зайців?']],act:'Дивиться.',
   bg:palace,fg:(ctx,f,s)=>{WOLF_S.draw(ctx,20*s,(62+(f%2))*s,s);JUNO_S.draw(ctx,120*s,52*s,s);}},
  {kind:'заставка',title:'Попелище Трої',narr:'Еней був парубок моторний / І кодер хоч куди козак, / На всяку задачу проворний, / Завзятіший од всіх бурлак.',lines:[['Микита','Це… Троя? А де мій ліс? І чому на мені штани?'],['Еней','Звідки ти, рудий? Тобто… сірий?']],act:'Тисне «Перший крок» і вперше бачить редактор.',
   bg:ruins,fg:(ctx,f,s)=>{ENEI_SCENE.draw(ctx,30*s,(SH_-70)*s,s);const t=f%24,y=t<12?-60+t*(71/12):11;FOX_ASH.draw(ctx,110*s,Math.round(y+(SH_-71))*s- (t<12?0:0),s);if(t<12)for(let k=0;k<3;k++){ctx.fillStyle='#e9e1cc';ctx.fillRect((116+k*10)*s,Math.round(y+(SH_-71)-8-k*4)*s,s,4*s);}
     ctx.fillStyle='#141b17';ctx.fillRect(150*s,14*s,44*s,16*s);ctx.fillStyle='#e2702b';ctx.fillRect(154*s,18*s,8*s,8*s);ctx.fillStyle='#e7e0cf';for(let k=0;k<5;k++)ctx.fillRect((166+k*5)*s,21*s,3*s,2*s);}},
  {kind:'інтерактив',title:'Сивілла',narr:'Лад тримається на точному слові. Ліворуч слово, праворуч світ, а «Крок» показує, як світ виконує кожне слово.',lines:[['Сивілла','Скажеш криво, і світ піде криво. Скажеш точно, і світ послухає.']],act:'Проходить тур: Сивілла показує кожну частину інтерфейсу, а потім веде на Суд богів.',
   bg:(sp,f)=>{sky(sp,['#1c1612','#2b2119','#3b2d22'],0,SH_);sp.fill(ell(100,40,70,46),'#4a3a2c');sp.fill(ell(100,44,56,36),'#5a4836');for(let y=104;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%5===0?'#2b2119':'#3b2d22');
     [['{',70,30],['}',150,26],['(',100,18],[')',124,40]].forEach(([g,x,y],i)=>glyph(sp,g,x,y+Math.round(Math.sin((f+i*3)*0.5)*2),i%2?'#9fe3ff':'#f2d27a'));},
   fg:(ctx,f,s)=>{ENEI_SCENE.draw(ctx,20*s,(SH_-70)*s,s);SIBYL_S.draw(ctx,130*s,(SH_-70)*s,s);}},
  {kind:'інтерактив',title:'Збори ватаги',narr:'Еней збирає вцілілих троянців і зерно. Перші вправи світу 0: цикл, умова, змінна-лічильник.',lines:[['Еней','Збираймо своїх, і зерно не лишаймо.'],['Микита','Можна й руками кожен мішок… але цикл хитріший.']],act:'Проходить вправи світу 0 і фінальну задачу Running Sum.',
   bg:(sp,f)=>{ruins(sp,f);const ex=12+(f%40)*4;for(let i=0;i<7;i++){const x=60+i*18;if(x>ex+30)sp.fill(ell(x,112,5,6),(xx,yy)=>yy<108?'#c9a466':'#a8844a');}},
   fg:(ctx,f,s)=>{const ex=12+(f%40)*4;ENEI_SCENE.draw(ctx,Math.min(ex,150)*s,(SH_-70)*s,s);}},
  {kind:'інтерактив',title:'Відплиття',narr:'Корабель заходить у тріщину між світами, Микита перефарбовується в морський синій. Так почалась Кодеїда.',lines:[['Микита','Чую… пахне морем і уламком. Туди!']],act:'Після фінальної задачі світу 0 бачить заставку, потім відкривається мапа світів.',
   bg:(sp,f)=>{sky(sp,['#5a4a8a','#c96f7a','#f2b880'],0,80);sp.fill(ell(60,78,14,14),'#ffd98a');sea(sp,f,80,'#3a4f86','#2a3a6a','#f2b880');
     for(let y=14;y<96;y++){const x=164+Math.round(Math.sin(y*0.4+f*0.3)*2);for(let k=-6;k<=6;k++){const a=Math.abs(k);if(a<2)sp.set(x+k,y,'#ffffff');else if(a<4&&(y+f)%2)sp.set(x+k,y,'#9fe3ff');else if((x+k+y)%3===0)sp.set(x+k,y,'#6fb6e3');}}},
   fg:(ctx,f,s)=>{const sx=6+(f%40)*1.5,bob=(f%4<2?0:1),dk=96+bob;
     poly([[sx+34,30],[sx+66,62],[sx+34,88]]).forEach(([x,y])=>px(ctx,x*s,y*s,s,(y===60||y===61)?RD:'#efe7d4'));
     poly([[sx+30,40],[sx+8,74],[sx+30,86]]).forEach(([x,y])=>px(ctx,x*s,y*s,s,'#e2d9c3'));
     line(sx+32,dk,sx+32,26).forEach(([x,y])=>{px(ctx,x*s,y*s,s,'#3a2414');px(ctx,(x+1)*s,y*s,s,'#3a2414');});
     poly([[sx,dk],[sx+80,dk],[sx+72,dk+13],[sx+8,dk+13]]).forEach(([x,y])=>px(ctx,x*s,y*s,s,y<dk+2?'#7a4a24':(y>dk+9?'#3a2414':'#5b3a20')));
     for(let k=0;k<6;k++)px(ctx,(sx+12+k*11)*s,(dk+5)*s,s,'#2a1a10');
     ENEI_SCENE.draw(ctx,Math.round((sx+14)*s),dk*s-70,1);
     FOX_SEA.draw(ctx,Math.round((sx+54)*s),dk*s-58,1);}},
];
/* ================= ДОДАТКОВІ ПЕРСОНАЖІ ================= */
function makeAnchises(){
  const s=new Spr(44,72),SK='#e2b08e',SKs='#c08f6c',RO='#f1ece0',ROs='#d8d0bf',BE='#f2f2f2',BEs='#cfcfcf';
  s.fill(line(8,18,8,70,1.6),'#7a5a32');
  s.fill(poly([[14,24],[30,24],[34,68],[10,68]]),(x)=>x>26?ROs:RO);
  s.fill(rect(10,66,25,2),GD);s.fill(line(14,26,30,46,1.4),GD);
  s.fill(poly([[14,25],[9,36],[11,38],[16,30]]),RO);s.fill(ell(9,38,2,2),SK);
  s.fill(poly([[30,25],[34,36],[32,38],[29,30]]),ROs);s.fill(ell(33,38,2,2),SKs);
  s.fill(rect(19,20,7,5),SK);
  s.fill(ell(22,14,6,7),(x)=>x>24?SKs:SK);
  s.fill(poly([[16,17],[28,17],[26,34],[18,34]]),(x)=>x>24?BEs:BE);
  s.fill(path([[22,18],[18,19],[16,22]],1.6),BE);s.fill(path([[22,18],[26,19],[28,22]],1.6),BE);
  s.fill(rect(18,13,2,1),BK);s.fill(rect(24,13,2,1),BK);s.fill(rect(17,11,4,1),BE);s.fill(rect(23,11,4,1),BE);
  [[15,9],[17,7],[20,6],[24,6],[27,7],[29,9]].forEach(([x,y])=>{s.set(x,y,'#5fa04a');s.set(x,y+1,'#3f7a3a');});
  return s.outline(0.6);
}
function makeTurn(){
  const s=new Spr(50,74),SK='#d9a07a',SKs='#b47d58',BR='#c08a3e',BRs='#8f6228',CA='#9b1c1c',CAs='#701313';
  s.fill(line(42,2,44,72,1.6),'#6b4a2a');s.fill(poly([[40,6],[42,0],[44,6],[42,9]]),'#cdd2da');
  s.fill(poly([[12,24],[36,24],[41,66],[7,66]]),(x)=>x>30?CAs:CA);
  s.fill(rect(16,50,6,14),SK);s.fill(rect(26,50,6,14),SKs);s.fill(rect(16,56,6,8),BR);s.fill(rect(26,56,6,8),BRs);
  s.fill(rect(14,64,9,4),'#4a2a18');s.fill(rect(25,64,9,4),'#3a1f10');
  s.fill(rect(14,42,20,9),(x)=>x%3===0?'#5a3a1c':'#7a5228');
  s.fill(poly([[14,24],[34,24],[32,42],[16,42]]),(x)=>x>27?BRs:BR);
  s.fill(line(24,27,24,40),BRs);s.fill(line(18,31,22,33),BRs);s.fill(line(30,31,26,33),BRs);
  s.fill(poly([[34,25],[40,33],[41,36],[34,32]]),SKs);s.fill(ell(41,36,2,2),SKs);
  s.fill(ell(10,36,9,11),(x,y)=>Math.hypot((x-10)/9,(y-36)/11)>0.82?BRs:BR);s.fill(ell(10,36,3,3.5),'#1fa3a3');s.set(10,36,'#1b3f8f');
  s.fill(rect(21,20,6,5),SK);
  s.fill(ell(24,15,5.5,6.5),(x)=>x>26?SKs:SK);
  s.fill(ell(24,11,7,5.5),BR);s.fill(rect(17,11,3,8),BR);s.fill(rect(28,11,3,8),BRs);
  s.fill(path([[15,6],[18,1],[24,0],[30,1],[34,6],[33,12]],2.4),CA);
  s.fill(line(20,14,23,15),BK);s.fill(line(28,14,25,15),BK);s.set(22,16,'#f2c230');s.set(26,16,'#f2c230');
  s.fill(rect(22,20,4,1),'#7a2a2a');
  return s.outline(0.6);
}
function makeLion(){
  const s=new Spr(56,50),F='#d9a256',Fs='#b07b36',MA='#8a4f1c',MAs='#6b3a12';
  s.fill(path([[44,40],[52,36],[54,28]],2),Fs);s.fill(ell(54,27,2.4,2.4),MA);
  s.fill(ell(32,36,15,11),(x,y)=>y>40?Fs:F);
  s.fill(rect(20,40,5,9),F);s.fill(rect(36,40,5,9),Fs);s.fill(rect(19,47,7,2),Fs);s.fill(rect(35,47,7,2),MAs);
  s.fill(ell(20,20,14,15),(x,y)=>hash(x,y)<0.2?MAs:MA);
  s.fill(ell(20,22,8,9),(x)=>x>22?Fs:F);
  s.fill(poly([[16,24],[24,24],[22,30],[18,30]]),'#f1d9a8');s.fill(rect(19,24,3,2),BK);
  s.fill(rect(15,19,3,1),BK);s.fill(rect(23,19,3,1),BK);s.set(16,19,'#f2c230');s.set(24,19,'#f2c230');
  s.fill(poly([[12,10],[28,10],[28,4],[25,7],[20,2],[15,7],[12,4]]),GD);s.set(20,6,RD);
  return s.outline(0.6);
}

/* перехід між двома спрайтами будь-якого розміру: піксельне розчинення */
function drawSwap(ctx,A,ax,ay,B,bx,by,s,p){
  if(A&&p<1)for(let y=0;y<A.h;y++)for(let x=0;x<A.w;x++){const c=A.p[y*A.w+x];if(c&&hash(x,y)>=p)px(ctx,ax+x*s,ay+y*s,s,c);}
  if(B)for(let y=0;y<B.h;y++)for(let x=0;x<B.w;x++){const c=B.p[y*B.w+x];if(c&&hash(x,y)<p)px(ctx,bx+x*s,by+y*s,s,c);}
}

/* ================= ЧАС І АНІМАЦІЇ (сцени як функції часу) ================= */
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const easeOut=x=>1-Math.pow(1-x,3);
const easeInOut=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
const back=x=>{const c=1.5;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);};
const lerp=(a,b,x)=>a+(b-a)*x;
const ease=easeOut;

/* ================= МАПА МАНДРІВКИ (чисті функції: сайт і гра) ================= */
const NODES=[[18,78],[40,60],[62,44],[80,28],[96,44],[110,72],[126,86],[142,70],[154,40],[172,26],[186,66],[200,84],[214,64],[206,34],[222,20],[234,40]];
const ISLES=[{c:[28,70],r:[22,16],land:'#7d7670'},{c:[80,38],r:[26,18],land:'#cdb27a'},{c:[126,76],r:[26,16],land:'#6c6aa0'},{c:[162,34],r:[18,14],land:'#7a2c22'},{c:[200,72],r:[24,16],land:'#4f8a4a'},{c:[220,30],r:[20,16],land:'#c9a24a'}];
const MW=240,MH=110,MS=4;
let _mapBase=null;
function mapBase(){if(_mapBase)return _mapBase;const sp=new Spr(MW,MH);ISLES.forEach((is,i)=>{sp.fill(ell(is.c[0],is.c[1],is.r[0]+2,is.r[1]+2).filter(([x,y])=>hash(x,y+i)>0.08||Math.hypot((x-is.c[0])/is.r[0],(y-is.c[1])/is.r[1])<0.85),'#e3c58e');sp.fill(ell(is.c[0],is.c[1],is.r[0],is.r[1]).filter(([x,y])=>hash(x+3,y)>0.05),(x,y)=>(x+y)%5===0?shade(is.land,-0.15):is.land);});return _mapBase=sp;}
const routePts=[];for(let i=0;i<NODES.length-1;i++){const [a,b]=NODES[i],[c,d]=NODES[i+1];routePts.push(line(a,b,c,d));}
function worldCol(i,f=0){const w=ALL_WORLDS[i];return w.fox==='rainbow'?RAINBOW[f%RAINBOW.length]:w.fox;}
/* Точка на маршруті між світами from і to, p = 0..1 (для кораблика). */
function routePoint(from,to,p){
  if(from===to||p>=1)return NODES[to];
  const a=Math.min(from,to),b=Math.max(from,to),seg=[];for(let i=a;i<b;i++)seg.push(...routePts[i]);
  if(from>to)seg.reverse();return seg[Math.min(seg.length-1,Math.floor(p*seg.length))]||NODES[to];
}
/* Мапа: море, острови-пісні, маршрут (золотий до reached), мітки світів, рамка навколо active і кораблик.
   o.state(i): 'locked' | 'open' | 'done' — у грі закриті світи сірі, пройдені мають золоту рамку. */
/* Море мапи: один буфер на весь час, перераховується лише коли змінився кадр f (новий Spr щокадру коштував ~45 мс). */
let _sea=null,_seaF=-1;
function paintJourney(ctx,f,o){
  const s=o.scale||MS,fresh=_seaF!==f,sea=_sea||(_sea=new Spr(MW,MH));_seaF=f;
  if(fresh)
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const w=(x+Math.round(Math.sin((y+f)*0.5)*3)+f)%14;sea.set(x,y,w===0&&y%4===0?'#3c6c9e':((x+y)%2?'#1d3f66':'#21466f'));}
  sea.draw(ctx,0,0,s);mapBase().draw(ctx,0,0,s);
  const reached=o.reached??o.active;
  routePts.forEach((L,i)=>L.forEach(([x,y],k)=>{if((k+f)%4<2)px(ctx,x*s,y*s,s,i<reached?'#f2d27a':'rgba(201,214,228,.75)');}));
  NODES.forEach(([x,y],i)=>{const st=o.state?o.state(i):'open',col=st==='locked'?'#6c776f':worldCol(i,f),on=i===o.active;
    if(on){const r=f%2?5:6;for(let k=-r;k<=r;k++){[[x+k,y-r],[x+k,y+r],[x-r,y+k],[x+r,y+k]].forEach(([a,b])=>px(ctx,a*s,b*s,s,col));}}
    const edgeC=st==='done'?GD:'#0f1f33';
    for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++){if(Math.abs(a)===3&&Math.abs(b)===3)continue;const edge=Math.abs(a)===3||Math.abs(b)===3,ring=Math.abs(a)===2||Math.abs(b)===2;px(ctx,(x+a)*s,(y+b)*s,s,edge?edgeC:(ring?'#fbf3e6':col));}
    if(st==='locked'){px(ctx,x*s,(y-1)*s,s,'#2a332e');px(ctx,(x-1)*s,y*s,s,'#2a332e');px(ctx,x*s,y*s,s,'#2a332e');px(ctx,(x+1)*s,y*s,s,'#2a332e');}
    else px(ctx,(x-1)*s,(y-1)*s,s,shade(col,0.45));
  });
  if(o.ship){const [sx,sy]=o.ship,bob=f%2;
    [[0,0,'#e9e1cc'],[0,1,'#e9e1cc'],[1,1,'#e9e1cc'],[0,2,'#e9e1cc'],[1,2,RD],[2,2,'#e9e1cc'],[-3,3,'#5b3a20'],[-2,3,'#5b3a20'],[-1,3,'#5b3a20'],[0,3,'#5b3a20'],[1,3,'#5b3a20'],[2,3,'#5b3a20'],[3,3,'#5b3a20'],[-2,4,'#3a2414'],[-1,4,'#3a2414'],[0,4,'#3a2414'],[1,4,'#3a2414'],[2,4,'#3a2414']].forEach(([a,b,c])=>px(ctx,(sx+4+a)*s,(sy-9+b+bob)*s,s,c));}
}
/* Картинка світу для картки: сцена, Еней, Микита (перефарбовується з кольору foxFrom за p) і мешканець. */
const ART={};
function artOf(n){if(!ART[n]){const ws=WORLD_SCENES[n];ART[n]=ws?{bg:ws.bg,npc:ws.npcSpr,pos:ws.npcPos,float:ws.float}:{bg:genericBg(ALL_WORLDS[n])};}return ART[n];}
function paintWorldArt(ctx,n,f,foxFrom,p=1){
  const w=ALL_WORLDS[n],a=artOf(n),s=2;
  /* фон картки: свій буфер для кожного світу, перемальовується лише з новим кадром f */
  const sp=a.sp||(a.sp=new Spr(SW,SH_));if(a.spF!==f){sp.clear();a.bg(sp,f);a.spF=f;}sp.draw(ctx,0,0,s);
  const FT=(typeof performance!=='undefined'?performance.now():0)/1000;fxLayer(ctx,w.n,FT,'back');
  ENEI_SCENE.draw(ctx,4*s,(SH_-70)*s,s);
  drawSwap(ctx,foxFrom&&hdOf(foxFrom),52*s-1,(SH_-59)*s-1,hdOf(foxFor(w)),52*s-1,(SH_-59)*s-1,s/2,easeOut(p));
  if(a.npc){const [nx,ny]=a.pos;a.npc.draw(ctx,nx*s,(ny+(a.float?Math.round(Math.sin(f*0.6)):0))*s,s);}
  fxLayer(ctx,w.n,FT,'front');
}

/* Сцени — функції локального часу. Біжать лише на екрані і стартують заново при появі.
   kind 'loop' (draw(t) із t у секундах) або 'tick' (draw(frame) з інтервалом). */
const scenes=[];
const vio=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{
  const sc=e.target._scene;if(!sc)return;
  if(e.isIntersecting){if(!sc.on){sc.on=true;sc.since=performance.now();}}else sc.on=false;
}),{threshold:0.05}):null;
function scene(el,opt){ // opt: {loop, draw(t,T)} або {interval, draw(frame)}
  const sc={...opt,on:false,since:0,last:0,frame:0};el._scene=sc;
  if(REDUCED||!vio){opt.loop?opt.draw(opt.rest??opt.loop*.7,0):opt.draw(0);return sc;}
  scenes.push(sc);vio.observe(el);return sc;
}
/* якщо переглядач розтягнув сторінку на всю висоту контенту (iframe без власного скролу),
   усі сцени «видимі» одночасно — тоді малюємо рідше, щоб не блокувати прокрутку */
let fitAllPublic=null;
const TALL=()=>window.innerHeight>1600;
const t0=performance.now();let lastLoop=0;
function frame(now){
  const T=(now-t0)/1000,tall=TALL(),loopOk=!tall||now-lastLoop>140;if(loopOk)lastLoop=now;
  for(const sc of scenes){
    if(!sc.on)continue;
    if(sc.loop){if(loopOk)sc.draw(((now-sc.since)/1000)%sc.loop,T);}
    else if(now-sc.last>sc.interval){sc.last=now;sc.frame++;sc.draw(sc.frame);}
  }
  requestAnimationFrame(frame);
}
if(!REDUCED&&vio)requestAnimationFrame(frame);

/* ================= ФОН ================= */
(function(){
  const c=document.getElementById('bg');if(!c)return;
  if(window.innerHeight>1600){c.style.display='none';return;}
  let W=0,H=0,ctx,parts=[],cols=[];
  const readCols=()=>{const cs=getComputedStyle(document.documentElement);cols=['--bg-p1','--bg-p2','--bg-p3'].map(v=>cs.getPropertyValue(v).trim()||'#b3202a');};
  const DIAMOND=[[0,-1],[-1,0],[0,0],[1,0],[0,1]];
  function resize(){W=window.innerWidth;H=window.innerHeight;ctx=setup(c,W,H);
    parts=Array.from({length:Math.round(W*H/26000)},(_,i)=>({x:hash(i,9)*W,y:hash(i,10)*H,v:0.12+hash(i,11)*0.35,s:hash(i,12)<0.25?6:4,k:i%3,shape:hash(i,13)<0.35,ph:hash(i,14)*6.28,depth:0.2+hash(i,15)*0.8}));}
  function draw(t){ctx.clearRect(0,0,W,H);const sc=window.scrollY;
    for(const p of parts){const y=((p.y-t*p.v*0.03-sc*0.15*p.depth)%(H+40)+H+40)%(H+40)-20,x=p.x+Math.sin(t*0.0006+p.ph)*10,tw=0.5+0.5*Math.sin(t*0.002+p.ph);
      ctx.globalAlpha=0.16+0.3*tw*p.depth;const q=Math.round(x/p.s)*p.s,r=Math.round(y/p.s)*p.s;
      if(p.shape)DIAMOND.forEach(([a,b])=>px(ctx,q+a*p.s,r+b*p.s,p.s,cols[p.k]));else px(ctx,q,r,p.s,cols[p.k]);}
    ctx.globalAlpha=1;}
  readCols();resize();draw(0);
  window.addEventListener('resize',()=>{resize();draw(performance.now());});
  window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{readCols();draw(performance.now());});
  new MutationObserver(readCols).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  if(REDUCED)return;let last=0;(function loop(t){if(!document.hidden&&t-last>45){last=t;draw(t);}requestAnimationFrame(loop);})(0);
})();

/* ================= ОБКЛАДИНКА ================= */
const ENEI=makeEnei(2),ENEI_BLINK=makeEnei(2,{blink:true});
const heroC=document.getElementById('hero');
const heroFox=[FOX_GINGER,makeFox(GINGER,{cursorOff:true})];
function drawHero(f=0){
  const W=720,H=320,ctx=setup(heroC,W,H,true);ctx.clearRect(0,0,W,H);
  drawEgg(ctx,34,44,292,56,4,false,true,0,f%2?0.9:0.97);
  (f%7===6?ENEI_BLINK:ENEI).draw(ctx,48,20,4);heroFox[f%2].draw(ctx,520,68,4);
  [[250,70],[440,60],[240,250],[452,262]].forEach(([x,y],i)=>{const dy=Math.round(Math.sin((f+i*2)*0.9)*2)*4,c=i%2?RD:'#a7d6e6';px(ctx,x,y+dy,4,c);px(ctx,x+4,y+4+dy,4,'#d4ecf3');px(ctx,x-4,y+4+dy,4,'#d4ecf3');px(ctx,x,y+8+dy,4,c);});
}
drawHero();scene(heroC,{interval:420,draw:drawHero});
// заголовок: літера за літерою 
(function(){const h=document.getElementById('heroTitle');if(!h||REDUCED)return;let i=0;
  h.querySelectorAll('[data-split]').forEach(el=>{el.innerHTML=[...el.textContent].map(ch=>`<span class="ch" style="animation-delay:${120+i++*70}ms">${ch}</span>`).join('');});})();

/* ================= ПЕРСОНАЖІ: галерея ================= */
const WORLD_COLORS=ALL_WORLDS.map(w=>({n:w.n,name:w.foxName,col:w.fox}));
const CHARS=[
  {id:'enei',cat:'heroes',name:'Еней',src:'Котляревський, «Енеїда»',role:'Головний герой. Гравець завжди керує ним кодом.',
   bullets:['Оселедець закручений у дужку {. Головна впізнавана риса і основа логотипа.','Вишиванка росте з гравцем: кожен уламок додає візерунок.','Статний, руки в боки, шабля при боці.'],
   vars:[{n:'Основний',m:()=>makeEnei(2),blink:()=>makeEnei(2,{blink:true})},{n:'На старті',note:'Чиста сорочка, світ 0.',m:()=>makeEnei(0)},{n:'У жупані',note:'Холодні світи і мандри.',m:()=>makeEnei(2,{coat:true})},{n:'До бою',note:'Фінальні задачі, двобій з Турном.',m:()=>makeEnei(2,{pose:'sabre'})},{n:'На бенкеті',note:'Після кожного уламка.',m:()=>makeEnei(2,{pose:'mug'})}]},
  {id:'fox',cat:'heroes',name:'Лис Микита',src:'Франко, «Фарбований лис»',role:'Маскот і помічник. Підказує, жартує, носить Книгу хитрощів.',
   bullets:['Поза своїм лісом олюднений чарами Писанки.','Кожен перехід між світами перефарбовує його. Оберіть колір нижче.','Білий кінчик хвоста блимає, як курсор.'],colors:true,
   vars:[{n:'Олюднений',m:(c)=>makeFox(c||GINGER),alt:(c)=>makeFox(c||GINGER,{cursorOff:true})},{n:'У рідному лісі',note:'Без чарів, на чотирьох лапах.',m:()=>makeFoxWild(GINGER)},{n:'Остромисл',note:'Режим експерта, у короні.',m:()=>makeFox(GINGER,{rainbow:true,crown:true})},{n:'У полоні',note:'Табір Турна, без Книги.',m:()=>makeFox('#33467a',{chains:true,sad:true})}]},
  {id:'juno',cat:'villains',name:'Юнона',src:'Котляревський, «Енеїда»',role:'Головна злодійка. Підкупила Еола розбити Писанку.',
   bullets:['Накладає обмеження: Time Limit, Memory Limit, великі входи.','Символ — павине перо, кольори фіолет і золото.','У фіналі визнає поразку.'],
   vars:[{n:'Основна',m:()=>makeJuno(),alt:()=>makeJuno({shimmer:true})}]},
  {id:'wolf',cat:'villains',name:'Вовк Неситий',src:'Франко, «Лис Микита»',role:'Суперник-brute force на службі Юнони.',
   bullets:['Проковтнув уламок і потрапив до Юнони.','У кожному світі розв\'язує в лоб і програє на великих тестах.','У фіналі переходить на бік Енея заради бенкету.'],
   vars:[{n:'У лівреї Юнони',m:()=>makeWolf({drool:3}),alt:()=>makeWolf({drool:1})},{n:'У рідному лісі',note:'До уламка.',m:()=>makeWolfWild()},{n:'Жадібний',note:'Заїдає провал перебором.',m:()=>makeWolf({food:true,drool:0})},{n:'На бенкеті',note:'Фінал.',m:()=>makeWolf({feast:true,drool:0})}]},
  {id:'turn',cat:'villains',name:'Турн',src:'Котляревський, «Енеїда»',role:'Фінальний бос, чемпіон Юнони в Лаціумі.',
   bullets:['Двобій з ним — режим співбесіди без підказок.','На щиті павине око Юнони.'],vars:[{n:'Основний',m:()=>makeTurn()}]},
  {id:'eol',cat:'npc',name:'Еол',src:'Енеїда · Світ 1',role:'Бог вітрів із мішком вітрів. Розбив Писанку за плату.',bullets:['Затихає, коли гравець вишикує флот.'],vars:[{n:'На хмарі',m:()=>makeEol()}]},
  {id:'dido',cat:'npc',name:'Дидона',src:'Енеїда · Світ 2',role:'Цариця Карфагена з волячою шкурою.',bullets:['Задача Дидони = Container With Most Water.'],vars:[{n:'Основна',m:()=>makeDido()}]},
  {id:'lion',cat:'npc',name:'Цар Лев',src:'Франко · Світ 3',role:'Правитель звіриного ярмарку. Удома звірі не олюднені.',bullets:['Повертає Микиті звання канцлера на мить.'],vars:[{n:'Основний',m:()=>makeLion()}]},
  {id:'mitten',cat:'npc',name:'Мешканці рукавички',src:'Народна казка · Світ 4',role:'Мишка, жабка і зайчик у рукавичці.',bullets:['Хто заліз останнім, вилазить першим: Stack.'],vars:[{n:'Рукавичка',m:()=>makeMitten()}]},
  {id:'sotnyk',cat:'npc',name:'Сотник Забрьоха',src:'Квітка-Основ\'яненко · Світ 5',role:'«Перевіряє відьом» водою, поки Еней не ділить навпіл.',bullets:['Бінарний пошук через «тоне чи пливе».'],vars:[{n:'З перначем',m:()=>makeSotnyk()}]},
  {id:'charon',cat:'npc',name:'Харон',src:'Енеїда · Світ 8',role:'Перевізник у пеклі, човен на двох.',bullets:['Boats to Save People.'],vars:[{n:'У човні',m:()=>makeCharon()}]},
  {id:'anchises',cat:'npc',name:'Анхіз',src:'Енеїда · Світи 8–9',role:'Батько Енея. Базовий випадок рекурсії і корінь родоводу.',bullets:['Показує Енеєві нащадків: дерева.'],vars:[{n:'В Елісії',m:()=>makeAnchises()}]},
  {id:'molfar',cat:'npc',name:'Мольфар',src:'Коцюбинський · Світ 11',role:'Гуцульський чарівник із трембітою.',bullets:['Трембіта кличе хвилями: BFS.'],vars:[{n:'З трембітою',m:()=>makeMolfar()}]},
  {id:'sibyl',cat:'npc',name:'Сивілла',src:'Енеїда · онбординг',role:'Провидиця. Вчить «слова ладу» і дає підказки.',bullets:['Три рівні підказок: натяк, ідея, псевдокод.'],vars:[{n:'З сувоєм',m:()=>makeSibyl()}]},
];
CHARS.push(
  {id:'acestes',cat:'npc',name:'Ацест',src:'Енеїда · Світ 6',role:'Цар Сицилії, влаштовує ігри на честь Анхіза.',bullets:['Живе табло призерів: Sliding Window і купа.'],vars:[{n:'Основний',m:()=>makeAcestes()}]},
  {id:'ox',cat:'npc',name:'Чумацький віл',src:'Чумацькі пісні · Світ 7',role:'Тягне валку степом. Повільний вказівник проти швидкого лиса.',bullets:['Linked List Cycle: зустрінуться чи ні.'],vars:[{n:'У ярмі',m:()=>makeOx()}]},
  {id:'mavka',cat:'npc',name:'Мавка',src:'Леся Українка · Світ 10',role:'Дух лісу. Власний образ, не з мультфільму.',bullets:['Кожне дерево на своєму місці: BST.'],vars:[{n:'Весняна',m:()=>makeMavka()}]},
  {id:'kozh',cat:'npc',name:'Кирило Кожум\'яка',src:'Легенда · Світ 12',role:'Заорав Змія і проклав Змієві вали.',bullets:['Інтервали: зшити вали, що перекриваються.'],vars:[{n:'Зі шкурою',m:()=>makeKozhumyaka()}]},
  {id:'vulcan',cat:'npc',name:'Вулкан',src:'Енеїда · Світ 14',role:'Коваль богів, кує Енеєві зброю.',bullets:['Динамічне програмування: не кувати двічі.'],vars:[{n:'Біля ковадла',m:()=>makeVulcan()}]},
);
const CATS={all:'Усі',heroes:'Герої',villains:'Антагоністи',npc:'Мешканці світів'};
(function(){
  const list=document.getElementById('ch-list'),tabs=document.getElementById('ch-tabs'),stage=document.getElementById('ch-stage'),
        nameEl=document.getElementById('ch-name'),srcEl=document.getElementById('ch-src'),roleEl=document.getElementById('ch-role'),
        bul=document.getElementById('ch-bullets'),varsEl=document.getElementById('ch-vars'),colorsEl=document.getElementById('ch-colors'),noteEl=document.getElementById('ch-note');
  let cur=CHARS[0],vi=0,color=GINGER,shown=null,prev=null,swapAt=0,cat='all';
  const thumbs={};
  const SW_=72,SH2=80,S=4;
  function spriteFor(c,v,alt){const V=c.vars[v];return (alt&&V.alt?V.alt(color):(alt&&V.blink?V.blink():V.m(color)));}
  function pos(spr){return [Math.round((SW_-spr.w)/2)*S,(SH2-spr.h-2)*S];}
  let sctx=null,altSpr=null,lastDpr=0;
  function getCtx(){if(!sctx||lastDpr!==DPR){sctx=setup(stage,SW_*S,SH2*S,true);lastDpr=DPR;}return sctx;}
  /* перехід «піксельний дощ»: старі пікселі осипаються, нові падають на місце; кожен піксель має свою затримку */
  function drawRain(ctx,A,ax,ay,B,bx,by,p,ps){
    for(let y=0;y<A.h;y++)for(let x=0;x<A.w;x++){const c=A.p[y*A.w+x];if(!c)continue;const h=hash(x>>1,y>>1),d=clamp((p-h*0.5)/0.35);if(d>=1)continue;
      const dy=d*d*64;ctx.globalAlpha=1-d*0.6;px(ctx,ax+x*ps,ay+y*ps+dy,ps,c);}
    ctx.globalAlpha=1;
    for(let y=0;y<B.h;y++)for(let x=0;x<B.w;x++){const c=B.p[y*B.w+x];if(!c)continue;const h=hash((x>>1)+7,(y>>1)+3),q=clamp((p-0.18-h*0.52)/0.3);if(q<=0)continue;
      const e=easeOut(q),dy=-(1-e)*72;ctx.globalAlpha=0.35+0.65*e;px(ctx,bx+x*ps,by+y*ps+dy,ps,c);}
    ctx.globalAlpha=1;
  }
  function drawStage(T){
    const ctx=getCtx();ctx.clearRect(0,0,SW_*S,SH2*S);
    for(let x=0;x<SW_;x+=2)px(ctx,x*S,(SH2-2)*S,S,'rgba(80,60,30,.18)');
    const tick=Math.floor(T/0.26),spr=(altSpr&&tick%6===5)?altSpr:shown;
    const p=REDUCED?1:clamp((performance.now()-swapAt)/650);
    const [bx,by]=pos(spr),bob=cur.id==='eol'?Math.round(Math.sin(T*2.4))*S:0;
    if(prev&&p<1){const [ax,ay]=pos(prev);drawRain(ctx,hdOf(prev),ax-S/2,ay-S/2,hdOf(shown),bx-S/2,by-S/2,p,S/2);}
    else spr.draw(ctx,bx,by+bob,S);
  }
  function select(c,v=0){
    prev=shown;cur=c;vi=v;shown=spriteFor(c,v,false);swapAt=performance.now();
    {const V=c.vars[v];altSpr=V.alt?V.alt(color):(V.blink?V.blink():null);}
    nameEl.textContent=c.name;srcEl.textContent=c.src;roleEl.textContent=c.role;
    bul.innerHTML='';c.bullets.forEach(b=>{const li=document.createElement('li');li.textContent=b;bul.appendChild(li);});
    noteEl.textContent=c.vars[v].note||'';
    varsEl.innerHTML='';
    c.vars.forEach((V,k)=>{const b=document.createElement('button');b.type='button';b.className='var'+(k===v?' on':'');b.setAttribute('aria-pressed',k===v);
      b.innerHTML='<canvas></canvas><span></span>';b.querySelector('span').textContent=V.n;
      const spr=V.m(c.colors?color:undefined),sc=Math.max(1,Math.floor(Math.min(56/spr.w,64/spr.h)));const cv=b.querySelector('canvas'),ctx=setup(cv,60,68);spr.draw(ctx,Math.round((60-spr.w*sc)/2),68-spr.h*sc,sc);
      b.addEventListener('click',()=>select(c,k));varsEl.appendChild(b);});
    colorsEl.hidden=!c.colors||v!==0;
    list.querySelectorAll('.ch-item').forEach(it=>{const on=it.dataset.id===c.id;it.classList.toggle('on',on);it.setAttribute('aria-selected',on);});
    drawStage(performance.now()/1000);
  }
  function buildList(){
    list.innerHTML='';
    CHARS.filter(c=>cat==='all'||c.cat===cat).forEach(c=>{
      const b=document.createElement('button');b.type='button';b.className='ch-item';b.dataset.id=c.id;b.setAttribute('role','tab');
      b.innerHTML='<canvas></canvas><span><b></b><small></small></span>';b.querySelector('b').textContent=c.name;b.querySelector('small').textContent=CATS[c.cat];
      const spr=thumbs[c.id]||(thumbs[c.id]=c.vars[0].m()),cv=b.querySelector('canvas'),ctx=setup(cv,36,36);
      const crop=[Math.max(0,Math.floor(spr.w/2-18)),0,Math.min(spr.w,Math.floor(spr.w/2+18)),Math.min(spr.h,36)];spr.draw(ctx,0,0,1,crop);
      b.addEventListener('click',()=>select(c,0));list.appendChild(b);
    });
    list.querySelectorAll('.ch-item').forEach(it=>it.classList.toggle('on',it.dataset.id===cur.id));
  }
  Object.entries(CATS).forEach(([k,v])=>{const b=document.createElement('button');b.type='button';b.className='tab'+(k===cat?' on':'');b.textContent=v;
    b.addEventListener('click',()=>{cat=k;tabs.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t===b));buildList();const first=CHARS.find(c=>k==='all'||c.cat===k);if(first)select(first,0);});tabs.appendChild(b);});
  WORLD_COLORS.filter(w=>w.col!=='rainbow').forEach(w=>{const b=document.createElement('button');b.type='button';b.className='swatch';b.style.background=w.col;b.title=`Світ ${w.n}: ${w.name}`;b.setAttribute('aria-label',`Фарба світу ${w.n}: ${w.name}`);
    b.addEventListener('click',()=>{color=w.col;colorsEl.querySelectorAll('.swatch').forEach(s=>s.classList.toggle('on',s===b));select(cur,0);});colorsEl.appendChild(b);});
  colorsEl.querySelector('.swatch:nth-child(4)')?.classList.add('on');
  buildList();select(CHARS[0],0);prev=null;
  scene(stage,{loop:1e6,rest:0,draw:(t,T)=>drawStage(T)});
})();

/* ================= ВИШИВАНКА ================= */
[0,1,2].forEach(l=>{
  const c=document.getElementById('shirt'+l),plain=makeEnei(0),full=makeEnei(l);
  const draw=t=>drawMix(setup(c,188,292),hdOf(plain),hdOf(full),l?easeOut(prog(t,0.3,1.8)):0,0,0,2);
  draw(5);if(l)scene(c,{loop:6,rest:5,draw});
});

/* ================= ПИСАНКА ================= */
const eggW=document.getElementById('eggWhole'),eggB=document.getElementById('eggBroken');
scene(eggW,{interval:500,draw:f=>drawEgg(setup(eggW,240,280),34,44,52,52,4,false,true,0,f%2?0.9:0.97)});
scene(eggB,{loop:4,rest:2,draw:t=>{const p=easeInOut(prog(t,0,1.2))*(1-easeInOut(prog(t,2.8,4)));drawEgg(setup(eggB,240,280),34,44,52,52,4,true,false,0.02+0.2*p);}});
drawEgg(setup(eggW,240,280),34,44,52,52,4,false,true);drawEgg(setup(eggB,240,280),34,44,52,52,4,true,false,0.15);
const motifs=document.getElementById('motifs');
Object.keys(MOTIF_NAMES).forEach((k,i)=>{
  const d=document.createElement('div');d.className='motif reveal';d.style.setProperty('--i',i%7);
  d.innerHTML='<div class="cloth"><canvas></canvas></div><span></span>';d.querySelector('span').textContent=MOTIF_NAMES[k];motifs.appendChild(d);
  const c=d.querySelector('canvas'),draw=t=>drawMotif(setup(c,72,72),MOTIFS[k],0,0,8,RD,Math.ceil(9*clamp(prog(t,0.1+i*0.04,0.8+i*0.04),0.12,1)));
  draw(3);scene(c,{loop:6,rest:3,draw});
});

/* ================= МАНДРІВКА: мапа + картка на одному екрані ================= */
const mapC=document.getElementById('map'),pins=document.getElementById('map-pins'),jCard=document.getElementById('j-card'),jArt=document.getElementById('j-art'),conn=document.getElementById('j-conn');
let active=2,shipFrom=2,shipAt=0;
function shipPos(){return routePoint(shipFrom,active,REDUCED?1:easeInOut(clamp((performance.now()-shipAt)/900)));}
function drawMap(f=0){
  const ctx=setup(mapC,MW*MS,MH*MS,true);
  paintJourney(ctx,f,{active,ship:shipPos(),reached:active});
  drawConn(f);
}
function drawConn(f=0){
  if(!conn||getComputedStyle(conn).display==='none')return;
  const box=conn.parentElement.getBoundingClientRect(),m=mapC.getBoundingClientRect(),c=jCard.getBoundingClientRect(),k=box.width/conn.parentElement.offsetWidth||1;
  const [nx,ny]=NODES[active],x1=(m.left-box.left+nx/MW*m.width)/k,y1=(m.top-box.top+ny/MH*m.height)/k,x2=(c.left-box.left)/k,y2=(c.top-box.top+Math.min(c.height*0.3,140))/k,bw=box.width/k,bh=box.height/k;
  const mid=(x1+x2)/2,col=worldCol(active,f);
  conn.setAttribute('viewBox',`0 0 ${bw} ${bh}`);
  conn.innerHTML=`<path d="M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}" fill="none" stroke="${col}" stroke-width="3" stroke-dasharray="6 8" stroke-dashoffset="${-f*7}" stroke-linecap="square"/><rect x="${x1-7}" y="${y1-7}" width="14" height="14" fill="none" stroke="${col}" stroke-width="3"/><rect x="${x2-6}" y="${y2-6}" width="12" height="12" fill="${col}"/>`;
}
NODES.forEach(([x,y],i)=>{const b=document.createElement('button');b.className='pin';b.type='button';b.style.left=(x/MW*100)+'%';b.style.top=(y/MH*100)+'%';
  b.setAttribute('aria-label',`Світ ${i}: ${ALL_WORLDS[i].name}`);b.addEventListener('click',()=>jumpTo(i));pins.appendChild(b);});
SONGS.forEach((song,i)=>{const l=document.createElement('span');l.className='isle-label';l.style.left=(ISLES[i].c[0]/MW*100)+'%';l.style.top=((ISLES[i].c[1]-ISLES[i].r[1]-6)/MH*100)+'%';l.textContent=`${song.n} · ${song.title}`;pins.appendChild(l);});
let artFrom=null,artAt=0;
function drawArt(f=0){
  const ctx=setup(jArt,SW*2,SH_*2,true);
  paintWorldArt(ctx,active,f,artFrom,REDUCED?1:clamp((performance.now()-artAt)/700));
}
function fillCard(){
  const w=ALL_WORLDS[active],ws=WORLD_SCENES[w.n],info=WORLD_INFO[w.n],song=SONGS.find(s=>s.worlds.includes(w));
  document.getElementById('j-eyebrow').textContent=`Світ ${w.n} · Пісня ${song.n} · ${song.title}`;
  document.getElementById('j-name').textContent=w.name;
  document.getElementById('j-topic').textContent=w.topic;document.getElementById('j-task').textContent=w.task;
  document.getElementById('j-does').textContent=info.does;
  const q=document.getElementById('j-quote');q.textContent=ws?ws.quote:'';q.hidden=!ws;
  document.getElementById('j-npc').textContent=(ws&&ws.npc)||info.npc;
  document.getElementById('j-fox').textContent=w.foxName;
  document.getElementById('j-dot').style.background=w.fox==='rainbow'?'linear-gradient(90deg,#b3202a,#e2702b,#d9a521,#4f9d4a,#2f6db5,#6b3fa0)':w.fox;
  document.getElementById('j-mvp').hidden=!w.mvp;
  document.getElementById('j-count').textContent=`${String(w.n).padStart(2,'0')} / 15`;
  jCard.style.setProperty('--wc',w.fox==='rainbow'?'#e2702b':w.fox);
  jCard.classList.remove('pop');void jCard.offsetWidth;jCard.classList.add('pop');
  pins.querySelectorAll('.pin').forEach((p,k)=>p.classList.toggle('on',k===active));
  document.getElementById('j-bar').style.transform=`scaleX(${(active+1)/16})`;
}
function setActive(i){
  i=clamp(i,0,15);if(i===active)return;
  artFrom=foxFor(ALL_WORLDS[active]);artAt=performance.now();shipFrom=active;shipAt=performance.now();active=i;fillCard();drawMap(mapFrame);drawArt(artFrameN);
}
const jour=document.getElementById('journey');
function pinnedJ(){return jour.classList.contains('pinned');}
let userDriven=false;
function jumpTo(i,auto){if(!auto)userDriven=true;setActive(((i%16)+16)%16);}
/* автопрогравання: поки блок на екрані й користувач не втрутився */
scene(jour,{interval:4200,draw:f=>{if(f>0&&!userDriven&&!jour.matches(':hover'))jumpTo(active+1,true);}});
jour.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();jumpTo(active+1);}if(e.key==='ArrowLeft'){e.preventDefault();jumpTo(active-1);}});
document.getElementById('j-prev').addEventListener('click',()=>jumpTo(active-1));
document.getElementById('j-next').addEventListener('click',()=>jumpTo(active+1));
let mapFrame=0,artFrameN=0;
fillCard();drawMap(0);drawArt(0);
scene(mapC,{interval:300,draw:f=>{mapFrame=f;drawMap(f);}});
scene(jArt,{interval:70,draw:f=>{artFrameN=f;drawArt(Math.floor(f*70/170));}});

/* ================= ІНТЕРФЕЙС: повний застосунок, анімація задачі ================= */
(function(){
  const root=document.getElementById('app-stage');if(!root)return;
  const inner=root.querySelector('.stage-inner'),fit=()=>{inner.style.transform=`scale(${root.clientWidth/1200})`;};
  fit();new ResizeObserver(fit).observe(root);
  const $=k=>root.querySelector(`[data-el="${k}"]`);
  const CODE=[
    ['cm','// Задача Дидони: Еней зліва, Микита справа'],
    ['','<span class="kw">function</span> <span class="fn">maxArea</span>(posts: <span class="ty">number</span>[]): <span class="ty">number</span> {'],
    ['','  <span class="kw">let</span> left = <span class="nu">0</span>;                 <span class="cm">// Еней</span>'],
    ['','  <span class="kw">let</span> right = posts.length - <span class="nu">1</span>; <span class="cm">// Микита</span>'],
    ['','  <span class="kw">let</span> best = <span class="nu">0</span>;'],
    ['',''],
    ['','  <span class="kw">while</span> (left &lt; right) {'],
    ['','    <span class="kw">const</span> h = <span class="ty">Math</span>.<span class="fn">min</span>(posts[left], posts[right]);'],
    ['','    best = <span class="ty">Math</span>.<span class="fn">max</span>(best, h * (right - left));'],
    ['','    world.<span class="fn">fill</span>(left, right, h);'],
    ['',''],
    ['','    <span class="kw">if</span> (posts[left] &lt; posts[right]) left++;'],
    ['','    <span class="kw">else</span> right--;'],
    ['','  }'],
    ['','  <span class="kw">return</span> best;'],
    ['','}'],
  ];
  $('code').innerHTML=CODE.map(([c,h],i)=>`<div class="cl" data-l="${i+1}"><span class="ln">${i+1}</span><span class="${c==='cm'?'cm':''}">${h||'&nbsp;'}</span></div>`).join('');
  const lines=[...$('code').querySelectorAll('.cl')];
  const TESTS=[['[1,8,6,2,5,4,8,3,7]','49'],['[1,1]','1'],['[4,3,2,1,4]','16'],['[1,2,1]','2'],['n = 100 000','0,8 мс']];
  $('tests').innerHTML=TESTS.map(([a,b])=>`<div class="tr"><span class="ck">·</span> ${a} → ${b}</div>`).join('');
  const trs=[...$('tests').querySelectorAll('.tr')];
  const posts=[1,8,6,2,5,4,8,3,7],steps=[];{let L=0,R=8;while(L<R){steps.push([L,R]);if(posts[L]<posts[R])L++;else R--;}}
  const wc=$('world'),wolfC=$('wolf');
  const FOXP=makeFox('#9b3a87'),WOLFS=[makeWolf({drool:1}),makeWolf({drool:3})],DIDO=makeDido();
  const X=i=>14+i*24;
  function drawWorld(L,R,eL,eR,wh,f){
    const W=220,H=150,ctx=setup(wc,W,H,true),sp=new Spr(W,H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){sp.set(x,y,y<46?((y>28&&(x+y)%2)?'#9fd0ee':(y<28?'#6fb6e3':'#bfe0f2')):(y<52?((x+f)%14===0?'#9fd0ee':'#2f7fb8'):((x*7+y*3)%11===0?'#d4b073':'#e3c58e')));}
    sp.draw(ctx,0,0,1);
    for(let x=120;x<W;x++){const top=(x%10<6)?30:33;ctx.fillStyle=x>190?'#c9a466':'#d9b77a';ctx.fillRect(x,top,1,46-top);}
    const g=136,U=10;
    if(wh>0){const x0=X(L)+5,x1=X(R);for(let x=x0;x<x1;x++)for(let y=Math.round(g-wh*U);y<g;y++)px(ctx,x,y,1,((x+y+f)%5===0)?'#7fc0e6':((x+y)%2?'#4b93c4':'#5aa0cf'));}
    posts.forEach((p,i)=>{const x=X(i),on=i===L||i===R;ctx.fillStyle=on?'#9a5e2c':'#6e4220';ctx.fillRect(x,g-p*U,5,p*U);ctx.fillStyle='#4e2e16';ctx.fillRect(x+4,g-p*U,1,p*U);ctx.fillStyle=on?'#f2d27a':GD;ctx.fillRect(x-1,g-p*U-2,7,2);});
    ctx.fillStyle='#b88a52';ctx.fillRect(0,g,W,3);ctx.fillStyle='#9c7040';ctx.fillRect(0,g+3,W,H-g-3);
    ENEI_SCENE.draw(ctx,Math.round(eL-23),g-70+2,1);
    FOXP.draw(ctx,Math.min(W-42,Math.round(eR-20)),g-58+2,1);
    [[eL,'#2f55a0'],[eR,'#9b3a87']].forEach(([x,c])=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x)-3,3,7,3);ctx.fillRect(Math.round(x)-1,6,3,3);});
  }
  const cursor=$('cursor'),run=$('run');
  function draw(t){
    // 0–1.3 курсор летить до «Запустити», клік
    const mv=easeInOut(prog(t,0.2,1.2));
    cursor.style.transform=`translate(${lerp(560,1038,mv)}px,${lerp(520,74,mv)}px) scale(${t>1.2&&t<1.45?.8:1})`;
    cursor.style.opacity=1-prog(t,1.8,2.2)+prog(t,15.4,15.9);
    run.style.transform=`scale(${t>1.25&&t<1.5?.92:1})`;
    run.classList.toggle('busy',t>1.3&&t<9.6);
    // 1.5–9.5 вісім кроків двох вказівників
    const k=Math.floor(prog(t,1.5,9.5)*steps.length),kk=Math.min(k,steps.length-1),local=prog(t,1.5,9.5)*steps.length-k;
    const running=t>=1.5&&t<9.5;
    const [L,R]=t<1.5?[0,8]:steps[kk],[pL,pR]=kk>0&&t<9.5?steps[kk-1]:[0,8];
    const wk=easeOut(clamp(local/0.4));
    const eL=lerp(X(running?pL:L),X(L),running?wk:1)+2,eR=lerp(X(running?pR:R),X(R),running?wk:1)+2;
    const h=Math.min(posts[L],posts[R]),wh=t<1.5?0:(t>=9.5?7:h*easeOut(clamp((local-0.2)/0.6)));
    const best=Math.max(0,...steps.slice(0,t<1.5?0:(t>=9.5?8:kk+1)).map(([a,b])=>Math.min(posts[a],posts[b])*(b-a)));
    drawWorld(t>=9.5?1:L,t>=9.5?8:R,t>=9.5?X(1)+2:eL,t>=9.5?X(8)+2:eR,t>=9.5?wh*easeOut(prog(t,9.5,10.2)):wh,Math.floor(t*6));
    const hl=running?[8,9,10,local<0.75?12:13][Math.min(3,Math.floor(local*4))]:(t>=9.5&&t<11?15:0);
    lines.forEach((l,i)=>l.classList.toggle('hl',i+1===hl));
    $('step').textContent=t<1.5?'готово до запуску':(running?`крок ${kk+1} / 8 · left=${L} right=${R} · площа ${h*(R-L)}`:'найкраще: 49');
    $('best').textContent=best;$('best').style.transform=`scale(${1+0.25*(running&&local<0.3?1-local/0.3:0)})`;
    // Вовк перебирає всі пари повільніше
    const wp=prog(t,1.5,14),pairs=Math.floor(36*wp);
    $('wbar').style.width=(100*wp).toFixed(1)+'%';$('wcount').textContent=pairs+' / 36 пар';
    let pi=0,pj=1,c=0;outer:for(let i=0;i<9;i++)for(let j=i+1;j<9;j++){if(c++===pairs){pi=i;pj=j;break outer;}}
    $('wtry').textContent=t<1.5?'чекає':(wp<1?`пробує (${pi}, ${pj})…`:'n = 100 000: не встиг');
    $('wtry').classList.toggle('bad',wp>=1||t>11.4);
    const ctxW=setup(wolfC,48,66,true);WOLFS[Math.floor(t*3)%2].draw(ctxW,0,0,1);
    $('ebar').style.width=(100*clamp(prog(t,1.5,9.5)*8/36)).toFixed(1)+'%';$('ecount').textContent=(t<1.5?0:Math.min(8,kk+1))+' кроків';
    // 9.6–11.5 тести по одному
    trs.forEach((r,i)=>{const p=prog(t,9.7+i*0.35,9.9+i*0.35);r.classList.toggle('ok',p>=1);r.querySelector('.ck').textContent=p>=1?'✓':'·';r.style.transform=`translateX(${lerp(-8,0,easeOut(p))}px)`;});
    $('verdict').textContent=t>11.5?'5 / 5 тестів':(t>9.6?'перевіряємо…':'');
    // 11.8 Микита радіє, зірки
    const bp=back(prog(t,11.8,12.3))*(1-prog(t,15.2,15.8));
    $('bubble').style.opacity=clamp(bp);$('bubble').style.transform=`translateY(${lerp(16,0,clamp(bp))}px) scale(${lerp(.9,1,clamp(bp))})`;
    $('stars').textContent='★★★'.slice(0,Math.floor(prog(t,12.2,13.2)*3+0.001))+'☆☆☆'.slice(0,3-Math.floor(prog(t,12.2,13.2)*3+0.001));
    $('cx').textContent=t>12.2?'O(n)':'—';
  }
  scene(root,{loop:16,rest:13,draw});
})();

/* ================= ОНБОРДИНГ: внутрішній скрол ================= */
const OBX={...Object.fromEntries(OB_OLD.map((o,i)=>[i,o]))};
const BOOKS=[[16,'#b3202a'],[28,'#2f55a0'],[38,'#4f9d4a'],[50,'#d9a521'],[62,'#6b3fa0'],[74,'#c96f2a'],[118,'#e2702b'],[132,'#2e8b57'],[146,'#7b2d6b'],[158,'#1fa3a3'],[170,'#8a6a3a'],[182,'#c0392b'],[96,'#3a6ea5']];

/* допоміжне для сцен лісу Франка */
const FOX_WILD_BASE=makeFoxWild(GINGER),WOLF_WILD_BASE=makeWolfWild();
const easeIn2=x=>x*x;
function forestBg(sp){sky(sp,['#bfe0c8','#d9eed9','#eef6ea'],0,92);[[12,92,36],[34,90,30],[170,92,34],[192,90,30],[62,92,22]].forEach(([x,y,h])=>spruce(sp,x,y,h,'#2d5a3a',false));for(let y=92;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,(x+y)%6===0?'#4f8a4a':'#5f9a4a');sp.fill(rect(128,50,52,44),'#e9e4d6');sp.fill(poly([[122,52],[186,52],[154,30]]),'#8a6a3a');sp.fill(rect(150,74,10,20),'#6b4420');}
function barrelBack(sp,f){const x=89,y=92,w=34;sp.fill(ell(x+w/2,y,w/2,3.5),'#3a2414');sp.fill(ell(x+w/2,y+0.5,w/2-2,2.4),(xx,yy)=>RAINBOW[(Math.floor(f/2)+((xx>>2)))%RAINBOW.length]);}
function barrelFront(ctx,s,f){const x=89,y=92,w=34,h=24;for(let yy=y+1;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const band=(yy===y+5||yy===y+6||yy===y+17||yy===y+18);const edge=xx===x||xx===x+w-1;px(ctx,xx*s,yy*s,s,band?'#3a2414':(edge?'#5b3a20':((xx-x)%6===0?'#6b4420':'#7a4a24')));}
  for(let xx=x;xx<x+w;xx++)px(ctx,xx*s,y*s,s,'#3a2414');}

/* вцілілі троянці: воїн, моряк із мішком, старий зі стрижнем, жінка з клунком */
function makeTrojan(kind){
  const s=new Spr(40,66),SK='#e6b08a',SKs='#c48c66';
  const P={warrior:{tu:'#9b1c1c',tus:'#701313',cl:'#5b3a20'},sailor:{tu:'#2f55a0',tus:'#203a72',cl:'#d9cfb6'},elder:{tu:'#8a8478',tus:'#6b665c',cl:'#4a4540'},woman:{tu:'#3f7a3a',tus:'#2f5a28',cl:'#b3202a'}}[kind];
  const longRobe=kind==='elder'||kind==='woman';
  if(longRobe){s.fill(poly([[13,24],[27,24],[31,62],[9,62]]),(x)=>x>23?P.tus:P.tu);s.fill(rect(12,62,6,3),'#4a3020');s.fill(rect(22,62,6,3),'#3a2416');}
  else{s.fill(rect(14,46,5,16),SK);s.fill(rect(21,46,5,16),SKs);s.fill(rect(13,60,7,3),'#4a3020');s.fill(rect(21,60,7,3),'#3a2416');
    s.fill(poly([[13,24],[27,24],[29,48],[11,48]]),(x)=>x>23?P.tus:P.tu);s.fill(rect(12,40,17,2),'#8b5a2b');}
  s.fill(poly([[13,25],[8,38],[11,40],[15,30]]),P.tu);s.fill(ell(9,40,2,2),SK);
  s.fill(poly([[27,25],[32,38],[29,40],[25,30]]),P.tus);s.fill(ell(31,40,2,2),SKs);
  s.fill(rect(17,20,6,5),SK);
  s.fill(ell(20,15,5.5,6.5),(x)=>x>22?SKs:SK);
  s.fill(rect(17,15,2,1),BK);s.fill(rect(22,15,2,1),BK);
  if(kind==='warrior'){s.fill(ell(20,11,6.5,5),'#c08a3e');s.fill(rect(14,11,2,7),'#c08a3e');s.fill(rect(24,11,2,7),'#8f6228');s.fill(path([[14,6],[20,2],[27,6]],2.2),'#c0392b');
    s.fill(line(34,6,35,64,1.4),'#6b4a2a');s.fill(poly([[33,8],[34.5,2],[36,8]]),'#cdd2da');s.fill(path([[17,19],[20,21],[23,19]],1),'#5b3a20');}
  if(kind==='sailor'){s.fill(ell(20,10,6,3.5),'#3a2414');s.fill(rect(14,11,12,2),'#f2d27a');s.fill(ell(31,24,6,5),'#c9a466');s.fill(line(27,22,34,27),'#8b7244');}
  if(kind==='elder'){s.fill(ell(20,10,6,3.5),'#e9e6df');s.fill(poly([[15,17],[25,17],[23,29],[17,29]]),'#e9e6df');s.fill(line(7,22,7,64,1.4),'#7a5a32');}
  if(kind==='woman'){s.fill(poly([[13,13],[27,13],[28,24],[12,24]]),P.cl);s.fill(ell(20,10,7.5,5),P.cl);s.fill(ell(20,15.5,4.3,5),SK);s.fill(rect(17,15,2,1),BK);s.fill(rect(22,15,2,1),BK);
    s.fill(ell(10,38,5,4),'#d9cfb6');s.fill(line(6,36,14,40),'#a3243a');}
  return s.outline(0.6);
}
const TROJANS=['warrior','sailor','elder','woman'].map(makeTrojan);
function drawSack(ctx,x,y){ctx.fillStyle='#1f1b16';ctx.fillRect(x-10,y-14,20,18);ctx.fillStyle='#a8844a';ctx.fillRect(x-9,y-12,18,15);ctx.fillStyle='#c9a466';ctx.fillRect(x-8,y-12,10,6);ctx.fillStyle='#7a5a32';ctx.fillRect(x-3,y-17,6,5);ctx.fillStyle='#e9d9a6';ctx.fillRect(x-1,y-6,2,2);}
const OB=[
  OBX[0],OBX[1],
  {kind:'заставка',title:'Мішок вітрів',narr:'Еол розв\'язує мішок, і вітри вириваються на волю. Хмари крутяться над Олімпом.',lines:[['Еол','Ану, хлопці, гуляйте!']],act:'Дивиться.',
   bg:(sp,f)=>{sky(sp,['#2a3a5a','#3d5675','#55708f'],0,SH_);for(let k=0;k<5;k++){const cx=40+k*30,cy=40+(k%2)*24,r=10+((f+k*3)%12);for(let a=0;a<28;a++){const an=a/28*6.28+f*0.25+k;sp.set(cx+Math.cos(an)*r,cy+Math.sin(an)*r*0.6,'#c9d6e4');}}columns(sp,[150,172],50,110,'#d9d2c4','#b5ad9c');for(let y=110;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,'#8a8478');},
   fg:(ctx,f,s)=>{EOL_S.draw(ctx,10*s,(40+(f%2))*s,s);}},
  OBX[2],
  {kind:'заставка',title:'Уламки по книжках',narr:'Тринадцять уламків влітають у корінці книжок. Мапа спалахує тринадцятьма мітками і гасне.',lines:[],act:'Бачить тизер мапи світів.',
   bg:(sp,f)=>{sky(sp,['#1b1424','#2a1d36','#3a2a4a'],0,SH_);sp.fill(rect(6,92,188,5),'#5b3a20');sp.fill(rect(6,40,188,4),'#5b3a20');
     BOOKS.forEach(([x,c],k)=>{const h=30+(k%3)*4,glow=((f>>1)%13)===k;sp.fill(rect(x,92-h,10,h),glow?'#fff3c4':c);sp.fill(rect(x+1,92-h+6,8,1),GD);});
     for(let k=0;k<13;k++){const ph=((f+k*2)%26)/26;if(ph<0.6){const [bx]=BOOKS[k],sx=100+Math.cos(k)*30,sy=10,x=lerp(sx,bx+5,ph/0.6),y=lerp(sy,70,ph/0.6);sp.set(x,y,k%2?RD:'#a7d6e6');sp.set(x+1,y,'#d4ecf3');sp.set(x,y+1,'#d4ecf3');}}
     for(let k=0;k<13;k++){const on=(f+k)%6<3;if(on)sp.fill(rect(20+k*13,110,3,3),RAINBOW[k%6]);}}},
  /* Прохання Венери: Зевс після бенкету з рушником на голові обіцяє Енеєві дорогу */
  {kind:'заставка',title:'Прохання Венери',narr:'Венера, мати Енея, біжить до Зевса. Той ще тримається за голову після бенкету, але слухає.',
   lines:[['Венера','Зевсе, батечку! Без Писанки мій Еней пропаде: його доля розсипалась по книжках.'],['Зевс','Ой, голова… Добре. Хай сам збере тринадцять уламків. Слово ладу йому в поміч, а Сивілла — в провідниці.'],['Венера','А Юнона?'],['Зевс','А Юнона хай спробує.']],act:'Дивиться.',
   bg:(sp,f)=>{sky(sp,['#2a2050','#4a3474','#7a5a8c'],0,100);stars(sp,40,7,f,70);columns(sp,[10,30,162,182],34,100,'#9a8cb0','#7a6c94');
     for(let y=100;y<SH_;y++)for(let x=0;x<SW;x++)sp.set(x,y,((x>>3)+(y>>3))%2?'#5a4c74':'#4a3e64');
     sp.fill(rect(92,82,16,18),'#8a7ca4');sp.fill(rect(90,80,20,3),'#6a5c84');
     // трон Зевса
     sp.fill(rect(124,60,40,44),'#d9a521');sp.fill(rect(128,64,32,36),'#b3202a');sp.fill(rect(120,56,48,6),'#a87a12');},
   fg:(ctx,f,s)=>{
     const Z=OLYMPUS_GODS.zeus,V=OLYMPUS_GODS.venus;
     // мапа з тринадцятьма уламками розгортається між ними
     const t=Math.min(1,(f%60)/30);
     ctx.fillStyle=`rgba(244,236,218,${0.85*t})`;ctx.fillRect(150,40,Math.round(100*t),56);
     if(t>=1)for(let k=0;k<13;k++){const x=160+(k%5)*20+(Math.floor(k/5)%2)*8,y=50+Math.floor(k/5)*16;ctx.fillStyle=(f+k)%6<3?RD:'#a7d6e6';ctx.fillRect(x,y,4,4);}
     // Зевс на троні (з рушником) і Венера, що просить
     const zu=f%24<4;(zu?Z[1]:Z[0]).draw(ctx,240,92,2);
     // мокрий рушник на голові замість корони
     ctx.fillStyle='#1f1b16';ctx.fillRect(271,97,36,14);ctx.fillStyle='#f6efe0';ctx.fillRect(272,98,34,12);ctx.fillStyle='#a7d6e6';ctx.fillRect(274,102,30,2);ctx.fillRect(274,106,30,1);
     if(f%20<10){const d=Math.floor(f/2)%5;ctx.fillStyle='#9fe3ff';ctx.fillRect(276+d*6,112+d*3,2,3);}
     const vu=f%12<6;(vu?V[1]:V[0]).draw(ctx,40,102+(vu?-2:0),2);
     // зірочки навколо голови Зевса
     for(let i=0;i<3;i++){const a=f*0.18+i*2.1;ctx.fillStyle=GD;ctx.fillRect(Math.round(289+Math.cos(a)*24),Math.round(96+Math.sin(a)*5),3,3);}
     // Сивілла з'являється наприкінці
     if(f%60>44){ctx.globalAlpha=Math.min(1,(f%60-44)/10);SIBYL_S.draw(ctx,176,150,1);ctx.globalAlpha=1;}
   }},
  /* Ліс Франка: лис стрибає дугою і пірнає саме в діжу */
  {kind:'заставка',title:'Ліс Франка',narr:'Хто знає казку, той знає: Микита в діжу таки впаде. Але цього разу діжа була з дірою в інший світ.',lines:[['Микита','О, а це що за ласощі?']],act:'Дивиться.',
   bg:(sp,f)=>{forestBg(sp);barrelBack(sp,f);},
   fg:(ctx,f,s)=>{const t=(f*0.15)%5.6,FX=FOX_WILD_BASE;
     const R={x:89,y:92,w:34};const cx=(R.x+R.w/2)*s,rim=R.y*s;
     let x,y,show=true;
     if(t<0.8){x=34*s;y=rim-31+(t%0.4<0.2?0:-3);}
     else if(t<2.0){const p=easeInOut(prog(t,0.8,2.0));x=lerp(34*s,cx-25,p);y=lerp(rim-31,rim-44,p)-Math.sin(p*Math.PI)*70;}
     else if(t<2.9){const p=easeIn2(prog(t,2.0,2.9));x=cx-25;y=lerp(rim-44,rim+6,p);}
     else show=false;
     if(show){ctx.save();ctx.beginPath();ctx.rect(0,0,ctx.canvas.width,rim+1);ctx.clip();FX.draw(ctx,Math.round(x),Math.round(y),1);ctx.restore();}
     barrelFront(ctx,s,f);
     if(t>2.6&&t<4.4){const p=prog(t,2.6,4.4);for(let i=0;i<22;i++){const a=Math.PI*(0.1+0.8*hash(i,5)),v=40+60*hash(i,6),px_=cx+Math.cos(a)*v*p*(hash(i,7)>.5?1:-1),py=rim-Math.sin(a)*v*p*2+p*p*120;ctx.fillStyle=RAINBOW[i%6];ctx.globalAlpha=1-p;ctx.fillRect(Math.round(px_),Math.round(py),s,s);}ctx.globalAlpha=1;}
     if(t>2.9&&t<3.6){const p=prog(t,2.9,3.6);ctx.fillStyle=`rgba(255,250,230,${(1-p)*0.8})`;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);}
   }},
  /* Вовк ковтає свій уламок */
  {kind:'заставка',title:'Вовк і уламок',narr:'Неподалік у траві світиться ще один уламок. Вовк Неситий, як завжди, спершу ковтає, а потім думає.',lines:[['Вовк','Не пропадати ж добру!'],['Вовк','…гик!']],act:'Дивиться.',
   bg:(sp,f)=>{forestBg(sp);},
   fg:(ctx,f,s)=>{const t=(f*0.15)%6,W_=WOLF_WILD_BASE,sx=150*s,sy=90*s;
     if(t<2.2){const g=0.5+0.5*Math.sin(t*8),q=2*s;ctx.globalAlpha=g*0.7;ctx.fillStyle='#f7e3a1';ctx.fillRect(sx-4*q,sy-4*q,9*q,9*q);ctx.globalAlpha=1;
       [[0,-2,'#d4ecf3'],[-1,-1,'#a7d6e6'],[0,-1,RD],[1,-1,'#a7d6e6'],[-2,0,'#d4ecf3'],[-1,0,RD],[0,0,'#ffffff'],[1,0,RD],[2,0,'#d4ecf3'],[-1,1,'#a7d6e6'],[0,1,RD],[1,1,'#a7d6e6'],[0,2,'#d4ecf3']].forEach(([a,b,c])=>{ctx.fillStyle=c;ctx.fillRect(sx+a*q,sy+b*q-q,q,q);});}
     let wx,wy=92*s-35,alpha=1,hop=0;
     if(t<2.0){wx=lerp(-60,sx-54,easeOut(prog(t,0,2.0)));wy+=(Math.floor(t*6)%2)*-2;}
     else wx=sx-54;
     if(t>2.6&&t<3.4){hop=-Math.sin(prog(t,2.6,3.0)*Math.PI)*24;}
     if(t>3.4){alpha=1-prog(t,3.4,4.0);}
     if(t<4.0){ctx.globalAlpha=alpha;W_.draw(ctx,Math.round(wx),Math.round(wy+hop),1);ctx.globalAlpha=1;}
     if(t>2.0&&t<2.5){ctx.fillStyle='#ffffff';ctx.font=`bold ${6*s}px "Fira Code", monospace`;ctx.fillText(ST('ам!'),sx-14*s,sy-26*s);}
     if(t>2.6&&t<3.4){ctx.fillStyle='#ffffff';ctx.fillRect(sx-20*s,sy-44*s,26*s,11*s);ctx.fillStyle='#1f1b16';ctx.font=`bold ${6*s}px "Fira Code", monospace`;ctx.fillText(ST('гик!'),sx-18*s,sy-36*s);}
     if(t>3.3&&t<4.6){const p=prog(t,3.3,4.6),r=p*120;ctx.fillStyle=`rgba(255,246,210,${(1-p)})`;for(let a=0;a<36;a++){const an=a/36*6.28;ctx.fillRect(Math.round(wx+56+Math.cos(an)*r),Math.round(wy+30+Math.sin(an)*r*0.6),s*2,s*2);}
       ctx.fillStyle=`rgba(255,250,235,${(1-p)*0.7})`;ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);}
   }},
  OBX[4],OBX[5],
  {kind:'інтерактив',title:'Перший крок',narr:'Уперше відкривається редактор. У ньому вже стоїть рядок enei.move(). Кнопка «Запустити» пульсує.',lines:[['Сивілла','Скажи слово, і світ послухає.']],act:'Тисне «Запустити»: Еней робить крок і подає Микиті руку.',
   bg:ruins,fg:(ctx,f,s)=>{const t=(f%40)/40,step=easeInOut(prog(t,0.45,0.75));ENEI_SCENE.draw(ctx,Math.round(30+step*24)*s,(SH_-70)*s,s);FOX_ASH.draw(ctx,110*s,(SH_-59)*s,s);
     ctx.fillStyle='#141b17';ctx.fillRect(126*s,8*s,68*s,34*s);ctx.fillStyle='#8c968e';ctx.fillRect(130*s,12*s,4*s,2*s);
     const typed='enei.move();',n=Math.round(typed.length*prog(t,0.05,0.35));ctx.fillStyle='#e7e0cf';ctx.font=`${7*s}px "Fira Code", monospace`;ctx.fillText(typed.slice(0,n),137*s,19*s);
     const pulse=t<0.42?(Math.sin(f)*0.5+0.5):0;ctx.fillStyle=t>0.4&&t<0.46?'#b85a1f':'#e2702b';ctx.fillRect(130*s,27*s,(28+pulse*2)*s,10*s);ctx.fillStyle='#1a120b';ctx.fillText('▶ Run',133*s,34.5*s);}},
  OBX[6],
  /* Збори ватаги: Еней іде вулицею, підбирає мішки, і вцілілі троянці стають за ним у ватагу */
  {kind:'інтерактив',title:'Збори ватаги',narr:'Еней збирає вцілілих троянців і зерно. Перші вправи світу 0: цикл, умова, змінна-лічильник.',lines:[['Еней','Збираймо своїх, і зерно не лишаймо.'],['Микита','Можна й руками кожен мішок… але цикл хитріший.']],act:'Проходить вправи світу 0 і фінальну задачу Running Sum.',
   bg:(sp,f)=>{ruins(sp,f);},
   fg:(ctx,f,s)=>{const t=(f%64)/64,ex=8+t*330,G=SH_*s,homes=[96,170,236,300];
     homes.forEach((hx,k)=>{const sx=hx-16;if(ex+34<sx)drawSack(ctx,sx,G-8);});
     let n=0;const followers=[];
     homes.forEach((hx,k)=>{if(ex+34>=hx-16)followers.push(k);});
     homes.forEach((hx,k)=>{const fi=followers.indexOf(k);const T=TROJANS[k];
       if(fi<0){T.draw(ctx,hx,G-T.h-2+(k%2),1);}
       else{n++;const x=Math.max(2,ex-34*(fi+1)),bob=Math.floor(f/2+k)%2;T.draw(ctx,Math.round(x),G-T.h-2-bob,1);}});
     const eb=Math.floor(f/2)%2;ENEI_SCENE.draw(ctx,Math.round(ex),G-72-eb,1);
     ctx.fillStyle='rgba(20,27,23,.82)';ctx.fillRect(8,8,128,22);ctx.fillStyle='#f2d27a';ctx.font='600 12px "Fira Code", monospace';ctx.fillText(`${ST('ватага')} = ${n} / 4`,16,23);}},
  /* Відплиття: корабель з Енеєм, Микитою і ватагою пливе до тріщини */
  {kind:'інтерактив',title:'Відплиття',narr:'Корабель заходить у тріщину між світами, Микита перефарбовується в морський синій. Так почалась Кодеїда.',lines:[['Микита','Чую… пахне морем і уламком. Туди!']],act:'Після фінальної задачі світу 0 бачить заставку, потім відкривається мапа світів.',
   bg:(sp,f)=>{sky(sp,['#5a4a8a','#c96f7a','#f2b880'],0,80);sp.fill(ell(60,78,14,14),'#ffd98a');sea(sp,f,80,'#3a4f86','#2a3a6a','#f2b880');
     for(let y=14;y<96;y++){const x=172+Math.round(Math.sin(y*0.4+f*0.3)*2);for(let k=-6;k<=6;k++){const a=Math.abs(k);if(a<2)sp.set(x+k,y,'#ffffff');else if(a<4&&(y+f)%2)sp.set(x+k,y,'#9fe3ff');else if((x+k+y)%3===0)sp.set(x+k,y,'#6fb6e3');}}},
   fg:(ctx,f,s)=>{const sx=2+(f%40)*1.3,bob=(f%4<2?0:1),dk=98+bob,W2=118;
     poly([[sx+46,24],[sx+82,60],[sx+46,90]]).forEach(([x,y])=>px(ctx,x*s,y*s,s,(y===58||y===59)?RD:'#efe7d4'));
     poly([[sx+42,36],[sx+16,72],[sx+42,88]]).forEach(([x,y])=>px(ctx,x*s,y*s,s,'#e2d9c3'));
     line(sx+44,dk,sx+44,20).forEach(([x,y])=>{px(ctx,x*s,y*s,s,'#3a2414');px(ctx,(x+1)*s,y*s,s,'#3a2414');});
     const crew=[[TROJANS[2],sx+4],[ENEI_SCENE,sx+20],[TROJANS[0],sx+46],[TROJANS[3],sx+66],[FOX_SEA,sx+88]];
     crew.forEach(([sp_,x])=>sp_.draw(ctx,Math.round(x*s),dk*s-sp_.h+2,1));
     poly([[sx,dk],[sx+W2,dk],[sx+W2-10,dk+14],[sx+10,dk+14]]).forEach(([x,y])=>px(ctx,x*s,y*s,s,y<dk+2?'#7a4a24':(y>dk+10?'#3a2414':'#5b3a20')));
     for(let k=0;k<8;k++)px(ctx,(sx+14+k*12)*s,(dk+6)*s,s,'#2a1a10');
     const oa=Math.sin(f*0.5)*0.5;line(sx+30,dk+4,sx+18+Math.round(oa*8),dk+20).forEach(([x,y])=>px(ctx,x*s,y*s,s,'#8b5a2b'));
     line(sx+70,dk+4,sx+58+Math.round(oa*8),dk+20).forEach(([x,y])=>px(ctx,x*s,y*s,s,'#8b5a2b'));}},

];
const obC=document.getElementById('ob-canvas'),obList=document.getElementById('ob-steps'),obScroll=document.getElementById('ob-scroll'),obDots=document.getElementById('ob-dots');
let obActive=0,obSince=performance.now();
OB.forEach((o,i)=>{
  const st=document.createElement('li');st.className='ob-step'+(i===0?' on':'');st.dataset.i=i;
  st.innerHTML=`<span class="eyebrow">Сцена ${i+1} · ${o.kind}</span><h3></h3><p class="narr"></p><div class="lines"></div><p class="act"><b>Гравець:</b> <span></span></p>`;
  st.querySelector('h3').textContent=o.title;st.querySelector('.narr').textContent=o.narr;st.querySelector('.act span').textContent=o.act;
  const ls=st.querySelector('.lines');if(!o.lines.length)ls.remove();o.lines.forEach(([who,t])=>{const p=document.createElement('p');p.innerHTML='<b></b> <span></span>';p.querySelector('b').textContent=who+':';p.querySelector('span').textContent=t;ls.appendChild(p);});
  obList.appendChild(st);
  const d=document.createElement('button');d.type='button';d.className='dot'+(i===0?' on':'');d.setAttribute('aria-label',`Сцена ${i+1}: ${o.title}`);
  d.addEventListener('click',()=>{obScroll.scrollTo({top:st.offsetTop-4,behavior:REDUCED?'auto':'smooth'});});obDots.appendChild(d);
});
function obSet(i){if(i===obActive)return;obActive=i;obSince=performance.now();
  obList.querySelectorAll('.ob-step').forEach((el,k)=>el.classList.toggle('on',k===i));obDots.querySelectorAll('.dot').forEach((el,k)=>el.classList.toggle('on',k===i));
  document.getElementById('ob-title').textContent=`${i+1} / ${OB.length} · ${OB[i].title}`;document.getElementById('ob-kind').textContent=OB[i].kind;
  obC.classList.remove('flash');void obC.offsetWidth;obC.classList.add('flash');drawOb(0);}
function drawOb(f=0){const o=OB[obActive],sp=new Spr(SW,SH_);o.bg(sp,f);const s=2,ctx=setup(obC,SW*s,SH_*s,true);sp.draw(ctx,0,0,s);if(o.fg)o.fg(ctx,f,s);}
document.getElementById('ob-title').textContent=`1 / ${OB.length} · ${OB[0].title}`;document.getElementById('ob-kind').textContent=OB[0].kind;
/* темп заставок: 260 мс на кадр — персонажі рухаються спокійно */
const OB_FRAME=260;
drawOb(0);scene(obC,{interval:OB_FRAME,draw:f=>drawOb(Math.floor((performance.now()-obSince)/OB_FRAME))});
const obThumb=document.getElementById('ob-thumb');
function obRail(){const r=obThumb.parentElement.clientHeight,k=obScroll.clientHeight/obScroll.scrollHeight,h=Math.max(28,r*k),t=(r-h)*(obScroll.scrollTop/Math.max(1,obScroll.scrollHeight-obScroll.clientHeight));obThumb.style.height=h+'px';obThumb.style.top=t+'px';}
function obPad(){const steps=obList.querySelectorAll('.ob-step'),last=steps[steps.length-1];if(!last)return;obList.style.setProperty('padding-bottom',Math.max(0,obScroll.clientHeight-last.offsetHeight-8)+'px','important');obRail();}
obPad();window.addEventListener('resize',obPad);setTimeout(obPad,800);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(obPad);
obRail();window.addEventListener('resize',obRail);setTimeout(obRail,800);
obScroll.addEventListener('scroll',obRail,{passive:true});
obScroll.addEventListener('scroll',()=>{const c=obScroll.scrollTop+40;let b=0;obList.querySelectorAll('.ob-step').forEach((el,k)=>{if(el.offsetTop<=c)b=k;});obSet(b);},{passive:true});

/* ================= СПРАЙТ-ШИТИ АНІМАЦІЙ ================= */
function xform(src,map){const s=new Spr(src.w,src.h),ol=new Set();
  for(let y=0;y<src.h;y++)for(let x=0;x<src.w;x++){const q=map(x,y);if(!q)continue;const [sx,sy]=q;if(sx<0||sy<0||sx>=src.w||sy>=src.h)continue;const i=sy*src.w+sx,c=src.p[i];if(!c)continue;s.p[y*s.w+x]=c;if(src.ol&&src.ol.has(i))ol.add(y*s.w+x);}
  s.ol=ol;s.kind=src.kind;s.args=src.args;return s;}
const liftLeg=(spr,hip,mid,left,d)=>xform(spr,(x,y)=>y>=hip&&(left?x<mid:x>=mid)?[x,y+d]:[x,y]);
const breathe=(spr,hip,d)=>xform(spr,(x,y)=>y<hip?[x,y-d]:[x,y]);
const squash=(spr,k)=>xform(spr,(x,y)=>[x,Math.round(spr.h-1-(spr.h-1-y)/k)]);
const SHEETS=[
  {who:'Еней',base:()=>makeEnei(2),blink:()=>makeEnei(2,{blink:true}),hip:50,mid:23},
  {who:'Лис Микита',base:()=>makeFox(GINGER),blink:()=>makeFox(GINGER,{cursorOff:true}),hip:44,mid:18},
  {who:'Вовк Неситий',base:()=>makeWolf({drool:3}),blink:()=>makeWolf({drool:1}),hip:49,mid:23},
];
const STATES=[{k:'idle',n:'Стоїть',ms:420},{k:'walk',n:'Іде',ms:150},{k:'win',n:'Радіє',ms:110},{k:'fail',n:'Помилка',ms:140}];
function buildFrames(sh,st){
  const b=sh.base(),bl=sh.blink();
  if(st==='idle')return [[b,0,0],[breathe(b,sh.hip,1),0,0],[b,0,0],[bl,0,0],[breathe(bl,sh.hip,1),0,0],[b,0,0]];
  if(st==='walk')return [[liftLeg(b,sh.hip+6,sh.mid,true,2),0,-1],[b,0,0],[liftLeg(b,sh.hip+6,sh.mid,false,2),0,-1],[b,0,0]];
  if(st==='win')return [[b,0,0],[squash(b,0.9),0,0],[squash(b,1.06),0,-3],[b,0,-8],[b,0,-11],[b,0,-8],[squash(b,1.04),0,-3],[squash(b,0.92),0,0],[b,0,0],[b,0,0]];
  return [[b,0,0],[breathe(b,sh.hip,2),-1,0],[breathe(b,sh.hip,2),1,0],[breathe(b,sh.hip,2),-1,0],[breathe(b,sh.hip,2),0,0],[breathe(b,sh.hip,2),0,0],[b,0,0]];
}
(function(){
  const g=document.getElementById('sheets');if(!g)return;
  g.appendChild(Object.assign(document.createElement('span'),{className:'sh-corner'}));
  STATES.forEach(st=>{const h=document.createElement('span');h.className='sh-head';h.textContent=st.n;g.appendChild(h);});
  SHEETS.forEach(sh=>{
    const lab=document.createElement('span');lab.className='sh-who';lab.textContent=sh.who;g.appendChild(lab);
    STATES.forEach(st=>{
      const cell=document.createElement('figure');cell.className='sh-cell';
      const fr=buildFrames(sh,st.k);
      cell.innerHTML=`<div class="cloth"><canvas></canvas></div><figcaption>${fr.length} ${fr.length%10>=2&&fr.length%10<=4&&(fr.length%100<10||fr.length%100>=20)?'кадри':'кадрів'} · ${Math.round(1000/st.ms)} fps</figcaption>`;
      g.appendChild(cell);
      const c=cell.querySelector('canvas'),W=132,H=168;
      const draw=f=>{const [spr,dx,dy]=fr[f%fr.length],ctx=setup(c,W,H,true);ctx.clearRect(0,0,W,H);
        for(let x=0;x<W;x+=4)px(ctx,x,H-6,2,'rgba(80,60,30,.25)');
        const ox=Math.round((W-spr.w*2)/2)+dx*2,oy=H-8-spr.h*2+dy*2;spr.draw(ctx,ox,oy,2);
        if(st.k==='fail'&&f%fr.length>0){ctx.fillStyle='#7fc4e6';ctx.fillRect(ox+spr.w*2-14,oy+8+(f%3)*2,4,6);}
        if(st.k==='win'&&f%fr.length>=3&&f%fr.length<=6){ctx.fillStyle='#f2d27a';[[-10,-4],[spr.w*2+4,0],[spr.w,-14]].forEach(([a,b2])=>ctx.fillRect(ox+a,oy+b2,4,4));}};
      draw(0);scene(c,{interval:st.ms,draw});
    });
  });
})();

/* ================= КАРТА ЕКРАНІВ ================= */
(function(){
  const box=document.getElementById('flow');if(!box)return;
  // міні-екрани
  const egg=document.getElementById('fl-splash');if(egg){const ctx=setup(egg,120,90,true);ctx.fillStyle='#141b17';ctx.fillRect(0,0,120,90);drawEgg(ctx,17,22,43,12,2,false,true,0,0.9);}
  const mm=document.getElementById('fl-map');if(mm){const ctx=setup(mm,240,110,true);const sp=new Spr(240,110);for(let y=0;y<110;y++)for(let x=0;x<240;x++)sp.set(x,y,(x+y)%2?'#1d3f66':'#21466f');sp.draw(ctx,0,0,1);mapBase().draw(ctx,0,0,1);NODES.forEach(([x,y],i)=>{ctx.fillStyle=worldCol(i);ctx.fillRect(x-2,y-2,5,5);});}
  const pr=document.getElementById('fl-profile');if(pr){const ctx=setup(pr,92,144,true);makeEnei(1).draw(ctx,0,0,2);}
  const svg=document.getElementById('flow-svg');
  const LINKS=[['s1','s2','старт'],['s2','s3','грати'],['s3','s4','світ'],['s4','s5','Запустити'],['s5','s3','далі'],['s2','s6','Профіль'],['s5','s6','новий візерунок'],['s2','s7','Налаштування']];
  function anchor(el,side){const b=box.getBoundingClientRect(),r=el.getBoundingClientRect(),k=b.width/box.offsetWidth||1;const x=(r.left-b.left)/k,y=(r.top-b.top)/k,w=r.width/k,h=r.height/k;
    return {l:[x,y+h/2],r:[x+w,y+h/2],t:[x+w/2,y],b:[x+w/2,y+h]}[side];}
  function layout(f=0){
    const b=box.getBoundingClientRect(),k=b.width/box.offsetWidth||1;svg.setAttribute('viewBox',`0 0 ${b.width/k} ${b.height/k}`);
    let html='';LINKS.forEach(([a,c,label],i)=>{const A=document.getElementById(a),C=document.getElementById(c);if(!A||!C)return;
      const ra=A.getBoundingClientRect(),rc=C.getBoundingClientRect();let p1,p2;
      if(Math.abs(ra.top-rc.top)<20){p1=ra.left<rc.left?anchor(A,'r'):anchor(A,'l');p2=ra.left<rc.left?anchor(C,'l'):anchor(C,'r');}
      else{p1=ra.top<rc.top?anchor(A,'b'):anchor(A,'t');p2=ra.top<rc.top?anchor(C,'t'):anchor(C,'b');}
      const back=a==='s5'&&c==='s3';const mx=(p1[0]+p2[0])/2,my=(p1[1]+p2[1])/2+(back?-36:0);
      const d=`M${p1[0]},${p1[1]} Q${mx},${my+(back?-20:0)} ${p2[0]},${p2[1]}`;const col=back?'#e2702b':'var(--accent)';
      html+=`<path d="${d}" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="6 7" stroke-dashoffset="${-f*4}" opacity=".85"/><circle cx="${p2[0]}" cy="${p2[1]}" r="4" fill="${col}"/>`;
      const lw=label.length*6.6+12,ly=Math.abs(p1[1]-p2[1])<4?p1[1]-16:my-6;html+=`<rect x="${mx-lw/2}" y="${ly-11}" width="${lw}" height="16" rx="8" class="fl-pill"/><text x="${mx}" y="${ly+1}" text-anchor="middle" class="fl-lab">${label}</text>`;});
    // мандрівна точка по основному шляху
    const order=['s1','s2','s3','s4','s5'],seg=(f/18)%order.length|0,t=((f%18)/18),A=document.getElementById(order[seg]),C=document.getElementById(order[(seg+1)%order.length]);
    if(A&&C&&seg<order.length-1){const ra=A.getBoundingClientRect(),rc=C.getBoundingClientRect(),bb=box.getBoundingClientRect();const x=((ra.left+ra.width/2)*(1-t)+(rc.left+rc.width/2)*t-bb.left)/k,y=((ra.top+ra.height/2)*(1-t)+(rc.top+rc.height/2)*t-bb.top)/k;html+=`<rect x="${x-6}" y="${y-6}" width="12" height="12" fill="#f2d27a" stroke="#1f1b16" stroke-width="2"/>`;}
    svg.innerHTML=html;
    box.querySelectorAll('.scr').forEach(el=>el.classList.toggle('hot',A&&el===A));
  }
  layout(0);window.addEventListener('resize',()=>layout(0));scene(box,{interval:60,draw:layout});
})();

/* ================= КНИГА ХИТРОЩІВ ================= */
(function(){
  const mot=document.getElementById('bk-motif');if(mot)drawMotif(setup(mot,72,72),MOTIFS.rhombs,0,0,8,RD);
  const arr=document.getElementById('bk-array');
  if(arr){const vals=[2,3,5,7,8,11,13,15,18,21,24,27],target=31;
    const steps=[];{let L=0,R=vals.length-1;while(L<R){const s_=vals[L]+vals[R];steps.push([L,R,s_]);if(s_===target)break;if(s_<target)L++;else R--;}}
    const draw=t=>{const W=480,H=110,ctx=setup(arr,W,H,true);ctx.clearRect(0,0,W,H);const k=Math.min(steps.length-1,Math.floor(t/0.8)),[L,R,sum]=steps[k];
      vals.forEach((v,i)=>{const x=10+i*39,on=i===L||i===R,done=sum===target&&on;ctx.fillStyle=done?'#4f9d4a':(on?'#e2702b':'#e9dcc0');ctx.fillRect(x,40,34,30);ctx.fillStyle=on?'#fff':'#1f1b16';ctx.font='600 13px "Fira Code", monospace';ctx.textAlign='center';ctx.fillText(v,x+17,60);});
      [[L,'#2f55a0','Еней'],[R,'#9b3a87','Микита']].forEach(([i,c,n])=>{const x=10+i*39+17;ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x-6,30);ctx.lineTo(x+6,30);ctx.lineTo(x,38);ctx.fill();ctx.font='11px "Fira Code", monospace';ctx.fillText(T(n),x,24);});
      ctx.fillStyle='#635a4d';ctx.textAlign='left';ctx.font='12px "Fira Code", monospace';ctx.fillText(T(`ціль ${target} · сума ${vals[L]}+${vals[R]}=${sum} ${sum===target?'✓ знайшли':(sum<target?'→ мало, Еней крок уперед':'← багато, Микита крок назад')}`),10,96);};
    draw(0);scene(arr,{loop:steps.length*0.8+1.6,rest:steps.length*0.8,draw});}
  const ch=document.getElementById('bk-chart');
  if(ch){const draw=t=>{const W=480,H=230,ctx=setup(ch,W,H,true);ctx.clearRect(0,0,W,H);const pad=40,n=Math.min(1,t/4);
      ctx.strokeStyle='rgba(99,90,77,.35)';ctx.lineWidth=1;for(let i=0;i<=4;i++){const y=H-pad-i*(H-pad-16)/4;ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-10,y);ctx.stroke();}
      ctx.fillStyle='#635a4d';ctx.font='11px "Fira Code", monospace';ctx.fillText(T('кроки'),4,14);ctx.fillText('n →',W-34,H-pad+16);
      const N=200,maxY=N*N/2,X=v=>pad+(W-pad-10)*v/N,Y=v=>H-pad-(H-pad-16)*Math.min(1,v/maxY);
      const lim=Math.max(1,Math.floor(N*n));
      const plot=(fn,col)=>{for(let v=1;v<=lim;v+=2){const x=Math.round(X(v)),y=Math.round(Y(fn(v)));ctx.fillStyle=col;ctx.fillRect(x,y,4,4);}};
      plot(v=>v*(v-1)/2,'#8a8f96');plot(v=>v,'#e2702b');
      const v=lim;ctx.font='600 12px "Fira Code", monospace';ctx.fillStyle='#8a8f96';ctx.fillText(T(`Вовк O(n²): ${Math.round(v*(v-1)/2)}`),X(v)-150,Math.max(28,Y(v*(v-1)/2)-8));ctx.fillStyle='#e2702b';ctx.fillText(T(`Микита O(n): ${v}`),X(v)-120,Y(v)-8);};
    draw(4);scene(ch,{loop:6,rest:4,draw});}
})();

/* ================= ІКОНКА І ЗАСТАВКА ================= */
(function(){
  function iconSpr(){const s=new Spr(32,32);
    for(let y=0;y<32;y++)for(let x=0;x<32;x++){const r=6,inR=(x<r&&y<r&&Math.hypot(x-r+.5,y-r+.5)>r)||(x>31-r&&y<r&&Math.hypot(x-31+r-.5,y-r+.5)>r)||(x<r&&y>31-r&&Math.hypot(x-r+.5,y-31+r-.5)>r)||(x>31-r&&y>31-r&&Math.hypot(x-31+r-.5,y-31+r-.5)>r);if(inR)continue;
      const t=y/31;s.set(x,y,(t<0.5)?((x+y)%2&&t>0.35?'#3a2a66':'#1c2c66'):((x+y)%2&&t<0.65?'#1c2c66':'#3a2a66'));}
    eggCells(14,18).cells.forEach(c=>s.set(c.x+11,c.y+8,EGG_PAL[c.c]));
    s.fill(path([[10,7],[8,6],[6,7],[6,12],[5,14],[3,15],[5,16],[6,18],[6,23],[8,25],[10,25]],1),'#f2d27a');
    return s;}
  const ic=iconSpr(),row=document.getElementById('icons');
  if(row)[[256,8],[128,4],[64,2],[32,1]].forEach(([sz,k])=>{const f=document.createElement('figure');f.className='ic';f.innerHTML=`<canvas></canvas><figcaption>${sz}×${sz}</figcaption>`;row.appendChild(f);const c=f.querySelector('canvas'),ctx=setup(c,sz,sz);_sprDraw.call(ic,ctx,0,0,k);});
  const dock=document.getElementById('dock-icon');if(dock){const ctx=setup(dock,64,64);_sprDraw.call(ic,ctx,0,0,2);}
  const sp=document.getElementById('splash');
  if(sp){const TIPS=['Порада Сивілли: якщо масив відсортований, спробуй іти з двох кінців.','Порада Сивілли: шукаєш пару? Запам\'ятовуй, що вже бачив.','Порада Сивілли: «так/ні» можна ділити навпіл.','Порада Сивілли: не куй двічі те, що вже викував.'];
    const tip=document.getElementById('splash-tip'),bar=document.getElementById('splash-bar');
    const draw=t=>{const W=520,H=230,ctx=setup(sp,W,H,true);const g=new Spr(130,58);sky(g,['#0d1612','#14201a','#1f3a2a'],0,58);for(let i=0;i<30;i++){const x=Math.floor(hash(i,80)*130),y=Math.floor(hash(i,81)*50);if((i+Math.floor(t*4))%6)g.set(x,y,'#cfd6ff');}g.draw(ctx,0,0,4);
      drawEgg(ctx,17,22,W/2-34,18,4,false,true,0,0.9+0.06*Math.sin(t*3));
      [[150,40],[360,50],[140,150],[380,160]].forEach(([x,y],i)=>{const dy=Math.round(Math.sin(t*2+i)*2)*4;px(ctx,x,y+dy,4,i%2?RD:'#a7d6e6');px(ctx,x+4,y+4+dy,4,'#d4ecf3');px(ctx,x-4,y+4+dy,4,'#d4ecf3');px(ctx,x,y+8+dy,4,i%2?RD:'#a7d6e6');});
      const p=(t%6)/6;bar.style.width=(100*easeInOut(Math.min(1,p*1.15))).toFixed(1)+'%';tip.textContent=TIPS[Math.floor(t/6)%TIPS.length];};
    draw(2);scene(sp,{loop:24,rest:3,draw});}
})();

/* ================= БОС-ФАЙТ З ТУРНОМ ================= */
(function(){
  const c=document.getElementById('boss');if(!c)return;
  const E=makeEnei(2,{pose:'sabre'}),T=makeTurn(),J=makeJuno();
  const hpT=document.getElementById('hp-turn'),hpE=document.getElementById('hp-enei'),tm=document.getElementById('boss-timer'),tasks=[...document.querySelectorAll('.bt')],banner=document.getElementById('boss-banner'),hit=document.getElementById('boss-hit');
  const HITS=[3,6,9,11.2];
  const draw=t=>{
    const W=400,H=220,ctx=setup(c,W,H,true),sp=new Spr(200,110);
    sky(sp,['#2a1430','#7a2e3a','#e0794a'],0,74);for(let y=74;y<110;y++)for(let x=0;x<200;x++)sp.set(x,y,(x+y)%6===0?'#5a3a22':'#6b4a2a');
    sp.fill(ell(100,74,18,18).filter(([x,y])=>y<74),'#ffcf7a');sp.draw(ctx,0,0,2);
    ctx.globalAlpha=0.32;J.draw(ctx,250,-58+Math.round(Math.sin(t)*3),2);ctx.globalAlpha=1;
    const k=HITS.filter(h=>t>=h).length,last=HITS.filter(h=>t>=h).pop(),since=last!==undefined?t-last:9;
    const shake=since<0.3?Math.round(Math.sin(since*80)*3):0,lunge=since<0.35?Math.sin(since/0.35*Math.PI)*60:0;
    E.draw(ctx,40+lunge,220-148,2);
    if(k<4||since<0.6){ctx.globalAlpha=k>=4?1-since/0.6:1;T.draw(ctx,270+shake,220-152,2);ctx.globalAlpha=1;}
    if(since<0.25){ctx.fillStyle='rgba(255,240,200,.55)';ctx.fillRect(0,0,W,H);}
    hpT.style.width=(100-25*k)+'%';hpE.style.width=(100-6*Math.floor(t/2.5))+'%';
    const left=Math.max(0,30*60-Math.floor(t*95));tm.textContent=`${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`;
    tasks.forEach((el,i)=>{el.classList.toggle('done',i<k);el.classList.toggle('now',i===k);});
    hit.style.opacity=since<0.9&&k>0&&k<4?1-since/0.9:0;hit.style.transform=`translateY(${-since*30}px)`;
    banner.style.opacity=k>=4?clamp((since-0.4)/0.4):0;banner.style.transform=`scale(${k>=4?lerp(.8,1,back(clamp((since-0.4)/0.5))):.8})`;
  };
  draw(12.5);scene(c,{loop:14,rest:12.5,draw});
})();



/* ================= ЗАВАНТАЖИТИ: останній реліз з GitHub ================= */
(function(){
  const box=document.getElementById('download');if(!box||box.closest('.stash'))return;
  const ua=(navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||navigator.userAgent||'';
  const mine=/mac/i.test(ua)?'mac':/win/i.test(ua)?'win':/linux|x11/i.test(ua)&&!/android/i.test(navigator.userAgent)?'linux':null;
  const NAME={mac:'Mac',win:'Windows',linux:'Linux'};
  if(mine){const card=box.querySelector(`.dl[data-os="${mine}"]`);if(card)card.classList.add('mine');
    const hero=document.getElementById('hero-dl');if(hero)hero.textContent=`Завантажити для ${NAME[mine]} ↓`;}
  // macOS: основна кнопка — Apple Silicon (arm64 або старий образ без архітектури), окреме посилання — Intel (x64)
  const pick={mac:a=>/\.dmg$/i.test(a.name)&&!/x64\.dmg$/i.test(a.name),win:a=>/\.exe$/i.test(a.name),linux:a=>/\.AppImage$/i.test(a.name)};
  fetch('https://api.github.com/repos/f3an/kodeida/releases/latest',{headers:{Accept:'application/vnd.github+json'}})
    .then(r=>r.ok?r.json():Promise.reject(r.status))
    .then(rel=>{
      const v=(rel.tag_name||'').replace(/^v/,''),d=new Date(rel.published_at);
      const date=isNaN(d)?'':d.toLocaleDateString('uk-UA');
      const ver=document.getElementById('dl-ver');if(ver&&v)ver.textContent=`версія ${v}${date?' · '+date:''}`;
      box.querySelectorAll('.dl').forEach(card=>{
        const a=(rel.assets||[]).find(pick[card.dataset.os]);if(!a)return;
        const btn=card.querySelector('.dl-btn');btn.href=a.browser_download_url;btn.setAttribute('download','');
        const meta=card.querySelector('.dl-meta');if(meta)meta.textContent=`${a.name} · ${Math.round(a.size/1048576)} МБ`;
        const alt=card.querySelector('.dl-alt'),intel=card.dataset.os==='mac'&&(rel.assets||[]).find(x=>/x64\.dmg$/i.test(x.name));
        if(alt&&intel){alt.href=intel.browser_download_url;alt.setAttribute('download','');alt.hidden=false;const sub=card.querySelector('.dl-sub');if(sub)sub.textContent='Apple Silicon і Intel · .dmg';}
      });
    })
    .catch(()=>{/* релізу ще немає або ліміт API — кнопки ведуть на сторінку релізів */});
})();

/* лендінг: іконки переваг */
document.querySelectorAll('.wcard canvas[data-motif]').forEach(c=>drawMotif(setup(c,54,54),MOTIFS[c.dataset.motif],0,0,6,RD));
/* ================= ЛОГОТИП, ПАЛІТРА ================= */
ENEI.draw(setup(document.getElementById('logoHead'),112,104),0,0,4,[6,0,34,26]);
const PALETTE=[['Червона нитка','#B3202A','помилки, Юнона, орнамент'],['Лисячий рудий','#E2702B','акцент, кнопки, Микита'],['Чорна нитка','#1F1B16','текст, контури'],['Льон','#EFE6D2','тло для ілюстрацій'],['Шаровари','#2F55A0','Еней, посилання'],['Пояс','#D9A521','нагороди, візерунки'],['Нічний ліс','#141B17','тема редактора'],['Кришталь','#D4ECF3','Писанка, уламки']];
const pe=document.getElementById('palette');
PALETTE.forEach(([n,h,u],i)=>{const d=document.createElement('div');d.className='sw reveal';d.style.setProperty('--i',i%4);d.innerHTML=`<div class="c" style="background:${h}"></div><div class="l"><b>${n}</b><span>${h} · ${u}</span></div>`;pe.appendChild(d);});

/* ================= ПРОКРУТКА ================= */
const cover=document.querySelector('.cover'),heroBox=document.querySelector('.hero');
function layoutJ(){jour.classList.remove('pinned');jour.style.height='';}
function onScroll(){
  const y=window.scrollY,vh=window.innerHeight;
  if(!REDUCED){const p=clamp(y/(vh*0.9));heroBox.style.transform=`scale(${1-0.08*p}) translateY(${p*-20}px)`;document.getElementById('heroTitle').style.transform=`translateY(${p*-40}px)`;}
}
layoutJ();onScroll();
window.addEventListener('resize',()=>{layoutJ();onScroll();drawConn(mapFrame);});
window.addEventListener('scroll',()=>requestAnimationFrame(onScroll),{passive:true});


/* ================= ОДИН БЛОК = ОДИН ЕКРАН ================= */
(function(){
  const secs=[...document.querySelectorAll('.sec')],nav=document.getElementById('secnav');
  const FINE=window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ok=()=>FINE&&window.innerWidth>=760&&window.innerHeight>=380&&window.innerHeight<=1600&&!REDUCED;
  function fitAll(){
    document.documentElement.classList.toggle('snap',ok());
    secs.forEach(sec=>{const f=sec.querySelector('.fit');f.style.transform='';f.dataset.s=1;
      if(!ok())return;const avail=sec.clientHeight,hgt=f.scrollHeight;
      if(hgt>avail){const k=Math.max(0.35,avail/hgt);f.style.transform=`translateY(-50%) scale(${k})`;f.dataset.s=k;}});
    if(typeof drawConn==='function')drawConn(mapFrame);
  }
  secs.forEach((sec,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',sec.dataset.title||('Розділ '+(i+1)));
    b.addEventListener('click',()=>sec.scrollIntoView({behavior:REDUCED?'auto':'smooth'}));nav.appendChild(b);});
  const btns=[...nav.children];
  const so=new IntersectionObserver(es=>es.forEach(e=>{const i=secs.indexOf(e.target);if(e.isIntersecting){e.target.classList.add('on');btns.forEach((b,k)=>b.classList.toggle('on',k===i));}else e.target.classList.remove('on');}),{threshold:0.55});
  secs.forEach(s=>so.observe(s));
  fitAll();window.addEventListener('resize',fitAll);fitAllPublic=fitAll;
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitAll);
  setTimeout(fitAll,600);
})();

/* мова: перемикач і старт */
document.querySelectorAll('#lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.l)));
setLang(LANG);

/* тема: система / світла / темна, зберігається в localStorage */
(function(){
  const root=document.documentElement,box=document.getElementById('theme');if(!box)return;
  let cur='system';try{cur=localStorage.getItem('kd-theme')||'system';}catch(e){}
  const apply=t=>{cur=t;if(t==='system')root.removeAttribute('data-theme');else root.setAttribute('data-theme',t);
    try{localStorage.setItem('kd-theme',t);}catch(e){}
    box.querySelectorAll('button').forEach(b=>{const on=b.dataset.t===t;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});};
  box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.t)));
  apply(cur);
})();
/* після перезавантаження сторінка завжди відкривається згори */
(function(){
  try{history.scrollRestoration='manual';}catch(e){}
  if(location.hash){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}}
  const top=()=>window.scrollTo(0,0);
  top();window.addEventListener('load',top);window.addEventListener('pageshow',e=>{if(e.persisted)top();});
  setTimeout(top,120);
})();
/* поява при прокрутці (reveal / reveal-scale з --i), усе видно одразу */
if(!REDUCED&&vio){
  const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target);}}),{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  const vh=window.innerHeight;
  document.querySelectorAll('.reveal,.reveal-scale').forEach(el=>{if(el.getBoundingClientRect().top>vh){el.classList.add('pending');ro.observe(el);}});
}
})();
