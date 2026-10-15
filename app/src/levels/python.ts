import type { Level } from '../engine/level.ts';
import { pyEntry } from '../engine/py-core.ts';
import { uiLang } from '../i18n.ts';

/*
 * Python-версії вправ: стартовий код, рішення, інструмент і підказка. Умови, назви й решта текстів
 * лишаються спільними з TS/JS: pyText() лише перекладає їх на Python-звороти (true → True, a.length → len(a)).
 */

export interface PyPart {
  /** Тіло функції в стартовому коді (4 пробіли відступу). */
  body: string;
  solution: string;
  wolf?: string;
  /** Третя підказка: майже готовий код. */
  hint: string;
  /** Код нового інструмента; `text` замінює окремі абзаци пояснення: індекс → [укр, англ]. */
  tool?: { code: string; name?: [string, string]; text?: Record<number, [string, string]> };
}

const HERE = '    # Слово ладу пиши тут\n';

export const PY: Record<string, PyPart> = {
  'troy.step': {
    body: '    enei.move()\n',
    solution: 'def first_step(enei):\n    enei.move()\n',
    hint: 'enei.move()',
    tool: {
      code: 'enei.move()   # Еней робить один крок уперед',
      text: { 2: ['У Python крапки з комою не потрібні: кожна команда живе на власному рядку.', 'Python needs no semicolons: every command lives on its own line.'] },
    },
  },
  'troy.well': {
    body: `${HERE}    pass\n`,
    solution: 'def to_well(enei):\n    enei.move()\n    enei.move()\n    enei.move()\n    enei.move()\n',
    hint: 'enei.move() × 4',
    tool: { code: 'enei.move()   # перший крок\nenei.move()   # другий крок' },
  },
  'troy.far': {
    body: `${HERE}    pass\n`,
    solution: 'def far_well(enei):\n    for i in range(15):\n        enei.move()\n',
    hint: 'for i in range(15):\n    enei.move()',
    tool: {
      code: 'for i in range(3):\n    enei.move()   # виконається 3 рази',
      text: {
        0: ['<code>for</code> повторює все, що записано з відступом під ним (після двокрапки), стільки разів, скільки скажеш.', '<code>for</code> repeats everything written with an indent under it (after the colon) as many times as you say.'],
        1: ['<code>range(3)</code> дає числа 0, 1, 2, а <code>i</code> по черзі стає кожним із них. Лічильник <code>i</code> завжди починає з нуля.', '<code>range(3)</code> gives the numbers 0, 1, 2, and <code>i</code> becomes each of them in turn. The counter <code>i</code> always starts at zero.'],
        2: ['Тож лічильник пройде 0, 1, 2 — це три повтори. Щоб повторити 10 разів, пиши <code>range(10)</code>.', 'So the counter goes 0, 1, 2 — three rounds. To repeat 10 times, write <code>range(10)</code>.'],
      },
    },
  },
  'troy.sacks': {
    body: `${HERE}    pass\n`,
    solution: 'def gate_sacks(enei):\n    for i in range(5):\n        enei.move()\n        enei.take()\n',
    hint: 'for i in range(5):\n    enei.move()\n    enei.take()',
    tool: {
      code: 'for i in range(3):\n    enei.move()\n    enei.move()',
      text: { 0: ['Усе, що стоїть із відступом під <code>for</code>, називається <b>тілом циклу</b>. Тіло виконується повністю, від першого рядка до останнього, і лише потім починається наступний повтор.', 'Everything indented under <code>for</code> is called the <b>loop body</b>. The body runs in full, from the first line to the last, and only then does the next round begin.'] },
    },
  },
  'troy.gather': {
    body: `${HERE}    pass\n`,
    solution: 'def gather(enei, n):\n    for i in range(n):\n        enei.move()\n        enei.take()\n',
    hint: 'for i in range(n):\n    enei.move()\n    enei.take()',
    tool: { code: 'def clap(times):\n    for i in range(times):\n        print("хлоп!")\n\nclap(2)    # хлоп! хлоп!\nclap(5)    # п\'ять разів' },
  },
  'troy.walk': {
    body: `${HERE}    pass\n`,
    solution: 'def walk_on(enei):\n    while not enei.at_end():\n        enei.move()\n',
    hint: 'while not enei.at_end():\n    enei.move()',
    tool: {
      code: 'water = 0\nwhile water < 3:\n    water += 1   # повториться, поки water менше 3',
      text: {
        0: ['<code>while умова:</code> повторює тіло з відступом, <b>поки</b> умова правдива. Перед кожним повтором умова перевіряється знову.', '<code>while condition:</code> repeats the indented body <b>while</b> the condition is true. The condition is checked again before every round.'],
        1: ['Слово <code>not</code> означає «не»: <code>not True</code> — це <code>False</code>, і навпаки. Тож <code>not enei.at_end()</code> читається як «Еней ще не в кінці».', 'The word <code>not</code> means “not”: <code>not True</code> is <code>False</code>, and the other way round. So <code>not enei.at_end()</code> reads “Aeneas is not at the end yet”.'],
      },
    },
  },
  'troy.fire': {
    body: `${HERE}    pass\n`,
    solution: 'def cross_ashes(enei):\n    while not enei.at_end():\n        if enei.fire_ahead():\n            enei.jump()\n        else:\n            enei.move()\n',
    hint: 'while not enei.at_end():\n    if enei.fire_ahead():\n        enei.jump()\n    else:\n        enei.move()',
    tool: {
      code: 'if raining:\n    take_umbrella()   # якщо дощ\nelse:\n    take_cap()        # якщо ні',
      text: { 0: ['<code>if умова:</code> виконує дію з відступом, тільки якщо умова правдива. <code>else:</code> — що робити інакше.', '<code>if condition:</code> runs the indented action only if the condition is true. <code>else:</code> says what to do otherwise.'] },
    },
  },
  'troy.last': {
    body: `${HERE}    pass\n`,
    solution: 'def last_cell(street):\n    return street[len(street) - 1]\n',
    hint: 'return street[len(street) - 1]',
    tool: {
      code: 'days = ["пн", "вт", "ср"]\ndays[0]        # "пн"\nlen(days)      # 3\nreturn days[1] # поверне "вт"',
      text: { 1: ['<code>len(days)</code> — скільки елементів у списку. Оскільки рахуємо з нуля, останній елемент має індекс <code>len(days) - 1</code>.', '<code>len(days)</code> is how many elements the list has. Since we count from zero, the last element has index <code>len(days) - 1</code>.'] },
    },
  },
  'troy.count': {
    body: `    count = 0\n${HERE}\n    return count\n`,
    solution: 'def count_crew(street):\n    count = 0\n    for i in range(len(street)):\n        if street[i] == "троянець":\n            count += 1\n    return count\n',
    hint: 'for i in range(len(street)):\n    if street[i] == "троянець":\n        count += 1',
    tool: {
      code: 'fruits = ["яблуко", "груша", "яблуко"]\napples = 0\nfor i in range(len(fruits)):\n    if fruits[i] == "яблуко":\n        apples += 1\n# apples == 2',
      name: ['змінна-лічильник і ==', 'a counter and =='],
      text: {
        0: ['<code>count = 0</code> створює змінну, яка пам\'ятає число. <code>count += 1</code> додає до неї 1.', '<code>count = 0</code> creates a variable that remembers a number. <code>count += 1</code> adds 1 to it.'],
        1: ['<code>==</code> перевіряє, чи два значення однакові. Не плутай з <code>=</code>, яке записує значення в змінну.', '<code>==</code> checks whether two values are the same. Don’t mix it up with <code>=</code>, which stores a value in a variable.'],
      },
    },
  },
  'troy.total': {
    body: `    total = 0\n${HERE}\n    return total\n`,
    solution: 'def total_grain(nums):\n    total = 0\n    for i in range(len(nums)):\n        total += nums[i]\n    return total\n',
    hint: 'for i in range(len(nums)):\n    total += nums[i]',
    tool: { code: 'coins = [5, 10, 2]\nmoney = 0\nfor i in range(len(coins)):\n    money += coins[i]\n# money == 17' },
  },
  'troy.sum': {
    body: `    result = []\n${HERE}\n    return result\n`,
    solution: 'def running_sum(nums):\n    result = []\n    total = 0\n    for i in range(len(nums)):\n        total += nums[i]\n        result.append(total)\n    return result\n',
    wolf: 'def running_sum(nums):\n    result = []\n    for i in range(len(nums)):\n        s = 0\n        for j in range(i + 1):\n            s += nums[j]\n        result.append(s)\n    return result\n',
    hint: 'total = 0; for i in range(len(nums)): total += nums[i]; result.append(total)',
    tool: {
      code: 'log = []\nlog.append("ранок")\nlog.append("вечір")\n# log — ["ранок", "вечір"]',
      name: ['append', 'append'],
      text: { 0: ['<code>result.append(x)</code> дописує значення <code>x</code> у кінець списку <code>result</code>.', '<code>result.append(x)</code> adds the value <code>x</code> to the end of the list <code>result</code>.'] },
    },
  },
  'sea.max': {
    body: `    best = ships[0]\n${HERE}\n    return best\n`,
    solution: 'def largest(ships):\n    best = ships[0]\n    for i in range(1, len(ships)):\n        if ships[i] > best:\n            best = ships[i]\n    return best\n',
    hint: 'for i in range(1, len(ships)):\n    if ships[i] > best:\n        best = ships[i]',
    tool: { code: 'tallest = heights[0]\nfor i in range(1, len(heights)):\n    if heights[i] > tallest:\n        tallest = heights[i]' },
  },
  'sea.swap': {
    body: `${HERE}    pass\n`,
    solution: 'def swap_ends(ships):\n    last = len(ships) - 1\n    t = ships[0]\n    ships[0] = ships[last]\n    ships[last] = t\n',
    hint: 't = ships[0]; ships[0] = ships[len(ships) - 1]; ships[len(ships) - 1] = t',
    tool: { code: 'cup = a[0]    # відклали перше\na[0] = a[1]   # на його місце — друге\na[1] = cup    # а друге місце займає відкладене' },
  },
  'sea.reverse': {
    body: `${HERE}    pass\n`,
    solution: 'def reverse(ships):\n    i, j = 0, len(ships) - 1\n    while i < j:\n        t = ships[i]\n        ships[i] = ships[j]\n        ships[j] = t\n        i += 1\n        j -= 1\n',
    hint: 'i, j = 0, n − 1; while i < j: swap ships[i] and ships[j]; i += 1; j -= 1',
    tool: { code: 'i, j = 0, len(a) - 1\nwhile i < j:\n    # тут — обмін a[i] і a[j]\n    i += 1\n    j -= 1' },
  },
  'sea.zeroes': {
    body: `${HERE}    pass\n`,
    solution: 'def move_zeroes(nums):\n    k = 0\n    for i in range(len(nums)):\n        if nums[i] != 0:\n            nums[k] = nums[i]\n            k += 1\n    while k < len(nums):\n        nums[k] = 0\n        k += 1\n',
    wolf: 'def move_zeroes(nums):\n    i = 0\n    while i < len(nums):\n        if nums[i] != 0:\n            i += 1\n            continue\n        j = i\n        while j + 1 < len(nums) and nums[j + 1] == 0:\n            j += 1\n        if j + 1 >= len(nums):\n            break\n        for k in range(i, len(nums) - 1):\n            nums[k] = nums[k + 1]\n        nums[len(nums) - 1] = 0\n',
    hint: 'k = 0; for each x ≠ 0: nums[k] = x, k += 1; while k < n: nums[k] = 0, k += 1.',
    tool: { code: 'k = 0\nfor i in range(len(words)):\n    if words[i] != "":\n        words[k] = words[i]\n        k += 1\n# перші k місць — непорожні слова' },
  },
  'sea.sort': {
    body: `${HERE}    pass\n`,
    solution: 'def sort_fleet(ships):\n    for i in range(len(ships)):\n        for j in range(len(ships) - 1 - i):\n            if ships[j] > ships[j + 1]:\n                t = ships[j]\n                ships[j] = ships[j + 1]\n                ships[j + 1] = t\n',
    hint: 'for i in range(n): for j in range(n − 1 − i): if ships[j] > ships[j+1]: swap.',
    tool: { code: 'for round in range(3):\n    for j in range(2):\n        print(round, j)  # 6 рядків: 3 × 2' },
  },
  'sea.colors': {
    body: `${HERE}    pass\n`,
    solution: 'def sort_colors(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        x = nums[mid]\n        if x == 0:\n            nums[mid] = nums[low]\n            nums[low] = 0\n            low += 1\n            mid += 1\n        elif x == 1:\n            mid += 1\n        else:\n            nums[mid] = nums[high]\n            nums[high] = 2\n            high -= 1\n',
    wolf: 'def sort_colors(nums):\n    for i in range(len(nums)):\n        for j in range(len(nums) - 1 - i):\n            if nums[j] > nums[j + 1]:\n                t = nums[j]\n                nums[j] = nums[j + 1]\n                nums[j + 1] = t\n',
    hint: 'low = mid = 0, high = n−1; while mid <= high: 0 → swap with low, low += 1, mid += 1; 1 → mid += 1; 2 → swap with high, high -= 1.',
    tool: { code: '# [ червоні | білі | ще не бачені | сині ]\n#          low     mid        high\n# 0 → обмін з low;   1 → залишити;   2 → обмін з high' },
  },
  'carthage.meet': {
    body: `    sums = []\n    left, right = 0, len(walls) - 1\n${HERE}\n    return sums\n`,
    solution: 'def meet_sums(walls):\n    sums = []\n    left, right = 0, len(walls) - 1\n    while left < right:\n        sums.append(walls[left] + walls[right])\n        left += 1\n        right -= 1\n    if left == right:\n        sums.append(walls[left])\n    return sums\n',
    hint: 'while left < right: sums.append(walls[left] + walls[right]); left += 1; right -= 1.  if left == right: sums.append(walls[left])',
    tool: { code: 'left, right = 0, len(a) - 1\nwhile left < right:\n    print(a[left], a[right])\n    left += 1\n    right -= 1\nif left == right:\n    print("посередині:", a[left])' },
  },
  'carthage.mirror': {
    body: `    left, right = 0, len(word) - 1\n${HERE}\n    return True\n`,
    solution: 'def is_mirror(word):\n    left, right = 0, len(word) - 1\n    while left < right:\n        if word[left] != word[right]:\n            return False\n        left += 1\n        right -= 1\n    return True\n',
    hint: 'while left < right:\n    if word[left] != word[right]: return False\n    left += 1; right -= 1\nreturn True',
    tool: { code: 'for i in range(len(guests)):\n    if guests[i] == "Вовк":\n        return False  # далі можна не дивитися\nreturn True  # Вовка серед гостей немає' },
  },
  'carthage.palindrome': {
    body: `${HERE}    pass\n`,
    solution: 'def is_palindrome(s):\n    l, r = 0, len(s) - 1\n    while l < r:\n        while l < r and not s[l].isalnum():\n            l += 1\n        while l < r and not s[r].isalnum():\n            r -= 1\n        if s[l].lower() != s[r].lower():\n            return False\n        l += 1\n        r -= 1\n    return True\n',
    hint: 'while l < r: skip the extras; if s[l] ≠ s[r] → return False; l += 1; r -= 1.  return True',
    tool: {
      code: 'i = 0\nwhile i < len(s) and s[i] == " ":\n    i += 1   # пропустили пробіли\nprint(s[i].lower())',
      text: {
        0: ['Усередині великого циклу можна поставити маленькі цикли, що <b>пропускають</b> зайве: поки на лівому місці не літера — <code>left += 1</code>.', 'Inside a big loop you can put small loops that <b>skip</b> what you don’t need: while the left place isn’t a letter — <code>left += 1</code>.'],
        1: ['<code>ch.lower()</code> робить літеру малою, тож «А» і «а» стануть однаковими. <code>ch.isalnum()</code> перевіряє, чи це літера або цифра.', '<code>ch.lower()</code> makes a letter lower case, so “A” and “a” become the same. <code>ch.isalnum()</code> checks whether it’s a letter or a digit.'],
      },
    },
  },
  'carthage.twosum': {
    body: `${HERE}\n    return []\n`,
    solution: 'def two_sum(numbers, target):\n    l, r = 0, len(numbers) - 1\n    while l < r:\n        s = numbers[l] + numbers[r]\n        if s == target:\n            return [l + 1, r + 1]\n        if s < target:\n            l += 1\n        else:\n            r -= 1\n    return []\n',
    wolf: 'def two_sum(numbers, target):\n    for i in range(len(numbers)):\n        for j in range(i + 1, len(numbers)):\n            if numbers[i] + numbers[j] == target:\n                return [i + 1, j + 1]\n    return []\n',
    hint: 'l, r = 0, n − 1; while l < r: s = a[l] + a[r]; s == t → [l+1, r+1]; s < t → l += 1; else r -= 1.',
    tool: { code: '# ціни: [2, 5, 9, 14], треба 14\n# 2 + 14 = 16 → завелика → правий вліво\n# 2 + 9  = 11 → замала  → лівий вправо\n# 5 + 9  = 14 → знайшли!' },
  },
  'carthage.dups': {
    body: `    k = 0\n${HERE}\n    return k\n`,
    solution: 'def remove_duplicates(nums):\n    if len(nums) == 0:\n        return 0\n    k = 1\n    for i in range(1, len(nums)):\n        if nums[i] != nums[k - 1]:\n            nums[k] = nums[i]\n            k += 1\n    return k\n',
    wolf: 'def remove_duplicates(nums):\n    n = len(nums)\n    i = 1\n    while i < n:\n        if nums[i] == nums[i - 1]:\n            for k in range(i, n - 1):\n                nums[k] = nums[k + 1]\n            n -= 1\n        else:\n            i += 1\n    return n\n',
    hint: 'k = 1; for i in range(1, n): if nums[i] != nums[k−1]: nums[k] = nums[i]; k += 1.  return k',
    tool: { code: '# [1, 1, 2, 2, 3]\n#  k=1: чиста частина — [1]\n#  i бачить 2 ≠ 1 → пишемо на місце k, k = 2\n#  i бачить 3 ≠ 2 → k = 3' },
  },
  'carthage.dido': {
    body: `    best = 0\n${HERE}\n    return best\n`,
    solution: 'def max_area(height):\n    l, r, best = 0, len(height) - 1, 0\n    while l < r:\n        best = max(best, (r - l) * min(height[l], height[r]))\n        if height[l] < height[r]:\n            l += 1\n        else:\n            r -= 1\n    return best\n',
    wolf: 'def max_area(height):\n    best = 0\n    for i in range(len(height)):\n        for j in range(i + 1, len(height)):\n            best = max(best, (j - i) * min(height[i], height[j]))\n    return best\n',
    hint: 'l = 0, r = n − 1. While l < r: compute the area, update the best, move the pointer at the lower post.',
    tool: { code: '# [4, 8, 6, 3]  l = 0 (4), r = 3 (3)\n# площа = 3 × min(4, 3) = 9\n# нижчий — праворуч (3): зсуваємо r' },
  },
  'forest.dup': {
    body: `    seen = set()\n${HERE}\n    return False\n`,
    solution: 'def contains_duplicate(nums):\n    seen = set()\n    for i in range(len(nums)):\n        if nums[i] in seen:\n            return True\n        seen.add(nums[i])\n    return False\n',
    wolf: 'def contains_duplicate(nums):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] == nums[j]:\n                return True\n    return False\n',
    hint: 'for x in nums:\n    if x in seen: return True\n    seen.add(x)\nreturn False',
    tool: {
      code: 'seen = set()\nseen.add("лис")\n"лис" in seen    # True\n"вовк" in seen   # False',
      name: ['set — множина', 'set'],
      text: {
        0: ['<code>set</code> — це мішок, у якому кожне значення лежить лише раз. <code>seen.add(x)</code> кладе значення, а <code>x in seen</code> миттєво каже, чи воно вже там.', 'A <code>set</code> is a bag in which every value lies only once. <code>seen.add(x)</code> puts a value in, and <code>x in seen</code> tells you instantly whether it’s already there.'],
        1: ['Миттєво — це головне: <code>in</code> для множини не перебирає вміст, як для списку, а одразу знаходить потрібне місце.', 'Instantly is the point: <code>in</code> on a set doesn’t go through the contents like it does on a list, it goes straight to the right place.'],
      },
    },
  },
  'forest.most': {
    body: `    count = {}\n${HERE}\n    return goods[0]\n`,
    solution: 'def most_sold(goods):\n    count = {}\n    for i in range(len(goods)):\n        count[goods[i]] = count.get(goods[i], 0) + 1\n    best, best_count = goods[0], 0\n    for item, c in count.items():\n        if c > best_count:\n            best, best_count = item, c\n    return best\n',
    hint: 'count[x] = count.get(x, 0) + 1; then for item, c in count.items() look for the biggest c.',
    tool: {
      code: 'votes = {}\nfor name in ["лис", "вовк", "лис"]:\n    votes[name] = votes.get(name, 0) + 1\nvotes["лис"]   # 2',
      name: ['dict — ключ і значення', 'dict: key and value'],
      text: {
        0: ['<code>dict</code> (словник) зберігає пари «ключ → значення». <code>m[k] = v</code> записує, <code>m[k]</code> дістає значення за ключем.', 'A <code>dict</code> keeps “key → value” pairs. <code>m[k] = v</code> stores, <code>m[k]</code> fetches the value for a key.'],
        1: ['Якщо ключа ще немає, <code>m[k]</code> видасть помилку, а <code>m.get(k, 0)</code> поверне 0. Тому лічильник пишуть так: <code>m.get(x, 0) + 1</code> — «що було, або 0, плюс один».', 'If the key isn’t there yet, <code>m[k]</code> raises an error, while <code>m.get(k, 0)</code> returns 0. That’s why a counter is written as <code>m.get(x, 0) + 1</code> — “what was there, or 0, plus one”.'],
      },
    },
  },
  'forest.anagram': {
    body: `${HERE}    pass\n`,
    solution: 'def is_anagram(s, t):\n    if len(s) != len(t):\n        return False\n    bal = {}\n    for i in range(len(s)):\n        bal[s[i]] = bal.get(s[i], 0) + 1\n        bal[t[i]] = bal.get(t[i], 0) - 1\n    for v in bal.values():\n        if v != 0:\n            return False\n    return True\n',
    hint: 'for i in range(len(s)): m[s[i]] = m.get(s[i], 0) + 1; m[t[i]] = m.get(t[i], 0) - 1.  Check that all values are 0.',
    tool: {
      code: 'bal = {}\nbal["а"] = bal.get("а", 0) + 1   # взяли\nbal["а"] = bal.get("а", 0) - 1   # віддали\nbal["а"]  # 0 — порівну',
      text: { 0: ['Один <code>dict</code> може рахувати в обидва боки: за кожну річ першого воза <code>+1</code>, за кожну річ другого <code>-1</code>.', 'One <code>dict</code> can count both ways: <code>+1</code> for every thing in the first cart, <code>-1</code> for every thing in the second.'] },
    },
  },
  'forest.twosum': {
    body: `    where = {}\n${HERE}\n    return []\n`,
    solution: 'def two_sum(nums, target):\n    where = {}\n    for i in range(len(nums)):\n        need = target - nums[i]\n        if need in where:\n            return [where[need], i]\n        where[nums[i]] = i\n    return []\n',
    wolf: 'def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []\n',
    hint: 'for i in range(len(nums)):\n    need = target - nums[i]\n    if need in where: return [where[need], i]\n    where[nums[i]] = i',
    tool: {
      code: 'where = {}\nwhere[40] = 0         # ціна 40 стоїть на місці 0\n(100 - 60) in where  # True: є пара для 60\nwhere[40]            # 0',
      name: ['dict: що шукаю → де бачив', 'dict: what I need → where I saw it'],
      text: { 1: ['Тримай <code>dict</code> «ціна → номер» тих, кого вже пройшов. Спершу питаєш <code>in</code>, а вже потім кладеш поточного — тоді звір не стане парою сам собі.', 'Keep a <code>dict</code> “price → index” of those you’ve passed. Ask <code>in</code> first and only then store the current one — so an animal never pairs with itself.'] },
    },
  },
  'forest.groups': {
    body: `    fam = {}\n${HERE}\n    return list(fam.values())\n`,
    solution: 'def group_anagrams(strs):\n    fam = {}\n    for i in range(len(strs)):\n        key = "".join(sorted(strs[i]))\n        group = fam.get(key, [])\n        group.append(strs[i])\n        fam[key] = group\n    return list(fam.values())\n',
    hint: 'for w in strs:\n    k = "".join(sorted(w))\n    fam[k] = fam.get(k, []) + [w]',
    tool: {
      code: 'fam = {}\nkey = "".join(sorted("tea"))   # "aet"\nfam[key] = fam.get(key, []) + ["tea"]\nlist(fam.values())   # [["tea"]]',
      text: {
        0: ['Ключем у <code>dict</code> може бути будь-який рядок, навіть зроблений тобою. Якщо у всіх «своїх» він однаковий, словник сам збере їх разом.', 'A key in a <code>dict</code> can be any string, even one you made yourself. If it’s the same for all “relatives”, the dict gathers them together by itself.'],
        1: ['<code>"".join(sorted(word))</code> — розібрати слово на літери, впорядкувати й зібрати назад. Значенням зробимо список слів родини.', '<code>"".join(sorted(word))</code> — take the word apart into letters, put them in order and join them back. The value will be the list of the family’s words.'],
      },
    },
  },
  'forest.topk': {
    body: `    count = {}\n${HERE}\n    return []\n`,
    solution: 'def top_k_frequent(nums, k):\n    count = {}\n    for i in range(len(nums)):\n        count[nums[i]] = count.get(nums[i], 0) + 1\n    pairs = sorted(count.items(), key=lambda p: -p[1])\n    return [p[0] for p in pairs[:k]]\n',
    wolf: 'def top_k_frequent(nums, k):\n    freq = []\n    for i in range(len(nums)):\n        c = 0\n        for j in range(len(nums)):\n            if nums[j] == nums[i]:\n                c += 1\n        if not any(p[0] == nums[i] for p in freq):\n            freq.append([nums[i], c])\n    freq.sort(key=lambda p: -p[1])\n    return [p[0] for p in freq[:k]]\n',
    hint: 'for x in nums: count[x] = count.get(x, 0) + 1\nreturn [p[0] for p in sorted(count.items(), key=lambda p: -p[1])[:k]]',
    tool: {
      code: 'count = {"мед": 3, "сир": 5, "риба": 1}\npairs = sorted(count.items(), key=lambda p: -p[1])\n[p[0] for p in pairs[:2]]   # ["сир", "мед"]',
      text: {
        0: ['Спершу один прохід: <code>dict</code> «товар → скільки разів». Далі сортуєш уже не весь ярмарок, а короткий список підсумків.', 'First one pass: a <code>dict</code> “goods → how many times”. Then you sort not the whole fair but a short list of totals.'],
        1: ['<code>count.items()</code> дає пари <code>(товар, число)</code>. <code>sorted(…, key=lambda p: -p[1])</code> ставить найчастіші першими, <code>pairs[:k]</code> бере перші <code>k</code>.', '<code>count.items()</code> gives <code>(goods, number)</code> pairs. <code>sorted(…, key=lambda p: -p[1])</code> puts the most frequent first, <code>pairs[:k]</code> takes the first <code>k</code>.'],
      },
    },
  },
  'mitten.order': {
    body: `    stack = []\n    out = []\n${HERE}\n    return out\n`,
    solution: 'def exit_order(ops):\n    stack = []\n    out = []\n    for i in range(len(ops)):\n        if ops[i] == "-":\n            out.append(stack.pop())\n        else:\n            stack.append(ops[i])\n    return out\n',
    hint: 'for op in ops:\n    if op == "-": out.append(stack.pop())\n    else: stack.append(op)',
    tool: {
      code: 'plates = []\nplates.append("синя")\nplates.append("червона")\nplates.pop()   # "червона" — поклали останньою\nplates.pop()   # "синя"',
      name: ['стек: append і pop', 'a stack: append and pop'],
      text: { 0: ['<b>Стек</b> — це звичайний список, з яким працюють лише з одного кінця. <code>stack.append(x)</code> кладе нагору, <code>stack.pop()</code> знімає верхнього й повертає його.', 'A <b>stack</b> is an ordinary list you work with from one end only. <code>stack.append(x)</code> puts on top, <code>stack.pop()</code> takes the top one off and returns it.'] },
    },
  },
  'mitten.parens': {
    body: `    stack = []\n${HERE}\n    return True\n`,
    solution: 'def is_valid(s):\n    pair = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for i in range(len(s)):\n        ch = s[i]\n        if ch in pair:\n            if not stack or stack.pop() != pair[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return len(stack) == 0\n',
    hint: 'for ch in s:\n    if ch in pair:\n        if not stack or stack.pop() != pair[ch]: return False\n    else: stack.append(ch)\nreturn not stack',
    tool: {
      code: 'pair = {")": "(", "]": "[", "}": "{"}\nstack = ["(", "["]\nstack[-1]                 # "[" — верхівка\nstack.pop() == pair["]"]  # True',
      text: {
        0: ['Верхній елемент стеку — <code>stack[-1]</code>. А <code>stack.pop()</code> знімає його і повертає, тож можна одразу порівняти. З порожнього стеку <code>pop()</code> дає помилку, тож спершу перевір <code>not stack</code>.', 'The top element of a stack is <code>stack[-1]</code>. And <code>stack.pop()</code> takes it off and returns it, so you can compare right away. <code>pop()</code> on an empty stack is an error, so check <code>not stack</code> first.'],
        1: ['Зручно мати пари під рукою: словник <code>{")": "(", "]": "[", "}": "{"}</code> каже, яка відкрита дужка потрібна для кожної закритої.', 'It helps to keep the pairs at hand: the dict <code>{")": "(", "]": "[", "}": "{"}</code> tells which opening bracket each closing one needs.'],
      },
    },
  },
  'mitten.min': {
    body: `    stack = []\n    mins = []\n    out = []\n${HERE}\n    return out\n`,
    solution: 'def min_answers(ops):\n    stack = []\n    mins = []\n    out = []\n    for i in range(len(ops)):\n        op = ops[i]\n        if op == "?":\n            out.append(mins[-1])\n        elif op == "-":\n            stack.pop()\n            mins.pop()\n        else:\n            v = int(op)\n            stack.append(v)\n            mins.append(min(v, mins[-1]) if mins else v)\n    return out\n',
    hint: 'if op == "?": out.append(mins[-1])\nelif op == "-": stack.pop(); mins.pop()\nelse: v = int(op); stack.append(v); mins.append(min(v, mins[-1]) if mins else v)',
  },
  'mitten.rpn': {
    body: `    stack = []\n${HERE}\n    return 0\n`,
    solution: 'def eval_rpn(tokens):\n    stack = []\n    for i in range(len(tokens)):\n        t = tokens[i]\n        if t in ("+", "-", "*", "/"):\n            b = stack.pop()\n            a = stack.pop()\n            if t == "+":\n                stack.append(a + b)\n            elif t == "-":\n                stack.append(a - b)\n            elif t == "*":\n                stack.append(a * b)\n            else:\n                stack.append(int(a / b))\n        else:\n            stack.append(int(t))\n    return stack[0]\n',
    hint: 'if t in ("+", "-", "*", "/"): b = stack.pop(); a = stack.pop(); stack.append(compute)\nelse: stack.append(int(t))',
    tool: {
      code: '# ["4", "13", "5", "/", "+"]\n# 4 → [4];  13 → [4, 13];  5 → [4, 13, 5]\n# "/" → b = 5, a = 13 → [4, 2]\n# "+" → [6]',
      text: { 1: ['Порядок важливий для <code>-</code> і <code>/</code>: друге зняте число стоїть зліва. Ціле ділення до нуля в Python — <code>int(a / b)</code>, а не <code>a // b</code> (воно округлює вниз). Наприкінці у стеку лишається одна відповідь.', 'The order matters for <code>-</code> and <code>/</code>: the second number taken off is on the left. Integer division towards zero in Python is <code>int(a / b)</code>, not <code>a // b</code> (that rounds down). At the end one answer is left on the stack.'] },
    },
  },
  'mitten.temps': {
    body: `    answer = [0] * len(temperatures)\n    stack = []\n${HERE}\n    return answer\n`,
    solution: 'def daily_temperatures(temperatures):\n    answer = [0] * len(temperatures)\n    stack = []\n    for i in range(len(temperatures)):\n        today = temperatures[i]\n        while stack and today > temperatures[stack[-1]]:\n            j = stack.pop()\n            answer[j] = i - j\n        stack.append(i)\n    return answer\n',
    wolf: 'def daily_temperatures(temperatures):\n    answer = [0] * len(temperatures)\n    for i in range(len(temperatures)):\n        for j in range(i + 1, len(temperatures)):\n            if temperatures[j] > temperatures[i]:\n                answer[i] = j - i\n                break\n    return answer\n',
    hint: 'for i in range(len(t)):\n    while stack and t[i] > t[stack[-1]]:\n        j = stack.pop(); answer[j] = i - j\n    stack.append(i)',
  },
  'konotop.search': {
    body: `    lo, hi = 0, len(nums) - 1\n${HERE}\n    return -1\n`,
    solution: 'def search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        v = nums[mid]\n        if v == target:\n            return mid\n        if v < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n',
    wolf: 'def search(nums, target):\n    for i in range(len(nums)):\n        if nums[i] == target:\n            return i\n    return -1\n',
    hint: 'while lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] == target: return mid\n    if nums[mid] < target: lo = mid + 1\n    else: hi = mid - 1',
    tool: {
      code: '# шукаємо 9 у [1, 3, 5, 7, 9, 11]\n# lo=0 hi=5 mid=2 → 5 < 9 → lo = 3\n# lo=3 hi=5 mid=4 → 9 — знайшли!',
      text: { 0: ['Тримай межі <code>lo</code> і <code>hi</code> — де ще може бути відповідь. Дивись на середину <code>mid = (lo + hi) // 2</code> (<code>//</code> — ділення з відкиданням остачі).', 'Keep boundaries <code>lo</code> and <code>hi</code> — where the answer can still be. Look at the middle <code>mid = (lo + hi) // 2</code> (<code>//</code> is division dropping the remainder).'] },
    },
  },
  'konotop.insert': {
    body: `    lo, hi = 0, len(nums)\n${HERE}\n    return lo\n`,
    solution: 'def search_insert(nums, target):\n    lo, hi = 0, len(nums)\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid\n    return lo\n',
    wolf: 'def search_insert(nums, target):\n    i = 0\n    while i < len(nums) and nums[i] < target:\n        i += 1\n    return i\n',
    hint: 'while lo < hi:\n    mid = (lo + hi) // 2\n    if nums[mid] < target: lo = mid + 1\n    else: hi = mid\nreturn lo',
    tool: { code: '# [10, 20, 30, 40], новий — 25\n# lo=0 hi=4 mid=2 → 30 ≥ 25 → hi = 2\n# lo=0 hi=2 mid=1 → 20 < 25 → lo = 2\n# lo = hi = 2: ставай на місце 2' },
  },
  'konotop.barrel': {
    body: `    lo, hi = 0, len(barrels) - 1\n${HERE}\n    return lo\n`,
    solution: 'def first_bad(barrels):\n    lo, hi = 0, len(barrels) - 1\n    while lo < hi:\n        mid = (lo + hi) // 2\n        if barrels[mid]:\n            hi = mid\n        else:\n            lo = mid + 1\n    return lo\n',
    wolf: 'def first_bad(barrels):\n    for i in range(len(barrels)):\n        if barrels[i]:\n            return i\n    return -1\n',
    hint: 'while lo < hi:\n    mid = (lo + hi) // 2\n    if barrels[mid]: hi = mid\n    else: lo = mid + 1\nreturn lo',
    tool: { code: '# [F, F, F, T, T]\n# lo=0 hi=4 mid=2 → F → lo = 3\n# lo=3 hi=4 mid=3 → T → hi = 3\n# lo = hi = 3' },
  },
  'konotop.rotated': {
    body: `    lo, hi = 0, len(nums) - 1\n${HERE}\n    return -1\n`,
    solution: 'def search_rotated(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        m = nums[mid]\n        if m == target:\n            return mid\n        l, h = nums[lo], nums[hi]\n        if l <= m:\n            if l <= target < m:\n                hi = mid - 1\n            else:\n                lo = mid + 1\n        else:\n            if m < target <= h:\n                lo = mid + 1\n            else:\n                hi = mid - 1\n    return -1\n',
    wolf: 'def search_rotated(nums, target):\n    for i in range(len(nums)):\n        if nums[i] == target:\n            return i\n    return -1\n',
    hint: 'if nums[lo] <= nums[mid]:\n    if nums[lo] <= target < nums[mid]: hi = mid - 1\n    else: lo = mid + 1\nelse:\n    if nums[mid] < target <= nums[hi]: lo = mid + 1\n    else: hi = mid - 1',
    tool: { code: '# [4, 5, 6, 7, 0, 1, 2], шукаємо 0\n# mid = 3 (7): ліва [4..7] рівна, 0 не в ній → праворуч\n# lo = 4: [0, 1, 2] — звичайний поділ навпіл' },
  },
  'konotop.pies': {
    body: `    lo, hi = 1, 1\n${HERE}\n    return lo\n`,
    solution: 'def min_eating_speed(piles, h):\n    lo, hi = 1, 1\n    for i in range(len(piles)):\n        hi = max(hi, piles[i])\n    while lo < hi:\n        mid = (lo + hi) // 2\n        hours = 0\n        for i in range(len(piles)):\n            hours += (piles[i] + mid - 1) // mid\n        if hours <= h:\n            hi = mid\n        else:\n            lo = mid + 1\n    return lo\n',
    wolf: 'def min_eating_speed(piles, h):\n    k = 1\n    while True:\n        hours = 0\n        for i in range(len(piles)):\n            hours += (piles[i] + k - 1) // k\n        if hours <= h:\n            return k\n        k += 1\n',
    hint: 'while lo < hi:\n    mid = (lo + hi) // 2\n    hours = sum((p + mid - 1) // mid for p in piles)\n    if hours <= h: hi = mid\n    else: lo = mid + 1',
    tool: {
      code: '# piles = [3, 6, 7, 11], h = 8\n# k = 6: 1 + 1 + 2 + 2 = 6 год ≤ 8 → повільніше\n# k = 3: 1 + 2 + 3 + 4 = 10 год > 8 → швидше\n# k = 4: 1 + 2 + 2 + 3 = 8 год — найменше',
      text: { 0: ['Іноді навпіл ділять не масив, а <b>можливі відповіді</b>. Швидкість — від 1 до найбільшої миски. Для середньої швидкості рахуєш години: <code>(p + k - 1) // k</code> — ділення з округленням угору — для кожної миски.', 'Sometimes you halve not the array but <b>the possible answers</b>. The speed is from 1 to the biggest bowl. For a middle speed, count the hours: <code>(p + k - 1) // k</code> — division rounding up — for every bowl.'] },
    },
  },
};

const TYPES: [RegExp, string][] = [[/number\[\]\[\]/g, 'list[list[int]]'], [/string\[\]\[\]/g, 'list[list[str]]'], [/boolean\[\]/g, 'list[bool]'], [/number\[\]/g, 'list[int]'], [/string\[\]/g, 'list[str]'], [/\bnumber\b/g, 'int'], [/\bstring\b/g, 'str'], [/\bboolean\b/g, 'bool'], [/\bvoid\b/g, 'None']];
const pyType = (t: string) => TYPES.reduce((s, [re, to]) => s.replace(re, to), t);

/** Підпис функції з TS-стартеру: `function name(a: T, b: U): R` → [name, [[a, T], [b, U]], R]. */
function signatureOf(ts: string): { name: string; params: [string, string][]; ret: string } {
  const m = ts.match(/function (\w+)\(([^)]*)\): ([^\s{]+)/)!;
  const params = m[2] ? m[2].split(', ').map((p) => p.split(': ') as [string, string]) : [];
  return { name: m[1], params, ret: m[3] };
}

/** Рядки умови з коментаря TS-стартеру: перший — назва, далі пояснення. */
function docOf(ts: string): string[] {
  const lines = ts.split('\n');
  return lines.slice(1, lines.indexOf(' */')).filter((l) => !l.startsWith(' * @')).map((l) => l.slice(3));
}

/** Тексти світу 3 говорять про Set і Map; у Python це set і dict. */
const MEMORY_WORDS: [RegExp, string][] = [[/\bMap\b/g, 'dict'], [/\bSet\b/g, 'set']];

/** Переклад JS-зворотів з тексту вправи на Python. Обережний: чіпає лише впізнавані місця. */
export function pyText(s: string, memory = false): string {
  let r = s
    .replace(/Math\.(max|min)\(\.\.\.(\w+)\)/g, '$1($2)')
    .replace(/Math\.(max|min)\(/g, '$1(')
    .replace(/\b(\w+)\.length\b/g, 'len($1)')
    .replace(/===/g, '==')
    .replace(/!==/g, '!=')
    .replace(/\bfireAhead\b/g, 'fire_ahead')
    .replace(/\batEnd\b/g, 'at_end')
    .replace(/\bsackHere\b/g, 'sack_here')
    .replace(/(?<!\b(?:a|A|the|The) )\btrue\b/g, 'True')
    .replace(/(?<!\b(?:a|A|the|The) )\bfalse\b/g, 'False')
    .replace(/\bnull\b/g, 'None');
  if (memory) for (const [re, to] of MEMORY_WORDS) r = r.replace(re, to);
  return r;
}

export const pyLevel = (id: string): PyPart | undefined => PY[id];

/** Стартовий код Python: коментар-умова, підпис із типами й готове тіло. */
export function pyStarter(level: Level, doc?: string[], here = '# Слово ладу пиши тут'): string {
  const part = PY[level.id];
  const { params, ret } = signatureOf(level.starter.ts);
  const lines = (doc ?? docOf(level.starter.ts)).map((l) => `# ${pyText(l)}`);
  const args = params.map(([n, t]) => (t === 'Enei' ? n : `${n}: ${pyType(t)}`)).join(', ');
  const hint = ret === 'None' || ret === 'void' ? '' : ` -> ${pyType(ret)}`;
  return `${lines.join('\n')}\ndef ${pyEntry(level.entry)}(${args})${hint}:\n${part.body.replace('# Слово ладу пиши тут', here)}`;
}

/** Python-версія тексту інструмента й третьої підказки поточною мовою інтерфейсу. */
export function pyTool(level: Level, tool: { name: string; text: string[]; code: string }) {
  const part = PY[level.id]?.tool;
  const en = uiLang() === 'en' ? 1 : 0;
  return {
    name: part?.name?.[en] ?? pyText(tool.name, !!level.memory),
    text: tool.text.map((t, i) => part?.text?.[i]?.[en] ?? pyText(t, !!level.memory)),
    code: part?.code ?? tool.code,
  };
}
