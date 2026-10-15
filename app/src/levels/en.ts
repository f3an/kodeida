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
    brief: '<b>First step.</b> Mykyta is right next to you. Say the word and Aeneas takes a step.',
    statement: [
      'Aeneas stands among the ashes, and one step away is Mykyta, who has just fallen from the sky.',
      'The code is already written: <code>enei.move()</code> is one step forward. Press “Run” (or ⌘↵).',
      'This is what the word of order — the code — looks like: the world does exactly what is written, nothing more.',
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
      'One <code>enei.move()</code> is one step. Write as many steps as you need.',
      'If Aeneas walks past the well, the road ends and he stumbles.',
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
    brief: '<b>The far well.</b> This well is 15 steps away. You could write 15 lines… or one clever word.',
    statement: [
      'The near well has dried up. The next one is at the very end of the street, 15 cells away.',
      'You could write <code>enei.move()</code> fifteen times, and it would work. But what if the well were a hundred steps away? A thousand?',
      'When the same thing has to be repeated many times, programmers write a <b>loop</b>. Look at the new tool below.',
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
      'Sacks of grain lie by the gate — one on each of the five cells ahead of Aeneas.',
      'A new command: <code>enei.take()</code> picks up the sack where Aeneas stands. To take a sack, he has to walk to it first.',
      'Every sack needs two actions: a step and a pick-up. A loop can repeat not just one command but a whole group.',
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
      'Your code will run on four streets: with <b>3, 5, 8 and 12</b> sacks. If you put the number 3 into the loop, Aeneas will stop too early on the others.',
      'That’s why the function receives <code>n</code> — the number of sacks on the current street. Use it instead of a fixed number.',
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
    brief: '<b>The well out there.</b> The well is at the end of the street, but how many steps away — nobody knows.',
    statement: [
      'Night, smoke, you can’t see a thing. The well is surely at the end of the street, but the streets have different lengths, and this time nobody gives you <code>n</code>.',
      'But Aeneas can check whether he has arrived: <code>enei.atEnd()</code> returns <code>true</code> if Aeneas is at the end of the street and <code>false</code> if not.',
      'When you don’t know how many times to repeat, but you know <b>until when</b>, you need a <code>while</code> loop.',
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
    brief: '<b>Around the fire.</b> Reach the well at the end of the street. Where it burns ahead — jump over.',
    statement: [
      'The rubble is still smouldering. Reach the well at the end of the street without getting burnt.',
      '<code>enei.fireAhead()</code> tells whether the next cell is on fire (<code>true</code> or <code>false</code>). <code>enei.jump()</code> jumps over one cell.',
      'The fire is somewhere else in every test, so before each step you have to <b>decide</b> what to do: step or jump. Walking to the end you already know.',
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
    brief: '<b>At the end of the street.</b> Now the street is a list. Return what lies on the last cell.',
    statement: [
      'Mykyta wrote the street down: what lies on each cell, in order. In programming such a list is called an <b>array</b>: <code>street</code>.',
      'Return what lies on the <b>last</b> cell. The streets in the tests have different lengths, so you’ll have to work out the number of the last cell.',
      'To give the answer back, write <code>return</code> and the value.',
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
    brief: '<b>Count the Trojans.</b> How many survivors stand in the street?',
    statement: [
      'Aeneas gathers his crew. The array <code>street</code> is the street: Trojans, sacks and ashes.',
      'Return how many <code>"trojan"</code> it contains. To do that you have to walk the whole street and count.',
      'To walk the array, use a <code>for</code> loop from <code>0</code> to <code>street.length</code>; to count, use a variable that remembers how many you have found.',
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
      'Before sailing, Anchises wants to know how much grain is in the supplies. <code>nums[i]</code> is the grain in sack <code>i</code>.',
      'Return the sum of all numbers in the array.',
      'It’s almost the same as counting Trojans, except you add the contents of the sack instead of 1.',
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
    brief: '<b>Supplies.</b> Sacks stand in a row. For each one, count the grain in it and in all the sacks before it.',
    statement: [
      'The Trojans load supplies onto the ship and after every sack write down how much is loaded so far. <code>nums[i]</code> is the grain in sack <code>i</code>.',
      'Return an array where position <code>i</code> holds <code>nums[0] + … + nums[i]</code>. For example, for <code>[1, 2, 3, 4]</code> it is <code>[1, 3, 6, 10]</code>.',
      'Constraints: <code>1 ≤ n ≤ 10⁴</code>. The world counts how often the code looks at the sacks: recounting everything for each sack would make the Wolf proud.',
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
      'Aeolus’s storm scattered the fleet. From the mast Mykyta sees the column: <code>ships[i]</code> is how many oars ship <code>i</code> has.',
      'Return the largest number in the array. No <code>Math.max(...ships)</code> — walk the column yourself and remember the best ship.',
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
      'Swap <code>ships[0]</code> and the last ship <b>in place</b> — in the same array, returning nothing.',
      'Columns have different lengths, so work out the number of the last one with <code>length</code>.',
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
      'Change the array <code>ships</code> <b>in place</b>: the first ship becomes the last, the second the second to last… Return nothing.',
      'The <code>reverse()</code> method is forbidden here. Swap ships in pairs.',
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
    brief: '<b>Wrecks to the back.</b> Move the wrecked ships (<code>0</code>) to the end of the column, keeping the order of the others.',
    statement: [
      'After the storm some ships are wrecked — in the array they are <code>0</code>.',
      'Move all zeros to the end <b>in place</b>, and keep the intact ships in the same order.',
      'Constraints: <code>n ≤ 10⁴</code>. If you shift the whole tail after every zero, the storm will end first.',
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
      'Sort <code>ships</code> in ascending order <b>in place</b>. Aeolus took the <code>sort()</code> method away — write the sorting yourself.',
      'The simplest is bubble sort: walk the column and swap neighbours when the left one is bigger; repeat while there are swaps.',
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
      'For Aeolus to calm down, the fleet must sail in order: red sails first, then white, then blue.',
      'The array <code>nums</code> holds only <code>0</code>, <code>1</code> and <code>2</code>. Sort it <b>in place</b>. <code>sort()</code> is forbidden.',
      'Constraints: <code>n ≤ 10⁴</code>. The Wolf on Aeolus’s cloud bubble-sorts — comparing every ship with every other. Try one pass.',
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
    brief: '<b>Meet in the middle.</b> Aeneas starts from the left end of the wall, Mykyta from the right. Add up the pairs until they meet.',
    statement: [
      'Dido measures the wall. Aeneas stands on the left edge, Mykyta on the right, and at every step they add up the two stones they stand on.',
      'Return the array of sums: <code>[walls[0] + walls[n−1], walls[1] + walls[n−2], …]</code>. If one stone is left in the middle, add it as is.',
      'This is where the pair walking <b>from both ends towards each other</b> appears — the main trick of Carthage.',
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
      'Compare characters from both ends towards each other. You won’t need <code>reverse()</code>.',
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
    brief: '<b>The inscription over the gate.</b> Does the inscription read the same both ways, ignoring case, spaces and punctuation?',
    statement: [
      'An inscription is carved over the gates of Carthage. They say the true one reads the same left to right and right to left.',
      'Return <code>true</code> if the string <code>s</code> is a palindrome, considering only letters and digits and ignoring case.',
      'Helpers: <code>/[a-z0-9]/i.test(ch)</code> — is it a Latin letter or a digit; <code>ch.toLowerCase()</code>.',
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
      'At the Carthage market merchants stand in ascending price order: <code>numbers</code> is sorted.',
      'Find two different merchants whose prices add up to <code>target</code> and return their numbers <b>starting from one</b>: <code>[i + 1, j + 1]</code>, where <code>i &lt; j</code>. There is always exactly one answer.',
      'Constraints: <code>n ≤ 10⁴</code>. The Wolf asks every pair of merchants — the market will close first.',
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
    brief: '<b>Measures without repeats.</b> On a sorted tape of measures remove the repeats in place and return how many are left.',
    statement: [
      'The shard tangled the measures: on the tape <code>nums</code> (sorted) some repeat.',
      'Keep each measure once <b>in place</b>: the first <code>k</code> elements must be the unique measures in the same order. Return <code>k</code>. Whatever is after <code>k</code> does not matter.',
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
    brief: '<b>Dido’s problem.</b> Posts stand in a row, the height of each in the array <code>height</code>. Fence the plot with two posts that holds the most water.',
    statement: [
      'Dido may take as much land as she can fence with an ox hide. A shard of the Pysanka tangled the measures, and the walls don’t meet. The posts are already standing — pick two.',
      'Given an array <code>height</code> of length <code>n</code>. Post <code>i</code> has height <code>height[i]</code>. Two posts together with the ground form a plot: water in it rises to the lower post.',
      'Return the largest amount of water: <code>(j − i) · min(height[i], height[j])</code>.',
      'Constraints: <code>2 ≤ n ≤ 10⁵</code>, <code>0 ≤ height[i] ≤ 10⁴</code>. The world counts how often the code looks at the posts: the Wolf tries every pair while the hide dries out.',
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
    brief: '<b>Two of a kind.</b> Are two identical goods for sale at the fair?',
    statement: [
      'Everything got mixed up at the animals’ fair: they say someone is selling the same thing twice. <code>nums[i]</code> is the number of the goods at stall <code>i</code>.',
      'Return <code>true</code> if some number appears at least twice, and <code>false</code> if they are all different.',
      'Constraints: <code>n ≤ 10⁴</code>. For every item the Wolf walks the whole fair again. You just <b>remember</b> what you have already seen.',
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
    brief: '<b>The best seller.</b> Which goods sell most often at the fair?',
    statement: [
      'King Lion wants to know what the fair has most of. <code>goods</code> is the list of the morning’s sales, one entry per sale.',
      'Return the goods that appear most often. In the tests there is always exactly one such item.',
      'For every item you need to remember not just “have I seen it” but <b>how many times</b>. That calls for a <code>Map</code>.',
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
      'Two carts came to the fair. Every thing is marked with a letter: <code>s</code> is the load of the first cart, <code>t</code> of the second.',
      'Return <code>true</code> if the carts hold the same things in the same amounts (order doesn’t matter), otherwise <code>false</code>. The letters are lower-case Latin, as on LeetCode.',
      'You can count up for the first cart and down for the second. If everything comes to zero, the carts are the same.',
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
    brief: '<b>Two animals.</b> Find two animals whose goods together cost exactly <code>target</code>. The row is not sorted.',
    statement: [
      'The animals stand along the road any old how: <code>nums[i]</code> is the price of animal <code>i</code>’s goods. You can’t sort the row — the animals would be offended.',
      'Return the numbers of two different animals <code>[i, j]</code> (from zero, in any order) whose prices add up to <code>target</code>. There is always exactly one answer.',
      'Constraints: <code>n ≤ 10⁴</code>. Carthage’s two pointers won’t help here: the row isn’t sorted. But you can remember who has already stood where.',
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
    brief: '<b>Animal families.</b> Sort the words into groups: one group holds words made of the same letters.',
    statement: [
      'At the fair the animals sign up by families, but the scribe mixed up the letters in the names. Words made of the same letters are one family.',
      'Return an array of groups: each group is an array of words with the same set of letters. The order of the groups and of the words inside them doesn’t matter.',
      'You need a <b>signature</b> that is the same for the whole family. For example, the word’s letters in alphabetical order: <code>"eat"</code> and <code>"tea"</code> both give <code>"aet"</code>.',
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
    brief: '<b>Best-selling goods.</b> Find the <code>k</code> goods that sell most often, so King Lion can restore trade.',
    statement: [
      'The day’s sales at the fair are written down: <code>nums[i]</code> is the number of the sold goods. King Lion wants to know the <code>k</code> best sellers.',
      'Return <code>k</code> different numbers that appear most often, in any order. In the tests the answer is always unambiguous.',
      'Constraints: <code>n ≤ 10⁴</code>. For every item the Wolf recounts the whole fair from scratch. One pass and the chest are enough for you.',
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
};

export const WORLDS_EN: Record<number, { host: { who: string; line: string }; trick?: string }> = {
  0: { host: { who: 'Mykyta', line: 'There are still plenty of our people and grain here. You could pick up every sack by hand… but a loop is craftier.' } },
  1: { host: { who: 'Aeolus', line: 'Ha! My winds scattered your fleet. Go on, try lining it up!' }, trick: 'Waves: in-place ordering' },
  2: { host: { who: 'Dido', line: 'As much land as you can fence with a hide is mine. The posts are already standing, pick two.' }, trick: 'Two pointers' },
  3: { host: { who: 'King Lion', line: 'Nobody remembers who sells what. Put things in order, and Mykyta will be chancellor again. For a minute.' }, trick: 'The chest of cells: a hash map' },
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
