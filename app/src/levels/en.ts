/** English texts for levels, worlds and the Book of Tricks. Ukrainian lives next to the level data. */
export interface LevelEn {
  title: string;
  topic: string;
  brief: string;
  statement: string[];
  hints: [string, string, string];
  lesson: string;
  /** Lines of the comment at the top of the starter code. */
  doc: string[];
  tool?: { name: string; text: string[]; code: string };
  /** Same order as `talk` in the level; `quip` — the line after the first win. */
  talk?: string[];
  quip?: string;
}

export const LEVELS_EN: Record<string, LevelEn> = {
  'troy.step': {
    title: 'First step', topic: 'a command',
    brief: '<b>First step.</b> Mykyta is right next to you. Press “Run” and Aeneas takes a step.',
    statement: [
      'Aeneas stands among the ashes of Troy. One step away is Mykyta the Fox, who has just fallen from the sky.',
      'The code is already written: <code>enei.move()</code> means “Aeneas, take a step forward”. Press “Run” (or ⌘↵) and watch what happens.',
      'This is the <b>word of order</b>, that is, code. The world does exactly what is written, nothing more.',
    ],
    tool: {
      name: 'a command',
      text: [
        '<code>enei</code> is Aeneas, and <code>.move()</code> is a command he carries out. The dot means “Aeneas has this action”.',
        'The brackets <code>()</code> mean “do it now”. Without them the command is only mentioned, not given.',
        'The semicolon <code>;</code> at the end is like a full stop in a sentence.',
      ],
      code: 'enei.move();   // Aeneas takes one step forward',
    },
    hints: ['The code is ready — just run it.', 'The “Run” button is at the top right, or press ⌘↵.', 'enei.move();'],
    lesson: 'The word of order is a sequence of commands. The world runs them one by one.',
    doc: ['First step', 'enei.move() — one step forward.'],
    talk: [
      'Mykyta, stay close: it is still smouldering here.',
      'I’m a fox, not an ember. But closer it is.',
    ],
  },
  'troy.well': {
    title: 'To the well', topic: 'a sequence of commands',
    brief: '<b>To the well.</b> The well is four steps away. Lead Aeneas to it.',
    statement: [
      'The Trojans need water. The well is four cells away from Aeneas.',
      'One <code>enei.move()</code> command is one step. Write it as many times as there are steps to the well, each on a new line.',
      'Count carefully: if Aeneas walks past the well, the road ends and he stumbles.',
    ],
    tool: {
      name: 'several commands',
      text: [
        'Commands run one after another, <b>from top to bottom</b>, each on its own line.',
        'The world doesn’t guess what you meant: Aeneas takes exactly as many steps as you write.',
      ],
      code: 'enei.move();   // first step\nenei.move();   // second step',
    },
    hints: ['How many cells are there between Aeneas and the well?', 'Each line enei.move(); is one step. You need four.', 'enei.move(); ×4'],
    lesson: 'Commands run one after another, top to bottom.',
    doc: ['To the well', 'The well is 4 steps away. enei.move() — one step forward.'],
    talk: [
      'The Trojans need water. The well is four steps away.',
      'Four steps, four lines. The world here is literal: you get exactly what you say.',
    ],
    quip: 'Water! I’m with you, Aeneas. I can swing a spear; counting is your job.',
  },
  'troy.far': {
    title: 'The far well', topic: 'the for loop',
    brief: '<b>The far well.</b> This well is 15 steps away. You could write 15 lines… or one clever one.',
    statement: [
      'The near well has dried up. The next one is at the very end of the street, 15 cells away.',
      'You could write <code>enei.move()</code> fifteen times, and it would work. But what if the well were a hundred steps away? A thousand?',
      'When the same thing has to be repeated many times, you write a <b>loop</b>: one command that says “repeat this 15 times”. The new tool below shows what it looks like.',
    ],
    tool: {
      name: 'the for loop',
      text: [
        '<code>for</code> repeats everything between <code>{</code> and <code>}</code> as many times as you say.',
        '<code>let i = 0</code> — the counter starts at zero. <code>i &lt; 3</code> — keep repeating while the counter is less than 3. <code>i++</code> — after each round, add 1 to the counter.',
        'So the counter goes 0, 1, 2 — three rounds. To repeat 10 times, write <code>i &lt; 10</code>.',
      ],
      code: 'for (let i = 0; i < 3; i++) {\n  enei.move();   // runs 3 times\n}',
    },
    hints: ['Fifteen identical lines… What if you repeated one line 15 times?', 'In a for loop, the number in the condition i < … is how many times to repeat.', 'for (let i = 0; i < 15; i++) { enei.move(); }'],
    lesson: 'A loop replaces many identical lines with one: change the number and you change how many times it repeats.',
    doc: ['The far well', 'The well is 15 steps away. enei.move() — one step forward.', 'Try a for loop: it repeats a command as many times as you say.'],
    talk: [
      'This well is dry. The next one is way over there, fifteen steps away.',
      'Fifteen identical lines? My fingers will fall off.',
      'That’s my point. There’s a clever word — for. Look at the new tool.',
    ],
    quip: 'A sailor joins the crew! On a ship we row in a loop too: one-two, one-two.',
  },
  'troy.sacks': {
    title: 'Sacks by the gate', topic: 'several commands in a loop',
    brief: '<b>Sacks by the gate.</b> Each of the five cells ahead has a sack. Collect all five.',
    statement: [
      'Sacks of grain lie by the gate: one on each of the five cells ahead of Aeneas.',
      'A new command: <code>enei.take()</code> picks up the sack where Aeneas is standing right now. So he has to walk to a sack first, and only then take it.',
      'Each sack needs two actions: a step and a pick-up. A loop can repeat not just one command but a whole group: put both inside it.',
    ],
    tool: {
      name: 'the loop body',
      text: [
        'Everything between <code>{</code> and <code>}</code> is called the <b>loop body</b>. The body runs in full, from the first line to the last, and only then does the next round begin.',
        'In the example below Aeneas takes two steps per round, so six steps in 3 rounds.',
      ],
      code: 'for (let i = 0; i < 3; i++) {\n  enei.move();\n  enei.move();\n}',
    },
    hints: ['What do you need to do for one sack?', 'For each sack: a step, then a pick-up. Five times.', 'for (let i = 0; i < 5; i++) { enei.move(); enei.take(); }'],
    lesson: 'The loop body is a group of commands that repeats as a whole: step, take, step, take…',
    doc: ['Sacks by the gate', 'Each of the 5 cells ahead has a sack.', 'enei.move() — step, enei.take() — pick up the sack.'],
    talk: [
      'Son, there are sacks of grain by the gate. Without bread we won’t sail far.',
      'Every sack is a step and a bend. Two actions, five times. A loop repeats both.',
    ],
    quip: 'That’s it, son. Young hands, a clever head — we can set off. I’m coming with you.',
  },
  'troy.gather': {
    title: 'Grain along the street', topic: 'the parameter n',
    brief: '<b>Grain along the street.</b> Now the streets differ: 3 sacks here, 12 there. <code>n</code> tells you how many.',
    statement: [
      'The Trojans found more streets with sacks. On each one the sacks lie in a row, one per cell, but their number differs.',
      'Your code will run on four streets: with <b>3, 5, 8 and 12</b> sacks. If you put the number 3 into the loop, Aeneas stops too early on the longer streets.',
      'That’s why the function receives <code>n</code> — how many sacks are on this street. It’s a <b>parameter</b>: a value that comes from outside and changes each time. Use <code>n</code> instead of a fixed number.',
    ],
    tool: {
      name: 'a parameter',
      text: [
        'A <b>parameter</b> is a value the function gets from outside, in the brackets after its name. Whoever calls the function decides what it is.',
        'The code is the same, but the result depends on what was passed in. That’s how one function works for every street.',
      ],
      code: 'function clap(times) {\n  for (let i = 0; i < times; i++) console.log("clap!");\n}\nclap(2);    // clap! clap!\nclap(5);    // five times',
    },
    hints: ['How do the streets in the tests differ? And what does the function know about it?', 'Take the loop from the last exercise, but put n instead of the number 5.', 'for (let i = 0; i < n; i++) { enei.move(); enei.take(); }'],
    lesson: 'Don’t write a number into the code if it can change: take it from a parameter, and the code works for any street.',
    doc: ['Grain along the street', 'Each of the n cells ahead has a sack. n is 3, 5, 8 or 12.', 'enei.move() — step, enei.take() — pick up the sack.'],
    talk: [
      'Aeneas! Our streets have sacks too. Three on one, twelve on another.',
      'Just don’t write a number into the loop. n tells you how many sacks the street has.',
    ],
    quip: 'I’ll take my bundle and come with you. Someone has to know how much grain we have.',
  },
  'troy.walk': {
    title: 'The well out there', topic: 'the while loop',
    brief: '<b>The well out there.</b> The well is at the end of the street, but how many steps away, nobody knows.',
    statement: [
      'Night, smoke, you can’t see a thing. The well is surely at the end of the street, but the streets have different lengths, and this time nobody gives you <code>n</code>.',
      'But Aeneas can check whether he has arrived: <code>enei.atEnd()</code> answers <code>true</code> (“yes”) if he is at the end of the street, and <code>false</code> (“no”) if not yet.',
      'When you don’t know how many times to repeat, but you know <b>until when</b>, you use a <code>while</code> loop: “while not at the end yet — step”.',
    ],
    tool: {
      name: 'the while loop and !',
      text: [
        '<code>while (condition) { … }</code> repeats the body <b>while</b> the condition is true. The condition is checked again before every round.',
        'The sign <code>!</code> means “not”: <code>!true</code> is <code>false</code>, and the other way round. So <code>!enei.atEnd()</code> reads “Aeneas is not at the end yet”.',
      ],
      code: 'let water = 0;\nwhile (water < 3) {\n  water++;   // repeats while water is below 3\n}',
    },
    hints: ['Until when does Aeneas need to walk?', 'While Aeneas is not at the end of the street, take a step.', 'while (!enei.atEnd()) { enei.move(); }'],
    lesson: 'for — when you know how many times. while — when you know until when.',
    doc: ['The well out there', 'The well is at the end of the street, length unknown.', 'enei.move() — step; enei.atEnd() — is Aeneas at the end yet.'],
    talk: [
      'The smoke is so thick I can’t see my own forelock. Where is that well?',
      'Somewhere at the end. How many steps, I can’t say. But you’ll feel it when you get there: enei.atEnd().',
    ],
    quip: 'See? for — when you know how many. while — when you know until when. Foxes walk like that all their lives.',
  },
  'troy.fire': {
    title: 'Around the fire', topic: 'the if / else condition',
    brief: '<b>Around the fire.</b> Reach the well at the end of the street. Where it’s burning ahead, jump over.',
    statement: [
      'The rubble is still smouldering. Reach the well at the end of the street without getting burnt.',
      'Two new commands. <code>enei.fireAhead()</code> answers whether the next cell is on fire: <code>true</code> or <code>false</code>. <code>enei.jump()</code> jumps over one cell.',
      'The fire is somewhere else in every test. So before each step, <b>decide</b>: if it’s burning ahead, jump, otherwise step. That’s an <code>if</code> inside the loop that takes you to the end of the street.',
    ],
    tool: {
      name: 'the if / else condition',
      text: [
        '<code>if (condition) { … }</code> runs an action only if the condition is true. <code>else { … }</code> says what to do otherwise.',
        'This is how code picks one of two actions depending on what is happening in the world.',
      ],
      code: 'if (raining) {\n  takeUmbrella();   // if it rains\n} else {\n  takeCap();        // if not\n}',
    },
    hints: ['Take the loop from the last exercise. What has changed on the street?', 'Until the end of the street: if there is fire ahead, jump; otherwise step.', 'while (!enei.atEnd()) { if (enei.fireAhead()) enei.jump(); else enei.move(); }'],
    lesson: 'A condition picks an action from the state of the world, and the loop repeats that choice at every step.',
    doc: ['Around the fire', 'enei.fireAhead() — is it burning ahead; enei.jump() — jump over;', 'enei.move() — step; enei.atEnd() — is this the end of the street.'],
    talk: [
      'Careful, Aeneas! The rubble is still smouldering.',
      'Look ahead before every step: if it burns, jump; if not, walk. The trick is to decide every single time.',
    ],
    quip: 'Not a single burn! And these trousers, by the way, are the best in all of Troy.',
  },
  'troy.last': {
    title: 'At the end of the street', topic: 'arrays and indexes',
    brief: '<b>At the end of the street.</b> Now the street is written down as an array. Return what lies on the last cell.',
    statement: [
      'Mykyta wrote the street down: what lies on each cell, in order. A list of values under one name is called an <b>array</b>, and here it’s called <code>street</code>.',
      'Cells are numbered from zero: <code>street[0]</code> is the first, <code>street[1]</code> the second. <code>street.length</code> gives the number of cells, so the last one is number <code>street.length - 1</code>.',
      'You have to <b>return</b> the answer: write <code>return</code> and the value. For example, for the street <code>["ash", "sack", "trojan", "well"]</code> return <code>"well"</code>.',
    ],
    tool: {
      name: 'array, index, length, return',
      text: [
        'Array elements are numbered <b>from zero</b>: the first is <code>days[0]</code>, the second is <code>days[1]</code>. An element’s number is called its index.',
        '<code>days.length</code> is how many elements the array has. Since we count from zero, the last element has index <code>length - 1</code>.',
        '<code>return</code> ends the function and hands the value back to whoever called it.',
      ],
      code: 'const days = ["Mon", "Tue", "Wed"];\ndays[0];        // "Mon"\ndays.length;    // 3\nreturn days[1]; // returns "Tue"',
    },
    hints: ['If the street has 4 cells, what is the number of the last one? Remember, we count from zero.', 'The number of the last cell is street.length - 1.', 'return street[street.length - 1];'],
    lesson: 'Arrays count from zero: the first element is [0], the last is [length - 1].',
    doc: ['At the end of the street', 'street[i] — what lies on cell i.', 'Return what lies on the last cell.'],
    talk: [
      'I wrote the street down on a scroll: what lies where, in order.',
      'And what is at the very end?',
      'Count from zero, like scribes do. Then the last place is one less than the total.',
    ],
    quip: 'Whoever counts from one will someday walk right past the well. Tried and tested.',
  },
  'troy.count': {
    title: 'Count the Trojans', topic: 'a counter variable',
    brief: '<b>Count the Trojans.</b> How many surviving Trojans are standing in the street?',
    statement: [
      'Aeneas gathers his crew. The array <code>street</code> is the street, with Trojans, sacks and ashes all mixed up.',
      'Return how many times <code>"trojan"</code> appears in the array. For example, <code>["sack", "trojan", "ash", "trojan"]</code> has two.',
      'Walk the whole street with a <code>for</code> loop from <code>0</code> to <code>street.length</code>. The variable <code>count</code> remembers how many you’ve found: meet a Trojan — add 1 to it.',
    ],
    tool: {
      name: 'a counter and ===',
      text: [
        '<code>let count = 0</code> creates a variable that remembers a number. <code>count++</code> adds 1 to it.',
        '<code>===</code> checks whether two values are the same. Don’t mix it up with <code>=</code>, which stores a value in a variable.',
      ],
      code: 'const fruits = ["apple", "pear", "apple"];\nlet apples = 0;\nfor (let i = 0; i < fruits.length; i++) {\n  if (fruits[i] === "apple") apples++;\n}\n// apples === 2',
    },
    hints: ['You need a number that grows while you walk the street.', 'Walk street with a loop; if street[i] is a Trojan, add one to count.', 'for (let i = 0; i < street.length; i++) if (street[i] === "trojan") count++;'],
    lesson: 'A variable remembers what you have already counted while the loop moves on.',
    doc: ['Count the Trojans', 'street[i] is "trojan", "sack" or "ash".', 'Return the number of Trojans.'],
    talk: [
      'How many of us survived?',
      'I saw a few on that street. But counting isn’t for me, I row.',
    ],
    quip: 'We have a crew. Now, son, even the sea isn’t so frightening.',
  },
  'troy.total': {
    title: 'All the grain', topic: 'a sum',
    brief: '<b>All the grain.</b> The sacks differ. How much grain is there in all of them together?',
    statement: [
      'Before sailing, Anchises wants to know how much grain is in the supplies. The array <code>nums</code> is the sacks: <code>nums[i]</code> is the grain in sack number <code>i</code>.',
      'Return the sum of all the numbers in the array. For <code>[3, 1, 4, 2]</code> that’s 3 + 1 + 4 + 2 = <code>10</code>.',
      'It’s almost like counting Trojans, except you add to <code>total</code> not 1 but what’s in the sack: <code>nums[i]</code>.',
    ],
    tool: {
      name: 'accumulating a sum, +=',
      text: [
        '<code>total += x</code> is the same as <code>total = total + x</code>: take what you already have and add the new value.',
        'A variable you add values to step by step is called an <b>accumulator</b>. It starts at zero.',
      ],
      code: 'const coins = [5, 10, 2];\nlet money = 0;\nfor (let i = 0; i < coins.length; i++) money += coins[i];\n// money === 17',
    },
    hints: ['What changes in the variable with every sack?', 'Walk the array with a loop and add nums[i] to total.', 'for (let i = 0; i < nums.length; i++) total += nums[i];'],
    lesson: 'An accumulator builds the answer piece by piece: each sack is added to what has already been counted.',
    doc: ['All the grain', 'nums[i] — grain in sack i.', 'Return how much grain there is in all the sacks together.'],
    talk: [
      'Before we load, I want to know how much grain we have. The sacks are all different.',
      'It’s like counting Trojans, only you add what’s in the sack instead of one.',
    ],
    quip: 'That will last a long time. As long as the sailor doesn’t snack at night.',
  },
  'troy.sum': {
    title: 'Supplies', topic: 'running total',
    brief: '<b>Supplies.</b> The sacks are loaded one at a time. After each, write down how much grain is on the ship.',
    statement: [
      'The Trojans load sacks onto the ship and after each one write down how much grain is loaded so far. <code>nums[i]</code> is the grain in sack <code>i</code>.',
      'Return a new array of the same length: at position <code>i</code>, the sum of all the sacks from the first up to and including the <code>i</code>-th. For <code>[1, 2, 3, 4]</code> that’s <code>[1, 3, 6, 10]</code>: 1, then 1 + 2, then 1 + 2 + 3, then everything.',
      'There can be up to 10,000 sacks. The world counts how often the code looks at the sacks. Recounting everything from the start for each sack adds up to a lot. Notice how to reuse the previous sum, and one pass is enough.',
    ],
    tool: {
      name: 'push',
      text: [
        '<code>result.push(x)</code> appends the value <code>x</code> to the end of the array <code>result</code>.',
        'You already know how to accumulate a sum. Now write it into the result after every step, not only at the end.',
      ],
      code: 'const log = [];\nlog.push("morning");\nlog.push("evening");\n// log is ["morning", "evening"]',
    },
    hints: ['Take “All the grain”: the sum is already being accumulated there. What is missing?', 'After every addition to sum, write sum into result.', 'let sum = 0; for (…) { sum += nums[i]; result.push(sum); }'],
    lesson: 'Don’t recount what you already know: the previous sum is half of the answer.',
    doc: ['Supplies', 'nums[i] — grain in sack i.', 'Return the running sums: [nums[0], nums[0]+nums[1], …].'],
    talk: [
      'Loading! After every sack, tell us how much is on board.',
      'You already know how to count the sum. Now just write it down after every sack.',
    ],
  },
  'sea.max': {
    title: 'The biggest ship', topic: 'maximum of an array',
    brief: '<b>The biggest ship.</b> Find the ship with the most oars.',
    statement: [
      'Aeolus’s storm scattered the fleet. From the mast Mykyta sees the column of ships: <code>ships[i]</code> is how many oars ship number <code>i</code> has.',
      'Return the largest number in the array. For <code>[12, 30, 8, 22]</code> it’s <code>30</code>.',
      'Don’t use the ready-made <code>Math.max(...ships)</code>: walk the column yourself. The variable <code>best</code> remembers the biggest ship seen so far; meet a bigger one — remember it instead.',
    ],
    hints: ['What do you need to remember while walking the column?', 'best = the first ship; for each next one: if it is bigger, it becomes the new best.', 'for (let i = 1; i < ships.length; i++) if (ships[i] > best) best = ships[i];'],
    lesson: 'One pass and one “best so far” variable — that is how you find a maximum.',
    doc: ['The biggest ship', 'ships[i] — the number of oars of ship i (the array is not empty).', 'Return the largest.'],
    tool: {
      name: 'a “best so far” variable',
      text: [
        'To find the biggest, you don’t have to remember every ship: one is enough — the best of those you’ve already seen.',
        'Start with the first. Compare each next one with the best using <code>&gt;</code>; if the new one is bigger, it becomes the best.',
      ],
      code: 'let tallest = heights[0];\nfor (let i = 1; i < heights.length; i++) {\n  if (heights[i] > tallest) tallest = heights[i];\n}',
    },
    talk: [
      'Ha! My winds have scattered your fleet. Go on, try to find one decent ship among these splinters!',
      'I’m up the mast. I see them all, but I’ll only remember the best. A fox needs no more.',
    ],
    quip: 'Now that’s a ship! We’ll sail at the front on it. I even counted the oars, so you needn’t doubt.',
  },
  'sea.swap': {
    title: 'Swap on the flanks', topic: 'swapping two elements',
    brief: '<b>Swap on the flanks.</b> Swap the first and the last ship of the column.',
    statement: [
      'The wind rearranged the ships: the flagship sails last, and the smallest boat sails first.',
      'Swap <code>ships[0]</code> and the last ship. Do it <b>in place</b>: change the array <code>ships</code> itself instead of making a new one, and return nothing. <code>[2, 7, 5, 9]</code> becomes <code>[9, 7, 5, 2]</code>.',
      'Columns have different lengths, so work out the last ship’s number: <code>ships.length - 1</code>. And so you don’t lose a value during the swap, first save one of them in a temporary variable.',
    ],
    hints: ['What happens to the first ship if you write the last one into its place straight away?', 'Put the first ship aside in a variable, then move them.', 'const t = ships[0]; ships[0] = ships[ships.length - 1]; ships[ships.length - 1] = t;'],
    lesson: 'To swap two values, put one aside first: a temporary variable is like a third cup.',
    doc: ['Swap on the flanks', 'Swap the first and the last ship of ships (in place).'],
    tool: {
      name: 'a swap through a temporary variable',
      text: [
        'To swap two values, you first have to <b>put one aside</b>. Otherwise, when you write the second over the first, the first is lost.',
        'Like with two cups: to swap the tea and the coffee in them you need a third, empty cup.',
      ],
      code: 'const cup = a[0];   // put the first aside\na[0] = a[1];        // the second takes its place\na[1] = cup;         // and the saved one takes the second place',
    },
    talk: [
      'The flagship ended up at the back, and the smallest boat leads! There’s order for you.',
      'Swap them. Just carefully: if you simply write one over the other, the first ship is lost in the waves.',
    ],
    quip: 'The flagship is in front again! I thought we’d have to row backwards.',
  },
  'sea.reverse': {
    title: 'Column reversed', topic: 'in-place reversal',
    brief: '<b>Column reversed.</b> Reverse the column of ships in place, without a new array.',
    statement: [
      'Aeolus turned the wind, and the column must sail in reverse order.',
      'Change the array <code>ships</code> <b>in place</b>: the first ship becomes the last, the second the second to last and so on. <code>[1, 2, 3, 4, 5]</code> becomes <code>[5, 4, 3, 2, 1]</code>. Return nothing.',
      'The ready-made <code>reverse()</code> is forbidden here. Swap ships in pairs: the first with the last, the second with the second to last… up to the middle.',
    ],
    hints: ['Who has to swap places with whom?', 'The first with the last, the second with the second to last… until they meet in the middle.', 'let i = 0, j = n − 1; while (i < j) { swap ships[i] and ships[j]; i++; j--; }'],
    lesson: 'Two ends moving towards each other and a swap — the array is reversed without a single copy.',
    doc: ['Column reversed', 'Reverse ships in place. reverse() is forbidden.'],
    tool: {
      name: 'two pointers towards each other',
      text: [
        'Keep two numbers: <code>i</code> from the start and <code>j</code> from the end. Swap <code>ships[i]</code> and <code>ships[j]</code>, then move <code>i</code> forward and <code>j</code> back.',
        'Stop in the middle, when <code>i</code> and <code>j</code> meet. Otherwise the pairs get swapped again and return to their places.',
      ],
      code: 'let i = 0, j = a.length - 1;\nwhile (i < j) {\n  // swap a[i] and a[j] here\n  i++;\n  j--;\n}',
    },
    talk: [
      'I turned the wind around! Now your column sails backwards.',
      'Then let’s turn the column around too. The first swaps with the last, the second with the one before last… You already know how to swap; now go from both ends.',
    ],
    quip: 'See? A swap plus two ends towards each other, and the column is reversed without a single extra ship.',
  },
  'sea.zeroes': {
    title: 'Wrecks to the back', topic: 'two indices',
    brief: '<b>Wrecks to the back.</b> Move the wrecked ships (<code>0</code>) to the end of the column, keeping the intact ones in the same order.',
    statement: [
      'After the storm some ships are wrecked. In the array <code>nums</code> a wrecked ship is <code>0</code>.',
      'Move all the zeros to the end <b>in place</b>, and keep the intact ships in the order they were. <code>[0, 1, 0, 3, 12]</code> becomes <code>[1, 3, 12, 0, 0]</code>.',
      'There can be up to 10,000 ships. Shifting the whole tail after every zero is very slow. It’s smarter to keep track of where the next intact ship goes.',
    ],
    hints: ['What if you write intact ships straight to their place?', 'Keep an index k — where the next intact ship goes. At the end fill the tail with zeros.', 'k = 0; for each x ≠ 0: nums[k++] = x; while k < n: nums[k++] = 0.'],
    lesson: 'A slow “where to write” index and a fast “what to read” one — the array is sorted out in one pass.',
    doc: ['Wrecks to the back', '0 — a wrecked ship. Move zeros to the end in place,', 'keeping the order of the others.'],
    tool: {
      name: 'a “where to write” index',
      text: [
        'Two variables with different jobs: <code>i</code> reads the array in order, and <code>k</code> shows <b>where to write</b> the next value you want to keep.',
        '<code>k</code> grows only when you find something to keep. So everything you need gathers at the start of the array, and the rest can be filled in afterwards.',
      ],
      code: 'let k = 0;\nfor (let i = 0; i < words.length; i++) {\n  if (words[i] !== "") words[k++] = words[i];\n}\n// the first k places hold the non-empty words',
    },
    talk: [
      'Half the ships are wrecked! They only get in the column’s way.',
      'Let’s not throw them away — let’s move them to the end. The whole ones sail in front in the same order. One index reads, the other writes.',
    ],
    quip: 'Whole ones in front, wrecks at the back. Like a parade, only wetter.',
  },
  'sea.sort': {
    title: 'Line up by size', topic: 'simple sorting',
    brief: '<b>Line up by size.</b> Order the ships from smallest to largest by swapping neighbours.',
    statement: [
      'Aeneas lines up the fleet: smaller ships in front, bigger ones behind.',
      'Sort <code>ships</code> in ascending order <b>in place</b>. <code>[5, 2, 9, 1, 6]</code> becomes <code>[1, 2, 5, 6, 9]</code>. Aeolus took the ready-made <code>sort()</code> away, so you’ll write the sorting yourself.',
      'The simplest way is <b>bubble sort</b>: walk the column and swap two neighbours if the left is bigger than the right. After one pass the biggest ends up at the end. Repeat the passes while there’s something to swap.',
    ],
    hints: ['If two neighbours are in the wrong order — what do you do?', 'A pass that swaps wrong neighbours pushes the biggest ship to the end. Repeat n times.', 'for (i < n) for (j < n−1−i) if (ships[j] > ships[j+1]) swap.'],
    lesson: 'Bubble sort is simple, but compares every ship with every other — O(n²). The final problem needs a trick.',
    doc: ['Line up by size', 'Sort ships ascending in place. sort() is forbidden.'],
    tool: {
      name: 'a nested loop',
      text: [
        'A loop inside a loop: for every step of the outer one, the inner one runs all the way through.',
        'In bubble sort the inner loop swaps neighbours that are in the wrong order and pushes the biggest ship to the end. The outer loop repeats that until everyone is in place.',
      ],
      code: 'for (let round = 0; round < 3; round++) {\n  for (let j = 0; j < 2; j++) {\n    console.log(round, j);  // 6 lines: 3 × 2\n  }\n}',
    },
    talk: [
      'Big ones, small ones, all mixed up! My winds know a thing or two about chaos.',
      'Swap neighbours if the left one is bigger. One pass, and the biggest ship is already at the back. Now repeat.',
      'Heh-heh. Comparing every one with every other — that’s my way. Tasty and slow.',
    ],
    quip: 'See that? Every one with every other! That’s how I count. Well, let’s see how you manage the final without me.',
  },
  'sea.colors': {
    title: 'Three sails', topic: 'three pointers in one pass',
    brief: '<b>Three sails.</b> Arrange the ships by sail colour: red (<code>0</code>), white (<code>1</code>), blue (<code>2</code>).',
    statement: [
      'For Aeolus to calm down, the fleet must sail in order: all the red sails first, then white, then blue.',
      'The array <code>nums</code> holds only <code>0</code> (red), <code>1</code> (white) and <code>2</code> (blue). Sort it <b>in place</b>: <code>[2, 0, 2, 1, 1, 0]</code> must become <code>[0, 0, 1, 1, 2, 2]</code>. <code>sort()</code> is forbidden.',
      'There can be up to 10,000 ships. The Wolf on Aeolus’s cloud bubble-sorts, comparing every ship with every other. But there are only three colours. Try to put everything in place in one pass.',
    ],
    hints: ['There are only three colours. Do you need to compare ships with each other?', 'Three borders: low — where the next red goes, high — where the next blue goes, mid — the ship under inspection.', 'low = mid = 0, high = n−1; while mid ≤ high: 0 → swap with low, low++, mid++; 1 → mid++; 2 → swap with high, high--.'],
    lesson: 'When there are few values, borders between groups matter more than comparisons: three pointers, one pass.',
    doc: ['Three sails', '0 — red, 1 — white, 2 — blue. Sort nums in place.', 'sort() is forbidden.'],
    tool: {
      name: 'three boundaries',
      text: [
        'When there are only three values, you don’t need to compare ships with each other. It’s enough to keep the boundaries of the groups.',
        '<code>low</code> — where the reds end, <code>high</code> — where the blues begin, <code>mid</code> — whoever is being inspected now. Every inspected ship goes to its own group.',
      ],
      code: '// [ reds | whites | not seen yet | blues ]\n//        low      mid           high\n// 0 → swap with low;   1 → leave;   2 → swap with high',
    },
    talk: [
      'The last trial! Red, white and blue sails, all mixed up. And the Wolf is already on my cloud comparing every one with every other.',
      'Every one with every other, every one with every other… until the storm ends. Or until I get hungry.',
      'We won’t compare at all. There are only three colours — keep three boundaries, and in one pass everything falls into place.',
    ],
    quip: 'Well… all right. The fleet is in order, my winds have calmed down. Sail on to Carthage, you clever lot.',
  },
  'carthage.meet': {
    title: 'Meet in the middle', topic: 'two pointers towards each other',
    brief: '<b>Meet in the middle.</b> Aeneas starts from the left end of the wall, Mykyta from the right. Add up pairs of stones until they meet.',
    statement: [
      'Dido measures the wall. Aeneas stands on the left edge, Mykyta on the right. At every step they add up the two stones they stand on and take a step towards each other.',
      'Return the array of these sums. For <code>[3, 1, 4, 1, 5, 9]</code>: 3 + 9 = 12, 1 + 5 = 6, 4 + 1 = 5, so the answer is <code>[12, 6, 5]</code>. If one stone is left in the middle (odd length), add it as is.',
      'This is the first appearance of two <b>pointers</b> walking from both ends towards each other: <code>left</code> starts at 0, <code>right</code> at the last index. It’s the main trick of Carthage.',
    ],
    hints: ['Where are Aeneas and Mykyta after each step?', 'left moves right, right moves left, while left < right. At the end check whether a stone is left in the middle.', 'while (left < right) sums.push(walls[left++] + walls[right--]); if (left === right) sums.push(walls[left]);'],
    lesson: 'Two pointers from opposite ends walk the array together just once.',
    doc: ['Meet in the middle', 'Return [walls[0]+walls[n−1], walls[1]+walls[n−2], …];', 'the middle stone (if any) as is.'],
    tool: {
      name: 'two pointers in one loop',
      text: [
        'Two numbers can move in <b>one</b> loop: <code>left</code> goes right, <code>right</code> goes left. The loop runs while <code>left &lt; right</code>, that is, until they meet.',
        'If there is an odd number of elements, one is left in the middle after the loop, without a pair: <code>left === right</code>.',
      ],
      code: 'let left = 0, right = a.length - 1;\nwhile (left < right) {\n  console.log(a[left], a[right]);\n  left++;\n  right--;\n}\nif (left === right) console.log("middle:", a[left]);',
    },
    talk: [
      'Welcome to Carthage, Trojans. I need the wall measured — from both ends at once, for time is short.',
      'I’ll take the left, Mykyta the right. Mykyta? Mykyta!',
      'I’m here, I’m here. Dido’s courtiers are just so… attentive. Going to my end.',
    ],
    quip: 'The measures met. You walk in pairs better than my guards.',
  },
  'carthage.mirror': {
    title: 'The name on the seal', topic: 'comparing from both ends',
    brief: '<b>The name on the seal.</b> Does the name on the seal read the same left to right and right to left?',
    statement: [
      'At the gates of Carthage guests show their seals. A true seal is one whose name reads the same from both ends, like <code>"level"</code> or <code>"radar"</code>.',
      'Return <code>true</code> if the word <code>word</code> is the same from both ends, and <code>false</code> if not. Only lower-case letters here, no spaces or punctuation.',
      'Compare letters from both ends towards each other: the first with the last, the second with the second to last. A mismatched pair — <code>false</code> straight away. Reached the middle with no mismatch — <code>true</code>.',
    ],
    hints: ['Which letter should the first one be compared with?', 'Compare word[left] and word[right] until they meet. A mismatch — false straight away.', 'while (left < right) { if (word[left] !== word[right]) return false; left++; right--; } return true;'],
    lesson: 'A mirror is checked from both ends: one mismatch and the answer is known.',
    doc: ['The name on the seal', 'true if word reads the same from both ends.'],
    tool: {
      name: 'an early return',
      text: [
        '<code>return</code> can be written anywhere: the function ends right away. As soon as you find a single mismatch, the answer is known and there’s no need to check further.',
        'And if the loop got to the end and found nothing, return the opposite after the loop.',
      ],
      code: 'for (let i = 0; i < guests.length; i++) {\n  if (guests[i] === "Wolf") return false;  // no need to look further\n}\nreturn true;  // no Wolf among the guests',
    },
    talk: [
      'Every noble guest has a seal with their name. A true one reads the same from both ends.',
      'Compare the first letter with the last, the second with the one before last. Found a mismatch — it’s a fake, no need to look further.',
    ],
    quip: 'Heh, my name won’t make a seal: “Mykyta” backwards is “atykym”. Sounds like a spell.',
  },
  'carthage.palindrome': {
    title: 'The inscription over the gate', topic: 'two pointers on a string',
    brief: '<b>The inscription over the gate.</b> Does the inscription read the same both ways, ignoring capitals, spaces and punctuation?',
    statement: [
      'An inscription is carved over the gates of Carthage. They say the true one reads the same left to right and right to left.',
      'Return <code>true</code> if the string <code>s</code> is a <b>palindrome</b>. Consider only letters and digits, and treat capital and small letters as the same. <code>"A man, a plan, a canal: Panama"</code> is a palindrome: without spaces and punctuation it’s amanaplanacanalpanama.',
      'As with the seal, walk from both ends towards each other, but skip spaces and punctuation. The tool below shows how to check whether a character is a letter and how to make it small.',
    ],
    hints: ['What if you compare characters from both ends?', 'left and right towards each other; skip characters that are not letters or digits; compare in lower case.', 'while (l < r) { skip the rest; if s[l] ≠ s[r] → false; l++; r--; } return true;'],
    lesson: 'Two pointers work on strings too: compare the ends and move to the middle.',
    doc: ['The inscription over the gate', 'true if s is a palindrome (letters and digits only, any case).'],
    tool: {
      name: 'skipping and lower case',
      text: [
        'Inside a big loop you can put small loops that <b>skip</b> what you don’t need: while the left place isn’t a letter — <code>left++</code>.',
        '<code>ch.toLowerCase()</code> makes a letter lower case, so “A” and “a” become the same. <code>/[a-z0-9]/i.test(ch)</code> checks whether it’s a Latin letter or a digit.',
      ],
      code: 'let i = 0;\nwhile (i < s.length && s[i] === " ") i++;   // skipped the spaces\nconsole.log(s[i].toLowerCase());',
    },
    talk: [
      'Now the inscription over my gates. It has capital letters, commas and spaces.',
      'The same mirror, only skip what’s extra and make capitals small. A comma is no witness to us.',
    ],
    quip: 'A true inscription. So the gates are true as well. Come in.',
  },
  'carthage.twosum': {
    title: 'Two merchants', topic: 'two pointers on a sorted array',
    brief: '<b>Two merchants.</b> Merchants stand in a row by price. Find two whose goods together cost exactly <code>target</code>.',
    statement: [
      'At the Carthage market merchants stand in ascending price order: in the array <code>numbers</code> each price is no less than the one before.',
      'Find two different merchants whose prices add up to <code>target</code>, and return their numbers counting <b>from one</b>. For <code>[2, 7, 11, 15]</code> and <code>target = 9</code>: 2 + 7 = 9, that’s merchants 1 and 2, so return <code>[1, 2]</code>. There is always exactly one answer.',
      'There can be up to 10,000 merchants. The Wolf tries every pair, and the market closes first. A hint: start with the cheapest and the most expensive. If the sum is too big, the expensive one is out; too small — the cheap one is.',
    ],
    hints: ['The row is sorted. What happens to the sum if the left merchant moves right?', 'Start with the cheapest and the most expensive. Sum too small — left moves right; too big — right moves left.', 'l = 0, r = n − 1; while l < r: s = a[l] + a[r]; s === t → [l+1, r+1]; s < t → l++; else r--.'],
    lesson: 'In a sorted row every comparison rules out a whole merchant: two pointers instead of all pairs.',
    doc: ['Two merchants', 'numbers is sorted ascending. Return [i + 1, j + 1],', 'where numbers[i] + numbers[j] === target.'],
    tool: {
      name: 'a sorted row shows the way',
      text: [
        'On a sorted row, the sum of the left and the right tells you where to go. Too small — the left moves right towards pricier goods. Too big — the right moves left towards cheaper ones.',
        'Each step discards a whole merchant who surely has no pair. That’s why you don’t need to try every pair.',
      ],
      code: '// prices: [2, 5, 9, 14], need 14\n// 2 + 14 = 16 → too big   → right moves left\n// 2 + 9  = 11 → too small → left moves right\n// 5 + 9  = 14 → found it!',
    },
    talk: [
      'At the market a merchant sells if someone else adds the rest of the price. The row stands by price, from cheap to dear.',
      'And I’ll ask every pair! Every one with every other! The market is long, and I’m in no hurry.',
      'The market will close before you reach the middle. The row is sorted — it will tell you whom to let go.',
    ],
    quip: 'What? Already? I haven’t finished questioning the first merchant…',
  },
  'carthage.dups': {
    title: 'Measures without repeats', topic: 'slow and fast pointers',
    brief: '<b>Measures without repeats.</b> Remove repeats from <code>nums</code> in place and return the number <code>k</code> of different measures, not a new array.',
    statement: [
      'The shard tangled the measures: some repeat on the tape <code>nums</code>. The tape is ordered, so equal measures stand next to each other.',
      'Change the <code>nums</code> array itself <b>in place</b>: its first <code>k</code> elements must contain the different measures in their original order. Return the number <code>k</code>, not a new array. Only the first <code>k</code> elements are checked.',
      'Before the call: <code>nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]</code>. After the call: <code>nums = [0, 1, 2, 3, 4, 2, 2, 3, 3, 4]</code>, and the returned value is <code>k = 5</code>. Only the first <code>k</code> elements are checked: <code>[0, 1, 2, 3, 4]</code>. You need two pointers: one reads the tape, the other shows where to write the next new measure.',
    ],
    hints: ['Repeats stand next to each other. Where should the next new measure go?', 'k is the length of the clean part. The fast pointer i looks for a measure different from nums[k−1].', 'k = 1; for (i = 1..n−1) if (nums[i] !== nums[k−1]) nums[k++] = nums[i]; return k.'],
    lesson: 'The slow pointer keeps the clean part, the fast one looks for something new — and no tail shifting.',
    doc: ['Measures without repeats', 'nums is sorted. The first k elements are the unique measures; return k.'],
    tool: {
      name: 'slow and fast pointers',
      text: [
        'This is the “where to write” index you know from the sea. <code>k</code> is the length of the clean part, <code>i</code> runs ahead looking for a new measure.',
        'The array is sorted, so repeats stand next to each other: it’s enough to compare with the last written measure <code>nums[k - 1]</code>.',
      ],
      code: '// [1, 1, 2, 2, 3]\n//  k=1: clean part is [1]\n//  i sees 2 ≠ 1 → write it at k, k = 2\n//  i sees 3 ≠ 2 → k = 3',
    },
    talk: [
      'The measures on the tape repeat: the same one three times over.',
      'Remember the sea? One pointer reads, the other writes. Same here, only we write a new measure and skip the repeats.',
    ],
    quip: 'Now the measures are clean. A little more and the wall will close.',
  },
  'carthage.dido': {
    title: 'Dido’s problem', topic: 'two pointers',
    brief: '<b>Dido’s problem.</b> Posts of different heights stand along the shore. Pick two so that the most water fits between them.',
    statement: [
      'Dido may take as much land as she can fence with an ox hide. The posts are already in a row; she just has to pick two.',
      'The heights of the posts are in the array <code>height</code>: <code>height[0]</code> is the first post, <code>height[1]</code> the second.',
      'Water collects between two posts. It can’t rise above the <b>lower</b> post, or it spills over. So the amount of water is <b>distance between the posts × height of the lower one</b>.',
      'Example: <code>[1, 8, 6, 2, 5, 4, 8, 3, 7]</code>. The second post (8) and the last (7): 7 steps apart, the lower is 7 high, water 7 × 7 = <code>49</code>. You can’t do better, so return <code>49</code>.',
      'There can be up to 100,000 posts. The Wolf tries every pair: for 10,000 posts that’s almost 50 million. Find a smarter way.',
    ],
    hints: [
      'What if you walk from both ends at once?',
      'Start with the widest plot: the outermost posts. Water rises to the lower one. Is there any point keeping the lower post if the plot only gets narrower from here?',
      'l = 0, r = n − 1. While l < r: compute the area, update the best, move the pointer with the lower post.',
    ],
    lesson: 'The lower post has already given its best: move it, and in n steps everything that matters is checked.',
    doc: ['Dido’s problem', 'height[i] — the height of post i.', 'Return the most water a plot between two posts can hold.'],
    tool: {
      name: 'discard the worse one',
      text: [
        'Start with the widest plot: the outermost posts. The water rises only to the <b>lower</b> of them.',
        'If you move the higher one, the plot narrows, and the water won’t rise: the same lower post holds it. So the lower post has already given its best — that’s the one we discard.',
      ],
      code: '// [4, 8, 6, 3]  l = 0 (4), r = 3 (3)\n// area = 3 × min(4, 3) = 9\n// the lower one is on the right (3): move r',
    },
    talk: [
      'As much land as you can fence with a hide is mine. The posts are already standing — pick two that hold the most water.',
      'Every pair! Every one! I’ll count them all, and meanwhile the hide… oh, it’s drying out.',
      'Let’s start with the outermost. Then every time we discard the worse one — the lower one. Why exactly that one — think it over while I smile at the courtiers.',
    ],
  },
  'forest.dup': {
    title: 'Two of a kind', topic: 'Set: have I seen it',
    brief: '<b>Two of a kind.</b> Is any item being sold twice at the fair?',
    statement: [
      'Everything got mixed up at the animals’ fair: they say someone is selling the same thing twice. <code>nums[i]</code> is the item number at stall <code>i</code>.',
      'Return <code>true</code> if some number appears at least twice, and <code>false</code> if they’re all different. For <code>[1, 2, 3, 1]</code> — <code>true</code>, because 1 appears twice.',
      'There can be up to 10,000 stalls. For every item the Wolf walks the whole fair again. You just <b>remember</b> what you’ve seen: a <code>Set</code> lets you quickly check whether a number is already there.',
    ],
    tool: {
      name: 'Set',
      text: [
        'A <code>Set</code> is a bag in which every value lies only once. <code>seen.add(x)</code> puts a value in, <code>seen.has(x)</code> tells you instantly whether it’s already there.',
        'Instantly is the point: <code>has</code> doesn’t go through the contents like <code>includes</code> on an array, it goes straight to the right place.',
      ],
      code: 'const seen = new Set();\nseen.add("fox");\nseen.has("fox");   // true\nseen.has("wolf");  // false',
    },
    talk: [
      'My forest! I’m home! And I’m ginger again, without a drop of paint.',
      'Mykyta? The same Mykyta? Well, well. The fair is a complete muddle now: someone sells the same thing twice.',
      'Aeneas, don’t run round the fair every time. Remember what you’ve already seen. That’s what a Set is for.',
    ],
    quip: 'Hm. Quick. Maybe something will come of you after all, Mykyta.',
    hints: ['What do you need to remember while walking past the stalls?', 'For every item: if it is already in seen, you found a repeat; otherwise put it into seen.', 'for (x of nums) { if (seen.has(x)) return true; seen.add(x); } return false;'],
    lesson: 'Remember what you’ve seen in a Set: the “was it here already?” check becomes instant, and you walk the fair only once.',
    doc: ['Two of a kind', 'true if some number in nums appears twice.'],
  },
  'forest.most': {
    title: 'The best seller', topic: 'Map: a counter',
    brief: '<b>The best seller.</b> Which item was sold the most times at the fair?',
    statement: [
      'King Lion wants to know what the fair has most of. <code>goods</code> is the list of the morning’s sales: one entry is one sale.',
      'Return the item that appears most often. For <code>["cheese", "honey", "honey", "mushrooms", "honey"]</code> it’s <code>"honey"</code>: it sold three times. In the tests there is always exactly one such item.',
      'Here you need to remember not just “have I seen it” but <b>how many times</b>. That’s what a <code>Map</code> is for: it stores “item → count” pairs.',
    ],
    tool: {
      name: 'Map: key and value',
      text: [
        'A <code>Map</code> keeps “key → value” pairs. <code>m.set(k, v)</code> stores, <code>m.get(k)</code> fetches the value for a key.',
        'If the key isn’t there yet, <code>get</code> returns <code>undefined</code>. That’s why a counter is written as <code>(m.get(x) ?? 0) + 1</code> — “what was there, or 0, plus one”.',
      ],
      code: 'const votes = new Map();\nfor (const name of ["fox", "wolf", "fox"]) {\n  votes.set(name, (votes.get(name) ?? 0) + 1);\n}\nvotes.get("fox");  // 2',
    },
    talk: [
      'To restore trade, I need to know what the animals buy most.',
      'Knowing whether we’ve seen it isn’t enough here. We need to count how many times. A chest of cells: on each cell, the goods and a number.',
    ],
    quip: 'So that’s it. And I thought everyone only bought my glory.',
    hints: ['You need a number for every item. Where do you keep it?', 'Walk goods and increase count for every item. Then find the key with the biggest number.', 'count.set(x, (count.get(x) ?? 0) + 1); then for (const [k, c] of count) — look for the biggest c.'],
    lesson: 'A Map counts in one pass: the key is what you saw, the value is how many times.',
    doc: ['The best seller', 'goods[i] is a sold item. Return the one that appears most often.'],
  },
  'forest.anagram': {
    title: 'The same things', topic: 'Map: counting up and down',
    brief: '<b>The same things.</b> Are two carts loaded with the same things, just in a different order?',
    statement: [
      'Two carts came to the fair. Every thing is marked with a letter: the string <code>s</code> is the first cart’s load, <code>t</code> the second’s.',
      'Return <code>true</code> if the carts hold the same things in the same amounts (order doesn’t matter), otherwise <code>false</code>. <code>"anagram"</code> and <code>"nagaram"</code> — yes, <code>"rat"</code> and <code>"car"</code> — no. The letters are lower-case Latin, as on LeetCode.',
      'Count every letter: add 1 for the first cart, subtract 1 for the second. If all the counters are zero at the end, the carts are the same.',
    ],
    tool: {
      name: 'a counter going up and down',
      text: [
        'One <code>Map</code> can count both ways: <code>+1</code> for every thing in the first cart, <code>-1</code> for every thing in the second.',
        'If every counter is 0 at the end, the amounts match. And if the lengths differ, you know the answer before you count.',
      ],
      code: 'const bal = new Map();\nbal.set("a", (bal.get("a") ?? 0) + 1);  // took one\nbal.set("a", (bal.get("a") ?? 0) - 1);  // gave one back\nbal.get("a");  // 0 — even',
    },
    talk: [
      'The bear says the badger swapped his cart. The badger says it’s the same load, just packed differently.',
      'Let’s count. Plus for the first cart, minus for the second. Whoever is lying, a non-zero will give them away.',
    ],
    quip: 'The badger is honest. The bear just packs carts badly.',
    hints: ['What do you need to know about every letter in both carts?', 'Different lengths — false straight away. Otherwise: +1 for the letters of s, −1 for the letters of t; all zeros — true.', 'for (i < s.length) { m.set(s[i], (m.get(s[i]) ?? 0) + 1); m.set(t[i], (m.get(t[i]) ?? 0) - 1); } check that every value is 0.'],
    lesson: 'You can compare contents without sorting: count one up, the other down, and see whether it all comes to zero.',
    doc: ['The same things', 'true if t is made of the same letters as s.'],
  },
  'forest.twosum': {
    title: 'Two animals', topic: 'Map: value → index',
    brief: '<b>Two animals.</b> Find two animals whose goods together cost exactly <code>target</code>. This time the row isn’t ordered.',
    statement: [
      'The animals stand along the road any old how: <code>nums[i]</code> is the price of animal <code>i</code>’s goods. You can’t rearrange them, they’d be offended.',
      'Return the numbers of two different animals <code>[i, j]</code>, counting from zero, in any order, whose prices add up to <code>target</code>. For <code>[2, 7, 11, 15]</code> and <code>target = 9</code> — <code>[0, 1]</code>. There is always exactly one answer.',
      'There can be up to 10,000 animals. Carthage’s two pointers won’t help: the row isn’t ordered. But you can remember who has stood where. For each animal ask: have we seen the one whose price makes up the rest of <code>target</code>?',
    ],
    tool: {
      name: 'Map: what I need → where I saw it',
      text: [
        'For every animal you know which price it lacks: <code>target - nums[i]</code>. The only question is whether such an animal has already come by.',
        'Keep a <code>Map</code> “price → index” of those you’ve passed. Ask <code>has</code> first and only then store the current one — so an animal never pairs with itself.',
      ],
      code: 'const where = new Map();\nwhere.set(40, 0);       // price 40 stands at place 0\nwhere.has(100 - 60);    // true: there is a pair for 60\nwhere.get(40);          // 0',
    },
    talk: [
      'A buyer wants exactly his sum — from two stalls. The animals stand wherever, and I won’t let anyone move them.',
      'And I’ll ask every pair! Every one with every other! Oh… why is everyone hiding?',
      'Because they remember you’re the Greedy one. Aeneas, for every animal we know whom it lacks. All that’s left is to remember whom we’ve already seen.',
    ],
    quip: 'They managed without me again. I’ll at least go and sniff those stalls.',
    hints: ['For an animal with price x — what price is missing to reach target?', 'Walk the row; for every animal check whether where already has target − nums[i]. If not, store nums[i] → i.', 'for (i) { const need = target - nums[i]; if (where.has(need)) return [where.get(need), i]; where.set(nums[i], i); }'],
    lesson: 'Don’t search for the pair — ask your memory: for each one you know whom it lacks, and a Map tells you instantly whether that one has been seen.',
    doc: ['Two animals', 'Return [i, j] (from zero) where nums[i] + nums[j] === target.'],
  },
  'forest.groups': {
    title: 'Animal families', topic: 'Map: a signature key',
    brief: '<b>Animal families.</b> Sort the words into groups: each group holds words made of the same letters.',
    statement: [
      'At the fair the animals sign up by families, but the scribe mixed up the letters in the names. Words made of the same letters are one family.',
      'Return an array of groups, where each group is an array of words with the same set of letters. For <code>["eat", "tea", "tan", "ate", "nat", "bat"]</code> that’s three groups: <code>["eat", "tea", "ate"]</code>, <code>["tan", "nat"]</code> and <code>["bat"]</code>. Order doesn’t matter.',
      'You need a <b>signature</b> that’s the same for the whole family. For example, the word’s letters in alphabetical order: <code>"eat"</code> and <code>"tea"</code> both give <code>"aet"</code>. The signature becomes a key in a <code>Map</code>.',
    ],
    tool: {
      name: 'a signature key',
      text: [
        'A key in a <code>Map</code> can be any string, even one you made yourself. If it’s the same for all “relatives”, the Map gathers them together by itself.',
        '<code>[...word].sort().join("")</code> — take the word apart into letters, put them in order and join them back. The value will be the array of the family’s words.',
      ],
      code: 'const fam = new Map();\nconst key = [..."tea"].sort().join("");  // "aet"\nfam.set(key, [...(fam.get(key) ?? []), "tea"]);\n[...fam.values()];  // [["tea"]]',
    },
    talk: [
      'The scribe has botched it again: “tea”, “eat”, “ate”… You can’t tell who is related to whom.',
      'Every family has the same set of letters. Let’s make a signature out of it, and the chest will sort everyone into cells by itself.',
    ],
    quip: 'Families together, the scribe has a day off. With no right of return.',
    hints: ['What is the same about the words of one family?', 'A word’s signature is its letters in alphabetical order. Put the word into the Map under its signature.', 'for (w of strs) { const k = [...w].sort().join(""); fam.set(k, [...(fam.get(k) ?? []), w]); }'],
    lesson: 'Come up with a key that’s the same for all “relatives”, and the Map will group them by itself.',
    doc: ['Animal families', 'Group words with the same set of letters. Order doesn’t matter.'],
  },
  'forest.topk': {
    title: 'Best-selling goods', topic: 'Map and sorting the totals',
    brief: '<b>Best-selling goods.</b> Find the <code>k</code> items that sell most often, so King Lion can restore trade.',
    statement: [
      'All the day’s sales at the fair are written down: <code>nums[i]</code> is the number of the sold item. King Lion wants to know the <code>k</code> best sellers.',
      'Return <code>k</code> different numbers that appear most often, in any order. For <code>[1, 1, 1, 2, 2, 3]</code> and <code>k = 2</code> — <code>[1, 2]</code>: 1 sold three times, 2 twice. In the tests the answer is always unambiguous.',
      'There can be up to 10,000 sales. For every item the Wolf recounts the whole fair from scratch. One pass is enough to count everything in a <code>Map</code>, then pick the <code>k</code> biggest.',
    ],
    tool: {
      name: 'sort the totals, not the fair',
      text: [
        'First one pass: a <code>Map</code> “goods → how many times”. Then you sort not the whole fair but a short list of totals.',
        '<code>[...count]</code> gives an array of <code>[goods, number]</code> pairs. <code>.sort((a, b) =&gt; b[1] - a[1])</code> puts the most frequent first, <code>.slice(0, k)</code> takes the first <code>k</code>.',
      ],
      code: 'const count = new Map([["honey", 3], ["cheese", 5], ["fish", 1]]);\n[...count]\n  .sort((a, b) => b[1] - a[1])\n  .slice(0, 2)\n  .map((p) => p[0]);   // ["cheese", "honey"]',
    },
    talk: [
      'The last thing. Tell me what the animals buy most often, and the fair will work again. And you, Mykyta, I’ll make chancellor for a minute.',
      'For every item I’ll walk the whole fair! I’ll count! Again! And again!',
      'Aeneas, one pass and the chest will know everything. And we’ll sort only a short list of totals, not the whole forest.',
    ],
    quip: 'The fair is working. Mykyta, you’re chancellor! …The minute is up. But thank you.',
    hints: ['What do you need to know about every item to pick the best sellers?', 'One pass — a Map “goods → how many”. Then sort the Map’s pairs by the number and take the first k.', 'for (x of nums) count.set(x, (count.get(x) ?? 0) + 1); return [...count].sort((a, b) => b[1] - a[1]).slice(0, k).map((p) => p[0]);'],
    lesson: 'First one pass into memory, then work with the totals: a fair of ten thousand records shrinks to a short list.',
    doc: ['Best-selling goods', 'Return the k numbers that appear in nums most often (any order).'],
  },
  'mitten.order': {
    title: 'Who gets out first', topic: 'a stack: push and pop',
    brief: '<b>Who gets out first.</b> Animals crawl into the mitten and out of it. Write down the order in which they came out.',
    statement: [
      'It’s cramped in the mitten: only the one by the entrance can get out, that is, the one who got in <b>last</b>. That’s how a <b>stack</b> works, like a pile of plates: you always take the top one.',
      'The array <code>ops</code> is what happened in turn: an animal’s name means “got in”, and <code>"-"</code> means “someone got out”. Return the names in the order the animals came out.',
      'For <code>["Mouse", "Frog", "-", "Bunny", "-", "-"]</code> that’s <code>["Frog", "Bunny", "Mouse"]</code>. In the tests nobody gets out of an empty mitten.',
    ],
    tool: {
      name: 'a stack: push and pop',
      text: [
        'A <b>stack</b> is an ordinary array you work with from one end only. <code>stack.push(x)</code> puts on top, <code>stack.pop()</code> takes the top one off and returns it.',
        'So the last one put in is the first one taken off. Just like in the mitten.',
      ],
      code: 'const plates = [];\nplates.push("blue");\nplates.push("red");\nplates.pop();   // "red" — put last\nplates.pop();   // "blue"',
    },
    talk: [
      'Help! They climb in wherever, and nobody lets anyone out! The mitten is about to burst!',
      'I got in first… and now I’m at the very bottom. Cold, cramped, and somebody’s sitting on my tail.',
      'Easy. Whoever got in last gets out first. Let’s write down how it went.',
    ],
    quip: 'Phew, that’s better! At least now it’s clear who’s after whom.',
    hints: ['Who is standing by the entrance of the mitten?', 'Keep a stack: a name — push, “-” — pop, and add whatever you took off to out.', 'for (op of ops) { if (op === "-") out.push(stack.pop()); else stack.push(op); }'],
    lesson: 'A stack is an array you work with only at the end: the last one put in is the first one taken out.',
    doc: ['Who gets out first', 'ops[i] is a name (got in) or "-" (someone got out).', 'Return the names in the order they came out.'],
  },
  'mitten.parens': {
    title: 'Did everyone get out properly', topic: 'a stack: matching brackets',
    brief: '<b>Did everyone get out properly.</b> Every bracket that opens must close with its own kind, and in the right order.',
    statement: [
      'The animals wrote their moves down as brackets: an opening bracket — got in, a closing one — got out. Different animals, different brackets: <code>()</code>, <code>[]</code>, <code>{}</code>.',
      'Return <code>true</code> if everyone who got in came out, and in the right order: a closing bracket must be the same kind as the <b>last</b> one still open. Otherwise <code>false</code>.',
      'For example, <code>"([])"</code> — yes, but <code>"([)]"</code> — no: the round one closed while the square one inside was still open. Keep the open brackets in a stack.',
    ],
    tool: {
      name: 'the top of the stack',
      text: [
        'The top element of a stack is <code>stack[stack.length - 1]</code>. And <code>stack.pop()</code> takes it off and returns it, so you can compare right away.',
        'It helps to keep the pairs at hand: the object <code>{ ")": "(", "]": "[", "}": "{" }</code> tells which opening bracket each closing one needs.',
      ],
      code: 'const pair = { ")": "(", "]": "[", "}": "{" };\nconst stack = ["(", "["];\nstack[stack.length - 1];   // "[" — the top\nstack.pop() === pair["]"]; // true',
    },
    talk: [
      'Someone got out before the one sitting on top of them! How is that even possible?!',
      'It isn’t, if everything is honest. Let’s check the records: every exit must match the last one who got in and hasn’t left yet.',
    ],
    quip: 'The records are honest. And the one who “got out earlier” was just sitting on me. I remember.',
    hints: ['What do you need to know at the moment a closing bracket arrives?', 'Put an opening bracket into the stack. A closing one must match the one on top; otherwise false. At the end the stack must be empty.', 'for (ch of s) { if (ch in pair) { if (stack.pop() !== pair[ch]) return false; } else stack.push(ch); } return stack.length === 0;'],
    lesson: 'A stack remembers who opened last: you check every closing only against the top.',
    doc: ['Did everyone get out properly', 'true if every bracket closes with its own kind and in the right order.'],
  },
  'mitten.min': {
    title: 'The smallest in the mitten', topic: 'a stack of minimums',
    brief: '<b>The smallest in the mitten.</b> Animals get in and out, and the Bear keeps asking who is the smallest right now.',
    statement: [
      'The animals are of different heights. <code>ops</code> is a log: a number means “an animal of that height got in”, <code>"-"</code> — “the top one got out”, and <code>"?"</code> — the question “what is the smallest height inside now?”.',
      'Return the answers to all the questions in order. For <code>["5", "3", "?", "7", "?", "-", "-", "?"]</code> that’s <code>[3, 3, 5]</code>. Nobody asks about an empty mitten or gets out of one.',
      'Going through the whole mitten for every question is slow. It’s craftier to remember, along with each animal, what the smallest was at that moment. When the top one leaves, the smallest among the rest is already written down under it.',
    ],
    tool: {
      name: 'a second stack — for minimums',
      text: [
        'Next to the stack of animals keep a stack <code>mins</code>: on every level, the smallest of everyone at that level or below.',
        'When an animal gets in, push the smaller of the two into <code>mins</code>: its height or the previous minimum. When it gets out, pop from both stacks. The answer to a question is the top of <code>mins</code>.',
      ],
      code: '// animals: [5, 3, 7]\n// mins:    [5, 3, 3]   ← on every level the smallest below\n// 7 leaves → mins [5, 3]: the smallest is still 3',
    },
    talk: [
      'The Bear wants to know who’s the smallest here. He says it’s so he knows whom not to sit on.',
      'If we go through everyone every time, the Bear will fall asleep. Let’s remember the smallest on every floor.',
    ],
    quip: 'The Bear is happy and crushed nobody. A good day.',
    hints: ['When an animal leaves, how do you know the smallest of the rest without going through anyone?', 'mins keeps the smallest on every level: push(min(x, top of mins)); "-" — pop from both; "?" — top of mins.', 'if (op === "?") out.push(mins[mins.length - 1]); else if (op === "-") { stack.pop(); mins.pop(); } else { const v = Number(op); stack.push(v); mins.push(mins.length ? Math.min(v, mins[mins.length - 1]) : v); }'],
    lesson: 'Whatever you can work out in advance for every level of a stack, you won’t have to search for later.',
    doc: ['The smallest in the mitten', 'ops[i] is a number (got in), "-" (the top one got out) or "?" (the smallest now).', 'Return the answers to every "?".'],
  },
  'mitten.rpn': {
    title: 'Mr Cat’s sum', topic: 'a stack for calculations',
    brief: '<b>Mr Cat’s sum.</b> The cat dictates the expression backwards: numbers first, then the operation. Work it out.',
    statement: [
      'Mr Cat dictates the sum in reverse Polish notation: <code>["2", "1", "+", "3", "*"]</code> means <code>(2 + 1) * 3 = 9</code>. Two numbers first, then the operation on them, and no brackets needed.',
      'Return the result. Operations: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>. Division is whole-number: drop the fraction towards zero, so 7 / 2 = 3, and −7 / 2 = −3. The tool shows how to write that.',
      'When an operation arrives, it takes the two <b>latest</b> numbers and puts the result in their place. Sounds like a stack: numbers go on, an operation takes the top two off.',
    ],
    tool: {
      name: 'a stack as scrap paper',
      text: [
        'Put numbers onto the stack. When an operation comes, take the top two off: first <code>b</code>, then <code>a</code> — and push back <code>a ⊕ b</code>.',
        'The order matters for <code>-</code> and <code>/</code>: the second number taken off is on the left. At the end one answer is left on the stack.',
      ],
      code: '// ["4", "13", "5", "/", "+"]\n// 4 → [4];  13 → [4, 13];  5 → [4, 13, 5]\n// "/" → b = 5, a = 13 → [4, 2]\n// "+" → [6]',
    },
    talk: [
      'Mr Cat is counting how much room everyone got. But he dictates it sort of backwards.',
      'It isn’t backwards, it’s the cat’s way. Every operation takes the two latest numbers. A stack will help us.',
    ],
    quip: 'The sum checks out. The cat even purred — and cats don’t purr for nothing.',
    hints: ['What do you do with a number, and what with an operation?', 'A number goes onto the stack. An operation — take off b, then a, push the result. At the end the answer is the only element on the stack.', 'if ("+-*/".includes(t) && t.length === 1) { const b = stack.pop(), a = stack.pop(); stack.push(compute a t b); } else stack.push(Number(t));'],
    lesson: 'A stack is scrap paper for calculations: an operation always takes what was put last.',
    doc: ['Mr Cat’s sum', 'tokens are numbers and operations + - * / in reverse Polish notation. Return the result.', 'Division is integer: Math.trunc(a / b).'],
  },
  'mitten.temps': {
    title: 'When it gets warmer', topic: 'a monotonic stack',
    brief: '<b>When it gets warmer.</b> For every day, find out how long to wait for a warmer one, so the animals can leave the mitten.',
    statement: [
      'Winter. The animals sit in the mitten waiting for warmth. <code>temperatures[i]</code> is the temperature on day <code>i</code>.',
      'Return an array where position <code>i</code> holds how many days later it will be <b>warmer</b> than on day <code>i</code>. If it never gets warmer — <code>0</code>. For <code>[73, 74, 75, 71, 69, 72, 76, 73]</code> that’s <code>[1, 1, 4, 2, 1, 1, 0, 0]</code>.',
      'There can be up to 10,000 days. For every day the Wolf looks ahead until he finds a warm one, and winters can be long. It’s craftier to keep the days still waiting for warmth in a stack: as soon as a warm day comes, it “answers” all the colder days on top of the stack.',
    ],
    tool: {
      name: 'a monotonic stack',
      text: [
        'Keep on the stack <b>the numbers of the days still waiting</b> for warmth. The temperatures on the stack go down: each next day on the stack is no warmer than the one before.',
        'When a warm day comes, it “answers” all the colder ones on top: take them off and write down how long they waited. Every day is pushed and popped only once.',
      ],
      code: '// t = [73, 74, 75, 71, 69, 72]\n// day 3 (71) and day 4 (69) wait on the stack\n// day 5 (72): 72 > 69 → day 4 waited 1\n//             72 > 71 → day 3 waited 2',
    },
    talk: [
      'When will it finally get warmer? We’re all sitting on each other’s heads in here!',
      'And I’ll stuff everything in and for every day look into the future until I find warmth! Oh… something’s creaking…',
      'That’s the mitten creaking because of you. Aeneas, let’s keep the days still waiting on a stack. A warm day will wake them up itself.',
    ],
    quip: 'Warmth is here! Out one at a time — whoever got in last goes first. Mouse, you’re last.',
    hints: ['Which days can today’s warm day “answer”?', 'The stack holds the numbers of days without an answer. While today is warmer than the day on top, pop it and write down the difference of the numbers. Then push today.', 'for (i) { while (stack.length && t[i] > t[stack[stack.length - 1]]) { const j = stack.pop(); answer[j] = i - j; } stack.push(i); }'],
    lesson: 'A monotonic stack keeps those still waiting for an answer: every new element answers all the weaker ones on top, and every day goes through the stack only once.',
    doc: ['When it gets warmer', 'For every day — how many days until it is warmer (or 0).'],
  },
  'konotop.search': {
    title: 'The captain’s house', topic: 'splitting in half',
    brief: '<b>The captain’s house.</b> The house numbers are written in ascending order. Find the house numbered <code>target</code> without visiting them all.',
    statement: [
      'Konotop is in a drought, and Captain Zabrokha hunts for culprits by checking everyone in turn. Let’s start small: the register <code>nums</code> holds house numbers <b>in ascending order</b>, without repeats.',
      'Return the position of <code>target</code> in the register, counting from zero, or <code>-1</code> if it isn’t there. For <code>[-1, 0, 3, 5, 9, 12]</code> and <code>9</code> it’s <code>4</code>.',
      'There can be up to 10,000 houses, and the world allows only a few dozen looks. Look in the middle: if the number there is less than <code>target</code>, the left half isn’t needed, and vice versa. Each time half drops away. This is <b>binary search</b>.',
    ],
    tool: {
      name: 'splitting in half',
      text: [
        'Keep boundaries <code>lo</code> and <code>hi</code> — where the answer can still be. Look at the middle <code>mid = Math.floor((lo + hi) / 2)</code>.',
        'If it holds less than you’re looking for, the answer is to the right: <code>lo = mid + 1</code>. If more, to the left: <code>hi = mid - 1</code>. Every time half drops away, so 14 looks are enough for 10,000 houses.',
      ],
      code: '// looking for 9 in [1, 3, 5, 7, 9, 11]\n// lo=0 hi=5 mid=2 → 5 < 9 → lo = 3\n// lo=3 hi=5 mid=4 → 9 — found!',
    },
    talk: [
      'A drought means witches! We’ll check everyone in turn, from the first house to the last.',
      'Captain, the register is in order. Let’s look in the middle — and half the houses can already be left alone.',
      'What do you mean, “split in half”? Well, go on, try.',
    ],
    quip: 'Fourteen looks for all of Konotop? Hm. And I had the whole pond ready.',
    hints: ['Look in the middle. What does it tell you about the left and right halves?', 'While lo ≤ hi: mid is the middle; found — return it; less — lo = mid + 1; more — hi = mid − 1.', 'while (lo <= hi) { const mid = Math.floor((lo + hi) / 2); if (nums[mid] === target) return mid; if (nums[mid] < target) lo = mid + 1; else hi = mid - 1; }'],
    lesson: 'On an ordered row, one look in the middle drops half: 10,000 houses — 14 looks.',
    doc: ['The captain’s house', 'nums is sorted ascending. Return the place of target or -1.'],
  },
  'konotop.insert': {
    title: 'A place in the rank', topic: 'where it would stand',
    brief: '<b>A place in the rank.</b> The Cossacks stand by height. Where should a newcomer stand so the rank stays even?',
    statement: [
      'The captain lines the Cossacks up by height: <code>nums</code> are the heights in ascending order, without repeats.',
      'If a Cossack of height <code>target</code> is already in the rank, return his position. If not, the position where he should stand so the order doesn’t break. For <code>[1, 3, 5, 6]</code>: <code>5</code> → <code>2</code>, and <code>2</code> → <code>1</code> (between 1 and 3).',
      'It’s the same binary search, except there’s always an answer: wherever the search stopped, that’s the place.',
    ],
    tool: {
      name: 'the boundary where the search stopped',
      text: [
        'Look for <b>the first place</b> where the height is not smaller than <code>target</code>. Boundaries: <code>lo = 0</code>, <code>hi = n</code> (you can stand past the end of the rank too).',
        'If the middle is smaller, the answer is to the right: <code>lo = mid + 1</code>. Otherwise it is here or to the left: <code>hi = mid</code>. When <code>lo</code> and <code>hi</code> meet, that’s the place.',
      ],
      code: '// [10, 20, 30, 40], the newcomer is 25\n// lo=0 hi=4 mid=2 → 30 ≥ 25 → hi = 2\n// lo=0 hi=2 mid=1 → 20 < 25 → lo = 2\n// lo = hi = 2: stand at place 2',
    },
    talk: [
      'A new Cossack has come! Stand… well, somewhere there. No, not there!',
      'Even if there’s no such height in the rank, splitting in half stops exactly where his place is.',
    ],
    quip: 'Standing nice and straight. Almost a pity to throw them in the pond.',
    hints: ['What if you look for the first place where the height is no longer smaller than target?', 'lo = 0, hi = n. While lo < hi: smaller in the middle — lo = mid + 1, otherwise hi = mid. The answer is lo.', 'while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (nums[mid] < target) lo = mid + 1; else hi = mid; } return lo;'],
    lesson: 'Splitting in half finds not just “is it there” but “where the boundary is”: the place where everything not smaller begins.',
    doc: ['A place in the rank', 'nums is sorted. Return the place of target, or where to insert it.'],
  },
  'konotop.barrel': {
    title: 'The first bad barrel', topic: 'the first “yes”',
    brief: '<b>The first bad barrel.</b> The barrels in the cellar stand in a row: good ones first, then spoiled ones. Find the first spoiled one.',
    statement: [
      'A witch put a hex on the captain’s cellar: from some barrel on, the cabbage turned sour, and every barrel after it is spoiled too. <code>barrels[i]</code> is <code>true</code> if barrel <code>i</code> is spoiled, and <code>false</code> if it’s good.',
      'Return the number of the first spoiled barrel, counting from zero. For <code>[false, false, false, true, true]</code> — <code>3</code>. There is always at least one spoiled barrel.',
      'The row always looks like “no, no, …, yes, yes”. The same binary search finds the boundary between “no” and “yes”: look in the middle and you know which half the boundary is in.',
    ],
    tool: {
      name: 'finding the “no → yes” boundary',
      text: [
        'If the middle barrel is spoiled, the first spoiled one is here or to the left: <code>hi = mid</code>. If it is good, it is surely to the right: <code>lo = mid + 1</code>.',
        'While <code>lo &lt; hi</code>, the boundaries close in. When they meet, <code>lo</code> points at the first “yes”.',
      ],
      code: '// [F, F, F, T, T]\n// lo=0 hi=4 mid=2 → F → lo = 3\n// lo=3 hi=4 mid=3 → T → hi = 3\n// lo = hi = 3',
    },
    talk: [
      'The cabbage has gone sour! Open every barrel in turn and sniff each one!',
      'My nose won’t last long in your cellar. Let’s open the middle one: if it’s sour, all after it are too, and we look to the left.',
    ],
    quip: 'Found it after opening just a few barrels. My nose survived, though it smells a bit of cabbage.',
    hints: ['What does a spoiled barrel in the middle tell you about the barrels to its right?', 'While lo < hi: the middle is spoiled — hi = mid, good — lo = mid + 1. The answer is lo.', 'while (lo < hi) { const mid = Math.floor((lo + hi) / 2); if (barrels[mid]) hi = mid; else lo = mid + 1; } return lo;'],
    lesson: 'Any “first no, then yes” is searched in halves: the boundary is found in log n looks.',
    doc: ['The first bad barrel', 'barrels[i] is true if the barrel is spoiled. All after the first spoiled one are spoiled too.', 'Return the number of the first spoiled one.'],
  },
  'konotop.rotated': {
    title: 'The shifted register', topic: 'halving a shifted row',
    brief: '<b>The shifted register.</b> The witch twisted the register: the ordered row was shifted round. Find house <code>target</code>.',
    statement: [
      'The register is ordered again, but the witch cut off a piece and moved it to the front: <code>[0, 1, 2, 4, 5, 6, 7]</code> became <code>[4, 5, 6, 7, 0, 1, 2]</code>.',
      'Return the position of <code>target</code>, or <code>-1</code> if it isn’t there. The numbers don’t repeat. For this row and <code>0</code> the answer is <code>4</code>.',
      'Even though the row is shifted, when you split it in half <b>one of the halves is always in order</b>. Check whether <code>target</code> falls inside it, and drop the half where it certainly isn’t.',
    ],
    tool: {
      name: 'which half is straight',
      text: [
        'If <code>nums[lo] &lt;= nums[mid]</code>, the left half is in order. Then, if <code>target</code> is between <code>nums[lo]</code> and <code>nums[mid]</code>, search to the left, otherwise to the right.',
        'Otherwise the right half is in order — and you check in the same way whether <code>target</code> is between <code>nums[mid]</code> and <code>nums[hi]</code>.',
      ],
      code: '// [4, 5, 6, 7, 0, 1, 2], looking for 0\n// mid = 3 (7): the left [4..7] is straight, 0 is not in it → right\n// lo = 4: [0, 1, 2] — ordinary splitting in half',
    },
    talk: [
      'The register is ruined! Half the houses at the start, half at the end. Now we’ll surely have to check everyone.',
      'Oh, my method! In turn! Everyone! Into the pond!',
      'Not so fast. Cut the row in half: at least one half is straight. See whether what we’re looking for is in it — and you drop half again.',
    ],
    quip: 'Well, there. And I’d already taken off my hat to dive in.',
    hints: ['Cut the row in the middle. Which of the two halves is surely without the shift?', 'If nums[lo] ≤ nums[mid] — the left is straight: target in [nums[lo], nums[mid]) → hi = mid − 1, otherwise lo = mid + 1. Otherwise the right is straight — likewise.', 'if (nums[lo] <= nums[mid]) { if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1; } else { if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1; }'],
    lesson: 'Splitting in half works as long as you can tell which half holds the answer. Even in a shifted row one half is always straight.',
    doc: ['The shifted register', 'nums is an ordered row shifted round. Return the place of target or -1.'],
  },
  'konotop.pies': {
    title: 'The Wolf and the pies', topic: 'halving the answer',
    brief: '<b>The Wolf and the pies.</b> What’s the slowest speed at which the Wolf can eat all the pies before the captain returns?',
    statement: [
      'While the captain chases witches, the Wolf has got into his pantry. <code>piles[i]</code> is how many pies are in bowl <code>i</code>. The captain returns in <code>h</code> hours.',
      'In an hour the Wolf eats at most <code>k</code> pies, and only from one bowl. If the bowl has fewer, he finishes it and rests for the rest of the hour. Return the smallest <code>k</code> with which he manages everything in <code>h</code> hours. For <code>[3, 6, 7, 11]</code> and <code>h = 8</code> — <code>4</code>.',
      'Trying <code>k</code> = 1, 2, 3… takes long. But notice: at a low speed the Wolf doesn’t make it, at a high speed he does. Again “first no, then yes”, so binary search can look for <b>the answer itself</b>.',
    ],
    tool: {
      name: 'halving the answer',
      text: [
        'Sometimes you halve not the array but <b>the possible answers</b>. The speed is from 1 to the biggest bowl. For a middle speed, count the hours: <code>Math.ceil(p / k)</code> for every bowl.',
        'He manages — try slower (<code>hi = mid</code>); he doesn’t — faster (<code>lo = mid + 1</code>). Every check is one pass over the bowls, and there are only log(max) checks.',
      ],
      code: '// piles = [3, 6, 7, 11], h = 8\n// k = 6: 1 + 1 + 2 + 2 = 6 h ≤ 8 → slower\n// k = 3: 1 + 2 + 3 + 4 = 10 h > 8 → faster\n// k = 4: 1 + 2 + 2 + 3 = 8 h — the smallest',
    },
    talk: [
      'Pies! A whole pantry! The captain is back in a few hours — I’ll manage if I eat properly.',
      'And what is “properly”? What’s the slowest speed you’ll manage at? Faster and your belly will ache.',
      'I’ll check! Speed one, two, three, four… until it works.',
      'Aeneas, and we’ll split the speed itself in half. “Manages or not” is the same “no → yes” boundary.',
    ],
    quip: 'Exactly as much as needed, and not a pie more. A shame, but filling.',
    hints: ['If the Wolf manages at speed k, will he manage at k + 1?', 'lo = 1, hi = the biggest bowl. While lo < hi: mid; hours = sum of Math.ceil(p / mid); manages — hi = mid, not — lo = mid + 1.', 'while (lo < hi) { const mid = Math.floor((lo + hi) / 2); let hours = 0; for (p of piles) hours += Math.ceil(p / mid); if (hours <= h) hi = mid; else lo = mid + 1; }'],
    lesson: 'If an answer can be checked and “fits” comes after “doesn’t fit”, search the answer itself in halves.',
    doc: ['The Wolf and the pies', 'piles[i] is the pies in bowl i, h the hours. Return the smallest speed k', 'at which the Wolf eats everything in h hours (up to k from one bowl per hour).'],
  },
  'sicily.laps': {
    title: 'The best k laps', topic: 'a fixed-size window',
    brief: '<b>The best k laps.</b> Find the biggest sum of points over <code>k</code> laps of the race in a row.',
    statement: [
      'At Acestes’s games the chariots race lap after lap. <code>laps[i]</code> is the points scored on lap <code>i</code>. The scoreboard is broken, and the best stretch has to be found.',
      'Return the biggest sum of points over <code>k</code> laps <b>in a row</b>. For <code>[3, 1, 4, 1, 5, 9, 2, 6]</code> and <code>k = 3</code>: the best is 5 + 9 + 2 = <code>16</code>.',
      'There can be up to 10,000 laps, and <code>k</code> can be a thousand. For every stretch the Wolf adds up all <code>k</code> laps from scratch. But neighbouring stretches differ by only two laps: one joins on the right, one leaves on the left. This is a <b>sliding window</b>.',
    ],
    tool: {
      name: 'a sliding window',
      text: [
        'Add up the first window of <code>k</code> laps. Then <b>slide</b> it by one lap: add the lap that came in on the right and subtract the one that left on the left.',
        'This way every lap is added once and subtracted once, however big the window is.',
      ],
      code: '// laps = [3, 1, 4, 1, 5], k = 3\n// [3 1 4] 1 5   sum 8\n// 3 [1 4 1] 5   8 - 3 + 1 = 6\n// 3 1 [4 1 5]   6 - 1 + 5 = 10',
    },
    talk: [
      'Games in honour of Anchises! But the scoreboard is broken. Who drove the best laps?',
      'I’m judging. Aeneas, don’t add up every stretch from zero: slide the frame by one lap — add one, subtract one.',
    ],
    quip: 'That’s where they raced fastest! Now at least we know who gets the wreath.',
    hints: ['How do two neighbouring stretches of k laps differ?', 'The sum of the first window; then for every i from k: sum += laps[i] − laps[i − k], update the best.', 'for (i < k) sum += laps[i]; let best = sum; for (i = k; i < n; i++) { sum += laps[i] - laps[i - k]; best = Math.max(best, sum); }'],
    lesson: 'A sliding window doesn’t recount: the new comes in, the old goes out, and the rest of the sum is ready.',
    doc: ['The best k laps', 'laps[i] is the points for lap i. Return the biggest sum over k laps in a row.'],
  },
  'sicily.boat': {
    title: 'A boat for sale', topic: 'the best so far',
    brief: '<b>A boat for sale.</b> Boat prices change every day. When to buy and when to sell to earn the most?',
    statement: [
      'Mykyta decided to make money at the boat races. <code>prices[i]</code> is the price of a boat on day <code>i</code>.',
      'You can buy once and sell once, <b>after</b> buying. Return the biggest profit, that is, the selling price minus the buying price. For <code>[7, 1, 5, 3, 6, 4]</code>: buy at 1, sell at 6, profit <code>5</code>. If prices only fall, return <code>0</code>.',
      'There can be up to 10,000 days. The Wolf tries every pair of days. It’s enough to go through the days in turn and remember the cheapest day so far.',
    ],
    tool: {
      name: 'the best so far',
      text: [
        'Going through the days, keep <code>minPrice</code> — the lowest price among the days already passed. Selling today pays best if you bought exactly then.',
        'So for every day: the profit is <code>price - minPrice</code>, update the best, then update <code>minPrice</code>. One pass.',
      ],
      code: '// prices = [7, 1, 5, 3, 6, 4]\n// day 1: min = 1\n// day 4: 6 - 1 = 5 — the best',
    },
    talk: [
      'Boats get cheaper and dearer every day. I want to buy low and sell high. A fox’s business!',
      'And I’ll check every pair of days! Buy here, sell there, and there, and there…',
      'You haven’t even finished the first day, and I already know: it’s enough to remember the cheapest day behind us.',
    ],
    quip: 'Bought low, sold high. Acestes says it isn’t a sport. I say it’s quite a sport.',
    hints: ['If you sell today, when was the best time to buy?', 'Keep minPrice — the lowest price before today. best = max(best, price − minPrice); then update minPrice.', 'let minPrice = Infinity; for (p of prices) { best = Math.max(best, p - minPrice); minPrice = Math.min(minPrice, p); }'],
    lesson: 'You don’t need to search all pairs for the best one: it’s enough to remember the best of what is already behind you.',
    doc: ['A boat for sale', 'prices[i] is the price on day i. Return the biggest profit (buy earlier, sell later) or 0.'],
  },
  'sicily.song': {
    title: 'A song without repeats', topic: 'a window of changing size',
    brief: '<b>A song without repeats.</b> Find the longest stretch of a song where no note repeats.',
    statement: [
      'The singers compete in improvisation. The song is written as letter-notes in the string <code>s</code>. The judges look for the longest stretch <b>in a row</b> where all the notes are different.',
      'Return the length of that stretch. For <code>"abcabcbb"</code> it’s <code>3</code> (for example, <code>"abc"</code>), for <code>"bbbbb"</code> — <code>1</code>.',
      'Here the window stretches: add the next note on the right, and if it’s already in the window, drop notes on the left until the repeat is gone. A <code>Set</code> is handy for what’s in the window.',
    ],
    tool: {
      name: 'a window that stretches and shrinks',
      text: [
        'Two boundaries: <code>left</code> and <code>right</code>. <code>right</code> moves one note ahead each time. Keep what’s in the window in a <code>Set</code>.',
        'If the new note is already in the window, move <code>left</code> and throw notes out of the <code>Set</code> until the repeat is gone. The window length is <code>right - left + 1</code>.',
      ],
      code: '// s = "abcabcbb"\n// [abc]abcbb       — 3, then an "a" came\n// a[bca]bcbb       — threw out the old "a"\n// longest without repeats: 3',
    },
    talk: [
      'The singers sing on and on, and the judges argue: whose song went longest without repeating?',
      'A frame can not only slide but stretch and shrink too. A new note — on the right; a repeat — we throw out on the left.',
    ],
    quip: 'The winner is the one who didn’t repeat himself. A pity this rule can’t be applied to speeches.',
    hints: ['What do you do when the note that came on the right is already in the window?', 'right moves forward; while s[right] is in the Set — delete s[left] and left++; then add s[right] and update best.', 'for (right) { while (inWindow.has(s[right])) inWindow.delete(s[left++]); inWindow.add(s[right]); best = Math.max(best, right - left + 1); }'],
    lesson: 'An elastic window: it grows on the right and shrinks on the left when the rule is broken. Every note comes in and goes out only once.',
    doc: ['A song without repeats', 'Return the length of the longest stretch of s in a row where all characters differ.'],
  },
  'sicily.fight': {
    title: 'The fist fight', topic: 'a heap: the biggest first',
    brief: '<b>The fist fight.</b> Each time the two strongest fight. Who’s left at the end, and how strong?',
    statement: [
      'A fist fight at Acestes’s games. <code>stones[i]</code> is the strength of fighter <code>i</code>. Each time <b>the two strongest</b> enter the arena.',
      'If their strengths are equal, both drop out. If not, the weaker drops out and the stronger stays, but with strength reduced by the opponent’s: 8 against 7 leaves 1. Return the strength of the last fighter, or <code>0</code> if nobody is left. For <code>[2, 7, 4, 1, 8, 1]</code> — <code>1</code>.',
      'Finding the two strongest from scratch every time is slow. That’s what a <b>heap</b> (a priority queue) is for: it always keeps the biggest ready. The tool shows how to use it.',
    ],
    tool: {
      name: 'a heap (a priority queue)',
      text: [
        '<code>MaxPriorityQueue</code> is a heap: <code>enqueue(x)</code> puts in, <code>dequeue()</code> takes out the <b>biggest</b>, <code>size()</code> says how many are left. There is also <code>MinPriorityQueue</code> — for the smallest.',
        'Putting in and taking out take log n steps, not a search through everyone. The same classes exist on LeetCode for JavaScript and TypeScript.',
      ],
      code: 'const heap = new MaxPriorityQueue();\nheap.enqueue(4); heap.enqueue(9); heap.enqueue(2);\nheap.dequeue();   // 9\nheap.size();      // 2',
    },
    talk: [
      'A fist fight! By the rules the two strongest fight each time. Only nobody can tell who they are right now.',
      'And I’ll look over everyone each time and search for the strongest. Slow? But honest!',
      'A heap keeps the strongest on top by itself. Take two — and the fight begins.',
    ],
    quip: 'I’d enter the arena myself. But everyone there is so… strongest.',
    hints: ['What do you need at hand at every step of the fight?', 'Put everyone into a MaxPriorityQueue. While more than one fighter is left: take two; if different, put back the difference.', 'for (s of stones) heap.enqueue(s); while (heap.size() > 1) { const a = heap.dequeue(), b = heap.dequeue(); if (a !== b) heap.enqueue(a - b); } return heap.size() ? heap.dequeue() : 0;'],
    lesson: 'A heap always keeps the biggest (or smallest) ready: putting in and taking out cost log n, not a search.',
    doc: ['The fist fight', 'Each time the two strongest fight. Return the strength of the last one or 0.'],
  },
  'sicily.board': {
    title: 'The live scoreboard', topic: 'a heap of size k',
    brief: '<b>The live scoreboard.</b> After every new result the board shows the <code>k</code>-th best. Bring Acestes’s scoreboard back to life.',
    statement: [
      'The winners’ board. <code>nums</code> are the results already there, <code>adds</code> are new ones arriving one at a time. After each new result the board must show the <code>k</code>-th largest result among all so far.',
      'Return an array of these numbers, one after every new result. For <code>k = 3</code>, <code>nums = [4, 5, 8, 2]</code> and the first new <code>3</code>: the results are 8, 5, 4, 3, 2, and the third largest is <code>4</code>. There are always at least <code>k</code> results on the board.',
      'There can be up to 10,000 results. After each one the Wolf re-sorts the whole table. You only need the <code>k</code> best in a heap with the smallest of them on top: that one is the answer.',
    ],
    tool: {
      name: 'a heap of the k best',
      text: [
        'Keep a <code>MinPriorityQueue</code> of exactly <code>k</code> best results. On its top is the smallest of the best — which is exactly the <code>k</code>-th largest.',
        'A new result: put it in, and if the heap now holds more than <code>k</code>, throw out the smallest. The answer is <code>heap.front()</code>.',
      ],
      code: '// k = 3, the heap holds [4, 5, 8]  → front = 4\n// 10 arrives → [4, 5, 8, 10] → threw out 4\n// now [5, 8, 10]              → front = 5',
    },
    talk: [
      'The scoreboard! Bring it back to life, and the games will have winners again. But the results keep coming and coming.',
      'After every result I’ll re-sort the whole table! From best to worst! Again! And again!',
      'Why the whole table? The board shows the k-th best. Keep only the k best in a heap — the smallest of them is the answer.',
    ],
    quip: 'The scoreboard lives! Anchises would be proud. And you, Mykyta, get the judge’s wreath. Not a bet!',
    hints: ['How many results do you really need to remember to know the k-th best?', 'A MinPriorityQueue of the k best: put the new one in, and if size() > k — dequeue(). The answer is front().', 'const add = (x) => { heap.enqueue(x); if (heap.size() > k) heap.dequeue(); }; nums.forEach(add); for (x of adds) { add(x); out.push(heap.front()); }'],
    lesson: 'To know the k-th best you don’t need to keep everyone: a heap of the k best gives the answer from its top.',
    doc: ['The live scoreboard', 'After every number in adds, return the k-th largest among nums and those already added.'],
  },
  'chumak.walk': {
    title: 'How much salt in the train', topic: 'walking a list',
    brief: '<b>How much salt in the train.</b> The carts are hooked to one another. Walk the train from the first cart to the last and count the salt.',
    statement: [
      'The chumaks carry salt from Crimea. A train is carts, each hooked to the next. Such a chain is called a <b>linked list</b>. Each cart has <code>node.val</code> — how many sacks of salt it carries — and <code>node.next</code> — the next cart, or <code>null</code> if this one is last.',
      'You’re given only the first cart — <code>head</code>. Return how much salt the whole train carries. For the train 5 → 3 → 8 that’s <code>16</code>. If there’s no train (<code>head</code> is <code>null</code>), return <code>0</code>.',
      'There are no indices here as in an array: you reach the fifth cart only by going through the four before it. So walk like this: “while there’s a cart — add its salt and move to <code>next</code>”.',
    ],
    tool: {
      name: 'a linked list',
      text: [
        'Every node knows only its value <code>val</code> and the next node <code>next</code>. To walk the list, keep a variable <code>node</code> and move on: <code>node = node.next</code>.',
        'When <code>node</code> becomes <code>null</code>, the carts have run out. Hence the loop condition: <code>while (node)</code>.',
      ],
      code: 'let node = head;\nwhile (node) {\n  console.log(node.val);   // what this cart carries\n  node = node.next;        // on to the next one\n}',
    },
    talk: [
      'Moooo. Third night we wander the steppe, and nobody knows how much salt we carry. Every cart remembers only the one in front.',
      'And that’s all we need. From the first cart to the next, from the next onwards, until the carts run out.',
    ],
    quip: 'So much salt! Now at least I know why it’s so heavy.',
    hints: ['How do you get from the first cart to the second?', 'node = head; while node is not null: add node.val and move to node.next.', 'for (let node = head; node; node = node.next) total += node.val;'],
    lesson: 'A linked list is walked from the head, step by step through next, until null comes.',
    doc: ['How much salt in the train', 'node.val — salt on the cart, node.next — the next cart or null.', 'Return the total over all carts.'],
  },
  'chumak.reverse': {
    title: 'Back to Crimea', topic: 're-hooking the links',
    brief: '<b>Back to Crimea.</b> Reverse the train: now every cart must be hooked to the one that was behind it.',
    statement: [
      'The chumaks forgot their kobza in Crimea and have to go back. The train must be reversed: the last cart becomes the first. 1 → 2 → 3 → 4 → 5 must become 5 → 4 → 3 → 2 → 1.',
      'Re-hook the <code>next</code> of every cart to the previous one and return the new head, that is, the former last cart. Don’t create new carts, just re-hook.',
      'There’s one danger: as soon as you re-hook <code>next</code>, you lose the way forward. So first save who’s ahead in a variable, then re-hook.',
    ],
    tool: {
      name: 'three pointers: prev, node, next',
      text: [
        '<code>prev</code> is the part already reversed, <code>node</code> the current cart. At every step: remember <code>next = node.next</code>, re-hook <code>node.next = prev</code>, then move both forward.',
        'When <code>node</code> becomes <code>null</code>, <code>prev</code> is the new head.',
      ],
      code: '// 1 → 2 → 3          prev = null, node = 1\n// null ← 1   2 → 3   prev = 1,    node = 2\n// null ← 1 ← 2   3   prev = 2,    node = 3\n// null ← 1 ← 2 ← 3   prev = 3 — the new head',
    },
    talk: [
      'Moooo! We left the kobza in Crimea! Turn the train around, but carefully: the carts are hooked to one another.',
      'Re-hook them one at a time. But first remember who’s ahead — unhook it, and half the train is lost.',
    ],
    quip: 'We turned around and lost nobody. And the kobza — there it is, on the first cart.',
    hints: ['What happens to the rest of the train if you write node.next = prev straight away?', 'While node: next = node.next; node.next = prev; prev = node; node = next. Return prev.', 'while (node) { const next = node.next; node.next = prev; prev = node; node = next; } return prev;'],
    lesson: 'Before re-hooking a link, remember where it led: prev, node and next — and the list is reversed without a single new node.',
    doc: ['Back to Crimea', 'Reverse the list and return the new head. Don’t create new nodes.'],
  },
  'chumak.middle': {
    title: 'The middle cart', topic: 'slow and fast',
    brief: '<b>The middle cart.</b> Find the cart in the middle of the train without counting its length first.',
    statement: [
      'The ataman rides on the middle cart: from there he sees both the head and the tail of the train. But nobody knows how many carts there are.',
      'Return the middle cart. For 1 → 2 → 3 → 4 → 5 it’s cart <code>3</code>. If the number of carts is even, there are two middle ones: return the <b>second</b>, for 1 → 2 → 3 → 4 → 5 → 6 that’s <code>4</code>.',
      'You could count the carts first and then walk half. Or do it in one pass: the ox walks one cart at a time, the fox two. When the fox reaches the end, the ox is right in the middle.',
    ],
    tool: {
      name: 'slow and fast',
      text: [
        'Two pointers start at the head: <code>slow</code> takes one step (<code>slow.next</code>), <code>fast</code> two (<code>fast.next.next</code>).',
        'When the fast one reaches the end, the slow one has walked exactly half. The loop runs while <code>fast</code> and <code>fast.next</code> are not <code>null</code>.',
      ],
      code: '// 1 → 2 → 3 → 4 → 5\n// slow: 1, 2, 3\n// fast: 1, 3, 5 — nowhere further\n// slow on 3 — the middle',
    },
    talk: [
      'The ataman asks where the middle of the train is. But I’m slow; to the end and back would take me till morning.',
      'Let’s walk together: you one cart at a time, me two. When I reach the tail, you’ll be right in the middle.',
    ],
    quip: 'Slow, but got where I needed to. Moooo — that was proudly.',
    hints: ['If one walks twice as fast, where is the other when the first reaches the end?', 'While fast and fast.next: slow = slow.next; fast = fast.next.next. Return slow.', 'while (fast && fast.next) { slow = slow.next; fast = fast.next.next; } return slow;'],
    lesson: 'Slow and fast pointers find the middle in one pass: when the fast one is at the end, the slow one is in the middle.',
    doc: ['The middle cart', 'Return the middle node (of two middles — the second).'],
  },
  'chumak.merge': {
    title: 'Two trains into one', topic: 'a dummy head',
    brief: '<b>Two trains into one.</b> Merge two trains ordered by weight into one, also ordered.',
    statement: [
      'Two trains met at the crossing, <code>list1</code> and <code>list2</code>. In each, the carts go from lighter to heavier.',
      'Re-hook the carts into one train, also from lighter to heavier, and return its head. 1 → 2 → 4 and 1 → 3 → 4 give 1 → 1 → 2 → 3 → 4 → 4. Don’t create new carts, just re-hook.',
      'Each time compare the front carts of both trains and hook on the lighter. It’s handy to start with a <b>dummy</b> cart: it holds the head’s place, and at the end you just unhook it.',
    ],
    tool: {
      name: 'a dummy head',
      text: [
        'Create an empty cart <code>new ListNode(0)</code> and a variable <code>tail</code> pointing at the end of the train collected so far.',
        'At every step pick the lighter of the two front carts, hook it to <code>tail</code> and move <code>tail</code>. When one train runs out, hook the rest of the other whole. The answer is <code>dummy.next</code>.',
      ],
      code: '// dummy → (empty)\n// list1: 1 → 4   list2: 2 → 3\n// dummy → 1 → 2 → 3 → 4\n// the answer: dummy.next',
    },
    talk: [
      'Two trains at one crossing! Who goes first? Who’s heavier? Moooo, we’ll lock horns.',
      'We put an empty cart at the head and each time hook the lighter of the two front ones. The tail of the other train — in one go.',
    ],
    quip: 'One train, lighter to heavier. The crossing has never been so calm.',
    hints: ['Which cart should come next in the collected train?', 'While both trains are there: hook the lighter of list1 and list2 to tail, move its train and tail. Then hook the rest.', 'while (list1 && list2) { if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; } else { tail.next = list2; list2 = list2.next; } tail = tail.next; } tail.next = list1 ?? list2;'],
    lesson: 'A dummy head removes the special case of “what’s at the start”: hook onto the tail, and the answer is dummy.next.',
    doc: ['Two trains into one', 'list1 and list2 are ordered. Merge them into one ordered list.'],
  },
  'chumak.cycle': {
    title: 'A train in a circle', topic: 'the ox and the fox: will they meet',
    brief: '<b>A train in a circle.</b> Prove the train is going round in a circle: its tail is hooked to one of the carts ahead.',
    statement: [
      'A shard mixed up the links: the last cart seems to be hooked to someone in the middle, and the train has been circling the steppe for the third night.',
      'Return <code>true</code> if, following <code>next</code>, you can come back to a cart you’ve already visited (that is, there’s a circle). Return <code>false</code> if the train ends and you reach <code>null</code>.',
      'There can be up to 10,000 carts. For every cart the Wolf checks whether he’s seen it before by walking everything from the start. It’s craftier to send the ox and the fox on the road: the fox walks twice as fast. If there’s a circle, sooner or later the fox catches the ox from behind.',
    ],
    tool: {
      name: 'the ox and the fox (Floyd’s algorithm)',
      text: [
        'The slow <code>slow</code> goes one cart at a time, the fast <code>fast</code> two. If the train has an end, the fast one reaches <code>null</code>.',
        'But if the train is a circle, the fast one catches up with the slow one from the other side of the loop — and they end up on the same cart: <code>slow === fast</code>.',
      ],
      code: '// 1 → 2 → 3 → 4 ┐\n//     └─────────┘   (4 is hooked to 2)\n// slow: 1, 2, 3, 4\n// fast: 1, 3, 2, 4 — met on 4: a circle!',
    },
    talk: [
      'Moooo… This well again. Or is it a different one? I think we’re going in circles, but I’m not sure.',
      'I’ll check! For every cart I’ll walk the train from the start and see whether I’ve seen it. I’ll be done soon. Well, some day.',
      'Ox, let’s go: you one cart at a time, me two. If we meet, it’s a circle. If I reach the end, it isn’t.',
    ],
    quip: 'We met! So it’s a circle. Now we re-hook the tail — and home, to Crimea. Moooo!',
    hints: ['What happens to someone walking twice as fast if the road is closed into a loop?', 'slow — one at a time, fast — two. While fast and fast.next: take the steps; if slow === fast — true. Left the loop — false.', 'while (fast && fast.next) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true; } return false;'],
    lesson: 'Slow and fast pointers on a loop are bound to meet: a cycle is found in O(n) steps and without any memory of the road.',
    doc: ['A train in a circle', 'true if the list has a cycle.'],
  },
  'hell.descent': {
    title: 'Down and back', topic: 'recursion: the base case',
    brief: '<b>Down and back.</b> Go down through every circle of hell to Anchises and come back the same way. Write down the road.',
    statement: [
      'The Sibyl leads Aeneas to his father. <code>circles</code> are the circles of hell from top to bottom, and Anchises waits at the very bottom.',
      'Return the road: the circles going down in order, then the same circles going back up. For <code>["Limbo", "Fire"]</code> that’s <code>["Limbo", "Fire", "Fire", "Limbo"]</code>.',
      'Write it with <b>recursion</b>: that’s when a function calls itself. The function goes down one circle and calls itself for the rest. The way back appears by itself as the calls return one after another.',
    ],
    tool: {
      name: 'recursion',
      text: [
        'A recursive function calls itself for a smaller problem. It must have a <b>base case</b> — when no more calls are needed (the bottom of hell). Without it the calls never end.',
        'Whatever is written <b>before</b> the call happens on the way down; whatever is <b>after</b> — on the way back, when the deeper calls have returned.',
      ],
      code: 'function count(n) {\n  if (n === 0) return [];          // the bottom: base case\n  return [n, ...count(n - 1), n];  // down — and back\n}\ncount(2);  // [2, 1, 1, 2]',
    },
    talk: [
      'Hell is like a well: every circle leads to the next, and at the bottom your father waits. We’ll go down one circle at a time.',
      'And back? I don’t remember roads, I have paws.',
      'The descent itself will remember. Every step down waits until the deeper one returns — and leads us up.',
    ],
    quip: 'Son! You reached the very bottom — and know the way back. That’s recursion: what matters is knowing where to stop.',
    hints: ['What do you return when there are no circles left?', 'go(i): if i is the end, return []. Otherwise [circle i, …go(i + 1), circle i].', 'const go = (i) => (i === circles.length ? [] : [circles[i], ...go(i + 1), circles[i]]);'],
    lesson: 'Recursion = a base case + a step that reduces the problem to a smaller one. Before the call — on the way down, after it — on the way back.',
    doc: ['Down and back', 'Return the circles going down, then the same circles going back up.'],
  },
  'hell.boats': {
    title: 'Charon’s boat', topic: 'greedy: the heaviest with the lightest',
    brief: '<b>Charon’s boat.</b> The boat takes at most two souls and has a weight limit. What’s the fewest number of trips?',
    statement: [
      'Charon ferries souls across the river Styx. <code>people[i]</code> is the weight of soul <code>i</code>, <code>limit</code> is what the boat can carry. At most two at a time.',
      'Return the fewest trips needed to ferry everyone. Every soul fits on its own for sure. For <code>[3, 2, 2, 1]</code> and <code>limit = 3</code> — <code>3</code> trips: (1 and 2), (2), (3).',
      'There can be up to 10,000 souls. Remember the trick from Carthage: order the souls by weight and seat the heaviest with the lightest if they fit. If they don’t, the heaviest goes alone.',
    ],
    tool: {
      name: 'sorting + two pointers',
      text: [
        'Sort <code>people</code>. The heaviest soul <code>people[j]</code> sails in any case; the only question is whether it takes the lightest <code>people[i]</code> along.',
        'They fit together — both pointers move. Not — the heaviest sails alone. A trip is counted either way.',
      ],
      code: '// [1, 2, 2, 3], limit = 3\n// 3 + 1 > 3 → 3 alone          (trip 1)\n// 2 + 1 ≤ 3 → 2 and 1 together (trip 2)\n// 2 alone                      (trip 3)',
    },
    talk: [
      'A boat for two, and the weight is limited. Who rows with whom is for you to decide. Only quicker, the queue to Hades isn’t getting shorter.',
      'The heaviest always sails. Let’s seat the lightest with him if the boat holds. It’s the Carthage trick, just in hell.',
    ],
    quip: 'Not a single extra trip. Hm. And you still owe me the fare, Trojan.',
    hints: ['Who sails in any case — the lightest or the heaviest?', 'Sort. i — the lightest, j — the heaviest. While i ≤ j: if people[i] + people[j] ≤ limit — i++; always j-- and boats++.', 'people.sort((a, b) => a - b); let i = 0, j = people.length - 1; while (i <= j) { if (people[i] + people[j] <= limit) i++; j--; boats++; }'],
    lesson: 'A greedy step plus two pointers: the heaviest always sails and takes the lightest along if they fit.',
    doc: ['Charon’s boat', 'people[i] is a weight, limit the boat’s capacity (up to two souls). Return the fewest trips.'],
  },
  'hell.subsets': {
    title: 'Every set for the cauldron', topic: 'backtracking: take it or not',
    brief: '<b>Every set for the cauldron.</b> Go through every possible set of sinners — from the empty one to all of them together.',
    statement: [
      'A shard scattered the sinners into the wrong cauldrons, and the devils want to go through every possible set to seat them properly. <code>nums</code> are the sinners’ numbers, all different.',
      'Return <b>all</b> the sets (subsets): the empty one, single ones, pairs… and all together. For <code>[1, 2, 3]</code> there are eight: <code>[]</code>, <code>[1]</code>, <code>[2]</code>, <code>[3]</code>, <code>[1, 2]</code>, <code>[1, 3]</code>, <code>[2, 3]</code>, <code>[1, 2, 3]</code>. Order doesn’t matter.',
      'For every sinner there are only two decisions: <b>take</b> or <b>don’t take</b>. Walk these decisions with recursion: try “take”, come back, and try “don’t take”. Searching like this, going back to try the other way, is called <b>backtracking</b>.',
    ],
    tool: {
      name: 'backtracking: choose — and come back',
      text: [
        'Keep <code>path</code> — the current set. The function <code>go(i)</code> decides the fate of sinner <code>i</code>: first without them <code>go(i + 1)</code>, then with them — <code>path.push</code>, <code>go(i + 1)</code>, <code>path.pop()</code>.',
        'When a decision is made for everyone, put a <b>copy</b> <code>[...path]</code> into the answer: <code>path</code> itself will keep changing.',
      ],
      code: '// nums = [1, 2]\n// go(0): without 1 → go(1): without 2 → []    with 2 → [2]\n//        with 1    → go(1): without 2 → [1]   with 2 → [1, 2]',
    },
    talk: [
      'Here the devils go through sets for the cauldrons. Every possible one. And they need help, because the Wolf is already stuck there.',
      'I went down the corridor “take the first”… then “take the second”… and now I don’t know how to get back!',
      'Because you don’t come back. Make a choice — walk it to the end, then undo it and try the other. That’s backtracking.',
    ],
    quip: 'So that’s how you get out of dead ends. Come back! And I always only went forward…',
    hints: ['What decision has to be made for every sinner?', 'go(i): if i === n — put a copy of path. Otherwise go(i + 1) without nums[i]; then push(nums[i]), go(i + 1), pop().', 'const go = (i) => { if (i === nums.length) { out.push([...path]); return; } go(i + 1); path.push(nums[i]); go(i + 1); path.pop(); };'],
    lesson: 'Backtracking is a tree of decisions: make a choice, go deeper, come back and undo it. Every leaf of the tree is one answer.',
    doc: ['Every set for the cauldron', 'Return all subsets of nums (any order).'],
  },
  'hell.perms': {
    title: 'The order of the gates', topic: 'backtracking: who has passed already',
    brief: '<b>The order of the gates.</b> Several gates lead to Anchises, and they can be passed in any order. List every order.',
    statement: [
      'On the last circle stand gates numbered <code>nums</code>, all different. Each must be passed, once, in any order.',
      'Return <b>all</b> the possible orders. For <code>[1, 2, 3]</code> there are six: <code>[1, 2, 3]</code>, <code>[1, 3, 2]</code>, <code>[2, 1, 3]</code>, <code>[2, 3, 1]</code>, <code>[3, 1, 2]</code>, <code>[3, 2, 1]</code>. The order of the answers doesn’t matter.',
      'Now the choice is different: not “take or not”, but “which gate next”. And you have to remember which gates are already passed so you don’t pass one twice.',
    ],
    tool: {
      name: 'an “already passed” mark',
      text: [
        'Keep an array <code>used</code>: <code>used[i]</code> — whether gate <code>i</code> is already in the current path. At every step try all those not yet passed.',
        'Chose a gate: mark <code>used[i] = true</code>, <code>path.push</code>, go deeper. Came back: <code>path.pop()</code>, <code>used[i] = false</code>. The path is complete — a copy into the answer.',
      ],
      code: '// nums = [1, 2, 3]\n// 1 → 2 → 3,  1 → 3 → 2\n// 2 → 1 → 3,  2 → 3 → 1\n// 3 → 1 → 2,  3 → 2 → 1   — 6 orders',
    },
    talk: [
      'The gates can be passed in any order. Anchises wants to know every road by which his descendants may come to him.',
      'At every step — any gate not yet passed. We mark it, go deeper, and on the way back we remove the mark.',
    ],
    quip: 'Six roads to me through three gates. And how many will my grandchildren have, with more gates?',
    hints: ['What do you need to know so as not to pass the same gate twice?', 'go(): if path is full — a copy into out. Otherwise for every unused i: used[i] = true, push, go(), pop, used[i] = false.', 'for (let i = 0; i < nums.length; i++) { if (used[i]) continue; used[i] = true; path.push(nums[i]); go(); path.pop(); used[i] = false; }'],
    lesson: 'In permutations the choice is “who’s next of those not used yet”: mark, go deeper, remove the mark on the way back.',
    doc: ['The order of the gates', 'Return all permutations of nums (the order of answers doesn’t matter).'],
  },
  'hell.coins': {
    title: 'Charon’s fare', topic: 'backtracking with repeats',
    brief: '<b>Charon’s fare.</b> Charon takes a fare of exactly <code>target</code>. Find every way to make it from coins.',
    statement: [
      'To leave hell you must pay Charon exactly <code>target</code>. Coins come in several values, <code>candidates</code> (all different), and each can be used any number of times.',
      'Return all the <b>different</b> sets of coins that add up to <code>target</code>. For coins <code>[2, 3, 6, 7]</code> and <code>target = 7</code> — <code>[[2, 2, 3], [7]]</code>. The sets <code>[2, 3]</code> and <code>[3, 2]</code> count as one, so count such a set once.',
      'It’s backtracking again, with two tricks. A coin can repeat, so after choosing one, stay on the same coin. And so you don’t build the same set twice in a different order, take coins only from the current one <b>onwards</b>, never backwards.',
    ],
    tool: {
      name: 'start: only forward, but with repeats',
      text: [
        '<code>go(start, left, path)</code>: try coins numbered from <code>start</code> onwards. Took coin <code>i</code> — call <code>go(i, left - c, …)</code>: the same coin is still available, the earlier ones no longer are.',
        'Base cases: <code>left === 0</code> — a set is found (a copy into the answer); <code>left &lt; 0</code> — overshot, go back. If the coins are sorted, the search can stop as soon as a coin is bigger than <code>left</code>.',
      ],
      code: '// candidates = [2, 3], target = 7\n// 2 + 2 + 3 = 7 ✓\n// 2 + 3 + … — we no longer take 3 + 2: only forward\n// the answer: [[2, 2, 3]]',
    },
    talk: [
      'The fare is exactly what I said. Not a penny more, not a penny less. And I want to know every way — for the books.',
      'I’ll try every sequence of coins! [2, 3], [3, 2], [2, 2, 3], [2, 3, 2], [3, 2, 2]… oh, isn’t that all the same?',
      'It is the same, so take coins only forward. And a coin may repeat — so after it, stay on it.',
      'Mykyta, come here. You hear the shards because you carry a piece of the Pysanka inside you. That’s why your colour keeps changing. Juno knows it.',
    ],
    quip: 'Paid. Off you go. And tell the Wolf: I don’t ferry on credit.',
    hints: ['How do you keep [2, 3] and [3, 2] from both getting in?', 'go(start, left): left === 0 — a copy of path into out; left < 0 — back. For i from start: push, go(i, left − candidates[i]), pop.', 'const go = (start, left) => { if (left === 0) { out.push([...path]); return; } if (left < 0) return; for (let i = start; i < candidates.length; i++) { path.push(candidates[i]); go(i, left - candidates[i]); path.pop(); } };'],
    lesson: 'start keeps the order: coins only forward — so no set repeats, and go(i, …) lets you take the same coin again.',
    doc: ['Charon’s fare', 'Return all different sets from candidates (with repeats) that add up to target.'],
  },
  'anc.depth': {
    title: 'How many generations', topic: 'a tree: recursion in depth',
    brief: '<b>How many generations.</b> Anchises unrolls the family tree. Count how many generations it has.',
    statement: [
      'In Elysium Anchises shows Aeneas his descendants. The family tree is a <b>binary tree</b>: every node has <code>node.val</code> — the descendant’s number-name, and <code>node.left</code> and <code>node.right</code> — their two children (or <code>null</code> if there is no child).',
      'You are given the root — <code>root</code>, Aeneas himself. Return how many generations the longest branch has: from the root to the farthest descendant. For the tree <code>[3, 9, 20, null, null, 15, 7]</code> it is <code>3</code>. An empty tree gives <code>0</code>.',
      'A tree is easy to walk with recursion, like the circles of hell: the depth of a node is 1 plus the deeper of its children’s depths.',
    ],
    tool: {
      name: 'a binary tree',
      text: [
        'Every node knows its value <code>val</code> and two children: <code>left</code> and <code>right</code>. A node without children is called a <b>leaf</b>.',
        'Almost every tree problem is recursion: solve it for the left branch, for the right one, then build the answer for the node itself. The base case is <code>null</code>: an empty branch.',
      ],
      code: '//      3\n//     / \\\n//    9   20\n//       /  \\\n//      15   7\n// level by level: [3, 9, 20, null, null, 15, 7]',
    },
    hints: ['What is the depth of an empty branch?', 'If root is null — 0. Otherwise 1 + the larger of the depths of root.left and root.right.', 'if (!root) return 0; return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));'],
    lesson: 'The answer for a node is built from the answers for its children. The base case is an empty branch.',
    doc: ['How many generations', 'node.val — a descendant, node.left and node.right — their children or null.', 'Return the number of generations in the longest branch.'],
    talk: [
      'Son, here is your line. From you come children, from them grandchildren… The branches got tangled, and I no longer remember how many generations there are.',
      'Ask each branch how deep it is. Add yourself to the deeper one.',
    ],
    quip: 'So many generations! And all from you. Well, and a little from me.',
  },
  'anc.invert': {
    title: 'The family tree in a mirror', topic: 'a tree: swapping children',
    brief: '<b>The family tree in a mirror.</b> A shard has mirrored the family tree. Mirror it back.',
    statement: [
      'A shard flipped the family tree as if in a mirror: whoever should be on the left ended up on the right. It has to be mirrored once more to put everything back.',
      'In every node swap the left and the right child — and so for the whole tree. Return the root. <code>[4, 2, 7, 1, 3, 6, 9]</code> must become <code>[4, 7, 2, 9, 6, 3, 1]</code>.',
      'Don’t create new nodes, only rearrange the children.',
    ],
    tool: {
      name: 'a swap through a variable',
      text: [
        'To swap two things, first remember one of them: <code>const t = node.left; node.left = node.right; node.right = t;</code>',
        'Swap the children in the node, then mirror each branch with the same function.',
      ],
      code: '//    2         2\n//   / \\   →   / \\\n//  1   3      3   1',
    },
    hints: ['What must be done with the node itself, and what with its branches?', 'If root is null — return null. Swap root.left and root.right, then call invertTree on both.', 'if (!root) return null; const t = root.left; root.left = root.right; root.right = t; invertTree(root.left); invertTree(root.right); return root;'],
    lesson: 'A tree’s mirror = swapping the children in every node. Recursion visits every node exactly once.',
    doc: ['The family tree in a mirror', 'Swap left and right in every node. Return the root.'],
    talk: [
      'I look at the family tree — and everything is the wrong way round. My younger grandson is somehow older than his brother.',
      'That’s the shard playing with a mirror. Let’s swap lefts and rights in every node — and the tree will be as it was.',
    ],
    quip: 'Mirrored twice — and everything is as before. Mirrors always scared me a little.',
  },
  'anc.levels': {
    title: 'Generation by generation', topic: 'a tree: breadth-first walk',
    brief: '<b>Generation by generation.</b> List the descendants by generation: children first, then grandchildren, then great-grandchildren.',
    statement: [
      'Anchises wants to write the family tree into a book: each generation on its own line, left to right.',
      'Return an array of generations: each holds the values of the nodes of that level, in order. For <code>[3, 9, 20, null, null, 15, 7]</code> you get <code>[[3], [9, 20], [15, 7]]</code>.',
      'Recursion in depth is awkward here: it runs to the very bottom of one branch. It’s better to go <b>in breadth</b>: keep all the descendants of the current generation and gather the next one from them.',
    ],
    tool: {
      name: 'a breadth-first walk',
      text: [
        'Keep an array <code>level</code> — the nodes of the current generation. Record their values, then gather their children into a new array <code>next</code> — that is the next generation.',
        'When the current generation is empty, the tree is done.',
      ],
      code: 'let level = [root];\nwhile (level.length) {\n  // level — one generation\n  const next = [];\n  for (const node of level) {\n    if (node.left) next.push(node.left);\n    if (node.right) next.push(node.right);\n  }\n  level = next;\n}',
    },
    hints: ['How do you get the next generation from the current one?', 'level = [root]. While level isn’t empty: out.push(the values of level); gather the children of all nodes into next; level = next.', 'let level = [root]; while (level.length) { out.push(level.map((n) => n.val)); const next = []; for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); } level = next; }'],
    lesson: 'A breadth-first walk goes level by level: from the current level you gather the next. That’s how a tree is read generation by generation.',
    doc: ['Generation by generation', 'Return the node values level by level: [[root], [children], [grandchildren], …].'],
    talk: [
      'Let’s write the line into the book. Not branch by branch, but generation by generation: that’s how our descendants will read it.',
      'We take all the children together, then all the grandchildren together. Like the queue to Charon, only merrier.',
    ],
    quip: 'Now the family tree reads like a chronicle. Line by line.',
  },
  'anc.same': {
    title: 'Two identical branches', topic: 'a tree: two recursions together',
    brief: '<b>Two identical branches.</b> Anchises found two records of the family tree. Is it the same line?',
    statement: [
      'Two scrolls with the family tree lie in Elysium. Anchises suspects the shard forged one of them.',
      'Return <code>true</code> if the trees <code>p</code> and <code>q</code> are identical: the same shape and the same values in the same places. Otherwise — <code>false</code>. <code>[1, 2, 3]</code> and <code>[1, 2, 3]</code> are identical, but <code>[1, 2]</code> and <code>[1, null, 2]</code> are not: the two is on different sides.',
      'Walk both trees at once: compare the roots, then the left children with each other and the right ones with each other.',
    ],
    tool: {
      name: 'recursion on two trees',
      text: [
        'The function gets one node from each tree. If both are <code>null</code> — identical. If only one is — not. Otherwise the values must match, and so must the branches.',
      ],
      code: '//  1     1\n// /       \\\n// 2       2     different: the two is on different sides',
    },
    hints: ['When are two empty nodes identical, and when not?', 'Both null — true. One null — false. Otherwise p.val === q.val and identical left and right branches.', 'if (!p || !q) return p === q; return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);'],
    lesson: 'Two trees are compared with parallel recursion: the roots, then the left branches, then the right ones.',
    doc: ['Two identical branches', 'true if the trees p and q are identical in shape and values.'],
    talk: [
      'Two scrolls, and one line. Or not? The shard can forge handwriting.',
      'Let’s compare node with node, branch with branch. A single mismatch — and the forgery is exposed.',
      '(from behind the gate of Elysium) I’m here, I’m not eavesdropping! They didn’t let me in, so at least I’ll listen.',
    ],
    quip: 'The real scroll stays, the forgery goes into the Lethe.',
  },
  'anc.lca': {
    title: 'The common ancestor', topic: 'a tree: the answer rises from below',
    brief: '<b>The common ancestor.</b> Two descendants argue about how they are related. Find their lowest common ancestor.',
    statement: [
      'Two descendants, <code>p</code> and <code>q</code>, met in Elysium and can’t work out how they are related. The answer is their <b>lowest common ancestor</b>: the lowest node whose branch contains both.',
      'The values in the tree are distinct, and <code>p</code> and <code>q</code> are surely in it. Return the ancestor node (or its value). A node can be its own ancestor: for <code>p = 5</code> and <code>q = 4</code> in the tree <code>[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]</code> the answer is <code>5</code>.',
      'Ask every branch: “do you hold <code>p</code> or <code>q</code>?” If something is found both on the left and on the right — the ancestor is right here. If only on one side — the answer is there.',
    ],
    tool: {
      name: 'the answer rises from below',
      text: [
        'The function returns the node it found or <code>null</code>. Hit <code>p</code> or <code>q</code> — return it at once: there’s no need to look deeper.',
        'At a node, look at what the children brought. Both branches brought something — this node is the common ancestor. One brought something — pass its find up.',
      ],
      code: '//        3\n//      /   \\\n//     5     1      p = 6, q = 4\n//    / \\          6 is left of 5, 4 is right\n//   6   2         → ancestor 5\n//      / \\\n//     7   4',
    },
    hints: ['What should the function return if the node is p or q itself?', 'If root is null, p or q — return root. Otherwise search left and right: both finds exist — return root, otherwise the one that exists.', 'if (!root || root.val === p || root.val === q) return root; const l = lowestCommonAncestor(root.left, p, q), r = lowestCommonAncestor(root.right, p, q); return l && r ? root : l ?? r;'],
    lesson: 'Branches carry their finds upward; where two meet is the common ancestor. One walk, O(n).',
    doc: ['The common ancestor', 'p and q are the values of two nodes of the tree.', 'Return their lowest common ancestor (a node or a value).'],
    talk: [
      'Here are two of my descendants. They argue about whose line is older. And the answer lies in their common ancestor.',
      'Let each branch say whom it found. Where both answers meet — there’s the ancestor.',
      '(behind the gate) A common ancestor… Do I have a common ancestor with the fox? No? Good.',
    ],
    quip: 'The line is whole again. Go, son. Your descendants will build Rome — and I’ll watch from here.',
  },
  'song.search': {
    title: 'A tree of the right age', topic: 'BST: smaller left, bigger right',
    brief: '<b>A tree of the right age.</b> The forest is ordered: younger trees to the left, older to the right. Find the tree that is exactly <code>val</code> years old.',
    statement: [
      'In Mavka’s forest every tree knows its place. It is a <b>binary search tree</b>: in every node everything in the left branch is younger than it, and everything in the right branch is older. <code>node.val</code> is the tree’s age.',
      'Find the node whose <code>val</code> equals the age you’re looking for, and return it (the engine will show its branch). If there is no such tree — return <code>null</code>. For the forest <code>[4, 2, 7, 1, 3]</code> and <code>val = 2</code> the answer is the branch <code>[2, 1, 3]</code>.',
      'There can be up to 10,000 trees. Don’t walk the whole forest: compare the age with the current tree and go only to the side where it can be. Just like in Konotop: every look discards half the forest.',
    ],
    tool: {
      name: 'a search tree',
      text: [
        'The BST rule: left branch &lt; node &lt; right branch — in every node.',
        'Smaller than the node — go left, bigger — go right, equal — found. Reached <code>null</code> — there’s no such tree. There are as many steps as there are storeys in the tree.',
      ],
      code: '//        8\n//      /   \\\n//     4     12      looking for 6:\n//    / \\           6 < 8 → left\n//   2   6          6 > 4 → right → found',
    },
    hints: ['How do you decide left or right by looking at just one tree?', 'While node exists and node.val !== val: if val < node.val — node = node.left, otherwise node = node.right.', 'while (node && node.val !== val) node = val < node.val ? node.left : node.right;'],
    lesson: 'In a search tree every comparison discards a whole branch: there are as many steps as storeys, not as trees.',
    doc: ['A tree of the right age', 'Younger to the left, older to the right. Return the node aged val or null.'],
    talk: [
      'The forest is falling asleep. Every tree had its place, and now nobody can find even the oldest hornbeam.',
      'But the order still holds: younger to the left, older to the right. So let’s search like in Konotop — by halves.',
      'And I’ll just walk around every tree. And sniff each one. And maybe nibble a little.',
    ],
    quip: 'Found in a few steps, and not a single tree cut down. The forest will remember.',
  },
  'song.insert': {
    title: 'A new sapling', topic: 'BST: inserting into a leaf',
    brief: '<b>A new sapling.</b> Lukash brought a sapling aged <code>val</code>. Plant it so the forest stays in order.',
    statement: [
      'Lukash grew a sapling and wants to plant it in Mavka’s forest. The sapling is <code>val</code> years old, and there is no tree of that age in the forest yet.',
      'Find it a place, as when searching: smaller — left, bigger — right, until you come to an empty spot. Plant a new node <code>new TreeNode(val)</code> there. Return the root of the forest.',
      'For the forest <code>[4, 2, 7, 1, 3]</code> and <code>val = 5</code> you get <code>[4, 2, 7, 1, 3, 5]</code>: 5 is bigger than 4 — right, smaller than 7 — left of 7, and it’s empty there. If there is no forest at all, the sapling becomes the root.',
    ],
    tool: {
      name: 'a new node',
      text: [
        '<code>new TreeNode(val)</code> creates a node without children. To plant it, hook it to a parent: <code>node.left = …</code> or <code>node.right = …</code>.',
        'Go down as when searching, but stop one step earlier: when the needed child is <code>null</code>.',
      ],
      code: 'const leaf = new TreeNode(5);\nnode.right = leaf;   // now 5 is the right child of node',
    },
    hints: ['How do you find the place where the new tree isn’t yet?', 'node = root. An endless loop: if val < node.val — if node.left is empty, plant and stop, otherwise node = node.left; the same on the right.', 'let node = root; for (;;) { if (val < node.val) { if (!node.left) { node.left = new TreeNode(val); break; } node = node.left; } else { if (!node.right) { node.right = new TreeNode(val); break; } node = node.right; } }'],
    lesson: 'Inserting into a BST is a search that stops at an empty spot. The new node always becomes a leaf.',
    doc: ['A new sapling', 'Plant a node new TreeNode(val) without breaking the order. Return the root.'],
    talk: [
      'Lukash brought a sapling. Plant it in the wrong spot — and the whole forest gets tangled again.',
      'We’ll go as if we were searching for it. Where the search runs into emptiness — that’s where it will grow.',
    ],
    quip: 'It took root. Hear that? The forest woke up a little.',
  },
  'song.valid': {
    title: 'Is the forest in order', topic: 'BST: bounds from above and below',
    brief: '<b>Is the forest in order.</b> Check whether every tree stands in its place.',
    statement: [
      'Before Lukash plays his pipe, we must make sure the forest is in order again. Return <code>true</code> if the tree is a real search tree, and <code>false</code> if not.',
      'The trap: it isn’t enough to check that the left child is smaller than the parent and the right one bigger. The rule applies to the <b>whole</b> branch. In <code>[5, 1, 4, null, null, 3, 6]</code> there is a 3 to the right of 5 (a grandchild), and that’s already a broken forest. All ages are distinct; treat equal ones as a violation.',
      'Go down with <b>bounds</b>: every tree must be bigger than the lower bound and smaller than the upper one. Going left, the parent becomes the upper bound; going right — the lower one.',
    ],
    tool: {
      name: 'bounds lo and hi',
      text: [
        'The function <code>ok(node, lo, hi)</code> checks that everything in the branch lies strictly between <code>lo</code> and <code>hi</code>. The root is checked between <code>-Infinity</code> and <code>Infinity</code>.',
        'Left child: <code>ok(node.left, lo, node.val)</code>. Right: <code>ok(node.right, node.val, hi)</code>.',
      ],
      code: '//      5\n//     / \\\n//    1   4        4 < 5 — it can’t be on the right!\n//       / \\\n//      3   6',
    },
    hints: ['What must every node in the root’s left branch be like? And in the right one?', 'ok(node, lo, hi): empty — true. If node.val ≤ lo or ≥ hi — false. Otherwise ok(left, lo, node.val) and ok(right, node.val, hi).', 'if (!node) return true; if (node.val <= lo || node.val >= hi) return false; return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);'],
    lesson: 'The BST rule applies to the whole branch, so check bounds that narrow from top to bottom, not just neighbours.',
    doc: ['Is the forest in order', 'true if in every node the whole left branch is smaller and the whole right branch bigger.'],
    talk: [
      'Everything seems to stand as it should. But the shard is cunning: it could hide a stranger deep in a branch.',
      'Then we give every tree bounds: no younger than this one and no older than that one. And so on down.',
    ],
    quip: 'Now I’m sure. Lukash, play!',
  },
  'song.kth': {
    title: 'The pipe’s song', topic: 'BST: in-order walk',
    brief: '<b>The pipe’s song.</b> Lukash’s pipe wakes the trees from the youngest. Which tree wakes up <code>k</code>-th?',
    statement: [
      'Lukash plays, and the forest wakes up: first the youngest tree, then an older one, and so on by age. Mavka wants to know who will wake up <code>k</code>-th.',
      'Return the <code>k</code>-th smallest age in the search tree (counting from 1). For <code>[3, 1, 4, null, 2]</code> and <code>k = 1</code> it’s <code>1</code>; for <code>[5, 3, 6, 2, 4, null, null, 1]</code> and <code>k = 3</code> — <code>3</code>.',
      'A search tree has a magic walk: “left branch, the node itself, right branch”. It yields the ages exactly in increasing order. So follow that walk and count until you reach <code>k</code>.',
    ],
    tool: {
      name: 'in-order walk (inorder)',
      text: [
        'First the whole left branch, then the node itself, then the whole right branch. In a BST the nodes come out from smallest to largest this way.',
        'Keep a counter: every time you “visit” a node, increase it. Reached <code>k</code> — remember the answer, there’s no need to go further.',
      ],
      code: 'const visit = (node) => {\n  if (!node) return;\n  visit(node.left);\n  console.log(node.val);   // in increasing order!\n  visit(node.right);\n};',
    },
    hints: ['In what order do you walk the tree so the ages go up?', 'visit(node): if node is empty or the answer is found — back. visit(left); count++; if count === k — answer = node.val; visit(right).', 'if (!node || count >= k) return; visit(node.left); if (++count === k) answer = node.val; visit(node.right);'],
    lesson: 'An inorder walk of a BST yields values in increasing order: the k-th smallest is the k-th visited node.',
    doc: ['The pipe’s song', 'Return the k-th smallest age in the search tree (k counts from 1).'],
    talk: [
      'Listen to Lukash playing. The trees wake up in turn, from the youngest.',
      'And I’ll chop them all down, pile them up, sort them and count! Oh… and He Who Sits in the Rock is already looking at me.',
      'Don’t chop anything. Left branch, node, right branch — and they’ll line up by age by themselves.',
    ],
    quip: 'The forest has woken. Did you hear me sing? Now this song is yours too.',
  },
  'karp.fill': {
    title: 'The trembita’s voice', topic: 'a graph: filling from a cell',
    brief: '<b>The trembita’s voice.</b> A trembita sounded on the meadow. Paint the whole area its voice reaches.',
    statement: [
      'Fog has wrapped the mountain meadows. The map is a grid <code>image</code>: every number is the colour of a patch. A trembita sounds from cell <code>[sr, sc]</code>, and its voice flies to neighbouring patches of the same colour: up, down, left and right (not diagonally). And from them — further.',
      'Paint every cell the voice reaches with colour <code>color</code> and return the grid. For <code>[[1, 1, 1], [1, 1, 0], [1, 0, 1]]</code>, start <code>[1, 1]</code> and colour <code>2</code> you get <code>[[2, 2, 2], [2, 2, 0], [2, 0, 1]]</code>: the bottom-right corner is cut off by zeros.',
      'Cells with neighbours form a <b>graph</b>. Walk it from the start: keep a stack of cells still to visit, and paint each one as soon as you reach it.',
    ],
    tool: {
      name: 'walking a grid with a stack',
      text: [
        'Put the start on the stack. While the stack isn’t empty: take a cell; if it’s outside the grid or the wrong colour — skip it. Otherwise paint it and push its four neighbours.',
        'A painted cell is no longer the old colour, so you won’t visit it twice. Just be careful when the new colour equals the old one.',
      ],
      code: 'const stack = [[sr, sc]];\nwhile (stack.length) {\n  const [r, c] = stack.pop();\n  // check bounds and colour, paint\n  stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);\n}',
    },
    hints: ['Where can the voice fly from one cell?', 'stack = [[sr, sc]]. While there’s something to take: [r, c] = pop; if out of bounds or image[r][c] !== old — continue; paint and push 4 neighbours.', 'while (stack.length) { const [r, c] = stack.pop(); if (r < 0 || c < 0 || r >= image.length || c >= image[0].length || image[r][c] !== old) continue; image[r][c] = color; stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]); }'],
    lesson: 'A grid is a graph: a cell is connected to four neighbours. A stack walk enters every cell once.',
    doc: ['The trembita’s voice', 'Paint with color every cell of the same colour as [sr, sc] that can be reached up, down, left or right.', 'Return the grid.'],
    talk: [
      'The fog is so thick the Hutsuls can’t see the next house. Let the trembita sound — wherever its voice reaches, it will clear.',
      'From a cell to its neighbour, from the neighbour on. Like gossip through a village.',
    ],
    quip: 'Hear it echo? Where it reached, you can already see the houses.',
  },
  'karp.islands': {
    title: 'Islands of meadows', topic: 'a graph: connected components',
    brief: '<b>Islands of meadows.</b> Patches of meadow show through the fog. Count how many separate islands there are.',
    statement: [
      'The molfar looks from above: <code>1</code> — meadow, <code>0</code> — fog. Neighbouring meadows (up, down, left, right) are one island, however winding it is.',
      'Return the number of islands. <code>[[1, 1, 0, 0], [1, 0, 0, 1], [0, 0, 1, 1]]</code> has <code>2</code>.',
      'Meadows can be 50 × 50 cells. Go through the grid row by row. Hit a meadow — it’s a new island: count it and at once “flood” the whole of it with fog so you never hit it again.',
    ],
    tool: {
      name: 'found it — flood it',
      text: [
        'Every island must be counted exactly once. For that, as soon as you find an island’s first cell, walk all of it (as in “The trembita’s voice”) and mark what you’ve walked: <code>grid[r][c] = 0</code>.',
        'Then the outer loop only hits islands not yet seen, and every cell is visited a constant number of times.',
      ],
      code: 'for (let r = 0; r < grid.length; r++)\n  for (let c = 0; c < grid[0].length; c++)\n    if (grid[r][c] === 1) {\n      count++;\n      // flood the whole island from [r, c]\n    }',
    },
    hints: ['How do you count an island exactly once, though it has many cells?', 'A double loop over the cells. Found a 1 — count++ and walk the island with a stack, putting 0 on every walked cell.', 'if (grid[r][c] === 1) { count++; const st = [[r, c]]; while (st.length) { const [a, b] = st.pop(); if (a < 0 || b < 0 || a >= grid.length || b >= grid[0].length || grid[a][b] !== 1) continue; grid[a][b] = 0; st.push([a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]); } }'],
    lesson: 'The number of islands is the number of walks you start: found a new cell — walk and mark the whole island. O(cells) in total.',
    doc: ['Islands of meadows', '1 — meadow, 0 — fog. Return the number of islands.'],
    talk: [
      'From above you can see patches of meadow. As many as there are, so many communities that can’t hear each other.',
      'I’ll walk the whole island again from every meadow cell! And so for each one. I won’t miss a thing!',
      'But you’ll walk every island as many times as it has cells. Found an island — flood it, and it won’t bother you again.',
    ],
    quip: 'So many communities. Now we know whom to send the trembita’s call to.',
  },
  'karp.rot': {
    title: 'Spoiled bryndza', topic: 'a graph: breadth-first in waves',
    brief: '<b>Spoiled bryndza.</b> The bryndza cheese on a shelf in the hut has gone bad. In how many minutes will all of it spoil?',
    statement: [
      'Bryndza cheeses lie on the shelves of a shepherd’s hut: <code>0</code> — empty, <code>1</code> — a fresh cheese, <code>2</code> — a spoiled one. Every minute a spoiled cheese spoils its fresh neighbours (up, down, left, right).',
      'Return in how many minutes no fresh cheese will be left. If some cheese never spoils (it can’t be reached) — <code>-1</code>. If there is no fresh cheese at the start — <code>0</code>. For <code>[[2, 1, 1], [1, 1, 0], [0, 1, 1]]</code> — <code>4</code>.',
      'Spoiling goes in <b>waves</b>, like the trembita’s voice: all the spoiled ones together are the first wave, everyone they touched is the second. This is a <b>breadth-first search</b> (BFS): keep the current wave and gather the next from it.',
    ],
    tool: {
      name: 'breadth-first over a grid',
      text: [
        'First gather all spoiled cheeses into <code>wave</code> and count the fresh ones. Every minute: for every cell of the wave look at its 4 neighbours; spoil a fresh one, decrease the fresh counter and put it into <code>next</code>.',
        'The wave is over — <code>wave = next</code>, minutes +1. Stop when the wave is empty or no fresh ones are left.',
      ],
      code: '// minute 0:  2 1 1     minute 1:  2 2 1\n//            1 1 0                2 1 0\n//            0 1 1                0 1 1',
    },
    hints: ['What does every minute do to all the spoiled cheeses at once?', 'Gather all 2s into wave, count the 1s. While wave isn’t empty and fresh > 0: next = []; for every [r, c] in wave — 4 neighbours, spoil the fresh ones (= 2, fresh--, into next); wave = next; minutes++.', 'while (wave.length && fresh) { const next = []; for (const [r, c] of wave) for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) if (x >= 0 && y >= 0 && x < grid.length && y < grid[0].length && grid[x][y] === 1) { grid[x][y] = 2; fresh--; next.push([x, y]); } wave = next; minutes++; }'],
    lesson: 'A breadth-first search goes in waves from all sources at once: the wave number is the distance, that is, the minutes.',
    doc: ['Spoiled bryndza', '0 — empty, 1 — fresh, 2 — spoiled. Every minute a spoiled one spoils 4 neighbours.', 'Return in how many minutes no fresh ones are left, or -1.'],
    talk: [
      'The shepherds went looking for each other in the fog and left the bryndza behind. One cheese has already gone bad…',
      'And it spoils its neighbours in waves. Let’s count waves, not cheeses — it’ll be faster.',
    ],
    quip: 'Now we know how much time is left for supper. I’d hurry.',
  },
  'karp.crafts': {
    title: 'The order of crafts', topic: 'a graph: dependencies without a loop',
    brief: '<b>The order of crafts.</b> To become a molfar you must learn the crafts in the right order. Is it even possible?',
    statement: [
      'A molfar’s apprentice must master <code>numCourses</code> crafts numbered from 0. A pair <code>[a, b]</code> in <code>prerequisites</code> means: to learn <code>a</code>, you must first learn <code>b</code>.',
      'Return <code>true</code> if everything can be learned. The shard may have tangled the requirements into a loop: “carving is needed for pysanky, pysanky for the trembita, and the trembita for carving”. Then — <code>false</code>. For <code>2</code> and <code>[[1, 0]]</code> — <code>true</code>; for <code>2</code> and <code>[[1, 0], [0, 1]]</code> — <code>false</code>.',
      'Start with crafts that need nothing. Learned a craft — remove it from the others’ requirements. Whoever is left without requirements can now be learned too. If you learn them all this way — there’s no loop.',
    ],
    tool: {
      name: 'in-degree and a queue of ready ones',
      text: [
        '<code>need[a]</code> — how many crafts must still be learned before <code>a</code>. <code>after[b]</code> — the list of crafts waiting for <code>b</code>.',
        'Put every craft with <code>need = 0</code> into <code>ready</code>. Take a craft from there — count it learned and decrease <code>need</code> for each one in <code>after</code>; whoever reached zero goes into <code>ready</code>. This is <b>topological sorting</b>.',
      ],
      code: '// [[1, 0], [2, 1]]: 0 → 1 → 2\n// need = [0, 1, 1], ready = [0]\n// learned 0 → need[1] = 0 → ready = [1]\n// learned 1 → need[2] = 0 → ready = [2] → all ✓',
    },
    hints: ['Which craft can you start with?', 'need[a]++ and after[b].push(a) for every pair. ready = crafts with need 0. While ready isn’t empty: take x, done++, for every y in after[x]: if --need[y] === 0 — into ready. Answer: done === numCourses.', 'for (const [a, b] of prerequisites) { need[a]++; after[b].push(a); } const ready = []; for (let i = 0; i < numCourses; i++) if (!need[i]) ready.push(i); let done = 0; while (ready.length) { const x = ready.pop(); done++; for (const y of after[x]) if (--need[y] === 0) ready.push(y); } return done === numCourses;'],
    lesson: 'Topological sorting: learn what waits for nothing and unlock the next. If you couldn’t learn everything — the requirements have a loop.',
    doc: ['The order of crafts', '[a, b] — to learn a, you must first learn b.', 'true if all numCourses crafts can be learned.'],
    talk: [
      'Crafts in the mountains are passed on in turn: one is needed for another. But the shard mixed them up, and the apprentices go in circles.',
      'Let’s start with what can be learned right away. Every craft learned unlocks the next ones.',
    ],
    quip: 'There is an order. One day you too, fox, will become a molfar. Maybe.',
  },
  'karp.flow': {
    title: 'The Cheremosh and the Prut', topic: 'a graph: walking back from the shores',
    brief: '<b>The Cheremosh and the Prut.</b> Rain falls on the mountains. From which peaks will water flow into both the Cheremosh and the Prut?',
    statement: [
      'The mountain map is a grid of heights <code>heights</code>. The Cheremosh flows along the <b>top and left</b> edges of the map, the Prut along the <b>bottom and right</b> ones. Water flows from a cell to a neighbour (up, down, left, right) if it isn’t higher. From an edge cell water gets into the river of that edge.',
      'Return all cells <code>[r, c]</code> from which water can reach <b>both</b> rivers. Order doesn’t matter. For <code>[[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]]</code> there are seven such cells: <code>[0, 4]</code>, <code>[1, 3]</code>, <code>[1, 4]</code>, <code>[2, 2]</code>, <code>[3, 0]</code>, <code>[3, 1]</code>, <code>[4, 0]</code>.',
      'Letting water run from every peak is the Wolf’s way. It’s craftier to go <b>backwards</b>: from the river uphill, to neighbours that aren’t lower. One walk from the banks of the Cheremosh, another from the banks of the Prut. The cells both reached are the answer.',
    ],
    tool: {
      name: 'walking back from the goal',
      text: [
        'Instead of “where will water flow from here?” ask “where could water have come here from?”. From the bank climb to a neighbour if it is <b>not lower</b>.',
        'Gather the set of reachable cells for each river separately (as in “The trembita’s voice”, only with a height condition). The answer is their intersection.',
      ],
      code: '// from the Cheremosh (top and left edge) — up the slopes\n// from the Prut (bottom and right edge)   — up the slopes\n// both reached a cell → water from it flows into both rivers',
    },
    hints: ['Where could water have come from to reach the bank of the Cheremosh?', 'reach(starts): a stack walk from the edge cells; go to a neighbour if heights[neighbour] ≥ heights[current]; remember the visited. Do it for both edges and take the cells visited by both.', 'const reach = (starts) => { const seen = new Set(), st = starts; while (st.length) { const [r, c] = st.pop(); if (seen.has(r * C + c)) continue; seen.add(r * C + c); for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) if (x >= 0 && y >= 0 && x < R && y < C && heights[x][y] >= heights[r][c]) st.push([x, y]); } return seen; };'],
    lesson: 'When there are many sources and few goals — walk back from the goals. Two walks from the banks replace a walk from every peak.',
    doc: ['The Cheremosh and the Prut', 'The Cheremosh is the top and left edge, the Prut the bottom and right. Water flows to a neighbour that isn’t higher.', 'Return the cells [r, c] from which water reaches both rivers.'],
    talk: [
      'When the fog lifts, it will rain. The Hutsuls want to know from which peaks water reaches both the Cheremosh and the Prut. That’s where they’ll put the trembitas.',
      'I’ll drop water from every peak and follow it! Everywhere! Oh, I’m soaked…',
      'And we’ll go from the rivers uphill. Twice — and we’ll meet on the right peaks.',
    ],
    quip: 'The trembitas have sounded from every peak. Hear that? The meadows are talking again.',
  },
  'val.merge': {
    title: 'Join the walls', topic: 'intervals: sort and join',
    brief: '<b>Join the walls.</b> A shard has cut the Serpent’s Walls into pieces that overlap. Join them into solid walls.',
    statement: [
      'Long ago Kyrylo Kozhumyaka ploughed the land with the Serpent and raised walls. Now the walls are pieces <code>[start, end]</code> that overlap, and the defenders get lost in them.',
      'Merge all pieces that overlap or touch and return solid walls sorted by start. <code>[[1, 3], [2, 6], [8, 10], [15, 18]]</code> becomes <code>[[1, 6], [8, 10], [15, 18]]</code>; <code>[1, 4]</code> and <code>[4, 5]</code> touch, so they become <code>[1, 5]</code>.',
      'There can be up to 10,000 pieces. Comparing every one with every other takes long. Sort the pieces by start: then a new piece can only overlap the <b>last</b> joined wall.',
    ],
    tool: {
      name: 'sorting by start',
      text: [
        '<code>intervals.sort((a, b) => a[0] - b[0])</code> lines the walls up by start. Then walk through them keeping the last joined wall.',
        'Does the new one start no later than the last one ends? Then join them: the end is the larger of the two. No — it’s a new separate wall.',
      ],
      code: '// after sorting: [1, 3] [2, 6] [8, 10]\n// [2, 6] starts before [1, 3] ends → [1, 6]\n// [8, 10] — after 6 → a new wall',
    },
    hints: ['If the walls are sorted by start, which of the joined ones can a new one overlap?', 'Sort by v[0]. For each v: if out isn’t empty and v[0] ≤ the end of the last — stretch the end to the max; otherwise out.push([v[0], v[1]]).', 'intervals.sort((a, b) => a[0] - b[0]); for (const v of intervals) { const last = out[out.length - 1]; if (last && v[0] <= last[1]) last[1] = Math.max(last[1], v[1]); else out.push([v[0], v[1]]); }'],
    lesson: 'Intervals sorted by start overlap only with the last joined one: an O(n log n) sort and one pass.',
    doc: ['Join the walls', 'Merge walls [start, end] that overlap or touch.', 'Return solid walls in increasing order of start.'],
    talk: [
      'I ploughed these walls with a plough, and the Serpent pulled it. They were straight, solid! And now — scraps, one on top of another.',
      'Let’s line the scraps up by start. Then each new one is either sewn onto the last or starts a new wall.',
    ],
    quip: 'Now that’s a wall! I could harness the Serpent again.',
  },
  'val.insert': {
    title: 'A new wall', topic: 'intervals: before, overlap, after',
    brief: '<b>A new wall.</b> The walls are joined and in order. Kozhumyaka raises one more — insert it without breaking the order.',
    statement: [
      '<code>intervals</code> are solid walls that don’t overlap and go in increasing order of start. Kozhumyaka raises a new wall <code>newInterval</code>.',
      'Insert it and merge it with the walls it overlaps or touches. Return the walls in increasing order. For <code>[[1, 3], [6, 9]]</code> and <code>[2, 5]</code> you get <code>[[1, 5], [6, 9]]</code>; for <code>[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]]</code> and <code>[4, 8]</code> — <code>[[1, 2], [3, 10], [12, 16]]</code>.',
      'The walls are already in order, so there’s no need to sort. Make one pass: first those entirely <b>before</b> the new one, then those that <b>overlap</b> it (merge them into the new one), and then all that come <b>after</b>.',
    ],
    tool: {
      name: 'three parts of one pass',
      text: [
        'Before: the wall ends before the new one starts (<code>v[1] &lt; start</code>) — copy it as is.',
        'Overlap: the wall starts no later than the new one ends — stretch the new one: the start is the smaller, the end the larger. The rest come after: add the new one, then everything left.',
      ],
      code: '// [[1, 2], [3, 5], [6, 7], [8, 10]] + [4, 8]\n// before:  [1, 2]\n// overlap: [3, 5] [6, 7] [8, 10] → [3, 10]\n// after:   —',
    },
    hints: ['Which walls will the new one certainly not touch?', 'While intervals[i][1] < start — into out as is. While intervals[i][0] ≤ end — start = min, end = max. Then out.push([start, end]) and the rest.', 'while (i < intervals.length && intervals[i][1] < start) out.push(intervals[i++]); while (i < intervals.length && intervals[i][0] <= end) { start = Math.min(start, intervals[i][0]); end = Math.max(end, intervals[i][1]); i++; } out.push([start, end]); while (i < intervals.length) out.push(intervals[i++]);'],
    lesson: 'Sorted intervals split into three parts — before, overlap, after — and inserting takes one O(n) pass.',
    doc: ['A new wall', 'intervals are sorted walls without overlaps. Insert newInterval and merge as needed.'],
    talk: [
      'I’ll raise one more wall. Only where? I don’t want everything tangled again.',
      'The earlier ones we don’t touch. The overlapping ones we merge with the new one. The later ones we just add.',
    ],
    quip: 'It fits like a glove. My plough, give me my plough!',
  },
  'val.jump': {
    title: 'Jumping the ditches', topic: 'greedy: the farthest reachable point',
    brief: '<b>Jumping the ditches.</b> In front of the walls there are ditches with planks. Can Aeneas jump to the last plank?',
    statement: [
      'Ditches have been dug in front of the walls, with planks laid across. <code>nums[i]</code> — how many planks forward you can jump <b>at most</b> from plank <code>i</code> (fewer is fine too). Aeneas stands on the first one.',
      'Return <code>true</code> if the last plank can be reached. <code>[2, 3, 1, 1, 4]</code> — <code>true</code> (1 → 2 → 5 or 1 → 3 → 4 → 5). <code>[3, 2, 1, 0, 4]</code> — <code>false</code>: every path runs into the plank with a zero.',
      'There can be up to 10,000 planks. Don’t try every path. Go left to right and keep the <b>farthest</b> plank you can already jump to. If you’re on a plank you can’t reach — there’s no way further.',
    ],
    tool: {
      name: 'a greedy step',
      text: [
        'A greedy algorithm makes the best choice right now at every step and never goes back. Here the best choice is to remember how far you can reach: <code>far = max(far, i + nums[i])</code>.',
        'If <code>i &gt; far</code> — plank <code>i</code> can’t be reached, and neither can the rest.',
      ],
      code: '// [2, 3, 1, 1, 4]\n// i = 0: far = 2\n// i = 1: far = 4 — the last one is already reachable!',
    },
    hints: ['What is enough to remember about all the planks already passed?', 'For every i: if i > far — false. Otherwise far = max(far, i + nums[i]). Passed everything — true.', 'for (let i = 0; i < nums.length; i++) { if (i > far) return false; far = Math.max(far, i + nums[i]); } return true;'],
    lesson: 'Greedy: keep the farthest reachable point. One O(n) pass instead of trying every path.',
    doc: ['Jumping the ditches', 'nums[i] — the longest jump from plank i.', 'true if the last plank can be reached from the first.'],
    talk: [
      'There are ditches before the walls, and planks over them. From some you can jump far, from others not a step.',
      'I’ll try every jump from every plank! And then every jump from wherever I landed…',
      'It’s enough to know how far you can reach. I go plank by plank and push that limit.',
    ],
    quip: 'Jumped over and didn’t get my feet wet. Almost.',
  },
  'val.erase': {
    title: 'Extra walls', topic: 'greedy: keep the one that ends first',
    brief: '<b>Extra walls.</b> Some walls get in each other’s way. Remove as few as possible so the rest don’t overlap.',
    statement: [
      'Kozhumyaka wants the walls to stand side by side without overlapping: a defender must pass between them. <code>intervals[i] = [start, end]</code>; walls that only touch (<code>[1, 2]</code> and <code>[2, 3]</code>) don’t get in the way.',
      'Return the <b>smallest</b> number of walls to remove. For <code>[[1, 2], [2, 3], [3, 4], [1, 3]]</code> — <code>1</code> (remove <code>[1, 3]</code>); for <code>[[1, 2], [1, 2], [1, 2]]</code> — <code>2</code>.',
      'The trick is to keep as many walls as possible. Sort by <b>end</b> and take a wall every time it starts no earlier than the last taken one ended. A wall that ends earlier leaves more room for the rest.',
    ],
    tool: {
      name: 'sorting by end',
      text: [
        '<code>intervals.sort((a, b) => a[1] - b[1])</code>. Keep <code>end</code> — the end of the last wall kept.',
        'The wall starts no earlier than <code>end</code> — keep it and update <code>end</code>. Otherwise — it’s extra. The answer: how many were removed.',
      ],
      code: '// by end: [1, 2] [2, 3] [1, 3] [3, 4]\n// [1, 2] ✓  [2, 3] ✓  [1, 3] ✗ (1 < 3)  [3, 4] ✓\n// removed 1',
    },
    hints: ['Of two overlapping walls, which is better to keep?', 'Sort by end. For every [l, r]: if l ≥ end — end = r (keep it), otherwise removed++.', 'intervals.sort((a, b) => a[1] - b[1]); for (const [l, r] of intervals) { if (l >= end) end = r; else removed++; }'],
    lesson: 'To keep the most intervals, always take the one that ends first: sort by end and one pass.',
    doc: ['Extra walls', 'Return the smallest number of walls to remove so the rest don’t overlap.'],
    talk: [
      'I raised too many — now the walls are on top of each other, and you can’t pass between them.',
      'Let’s keep the wall that ends first. It leaves the most room for the others.',
    ],
    quip: 'Now even a cart can pass between the walls. But not the Serpent.',
  },
  'val.arrows': {
    title: 'Arrows at the serpents', topic: 'greedy: shoot at the end',
    brief: '<b>Arrows at the serpents.</b> Serpents crawl in waves, each spanning a stretch above the wall. What’s the fewest arrows to hit them all?',
    statement: [
      'Serpents crawl through the gaps in the walls. Each serpent stretches above the wall from <code>points[i][0]</code> to <code>points[i][1]</code>. An arrow shot straight up at point <code>x</code> hits every serpent with <code>start ≤ x ≤ end</code>.',
      'Return the fewest arrows needed to hit every serpent. For <code>[[10, 16], [2, 8], [1, 6], [7, 12]]</code> — <code>2</code>: an arrow at 6 hits <code>[2, 8]</code> and <code>[1, 6]</code>, an arrow at 12 hits <code>[10, 16]</code> and <code>[7, 12]</code>.',
      'Sort the serpents by <b>end</b>. The first arrow goes into the end of the first serpent: that way it catches as many others as possible. A new arrow is needed only when a serpent starts to the right of the last arrow.',
    ],
    tool: {
      name: 'an arrow into the earliest end',
      text: [
        'Someone has to hit the serpent that ends first. It pays most to shoot right at its end: further right is impossible, and further left catches fewer.',
        'Keep <code>at</code> — the point of the last arrow. A serpent starts after <code>at</code>? A new arrow into its end.',
      ],
      code: '// by end: [1, 6] [2, 8] [7, 12] [10, 16]\n// arrow at 6: [1, 6] [2, 8]\n// 7 > 6 → arrow at 12: [7, 12] [10, 16]\n// 2 arrows',
    },
    hints: ['Where is it best to shoot the serpent that ends first?', 'Sort by end. For every [l, r]: if l > at — arrows++, at = r.', 'points.sort((a, b) => a[1] - b[1]); for (const [l, r] of points) if (l > at) { arrows++; at = r; }'],
    lesson: 'Shoot at the earliest end: it hits everyone who has already started. Sort by end and one pass.',
    doc: ['Arrows at the serpents', 'points[i] = [start, end] — a serpent. An arrow at x hits if start ≤ x ≤ end.', 'Return the fewest arrows.'],
    talk: [
      'Here they come! Wave after wave! We’re short of arrows — every one must hit as many as possible.',
      'I’ll try every point on the wall and every set of arrows! Oh, they’re already here…',
      'Shoot at the end of the serpent that finishes first. One arrow — a whole pack.',
    ],
    quip: 'We fought them off! Now I’ll harness them to the plough again.',
  },
  'camp.sneak': {
    title: 'Past the guards', topic: 'shortest path: breadth-first',
    brief: '<b>Past the guards.</b> Turnus’s camp at night. Sneak from the top-left corner to the bottom-right by the shortest path.',
    statement: [
      'Mykyta has been kidnapped and is held in Turnus’s camp. Aeneas, Nisus and Euryalus creep in at night. The camp is a square grid <code>grid</code>: <code>0</code> — shadow you can pass through, <code>1</code> — a campfire with guards.',
      'You can move in <b>eight</b> directions: straight and diagonally. Return how many cells the shortest path from <code>[0, 0]</code> to the bottom-right corner has (both ends count), or <code>-1</code> if there is no path. For <code>[[0, 1], [1, 0]]</code> — <code>2</code>, diagonally.',
      'The shortest path in a grid where every step is the same is found with a <b>breadth-first search</b>, as in the Carpathians: wave after wave, and the number of the wave that first touches a cell is its distance.',
    ],
    tool: {
      name: 'distance = wave number',
      text: [
        'Keep <code>dist[r][c]</code> — the length of the shortest path to the cell (0 — not reached yet). The start is 1.',
        'For every cell of the wave look at its 8 neighbours. If a neighbour is shadow and has no distance yet, its distance is 1 more. The first touch is always the shortest, so nothing needs rewriting.',
      ],
      code: '// 0 0 0     1 2 3\n// 1 1 0  →  · · 3\n// 1 1 0     · · 4   → answer 4',
    },
    hints: ['Which wave will touch the final cell first?', 'dist = a grid of zeros, dist[0][0] = 1, wave = [[0, 0]]. While there’s a wave: for every cell and its 8 neighbours — if shadow and dist 0, dist = +1 and into next. Answer: dist of the end or -1.', 'for (const [r, c] of wave) for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const x = r + dr, y = c + dc; if (x >= 0 && y >= 0 && x < n && y < n && grid[x][y] === 0 && !dist[x][y]) { dist[x][y] = dist[r][c] + 1; next.push([x, y]); } }'],
    lesson: 'When all steps are equal, breadth-first search gives the shortest path: the first touch of a cell is the shortest.',
    doc: ['Past the guards', '0 — shadow, 1 — guards. You can move in 8 directions.', 'Return the number of cells in the shortest path from [0, 0] to the bottom-right corner, or -1.'],
    talk: [
      'I’m Nisus, and this is Euryalus. We know the camp: campfires with guards, and shadows between them. Follow us, Aeneas.',
      'It’s strange without Mykyta. Nobody grumbling in my ear. All right — in waves, like in the mountains.',
    ],
    quip: 'The guards didn’t even stir. It’ll get harder from here.',
  },
  'camp.signal': {
    title: 'News through the posts', topic: 'shortest path: Dijkstra with a heap',
    brief: '<b>News through the posts.</b> If the guards raise the alarm, how long until it reaches every post in the camp?',
    statement: [
      'The camp has <code>n</code> guard posts numbered 1 to <code>n</code>. <code>times[i] = [u, v, w]</code>: a runner from post <code>u</code> to post <code>v</code> takes <code>w</code> minutes (one way only). The alarm is raised at post <code>k</code>.',
      'Return in how many minutes the news reaches <b>every</b> post, or <code>-1</code> if some post is never reached. For <code>[[2, 1, 1], [2, 3, 1], [3, 4, 1]]</code>, <code>n = 4</code>, <code>k = 2</code> — <code>2</code>.',
      'Now the steps have different lengths, so waves won’t help. <b>Dijkstra’s algorithm</b> will: always take the nearest post not yet handled. The nearest is easy to get from a <b>heap</b> — as at Acestes’s games.',
    ],
    tool: {
      name: 'Dijkstra',
      text: [
        'Gather each post’s runners: <code>adj[u] = [[v, w], …]</code>. Into a heap <code>new MinPriorityQueue((x) =&gt; x[0])</code> put <code>[0, k]</code>: “to k — 0 minutes”.',
        'Take the nearest <code>[d, u]</code> from the heap. If <code>u</code> is already done — skip it. Otherwise remember its time and put <code>[d + w, v]</code> into the heap for every runner from <code>u</code>.',
      ],
      code: 'const heap = new MinPriorityQueue((x) => x[0]);\nheap.enqueue([0, k]);\nwhile (heap.size()) {\n  const [d, u] = heap.dequeue();   // the nearest\n  // seen u already? — move on\n  // otherwise: its time is d, and its neighbours go into the heap\n}',
    },
    hints: ['Whose time can be considered final when you take it from the heap?', 'heap.enqueue([0, k]). While the heap isn’t empty: [d, u] = dequeue; if done has u — continue; done.set(u, d); for [v, w] in adj[u] — enqueue([d + w, v]). If done.size < n — -1, otherwise the largest time.', 'while (heap.size()) { const [d, u] = heap.dequeue(); if (done.has(u)) continue; done.set(u, d); for (const [v, w] of adj[u]) if (!done.has(v)) heap.enqueue([d + w, v]); } return done.size === n ? Math.max(...done.values()) : -1;'],
    lesson: 'Dijkstra: the nearest from the heap already has its final distance. Steps of different lengths — a heap instead of waves.',
    doc: ['News through the posts', 'times[i] = [u, v, w] — a runner from u to v in w minutes. Posts 1 to n, the alarm at k.', 'Return when the news reaches everyone, or -1.'],
    talk: [
      'Here the posts pass the alarm by runners. If we’re spotted — how long until the whole camp knows?',
      '(from afar, barely audible) …the nearest — first… from the heap…',
      'That’s Mykyta! Hear that? He’s signalling.',
    ],
    quip: 'Now we know how much time we have. Not much.',
  },
  'camp.exits': {
    title: 'To the nearest exit', topic: 'breadth-first from many sources',
    brief: '<b>To the nearest exit.</b> For every tent, find how many steps it is to the nearest way out of the camp.',
    statement: [
      'Nisus draws a retreat map. <code>mat</code> is the camp grid: <code>0</code> — an exit (a gap in the palisade), <code>1</code> — a tent. You move up, down, left, right.',
      'Return a grid of the same size: for every cell — how many steps to the <b>nearest</b> zero. Zeros get 0. For <code>[[0, 0, 0], [0, 1, 0], [1, 1, 1]]</code> you get <code>[[0, 0, 0], [0, 1, 0], [1, 2, 1]]</code>.',
      'Looking for an exit separately from every tent takes long. Send waves <b>from all exits at once</b>: the first wave is the exits’ neighbours (1 step), the second their neighbours (2 steps), and so on. Remember the spoiled bryndza.',
    ],
    tool: {
      name: 'waves from many sources',
      text: [
        'Start with all the zeros in the first wave; for the rest the distance is unknown for now (<code>Infinity</code>).',
        'Wave after wave: a neighbour with an unknown distance gets the current cell’s distance + 1 and goes into the next wave.',
      ],
      code: '// 0 0 0      0 0 0\n// 0 1 0  →   0 1 0\n// 1 1 1      1 2 1',
    },
    hints: ['Where should the waves start so every cell at once gets the distance to the nearest exit?', 'wave = all cells with 0. While there’s a wave: for every [r, c] and 4 neighbours — if the neighbour’s dist is Infinity, it’s dist[r][c] + 1 and into next.', 'for (const [r, c] of wave) for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) if (x >= 0 && y >= 0 && x < mat.length && y < mat[0].length && dist[x][y] === Infinity) { dist[x][y] = dist[r][c] + 1; next.push([x, y]); }'],
    lesson: 'The distance to the nearest of many sources is one breadth-first search started from all sources at once.',
    doc: ['To the nearest exit', '0 — an exit, 1 — a tent. Return the grid of distances to the nearest 0 (steps in 4 directions).'],
    talk: [
      'Once we free the fox, we’ll have to run fast. From every tent — to the nearest gap.',
      'Let’s send waves from all the gaps together. Like the bryndza in the Carpathians, only the other way round — it saves.',
    ],
    quip: 'The retreat map is ready. Euryalus, memorise it.',
  },
  'camp.effort': {
    title: 'The easiest path to Mykyta', topic: 'Dijkstra on a grid',
    brief: '<b>The easiest path to Mykyta.</b> The camp is on hills. Find a path to the prisoner whose steepest climb or drop is as gentle as possible.',
    statement: [
      'Mykyta is held in the bottom-right corner of the camp. <code>heights[r][c]</code> is the height of a hill. You move up, down, left, right. The <b>effort</b> of a path is the largest height difference between two neighbouring cells on it: the steepest spot is exactly where you can slip and make noise.',
      'Return the smallest possible effort of a path from <code>[0, 0]</code> to the bottom-right corner. For <code>[[1, 2, 2], [3, 8, 2], [5, 3, 5]]</code> — <code>2</code>: the path 1 → 3 → 5 → 3 → 5 never jumps by more than 2.',
      'The camp can be 50 × 50. It’s Dijkstra again, but the “distance” is now not the sum of steps but the <b>largest</b> step on the path. Take the cell with the smallest effort from the heap — for it the effort is already final.',
    ],
    tool: {
      name: 'Dijkstra with a maximum',
      text: [
        '<code>best[r][c]</code> — the smallest known effort to reach the cell. The heap holds <code>[effort, r, c]</code>, the smallest on top.',
        'Moving to a neighbour costs <code>max(effort, |height difference|)</code>. If that’s less than the neighbour’s <code>best</code> — update it and push it into the heap. Popped the final cell — that’s the answer.',
      ],
      code: 'const heap = new MinPriorityQueue((x) => x[0]);\nheap.enqueue([0, 0, 0]);\n// [e, r, c] = heap.dequeue()\n// to a neighbour: Math.max(e, Math.abs(h[x][y] - h[r][c]))',
    },
    hints: ['What does “distance” to a cell mean if we count the steepest step rather than the sum?', 'While the heap isn’t empty: [e, r, c] = dequeue; if it’s the end — return e; if e > best[r][c] — skip. For 4 neighbours: ne = max(e, |difference|); if ne < best — update and enqueue.', 'while (heap.size()) { const [e, r, c] = heap.dequeue(); if (r === R - 1 && c === C - 1) return e; if (e > best[r][c]) continue; for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) { if (x < 0 || y < 0 || x >= R || y >= C) continue; const ne = Math.max(e, Math.abs(heights[x][y] - heights[r][c])); if (ne < best[x][y]) { best[x][y] = ne; heap.enqueue([ne, x, y]); } } }'],
    lesson: 'Dijkstra works with any “cost” that never decreases along a path: a sum, or here — the largest step.',
    doc: ['The easiest path to Mykyta', 'The effort of a path is the largest height difference between neighbouring cells.', 'Return the smallest effort of a path from [0, 0] to the bottom-right corner.'],
    talk: [
      'Looking for the fox? I have him. But the camp is on hills: one careless step — and the whole guard is on its feet.',
      'I’m guarding the fox! I walk every path at once… and get nowhere in time. Who’s there?',
      '(from captivity) Aeneas! Not the shortest — the gentlest! The steepest spot decides everything!',
    ],
    quip: 'Aeneas! I knew you’d come. Well, I hoped. Look — I’m every colour again!',
  },
  'forge.stairs': {
    title: 'Stairs to the forge', topic: 'DP: the answer from the two before',
    brief: '<b>Stairs to the forge.</b> Red-hot stairs lead to Vulcan’s forge. Climb them and get burned as little as possible.',
    statement: [
      'The forge stands at the top of the stairs. <code>cost[i]</code> — how much step <code>i</code> burns when you tread on it. You can step to the next step or jump over one. You may start from step zero or step one, and the forge is right after the last step.',
      'Return the smallest total heat on the way to the forge. For <code>[10, 15, 20]</code> — <code>15</code>: step on the first and jump to the forge. For <code>[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]</code> — <code>6</code>.',
      'The cheapest way onto step <code>i</code> is the cheaper of the ways onto the two steps before it plus the step itself. Count every step <b>once</b> and lean on what’s already counted: that is <b>dynamic programming</b>.',
    ],
    tool: {
      name: 'dynamic programming',
      text: [
        'Split the problem into smaller overlapping ones and solve them from the smallest. Write down each answer — the next ones will lean on it instead of recounting.',
        'Here <code>best[i]</code> is the least heat to stand <b>on</b> step <code>i</code>: <code>cost[i] + min(best[i - 1], best[i - 2])</code>. The forge is after the last: the smaller of the last two <code>best</code>.',
      ],
      code: '// cost = [10, 15, 20]\n// best = [10, 15, 30]\n// to the forge: min(15, 30) = 15',
    },
    hints: ['From where can you step onto step i?', 'best[0] = cost[0], best[1] = cost[1]; for i ≥ 2: best[i] = cost[i] + min(best[i - 1], best[i - 2]). The answer is the min of the last two.', 'for (let i = 0; i < cost.length; i++) best[i] = cost[i] + (i < 2 ? 0 : Math.min(best[i - 1], best[i - 2])); return Math.min(best[cost.length - 1], best[cost.length - 2]);'],
    lesson: 'The answer for step i is built from the already written answers for steps i − 1 and i − 2: every step is counted once.',
    doc: ['Stairs to the forge', 'cost[i] — the heat of step i. A move is 1 or 2 steps, starting from 0 or 1.', 'Return the least heat on the way to the forge (past the last step).'],
    talk: [
      'Vulcan, my love, forge my son a weapon. Please!',
      'But the forge has gone out! The shard! Every blow is like the first. First at least get to the forge, the stairs are red-hot.',
      'Let’s count every step once and write it down. The next one only looks at the two before.',
    ],
    quip: 'You made it and didn’t get singed. Well, almost: the fox’s tail caught fire.',
  },
  'forge.iron': {
    title: 'Iron from the carts', topic: 'DP: take or skip',
    brief: '<b>Iron from the carts.</b> Carts of iron stand along the forge. Take as much as you can without taking from two neighbouring carts.',
    statement: [
      'The Cyclopes have brought iron: <code>nums[i]</code> — how much is on cart <code>i</code>. The carts stand in a row, and the carters are watchful: take from two <b>neighbouring</b> carts and they’ll raise a fuss.',
      'Return the most iron you can take. For <code>[2, 7, 9, 3, 1]</code> — <code>12</code> (2 + 9 + 1).',
      'There can be up to 10,000 carts. For every cart the choice is: <b>take</b> (then not the previous one, so it adds to the best up to cart <code>i − 2</code>) or <b>skip</b> (then the best up to <code>i − 1</code> stays). Keep those two numbers and move on.',
    ],
    tool: {
      name: 'two variables instead of a table',
      text: [
        '<code>best(i) = max(best(i − 1), best(i − 2) + nums[i])</code>. No table needed: it’s enough to remember the last two answers — <code>prev2</code> and <code>prev1</code>.',
        'At every cart: <code>cur = max(prev1, prev2 + nums[i])</code>, then shift: <code>prev2 = prev1</code>, <code>prev1 = cur</code>.',
      ],
      code: '// [2, 7, 9, 3, 1]\n// best: 2, 7, 11, 11, 12',
    },
    hints: ['What is the best up to cart i if you take it? And if you skip it?', 'For every x: cur = max(prev1, prev2 + x); prev2 = prev1; prev1 = cur.', 'for (const x of nums) { const cur = Math.max(prev1, prev2 + x); prev2 = prev1; prev1 = cur; }'],
    lesson: 'The “take or skip” DP: the best up to i is the larger of “skip” (i − 1) and “take” (i − 2 + nums[i]). Two numbers, one pass.',
    doc: ['Iron from the carts', 'nums[i] — the iron on cart i. You can’t take from two neighbouring carts.', 'Return the most iron.'],
    talk: [
      'We need a lot of iron, and the carters are cross. They won’t give from neighbouring carts.',
      'For every cart I’ll recount everything from the very start! Every piece from scratch, the way Vulcan forges now!',
      'And we’ll remember what we’ve already counted. Two numbers — and onward.',
    ],
    quip: 'What a heap! And not a squeak from the carters.',
  },
  'forge.coins': {
    title: 'Paying for the metal', topic: 'DP: a table of sums',
    brief: '<b>Paying for the metal.</b> Vulcan asks exactly <code>amount</code> coins for a rare metal. Pay with as few coins as possible.',
    statement: [
      'Aeneas’s weapon needs a rare metal. Vulcan charges exactly <code>amount</code>. <code>coins</code> are the coin values Aeneas has, any number of each.',
      'Return the fewest coins that add up to <code>amount</code>, or <code>-1</code> if it can’t be made. For <code>[1, 2, 5]</code> and <code>11</code> — <code>3</code> (5 + 5 + 1); for <code>[2]</code> and <code>3</code> — <code>-1</code>.',
      'Greedy (biggest first) won’t do: for <code>[1, 3, 4]</code> and <code>6</code> greedy gives 4 + 1 + 1, but 3 + 3 is better. Count a table: <code>dp[a]</code> — the fewest coins for the sum <code>a</code>, from 0 to <code>amount</code>.',
    ],
    tool: {
      name: 'a table of sums',
      text: [
        '<code>dp[0] = 0</code>, the rest are <code>Infinity</code> for now. For every sum <code>a</code> try every coin <code>c ≤ a</code>: the last coin is <code>c</code>, and the rest is the already counted <code>dp[a − c]</code>.',
        '<code>dp[a] = min(dp[a], dp[a − c] + 1)</code>. At the end <code>dp[amount]</code> is the answer, unless it is <code>Infinity</code>.',
      ],
      code: '// coins = [1, 3, 4], amount = 6\n// dp: 0  1  2  1  1  2  2\n//     0  1  2  3  4  5  6',
    },
    hints: ['What could the last coin be in the best set for the sum a?', 'For a from 1 to amount: for every coin c ≤ a — dp[a] = min(dp[a], dp[a - c] + 1).', 'for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);'],
    lesson: 'When the greedy choice fails, count a table of all smaller sums: each leans on the ones already counted.',
    doc: ['Paying for the metal', 'Return the fewest coins from coins (any number of each) that make amount, or -1.'],
    talk: [
      'The metal is rare, the price is fair. But I don’t like being paid a handful of small change. The fewest coins!',
      'Biggest first isn’t always best. Let’s count for every sum from zero, and build the bigger ones from the smaller.',
    ],
    quip: 'Exactly that much, and not one coin too many. Charon would weep with envy.',
  },
  'forge.lcs': {
    title: 'A shared melody', topic: 'DP: a table for two strings',
    brief: '<b>A shared melody.</b> Two Cyclopes forge to different rhythms. Find the longest shared melody of their songs.',
    statement: [
      'The Cyclopes sing so their hammers strike in time. The songs are strings of notes <code>text1</code> and <code>text2</code>. A shared melody is notes that occur in both songs <b>in the same order</b>, though not necessarily in a row.',
      'Return the length of the longest shared melody. For <code>"abcde"</code> and <code>"ace"</code> — <code>3</code> (“ace”); for <code>"abc"</code> and <code>"def"</code> — <code>0</code>.',
      'Keep a table <code>dp[i][j]</code> — the answer for the first <code>i</code> notes of the first song and the first <code>j</code> of the second. If the last notes are equal — it’s <code>dp[i − 1][j − 1] + 1</code>. Otherwise drop one of them: <code>max(dp[i − 1][j], dp[i][j − 1])</code>.',
    ],
    tool: {
      name: 'a table for two strings',
      text: [
        'Row 0 and column 0 of the table are zeros: there’s nothing shared with an empty song. Fill it row by row, left to right: every cell looks at three neighbours already counted.',
        'The answer is in the bottom-right corner: <code>dp[text1.length][text2.length]</code>.',
      ],
      code: '//       ""  a  c  e\n//  ""    0  0  0  0\n//  a     0  1  1  1\n//  b     0  1  1  1\n//  c     0  1  2  2\n//  d     0  1  2  2\n//  e     0  1  2  3',
    },
    hints: ['What can you say if the last notes of both beginnings are equal? And if they differ?', 'For i from 1 and j from 1: if text1[i - 1] === text2[j - 1] — dp[i][j] = dp[i - 1][j - 1] + 1, otherwise max(dp[i - 1][j], dp[i][j - 1]).', 'for (let i = 1; i <= text1.length; i++) for (let j = 1; j <= text2.length; j++) dp[i][j] = text1[i - 1] === text2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);'],
    lesson: 'For two strings the table dp[i][j] holds the answer for every pair of beginnings: equal ends — diagonal +1, different — the larger neighbour.',
    doc: ['A shared melody', 'Return the length of the longest common subsequence of text1 and text2.'],
    talk: [
      'My Cyclopes don’t strike in time! One sings one thing, the other another. Find a shared melody, let them forge to it.',
      'We’ll count every pair of song beginnings once and write it in a table. The rest will be built from them.',
    ],
    quip: 'Hear that? They strike together! Now that’s a forge!',
  },
  'forge.lis': {
    title: 'The longest blade', topic: 'DP: the best that ends here',
    brief: '<b>The longest blade.</b> A blade is forged from plates, each harder than the one before. What’s the most plates the blade can take?',
    statement: [
      'Vulcan forges Aeneas a sword. Plates lie in a row on the anvil: <code>nums[i]</code> — the hardness of plate <code>i</code>. A blade is made of plates <b>in the order</b> they lie, and every next one must be <b>strictly harder</b> than the previous. Plates may be skipped.',
      'Return the most plates that go into the blade. For <code>[10, 9, 2, 5, 3, 7, 101, 18]</code> — <code>4</code> (for example, 2, 3, 7, 18).',
      'There can be up to 500 plates. For every plate <code>i</code> count <code>dp[i]</code> — the longest blade that <b>ends</b> on it: 1 plus the best <code>dp[j]</code> among the earlier, softer plates. The answer is the largest of all <code>dp</code>.',
    ],
    tool: {
      name: 'the best that ends here',
      text: [
        'It’s often handy to ask not “what’s the answer for the first i?”, but “what’s the best answer that ends exactly at i?”. Then the last element is known, and it’s easy to extend with earlier ones.',
        '<code>dp[i] = 1 + max(dp[j])</code> over all <code>j &lt; i</code> with <code>nums[j] &lt; nums[i]</code> (or just 1 if there are none).',
      ],
      code: '// nums = [2, 5, 3, 7]\n// dp   = [1, 2, 2, 3]   (7 extends 2→5 or 2→3)',
    },
    hints: ['What can the longest blade ending exactly at plate i be?', 'dp[i] = 1. For every j < i: if nums[j] < nums[i] — dp[i] = max(dp[i], dp[j] + 1). The answer is max(dp).', 'for (let i = 0; i < nums.length; i++) for (let j = 0; j < i; j++) if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);'],
    lesson: 'dp[i] is the best that ends at i: O(n²) instead of trying every set. And if you keep the smallest “tails” of blades and search by halves — it even becomes O(n log n).',
    doc: ['The longest blade', 'Return the length of the longest strictly increasing subsequence of nums.'],
    talk: [
      'The forge is burning again! Now for the main thing: the blade. The plates harden one after another, that way and no other.',
      '(somewhere in Turnus’s camp) I’m forging too! Every blade from scratch, every possible set of plates… Oops, the recursion blew up.',
      'For every plate — the longest blade that ends on it. Write it down — and move on, re-forging nothing.',
    ],
    quip: 'What a weapon! Son, now you’re ready for Turnus. And I’ll thank Vulcan… separately.',
  },
  'duel.product': {
    title: 'The crew’s strength', topic: 'interview: recognise the technique yourself',
    brief: '<b>The crew’s strength.</b> Round one. For every warrior, compute the strength of the whole crew without them.',
    statement: [
      'Before the duel Turnus demands to see the Trojans’ strength. <code>nums[i]</code> is the strength of warrior <code>i</code>. The crew’s strength is the <b>product</b> of the strengths.',
      'Return an array where position <code>i</code> holds the product of all <code>nums</code> except <code>nums[i]</code>. No division: strengths can be zero. For <code>[1, 2, 3, 4]</code> — <code>[24, 12, 8, 6]</code>.',
      'There can be up to 10,000 warriors. Which trick to use is up to you.',
    ],
    hints: ['The trick is prefixes: the product of everything left of i times the product of everything right of it.', 'First pass from the left: out[i] = the product of everything before i. Second from the right: keep p — the product to the right, out[i] *= p.', 'let p = 1; for (let i = 0; i < nums.length; i++) { out[i] = p; p *= nums[i]; } p = 1; for (let i = nums.length - 1; i >= 0; i--) { out[i] *= p; p *= nums[i]; }'],
    lesson: 'Prefixes and suffixes: “everything except i” = “everything to the left” × “everything to the right”. Two passes, O(n).',
    doc: ['The crew’s strength', 'Return an array: at position i — the product of all nums except nums[i]. No division.'],
    talk: [
      'Show me, Trojan, what your crew is worth. And no division — I’m an honest warrior.',
      'You know every trick already. I’m just keeping my fingers crossed. All four paws.',
    ],
    quip: 'Hm. You can count. We’ll see what comes next.',
  },
  'duel.rotated': {
    title: 'The shield’s weak spot', topic: 'interview: recognise the technique yourself',
    brief: '<b>The shield’s weak spot.</b> Round two. Turnus’s shield spins. Find its thinnest plate.',
    statement: [
      'Turnus’s shield is made of plates whose thickness went in increasing order. But the shield spins, so the row <code>nums</code> is shifted in a circle: <code>[3, 4, 5, 1, 2]</code> is <code>[1, 2, 3, 4, 5]</code> shifted by three. All thicknesses are different.',
      'Return the smallest thickness — that’s where to strike. For <code>[4, 5, 6, 7, 0, 1, 2]</code> — <code>0</code>.',
      'There can be up to 10,000 plates, and the shield spins fast: you can’t look at them all. Which trick to use is up to you.',
    ],
    hints: ['The trick is halving: compare the middle with the right end, and it’s clear which half holds the break.', 'While lo < hi: mid = (lo + hi) >> 1. If nums[mid] > nums[hi] — the break is to the right: lo = mid + 1. Otherwise hi = mid.', 'while (lo < hi) { const mid = (lo + hi) >> 1; if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid; }'],
    lesson: 'Binary search works on a shifted row too: comparing with the right end tells which half holds the break.',
    doc: ['The shield’s weak spot', 'nums is an increasing row shifted in a circle. Return the smallest value.'],
    talk: [
      'My shield was forged by Vulcan himself… for me. Strike, if you can find where.',
      'You’ve seen something like this in Konotop. Well, almost. I’m quiet, I’m quiet!',
    ],
    quip: 'A hit! The thinnest one! Who taught you, Trojan?',
  },
  'duel.streak': {
    title: 'The longest rank', topic: 'interview: recognise the technique yourself',
    brief: '<b>The longest rank.</b> Round three. From the scattered numbers of the warriors, build the longest consecutive rank.',
    statement: [
      'Turnus’s army has scattered, and the warriors have numbers on their shields. <code>nums</code> are the numbers in the order they were seen (they may repeat).',
      'Return the length of the longest run of numbers that come <b>in a row</b>: x, x + 1, x + 2… The order in <code>nums</code> doesn’t matter. For <code>[100, 4, 200, 1, 3, 2]</code> — <code>4</code> (1, 2, 3, 4).',
      'There can be up to 10,000 numbers, and there’s no time to sort (and <code>sort</code> is forbidden in this exercise). Which trick to use is up to you.',
    ],
    hints: ['The trick is the chest (a Set): “is x + 1 there?” is answered instantly.', 'Put everything into a Set. For every x that has no x − 1 (the start of a run), count upward while x + 1, x + 2… exist.', 'const set = new Set(nums); for (const x of set) if (!set.has(x - 1)) { let y = x; while (set.has(y + 1)) y++; best = Math.max(best, y - x + 1); }'],
    lesson: 'A Set answers “is it there?” instantly, and counting only from the starts of runs makes it all O(n).',
    doc: ['The longest rank', 'Return the length of the longest run of consecutive numbers (x, x + 1, …) in nums. No sorting.'],
    talk: [
      'My warriors have scattered? No matter, I’ll gather the longest rank without them… I mean, from them.',
      'Aeneas! Psst! I… I’ve been thinking. Juno never gave me the forest. And they say Kotliarevsky has a feast. I’m on your side!',
      'The Wolf on our side? Fine. But you’re the one solving the problem.',
    ],
    quip: 'I’d have searched for every number across the whole army. As always. Good thing I’m with you now.',
  },
  'duel.view': {
    title: 'The view from the right flank', topic: 'interview: recognise the technique yourself',
    brief: '<b>The view from the right flank.</b> Round four. Turnus’s army stands like a tree. Who can be seen from the right side?',
    statement: [
      'Turnus has drawn up his army like a family tree: <code>root</code> is Turnus himself, every commander has at most two subordinates, <code>left</code> and <code>right</code>.',
      'Aeneas looks at the army from the right flank: on every level he sees only the rightmost one. Return the values he sees, top to bottom. For <code>[1, 2, 3, null, 5, null, 4]</code> — <code>[1, 3, 4]</code>; for <code>[1, 2, 3, 4]</code> — <code>[1, 3, 4]</code>: the third level has only 4.',
      'Which trick to use is up to you.',
    ],
    hints: ['The trick is a breadth-first walk by levels, as in Elysium: take the last one from every level.', 'level = [root]. While the level isn’t empty: out.push(the last in level), then gather the children into next.', 'let level = root ? [root] : []; while (level.length) { out.push(level[level.length - 1].val); const next = []; for (const n of level) { if (n.left) next.push(n.left); if (n.right) next.push(n.right); } level = next; }'],
    lesson: 'A breadth-first walk by levels: the last node of every level is the one seen from the right.',
    doc: ['The view from the right flank', 'Return the values of the rightmost nodes on every level, top to bottom.'],
    talk: [
      'My army is like a tree: I’m the root, and then the branches. Go on, count whom you see.',
      'You’ve seen trees like this. In Elysium. I told you, I’m only cheering!',
    ],
    quip: 'You see everyone standing at the edge. You’re dangerous, Trojan.',
  },
  'duel.three': {
    title: 'The final blow', topic: 'interview: recognise the technique yourself',
    brief: '<b>The final blow.</b> The final round. Find every triple of blows that together make a balance.',
    statement: [
      'Turnus fights Aeneas one on one. <code>nums</code> are the strengths of the blows: positive ones are Aeneas’s, negative ones Turnus’s. To knock Juno’s charm-shard out of Turnus’s hands, you need three blows that add up to exactly <code>0</code>.',
      'Return all <b>different</b> triples <code>[a, b, c]</code> from different places in <code>nums</code> with <code>a + b + c = 0</code>. Triples with the same numbers count as one. Order doesn’t matter. For <code>[-1, 0, 1, 2, -1, -4]</code> — <code>[[-1, -1, 2], [-1, 0, 1]]</code>.',
      'There can be up to 500 blows, and trying every triple is over a hundred thousand… for every second of the duel. Which trick to use is up to you.',
    ],
    hints: ['The trick is from Carthage: sort the blows and for every first one look for a pair with two pointers moving towards each other.', 'Sort a copy. For every i (skipping equal neighbours): l = i + 1, r = the end; sum < 0 — l++, > 0 — r--, 0 — record it and skip equal ones.', 'for (let i = 0; i < a.length; i++) { if (i && a[i] === a[i - 1]) continue; let l = i + 1, r = a.length - 1; while (l < r) { const s = a[i] + a[l] + a[r]; if (s < 0) l++; else if (s > 0) r--; else { out.push([a[i], a[l], a[r]]); while (l < r && a[l] === a[l + 1]) l++; l++; r--; } } }'],
    lesson: 'Sorting + two pointers turn an O(n³) search over triples into O(n²). In an interview the main thing is to recognise a familiar technique in a new problem.',
    doc: ['The final blow', 'Return all different triples of numbers from nums that add up to 0 (any order).'],
    talk: [
      'Well then, Trojan. One on one. Juno’s charm is with me — try to knock it out.',
      'Aeneas, I’m holding Juno back! I mean… I’m looking at her. Menacingly. Strike!',
      'You already know everything you need. Carthage, Konotop, the chest… Choose. I believe in you.',
    ],
    quip: 'I yield… The charm is yours. Juno, you promised he wouldn’t manage!',
  },
};

export const WORLDS_EN: Record<number, { host: { who: string; line: string }; trick?: string }> = {
  0: { host: { who: 'Mykyta', line: 'There are still plenty of our people and grain here. You could pick up every sack by hand… but a loop is craftier.' } },
  1: { host: { who: 'Aeolus', line: 'Ha! My winds scattered your fleet. Go on, try lining it up!' }, trick: 'Waves: in-place ordering' },
  2: { host: { who: 'Dido', line: 'As much land as you can fence with a hide is mine. The posts are already standing, pick two.' }, trick: 'Two pointers' },
  3: { host: { who: 'King Lion', line: 'Nobody remembers who sells what. Put things in order, and Mykyta will be chancellor again. For a minute.' }, trick: 'The chest of cells: a hash map' },
  4: { host: { who: 'The mitten’s residents', line: 'Whoever got in last gets out first. Otherwise the mitten will burst!' }, trick: 'The tower: a stack' },
  5: { host: { who: 'Captain Zabrokha', line: 'We throw every one of them into the pond in turn! What do you mean, “split in half”? Well, go on, try.' }, trick: 'The halved rhombus: binary search' },
  6: { host: { who: 'Acestes', line: 'Games in honour of Anchises! Only the scoreboard is broken. So who won?' }, trick: 'The frame: a sliding window and a heap' },
  7: { host: { who: 'Pale Ox', line: 'The train has been going in circles for the third night. I’m slow and the fox is quick — let them see whether we meet.' }, trick: 'The chain: a linked list' },
  14: { host: { who: 'Vulcan', line: 'The forge has gone out, and every blow is like the first! Learn not to forge the same thing twice.' }, trick: 'The honeycomb: dynamic programming' },
  13: { host: { who: 'Turnus', line: 'The fox is mine, Trojan. Look for him at night, among my guards — if you can find the way.' }, trick: 'The key: shortest paths' },
  15: { host: { who: 'Turnus', line: 'The last shard is mine, Trojan. Juno gave it to me as a charm. Win it — if you can.' }, trick: 'The Pysanka: how to recognise a technique' },
  12: { host: { who: 'Kyrylo Kozhumyaka', line: 'I harnessed the Serpent to a plough and ploughed these walls. And the shard cut them into scraps!' }, trick: 'The zigzag: intervals and the greedy choice' },
  11: { host: { who: 'Molfar', line: 'Fog has wrapped the meadows, and the trembitas are silent. Give the mountains back their voice.' }, trick: 'The rosette: walking a graph' },
  10: { host: { who: 'Mavka', line: 'Every tree had its place: younger to the left, older to the right. Bring order back to the forest — and it will wake.' }, trick: 'The periwinkle: a search tree' },
  9: { host: { who: 'Anchises', line: 'Here is your line, son. The branches got tangled — help me untangle them.' }, trick: 'The tree of life: binary trees' },
  8: { host: { who: 'Charon', line: 'A boat for two, and the weight is limited. Who rows with whom is for you to decide.' }, trick: 'The spiral: recursion and backtracking' },
};

export const BOOK_EN: Record<number, { title: string; when: string[]; idea: string; complexity: string }> = {
  1: {
    title: 'Waves: in-place ordering',
    when: ['You need to rearrange array elements without a new array.', 'There are few values (0/1/2, “yes/no”) — groups matter more than comparisons.'],
    idea: 'Keep the borders of the groups as indices: where the next element of each group goes. One pass, swaps instead of shifts.',
    complexity: 'Time O(n), memory O(1).',
  },
  2: {
    title: 'Two pointers',
    when: ['The array or string is sorted or symmetric.', 'You are looking for a pair (sum, area, match) among all pairs.', 'You need to remove or rearrange elements in place.'],
    idea: 'Instead of trying all pairs in O(n²), keep two indices. Towards each other — from both ends (palindrome, Two Sum II, Dido’s problem). Slow and fast — in one direction (duplicates). Each step rules out options that can no longer be better.',
    complexity: 'Time O(n), memory O(1).',
  },
  3: {
    title: 'The chest of cells: a hash map',
    when: ['You keep asking “have I seen this already?” or “how many times?”.', 'You look for a pair, but the array is not sorted.', 'Items need to be grouped by a shared feature.'],
    idea: 'Don’t search again — remember. A Set answers “have I seen it?”, a Map keeps “key → value” (a count, an index, a group). Every check is instant, so one pass replaces a loop inside a loop.',
    complexity: 'Time O(n), memory O(n).',
  },
  4: {
    title: 'The tower: a stack',
    when: ['The last thing that arrived is the first that matters: brackets, undo, nested structures.', 'For each element you need the next greater (or smaller) one.', 'An expression is evaluated step by step, each operation taking the latest values.'],
    idea: 'Keep an array and work only with its end: push puts on top, pop takes the top. A monotonic stack keeps the elements still waiting for an answer; each new one answers all the weaker ones on top, so every element is pushed and popped once.',
    complexity: 'Time O(n), memory O(n).',
  },
  5: {
    title: 'The halved rhombus: binary search',
    when: ['The data is sorted, or the answer turns from “no” to “yes” at some point.', 'You need the place where something starts: the first bad, the first not smaller.', 'You can check a candidate answer, and every bigger one works too.'],
    idea: 'Keep the boundaries lo and hi where the answer can still be. Look at the middle and drop the half where it surely isn’t. Every look halves the range: 10,000 elements take 14 looks. Sometimes you halve not the array but the possible answers.',
    complexity: 'Time O(log n) (or O(n log max) when searching the answer), memory O(1).',
  },
  6: {
    title: 'The frame: a sliding window and a heap',
    when: ['You need the best stretch of consecutive elements: a sum, a length, no repeats.', 'Neighbouring windows differ only at their edges.', 'At every step you need the largest or the smallest, or the k best.'],
    idea: 'Don’t recompute each window from scratch: move it — add what comes in on the right, remove what leaves on the left. A window can be fixed or stretch and shrink. When you keep needing the biggest or smallest, hold the candidates in a heap: putting in and taking out cost log n.',
    complexity: 'Window: time O(n), memory O(1) or O(k). Heap: O(log n) per operation.',
  },
  7: {
    title: 'The chain: a linked list',
    when: ['Data comes as nodes, each knowing only the next one.', 'You need to reverse, merge or cut a list without copying it.', 'You need the middle or a cycle in one pass and without extra memory.'],
    idea: 'Walk from the head through next until null. Before re-hooking a link, remember where it led (prev, node, next). A dummy head removes the special case at the start. Slow and fast pointers find the middle and a cycle: on a loop they are bound to meet.',
    complexity: 'Time O(n), memory O(1).',
  },
  8: {
    title: 'The spiral: recursion and backtracking',
    when: ['A problem breaks into the same problem, only smaller.', 'You need all variants: subsets, orders, combinations.', 'The answer is built step by step, and a wrong step must be undone.'],
    idea: 'A recursive function needs a base case and a step towards it. What happens before the call is on the way down; after — on the way back. Backtracking walks a tree of decisions: make a choice, go deeper, come back and undo it. Put a copy of the path into the answer. A start index keeps the same set from being counted twice.',
    complexity: 'Subsets O(2ⁿ · n), permutations O(n! · n): the answers themselves are that many.',
  },
  9: {
    title: 'The tree of life: binary trees',
    when: ['Data comes as nodes with two children: a family tree, a hierarchy, a tournament.', 'The answer for a node is built from the answers for its branches: depth, sum, “is it here?”.', 'You need to walk a tree level by level.'],
    idea: 'Recursion in depth: solve it for the left branch, for the right one, then combine at the node; the base case is null. Breadth-first walk: keep the current level and gather the next from it. Answers can rise from below: a branch returns what it found, and where two finds meet is the ancestor.',
    complexity: 'Time O(n): every node is visited once. Memory O(h) for recursion (h — the height) or O(width) for a level.',
  },
  10: {
    title: 'The periwinkle: a search tree',
    when: ['The data is a tree where everything on the left is smaller and everything on the right bigger.', 'You need to find, insert or check a value without walking everything.', 'You need values in order: the k-th smallest, the next one, a range.'],
    idea: 'Every comparison tells you which branch to go to, so search and insert take as many steps as the tree has storeys. A new node always becomes a leaf. Checking the order needs bounds that narrow from the top, not just parent–child comparisons. An inorder walk (left, node, right) yields the values in increasing order.',
    complexity: 'Search and insert O(h): O(log n) in a balanced tree. Inorder O(n).',
  },
  11: {
    title: 'The rosette: walking a graph',
    when: ['Things are connected: grid cells, villages and roads, crafts and their requirements.', 'You need everything reachable from a point, or the number of separate groups.', 'You need the distance in steps, or an order without loops.'],
    idea: 'A depth-first walk (stack or recursion) visits everything reachable; mark the visited so you don’t walk in circles. A breadth-first walk goes in waves, and the wave number is the distance. A walk from every cell can often be replaced by one from the goals backwards. Topological sorting: take what waits for nothing and unlock the next; whatever is left over is a loop.',
    complexity: 'Time O(V + E): every cell or vertex and every link once. Memory O(V).',
  },
  12: {
    title: 'The zigzag: intervals and the greedy choice',
    when: ['The data are stretches [start, end]: walls, meetings, serpents.', 'You need to merge, insert or remove overlaps.', 'The best choice right now never spoils the future: the farthest jump, the earliest end.'],
    idea: 'Sort the intervals: by start to merge, by end to keep the most or to shoot the fewest arrows. After sorting, every new interval only needs to be compared with the last one. A greedy algorithm makes the best local choice at every step and never goes back — it works when that choice can be proven not to spoil the answer.',
    complexity: 'Time O(n log n) for sorting plus O(n) for the pass. Memory O(1)–O(n).',
  },
  13: {
    title: 'The key: shortest paths',
    when: ['You need the fewest steps or the cheapest way from one point to another.', 'All steps are equal (a grid, a maze) — or they have different costs (roads, runners).', 'Distances are needed from many sources at once.'],
    idea: 'Equal steps — breadth-first search: the first touch of a vertex is the shortest. Several sources — put them all into the first wave. Different step costs — Dijkstra: keep candidates in a heap, and the nearest one popped already has its final distance. The “cost” can be not only a sum but also the largest step on the path.',
    complexity: 'BFS O(V + E). Dijkstra with a heap O(E log V).',
  },
  14: {
    title: 'The honeycomb: dynamic programming',
    when: ['The problem breaks into smaller ones that repeat: the same step is counted many times.', 'You need the best (min, max) or the number of ways, and the choices depend on earlier ones.', 'Brute force grows exponentially, but the number of distinct states is small.'],
    idea: 'Name the state (best[i], dp[a], dp[i][j]) and the transition: how the answer for a state is built from smaller ones. Solve states from the smallest and write them in a table, so nothing is forged twice. Often only the last couple of values are needed — then two variables are enough. A handy question: “what is the best that ends exactly here?”.',
    complexity: 'Time = number of states × the cost of a transition: O(n), O(n · amount), O(n · m), O(n²). Memory — the table or a couple of variables.',
  },
  15: {
    title: 'The Pysanka: how to recognise a technique',
    when: ['In an interview the problem never says its topic — the signals in the statement do.', 'Sorted, or a pair to find → two pointers or binary search. “Have I seen it?” → a hash map.', 'Consecutive stretches → a window. Next greater, brackets → a stack. Nodes and links → a list, a tree, a graph.', 'All variants → backtracking. Best or count of ways with repeating steps → DP. Shortest → BFS or Dijkstra.'],
    idea: 'Start with the brute force and its cost, then ask: what is it repeating? What could it remember (a map, a table)? What could it skip (sorting, halving, a window)? Name the technique out loud, write a template, then adapt it. Check edge cases: empty, one element, repeats, negatives.',
    complexity: 'Know the target: n up to 10⁴–10⁵ usually needs O(n log n) or better; up to 500 allows O(n²); up to 20 — even O(2ⁿ).',
  },
};

export const TROJANS_EN = ['a warrior with a spear', 'a sailor', 'old Anchises', 'a woman with a bundle'];

/** English texts of the 13 onboarding scenes (site artbook order). */
export const OB_EN: { title: string; narr: string; lines: [string, string][] }[] = [
  { title: 'Olympus', narr: 'Long ago, when the worlds still stood in order, the Crystal Pysanka shone on Olympus. Everything held on its patterns: seas in their shores, beasts in their tales, problems in their answers. And the gods feasted.', lines: [['Zeus', 'Pour it! While the Pysanka is whole, the world counts itself.'], ['Bacchus', 'To order! To problems that have answers!'], ['Apollo', 'And I shall sing — in hexameter, as is proper!'], ['Juno', 'Feast away, feast away… The fate of Aeneas is in that Pysanka too.']] },
  { title: 'The plot', narr: 'Juno summons Aeolus: the fate of Aeneas is written in the Pysanka, so the Pysanka must be broken.', lines: [['Juno', 'Break it, and there will be no fate. I pay well: a sack of gold and an eternal day off.'], ['Aeolus', 'Well… for you, even a hurricane.']] },
  { title: 'The bag of winds', narr: 'Aeolus unties the bag and the winds burst free. Clouds whirl over Olympus.', lines: [['Aeolus', 'Off you go, lads, have fun!']] },
  { title: 'The storm', narr: 'The bang was so loud that Zeus sobered up. The Pysanka shattered, and the shards flew into books. In every book a shard fell into, order went topsy-turvy.', lines: [] },
  { title: 'Shards in the books', narr: 'Thirteen shards fly into the spines of books. The map flares up with thirteen marks and goes dark.', lines: [] },
  { title: 'Venus’s plea', narr: 'Venus, the mother of Aeneas, runs to Zeus. He is still holding his head after the feast, but he listens.', lines: [['Venus', 'Zeus, dear father! Without the Pysanka my Aeneas is lost: his fate is scattered across the books.'], ['Zeus', 'Oh, my head… Fine. Let him gather the thirteen shards himself. The word of order will help him, and the Sibyl will guide him.'], ['Venus', 'And Juno?'], ['Zeus', 'Juno can try.']] },
  { title: 'Franko’s forest', narr: 'Anyone who knows the tale knows Mykyta will fall into the vat. But this time the vat had a hole into another world.', lines: [['Mykyta', 'Oh, and what treat is this?']] },
  { title: 'The Wolf and the shard', narr: 'Nearby another shard glows in the grass. The Greedy Wolf, as always, swallows first and thinks later.', lines: [['Wolf', 'Can’t let good food go to waste!'], ['Wolf', '…hic!']] },
  { title: 'The oath', narr: 'The Greedy Wolf swallows another shard and thuds onto the floor of Juno’s halls, already humanised.', lines: [['Juno', 'Serve me, and the whole forest is yours for dinner.'], ['Wolf', 'The whole whole forest? Hares too?']] },
  { title: 'Ashes of Troy', narr: 'Aeneas was a lively lad / and a coder, Cossack-bold, / quick at every task he had, / keener than the boatmen old.', lines: [['Mykyta', 'Is this… Troy? Where is my forest? And why am I wearing trousers?'], ['Aeneas', 'Where are you from, ginger? I mean… grey?']] },
  { title: 'First step', narr: 'The editor opens for the first time. The line enei.move() is already there. The “Run” button pulses.', lines: [['Sibyl', 'Say the word and the world will obey.']] },
  { title: 'The Sibyl', narr: 'Order rests on the exact word. On the left the word, on the right the world, and “Step” shows how the world carries out every word.', lines: [['Sibyl', 'Say it crooked and the world goes crooked. Say it right and the world obeys.']] },
  { title: 'Gathering the crew', narr: 'Aeneas gathers the surviving Trojans and the grain. The first exercises of world 0: a loop, a condition, a counter.', lines: [['Aeneas', 'Let’s gather our people and leave no grain behind.'], ['Mykyta', 'You could pick up every sack by hand… but a loop is craftier.']] },
  { title: 'Setting sail', narr: 'The ship sails into a crack between worlds, and Mykyta turns sea blue. That is how Kodeida began.', lines: [['Mykyta', 'I smell… the sea and a shard. That way!']] },
];
