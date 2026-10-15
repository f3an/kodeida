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
  },
};

export const WORLDS_EN: Record<number, { host: { who: string; line: string }; trick?: string }> = {
  0: { host: { who: 'Mykyta', line: 'There are still plenty of our people and grain here. You could pick up every sack by hand… but a loop is craftier.' } },
  1: { host: { who: 'Aeolus', line: 'Ha! My winds scattered your fleet. Go on, try lining it up!' }, trick: 'Waves: in-place ordering' },
  2: { host: { who: 'Dido', line: 'As much land as you can fence with a hide is mine. The posts are already standing, pick two.' }, trick: 'Two pointers' },
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
