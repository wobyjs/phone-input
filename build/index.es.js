(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const SYMBOL_OBSERVABLE = Symbol("Observable");
const SYMBOL_OBSERVABLE_FROZEN = Symbol("Observable.Frozen");
const SYMBOL_OBSERVABLE_READABLE = Symbol("Observable.Readable");
const SYMBOL_OBSERVABLE_WRITABLE = Symbol("Observable.Writable");
const SYMBOL_STORE = Symbol("Store");
const SYMBOL_STORE_KEYS = Symbol("Store.Keys");
const SYMBOL_STORE_OBSERVABLE = Symbol("Store.Observable");
const SYMBOL_STORE_TARGET = Symbol("Store.Target");
const SYMBOL_STORE_VALUES = Symbol("Store.Values");
const SYMBOL_STORE_UNTRACKED = Symbol("Store.Untracked");
const SYMBOL_SUSPENSE$1 = Symbol("Suspense");
const SYMBOL_UNCACHED = Symbol("Uncached");
const SYMBOL_UNTRACKED = Symbol("Untracked");
const SYMBOL_UNTRACKED_UNWRAPPED = Symbol("Untracked.Unwrapped");
const castArray$1 = (value) => {
  return isArray$1(value) ? value : [value];
};
const castError$1 = (error) => {
  if (error instanceof Error)
    return error;
  if (typeof error === "string")
    return new Error(error);
  return new Error("Unknown error");
};
const { is } = Object;
const { isArray: isArray$1 } = Array;
const isFunction$1 = (value) => {
  return typeof value === "function";
};
const isObject$1$1 = (value) => {
  return value !== null && typeof value === "object";
};
const isSymbol$2 = (value) => {
  return typeof value === "symbol";
};
const noop$1 = () => {
  return;
};
const nope = () => {
  return false;
};
function frozenFunction() {
  if (arguments.length) {
    throw new Error("A readonly Observable can not be updated");
  } else {
    return this;
  }
}
function readableFunction() {
  if (arguments.length) {
    throw new Error("A readonly Observable can not be updated");
  } else {
    return this.get();
  }
}
function writableFunction(fn) {
  if (arguments.length) {
    if (isFunction$1(fn)) {
      return this.C(fn);
    } else {
      return this.set(fn);
    }
  } else {
    return this.get();
  }
}
const frozen = (value) => {
  const fn = frozenFunction.bind(value);
  fn[SYMBOL_OBSERVABLE] = true;
  fn[SYMBOL_OBSERVABLE_FROZEN] = true;
  return fn;
};
const readable = (value) => {
  const fn = readableFunction.bind(value);
  fn[SYMBOL_OBSERVABLE] = true;
  fn[SYMBOL_OBSERVABLE_READABLE] = value;
  return fn;
};
const writable = (value) => {
  const fn = writableFunction.bind(value);
  fn[SYMBOL_OBSERVABLE] = true;
  fn[SYMBOL_OBSERVABLE_WRITABLE] = value;
  return fn;
};
const DIRTY_NO = 0;
const DIRTY_MAYBE_NO = 1;
const DIRTY_MAYBE_YES = 2;
const DIRTY_YES = 3;
frozen(false);
frozen(true);
const UNAVAILABLE = new Proxy({}, new Proxy({}, { get() {
  throw new Error("Unavailable value");
} }));
const UNINITIALIZED = function() {
};
const lazyArrayEachRight = (arr, fn) => {
  if (arr instanceof Array) {
    for (let i = arr.length - 1; i >= 0; i--) {
      fn(arr[i]);
    }
  } else if (arr) {
    fn(arr);
  }
};
const lazyArrayPush = (obj, key, value) => {
  const arr = obj[key];
  if (arr instanceof Array) {
    arr.push(value);
  } else if (arr) {
    obj[key] = [arr, value];
  } else {
    obj[key] = value;
  }
};
const lazySetAdd = (obj, key, value) => {
  const set = obj[key];
  if (set instanceof Set) {
    set.add(value);
  } else if (set) {
    if (value !== set) {
      const s = /* @__PURE__ */ new Set();
      s.add(set);
      s.add(value);
      obj[key] = s;
    }
  } else {
    obj[key] = value;
  }
};
const lazySetDelete = (obj, key, value) => {
  const set = obj[key];
  if (set instanceof Set) {
    set.delete(value);
  } else if (set === value) {
    obj[key] = void 0;
  }
};
const lazySetEach = (set, fn) => {
  if (set instanceof Set) {
    for (const value of set) {
      fn(value);
    }
  } else if (set) {
    fn(set);
  }
};
const onCleanup = (cleanup2) => cleanup2.call(cleanup2);
const onDispose = (owner) => owner.Q(true);
class Owner {
  constructor() {
    this.disposed = false;
    this.B = void 0;
    this.S = void 0;
    this.D = void 0;
    this.K = void 0;
    this.T = void 0;
    this.U = void 0;
  }
  /* API */
  catch(error, silent) {
    var _a2;
    const { S } = this;
    if (S) {
      S(error);
      return true;
    } else {
      if ((_a2 = this.parent) == null ? void 0 : _a2.catch(error, true))
        return true;
      if (silent)
        return false;
      throw error;
    }
  }
  Q(deep) {
    lazyArrayEachRight(this.D, onDispose);
    lazyArrayEachRight(this.K, onDispose);
    lazyArrayEachRight(this.U, onDispose);
    lazyArrayEachRight(this.B, onCleanup);
    this.B = void 0;
    this.disposed = deep;
    this.S = void 0;
    this.K = void 0;
    this.U = void 0;
  }
  get(symbol) {
    var _a2;
    return (_a2 = this.context) == null ? void 0 : _a2[symbol];
  }
  E(fn, owner, observer) {
    const ownerPrev = OWNER;
    const observerPrev = OBSERVER;
    setOwner(owner);
    setObserver(observer);
    try {
      return fn();
    } catch (error) {
      this.catch(castError$1(error), false);
      return UNAVAILABLE;
    } finally {
      setOwner(ownerPrev);
      setObserver(observerPrev);
    }
  }
}
class SuperRoot extends Owner {
  constructor() {
    super(...arguments);
    this.context = {};
  }
}
let SUPER_OWNER = new SuperRoot();
let OBSERVER;
let OWNER = SUPER_OWNER;
const setObserver = (value) => OBSERVER = value;
const setOwner = (value) => OWNER = value;
let Scheduler$2 = class Scheduler {
  constructor() {
    this.A1 = [];
    this.M = 0;
    this.A2 = false;
    this.N = () => {
      if (this.A2)
        return;
      if (this.M)
        return;
      if (!this.A1.length)
        return;
      try {
        this.A2 = true;
        while (true) {
          const queue = this.A1;
          if (!queue.length)
            break;
          this.A1 = [];
          for (let i = 0, l = queue.length; i < l; i++) {
            queue[i].C();
          }
        }
      } finally {
        this.A2 = false;
      }
    };
    this.E = (fn) => {
      this.M += 1;
      fn();
      this.M -= 1;
      this.N();
    };
    this.F = (observer) => {
      this.A1.push(observer);
    };
  }
};
const SchedulerSync = new Scheduler$2();
class Observable {
  /* CONSTRUCTOR */
  constructor(value, options2, parent) {
    this.K = /* @__PURE__ */ new Set();
    this.value = value;
    if (parent) {
      this.parent = parent;
    }
    if ((options2 == null ? void 0 : options2.equals) !== void 0) {
      this.equals = options2.equals || nope;
    }
  }
  /* API */
  get() {
    var _a2, _b2;
    if (!((_a2 = this.parent) == null ? void 0 : _a2.disposed)) {
      (_b2 = this.parent) == null ? void 0 : _b2.C();
      OBSERVER == null ? void 0 : OBSERVER.A.L(this);
    }
    return this.value;
  }
  set(value) {
    const equals = this.equals || is;
    const fresh = this.value === UNINITIALIZED || !equals(value, this.value);
    if (!fresh)
      return value;
    this.value = value;
    SchedulerSync.M += 1;
    this.I(DIRTY_YES);
    SchedulerSync.M -= 1;
    SchedulerSync.N();
    return value;
  }
  I(J) {
    for (const observer of this.K) {
      if (observer.J !== DIRTY_MAYBE_NO || observer.A.has(this)) {
        if (observer.sync) {
          observer.J = Math.max(observer.J, J);
          SchedulerSync.F(observer);
        } else {
          observer.I(J);
        }
      }
    }
  }
  C(fn) {
    const value = fn(this.value);
    return this.set(value);
  }
}
class ObservablesArray {
  /* CONSTRUCTOR */
  constructor(observer) {
    this.observer = observer;
    this.A = [];
    this.P = 0;
  }
  /* API */
  Q(deep) {
    if (deep) {
      const { observer, A } = this;
      for (let i = 0; i < A.length; i++) {
        A[i].K.delete(observer);
      }
    }
    this.P = 0;
  }
  R() {
    const { observer, A, P } = this;
    const observablesLength = A.length;
    if (P < observablesLength) {
      for (let i = P; i < observablesLength; i++) {
        A[i].K.delete(observer);
      }
      A.length = P;
    }
  }
  empty() {
    return !this.A.length;
  }
  has(observable2) {
    const index = this.A.indexOf(observable2);
    return index >= 0 && index < this.P;
  }
  L(observable2) {
    const { observer, A, P } = this;
    const observablesLength = A.length;
    if (observablesLength > 0) {
      if (A[P] === observable2) {
        this.P += 1;
        return;
      }
      const index = A.indexOf(observable2);
      if (index >= 0 && index < P) {
        return;
      }
      if (P < observablesLength - 1) {
        this.R();
      } else if (P === observablesLength - 1) {
        A[P].K.delete(observer);
      }
    }
    observable2.K.add(observer);
    A[this.P++] = observable2;
    if (P === 128) {
      observer.A = new ObservablesSet(observer, A);
    }
  }
  C() {
    var _a2;
    const { A } = this;
    for (let i = 0, l = A.length; i < l; i++) {
      (_a2 = A[i].parent) == null ? void 0 : _a2.C();
    }
  }
}
class ObservablesSet {
  /* CONSTRUCTOR */
  constructor(observer, A) {
    this.observer = observer;
    this.A = new Set(A);
  }
  /* API */
  Q(deep) {
    for (const observable2 of this.A) {
      observable2.K.delete(this.observer);
    }
  }
  R() {
    return;
  }
  empty() {
    return !this.A.size;
  }
  has(observable2) {
    return this.A.has(observable2);
  }
  L(observable2) {
    const { observer, A } = this;
    const sizePrev = A.size;
    observable2.K.add(observer);
    const sizeNext = A.size;
    if (sizePrev === sizeNext)
      return;
    A.add(observable2);
  }
  C() {
    var _a2;
    for (const observable2 of this.A) {
      (_a2 = observable2.parent) == null ? void 0 : _a2.C();
    }
  }
}
class Observer extends Owner {
  /* CONSTRUCTOR */
  constructor() {
    super();
    this.parent = OWNER;
    this.context = OWNER.context;
    this.J = DIRTY_YES;
    this.A = new ObservablesArray(this);
    if (OWNER !== SUPER_OWNER) {
      lazyArrayPush(this.parent, "K", this);
    }
  }
  /* API */
  Q(deep) {
    this.A.Q(deep);
    super.Q(deep);
  }
  H(fn) {
    this.Q(false);
    this.J = DIRTY_MAYBE_NO;
    try {
      return this.E(fn, this, this);
    } finally {
      this.A.R();
    }
  }
  run() {
    throw new Error("Abstract method");
  }
  I(J) {
    throw new Error("Abstract method");
  }
  C() {
    if (this.disposed)
      return;
    if (this.J === DIRTY_MAYBE_YES) {
      this.A.C();
    }
    if (this.J === DIRTY_YES) {
      this.J = DIRTY_MAYBE_NO;
      this.run();
      if (this.J === DIRTY_MAYBE_NO) {
        this.J = DIRTY_NO;
      } else {
        this.C();
      }
    } else {
      this.J = DIRTY_NO;
    }
  }
}
const cleanup = (fn) => {
  lazyArrayPush(OWNER, "B", fn);
};
const cleanup$1 = cleanup;
class Context extends Owner {
  /* CONSTRUCTOR */
  constructor(context2) {
    super();
    this.parent = OWNER;
    this.context = { ...OWNER.context, ...context2 };
    lazyArrayPush(this.parent, "D", this);
  }
  /* API */
  E(fn) {
    return super.E(fn, this, void 0);
  }
}
const Context$1 = Context;
function context(symbolOrContext, fn) {
  if (isSymbol$2(symbolOrContext)) {
    return OWNER.context[symbolOrContext];
  } else {
    return new Context$1(symbolOrContext).E(fn || noop$1);
  }
}
class Scheduler2 {
  constructor() {
    this.A1 = [];
    this.A2 = false;
    this.A3 = false;
    this.N = () => {
      if (this.A2)
        return;
      if (!this.A1.length)
        return;
      try {
        this.A2 = true;
        while (true) {
          const queue = this.A1;
          if (!queue.length)
            break;
          this.A1 = [];
          for (let i = 0, l = queue.length; i < l; i++) {
            queue[i].C();
          }
        }
      } finally {
        this.A2 = false;
      }
    };
    this.queue = () => {
      if (this.A3)
        return;
      this.A3 = true;
      this.resolve();
    };
    this.resolve = () => {
      queueMicrotask(() => {
        queueMicrotask(() => {
          {
            this.A3 = false;
            this.N();
          }
        });
      });
    };
    this.F = (effect2) => {
      this.A1.push(effect2);
      this.queue();
    };
  }
}
const Scheduler$1 = new Scheduler2();
class Effect extends Observer {
  /* CONSTRUCTOR */
  constructor(fn, options2) {
    super();
    this.fn = fn;
    if ((options2 == null ? void 0 : options2.suspense) !== false) {
      const suspense = this.get(SYMBOL_SUSPENSE$1);
      if (suspense) {
        this.suspense = suspense;
      }
    }
    if ((options2 == null ? void 0 : options2.sync) === true) {
      this.sync = true;
    }
    if ((options2 == null ? void 0 : options2.sync) === "init") {
      this.init = true;
      this.C();
    } else {
      this.F();
    }
  }
  /* API */
  run() {
    const G = super.H(this.fn);
    if (isFunction$1(G)) {
      lazyArrayPush(this, "B", G);
    }
  }
  F() {
    var _a2;
    if ((_a2 = this.suspense) == null ? void 0 : _a2.suspended)
      return;
    if (this.sync) {
      this.C();
    } else {
      Scheduler$1.F(this);
    }
  }
  I(J) {
    const statusPrev = this.J;
    if (statusPrev >= J)
      return;
    this.J = J;
    if (!this.sync || statusPrev !== 2 && statusPrev !== 3) {
      this.F();
    }
  }
  C() {
    var _a2;
    if ((_a2 = this.suspense) == null ? void 0 : _a2.suspended)
      return;
    super.C();
  }
}
const effect = (fn, options2) => {
  const effect2 = new Effect(fn, options2);
  const Q = () => effect2.Q(true);
  return Q;
};
const isObservable = (value) => {
  return isFunction$1(value) && SYMBOL_OBSERVABLE in value;
};
function get(value, getFunction = true) {
  const is2 = getFunction ? isFunction$1 : isObservable;
  if (is2(value)) {
    return value();
  } else {
    return value;
  }
}
const isStore = (value) => {
  return isObject$1$1(value) && SYMBOL_STORE in value;
};
const isStore$1 = isStore;
function untrack(fn) {
  if (isFunction$1(fn)) {
    const observerPrev = OBSERVER;
    if (observerPrev) {
      try {
        setObserver(void 0);
        return fn();
      } finally {
        setObserver(observerPrev);
      }
    } else {
      return fn();
    }
  } else {
    return fn;
  }
}
const isBatching = () => {
  return Scheduler$1.A3 || Scheduler$1.A2 || SchedulerSync.A2;
};
const isBatching$1 = isBatching;
class StoreMap extends Map {
  AH(key, value) {
    super.set(key, value);
    return value;
  }
}
class StoreCleanable {
  constructor() {
    this.AE = 0;
  }
  listen() {
    this.AE += 1;
    cleanup$1(this);
  }
  call() {
    this.AE -= 1;
    if (this.AE)
      return;
    this.Q();
  }
  Q() {
  }
}
class StoreKeys extends StoreCleanable {
  constructor(parent, observable2) {
    super();
    this.parent = parent;
    this.observable = observable2;
  }
  Q() {
    this.parent.keys = void 0;
  }
}
class StoreValues extends StoreCleanable {
  constructor(parent, observable2) {
    super();
    this.parent = parent;
    this.observable = observable2;
  }
  Q() {
    this.parent.values = void 0;
  }
}
class StoreHas extends StoreCleanable {
  constructor(parent, key, observable2) {
    super();
    this.parent = parent;
    this.key = key;
    this.observable = observable2;
  }
  Q() {
    var _a2;
    (_a2 = this.parent.has) == null ? void 0 : _a2.delete(this.key);
  }
}
class StoreProperty extends StoreCleanable {
  constructor(parent, key, observable2, AI) {
    super();
    this.parent = parent;
    this.key = key;
    this.observable = observable2;
    this.AI = AI;
  }
  Q() {
    var _a2;
    (_a2 = this.parent.AJ) == null ? void 0 : _a2.delete(this.key);
  }
}
const StoreListenersRegular = {
  /* VARIABLES */
  AK: 0,
  AL: /* @__PURE__ */ new Set(),
  AM: /* @__PURE__ */ new Set(),
  /* API */
  AN: () => {
    const { AL, AM } = StoreListenersRegular;
    const traversed = /* @__PURE__ */ new Set();
    const traverse = (AI) => {
      if (traversed.has(AI))
        return;
      traversed.add(AI);
      lazySetEach(AI.AO, traverse);
      lazySetEach(AI.AP, (listener) => {
        AL.add(listener);
      });
    };
    AM.forEach(traverse);
    return () => {
      AL.forEach((listener) => {
        listener();
      });
    };
  },
  V: (AI) => {
    StoreListenersRegular.AM.add(AI);
    StoreScheduler.F();
  },
  reset: () => {
    StoreListenersRegular.AL = /* @__PURE__ */ new Set();
    StoreListenersRegular.AM = /* @__PURE__ */ new Set();
  }
};
const StoreListenersRoots = {
  /* VARIABLES */
  AK: 0,
  AM: /* @__PURE__ */ new Map(),
  /* API */
  AN: () => {
    const { AM } = StoreListenersRoots;
    return () => {
      AM.forEach((rootsSet, store2) => {
        const T = Array.from(rootsSet);
        lazySetEach(store2.AQ, (listener) => {
          listener(T);
        });
      });
    };
  },
  V: (store2, root2) => {
    const T = StoreListenersRoots.AM.get(store2) || /* @__PURE__ */ new Set();
    T.add(root2);
    StoreListenersRoots.AM.set(store2, T);
    StoreScheduler.F();
  },
  AR: (current, parent, key) => {
    if (!parent.AO) {
      const root2 = (current == null ? void 0 : current.store) || untrack(() => parent.store[key]);
      StoreListenersRoots.V(parent, root2);
    } else {
      const traversed = /* @__PURE__ */ new Set();
      const traverse = (AI) => {
        if (traversed.has(AI))
          return;
        traversed.add(AI);
        lazySetEach(AI.AO, (parent2) => {
          if (!parent2.AO) {
            StoreListenersRoots.V(parent2, AI.store);
          }
          traverse(parent2);
        });
      };
      traverse(current || parent);
    }
  },
  reset: () => {
    StoreListenersRoots.AM = /* @__PURE__ */ new Map();
  }
};
const StoreScheduler = {
  /* VARIABLES */
  AK: false,
  /* API */
  N: () => {
    const flushRegular = StoreListenersRegular.AN();
    const flushRoots = StoreListenersRoots.AN();
    StoreScheduler.reset();
    flushRegular();
    flushRoots();
  },
  AS: () => {
    if (isBatching$1()) {
      {
        setTimeout(StoreScheduler.AS, 0);
      }
    } else {
      StoreScheduler.N();
    }
  },
  reset: () => {
    StoreScheduler.AK = false;
    StoreListenersRegular.reset();
    StoreListenersRoots.reset();
  },
  F: () => {
    if (StoreScheduler.AK)
      return;
    StoreScheduler.AK = true;
    queueMicrotask(StoreScheduler.AS);
  }
};
const NODES = /* @__PURE__ */ new WeakMap();
const SPECIAL_SYMBOLS = /* @__PURE__ */ new Set([SYMBOL_STORE, SYMBOL_STORE_KEYS, SYMBOL_STORE_OBSERVABLE, SYMBOL_STORE_TARGET, SYMBOL_STORE_VALUES]);
const UNREACTIVE_KEYS = /* @__PURE__ */ new Set(["__proto__", "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__", "prototype", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toSource", "toString", "valueOf"]);
const STORE_TRAPS = {
  /* API */
  get: (target, key) => {
    var _a2, _b2;
    if (SPECIAL_SYMBOLS.has(key)) {
      if (key === SYMBOL_STORE)
        return true;
      if (key === SYMBOL_STORE_TARGET)
        return target;
      if (key === SYMBOL_STORE_KEYS) {
        if (isListenable()) {
          const AI2 = getNodeExisting(target);
          AI2.keys || (AI2.keys = getNodeKeys(AI2));
          AI2.keys.listen();
          AI2.keys.observable.get();
        }
        return;
      }
      if (key === SYMBOL_STORE_VALUES) {
        if (isListenable()) {
          const AI2 = getNodeExisting(target);
          AI2.values || (AI2.values = getNodeValues(AI2));
          AI2.values.listen();
          AI2.values.observable.get();
        }
        return;
      }
      if (key === SYMBOL_STORE_OBSERVABLE) {
        return (key2) => {
          var _a22;
          key2 = typeof key2 === "number" ? String(key2) : key2;
          const AI2 = getNodeExisting(target);
          const getter2 = (_a22 = AI2.AT) == null ? void 0 : _a22.get(key2);
          if (getter2)
            return getter2.bind(AI2.store);
          AI2.AJ || (AI2.AJ = new StoreMap());
          const value2 = target[key2];
          const property2 = AI2.AJ.get(key2) || AI2.AJ.AH(key2, getNodeProperty(AI2, key2, value2));
          const options2 = AI2.equals ? { equals: AI2.equals } : void 0;
          property2.observable || (property2.observable = getNodeObservable(AI2, value2, options2));
          const observable2 = readable(property2.observable);
          return observable2;
        };
      }
    }
    if (UNREACTIVE_KEYS.has(key))
      return target[key];
    const AI = getNodeExisting(target);
    const getter = (_a2 = AI.AT) == null ? void 0 : _a2.get(key);
    const value = getter || target[key];
    AI.AJ || (AI.AJ = new StoreMap());
    const listenable = isListenable();
    const proxiable = isProxiable(value);
    const property = listenable || proxiable ? AI.AJ.get(key) || AI.AJ.AH(key, getNodeProperty(AI, key, value)) : void 0;
    if (property == null ? void 0 : property.AI) {
      lazySetAdd(property.AI, "AO", AI);
    }
    if (property && listenable) {
      const options2 = AI.equals ? { equals: AI.equals } : void 0;
      property.listen();
      property.observable || (property.observable = getNodeObservable(AI, value, options2));
      property.observable.get();
    }
    if (getter) {
      return getter.call(AI.store);
    } else {
      if (typeof value === "function" && value === Array.prototype[key]) {
        return function() {
          return value.apply(AI.store, arguments);
        };
      }
      return ((_b2 = property == null ? void 0 : property.AI) == null ? void 0 : _b2.store) || value;
    }
  },
  set: (target, key, value) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j;
    value = getTarget(value);
    const AI = getNodeExisting(target);
    const setter = (_a2 = AI.AU) == null ? void 0 : _a2.get(key);
    if (setter) {
      setter.call(AI.store, value);
    } else {
      const targetIsArray = isArray$1(target);
      const valuePrev = target[key];
      const hadProperty = !!valuePrev || key in target;
      const equals = AI.equals || is;
      if (hadProperty && equals(value, valuePrev) && (key !== "length" || !targetIsArray))
        return true;
      const lengthPrev = targetIsArray && target["length"];
      target[key] = value;
      const lengthNext = targetIsArray && target["length"];
      if (targetIsArray && key !== "length" && lengthPrev !== lengthNext) {
        (_d = (_c = (_b2 = AI.AJ) == null ? void 0 : _b2.get("length")) == null ? void 0 : _c.observable) == null ? void 0 : _d.set(lengthNext);
      }
      (_e = AI.values) == null ? void 0 : _e.observable.set(0);
      if (!hadProperty) {
        (_f = AI.keys) == null ? void 0 : _f.observable.set(0);
        (_h = (_g = AI.has) == null ? void 0 : _g.get(key)) == null ? void 0 : _h.observable.set(true);
      }
      const property = (_i = AI.AJ) == null ? void 0 : _i.get(key);
      if (property == null ? void 0 : property.AI) {
        lazySetDelete(property.AI, "AO", AI);
      }
      if (property) {
        (_j = property.observable) == null ? void 0 : _j.set(value);
        property.AI = isProxiable(value) ? NODES.get(value) || getNode(value, key, AI) : void 0;
      }
      if (property == null ? void 0 : property.AI) {
        lazySetAdd(property.AI, "AO", AI);
      }
      if (StoreListenersRoots.AK) {
        StoreListenersRoots.AR(property == null ? void 0 : property.AI, AI, key);
      }
      if (StoreListenersRegular.AK) {
        StoreListenersRegular.V(AI);
      }
      if (targetIsArray && key === "length") {
        const lengthPrev2 = Number(valuePrev);
        const lengthNext2 = Number(value);
        for (let i = lengthNext2; i < lengthPrev2; i++) {
          if (i in target)
            continue;
          STORE_TRAPS.deleteProperty(target, `${i}`, true);
        }
      }
    }
    return true;
  },
  deleteProperty: (target, key, _force) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    const hasProperty = key in target;
    if (!_force && !hasProperty)
      return true;
    const deleted = Reflect.deleteProperty(target, key);
    if (!deleted)
      return false;
    const AI = getNodeExisting(target);
    (_a2 = AI.AT) == null ? void 0 : _a2.delete(key);
    (_b2 = AI.AU) == null ? void 0 : _b2.delete(key);
    (_c = AI.keys) == null ? void 0 : _c.observable.set(0);
    (_d = AI.values) == null ? void 0 : _d.observable.set(0);
    (_f = (_e = AI.has) == null ? void 0 : _e.get(key)) == null ? void 0 : _f.observable.set(false);
    const property = (_g = AI.AJ) == null ? void 0 : _g.get(key);
    if (StoreListenersRoots.AK) {
      StoreListenersRoots.AR(property == null ? void 0 : property.AI, AI, key);
    }
    if (property == null ? void 0 : property.AI) {
      lazySetDelete(property.AI, "AO", AI);
    }
    if (property) {
      (_h = property.observable) == null ? void 0 : _h.set(void 0);
      property.AI = void 0;
    }
    if (StoreListenersRegular.AK) {
      StoreListenersRegular.V(AI);
    }
    return true;
  },
  defineProperty: (target, key, descriptor) => {
    var _a2, _b2, _c, _d, _e, _f, _g, _h;
    const AI = getNodeExisting(target);
    const equals = AI.equals || is;
    const hadProperty = key in target;
    const descriptorPrev = Reflect.getOwnPropertyDescriptor(target, key);
    if ("value" in descriptor && isStore$1(descriptor.value)) {
      descriptor = { ...descriptor, value: getTarget(descriptor.value) };
    }
    if (descriptorPrev && isEqualDescriptor(descriptorPrev, descriptor, equals))
      return true;
    const defined = Reflect.defineProperty(target, key, descriptor);
    if (!defined)
      return false;
    if (!descriptor.get) {
      (_a2 = AI.AT) == null ? void 0 : _a2.delete(key);
    } else if (descriptor.get) {
      AI.AT || (AI.AT = new StoreMap());
      AI.AT.set(key, descriptor.get);
    }
    if (!descriptor.set) {
      (_b2 = AI.AU) == null ? void 0 : _b2.delete(key);
    } else if (descriptor.set) {
      AI.AU || (AI.AU = new StoreMap());
      AI.AU.set(key, descriptor.set);
    }
    if (hadProperty !== !!descriptor.enumerable) {
      (_c = AI.keys) == null ? void 0 : _c.observable.set(0);
    }
    (_e = (_d = AI.has) == null ? void 0 : _d.get(key)) == null ? void 0 : _e.observable.set(true);
    const property = (_f = AI.AJ) == null ? void 0 : _f.get(key);
    if (StoreListenersRoots.AK) {
      StoreListenersRoots.AR(property == null ? void 0 : property.AI, AI, key);
    }
    if (property == null ? void 0 : property.AI) {
      lazySetDelete(property.AI, "AO", AI);
    }
    if (property) {
      if ("get" in descriptor) {
        (_g = property.observable) == null ? void 0 : _g.set(descriptor.get);
        property.AI = void 0;
      } else {
        const value = descriptor.value;
        (_h = property.observable) == null ? void 0 : _h.set(value);
        property.AI = isProxiable(value) ? NODES.get(value) || getNode(value, key, AI) : void 0;
      }
    }
    if (property == null ? void 0 : property.AI) {
      lazySetAdd(property.AI, "AO", AI);
    }
    if (StoreListenersRoots.AK) {
      StoreListenersRoots.AR(property == null ? void 0 : property.AI, AI, key);
    }
    if (StoreListenersRegular.AK) {
      StoreListenersRegular.V(AI);
    }
    return true;
  },
  has: (target, key) => {
    if (key === SYMBOL_STORE)
      return true;
    if (key === SYMBOL_STORE_TARGET)
      return true;
    const value = key in target;
    if (isListenable()) {
      const AI = getNodeExisting(target);
      AI.has || (AI.has = new StoreMap());
      const has = AI.has.get(key) || AI.has.AH(key, getNodeHas(AI, key, value));
      has.listen();
      has.observable.get();
    }
    return value;
  },
  ownKeys: (target) => {
    const keys = Reflect.ownKeys(target);
    if (isListenable()) {
      const AI = getNodeExisting(target);
      AI.keys || (AI.keys = getNodeKeys(AI));
      AI.keys.listen();
      AI.keys.observable.get();
    }
    return keys;
  }
};
const STORE_UNTRACK_TRAPS = {
  /* API */
  has: (target, key) => {
    if (key === SYMBOL_STORE_UNTRACKED)
      return true;
    return key in target;
  }
};
const getNode = (value, key, parent, equals) => {
  if (isStore$1(value))
    return getNodeExisting(getTarget(value));
  const store2 = isFrozenLike(value, key, parent) ? value : new Proxy(value, STORE_TRAPS);
  const gettersAndSetters = getGettersAndSetters(value);
  const AI = { AO: parent, store: store2 };
  if (gettersAndSetters) {
    const { AT, AU } = gettersAndSetters;
    if (AT)
      AI.AT = AT;
    if (AU)
      AI.AU = AU;
  }
  if (equals === false) {
    AI.equals = nope;
  } else if (equals) {
    AI.equals = equals;
  } else if (parent == null ? void 0 : parent.equals) {
    AI.equals = parent.equals;
  }
  NODES.set(value, AI);
  return AI;
};
const getNodeExisting = (value) => {
  const AI = NODES.get(value);
  if (!AI)
    throw new Error("Impossible");
  return AI;
};
const getNodeFromStore = (store2) => {
  return getNodeExisting(getTarget(store2));
};
const getNodeKeys = (AI) => {
  const observable2 = getNodeObservable(AI, 0, { equals: false });
  const keys = new StoreKeys(AI, observable2);
  return keys;
};
const getNodeValues = (AI) => {
  const observable2 = getNodeObservable(AI, 0, { equals: false });
  const values = new StoreValues(AI, observable2);
  return values;
};
const getNodeHas = (AI, key, value) => {
  const observable2 = getNodeObservable(AI, value);
  const has = new StoreHas(AI, key, observable2);
  return has;
};
const getNodeObservable = (AI, value, options2) => {
  return new Observable(value, options2);
};
const getNodeProperty = (AI, key, value) => {
  const observable2 = void 0;
  const propertyNode = isProxiable(value) ? NODES.get(value) || getNode(value, key, AI) : void 0;
  const property = new StoreProperty(AI, key, observable2, propertyNode);
  AI.AJ || (AI.AJ = new StoreMap());
  AI.AJ.set(key, property);
  return property;
};
const getGettersAndSetters = (value) => {
  if (isArray$1(value))
    return;
  let AT;
  let AU;
  const keys = Object.keys(value);
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor)
      continue;
    const { get: get2, set } = descriptor;
    if (get2) {
      AT || (AT = new StoreMap());
      AT.set(key, get2);
    }
    if (set) {
      AU || (AU = new StoreMap());
      AU.set(key, set);
    }
    if (get2 && !set) {
      AU || (AU = new StoreMap());
      AU.set(key, throwNoSetterError);
    }
  }
  if (!AT && !AU)
    return;
  return { AT, AU };
};
const getStore = (value, options2) => {
  if (isStore$1(value))
    return value;
  const AI = NODES.get(value) || getNode(value, void 0, void 0, options2 == null ? void 0 : options2.equals);
  return AI.store;
};
const getTarget = (value) => {
  if (isStore$1(value))
    return value[SYMBOL_STORE_TARGET];
  return value;
};
const getUntracked = (value) => {
  if (!isObject$1$1(value))
    return value;
  if (isUntracked(value))
    return value;
  return new Proxy(value, STORE_UNTRACK_TRAPS);
};
const isEqualDescriptor = (a, b, equals) => {
  return !!a.configurable === !!b.configurable && !!a.enumerable === !!b.enumerable && !!a.writable === !!b.writable && equals(a.value, b.value) && a.get === b.get && a.set === b.set;
};
const isFrozenLike = (value, key, parent) => {
  if (Object.isFrozen(value))
    return true;
  if (!parent || key === void 0)
    return false;
  const target = store.unwrap(parent.store);
  const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
  if ((descriptor == null ? void 0 : descriptor.configurable) || (descriptor == null ? void 0 : descriptor.writable))
    return false;
  return true;
};
const isListenable = () => {
  return !!OBSERVER;
};
const isProxiable = (value) => {
  if (value === null || typeof value !== "object")
    return false;
  if (SYMBOL_STORE in value)
    return true;
  if (SYMBOL_STORE_UNTRACKED in value)
    return false;
  if (isArray$1(value))
    return true;
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null)
    return true;
  return Object.getPrototypeOf(prototype) === null;
};
const isUntracked = (value) => {
  if (value === null || typeof value !== "object")
    return false;
  return SYMBOL_STORE_UNTRACKED in value;
};
const throwNoSetterError = () => {
  throw new TypeError("Cannot set property value of #<Object> which has only a getter");
};
const store = (value, options2) => {
  if (!isObject$1$1(value))
    return value;
  if (isUntracked(value))
    return value;
  return getStore(value, options2);
};
store.on = (target, listener) => {
  const targets = isStore$1(target) ? [target] : castArray$1(target);
  const selectors = targets.filter(isFunction$1);
  const AM = targets.filter(isStore$1).map(getNodeFromStore);
  StoreListenersRegular.AK += 1;
  const disposers = selectors.map((selector) => {
    let inited = false;
    return effect(() => {
      if (inited) {
        StoreListenersRegular.AL.add(listener);
        StoreScheduler.F();
      }
      inited = true;
      selector();
    }, { suspense: false, sync: true });
  });
  AM.forEach((AI) => {
    lazySetAdd(AI, "AP", listener);
  });
  return () => {
    StoreListenersRegular.AK -= 1;
    disposers.forEach((disposer) => {
      disposer();
    });
    AM.forEach((AI) => {
      lazySetDelete(AI, "AP", listener);
    });
  };
};
store._onRoots = (target, listener) => {
  if (!isStore$1(target))
    return noop$1;
  const AI = getNodeFromStore(target);
  if (AI.AO)
    throw new Error("Only top-level stores are supported");
  StoreListenersRoots.AK += 1;
  lazySetAdd(AI, "AQ", listener);
  return () => {
    StoreListenersRoots.AK -= 1;
    lazySetDelete(AI, "AQ", listener);
  };
};
store.reconcile = /* @__PURE__ */ (() => {
  const getType = (value) => {
    if (isArray$1(value))
      return 1;
    if (isProxiable(value))
      return 2;
    return 0;
  };
  const reconcileOuter = (prev, next) => {
    const uprev = getTarget(prev);
    const unext = getTarget(next);
    reconcileInner(prev, next);
    const prevType = getType(uprev);
    const nextType = getType(unext);
    if (prevType === 1 || nextType === 1) {
      prev.length = next.length;
    }
    return prev;
  };
  const reconcileInner = (prev, next) => {
    const uprev = getTarget(prev);
    const unext = getTarget(next);
    const prevKeys = Object.keys(uprev);
    const nextKeys = Object.keys(unext);
    for (let i = 0, l = nextKeys.length; i < l; i++) {
      const key = nextKeys[i];
      const prevValue = uprev[key];
      const nextValue = unext[key];
      if (!is(prevValue, nextValue)) {
        const prevType = getType(prevValue);
        const nextType = getType(nextValue);
        if (prevType && prevType === nextType) {
          reconcileInner(prev[key], nextValue);
          if (prevType === 1) {
            prev[key].length = nextValue.length;
          }
        } else {
          prev[key] = nextValue;
        }
      } else if (prevValue === void 0 && !(key in uprev)) {
        prev[key] = void 0;
      }
    }
    for (let i = 0, l = prevKeys.length; i < l; i++) {
      const key = prevKeys[i];
      if (!(key in unext)) {
        delete prev[key];
      }
    }
    return prev;
  };
  const reconcile = (prev, next) => {
    return untrack(() => {
      return reconcileOuter(prev, next);
    });
  };
  return reconcile;
})();
store.untrack = (value) => {
  return getUntracked(value);
};
store.unwrap = (value) => {
  return getTarget(value);
};
const store$1 = store;
const _with = () => {
  const owner = OWNER;
  const observer = OBSERVER;
  return (fn) => {
    return owner.E(() => fn(), owner, observer);
  };
};
const DIRECTIVES = {};
const SYMBOL_TEMPLATE_ACCESSOR = Symbol("Template.Accessor");
const SYMBOLS_DIRECTIVES = {};
const SYMBOL_CLONE = Symbol("CloneElement");
const { createComment, createHTMLNode, createSVGNode, createText, createDocumentFragment } = (() => {
  if (typeof via !== "undefined") {
    const document2 = via.document;
    const createComment2 = document2.createComment;
    const createHTMLNode2 = document2.createElement;
    const createSVGNode2 = (name) => document2.createElementNS("http://www.w3.org/2000/svg", name);
    const createText2 = document2.createTextNode;
    const createDocumentFragment2 = document2.createDocumentFragment;
    return { createComment: createComment2, createHTMLNode: createHTMLNode2, createSVGNode: createSVGNode2, createText: createText2, createDocumentFragment: createDocumentFragment2 };
  } else {
    const createComment2 = document.createComment.bind(document, "");
    const createHTMLNode2 = document.createElement.bind(document);
    const createSVGNode2 = document.createElementNS.bind(document, "http://www.w3.org/2000/svg");
    const createText2 = document.createTextNode.bind(document);
    const createDocumentFragment2 = document.createDocumentFragment.bind(document);
    return { createComment: createComment2, createHTMLNode: createHTMLNode2, createSVGNode: createSVGNode2, createText: createText2, createDocumentFragment: createDocumentFragment2 };
  }
})();
const { assign } = Object;
const castArray = (value) => {
  return isArray(value) ? value : [value];
};
const flatten = (arr) => {
  for (let i = 0, l = arr.length; i < l; i++) {
    if (!isArray(arr[i]))
      continue;
    return arr.flat(Infinity);
  }
  return arr;
};
const { isArray } = Array;
const isBoolean = (value) => {
  return typeof value === "boolean";
};
const isFunction$2 = (value) => {
  return typeof value === "function";
};
const isFunctionReactive = (value) => {
  var _a2, _b2;
  return !(SYMBOL_UNTRACKED in value || SYMBOL_UNTRACKED_UNWRAPPED in value || SYMBOL_OBSERVABLE_FROZEN in value || ((_b2 = (_a2 = value[SYMBOL_OBSERVABLE_READABLE]) == null ? void 0 : _a2.parent) == null ? void 0 : _b2.disposed));
};
const isNil = (value) => {
  return value === null || value === void 0;
};
const isNode = (value) => {
  return value instanceof Node;
};
const isObject$3 = (value) => {
  return typeof value === "object" && value !== null;
};
const isString = (value) => {
  return typeof value === "string";
};
const isSVG = (value) => {
  return !!value["isSVG"];
};
const isSVGElement = /* @__PURE__ */ (() => {
  const svgRe = /^(t(ext$|s)|s[vwy]|g)|^set|tad|ker|p(at|s)|s(to|c$|ca|k)|r(ec|cl)|ew|us|f($|e|s)|cu|n[ei]|l[ty]|[GOP]/;
  const svgCache = {};
  return (element) => {
    const cached = svgCache[element];
    return cached !== void 0 ? cached : svgCache[element] = !element.includes("-") && svgRe.test(element);
  };
})();
const isTemplateAccessor = (value) => {
  return isFunction$2(value) && SYMBOL_TEMPLATE_ACCESSOR in value;
};
const isVoidChild = (value) => {
  return value === null || value === void 0 || typeof value === "boolean" || typeof value === "symbol";
};
const options = {
  sync: "init"
};
const useRenderEffect = (fn) => {
  return effect(fn, options);
};
const useCheapDisposed = () => {
  let disposed = false;
  const get2 = () => disposed;
  const set = () => disposed = true;
  cleanup$1(set);
  return get2;
};
const useMicrotask = (fn) => {
  const disposed = useCheapDisposed();
  const runWithOwner = _with();
  queueMicrotask(() => {
    if (disposed())
      return;
    runWithOwner(fn);
  });
};
const useMicrotask$1 = useMicrotask;
const classesToggle = (element, classes, force) => {
  const { className } = element;
  if (isString(className)) {
    if (!className) {
      if (force) {
        element.className = classes;
        return;
      } else {
        return;
      }
    } else if (!force && className === classes) {
      element.className = "";
      return;
    }
  }
  if (classes.includes(" ")) {
    classes.split(" ").forEach((cls) => {
      if (!cls.length)
        return;
      element.classList.toggle(cls, !!force);
    });
  } else {
    element.classList.toggle(classes, !!force);
  }
};
const dummyNode = createComment("");
const beforeDummyWrapper = [dummyNode];
const afterDummyWrapper = [dummyNode];
const diff = (parent, before, after, nextSibling) => {
  if (before === after)
    return;
  if (before instanceof Node) {
    if (after instanceof Node) {
      if (before.parentNode === parent) {
        parent.replaceChild(after, before);
        return;
      }
    }
    beforeDummyWrapper[0] = before;
    before = beforeDummyWrapper;
  }
  if (after instanceof Node) {
    afterDummyWrapper[0] = after;
    after = afterDummyWrapper;
  }
  const bLength = after.length;
  let aEnd = before.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map = null;
  let removable;
  while (aStart < aEnd || bStart < bEnd) {
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? after[bStart - 1].nextSibling : after[bEnd - bStart] : nextSibling;
      if (bStart < bEnd) {
        if (node) {
          node.before.apply(node, after.slice(bStart, bEnd));
        } else {
          parent.append.apply(parent, after.slice(bStart, bEnd));
        }
        bStart = bEnd;
      }
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(before[aStart])) {
          removable = before[aStart];
          if (removable.parentNode === parent) {
            parent.removeChild(removable);
          }
        }
        aStart++;
      }
    } else if (before[aStart] === after[bStart]) {
      aStart++;
      bStart++;
    } else if (before[aEnd - 1] === after[bEnd - 1]) {
      aEnd--;
      bEnd--;
    } else if (before[aStart] === after[bEnd - 1] && after[bStart] === before[aEnd - 1]) {
      const node = before[--aEnd].nextSibling;
      parent.insertBefore(
        after[bStart++],
        before[aStart++].nextSibling
      );
      parent.insertBefore(after[--bEnd], node);
      before[aEnd] = after[bEnd];
    } else {
      if (!map) {
        map = /* @__PURE__ */ new Map();
        let i = bStart;
        while (i < bEnd)
          map.set(after[i], i++);
      }
      if (map.has(before[aStart])) {
        const index = map.get(before[aStart]);
        if (bStart < index && index < bEnd) {
          let i = aStart;
          let sequence = 1;
          while (++i < aEnd && i < bEnd && map.get(before[i]) === index + sequence)
            sequence++;
          if (sequence > index - bStart) {
            const node = before[aStart];
            if (bStart < index) {
              if (node) {
                node.before.apply(node, after.slice(bStart, index));
              } else {
                parent.append.apply(parent, after.slice(bStart, index));
              }
              bStart = index;
            }
          } else {
            parent.replaceChild(
              after[bStart++],
              before[aStart++]
            );
          }
        } else
          aStart++;
      } else {
        removable = before[aStart++];
        if (removable.parentNode === parent) {
          parent.removeChild(removable);
        }
      }
    }
  }
  beforeDummyWrapper[0] = dummyNode;
  afterDummyWrapper[0] = dummyNode;
};
const NOOP_CHILDREN = [];
const FragmentUtils = {
  make: () => {
    return {
      values: void 0,
      length: 0
    };
  },
  makeWithNode: (node) => {
    return {
      values: node,
      length: 1
    };
  },
  makeWithFragment: (fragment) => {
    return {
      values: fragment,
      fragmented: true,
      length: 1
    };
  },
  getChildrenFragmented: (thiz, children = []) => {
    const { values, length } = thiz;
    if (!length)
      return children;
    if (values instanceof Array) {
      for (let i = 0, l = values.length; i < l; i++) {
        const value = values[i];
        if (value instanceof Node) {
          children.push(value);
        } else {
          FragmentUtils.getChildrenFragmented(value, children);
        }
      }
    } else {
      if (values instanceof Node) {
        children.push(values);
      } else {
        FragmentUtils.getChildrenFragmented(values, children);
      }
    }
    return children;
  },
  getChildren: (thiz) => {
    if (!thiz.length)
      return NOOP_CHILDREN;
    if (!thiz.fragmented)
      return thiz.values;
    if (thiz.length === 1)
      return FragmentUtils.getChildren(thiz.values);
    return FragmentUtils.getChildrenFragmented(thiz);
  },
  pushFragment: (thiz, fragment) => {
    FragmentUtils.pushValue(thiz, fragment);
    thiz.fragmented = true;
  },
  pushNode: (thiz, node) => {
    FragmentUtils.pushValue(thiz, node);
  },
  pushValue: (thiz, value) => {
    const { values, length } = thiz;
    if (length === 0) {
      thiz.values = value;
    } else if (length === 1) {
      thiz.values = [values, value];
    } else {
      values.push(value);
    }
    thiz.length += 1;
  },
  replaceWithNode: (thiz, node) => {
    thiz.values = node;
    delete thiz.fragmented;
    thiz.length = 1;
  },
  replaceWithFragment: (thiz, fragment) => {
    thiz.values = fragment.values;
    thiz.fragmented = fragment.fragmented;
    thiz.length = fragment.length;
  }
};
const resolveChild = (value, setter, _dynamic = false) => {
  if (isFunction$2(value)) {
    if (!isFunctionReactive(value)) {
      resolveChild(value(), setter, _dynamic);
    } else {
      useRenderEffect(() => {
        resolveChild(value(), setter, true);
      });
    }
  } else if (isArray(value)) {
    const [values, hasObservables] = resolveArraysAndStatics(value);
    values[SYMBOL_UNCACHED] = value[SYMBOL_UNCACHED];
    setter(values, hasObservables || _dynamic);
  } else {
    setter(value, _dynamic);
  }
};
const resolveClass = (classes, resolved = {}) => {
  if (isString(classes)) {
    classes.split(/\s+/g).filter(Boolean).filter((cls) => {
      resolved[cls] = true;
    });
  } else if (isFunction$2(classes)) {
    resolveClass(classes(), resolved);
  } else if (isArray(classes)) {
    classes.forEach((cls) => {
      resolveClass(cls, resolved);
    });
  } else if (classes) {
    for (const key in classes) {
      const value = classes[key];
      const isActive = !!get(value);
      if (!isActive)
        continue;
      resolved[key] = true;
    }
  }
  return resolved;
};
const resolveStyle = (styles, resolved = {}) => {
  if (isString(styles)) {
    return styles;
  } else if (isFunction$2(styles)) {
    return resolveStyle(styles(), resolved);
  } else if (isArray(styles)) {
    styles.forEach((style) => {
      resolveStyle(style, resolved);
    });
  } else if (styles) {
    for (const key in styles) {
      const value = styles[key];
      resolved[key] = get(value);
    }
  }
  return resolved;
};
const resolveArraysAndStatics = /* @__PURE__ */ (() => {
  const DUMMY_RESOLVED = [];
  const resolveArraysAndStaticsInner = (values, resolved, hasObservables) => {
    for (let i = 0, l = values.length; i < l; i++) {
      const value = values[i];
      const type = typeof value;
      if (type === "string" || type === "number" || type === "bigint") {
        if (resolved === DUMMY_RESOLVED)
          resolved = values.slice(0, i);
        resolved.push(createText(value));
      } else if (type === "object" && isArray(value)) {
        if (resolved === DUMMY_RESOLVED)
          resolved = values.slice(0, i);
        hasObservables = resolveArraysAndStaticsInner(value, resolved, hasObservables)[1];
      } else if (type === "function" && isObservable(value)) {
        if (resolved !== DUMMY_RESOLVED)
          resolved.push(value);
        hasObservables = true;
      } else {
        if (resolved !== DUMMY_RESOLVED)
          resolved.push(value);
      }
    }
    if (resolved === DUMMY_RESOLVED)
      resolved = values;
    return [resolved, hasObservables];
  };
  return (values) => {
    return resolveArraysAndStaticsInner(values, DUMMY_RESOLVED, false);
  };
})();
const setAttributeStatic = /* @__PURE__ */ (() => {
  const attributesBoolean = /* @__PURE__ */ new Set(["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"]);
  const attributeCamelCasedRe = /e(r[HRWrv]|[Vawy])|Con|l(e[Tcs]|c)|s(eP|y)|a(t[rt]|u|v)|Of|Ex|f[XYa]|gt|hR|d[Pg]|t[TXYd]|[UZq]/;
  const attributesCache = {};
  const uppercaseRe = /[A-Z]/g;
  const normalizeKeySvg = (key) => {
    return attributesCache[key] || (attributesCache[key] = attributeCamelCasedRe.test(key) ? key : key.replace(uppercaseRe, (char) => `-${char.toLowerCase()}`));
  };
  return (element, key, value) => {
    if (isSVG(element)) {
      key = key === "xlinkHref" || key === "xlink:href" ? "href" : normalizeKeySvg(key);
      if (isNil(value) || value === false && attributesBoolean.has(key)) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, String(value));
      }
    } else {
      if (isNil(value) || value === false && attributesBoolean.has(key)) {
        element.removeAttribute(key);
      } else {
        value = value === true ? "" : String(value);
        element.setAttribute(key, value);
      }
    }
  };
})();
const setAttribute = (element, key, value) => {
  if (isFunction$2(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setAttributeStatic(element, key, value());
    });
  } else {
    setAttributeStatic(element, key, get(value));
  }
};
const setChildReplacementText = (child, childPrev) => {
  if (childPrev.nodeType === 3) {
    childPrev.nodeValue = child;
    return childPrev;
  } else {
    const parent = childPrev.parentElement;
    if (!parent)
      throw new Error("Invalid child replacement");
    const textNode = createText(child);
    parent.replaceChild(textNode, childPrev);
    return textNode;
  }
};
const setChildStatic = (parent, fragment, fragmentOnly, child, dynamic) => {
  if (!dynamic && isVoidChild(child))
    return;
  const prev = FragmentUtils.getChildren(fragment);
  const prevIsArray = prev instanceof Array;
  const prevLength = prevIsArray ? prev.length : 1;
  const prevFirst = prevIsArray ? prev[0] : prev;
  const prevLast = prevIsArray ? prev[prevLength - 1] : prev;
  const prevSibling = (prevLast == null ? void 0 : prevLast.nextSibling) || null;
  if (prevLength === 0) {
    const type = typeof child;
    if (type === "string" || type === "number" || type === "bigint") {
      const textNode = createText(child);
      if (!fragmentOnly) {
        parent.appendChild(textNode);
      }
      FragmentUtils.replaceWithNode(fragment, textNode);
      return;
    } else if (type === "object" && child !== null && typeof child.nodeType === "number") {
      const node = child;
      if (!fragmentOnly) {
        parent.insertBefore(node, null);
      }
      FragmentUtils.replaceWithNode(fragment, node);
      return;
    }
  }
  if (prevLength === 1) {
    const type = typeof child;
    if (type === "string" || type === "number" || type === "bigint") {
      const node = setChildReplacementText(String(child), prevFirst);
      FragmentUtils.replaceWithNode(fragment, node);
      return;
    }
  }
  const fragmentNext = FragmentUtils.make();
  const children = Array.isArray(child) ? child : [child];
  for (let i = 0, l = children.length; i < l; i++) {
    const child2 = children[i];
    const type = typeof child2;
    if (type === "string" || type === "number" || type === "bigint") {
      FragmentUtils.pushNode(fragmentNext, createText(child2));
    } else if (type === "object" && child2 !== null && typeof child2.nodeType === "number") {
      FragmentUtils.pushNode(fragmentNext, child2);
    } else if (type === "function") {
      const fragment2 = FragmentUtils.make();
      let childFragmentOnly = !fragmentOnly;
      FragmentUtils.pushFragment(fragmentNext, fragment2);
      resolveChild(child2, (child3, dynamic2) => {
        const fragmentOnly2 = childFragmentOnly;
        childFragmentOnly = false;
        setChildStatic(parent, fragment2, fragmentOnly2, child3, dynamic2);
      });
    }
  }
  let next = FragmentUtils.getChildren(fragmentNext);
  let nextLength = fragmentNext.length;
  if (nextLength === 0 && prevLength === 1 && prevFirst.nodeType === 8) {
    return;
  }
  if (!fragmentOnly && (nextLength === 0 || prevLength === 1 && prevFirst.nodeType === 8 || children[SYMBOL_UNCACHED])) {
    const { childNodes } = parent;
    if (childNodes.length === prevLength) {
      parent.textContent = "";
      if (nextLength === 0) {
        const placeholder = createComment("");
        FragmentUtils.pushNode(fragmentNext, placeholder);
        if (next !== fragmentNext.values) {
          next = placeholder;
          nextLength += 1;
        }
      }
      if (prevSibling) {
        if (next instanceof Array) {
          prevSibling.before.apply(prevSibling, next);
        } else {
          parent.insertBefore(next, prevSibling);
        }
      } else {
        if (next instanceof Array) {
          parent.append.apply(parent, next);
        } else {
          parent.append(next);
        }
      }
      FragmentUtils.replaceWithFragment(fragment, fragmentNext);
      return;
    }
  }
  if (nextLength === 0) {
    const placeholder = createComment("");
    FragmentUtils.pushNode(fragmentNext, placeholder);
    if (next !== fragmentNext.values) {
      next = placeholder;
      nextLength += 1;
    }
  }
  if (!fragmentOnly) {
    diff(parent, prev, next, prevSibling);
  }
  FragmentUtils.replaceWithFragment(fragment, fragmentNext);
};
const setChild = (parent, child, fragment = FragmentUtils.make()) => {
  resolveChild(child, setChildStatic.bind(void 0, parent, fragment, false));
};
const setClassStatic = classesToggle;
const setClass = (element, key, value) => {
  if (isFunction$2(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setClassStatic(element, key, value());
    });
  } else {
    setClassStatic(element, key, get(value));
  }
};
const setClassBooleanStatic = (element, value, key, keyPrev) => {
  if (keyPrev && keyPrev !== true) {
    setClassStatic(element, keyPrev, false);
  }
  if (key && key !== true) {
    setClassStatic(element, key, value);
  }
};
const setClassBoolean = (element, value, key) => {
  if (isFunction$2(key) && isFunctionReactive(key)) {
    let keyPrev;
    useRenderEffect(() => {
      const keyNext = key();
      setClassBooleanStatic(element, value, keyNext, keyPrev);
      keyPrev = keyNext;
    });
  } else {
    setClassBooleanStatic(element, value, get(key));
  }
};
const setClassesStatic = (element, object, objectPrev) => {
  if (isString(object)) {
    if (isSVG(element)) {
      element.setAttribute("class", object);
    } else {
      element.className = object;
    }
  } else {
    if (objectPrev) {
      if (isString(objectPrev)) {
        if (objectPrev) {
          if (isSVG(element)) {
            element.setAttribute("class", "");
          } else {
            element.className = "";
          }
        }
      } else if (isArray(objectPrev)) {
        objectPrev = store$1.unwrap(objectPrev);
        for (let i = 0, l = objectPrev.length; i < l; i++) {
          if (!objectPrev[i])
            continue;
          setClassBoolean(element, false, objectPrev[i]);
        }
      } else {
        objectPrev = store$1.unwrap(objectPrev);
        for (const key in objectPrev) {
          if (object && key in object)
            continue;
          setClass(element, key, false);
        }
      }
    }
    if (isArray(object)) {
      if (isStore$1(object)) {
        for (let i = 0, l = object.length; i < l; i++) {
          const fn = untrack(() => isFunction$2(object[i]) ? object[i] : object[SYMBOL_STORE_OBSERVABLE](String(i)));
          setClassBoolean(element, true, fn);
        }
      } else {
        for (let i = 0, l = object.length; i < l; i++) {
          if (!object[i])
            continue;
          setClassBoolean(element, true, object[i]);
        }
      }
    } else {
      if (isStore$1(object)) {
        for (const key in object) {
          const fn = untrack(() => isFunction$2(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key));
          setClass(element, key, fn);
        }
      } else {
        for (const key in object) {
          setClass(element, key, object[key]);
        }
      }
    }
  }
};
const setClasses = (element, object) => {
  if (isFunction$2(object) || isArray(object)) {
    let objectPrev;
    useRenderEffect(() => {
      const objectNext = resolveClass(object);
      setClassesStatic(element, objectNext, objectPrev);
      objectPrev = objectNext;
    });
  } else {
    setClassesStatic(element, object);
  }
};
const setDirective = (element, directive, args) => {
  const symbol = SYMBOLS_DIRECTIVES[directive] || Symbol();
  const data = context(symbol) || DIRECTIVES[symbol];
  if (!data)
    throw new Error(`Directive "${directive}" not found`);
  const call = () => data.fn(element, ...castArray(args));
  if (data.immediate) {
    call();
  } else {
    useMicrotask$1(call);
  }
};
const setEventStatic = /* @__PURE__ */ (() => {
  const delegatedEvents = {
    onauxclick: ["_onauxclick", false],
    onbeforeinput: ["_onbeforeinput", false],
    onclick: ["_onclick", false],
    ondblclick: ["_ondblclick", false],
    onfocusin: ["_onfocusin", false],
    onfocusout: ["_onfocusout", false],
    oninput: ["_oninput", false],
    onkeydown: ["_onkeydown", false],
    onkeyup: ["_onkeyup", false],
    onmousedown: ["_onmousedown", false],
    onmouseup: ["_onmouseup", false]
  };
  const delegate = (event) => {
    const key = `_${event}`;
    document.addEventListener(event.slice(2), (event2) => {
      const targets = event2.composedPath();
      let target = null;
      Object.defineProperty(event2, "currentTarget", {
        configurable: true,
        get() {
          return target;
        }
      });
      for (let i = 0, l = targets.length; i < l; i++) {
        target = targets[i];
        const handler = target[key];
        if (!handler)
          continue;
        handler(event2);
        if (event2.cancelBubble)
          break;
      }
      target = null;
    });
  };
  return (element, event, value) => {
    if (event.startsWith("onmiddleclick")) {
      const _value = value;
      event = `onauxclick${event.slice(13)}`;
      value = _value && ((event2) => event2["button"] === 1 && _value(event2));
    }
    const delegated = delegatedEvents[event];
    if (delegated) {
      if (!delegated[1]) {
        delegated[1] = true;
        delegate(event);
      }
      element[delegated[0]] = value;
    } else if (event.endsWith("passive")) {
      const isCapture = event.endsWith("capturepassive");
      const type = event.slice(2, -7 - (isCapture ? 7 : 0));
      const key = `_${event}`;
      const valuePrev = element[key];
      if (valuePrev)
        element.removeEventListener(type, valuePrev, { capture: isCapture });
      if (value)
        element.addEventListener(type, value, { passive: true, capture: isCapture });
      element[key] = value;
    } else if (event.endsWith("capture")) {
      const type = event.slice(2, -7);
      const key = `_${event}`;
      const valuePrev = element[key];
      if (valuePrev)
        element.removeEventListener(type, valuePrev, { capture: true });
      if (value)
        element.addEventListener(type, value, { capture: true });
      element[key] = value;
    } else {
      element[event] = value;
    }
  };
})();
const setEvent = (element, event, value) => {
  setEventStatic(element, event, value);
};
const setHTMLStatic = (element, value) => {
  element.innerHTML = String(isNil(value) ? "" : value);
};
const setHTML = (element, value) => {
  useRenderEffect(() => {
    setHTMLStatic(element, get(get(value).__html));
  });
};
const setPropertyStatic = (element, key, value) => {
  if (key === "tabIndex" && isBoolean(value)) {
    value = value ? 0 : void 0;
  }
  if (key === "value") {
    if (element.tagName === "PROGRESS") {
      value ?? (value = null);
    } else if (element.tagName === "SELECT" && !element["_$inited"]) {
      element["_$inited"] = true;
      queueMicrotask(() => element[key] = value);
    }
  }
  try {
    element[key] = value;
    if (isNil(value)) {
      setAttributeStatic(element, key, null);
    }
  } catch {
    setAttributeStatic(element, key, value);
  }
};
const setProperty = (element, key, value) => {
  if (isFunction$2(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setPropertyStatic(element, key, value());
    });
  } else {
    setPropertyStatic(element, key, get(value));
  }
};
const setRef = (element, value) => {
  if (isNil(value))
    return;
  const values = flatten(castArray(value)).filter(Boolean);
  if (!values.length)
    return;
  useMicrotask$1(() => untrack(() => values.forEach((value2) => value2 == null ? void 0 : value2(element))));
};
const setStyleStatic = /* @__PURE__ */ (() => {
  const propertyNonDimensionalRe = /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/i;
  const propertyNonDimensionalCache = {};
  return (element, key, value) => {
    if (key.charCodeAt(0) === 45) {
      if (isNil(value)) {
        element.style.removeProperty(key);
      } else {
        element.style.setProperty(key, String(value));
      }
    } else if (isNil(value)) {
      element.style[key] = null;
    } else {
      element.style[key] = isString(value) || (propertyNonDimensionalCache[key] || (propertyNonDimensionalCache[key] = propertyNonDimensionalRe.test(key))) ? value : `${value}px`;
    }
  };
})();
const setStyle = (element, key, value) => {
  if (isFunction$2(value) && isFunctionReactive(value)) {
    useRenderEffect(() => {
      setStyleStatic(element, key, value());
    });
  } else {
    setStyleStatic(element, key, get(value));
  }
};
const setStylesStatic = (element, object, objectPrev) => {
  if (isString(object)) {
    element.setAttribute("style", object);
  } else {
    if (objectPrev) {
      if (isString(objectPrev)) {
        if (objectPrev) {
          element.style.cssText = "";
        }
      } else {
        objectPrev = store$1.unwrap(objectPrev);
        for (const key in objectPrev) {
          if (object && key in object)
            continue;
          setStyleStatic(element, key, null);
        }
      }
    }
    if (isStore$1(object)) {
      for (const key in object) {
        const fn = untrack(() => isFunction$2(object[key]) ? object[key] : object[SYMBOL_STORE_OBSERVABLE](key));
        setStyle(element, key, fn);
      }
    } else {
      for (const key in object) {
        setStyle(element, key, object[key]);
      }
    }
  }
};
const setStyles = (element, object) => {
  if (isFunction$2(object) || isArray(object)) {
    let objectPrev;
    useRenderEffect(() => {
      const objectNext = resolveStyle(object);
      setStylesStatic(element, objectNext, objectPrev);
      objectPrev = objectNext;
    });
  } else {
    setStylesStatic(element, get(object));
  }
};
const setTemplateAccessor = (element, key, value) => {
  if (key === "children") {
    const placeholder = createText("");
    element.insertBefore(placeholder, null);
    value(element, "setChildReplacement", void 0, placeholder);
  } else if (key === "ref") {
    value(element, "setRef");
  } else if (key === "style") {
    value(element, "setStyles");
  } else if (key === "class" || key === "className") {
    if (!isSVG(element)) {
      element.className = "";
    }
    value(element, "setClasses");
  } else if (key === "dangerouslySetInnerHTML") {
    value(element, "setHTML");
  } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) {
    value(element, "setEvent", key.toLowerCase());
  } else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) {
    value(element, "setDirective", key.slice(4));
  } else if (key === "innerHTML" || key === "outerHTML" || key === "textContent" || key === "className")
    ;
  else if (key in element && !isSVG(element)) {
    value(element, "setProperty", key);
  } else {
    element.setAttribute(key, "");
    value(element, "setAttribute", key);
  }
};
const setProp = (element, key, value) => {
  if (value === void 0)
    return;
  if (isTemplateAccessor(value)) {
    setTemplateAccessor(element, key, value);
  } else if (key === "children") {
    setChild(element, value);
  } else if (key === "ref") {
    setRef(element, value);
  } else if (key === "style") {
    setStyles(element, value);
  } else if (key === "class" || key === "className") {
    setClasses(element, value);
  } else if (key === "dangerouslySetInnerHTML") {
    setHTML(element, value);
  } else if (key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110) {
    setEvent(element, key.toLowerCase(), value);
  } else if (key.charCodeAt(0) === 117 && key.charCodeAt(3) === 58) {
    setDirective(element, key.slice(4), value);
  } else if (key === "innerHTML" || key === "outerHTML" || key === "textContent" || key === "className")
    ;
  else if (key in element && !isSVG(element)) {
    setProperty(element, key, value);
  } else {
    setAttribute(element, key, value);
  }
};
const setProps = (element, object) => {
  for (const key in object) {
    setProp(element, key, object[key]);
  }
};
const wrapElement = (element) => {
  element[SYMBOL_UNTRACKED_UNWRAPPED] = true;
  return element;
};
const wrapCloneElement = (target, component, props) => {
  target[SYMBOL_CLONE] = { Component: component, props };
  return target;
};
const createElement = (component, _props, ..._children) => {
  const children = _children.length > 1 ? _children : _children.length > 0 ? _children[0] : void 0;
  const hasChildren = !isVoidChild(children);
  if (hasChildren && isObject$3(_props) && "children" in _props) {
    throw new Error('Providing "children" both as a prop and as rest arguments is forbidden');
  }
  if (isFunction$2(component)) {
    const props = hasChildren ? { ..._props, children } : _props;
    return wrapElement(() => {
      return untrack(() => component.call(component, props));
    });
  } else if (isString(component)) {
    const isSVG2 = isSVGElement(component);
    const createNode = isSVG2 ? createSVGNode : createHTMLNode;
    return wrapElement(() => {
      const child = createNode(component);
      if (isSVG2)
        child["isSVG"] = true;
      untrack(() => {
        if (_props) {
          setProps(child, _props);
        }
        if (hasChildren) {
          setChild(child, children);
        }
      });
      return child;
    });
  } else if (isNode(component)) {
    return wrapElement(() => component);
  } else {
    throw new Error("Invalid component");
  }
};
function jsx(component, props, ...children) {
  if (typeof children === "string")
    return wrapCloneElement(createElement(component, props ?? {}, children), component, props);
  if (!props)
    props = {};
  if (typeof children === "string")
    Object.assign(props, { children });
  return wrapCloneElement(createElement(component, props, props == null ? void 0 : props.key), component, props);
}
class Root extends Owner {
  /* CONSTRUCTOR */
  constructor(V) {
    super();
    this.parent = OWNER;
    this.context = OWNER.context;
    if (V) {
      const suspense = this.get(SYMBOL_SUSPENSE$1);
      if (suspense) {
        this.A0 = true;
        lazySetAdd(this.parent, "T", this);
      }
    }
  }
  /* API */
  Q(deep) {
    if (this.A0) {
      lazySetDelete(this.parent, "T", this);
    }
    super.Q(deep);
  }
  E(fn) {
    const Q = () => this.Q(true);
    const fnWithDispose = () => fn(Q);
    return super.E(fnWithDispose, this, void 0);
  }
}
const Root$1 = Root;
const root$3 = (fn) => {
  return new Root$1(true).E(fn);
};
const root$1$1 = root$3;
frozen(-1);
frozen(-1);
function observable(value, options2) {
  return writable(new Observable(value, options2));
}
var n = function(t2, s, r, e) {
  var u;
  s[0] = 0;
  for (var h = 1; h < s.length; h++) {
    var p = s[h++], a = s[h] ? (s[0] |= p ? 1 : 2, r[s[h++]]) : s[++h];
    3 === p ? e[0] = a : 4 === p ? e[1] = Object.assign(e[1] || {}, a) : 5 === p ? (e[1] = e[1] || {})[s[++h]] = a : 6 === p ? e[1][s[++h]] += a + "" : p ? (u = t2.apply(a, n(t2, a, r, ["", null])), e.push(u), a[0] ? s[0] |= 2 : (s[h - 2] = 0, s[h] = u)) : e.push(a);
  }
  return e;
}, t = /* @__PURE__ */ new Map();
function htm(s) {
  var r = t.get(this);
  return r || (r = /* @__PURE__ */ new Map(), t.set(this, r)), (r = n(this, r.get(s) || (r.set(s, r = function(n2) {
    for (var t2, s2, r2 = 1, e = "", u = "", h = [0], p = function(n3) {
      1 === r2 && (n3 || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h.push(0, n3, e) : 3 === r2 && (n3 || e) ? (h.push(3, n3, e), r2 = 2) : 2 === r2 && "..." === e && n3 ? h.push(4, n3, 0) : 2 === r2 && e && !n3 ? h.push(5, 0, true, e) : r2 >= 5 && ((e || !n3 && 5 === r2) && (h.push(r2, 0, e, s2), r2 = 6), n3 && (h.push(r2, n3, 0, s2), r2 = 6)), e = "";
    }, a = 0; a < n2.length; a++) {
      a && (1 === r2 && p(), p(a));
      for (var l = 0; l < n2[a].length; l++)
        t2 = n2[a][l], 1 === r2 ? "<" === t2 ? (p(), h = [h], r2 = 3) : e += t2 : 4 === r2 ? "--" === e && ">" === t2 ? (r2 = 1, e = "") : e = t2 + e[0] : u ? t2 === u ? u = "" : e += t2 : '"' === t2 || "'" === t2 ? u = t2 : ">" === t2 ? (p(), r2 = 1) : r2 && ("=" === t2 ? (r2 = 5, s2 = e, e = "") : "/" === t2 && (r2 < 5 || ">" === n2[a][l + 1]) ? (p(), 3 === r2 && (h = h[0]), r2 = h, (h = h[0]).push(2, 0, r2), r2 = 0) : " " === t2 || "	" === t2 || "\n" === t2 || "\r" === t2 ? (p(), r2 = 2) : e += t2), 3 === r2 && "!--" === e && (r2 = 4, h = h[0]);
    }
    return p(), h;
  }(s)), r), arguments, [])).length > 1 ? r : r[0];
}
const render = (child, parent) => {
  if (!parent || !(parent instanceof HTMLElement))
    throw new Error("Invalid parent node");
  parent.textContent = "";
  return root$1$1((dispose) => {
    setChild(parent, child);
    return () => {
      dispose();
      parent.textContent = "";
    };
  });
};
const render$1 = render;
var _a, _b;
!!((_b = (_a = globalThis.CDATASection) == null ? void 0 : _a.toString) == null ? void 0 : _b.call(_a).match(/^\s*function\s+CDATASection\s*\(\s*\)\s*\{\s*\[native code\]\s*\}\s*$/));
const registry = {};
const h2 = (type, props, ...children) => createElement(registry[type] || type, props, ...children);
const register = (components) => void assign(registry, components);
assign(htm.bind(h2), { register });
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var FUNC_ERROR_TEXT$1 = "Expected a function";
var NAN$1 = 0 / 0;
var symbolTag$1 = "[object Symbol]";
var reTrim$1 = /^\s+|\s+$/g;
var reIsBadHex$1 = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary$1 = /^0b[01]+$/i;
var reIsOctal$1 = /^0o[0-7]+$/i;
var freeParseInt$1 = parseInt;
var freeGlobal$2 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf$2 = typeof self == "object" && self && self.Object === Object && self;
var root$2 = freeGlobal$2 || freeSelf$2 || Function("return this")();
var objectProto$2 = Object.prototype;
var objectToString$2 = objectProto$2.toString;
var nativeMax = Math.max, nativeMin = Math.min;
var now = function() {
  return root$2.Date.now();
};
function debounce(func, wait, options2) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber$1(wait) || 0;
  if (isObject$2(options2)) {
    leading = !!options2.leading;
    maxing = "maxWait" in options2;
    maxWait = maxing ? nativeMax(toNumber$1(options2.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options2 ? !!options2.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
    return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time = now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function isObject$2(value) {
  var type = typeof value;
  return !!value && (type == "object" || type == "function");
}
function isObjectLike$1(value) {
  return !!value && typeof value == "object";
}
function isSymbol$1(value) {
  return typeof value == "symbol" || isObjectLike$1(value) && objectToString$2.call(value) == symbolTag$1;
}
function toNumber$1(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol$1(value)) {
    return NAN$1;
  }
  if (isObject$2(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$2(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim$1, "");
  var isBinary = reIsBinary$1.test(value);
  return isBinary || reIsOctal$1.test(value) ? freeParseInt$1(value.slice(2), isBinary ? 2 : 8) : reIsBadHex$1.test(value) ? NAN$1 : +value;
}
var lodash_debounce = debounce;
const debounce$1 = /* @__PURE__ */ getDefaultExportFromCjs(lodash_debounce);
var lodash_reduce = { exports: {} };
lodash_reduce.exports;
(function(module, exports) {
  var LARGE_ARRAY_SIZE = 200;
  var FUNC_ERROR_TEXT2 = "Expected a function";
  var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
  var UNORDERED_COMPARE_FLAG = 1, PARTIAL_COMPARE_FLAG = 2;
  var INFINITY2 = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991;
  var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag2 = "[object Function]", genTag2 = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", promiseTag = "[object Promise]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag2 = "[object Symbol]", weakMapTag = "[object WeakMap]";
  var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, reLeadingDot = /^\./, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reRegExpChar2 = /[\\^$.*+?()[\]{}|]/g;
  var reEscapeChar = /\\(\\)?/g;
  var reIsHostCtor2 = /^\[object .+?Constructor\]$/;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
  var freeGlobal2 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
  var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
  var freeExports = exports && !exports.nodeType && exports;
  var freeModule = freeExports && true && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var freeProcess = moduleExports && freeGlobal2.process;
  var nodeUtil = function() {
    try {
      return freeProcess && freeProcess.binding("util");
    } catch (e) {
    }
  }();
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1, length = array ? array.length : 0;
    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }
  function arraySome(array, predicate) {
    var index = -1, length = array ? array.length : 0;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }
  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection2) {
      accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
    });
    return accumulator;
  }
  function baseTimes(n2, iteratee) {
    var index = -1, result = Array(n2);
    while (++index < n2) {
      result[index] = iteratee(index);
    }
    return result;
  }
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }
  function getValue2(object, key) {
    return object == null ? void 0 : object[key];
  }
  function isHostObject2(value) {
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e) {
      }
    }
    return result;
  }
  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }
  function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }
  var arrayProto2 = Array.prototype, funcProto2 = Function.prototype, objectProto2 = Object.prototype;
  var coreJsData2 = root2["__core-js_shared__"];
  var maskSrcKey2 = function() {
    var uid = /[^.]+$/.exec(coreJsData2 && coreJsData2.keys && coreJsData2.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  var funcToString2 = funcProto2.toString;
  var hasOwnProperty2 = objectProto2.hasOwnProperty;
  var objectToString2 = objectProto2.toString;
  var reIsNative2 = RegExp(
    "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  );
  var Symbol2 = root2.Symbol, Uint8Array = root2.Uint8Array, propertyIsEnumerable = objectProto2.propertyIsEnumerable, splice2 = arrayProto2.splice;
  var nativeKeys = overArg(Object.keys, Object);
  var DataView = getNative2(root2, "DataView"), Map2 = getNative2(root2, "Map"), Promise2 = getNative2(root2, "Promise"), Set2 = getNative2(root2, "Set"), WeakMap2 = getNative2(root2, "WeakMap"), nativeCreate2 = getNative2(Object, "create");
  var dataViewCtorString = toSource2(DataView), mapCtorString = toSource2(Map2), promiseCtorString = toSource2(Promise2), setCtorString = toSource2(Set2), weakMapCtorString = toSource2(WeakMap2);
  var symbolProto2 = Symbol2 ? Symbol2.prototype : void 0, symbolValueOf = symbolProto2 ? symbolProto2.valueOf : void 0, symbolToString2 = symbolProto2 ? symbolProto2.toString : void 0;
  function Hash2(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function hashClear2() {
    this.__data__ = nativeCreate2 ? nativeCreate2(null) : {};
  }
  function hashDelete2(key) {
    return this.has(key) && delete this.__data__[key];
  }
  function hashGet2(key) {
    var data = this.__data__;
    if (nativeCreate2) {
      var result = data[key];
      return result === HASH_UNDEFINED2 ? void 0 : result;
    }
    return hasOwnProperty2.call(data, key) ? data[key] : void 0;
  }
  function hashHas2(key) {
    var data = this.__data__;
    return nativeCreate2 ? data[key] !== void 0 : hasOwnProperty2.call(data, key);
  }
  function hashSet2(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate2 && value === void 0 ? HASH_UNDEFINED2 : value;
    return this;
  }
  Hash2.prototype.clear = hashClear2;
  Hash2.prototype["delete"] = hashDelete2;
  Hash2.prototype.get = hashGet2;
  Hash2.prototype.has = hashHas2;
  Hash2.prototype.set = hashSet2;
  function ListCache2(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function listCacheClear2() {
    this.__data__ = [];
  }
  function listCacheDelete2(key) {
    var data = this.__data__, index = assocIndexOf2(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice2.call(data, index, 1);
    }
    return true;
  }
  function listCacheGet2(key) {
    var data = this.__data__, index = assocIndexOf2(data, key);
    return index < 0 ? void 0 : data[index][1];
  }
  function listCacheHas2(key) {
    return assocIndexOf2(this.__data__, key) > -1;
  }
  function listCacheSet2(key, value) {
    var data = this.__data__, index = assocIndexOf2(data, key);
    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }
  ListCache2.prototype.clear = listCacheClear2;
  ListCache2.prototype["delete"] = listCacheDelete2;
  ListCache2.prototype.get = listCacheGet2;
  ListCache2.prototype.has = listCacheHas2;
  ListCache2.prototype.set = listCacheSet2;
  function MapCache2(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  function mapCacheClear2() {
    this.__data__ = {
      "hash": new Hash2(),
      "map": new (Map2 || ListCache2)(),
      "string": new Hash2()
    };
  }
  function mapCacheDelete2(key) {
    return getMapData2(this, key)["delete"](key);
  }
  function mapCacheGet2(key) {
    return getMapData2(this, key).get(key);
  }
  function mapCacheHas2(key) {
    return getMapData2(this, key).has(key);
  }
  function mapCacheSet2(key, value) {
    getMapData2(this, key).set(key, value);
    return this;
  }
  MapCache2.prototype.clear = mapCacheClear2;
  MapCache2.prototype["delete"] = mapCacheDelete2;
  MapCache2.prototype.get = mapCacheGet2;
  MapCache2.prototype.has = mapCacheHas2;
  MapCache2.prototype.set = mapCacheSet2;
  function SetCache(values) {
    var index = -1, length = values ? values.length : 0;
    this.__data__ = new MapCache2();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED2);
    return this;
  }
  function setCacheHas(value) {
    return this.__data__.has(value);
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;
  function Stack(entries) {
    this.__data__ = new ListCache2(entries);
  }
  function stackClear() {
    this.__data__ = new ListCache2();
  }
  function stackDelete(key) {
    return this.__data__["delete"](key);
  }
  function stackGet(key) {
    return this.__data__.get(key);
  }
  function stackHas(key) {
    return this.__data__.has(key);
  }
  function stackSet(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache2) {
      var pairs = cache.__data__;
      if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        return this;
      }
      cache = this.__data__ = new MapCache2(pairs);
    }
    cache.set(key, value);
    return this;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;
  function arrayLikeKeys(value, inherited) {
    var result = isArray2(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for (var key in value) {
      if ((inherited || hasOwnProperty2.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }
  function assocIndexOf2(array, key) {
    var length = array.length;
    while (length--) {
      if (eq2(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }
  var baseEach = createBaseEach(baseForOwn);
  var baseFor = createBaseFor();
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }
  function baseGet(object, path) {
    path = isKey(path, object) ? [path] : castPath(path);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }
  function baseGetTag(value) {
    return objectToString2.call(value);
  }
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }
  function baseIsEqual(value, other, customizer, bitmask, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObject2(value) && !isObjectLike2(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
  }
  function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
    var objIsArr = isArray2(object), othIsArr = isArray2(other), objTag = arrayTag, othTag = arrayTag;
    if (!objIsArr) {
      objTag = getTag(object);
      objTag = objTag == argsTag ? objectTag : objTag;
    }
    if (!othIsArr) {
      othTag = getTag(other);
      othTag = othTag == argsTag ? objectTag : othTag;
    }
    var objIsObj = objTag == objectTag && !isHostObject2(object), othIsObj = othTag == objectTag && !isHostObject2(other), isSameTag = objTag == othTag;
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
    }
    if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
      var objIsWrapped = objIsObj && hasOwnProperty2.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty2.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
  }
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }
  function baseIsNative2(value) {
    if (!isObject2(value) || isMasked2(value)) {
      return false;
    }
    var pattern = isFunction2(value) || isHostObject2(value) ? reIsNative2 : reIsHostCtor2;
    return pattern.test(toSource2(value));
  }
  function baseIsTypedArray(value) {
    return isObjectLike2(value) && isLength(value.length) && !!typedArrayTags[objectToString2.call(value)];
  }
  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray2(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty2.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get2(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, void 0, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
    };
  }
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }
  function baseToString2(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isSymbol2(value)) {
      return symbolToString2 ? symbolToString2.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY2 ? "-0" : result;
  }
  function castPath(value) {
    return isArray2(value) ? value : stringToPath(value);
  }
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }
  function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
    var isPartial = bitmask & PARTIAL_COMPARE_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1, result = true, seen = bitmask & UNORDERED_COMPARE_FLAG ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!seen.has(othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, customizer, bitmask, stack))) {
            return seen.add(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }
  function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
          return false;
        }
        return true;
      case boolTag:
      case dateTag:
      case numberTag:
        return eq2(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag:
      case stringTag:
        return object == other + "";
      case mapTag:
        var convert = mapToArray;
      case setTag:
        var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= UNORDERED_COMPARE_FLAG;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
        stack["delete"](object);
        return result;
      case symbolTag2:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }
  function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
    var isPartial = bitmask & PARTIAL_COMPARE_FLAG, objProps = keys(object), objLength = objProps.length, othProps = keys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty2.call(other, key))) {
        return false;
      }
    }
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }
  function getMapData2(map, key) {
    var data = map.__data__;
    return isKeyable2(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }
  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }
  function getNative2(object, key) {
    var value = getValue2(object, key);
    return baseIsNative2(value) ? value : void 0;
  }
  var getTag = baseGetTag;
  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap2 && getTag(new WeakMap2()) != weakMapTag) {
    getTag = function(value) {
      var result = objectToString2.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource2(Ctor) : void 0;
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag;
          case mapCtorString:
            return mapTag;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag;
          case weakMapCtorString:
            return weakMapTag;
        }
      }
      return result;
    };
  }
  function hasPath(object, path, hasFunc) {
    path = isKey(path, object) ? [path] : castPath(path);
    var result, index = -1, length = path.length;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result) {
      return result;
    }
    var length = object ? object.length : 0;
    return !!length && isLength(length) && isIndex(key, length) && (isArray2(object) || isArguments(object));
  }
  function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }
  function isKey(value, object) {
    if (isArray2(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol2(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }
  function isKeyable2(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }
  function isMasked2(func) {
    return !!maskSrcKey2 && maskSrcKey2 in func;
  }
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto2;
    return value === proto;
  }
  function isStrictComparable(value) {
    return value === value && !isObject2(value);
  }
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }
  var stringToPath = memoize2(function(string) {
    string = toString2(string);
    var result = [];
    if (reLeadingDot.test(string)) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, string2) {
      result.push(quote ? string2.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });
  function toKey(value) {
    if (typeof value == "string" || isSymbol2(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY2 ? "-0" : result;
  }
  function toSource2(func) {
    if (func != null) {
      try {
        return funcToString2.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }
  function reduce2(collection, iteratee, accumulator) {
    var func = isArray2(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
    return func(collection, baseIteratee(iteratee), accumulator, initAccum, baseEach);
  }
  function memoize2(func, resolver) {
    if (typeof func != "function" || resolver && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT2);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize2.Cache || MapCache2)();
    return memoized;
  }
  memoize2.Cache = MapCache2;
  function eq2(value, other) {
    return value === other || value !== value && other !== other;
  }
  function isArguments(value) {
    return isArrayLikeObject(value) && hasOwnProperty2.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString2.call(value) == argsTag);
  }
  var isArray2 = Array.isArray;
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction2(value);
  }
  function isArrayLikeObject(value) {
    return isObjectLike2(value) && isArrayLike(value);
  }
  function isFunction2(value) {
    var tag = isObject2(value) ? objectToString2.call(value) : "";
    return tag == funcTag2 || tag == genTag2;
  }
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }
  function isObject2(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike2(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol2(value) {
    return typeof value == "symbol" || isObjectLike2(value) && objectToString2.call(value) == symbolTag2;
  }
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
  function toString2(value) {
    return value == null ? "" : baseToString2(value);
  }
  function get2(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }
  function identity(value) {
    return value;
  }
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }
  module.exports = reduce2;
})(lodash_reduce, lodash_reduce.exports);
var lodash_reduceExports = lodash_reduce.exports;
const reduce = /* @__PURE__ */ getDefaultExportFromCjs(lodash_reduceExports);
var INFINITY = 1 / 0, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
var symbolTag = "[object Symbol]";
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf$1 = typeof self == "object" && self && self.Object === Object && self;
var root$1 = freeGlobal$1 || freeSelf$1 || Function("return this")();
var objectProto$1 = Object.prototype;
var objectToString$1 = objectProto$1.toString;
var Symbol$1 = root$1.Symbol;
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== void 0) {
      number = number <= upper ? number : upper;
    }
    if (lower !== void 0) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}
function baseToString(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
function isObject$1(value) {
  var type = typeof value;
  return !!value && (type == "object" || type == "function");
}
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && objectToString$1.call(value) == symbolTag;
}
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}
function toInteger(value) {
  var result = toFinite(value), remainder = result % 1;
  return result === result ? remainder ? result - remainder : result : 0;
}
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$1(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, "");
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
function toString(value) {
  return value == null ? "" : baseToString(value);
}
function startsWith(string, target, position) {
  string = toString(string);
  position = baseClamp(toInteger(position), 0, string.length);
  target = baseToString(target);
  return string.slice(position, position + target.length) == target;
}
var lodash_startswith = startsWith;
const startsWith$1 = /* @__PURE__ */ getDefaultExportFromCjs(lodash_startswith);
const flag = {
  ad: "bg-[-48px_-24px]",
  ae: "bg-[-72px_-24px]",
  af: "bg-[-96px_-24px]",
  ag: "bg-[-120px_-24px]",
  ai: "bg-[-144px_-24px]",
  al: "bg-[-168px_-24px]",
  am: "bg-[-192px_-24px]",
  an: "bg-[-216px_-24px]",
  ao: "bg-[-240px_-24px]",
  aq: "bg-[-264px_-24px]",
  ar: "bg-[-288px_-24px]",
  as: "bg-[-312px_-24px]",
  at: "bg-[-336px_-24px]",
  au: "bg-[-360px_-24px]",
  aw: "bg-[-384px_-24px]",
  ax: "bg-[0px_-48px]",
  az: "bg-[-24px_-48px]",
  ba: "bg-[-48px_-48px]",
  bb: "bg-[-72px_-48px]",
  bd: "bg-[-96px_-48px]",
  be: "bg-[-120px_-48px]",
  bf: "bg-[-144px_-48px]",
  bg: "bg-[-168px_-48px]",
  bh: "bg-[-192px_-48px]",
  bi: "bg-[-216px_-48px]",
  bj: "bg-[-240px_-48px]",
  bl: "bg-[-264px_-48px]",
  bm: "bg-[-288px_-48px]",
  bn: "bg-[-312px_-48px]",
  bo: "bg-[-336px_-48px]",
  br: "bg-[-360px_-48px]",
  bs: "bg-[-384px_-48px]",
  bt: "bg-[0px_-72px]",
  bw: "bg-[-24px_-72px]",
  by: "bg-[-48px_-72px]",
  bz: "bg-[-72px_-72px]",
  ca: "bg-[-96px_-72px]",
  cc: "bg-[-120px_-72px]",
  cd: "bg-[-144px_-72px]",
  cf: "bg-[-168px_-72px]",
  cg: "bg-[-192px_-72px]",
  ch: "bg-[-216px_-72px]",
  ci: "bg-[-240px_-72px]",
  ck: "bg-[-264px_-72px]",
  cl: "bg-[-288px_-72px]",
  cm: "bg-[-312px_-72px]",
  cn: "bg-[-336px_-72px]",
  co: "bg-[-360px_-72px]",
  cr: "bg-[-384px_-72px]",
  cu: "bg-[0px_-96px]",
  cv: "bg-[-24px_-96px]",
  cw: "bg-[-48px_-96px]",
  cx: "bg-[-72px_-96px]",
  cy: "bg-[-96px_-96px]",
  cz: "bg-[-120px_-96px]",
  de: "bg-[-144px_-96px]",
  dj: "bg-[-168px_-96px]",
  dk: "bg-[-192px_-96px]",
  dm: "bg-[-216px_-96px]",
  do: "bg-[-240px_-96px]",
  dz: "bg-[-264px_-96px]",
  ec: "bg-[-288px_-96px]",
  ee: "bg-[-312px_-96px]",
  eg: "bg-[-336px_-96px]",
  eh: "bg-[-360px_-96px]",
  er: "bg-[-384px_-96px]",
  es: "bg-[0px_-120px]",
  et: "bg-[-24px_-120px]",
  eu: "bg-[-48px_-120px]",
  fi: "bg-[-72px_-120px]",
  fj: "bg-[-96px_-120px]",
  fk: "bg-[-120px_-120px]",
  fm: "bg-[-144px_-120px]",
  fo: "bg-[-168px_-120px]",
  fr: "bg-[-192px_-120px]",
  ga: "bg-[-216px_-120px]",
  gb: "bg-[-240px_-120px]",
  gd: "bg-[-264px_-120px]",
  ge: "bg-[-288px_-120px]",
  gg: "bg-[-312px_-120px]",
  gh: "bg-[-336px_-120px]",
  gi: "bg-[-360px_-120px]",
  gl: "bg-[-384px_-120px]",
  gm: "bg-[0px_-144px]",
  gn: "bg-[-24px_-144px]",
  gq: "bg-[-48px_-144px]",
  gr: "bg-[-72px_-144px]",
  gs: "bg-[-96px_-144px]",
  gt: "bg-[-120px_-144px]",
  gu: "bg-[-144px_-144px]",
  gw: "bg-[-168px_-144px]",
  gy: "bg-[-192px_-144px]",
  hk: "bg-[-216px_-144px]",
  hn: "bg-[-240px_-144px]",
  hr: "bg-[-264px_-144px]",
  ht: "bg-[-288px_-144px]",
  hu: "bg-[-312px_-144px]",
  ic: "bg-[-336px_-144px]",
  id: "bg-[-360px_-144px]",
  ie: "bg-[-384px_-144px]",
  il: "bg-[0px_-168px]",
  im: "bg-[-24px_-168px]",
  in: "bg-[-48px_-168px]",
  iq: "bg-[-72px_-168px]",
  ir: "bg-[-96px_-168px]",
  is: "bg-[-120px_-168px]",
  it: "bg-[-144px_-168px]",
  je: "bg-[-168px_-168px]",
  jm: "bg-[-192px_-168px]",
  jo: "bg-[-216px_-168px]",
  jp: "bg-[-240px_-168px]",
  ke: "bg-[-264px_-168px]",
  kg: "bg-[-288px_-168px]",
  kh: "bg-[-312px_-168px]",
  ki: "bg-[-336px_-168px]",
  xk: "bg-[-144px_0px]",
  km: "bg-[-360px_-168px]",
  kn: "bg-[-384px_-168px]",
  kp: "bg-[0px_-192px]",
  kr: "bg-[-24px_-192px]",
  kw: "bg-[-48px_-192px]",
  ky: "bg-[-72px_-192px]",
  kz: "bg-[-96px_-192px]",
  la: "bg-[-120px_-192px]",
  lb: "bg-[-144px_-192px]",
  lc: "bg-[-168px_-192px]",
  li: "bg-[-192px_-192px]",
  lk: "bg-[-216px_-192px]",
  lr: "bg-[-240px_-192px]",
  ls: "bg-[-264px_-192px]",
  lt: "bg-[-288px_-192px]",
  lu: "bg-[-312px_-192px]",
  lv: "bg-[-336px_-192px]",
  ly: "bg-[-360px_-192px]",
  ma: "bg-[-384px_-192px]",
  mc: "bg-[0px_-216px]",
  md: "bg-[-24px_-216px]",
  me: "bg-[-48px_-216px]",
  mf: "bg-[-72px_-216px]",
  mg: "bg-[-96px_-216px]",
  mh: "bg-[-120px_-216px]",
  mk: "bg-[-144px_-216px]",
  ml: "bg-[-168px_-216px]",
  mm: "bg-[-192px_-216px]",
  mn: "bg-[-216px_-216px]",
  mo: "bg-[-240px_-216px]",
  mp: "bg-[-264px_-216px]",
  mq: "bg-[-288px_-216px]",
  mr: "bg-[-312px_-216px]",
  ms: "bg-[-336px_-216px]",
  mt: "bg-[-360px_-216px]",
  mu: "bg-[-384px_-216px]",
  mv: "bg-[0px_-240px]",
  mw: "bg-[-24px_-240px]",
  mx: "bg-[-48px_-240px]",
  my: "bg-[-72px_-240px]",
  mz: "bg-[-96px_-240px]",
  na: "bg-[-120px_-240px]",
  nc: "bg-[-144px_-240px]",
  ne: "bg-[-168px_-240px]",
  nf: "bg-[-192px_-240px]",
  ng: "bg-[-216px_-240px]",
  ni: "bg-[-240px_-240px]",
  nl: "bg-[-264px_-240px]",
  no: "bg-[-288px_-240px]",
  np: "bg-[-312px_-240px]",
  nr: "bg-[-336px_-240px]",
  nu: "bg-[-360px_-240px]",
  nz: "bg-[-384px_-240px]",
  om: "bg-[0px_-264px]",
  pa: "bg-[-24px_-264px]",
  pe: "bg-[-48px_-264px]",
  pf: "bg-[-72px_-264px]",
  pg: "bg-[-96px_-264px]",
  ph: "bg-[-120px_-264px]",
  pk: "bg-[-192px_-264px]",
  pl: "bg-[-216px_-264px]",
  pn: "bg-[-240px_-264px]",
  pr: "bg-[-264px_-264px]",
  ps: "bg-[-288px_-264px]",
  pt: "bg-[-312px_-264px]",
  pw: "bg-[-336px_-264px]",
  py: "bg-[-360px_-264px]",
  qa: "bg-[-384px_-264px]",
  ro: "bg-[0px_-288px]",
  rs: "bg-[-24px_-288px]",
  ru: "bg-[-48px_-288px]",
  rw: "bg-[-72px_-288px]",
  sa: "bg-[-96px_-288px]",
  sb: "bg-[-120px_-288px]",
  sc: "bg-[-144px_-288px]",
  sd: "bg-[-168px_-288px]",
  se: "bg-[-192px_-288px]",
  sg: "bg-[-216px_-288px]",
  sh: "bg-[-240px_-288px]",
  si: "bg-[-264px_-288px]",
  sk: "bg-[-288px_-288px]",
  sl: "bg-[-312px_-288px]",
  sm: "bg-[-336px_-288px]",
  sn: "bg-[-360px_-288px]",
  so: "bg-[-384px_-288px]",
  sr: "bg-[0px_-312px]",
  ss: "bg-[-24px_-312px]",
  st: "bg-[-48px_-312px]",
  sv: "bg-[-72px_-312px]",
  sy: "bg-[-96px_-312px]",
  sz: "bg-[-120px_-312px]",
  tc: "bg-[-144px_-312px]",
  td: "bg-[-168px_-312px]",
  tf: "bg-[-192px_-312px]",
  tg: "bg-[-216px_-312px]",
  th: "bg-[-240px_-312px]",
  tj: "bg-[-264px_-312px]",
  tk: "bg-[-288px_-312px]",
  tl: "bg-[-312px_-312px]",
  tm: "bg-[-336px_-312px]",
  tn: "bg-[-360px_-312px]",
  to: "bg-[-384px_-312px]",
  tr: "bg-[0px_-336px]",
  tt: "bg-[-24px_-336px]",
  tv: "bg-[-48px_-336px]",
  tw: "bg-[-72px_-336px]",
  tz: "bg-[-96px_-336px]",
  ua: "bg-[-120px_-336px]",
  ug: "bg-[-144px_-336px]",
  us: "bg-[-168px_-336px]",
  uy: "bg-[-192px_-336px]",
  uz: "bg-[-216px_-336px]",
  va: "bg-[-240px_-336px]",
  vc: "bg-[-264px_-336px]",
  ve: "bg-[-288px_-336px]",
  vg: "bg-[-312px_-336px]",
  vi: "bg-[-336px_-336px]",
  vn: "bg-[-360px_-336px]",
  vu: "bg-[-384px_-336px]",
  wf: "bg-[0px_-360px]",
  ws: "bg-[-24px_-360px]",
  ye: "bg-[-48px_-360px]",
  za: "bg-[-96px_-360px]",
  zm: "bg-[-120px_-360px]",
  zw: "bg-[-144px_-360px]"
};
const rawCountries = [
  [
    "Afghanistan",
    ["asia"],
    "af",
    "93"
  ],
  [
    "Albania",
    ["europe"],
    "al",
    "355"
  ],
  [
    "Algeria",
    ["africa", "north-africa"],
    "dz",
    "213"
  ],
  [
    "Andorra",
    ["europe"],
    "ad",
    "376"
  ],
  [
    "Angola",
    ["africa"],
    "ao",
    "244"
  ],
  [
    "Antigua and Barbuda",
    ["america", "carribean"],
    "ag",
    "1268"
  ],
  [
    "Argentina",
    ["america", "south-america"],
    "ar",
    "54",
    "(..) ........",
    0,
    ["11", "221", "223", "261", "264", "2652", "280", "2905", "291", "2920", "2966", "299", "341", "342", "343", "351", "376", "379", "381", "3833", "385", "387", "388"]
  ],
  [
    "Armenia",
    ["asia", "ex-ussr"],
    "am",
    "374",
    ".. ......"
  ],
  [
    "Aruba",
    ["america", "carribean"],
    "aw",
    "297"
  ],
  [
    "Australia",
    ["oceania"],
    "au",
    "61",
    "(..) .... ....",
    0,
    ["2", "3", "4", "7", "8", "02", "03", "04", "07", "08"]
  ],
  [
    "Austria",
    ["europe", "eu-union"],
    "at",
    "43"
  ],
  [
    "Azerbaijan",
    ["asia", "ex-ussr"],
    "az",
    "994",
    "(..) ... .. .."
  ],
  [
    "Bahamas",
    ["america", "carribean"],
    "bs",
    "1242"
  ],
  [
    "Bahrain",
    ["middle-east"],
    "bh",
    "973"
  ],
  [
    "Bangladesh",
    ["asia"],
    "bd",
    "880"
  ],
  [
    "Barbados",
    ["america", "carribean"],
    "bb",
    "1246"
  ],
  [
    "Belarus",
    ["europe", "ex-ussr"],
    "by",
    "375",
    "(..) ... .. .."
  ],
  [
    "Belgium",
    ["europe", "eu-union"],
    "be",
    "32",
    "... .. .. .."
  ],
  [
    "Belize",
    ["america", "central-america"],
    "bz",
    "501"
  ],
  [
    "Benin",
    ["africa"],
    "bj",
    "229"
  ],
  [
    "Bhutan",
    ["asia"],
    "bt",
    "975"
  ],
  [
    "Bolivia",
    ["america", "south-america"],
    "bo",
    "591"
  ],
  [
    "Bosnia and Herzegovina",
    ["europe", "ex-yugos"],
    "ba",
    "387"
  ],
  [
    "Botswana",
    ["africa"],
    "bw",
    "267"
  ],
  [
    "Brazil",
    ["america", "south-america"],
    "br",
    "55",
    "(..) ........."
  ],
  [
    "British Indian Ocean Territory",
    ["asia"],
    "io",
    "246"
  ],
  [
    "Brunei",
    ["asia"],
    "bn",
    "673"
  ],
  [
    "Bulgaria",
    ["europe", "eu-union"],
    "bg",
    "359"
  ],
  [
    "Burkina Faso",
    ["africa"],
    "bf",
    "226"
  ],
  [
    "Burundi",
    ["africa"],
    "bi",
    "257"
  ],
  [
    "Cambodia",
    ["asia"],
    "kh",
    "855"
  ],
  [
    "Cameroon",
    ["africa"],
    "cm",
    "237"
  ],
  [
    "Canada",
    ["america", "north-america"],
    "ca",
    "1",
    "(...) ...-....",
    1,
    ["204", "226", "236", "249", "250", "289", "306", "343", "365", "387", "403", "416", "418", "431", "437", "438", "450", "506", "514", "519", "548", "579", "581", "587", "604", "613", "639", "647", "672", "705", "709", "742", "778", "780", "782", "807", "819", "825", "867", "873", "902", "905"]
  ],
  [
    "Cape Verde",
    ["africa"],
    "cv",
    "238"
  ],
  [
    "Caribbean Netherlands",
    ["america", "carribean"],
    "bq",
    "599",
    "",
    1
  ],
  [
    "Central African Republic",
    ["africa"],
    "cf",
    "236"
  ],
  [
    "Chad",
    ["africa"],
    "td",
    "235"
  ],
  [
    "Chile",
    ["america", "south-america"],
    "cl",
    "56"
  ],
  [
    "China",
    ["asia"],
    "cn",
    "86",
    "..-........."
  ],
  [
    "Colombia",
    ["america", "south-america"],
    "co",
    "57",
    "... ... ...."
  ],
  [
    "Comoros",
    ["africa"],
    "km",
    "269"
  ],
  [
    "Congo",
    ["africa"],
    "cd",
    "243"
  ],
  [
    "Congo",
    ["africa"],
    "cg",
    "242"
  ],
  [
    "Costa Rica",
    ["america", "central-america"],
    "cr",
    "506",
    "....-...."
  ],
  [
    "Côte d’Ivoire",
    ["africa"],
    "ci",
    "225",
    ".. .. .. .."
  ],
  [
    "Croatia",
    ["europe", "eu-union", "ex-yugos"],
    "hr",
    "385"
  ],
  [
    "Cuba",
    ["america", "carribean"],
    "cu",
    "53"
  ],
  [
    "Curaçao",
    ["america", "carribean"],
    "cw",
    "599",
    "",
    0
  ],
  [
    "Cyprus",
    ["europe", "eu-union"],
    "cy",
    "357",
    ".. ......"
  ],
  [
    "Czech Republic",
    ["europe", "eu-union"],
    "cz",
    "420",
    "... ... ..."
  ],
  [
    "Denmark",
    ["europe", "eu-union", "baltic"],
    "dk",
    "45",
    ".. .. .. .."
  ],
  [
    "Djibouti",
    ["africa"],
    "dj",
    "253"
  ],
  [
    "Dominica",
    ["america", "carribean"],
    "dm",
    "1767"
  ],
  [
    "Dominican Republic",
    ["america", "carribean"],
    "do",
    "1",
    "",
    2,
    ["809", "829", "849"]
  ],
  [
    "Ecuador",
    ["america", "south-america"],
    "ec",
    "593"
  ],
  [
    "Egypt",
    ["africa", "north-africa"],
    "eg",
    "20"
  ],
  [
    "El Salvador",
    ["america", "central-america"],
    "sv",
    "503",
    "....-...."
  ],
  [
    "Equatorial Guinea",
    ["africa"],
    "gq",
    "240"
  ],
  [
    "Eritrea",
    ["africa"],
    "er",
    "291"
  ],
  [
    "Estonia",
    ["europe", "eu-union", "ex-ussr", "baltic"],
    "ee",
    "372",
    ".... ......"
  ],
  [
    "Ethiopia",
    ["africa"],
    "et",
    "251"
  ],
  [
    "Fiji",
    ["oceania"],
    "fj",
    "679"
  ],
  [
    "Finland",
    ["europe", "eu-union", "baltic"],
    "fi",
    "358",
    ".. ... .. .."
  ],
  [
    "France",
    ["europe", "eu-union"],
    "fr",
    "33",
    ". .. .. .. .."
  ],
  [
    "French Guiana",
    ["america", "south-america"],
    "gf",
    "594"
  ],
  [
    "French Polynesia",
    ["oceania"],
    "pf",
    "689"
  ],
  [
    "Gabon",
    ["africa"],
    "ga",
    "241"
  ],
  [
    "Gambia",
    ["africa"],
    "gm",
    "220"
  ],
  [
    "Georgia",
    ["asia", "ex-ussr"],
    "ge",
    "995"
  ],
  [
    "Germany",
    ["europe", "eu-union", "baltic"],
    "de",
    "49",
    ".... ........"
  ],
  [
    "Ghana",
    ["africa"],
    "gh",
    "233"
  ],
  [
    "Greece",
    ["europe", "eu-union"],
    "gr",
    "30"
  ],
  [
    "Grenada",
    ["america", "carribean"],
    "gd",
    "1473"
  ],
  [
    "Guadeloupe",
    ["america", "carribean"],
    "gp",
    "590",
    "",
    0
  ],
  [
    "Guam",
    ["oceania"],
    "gu",
    "1671"
  ],
  [
    "Guatemala",
    ["america", "central-america"],
    "gt",
    "502",
    "....-...."
  ],
  [
    "Guinea",
    ["africa"],
    "gn",
    "224"
  ],
  [
    "Guinea-Bissau",
    ["africa"],
    "gw",
    "245"
  ],
  [
    "Guyana",
    ["america", "south-america"],
    "gy",
    "592"
  ],
  [
    "Haiti",
    ["america", "carribean"],
    "ht",
    "509",
    "....-...."
  ],
  [
    "Honduras",
    ["america", "central-america"],
    "hn",
    "504"
  ],
  [
    "Hong Kong",
    ["asia"],
    "hk",
    "852",
    ".... ...."
  ],
  [
    "Hungary",
    ["europe", "eu-union"],
    "hu",
    "36"
  ],
  [
    "Iceland",
    ["europe"],
    "is",
    "354",
    "... ...."
  ],
  [
    "India",
    ["asia"],
    "in",
    "91",
    ".....-....."
  ],
  [
    "Indonesia",
    ["asia"],
    "id",
    "62"
  ],
  [
    "Iran",
    ["middle-east"],
    "ir",
    "98",
    "... ... ...."
  ],
  [
    "Iraq",
    ["middle-east"],
    "iq",
    "964"
  ],
  [
    "Ireland",
    ["europe", "eu-union"],
    "ie",
    "353",
    ".. ......."
  ],
  [
    "Israel",
    ["middle-east"],
    "il",
    "972",
    "... ... ...."
  ],
  [
    "Italy",
    ["europe", "eu-union"],
    "it",
    "39",
    "... .......",
    0
  ],
  [
    "Jamaica",
    ["america", "carribean"],
    "jm",
    "1876"
  ],
  [
    "Japan",
    ["asia"],
    "jp",
    "81",
    ".. .... ...."
  ],
  [
    "Jordan",
    ["middle-east"],
    "jo",
    "962"
  ],
  [
    "Kazakhstan",
    ["asia", "ex-ussr"],
    "kz",
    "7",
    "... ...-..-..",
    1,
    ["310", "311", "312", "313", "315", "318", "321", "324", "325", "326", "327", "336", "7172", "73622"]
  ],
  [
    "Kenya",
    ["africa"],
    "ke",
    "254"
  ],
  [
    "Kiribati",
    ["oceania"],
    "ki",
    "686"
  ],
  [
    "Kosovo",
    ["europe", "ex-yugos"],
    "xk",
    "383"
  ],
  [
    "Kuwait",
    ["middle-east"],
    "kw",
    "965"
  ],
  [
    "Kyrgyzstan",
    ["asia", "ex-ussr"],
    "kg",
    "996",
    "... ... ..."
  ],
  [
    "Laos",
    ["asia"],
    "la",
    "856"
  ],
  [
    "Latvia",
    ["europe", "eu-union", "ex-ussr", "baltic"],
    "lv",
    "371",
    ".. ... ..."
  ],
  [
    "Lebanon",
    ["middle-east"],
    "lb",
    "961"
  ],
  [
    "Lesotho",
    ["africa"],
    "ls",
    "266"
  ],
  [
    "Liberia",
    ["africa"],
    "lr",
    "231"
  ],
  [
    "Libya",
    ["africa", "north-africa"],
    "ly",
    "218"
  ],
  [
    "Liechtenstein",
    ["europe"],
    "li",
    "423"
  ],
  [
    "Lithuania",
    ["europe", "eu-union", "ex-ussr", "baltic"],
    "lt",
    "370"
  ],
  [
    "Luxembourg",
    ["europe", "eu-union"],
    "lu",
    "352"
  ],
  [
    "Macau",
    ["asia"],
    "mo",
    "853"
  ],
  [
    "Macedonia",
    ["europe", "ex-yugos"],
    "mk",
    "389"
  ],
  [
    "Madagascar",
    ["africa"],
    "mg",
    "261"
  ],
  [
    "Malawi",
    ["africa"],
    "mw",
    "265"
  ],
  [
    "Malaysia",
    ["asia"],
    "my",
    "60",
    "..-....-...."
  ],
  [
    "Maldives",
    ["asia"],
    "mv",
    "960"
  ],
  [
    "Mali",
    ["africa"],
    "ml",
    "223"
  ],
  [
    "Malta",
    ["europe", "eu-union"],
    "mt",
    "356"
  ],
  [
    "Marshall Islands",
    ["oceania"],
    "mh",
    "692"
  ],
  [
    "Martinique",
    ["america", "carribean"],
    "mq",
    "596"
  ],
  [
    "Mauritania",
    ["africa"],
    "mr",
    "222"
  ],
  [
    "Mauritius",
    ["africa"],
    "mu",
    "230"
  ],
  [
    "Mexico",
    ["america", "central-america"],
    "mx",
    "52",
    "... ... ....",
    0,
    ["55", "81", "33", "656", "664", "998", "774", "229"]
  ],
  [
    "Micronesia",
    ["oceania"],
    "fm",
    "691"
  ],
  [
    "Moldova",
    ["europe"],
    "md",
    "373",
    "(..) ..-..-.."
  ],
  [
    "Monaco",
    ["europe"],
    "mc",
    "377"
  ],
  [
    "Mongolia",
    ["asia"],
    "mn",
    "976"
  ],
  [
    "Montenegro",
    ["europe", "ex-yugos"],
    "me",
    "382"
  ],
  [
    "Morocco",
    ["africa", "north-africa"],
    "ma",
    "212"
  ],
  [
    "Mozambique",
    ["africa"],
    "mz",
    "258"
  ],
  [
    "Myanmar",
    ["asia"],
    "mm",
    "95"
  ],
  [
    "Namibia",
    ["africa"],
    "na",
    "264"
  ],
  [
    "Nauru",
    ["africa"],
    "nr",
    "674"
  ],
  [
    "Nepal",
    ["asia"],
    "np",
    "977"
  ],
  [
    "Netherlands",
    ["europe", "eu-union"],
    "nl",
    "31",
    ".. ........"
  ],
  [
    "New Caledonia",
    ["oceania"],
    "nc",
    "687"
  ],
  [
    "New Zealand",
    ["oceania"],
    "nz",
    "64",
    "...-...-...."
  ],
  [
    "Nicaragua",
    ["america", "central-america"],
    "ni",
    "505"
  ],
  [
    "Niger",
    ["africa"],
    "ne",
    "227"
  ],
  [
    "Nigeria",
    ["africa"],
    "ng",
    "234"
  ],
  [
    "North Korea",
    ["asia"],
    "kp",
    "850"
  ],
  [
    "Norway",
    ["europe", "baltic"],
    "no",
    "47",
    "... .. ..."
  ],
  [
    "Oman",
    ["middle-east"],
    "om",
    "968"
  ],
  [
    "Pakistan",
    ["asia"],
    "pk",
    "92",
    "...-......."
  ],
  [
    "Palau",
    ["oceania"],
    "pw",
    "680"
  ],
  [
    "Palestine",
    ["middle-east"],
    "ps",
    "970"
  ],
  [
    "Panama",
    ["america", "central-america"],
    "pa",
    "507"
  ],
  [
    "Papua New Guinea",
    ["oceania"],
    "pg",
    "675"
  ],
  [
    "Paraguay",
    ["america", "south-america"],
    "py",
    "595"
  ],
  [
    "Peru",
    ["america", "south-america"],
    "pe",
    "51"
  ],
  [
    "Philippines",
    ["asia"],
    "ph",
    "63",
    ".... ......."
  ],
  [
    "Poland",
    ["europe", "eu-union", "baltic"],
    "pl",
    "48",
    "...-...-..."
  ],
  [
    "Portugal",
    ["europe", "eu-union"],
    "pt",
    "351"
  ],
  [
    "Puerto Rico",
    ["america", "carribean"],
    "pr",
    "1",
    "",
    3,
    ["787", "939"]
  ],
  [
    "Qatar",
    ["middle-east"],
    "qa",
    "974"
  ],
  [
    "Réunion",
    ["africa"],
    "re",
    "262"
  ],
  [
    "Romania",
    ["europe", "eu-union"],
    "ro",
    "40"
  ],
  [
    "Russia",
    ["europe", "asia", "ex-ussr", "baltic"],
    "ru",
    "7",
    "(...) ...-..-..",
    0
  ],
  [
    "Rwanda",
    ["africa"],
    "rw",
    "250"
  ],
  [
    "Saint Kitts and Nevis",
    ["america", "carribean"],
    "kn",
    "1869"
  ],
  [
    "Saint Lucia",
    ["america", "carribean"],
    "lc",
    "1758"
  ],
  [
    "Saint Vincent and the Grenadines",
    ["america", "carribean"],
    "vc",
    "1784"
  ],
  [
    "Samoa",
    ["oceania"],
    "ws",
    "685"
  ],
  [
    "San Marino",
    ["europe"],
    "sm",
    "378"
  ],
  [
    "São Tomé and Príncipe",
    ["africa"],
    "st",
    "239"
  ],
  [
    "Saudi Arabia",
    ["middle-east"],
    "sa",
    "966"
  ],
  [
    "Senegal",
    ["africa"],
    "sn",
    "221"
  ],
  [
    "Serbia",
    ["europe", "ex-yugos"],
    "rs",
    "381"
  ],
  [
    "Seychelles",
    ["africa"],
    "sc",
    "248"
  ],
  [
    "Sierra Leone",
    ["africa"],
    "sl",
    "232"
  ],
  [
    "Singapore",
    ["asia"],
    "sg",
    "65",
    "....-...."
  ],
  [
    "Slovakia",
    ["europe", "eu-union"],
    "sk",
    "421"
  ],
  [
    "Slovenia",
    ["europe", "eu-union", "ex-yugos"],
    "si",
    "386"
  ],
  [
    "Solomon Islands",
    ["oceania"],
    "sb",
    "677"
  ],
  [
    "Somalia",
    ["africa"],
    "so",
    "252"
  ],
  [
    "South Africa",
    ["africa"],
    "za",
    "27"
  ],
  [
    "South Korea",
    ["asia"],
    "kr",
    "82",
    "... .... ...."
  ],
  [
    "South Sudan",
    ["africa", "north-africa"],
    "ss",
    "211"
  ],
  [
    "Spain",
    ["europe", "eu-union"],
    "es",
    "34",
    "... ... ..."
  ],
  [
    "Sri Lanka",
    ["asia"],
    "lk",
    "94"
  ],
  [
    "Sudan",
    ["africa"],
    "sd",
    "249"
  ],
  [
    "Suriname",
    ["america", "south-america"],
    "sr",
    "597"
  ],
  [
    "Swaziland",
    ["africa"],
    "sz",
    "268"
  ],
  [
    "Sweden",
    ["europe", "eu-union", "baltic"],
    "se",
    "46",
    "(...) ...-..."
  ],
  [
    "Switzerland",
    ["europe"],
    "ch",
    "41",
    ".. ... .. .."
  ],
  [
    "Syria",
    ["middle-east"],
    "sy",
    "963"
  ],
  [
    "Taiwan",
    ["asia"],
    "tw",
    "886"
  ],
  [
    "Tajikistan",
    ["asia", "ex-ussr"],
    "tj",
    "992"
  ],
  [
    "Tanzania",
    ["africa"],
    "tz",
    "255"
  ],
  [
    "Thailand",
    ["asia"],
    "th",
    "66"
  ],
  [
    "Timor-Leste",
    ["asia"],
    "tl",
    "670"
  ],
  [
    "Togo",
    ["africa"],
    "tg",
    "228"
  ],
  [
    "Tonga",
    ["oceania"],
    "to",
    "676"
  ],
  [
    "Trinidad and Tobago",
    ["america", "carribean"],
    "tt",
    "1868"
  ],
  [
    "Tunisia",
    ["africa", "north-africa"],
    "tn",
    "216"
  ],
  [
    "Turkey",
    ["europe"],
    "tr",
    "90",
    "... ... .. .."
  ],
  [
    "Turkmenistan",
    ["asia", "ex-ussr"],
    "tm",
    "993"
  ],
  [
    "Tuvalu",
    ["asia"],
    "tv",
    "688"
  ],
  [
    "Uganda",
    ["africa"],
    "ug",
    "256"
  ],
  [
    "Ukraine",
    ["europe", "ex-ussr"],
    "ua",
    "380",
    "(..) ... .. .."
  ],
  [
    "United Arab Emirates",
    ["middle-east"],
    "ae",
    "971"
  ],
  [
    "United Kingdom",
    ["europe", "eu-union"],
    "gb",
    "44",
    ".... ......"
  ],
  [
    "United States",
    ["america", "north-america"],
    "us",
    "1",
    "(...) ...-....",
    0,
    ["907", "205", "251", "256", "334", "479", "501", "870", "480", "520", "602", "623", "928", "209", "213", "310", "323", "408", "415", "510", "530", "559", "562", "619", "626", "650", "661", "707", "714", "760", "805", "818", "831", "858", "909", "916", "925", "949", "951", "303", "719", "970", "203", "860", "202", "302", "239", "305", "321", "352", "386", "407", "561", "727", "772", "813", "850", "863", "904", "941", "954", "229", "404", "478", "706", "770", "912", "808", "319", "515", "563", "641", "712", "208", "217", "309", "312", "618", "630", "708", "773", "815", "847", "219", "260", "317", "574", "765", "812", "316", "620", "785", "913", "270", "502", "606", "859", "225", "318", "337", "504", "985", "413", "508", "617", "781", "978", "301", "410", "207", "231", "248", "269", "313", "517", "586", "616", "734", "810", "906", "989", "218", "320", "507", "612", "651", "763", "952", "314", "417", "573", "636", "660", "816", "228", "601", "662", "406", "252", "336", "704", "828", "910", "919", "701", "308", "402", "603", "201", "609", "732", "856", "908", "973", "505", "575", "702", "775", "212", "315", "516", "518", "585", "607", "631", "716", "718", "845", "914", "216", "330", "419", "440", "513", "614", "740", "937", "405", "580", "918", "503", "541", "215", "412", "570", "610", "717", "724", "814", "401", "803", "843", "864", "605", "423", "615", "731", "865", "901", "931", "210", "214", "254", "281", "325", "361", "409", "432", "512", "713", "806", "817", "830", "903", "915", "936", "940", "956", "972", "979", "435", "801", "276", "434", "540", "703", "757", "804", "802", "206", "253", "360", "425", "509", "262", "414", "608", "715", "920", "304", "307"]
  ],
  [
    "Uruguay",
    ["america", "south-america"],
    "uy",
    "598"
  ],
  [
    "Uzbekistan",
    ["asia", "ex-ussr"],
    "uz",
    "998",
    ".. ... .. .."
  ],
  [
    "Vanuatu",
    ["oceania"],
    "vu",
    "678"
  ],
  [
    "Vatican City",
    ["europe"],
    "va",
    "39",
    ".. .... ....",
    1
  ],
  [
    "Venezuela",
    ["america", "south-america"],
    "ve",
    "58"
  ],
  [
    "Vietnam",
    ["asia"],
    "vn",
    "84"
  ],
  [
    "Yemen",
    ["middle-east"],
    "ye",
    "967"
  ],
  [
    "Zambia",
    ["africa"],
    "zm",
    "260"
  ],
  [
    "Zimbabwe",
    ["africa"],
    "zw",
    "263"
  ]
];
const rawTerritories = [
  [
    "American Samoa",
    ["oceania"],
    "as",
    "1684"
  ],
  [
    "Anguilla",
    ["america", "carribean"],
    "ai",
    "1264"
  ],
  [
    "Bermuda",
    ["america", "north-america"],
    "bm",
    "1441"
  ],
  [
    "British Virgin Islands",
    ["america", "carribean"],
    "vg",
    "1284"
  ],
  [
    "Cayman Islands",
    ["america", "carribean"],
    "ky",
    "1345"
  ],
  [
    "Cook Islands",
    ["oceania"],
    "ck",
    "682"
  ],
  [
    "Falkland Islands",
    ["america", "south-america"],
    "fk",
    "500"
  ],
  [
    "Faroe Islands",
    ["europe"],
    "fo",
    "298"
  ],
  [
    "Gibraltar",
    ["europe"],
    "gi",
    "350"
  ],
  [
    "Greenland",
    ["america"],
    "gl",
    "299"
  ],
  [
    "Jersey",
    ["europe", "eu-union"],
    "je",
    "44",
    ".... ......"
  ],
  [
    "Montserrat",
    ["america", "carribean"],
    "ms",
    "1664"
  ],
  [
    "Niue",
    ["asia"],
    "nu",
    "683"
  ],
  [
    "Norfolk Island",
    ["oceania"],
    "nf",
    "672"
  ],
  [
    "Northern Mariana Islands",
    ["oceania"],
    "mp",
    "1670"
  ],
  [
    "Saint Barthélemy",
    ["america", "carribean"],
    "bl",
    "590",
    "",
    1
  ],
  [
    "Saint Helena",
    ["africa"],
    "sh",
    "290"
  ],
  [
    "Saint Martin",
    ["america", "carribean"],
    "mf",
    "590",
    "",
    2
  ],
  [
    "Saint Pierre and Miquelon",
    ["america", "north-america"],
    "pm",
    "508"
  ],
  [
    "Sint Maarten",
    ["america", "carribean"],
    "sx",
    "1721"
  ],
  [
    "Tokelau",
    ["oceania"],
    "tk",
    "690"
  ],
  [
    "Turks and Caicos Islands",
    ["america", "carribean"],
    "tc",
    "1649"
  ],
  [
    "U.S. Virgin Islands",
    ["america", "carribean"],
    "vi",
    "1340"
  ],
  [
    "Wallis and Futuna",
    ["oceania"],
    "wf",
    "681"
  ]
];
function getMask(prefix, dialCode, predefinedMask, defaultMask, alwaysDefaultMask) {
  if (!predefinedMask || alwaysDefaultMask) {
    return prefix + "".padEnd(dialCode.length, ".") + " " + defaultMask;
  } else {
    return prefix + "".padEnd(dialCode.length, ".") + " " + predefinedMask;
  }
}
function initCountries(countries, enableAreaCodes, prefix, defaultMask, alwaysDefaultMask) {
  let hiddenAreaCodes = [];
  let enableAllCodes;
  if (enableAreaCodes === true) {
    enableAllCodes = true;
  } else {
    enableAllCodes = false;
  }
  const initializedCountries = [].concat(...countries.map((country) => {
    const countryItem = {
      name: country[0],
      regions: country[1],
      iso2: country[2],
      countryCode: country[3],
      dialCode: country[3],
      format: getMask(prefix, country[3], country[4], defaultMask, alwaysDefaultMask),
      priority: country[5] || 0,
      mainCode: void 0,
      hasAreaCodes: void 0,
      isAreaCode: void 0,
      areaCodeLength: void 0
    };
    const areaItems = [];
    country[6] && country[6].map((areaCode) => {
      const areaItem = { ...countryItem };
      areaItem.dialCode = country[3] + areaCode;
      areaItem.isAreaCode = true;
      areaItem.areaCodeLength = areaCode.length;
      areaItems.push(areaItem);
    });
    if (areaItems.length > 0) {
      countryItem.mainCode = true;
      if (enableAllCodes || enableAreaCodes.constructor.name === "Array" && enableAreaCodes.includes(country[2])) {
        countryItem.hasAreaCodes = true;
        return [countryItem, ...areaItems];
      } else {
        hiddenAreaCodes = hiddenAreaCodes.concat(areaItems);
        return [countryItem];
      }
    } else {
      return [countryItem];
    }
  }));
  return [initializedCountries, hiddenAreaCodes];
}
function extendUserContent(userContent, contentItemIndex, extendingObject, firstExtension) {
  if (extendingObject === null)
    return;
  const keys = Object.keys(extendingObject);
  const values = Object.values(extendingObject);
  keys.forEach((iso2, index) => {
    if (firstExtension) {
      return userContent.push([iso2, values[index]]);
    }
    const countryIndex = userContent.findIndex((arr) => arr[0] === iso2);
    if (countryIndex === -1) {
      const newUserContent = [iso2];
      newUserContent[contentItemIndex] = values[index];
      userContent.push(newUserContent);
    } else {
      userContent[countryIndex][contentItemIndex] = values[index];
    }
  });
}
function initUserContent(masks, priority, areaCodes) {
  let userContent = [];
  extendUserContent(userContent, 1, masks, true);
  extendUserContent(userContent, 3, priority);
  extendUserContent(userContent, 2, areaCodes);
  return userContent;
}
function extendRawCountries(countries, userContent) {
  if (!userContent.length)
    return countries;
  return countries.map((o) => {
    const userContentIndex = userContent.findIndex((arr) => arr[0] === o[2]);
    if (userContentIndex === -1)
      return o;
    const userContentCountry = userContent[userContentIndex];
    if (userContentCountry[1])
      o[4] = userContentCountry[1];
    if (userContentCountry[3])
      o[5] = userContentCountry[3];
    if (userContentCountry[2])
      o[6] = userContentCountry[2];
    return o;
  });
}
class CountryData {
  constructor(enableAreaCodes, enableTerritories, regions, onlyCountries, preferredCountries, excludeCountries, preserveOrder, masks, priority, areaCodes, localization, prefix, defaultMask, alwaysDefaultMask) {
    this.regions = regions;
    this.filterRegions = (regions2, countries) => {
      if (typeof regions2 === "string") {
        const region = regions2;
        return countries.filter((country) => {
          return country.regions.some((element) => {
            return element === region;
          });
        });
      }
      return countries.filter((country) => {
        const matches = regions2.map((region) => {
          return country.regions.some((element) => {
            return element === region;
          });
        });
        return matches.some((el) => el);
      });
    };
    this.sortTerritories = (initializedTerritories, initializedCountries2) => {
      const fullCountryList = [...initializedTerritories, ...initializedCountries2];
      fullCountryList.sort(function(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      return fullCountryList;
    };
    this.getFilteredCountryList = (countryCodes, sourceCountryList, preserveOrder2) => {
      if (countryCodes.length === 0)
        return sourceCountryList;
      let filteredCountries;
      if (preserveOrder2) {
        filteredCountries = countryCodes.map((countryCode) => {
          const country = sourceCountryList.find((country2) => country2.iso2 === countryCode);
          if (country)
            return country;
        }).filter((country) => country);
      } else {
        filteredCountries = sourceCountryList.filter((country) => {
          return countryCodes.some((element) => {
            return element === country.iso2;
          });
        });
      }
      return filteredCountries;
    };
    this.localizeCountries = (countries, localization2, preserveOrder2) => {
      for (let i = 0; i < countries.length; i++) {
        if (localization2[countries[i].iso2] !== void 0) {
          countries[i].localName = localization2[countries[i].iso2];
        } else if (localization2[countries[i].name] !== void 0) {
          countries[i].localName = localization2[countries[i].name];
        }
      }
      if (!preserveOrder2) {
        countries.sort(function(a, b) {
          if (a.localName < b.localName) {
            return -1;
          }
          if (a.localName > b.localName) {
            return 1;
          }
          return 0;
        });
      }
      return countries;
    };
    this.getCustomAreas = (country, areaCodes2) => {
      let customAreas = [];
      for (let i = 0; i < areaCodes2.length; i++) {
        let newCountry = JSON.parse(JSON.stringify(country));
        newCountry.dialCode += areaCodes2[i];
        customAreas.push(newCountry);
      }
      return customAreas;
    };
    this.excludeCountries = (onlyCountries2, excludedCountries) => {
      if (excludedCountries.length === 0) {
        return onlyCountries2;
      } else {
        return onlyCountries2.filter((country) => {
          return !excludedCountries.includes(country.iso2);
        });
      }
    };
    const userContent = initUserContent(masks, priority, areaCodes);
    const rawCountries$1 = extendRawCountries(JSON.parse(JSON.stringify(rawCountries)), userContent);
    const rawTerritories$1 = extendRawCountries(JSON.parse(JSON.stringify(rawTerritories)), userContent);
    let [initializedCountries, hiddenAreaCodes] = initCountries(rawCountries$1, enableAreaCodes, prefix, defaultMask, alwaysDefaultMask);
    if (enableTerritories) {
      let [initializedTerritories, hiddenAreaCodes2] = initCountries(rawTerritories$1, enableAreaCodes, prefix, defaultMask, alwaysDefaultMask);
      initializedCountries = this.sortTerritories(initializedTerritories, initializedCountries);
    }
    if (regions)
      initializedCountries = this.filterRegions(regions, initializedCountries);
    this.onlyCountries = this.localizeCountries(
      this.excludeCountries(
        this.getFilteredCountryList(onlyCountries, initializedCountries, preserveOrder.includes("onlyCountries")),
        excludeCountries
      ),
      localization,
      preserveOrder.includes("onlyCountries")
    );
    this.preferredCountries = preferredCountries.length === 0 ? [] : this.localizeCountries(
      this.getFilteredCountryList(preferredCountries, initializedCountries, preserveOrder.includes("preferredCountries")),
      localization,
      preserveOrder.includes("preferredCountries")
    );
    this.hiddenAreaCodes = this.excludeCountries(
      this.getFilteredCountryList(onlyCountries, hiddenAreaCodes),
      excludeCountries
    );
  }
}
var FUNC_ERROR_TEXT = "Expected a function";
var HASH_UNDEFINED = "__lodash_hash_undefined__";
var funcTag = "[object Function]", genTag = "[object GeneratorFunction]";
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
function isHostObject(value) {
  var result = false;
  if (value != null && typeof value.toString != "function") {
    try {
      result = !!(value + "");
    } catch (e) {
    }
  }
  return result;
}
var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
var coreJsData = root["__core-js_shared__"];
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
var funcToString = funcProto.toString;
var hasOwnProperty = objectProto.hasOwnProperty;
var objectToString = objectProto.toString;
var reIsNative = RegExp(
  "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
var splice = arrayProto.splice;
var Map$1 = getNative(root, "Map"), nativeCreate = getNative(Object, "create");
function Hash(entries) {
  var index = -1, length = entries ? entries.length : 0;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : void 0;
}
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
}
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
  return this;
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function ListCache(entries) {
  var index = -1, length = entries ? entries.length : 0;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
function listCacheClear() {
  this.__data__ = [];
}
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf(data, key);
  return index < 0 ? void 0 : data[index][1];
}
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
function listCacheSet(key, value) {
  var data = this.__data__, index = assocIndexOf(data, key);
  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
function MapCache(entries) {
  var index = -1, length = entries ? entries.length : 0;
  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
function mapCacheClear() {
  this.__data__ = {
    "hash": new Hash(),
    "map": new (Map$1 || ListCache)(),
    "string": new Hash()
  };
}
function mapCacheDelete(key) {
  return getMapData(this, key)["delete"](key);
}
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : void 0;
}
function isKeyable(value) {
  var type = typeof value;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
function memoize(func, resolver) {
  if (typeof func != "function" || resolver && typeof resolver != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}
memoize.Cache = MapCache;
function eq(value, other) {
  return value === other || value !== value && other !== other;
}
function isFunction(value) {
  var tag = isObject(value) ? objectToString.call(value) : "";
  return tag == funcTag || tag == genTag;
}
function isObject(value) {
  var type = typeof value;
  return !!value && (type == "object" || type == "function");
}
var lodash_memoize = memoize;
const memoize$1 = /* @__PURE__ */ getDefaultExportFromCjs(lodash_memoize);
const scrollTo = (country, enableSearch, container, middle) => {
  if (!country)
    return;
  if (!container || !document.body)
    return;
  const containerHeight = get(container).offsetHeight;
  const containerOffset = get(container).getBoundingClientRect();
  const containerTop = containerOffset.top + document.body.scrollTop;
  const containerBottom = containerTop + containerHeight;
  const element = country;
  const elementOffset = element.getBoundingClientRect();
  const elementHeight = element.offsetHeight;
  const elementTop = elementOffset.top + document.body.scrollTop;
  const elementBottom = elementTop + elementHeight;
  let newScrollTop = elementTop - containerTop + get(container).scrollTop;
  const middleOffset = containerHeight / 2 - elementHeight / 2;
  if (enableSearch ? elementTop < containerTop + 32 : elementTop < containerTop) {
    if (middle) {
      newScrollTop -= middleOffset;
    }
    get(container).scrollTop = newScrollTop;
  } else if (elementBottom > containerBottom) {
    if (middle) {
      newScrollTop += middleOffset;
    }
    const heightDifference = containerHeight - elementHeight;
    get(container).scrollTop = newScrollTop - heightDifference;
  }
};
const scrollToTop = (container) => {
  if (!container || !document.body)
    return;
  container.scrollTop = 0;
};
const getProbableCandidate = memoize$1((queryString, onlyCountries) => {
  if (!queryString || queryString.length === 0) {
    return null;
  }
  const probableCountries = get(onlyCountries).filter((country) => {
    return startsWith$1(country.name.toLowerCase(), queryString.toLowerCase());
  }, void 0);
  return probableCountries[0];
});
const getCountryData = (selectedCountry) => {
  if (!selectedCountry)
    return {};
  return {
    name: selectedCountry.name || "",
    dialCode: selectedCountry.dialCode || "",
    countryCode: selectedCountry.iso2 || "",
    format: selectedCountry.format || ""
  };
};
const guessSelectedCountry = memoize$1((inputNumber, country, onlyCountries, hiddenAreaCodes, enableAreaCodes, THIS) => {
  if (enableAreaCodes === false) {
    let mainCode;
    get(hiddenAreaCodes).some((country2) => {
      if (startsWith$1(inputNumber, country2.dialCode)) {
        get(onlyCountries).some((o) => {
          if (country2.iso2 === o.iso2 && o.mainCode) {
            mainCode = o;
            return true;
          }
        });
        return true;
      }
    });
    if (mainCode)
      return mainCode;
  }
  const secondBestGuess = get(onlyCountries).find((o) => o.iso2 == country);
  if (inputNumber.trim() === "")
    return secondBestGuess;
  const bestGuess = onlyCountries.reduce(
    (selectedCountry, country2) => {
      if (startsWith$1(inputNumber, country2.dialCode)) {
        if (country2.dialCode.length > selectedCountry.dialCode.length) {
          return country2;
        }
        if (country2.dialCode.length === selectedCountry.dialCode.length && country2.priority < selectedCountry.priority) {
          return country2;
        }
      }
      return selectedCountry;
    },
    { dialCode: "", priority: 10001 }
    /* THIS */
  );
  if (!bestGuess.name)
    return secondBestGuess;
  return bestGuess;
});
const concatPreferredCountries = (preferredCountries, onlyCountries) => {
  if (preferredCountries.length > 0) {
    return [...new Set(preferredCountries.concat(onlyCountries))];
  } else {
    return onlyCountries;
  }
};
const getDropdownCountryName = (country) => {
  return country.localName || country.name;
};
const cursorToEnd = (input) => {
  if (document.activeElement !== input)
    return;
  input.focus();
  let len = input.value.length;
  if (input.value.charAt(len - 1) === ")")
    len = len - 1;
  input.setSelectionRange(len, len);
};
const PhoneInput = (propertis) => {
  const props = {
    country: observable(""),
    value: observable(""),
    onlyCountries: observable([]),
    preferredCountries: observable([]),
    excludeCountries: observable([]),
    placeholder: observable("1 (702) 123-4567"),
    searchPlaceholder: observable("search"),
    searchNotFound: observable("No entries to show"),
    flagsImagePath: observable("./flags.png"),
    disabled: observable(false),
    containerStyle: observable({}),
    inputStyle: observable({}),
    buttonStyle: observable({}),
    dropdownStyle: observable({}),
    searchStyle: observable({}),
    containerClass: observable(""),
    inputClass: observable(null),
    buttonClass: observable(null),
    dropdownClass: observable(null),
    searchClass: observable(null),
    className: observable(null),
    autoFormat: observable(true),
    enableAreaCodes: observable(false),
    enableTerritories: observable(false),
    disableCountryCode: observable(false),
    disableDropdown: observable(false),
    enableLongNumbers: observable(false),
    countryCodeEditable: observable(true),
    enableSearch: observable(false),
    disableSearchIcon: observable(false),
    disableInitialCountryGuess: observable(false),
    disableCountryGuess: observable(false),
    regions: observable(""),
    inputProps: observable({}),
    localization: observable({}),
    masks: observable(null),
    priority: observable(null),
    areaCodes: observable(null),
    preserveOrder: observable([]),
    defaultMask: observable("... ... ... ... .."),
    // prefix+dialCode+' '+defaultMask
    alwaysDefaultMask: observable(false),
    prefix: observable("+"),
    copyNumbersOnly: observable(true),
    renderStringAsFlag: observable(""),
    autocompleteSearch: observable(false),
    jumpCursorToEnd: observable(true),
    enableAreaCodeStretch: observable(false),
    enableClickOutside: observable(true),
    showDropdown: observable(false),
    isValid: observable(true),
    // (value, $$(selectedCountry), $$(onlyCountries), hiddenAreaCodes) => true | false | 'Message'
    defaultErrorMessage: observable(""),
    specialLabel: observable("Phone"),
    onEnterKeyPress: null,
    // null or function
    ...propertis
  };
  const keys = {
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,
    ENTER: 13,
    ESC: 27,
    PLUS: 43,
    A: 65,
    Z: 90,
    SPACE: 32,
    TAB: 9
  };
  const showDropdown = isObservable(props.showDropdown) ? props.showDropdown : observable(props.showDropdown);
  const formattedNumber = observable("");
  const hiddenAreaCodes = observable([]);
  const selectedCountry = observable(null);
  const highlightCountryIndex = observable(null);
  const queryString = observable("");
  const freezeSelection = observable(false);
  const searchValue = observable("");
  const debouncedQueryStingSearcher = observable();
  const dropdownRef = observable(null);
  const numberInputRef = observable(null);
  const dropdownContainerRef = observable(null);
  const countryGuess = observable();
  const placeholder = observable("");
  const THIS = {};
  const {
    disableDropdown,
    renderStringAsFlag,
    isValid,
    defaultErrorMessage,
    specialLabel,
    disableCountryCode,
    enableAreaCodeStretch,
    enableLongNumbers,
    autoFormat,
    country,
    prefix,
    enableAreaCodes,
    enableTerritories,
    regions,
    onlyCountries,
    preferredCountries,
    excludeCountries,
    preserveOrder,
    masks,
    priority,
    areaCodes,
    localization,
    defaultMask,
    alwaysDefaultMask,
    enableSearch,
    searchNotFound,
    disableSearchIcon,
    searchClass,
    searchStyle,
    searchPlaceholder,
    autocompleteSearch,
    onChange,
    onEnterKeyPress,
    onKeyDown
  } = props;
  const { onlyCountries: oc, preferredCountries: pc, hiddenAreaCodes: ha } = new CountryData(
    get(enableAreaCodes),
    get(enableTerritories),
    get(regions),
    get(onlyCountries),
    get(preferredCountries),
    get(excludeCountries),
    get(preserveOrder),
    get(masks),
    get(priority),
    get(areaCodes),
    get(localization),
    get(prefix),
    get(defaultMask),
    get(alwaysDefaultMask)
  );
  onlyCountries(oc);
  preferredCountries(pc);
  hiddenAreaCodes(ha);
  const inputNumber = get(props.value) ? get(props.value).replace(/\D/g, "") : "";
  if (get(props.disableInitialCountryGuess)) {
    countryGuess(0);
  } else if (inputNumber.length > 1) {
    countryGuess(guessSelectedCountry(inputNumber.substring(0, 6), get(props.country), get(onlyCountries), get(hiddenAreaCodes), get(props.enableAreaCodes), THIS) || 0);
  } else if (get(props.country)) {
    countryGuess(get(onlyCountries).find((o) => o.iso2 == get(props.country)) || 0);
  } else {
    countryGuess(0);
  }
  const dialCode = inputNumber.length < 2 && get(countryGuess) && !startsWith$1(inputNumber, get(countryGuess).dialCode) ? get(countryGuess).dialCode : "";
  const formatNumber = (text, country2) => {
    if (!country2)
      return text;
    const { format } = country2;
    let pattern;
    if (get(disableCountryCode)) {
      pattern = format.split(" ");
      pattern.shift();
      pattern = pattern.join(" ");
    } else {
      if (get(enableAreaCodeStretch) && country2.isAreaCode) {
        pattern = format.split(" ");
        pattern[1] = pattern[1].replace(/\.+/, "".padEnd(country2.areaCodeLength, "."));
        pattern = pattern.join(" ");
      } else {
        pattern = format;
      }
    }
    if (!text || text.length === 0) {
      return get(disableCountryCode) ? "" : get(props.prefix);
    }
    if (text && text.length < 2 || !pattern || !get(autoFormat)) {
      return get(disableCountryCode) ? text : get(props.prefix) + text;
    }
    const formattedObject = reduce(pattern, (acc, character) => {
      if (acc.remainingText.length === 0) {
        return acc;
      }
      if (character !== ".") {
        return {
          formattedText: acc.formattedText + character,
          remainingText: acc.remainingText
        };
      }
      const [head, ...tail] = acc.remainingText;
      return {
        formattedText: acc.formattedText + head,
        remainingText: tail
      };
    }, {
      formattedText: "",
      remainingText: text.split("")
    });
    let formattedNumber_;
    if (get(enableLongNumbers)) {
      formattedNumber_ = formattedObject.formattedText + formattedObject.remainingText.join("");
    } else {
      formattedNumber_ = formattedObject.formattedText;
    }
    if (formattedNumber_.includes("(") && !formattedNumber_.includes(")"))
      formattedNumber_ += ")";
    return formattedNumber_;
  };
  formattedNumber(
    inputNumber === "" && get(countryGuess) === 0 ? "" : formatNumber(
      (get(props.disableCountryCode) ? "" : dialCode) + inputNumber,
      get(countryGuess).name ? get(countryGuess) : void 0
    )
  );
  const searchCountry = () => {
    const probableCandidate = getProbableCandidate(get(queryString), get(onlyCountries)) || get(onlyCountries)[0];
    const probableCandidateIndex = get(onlyCountries).findIndex((o) => o == probableCandidate) + get(preferredCountries).length;
    scrollTo(getElement(probableCandidateIndex), get(props.enableSearch), dropdownRef, true);
    queryString("");
    highlightCountryIndex(probableCandidateIndex);
  };
  highlightCountryIndex(get(onlyCountries).findIndex((o) => o == get(countryGuess)));
  selectedCountry(get(countryGuess));
  queryString("");
  freezeSelection(false);
  debouncedQueryStingSearcher(debounce$1(searchCountry, 250));
  searchValue("");
  const updateCountry = (country2) => {
    let newSelectedCountry;
    if (country2.indexOf(0) >= "0" && country2.indexOf(0) <= "9") {
      newSelectedCountry = get(onlyCountries).find((o) => +o.dialCode == +country2);
    } else {
      newSelectedCountry = get(onlyCountries).find((o) => o.iso2 == country2);
    }
    if (newSelectedCountry && newSelectedCountry.dialCode) {
      selectedCountry(newSelectedCountry);
      formattedNumber(get(props.disableCountryCode) ? "" : formatNumber(newSelectedCountry.dialCode, newSelectedCountry));
    }
  };
  function updateFormattedNumber(value) {
    if (!get(value)) {
      selectedCountry(null);
      formattedNumber("");
      return;
    }
    if (get(value) === "") {
      formattedNumber("");
      return;
    }
    let inputNumber2 = get(value).replace(/\D/g, "");
    let newSelectedCountry;
    if (get(selectedCountry) && startsWith$1(get(value), get(prefix) + get(selectedCountry).dialCode)) {
      formattedNumber(formatNumber(inputNumber2, get(selectedCountry)));
    } else {
      if (get(props.disableCountryGuess)) {
        newSelectedCountry = get(selectedCountry);
      } else {
        newSelectedCountry = guessSelectedCountry(inputNumber2.substring(0, 6), get(country), get(onlyCountries), get(hiddenAreaCodes), get(props.enableAreaCodes), THIS) || get(selectedCountry);
      }
      const dialCode2 = newSelectedCountry && startsWith$1(inputNumber2, get(prefix) + newSelectedCountry.dialCode) ? newSelectedCountry.dialCode : "";
      formattedNumber(formatNumber(
        (get(props.disableCountryCode) ? "" : dialCode2) + inputNumber2,
        newSelectedCountry ? newSelectedCountry : void 0
      ));
      selectedCountry(newSelectedCountry);
    }
  }
  const getElement = (index) => {
    return THIS[`flag_no_${index}`];
  };
  const handleFlagDropdownClick = (e) => {
    e.preventDefault();
    if (!get(showDropdown) && get(props.disabled))
      return;
    const allCountries = concatPreferredCountries(get(preferredCountries), get(onlyCountries));
    const highlightCountryIndex_ = allCountries.findIndex((o) => o.dialCode === get(selectedCountry).dialCode && o.iso2 === get(selectedCountry).iso2);
    highlightCountryIndex(highlightCountryIndex_);
    showDropdown(!get(showDropdown));
  };
  effect(() => {
    if (get(showDropdown)) {
      scrollTo(getElement(get(highlightCountryIndex)), get(props.enableSearch), dropdownRef);
    }
  });
  const handleInput = (e) => {
    let { value } = e.target;
    let formattedNumber_ = get(props.disableCountryCode) ? "" : get(prefix);
    let newSelectedCountry = get(selectedCountry);
    let freezeSelection_ = get(freezeSelection);
    if (!get(props.countryCodeEditable)) {
      const mainCode = newSelectedCountry.hasAreaCodes ? get(onlyCountries).find((o) => o.iso2 === newSelectedCountry.iso2 && o.mainCode).dialCode : newSelectedCountry.dialCode;
      const updatedInput = get(prefix) + mainCode;
      if (value.slice(0, updatedInput.length) !== updatedInput)
        return;
    }
    if (value === get(prefix)) {
      onChange == null ? void 0 : onChange("", getCountryData(get(selectedCountry)), "");
      return formattedNumber("");
    }
    if (value.replace(/\D/g, "").length > 15) {
      value = value.replace(/\D/g, "").substring(0, Math.max(+get(props.enableLongNumbers), 15));
    }
    if (value === get(formattedNumber_))
      return;
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
    if (value.length > 0) {
      const inpNum = value.replace(/\D/g, "");
      if (get(props.disableCountryGuess)) {
        newSelectedCountry = get(selectedCountry);
      } else {
        newSelectedCountry = guessSelectedCountry(inpNum.substring(0, 6), get(country), get(onlyCountries), get(hiddenAreaCodes), get(props.enableAreaCodes), THIS) || get(selectedCountry);
      }
      freezeSelection_ = false;
      formattedNumber_ = formatNumber(inpNum, newSelectedCountry);
      newSelectedCountry = newSelectedCountry.dialCode ? newSelectedCountry : get(selectedCountry);
    }
    const oldCaretPosition = e.target.selectionStart;
    let caretPosition = e.target.selectionStart;
    const oldFormattedText = get(formattedNumber_);
    const diff2 = formattedNumber_.length - oldFormattedText.length;
    formattedNumber(formattedNumber_);
    freezeSelection(freezeSelection_);
    selectedCountry(newSelectedCountry);
    e.target.value = formattedNumber_;
    if (diff2 > 0) {
      caretPosition = caretPosition - diff2;
    }
    const lastChar = get(formattedNumber).charAt(get(formattedNumber).length - 1);
    if (lastChar == ")") {
      get(numberInputRef).setSelectionRange(get(formattedNumber).length - 1, get(formattedNumber).length - 1);
    } else if (caretPosition > 0 && oldFormattedText.length >= get(formattedNumber).length) {
      get(numberInputRef).setSelectionRange(caretPosition, caretPosition);
    } else if (oldCaretPosition < oldFormattedText.length) {
      get(numberInputRef).setSelectionRange(oldCaretPosition, oldCaretPosition);
    }
    onChange == null ? void 0 : onChange(get(formattedNumber).replace(/[^0-9]+/g, ""), getCountryData(get(selectedCountry)), get(formattedNumber));
  };
  const handleInputClick = (e) => {
    var _a2;
    showDropdown(false);
    (_a2 = props.onClick) == null ? void 0 : _a2.call(props, e, getCountryData(get(selectedCountry)));
  };
  const handleDoubleClick = (e) => {
    const len = e.target.value.length;
    e.target.setSelectionRange(0, len);
  };
  const handleFlagItemClick = (country2, e) => {
    const currentSelectedCountry = get(selectedCountry);
    const newSelectedCountry = get(onlyCountries).find((o) => o == country2);
    if (!newSelectedCountry)
      return;
    const unformattedNumber = get(formattedNumber).replace(" ", "").replace("(", "").replace(")", "").replace("-", "");
    const newNumber = unformattedNumber.length > 1 ? unformattedNumber.replace(currentSelectedCountry.dialCode, newSelectedCountry.dialCode) : newSelectedCountry.dialCode;
    formattedNumber(formatNumber(newNumber.replace(/\D/g, ""), newSelectedCountry));
    showDropdown(false);
    selectedCountry(newSelectedCountry);
    freezeSelection(true);
    searchValue("");
  };
  effect(() => {
    var _a2;
    cursorToEnd(get(numberInputRef));
    (_a2 = props.onChange) == null ? void 0 : _a2.call(props, get(formattedNumber).replace(/[^0-9]+/g, ""), getCountryData(get(selectedCountry)), get(formattedNumber));
  });
  const handleInputFocus = (e) => {
    var _a2;
    if (get(numberInputRef)) {
      if (get(numberInputRef).value === get(props.prefix) && get(selectedCountry) && !get(props.disableCountryCode)) {
        formattedNumber(get(props.prefix) + get(selectedCountry).dialCode);
      }
    }
    placeholder("");
    (_a2 = props.onFocus) == null ? void 0 : _a2.call(props, e, getCountryData(get(selectedCountry)));
    get(props.jumpCursorToEnd) && setTimeout(() => cursorToEnd(get(numberInputRef)), 0);
  };
  effect(() => {
    get(props.jumpCursorToEnd) && setTimeout(() => cursorToEnd(get(numberInputRef)), 0);
  });
  const handleInputBlur = (e) => {
    var _a2;
    if (!e.target.value)
      placeholder(get(props.placeholder));
    (_a2 = props.onBlur) == null ? void 0 : _a2.call(props, e, getCountryData(get(selectedCountry)));
  };
  const handleInputCopy = (e) => {
    if (!get(props.copyNumbersOnly))
      return;
    const text = window.getSelection().toString().replace(/[^0-9]+/g, "");
    e.clipboardData.setData("text/plain", text);
    e.preventDefault();
  };
  const getHighlightCountryIndex = (direction) => {
    const highlightCountryIndex_ = get(highlightCountryIndex) + direction;
    if (highlightCountryIndex_ < 0 || highlightCountryIndex_ >= get(onlyCountries).length + get(preferredCountries).length) {
      return highlightCountryIndex_ - direction;
    }
    if (get(props.enableSearch) && highlightCountryIndex_ > getSearchFilteredCountries().length)
      return 0;
    return highlightCountryIndex_;
  };
  effect(() => {
    scrollTo(getElement(get(highlightCountryIndex)), get(props.enableSearch), dropdownRef, true);
  });
  const handleKeydown = (e) => {
    const { target: { className } } = e;
    if (className.includes("selected-flag") && e.which === keys.ENTER && !get(showDropdown))
      return handleFlagDropdownClick(e);
    if (className.includes("form-control") && (e.which === keys.ENTER || e.which === keys.ESC))
      return e.target.blur();
    if (!get(showDropdown) || get(props.disabled))
      return;
    if (className.includes("search-box")) {
      if (e.which !== keys.UP && e.which !== keys.DOWN && e.which !== keys.ENTER) {
        if (e.which === keys.ESC && e.target.value === "")
          ;
        else {
          return;
        }
      }
    }
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
    const moveHighlight = (direction) => {
      highlightCountryIndex(getHighlightCountryIndex(direction));
    };
    switch (e.which) {
      case keys.DOWN:
        moveHighlight(1);
        break;
      case keys.UP:
        moveHighlight(-1);
        break;
      case keys.ENTER:
        if (get(props.enableSearch)) {
          handleFlagItemClick(getSearchFilteredCountries()[get(highlightCountryIndex)] || getSearchFilteredCountries()[0]);
        } else {
          handleFlagItemClick([...get(preferredCountries), ...get(onlyCountries)][get(highlightCountryIndex)]);
        }
        break;
      case keys.ESC:
      case keys.TAB:
        showDropdown(false);
        cursorToEnd(get(numberInputRef));
        break;
      default:
        if (e.which >= keys.A && e.which <= keys.Z || e.which === keys.SPACE) {
          queryString(get(queryString) + String.fromCharCode(e.which));
          get(debouncedQueryStingSearcher);
        }
    }
  };
  const handleInputKeyDown = (e) => {
    if (e.which === keys.ENTER)
      onEnterKeyPress == null ? void 0 : onEnterKeyPress(e);
    onKeyDown == null ? void 0 : onKeyDown(e);
  };
  const handleClickOutside = (e) => {
    if (get(dropdownRef) && !get(dropdownContainerRef).contains(e.target)) {
      get(showDropdown) && showDropdown(false);
    }
  };
  effect(() => {
    var _a2;
    if (document.addEventListener && get(props.enableClickOutside)) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    (_a2 = props.onMount) == null ? void 0 : _a2.call(props, get(formattedNumber).replace(/[^0-9]+/g, ""), getCountryData(get(selectedCountry)), get(formattedNumber));
    return () => {
      if (document.removeEventListener && get(props.enableClickOutside)) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  });
  effect(() => {
    updateCountry(get(props.country));
  });
  effect(() => {
    updateFormattedNumber(props.value);
  });
  const handleSearchChange = (e) => {
    const { currentTarget: { value: searchValue2 } } = e;
    let highlightCountryIndex_ = 0;
    if (searchValue2 === "" && get(selectedCountry)) {
      highlightCountryIndex_ = concatPreferredCountries(get(preferredCountries), get(onlyCountries)).findIndex((o) => o == get(selectedCountry));
      setTimeout(() => scrollTo(getElement(highlightCountryIndex_), get(props.enableSearch), dropdownRef), 100);
    }
    highlightCountryIndex(highlightCountryIndex_);
  };
  const getSearchFilteredCountries = () => {
    const allCountries = concatPreferredCountries(get(preferredCountries), get(onlyCountries));
    const sanitizedSearchValue = get(searchValue).trim().toLowerCase().replace("+", "");
    if (get(enableSearch) && sanitizedSearchValue) {
      if (/^\d+$/.test(sanitizedSearchValue)) {
        return allCountries.filter(({ dialCode: dialCode2 }) => [`${dialCode2}`].some((field) => field.toLowerCase().includes(sanitizedSearchValue)));
      } else {
        const iso2countries = allCountries.filter(({ iso2 }) => [`${iso2}`].some((field) => field.toLowerCase().includes(sanitizedSearchValue)));
        const searchedCountries = allCountries.filter(({ name, localName, iso2 }) => [`${name}`, `${localName || ""}`].some((field) => field.toLowerCase().includes(sanitizedSearchValue)));
        scrollToTop(get(dropdownRef));
        return [...new Set([].concat(iso2countries, searchedCountries))];
      }
    } else {
      return allCountries;
    }
  };
  const getCountryDropdownList = () => {
    const searchedCountries = getSearchFilteredCountries();
    let countryDropdownList = searchedCountries.map((country2, index) => {
      const highlight = get(highlightCountryIndex) === index;
      const itemClasses = [
        {
          country: true,
          preferred: country2.iso2 === "us" || country2.iso2 === "gb",
          active: country2.iso2 === "us",
          highlight
        },
        "relative pl-[46px] pr-[9px] pt-3 pb-[13px] hover:bg-[#f1f1f1]",
        () => highlight ? "bg-[#f1f1f1]" : ""
      ];
      const inputFlagClasses2 = [
        "flag",
        "w-[25px] h-5 bg-no-repeat",
        () => flag[country2.iso2],
        /* 'bg-[url(./style/common/high-res.png)] ' */
        "inline-block absolute left-[13px] top-2 mr-[7px] mt-0.5",
        "mr-[7px] mt-0.5"
      ];
      return /* @__PURE__ */ jsx(
        "li",
        {
          ref: (el) => THIS[`flag_no_${index}`] = el,
          "data-flag-key": `flag_no_${index}`,
          className: itemClasses,
          "data-dial-code": "1",
          tabIndex: () => get(disableDropdown) ? "-1" : "0",
          "data-country-code": country2.iso2,
          onClick: (e) => handleFlagItemClick(country2),
          role: "option",
          ...highlight ? { "aria-selected": true } : {},
          children: [
            /* @__PURE__ */ jsx("div", { className: inputFlagClasses2 }),
            /* @__PURE__ */ jsx("span", { className: "country-name mr-1.5", children: getDropdownCountryName(country2) }),
            /* @__PURE__ */ jsx("span", { className: "dial-code text-[#6b6b6b]", children: country2.format ? formatNumber(country2.dialCode, country2) : get(prefix) + country2.dialCode })
          ]
        },
        `flag_no_${index}`
      );
    });
    const dashedLi = /* @__PURE__ */ jsx("li", { className: "divider mb-[5px] pb-[5px] border-b-[#ccc] border-b border-solid" }, "dashes");
    get(preferredCountries).length > 0 && (!get(enableSearch) || get(enableSearch) && !get(searchValue).trim()) && countryDropdownList.splice(get(preferredCountries).length, 0, dashedLi);
    const dropDownClasses = [
      {
        "country-list": true,
        "hide hidden": () => !get(showDropdown)
      },
      props.dropdownClass,
      `z-[1] absolute shadow-[1px_2px_18px_rgba(0,0,0,0.25)] bg-[white] w-[300px] max-h-[220px] overflow-y-scroll -ml-px mr-0 mt-0 mb-2.5 p-0 rounded-[7px]
  [outline:none] list-none`
    ];
    return /* @__PURE__ */ jsx(
      "ul",
      {
        ref: (el) => {
          !get(enableSearch) && el && el.focus();
          return dropdownRef(el);
        },
        className: dropDownClasses,
        style: props.dropdownStyle,
        role: "listbox",
        tabIndex: "0",
        children: [
          () => get(enableSearch) && /* @__PURE__ */ jsx(
            "li",
            {
              className: [
                {
                  search: true
                },
                searchClass,
                "z-[2] sticky bg-white pl-2.5 pr-0 pt-2.5 pb-1.5 top-0"
              ],
              children: [
                !get(disableSearchIcon) && /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: [
                      {
                        "search-emoji": true,
                        [`${() => get(searchClass)}-emoji`]: get(searchClass)
                      },
                      "hidden text-[15px]"
                    ],
                    role: "img",
                    "aria-label": "Magnifying glass",
                    children: "🔎"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: [
                      {
                        "search-box": true,
                        [`${() => get(searchClass)}-box`]: get(searchClass)
                      },
                      "border text-[15px] leading-[15px] ml-1.5 pt-[3px] pb-[5px] px-2 rounded-[3px] border-solid border-[#cacaca] hover:border-[#505050]"
                    ],
                    style: searchStyle,
                    type: "search",
                    placeholder: searchPlaceholder,
                    autoFocus: true,
                    autoComplete: () => get(autocompleteSearch) ? "on" : "off",
                    value: searchValue,
                    onChange: handleSearchChange
                  }
                )
              ]
            }
          ),
          countryDropdownList.length > 0 ? countryDropdownList : /* @__PURE__ */ jsx("li", { className: "no-entries-message opacity-70 pt-[7px] pb-[11px] px-2.5", children: /* @__PURE__ */ jsx("span", { children: searchNotFound }) })
        ]
      }
    );
  };
  const isValidValue = observable();
  const errorMessage = observable();
  effect(() => {
    if (isObservable(isValid)) {
      isValidValue(get(isValid));
    } else if (typeof isValid === "function") {
      const isValidProcessed = isValid(get(formattedNumber).replace(/\D/g, ""), get(selectedCountry), get(onlyCountries), get(hiddenAreaCodes));
      if (typeof isValidProcessed === "boolean") {
        isValidValue(isValidProcessed);
        if (get(isValidValue) === false)
          errorMessage(get(defaultErrorMessage));
      } else {
        isValidValue(false);
        errorMessage(isValidProcessed);
      }
    }
  });
  const containerClasses = [
    props.containerClass,
    `voby-tel-input text-[15px] relative w-full disabled:cursor-not-allowed`
  ];
  const arrowClasses = { "arrow": true, "up border-t-[none] border-b-4 border-b-[#555] border-solid": showDropdown };
  const inputClasses = [
    {
      "form-control": true,
      'invalid-number border border-solid border-[#f44336] focus:shadow-[0_0_0_1px_#f44336] [&+div]:before:content-["Error"] [&+div]:before:hidden [&+div]:before:text-[#f44336] [&+div]:before:w-[27px]': () => !get(isValidValue),
      "open": get(showDropdown),
      "here": true
    },
    props.inputClass,
    `text-base bg-white border w-[300px] pl-[58px] pr-3.5 py-[10.5px] rounded-[5px] border-solid border-[#CACACA] hover:border-black focus:shadow-[0_0_0_1px_#1976d2] focus:border-[#1976d2]
  [outline:none]
  [transition:box-shadow_ease_0.25s,border-color_ease 0.25s]
  [&:focus+div]:before:text-[#1976d2]
  `
  ];
  const selectedFlagClasses = [
    {
      "selected-flag": true,
      "open": get(showDropdown)
    },
    "relative w-[52px] h-full pl-[11px] pr-0 py-0 rounded-[3px_0_0_3px] [outline:none]",
    // `[&:focus_.arrow]:border-t-[5px] [&:focus_.arrow]:border-t-[#1976d2] [&:focus_.arrow]:border-x-4 [&:focus_.arrow]:border-solid`,
    "[&_.flag]:absolute [&_.flag]:-mt-3 [&_.flag]:top-2/4"
    // '[&_.arrow]:relative [&_.arrow]:w-0 [&_.arrow]:h-0 [&_.arrow]:-mt-px [&_.arrow]:border-t-4 [&_.arrow]:border-t-[#555] [&_.arrow]:border-x-[3px] [&_.arrow]:border-x-transparent [&_.arrow]:border-solid [&_.arrow]:left-[29px] [&_.arrow]:top-2/4',
  ];
  const flagViewClasses = [
    {
      "flag-dropdown absolute p-0 rounded-[3px_0_0_3px] inset-y-0 hover:cursor-pointer focus:cursor-pointer": true,
      'invalid-number border border-solid border-[#f44336] focus:shadow-[0_0_0_1px_#f44336] [&+div]:before:content-["Error"] [&+div]:before:hidden [&+div]:before:text-[#f44336] [&+div]:before:w-[27px]': () => !isValidValue,
      "open z-[2]": get(showDropdown)
    },
    props.buttonClass
  ];
  const inputFlagClasses = ["flag w-[25px] h-5 bg-no-repeat", () => {
    var _a2;
    return flag[(_a2 = get(selectedCountry)) == null ? void 0 : _a2.iso2];
  }];
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: [containerClasses, props.className],
      style: props.style || props.containerStyle,
      onKeyDown: handleKeydown,
      children: [
        () => get(specialLabel) && /* @__PURE__ */ jsx("div", { className: "special-label absolute z-[1] top-[-7px] block bg-[white] text-[13px] whitespace-nowrap px-[5px] py-0 left-[25px]", children: specialLabel }),
        () => get(errorMessage) && /* @__PURE__ */ jsx("div", { className: "invalid-number-message absolute z-[1] text-[13px] top-[-7px] bg-white text-[#de0000] px-[5px] py-0 left-[25px]", children: errorMessage }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: inputClasses,
            style: props.inputStyle,
            onChange: handleInput,
            onClick: handleInputClick,
            onDoubleClick: handleDoubleClick,
            onFocus: handleInputFocus,
            onBlur: handleInputBlur,
            onCopy: handleInputCopy,
            value: formattedNumber,
            onKeyDown: handleInputKeyDown,
            placeholder: props.placeholder,
            disabled: props.disabled,
            type: "tel",
            ...props.inputProps,
            ref: (el) => {
              numberInputRef(el);
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: [
              flagViewClasses,
              "[&:disabled+.flag-dropdown:hover]:cursor-default [&:disabled+.flag-dropdown:hover]:border-[#CACACA]",
              "[&:disabled+.flag-dropdown:hover.selected-flag]:bg-transparent"
            ],
            style: props.buttonStyle,
            ref: dropdownContainerRef,
            children: [
              () => get(renderStringAsFlag) ? /* @__PURE__ */ jsx("div", { className: selectedFlagClasses, children: renderStringAsFlag }) : /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => get(disableDropdown) ? void 0 : handleFlagDropdownClick,
                  className: [selectedFlagClasses],
                  title: () => get(selectedCountry) ? `${get(selectedCountry).localName || get(selectedCountry).name}: + ${get(selectedCountry).dialCode}` : "",
                  tabIndex: () => get(disableDropdown) ? "-1" : "0",
                  role: "button",
                  "aria-haspopup": "listbox",
                  "aria-expanded": () => get(showDropdown) ? true : void 0,
                  children: /* @__PURE__ */ jsx("div", { className: inputFlagClasses, children: !get(disableDropdown) && /* @__PURE__ */ jsx("div", { className: arrowClasses }) })
                }
              ),
              showDropdown && getCountryDropdownList()
            ]
          }
        )
      ]
    }
  );
};
const App = () => {
  const phone = observable("");
  return /* @__PURE__ */ jsx(
    PhoneInput,
    {
      country: "us",
      value: phone,
      onChange: (p) => phone(p),
      isValid: (value, country) => {
        return true;
      }
    }
  );
};
render$1(/* @__PURE__ */ jsx(App, {}), document.getElementById("app"));
