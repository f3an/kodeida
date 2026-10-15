/*
 * Python-половина пісочниці: виконується всередині Pyodide.
 * Те саме, що робить sandbox-core.ts для JS: спостерігає за читаннями, веде лог подій світу,
 * пильнує бюджет читань і забороні методи. Назовні віддає тільки JSON, тож межу Python ↔ JS перетинає рядок.
 * Увага: це TS-рядок, тож у Python-коді не можна писати зворотні лапки та «${».
 */
export const PY_PRELUDE = String.raw`
import ast, builtins, collections, json, sys, time

_EN = [False]
def _M(uk, en):
    return en if _EN[0] else uk

SOURCE = 'slovo.py'

class _Over(BaseException):
    pass

class _WorldErr(BaseException):
    def __init__(self, msg):
        BaseException.__init__(self, msg)
        self.msg = msg

class _St:
    def __init__(self):
        self.reads = 0
        self.budget = float('inf')
        self.over = False
        self.events = []
        self.logs = []
        self.limit = 0
        self.record = False
        self.mem = False
        self.forbid = set()

_S = _St()

def _push(e):
    s = _S
    if s.record and len(s.events) < s.limit:
        s.events.append(e)

def _read(name, i):
    s = _S
    if s.over:
        raise _Over()
    s.reads += 1
    if s.reads > s.budget:
        s.over = True
        raise _Over()
    if s.record and len(s.events) < s.limit:
        s.events.append({'t': 'read', 'arr': name, 'i': i})

def _ban(name):
    if name in _S.forbid:
        raise _WorldErr(_M('У цій вправі ' + name + '() заборонено — зроби це сам.', 'In this exercise ' + name + '() is forbidden — do it yourself.'))

def _plain(v, d=0):
    if v is None or isinstance(v, bool):
        return v
    if isinstance(v, str):
        return str.__str__(v)
    if isinstance(v, int):
        return int(v)
    if isinstance(v, float):
        return v if (v == v and v not in (float('inf'), float('-inf'))) else str(v)
    if d > 6:
        return '…'
    if isinstance(v, list):
        return [_plain(x, d + 1) for x in list.__iter__(v)]
    if isinstance(v, tuple):
        return [_plain(x, d + 1) for x in v]
    if isinstance(v, (set, frozenset)):
        items = [_plain(x, d + 1) for x in set.__iter__(v)] if isinstance(v, set) else [_plain(x, d + 1) for x in v]
        try:
            return sorted(items)
        except Exception:
            return items
    if isinstance(v, dict):
        return {str(k): _plain(x, d + 1) for k, x in dict.items(v)}
    return '[function]' if callable(v) else repr(v)

class _WList(list):
    def __init__(self, data, name):
        list.__init__(self, data)
        self._n = name
    def __getitem__(self, i):
        n = list.__len__(self)
        if isinstance(i, slice):
            for k in range(*i.indices(n)):
                _read(self._n, k)
            return list.__getitem__(self, i)
        v = list.__getitem__(self, i)
        _read(self._n, i + n if i < 0 else i)
        return v
    def __iter__(self):
        k = 0
        while k < list.__len__(self):
            _read(self._n, k)
            yield list.__getitem__(self, k)
            k += 1
    def __reversed__(self):
        _ban('reversed')
        for k in range(list.__len__(self) - 1, -1, -1):
            _read(self._n, k)
            yield list.__getitem__(self, k)
    def __contains__(self, x):
        for v in self:
            if v == x:
                return True
        return False
    def index(self, x, *a):
        for k, v in enumerate(self):
            if v == x:
                return k
        raise ValueError(str(x) + ' is not in list')
    def count(self, x):
        return sum(1 for v in self if v == x)
    def copy(self):
        return list(self)
    def __setitem__(self, i, v):
        if isinstance(i, slice):
            old = list(list.__iter__(self))
            list.__setitem__(self, i, v)
            for k in range(min(len(old), list.__len__(self))):
                cur = list.__getitem__(self, k)
                if old[k] != cur:
                    _push({'t': 'write', 'arr': self._n, 'i': k, 'v': _plain(cur)})
            return
        n = list.__len__(self)
        list.__setitem__(self, i, v)
        _push({'t': 'write', 'arr': self._n, 'i': i + n if i < 0 else i, 'v': _plain(v)})
    def reverse(self):
        _ban('reverse')
        i, j = 0, list.__len__(self) - 1
        while i < j:
            a, b = self[i], self[j]
            self[i] = b
            self[j] = a
            i += 1
            j -= 1
    def sort(self, *, key=None, reverse=False):
        _ban('sort')
        vals = list(self)
        vals.sort(key=key, reverse=reverse)
        for k, v in enumerate(vals):
            self[k] = v

class _WStr(str):
    def __new__(cls, s, name):
        o = str.__new__(cls, s)
        o._n = name
        return o
    def __getitem__(self, i):
        n = str.__len__(self)
        if isinstance(i, slice):
            for k in range(*i.indices(n)):
                _read(self._n, k)
            return str.__getitem__(self, i)
        v = str.__getitem__(self, i)
        _read(self._n, i + n if i < 0 else i)
        return v
    def __iter__(self):
        for k in range(str.__len__(self)):
            _read(self._n, k)
            yield str.__getitem__(self, k)
    def __contains__(self, x):
        pos = str.find(self, x)
        for k in range(str.__len__(self) if pos < 0 else pos + len(x)):
            _read(self._n, k)
        return pos >= 0

def _mt(v):
    if isinstance(v, str):
        s = str.__str__(v)
    elif isinstance(v, (list, tuple)):
        s = '[' + str(len(v)) + ']'
    else:
        try:
            s = json.dumps(v)
        except Exception:
            s = str(v)
    return s if len(s) <= 14 else s[:13] + '…'

def _mem(op, k, v=None, hasv=False, hit=None):
    s = _S
    if s.mem and s.record and len(s.events) < s.limit:
        e = {'t': 'mem', 'op': op, 'k': _mt(k)}
        if hasv:
            e['v'] = _mt(v)
        if hit is not None:
            e['hit'] = hit
        s.events.append(e)

class _MemDict:
    def __setitem__(self, k, v):
        _mem('set', k, v, True)
        dict.__setitem__(self, k, v)
    def __getitem__(self, k):
        _mem('get', k, hit=dict.__contains__(self, k))
        return dict.__getitem__(self, k)
    def __contains__(self, k):
        h = dict.__contains__(self, k)
        _mem('has', k, hit=h)
        return h
    def get(self, k, d=None):
        _mem('get', k, hit=dict.__contains__(self, k))
        return dict.get(self, k, d)
    def __delitem__(self, k):
        _mem('delete', k)
        dict.__delitem__(self, k)
    def pop(self, k, *d):
        _mem('delete', k)
        return dict.pop(self, k, *d)
    def setdefault(self, k, d=None):
        h = dict.__contains__(self, k)
        _mem('get', k, hit=h)
        if not h:
            self[k] = d
        return dict.__getitem__(self, k)
    def update(self, *a, **kw):
        for k, v in dict(*a, **kw).items():
            self[k] = v

class _WDict(_MemDict, dict):
    pass

class _WDefault(_MemDict, collections.defaultdict):
    pass

class _WCounter(_MemDict, collections.Counter):
    update = collections.Counter.update

class _WSet(set):
    def add(self, v):
        _mem('add', v)
        set.add(self, v)
    def __contains__(self, v):
        h = set.__contains__(self, v)
        _mem('has', v, hit=h)
        return h
    def discard(self, v):
        _mem('delete', v)
        set.discard(self, v)
    def remove(self, v):
        _mem('delete', v)
        set.remove(self, v)

collections.defaultdict = _WDefault
collections.Counter = _WCounter

_MAX_ACTIONS = 1000

class _Enei:
    def __init__(self, setup):
        self._c = list(setup['cells'])
        self._p = setup.get('start') or 0
        self._last = len(self._c) - 1
        self.bag = 0
        self.crew = 0
        self.burns = 0
        self.actions = 0
    def _act(self, name, ok, note=None):
        self.actions += 1
        if self.actions > _MAX_ACTIONS:
            raise _WorldErr(_M('Еней зробив понад ' + str(_MAX_ACTIONS) + ' дій і сів перепочити. Чи не зациклився код?', 'Aeneas made over ' + str(_MAX_ACTIONS) + ' moves and sat down to rest. Is the code stuck in a loop?'))
        e = {'t': 'act', 'name': name, 'ok': ok}
        if note:
            e['note'] = note
        _push(e)
        if not ok:
            raise _WorldErr(note or name)
    def move(self):
        if self._p >= self._last:
            return self._act('move', False, _M('Далі дороги немає: Еней уже в кінці вулиці.', 'No road ahead: Aeneas is already at the end of the street.'))
        if self._c[self._p + 1] == 'fire':
            self.burns += 1
            return self._act('move', False, _M('Еней ступив у вогонь! Перевір, чи попереду не горить, і перестрибни.', 'Aeneas stepped into the fire! Check whether it burns ahead, and jump over.'))
        self._p += 1
        if self._c[self._p] == 'trojan':
            self.crew += 1
            self._c[self._p] = 'empty'
        self._act('move', True)
    def jump(self):
        if self._p + 2 > self._last:
            return self._act('jump', False, _M('Стрибати нікуди: вулиця закінчується.', 'Nowhere to jump: the street ends.'))
        if self._c[self._p + 2] == 'fire':
            self.burns += 1
            return self._act('jump', False, _M('Еней перестрибнув — і приземлився у вогонь.', 'Aeneas jumped — and landed in the fire.'))
        self._p += 2
        self._act('jump', True)
    def take(self):
        if self._c[self._p] != 'sack':
            return self._act('take', False, _M('Тут немає мішка (клітинка ' + str(self._p) + ').', 'There is no sack here (cell ' + str(self._p) + ').'))
        self._c[self._p] = 'empty'
        self.bag += 1
        self._act('take', True)
    def fire_ahead(self):
        return self._p + 1 <= self._last and self._c[self._p + 1] == 'fire'
    def sack_here(self):
        return self._c[self._p] == 'sack'
    def at_end(self):
        return self._p >= self._last
    @property
    def position(self):
        return self._p
    fireAhead = fire_ahead
    sackHere = sack_here
    atEnd = at_end
    def _state(self):
        return {'cells': list(self._c), 'pos': self._p, 'bag': self.bag, 'crew': self.crew, 'burns': self.burns, 'actions': self.actions}

class _Xf(ast.NodeTransformer):
    # Літерали {…}, множини і виклики set()/dict() замінюються на «спостережувані» класи.
    def _wrap(self, node, name):
        self.generic_visit(node)
        return ast.copy_location(ast.Call(func=ast.Name(id=name, ctx=ast.Load()), args=[node], keywords=[]), node)
    def visit_Dict(self, n):
        return self._wrap(n, '_WDict')
    def visit_DictComp(self, n):
        return self._wrap(n, '_WDict')
    def visit_Set(self, n):
        return self._wrap(n, '_WSet')
    def visit_SetComp(self, n):
        return self._wrap(n, '_WSet')
    def visit_Call(self, n):
        self.generic_visit(n)
        if isinstance(n.func, ast.Name) and n.func.id in ('set', 'dict'):
            n.func = ast.copy_location(ast.Name(id='_WSet' if n.func.id == 'set' else '_WDict', ctx=ast.Load()), n.func)
        return n

def _print(*a, sep=' ', end='\n', file=None, flush=False):
    text = (' ' if sep is None else sep).join(str(x) for x in a)
    if len(_S.logs) < 200:
        _S.logs.append(text[:500] + '…' if len(text) > 500 else text)
    _push({'t': 'log', 'text': text})

def _sorted(it, *a, **k):
    _ban('sorted')
    return builtins.sorted(it, *a, **k)

def _line(e):
    tb = e.__traceback__
    line = None
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == SOURCE:
            line = tb.tb_lineno
        tb = tb.tb_next
    return line

def _tr(kind, m):
    import re
    if _EN[0]:
        return kind + ': ' + m
    rules = [
        (r"^name '(.+)' is not defined", lambda x: 'змінну ' + x.group(1) + ' не оголошено'),
        (r"^cannot access local variable '(.+)' where it is not associated with a value", lambda x: 'змінну ' + x.group(1) + ' використано до присвоєння'),
        (r"^list index out of range", lambda x: 'індекс поза межами списку'),
        (r"^string index out of range", lambda x: 'індекс поза межами рядка'),
        (r"^division by zero|^integer division or modulo by zero|^float division by zero", lambda x: 'ділення на нуль'),
        (r"^maximum recursion depth exceeded", lambda x: 'рекурсія не зупиняється'),
        (r"^'(.+)' object has no attribute '(.+)'", lambda x: 'у ' + x.group(1) + ' немає «' + x.group(2) + '»'),
        (r"^'(.+)' object is not callable", lambda x: x.group(1) + ' — не функція'),
        (r"^'(.+)' object is not subscriptable", lambda x: x.group(1) + ' не можна індексувати'),
        (r"^can only concatenate (.+) to (.+)", lambda x: 'не можна додати разом різні типи'),
        (r"^unsupported operand type", lambda x: 'не можна виконати цю дію над такими типами'),
        (r"^unhashable type: '(.+)'", lambda x: x.group(1) + ' не може бути ключем (змінний тип)'),
    ]
    for pat, f in rules:
        x = re.match(pat, m)
        if x:
            return f(x) + ' (' + kind + ': ' + m + ')'
    if kind == 'KeyError':
        return 'такого ключа немає (KeyError: ' + m + ')'
    return kind + ': ' + m

def _tr_syntax(m):
    if _EN[0]:
        return m
    import re
    rules = [
        (r"^expected ':'", 'пропущено двокрапку «:»'),
        (r"^invalid syntax", 'зайвий або пропущений символ'),
        (r"^unterminated string literal", 'рядок не закрито лапкою'),
        (r"^unexpected indent", 'зайвий відступ'),
        (r"^unindent does not match", 'відступ не збігається з попереднім'),
        (r"^expected an indented block", 'після «:» потрібен рядок із відступом'),
        (r"^'(.+)' was never closed", None),
    ]
    for pat, t in rules:
        x = re.match(pat, m)
        if x:
            return (("дужку «" + x.group(1) + "» не закрито") if t is None else t) + ' (' + m + ')'
    return m

def _err(e):
    if isinstance(e, _WorldErr):
        return {'message': e.msg, 'line': _line(e)}
    return {'message': _tr(type(e).__name__, str(e)), 'line': _line(e)}

_FN = [None]

def _compile(code, entry, en):
    _EN[0] = bool(en)
    try:
        tree = ast.parse(code, SOURCE)
        tree = ast.fix_missing_locations(_Xf().visit(tree))
        co = compile(tree, SOURCE, 'exec')
    except SyntaxError as e:
        return json.dumps({'error': {'message': _tr_syntax(e.msg or 'SyntaxError'), 'line': e.lineno}})
    ns = {'__name__': '__main__', '_WDict': _WDict, '_WSet': _WSet, 'print': _print, 'sorted': _sorted}
    _S.reads = 0
    _S.over = False
    _S.budget = float('inf')
    _S.record = False
    _S.mem = False
    try:
        exec(co, ns)
    except BaseException as e:
        return json.dumps({'error': _err(e)})
    fn = ns.get(entry)
    if not callable(fn):
        return json.dumps({'error': {'message': _M('Не знайдено функцію ' + entry + '. Не перейменовуй її.', 'Function ' + entry + ' not found. Don\'t rename it.')}})
    _FN[0] = fn
    return json.dumps({'ok': True})

def _call(args_json, spec_json):
    spec = json.loads(spec_json)
    s = _S
    s.reads = 0
    s.over = False
    s.events = []
    s.logs = []
    b = spec.get('readBudget')
    s.budget = float('inf') if b is None else b
    s.record = bool(spec['record'])
    s.limit = spec['limit']
    s.mem = bool(spec.get('memory')) and s.record
    s.forbid = set(spec.get('forbid') or [])
    _EN[0] = bool(spec.get('en'))
    observe = spec.get('observe') or []
    args = []
    street = None
    for i, a in enumerate(json.loads(args_json)):
        name = observe[i] if i < len(observe) else None
        if isinstance(a, dict) and a.get('$actor') == 'enei':
            street = _Enei(a['setup'])
            args.append(street)
        elif isinstance(a, list) and name:
            args.append(_WList(a, name))
        elif isinstance(a, str) and name:
            args.append(_WStr(a, name))
        else:
            args.append(a)
    t0 = time.perf_counter()
    value = None
    error = None
    try:
        value = _FN[0](*args)
    except _Over:
        pass
    except BaseException as e:
        error = _err(e)
    ms = (time.perf_counter() - t0) * 1000
    bad = s.over or error is not None
    res = {
        'value': None if bad else _plain(value),
        'error': error,
        'reads': s.reads,
        'overBudget': s.over,
        'events': s.events,
        'logs': s.logs,
        'ms': ms,
        'argsAfter': None if bad else [None if a is street and street is not None else _plain(a) for a in args],
        'street': street._state() if street is not None else None,
    }
    s.events = []
    return json.dumps(res)
`;
