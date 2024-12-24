import { jsxs, jsx } from "woby/jsx-runtime";
import { $$, $, isObservable, useEffect } from "woby";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var lodash_debounce;
var hasRequiredLodash_debounce;
function requireLodash_debounce() {
  if (hasRequiredLodash_debounce) return lodash_debounce;
  hasRequiredLodash_debounce = 1;
  var FUNC_ERROR_TEXT = "Expected a function";
  var NAN = 0 / 0;
  var symbolTag = "[object Symbol]";
  var reTrim = /^\s+|\s+$/g;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var objectProto = Object.prototype;
  var objectToString = objectProto.toString;
  var nativeMax = Math.max, nativeMin = Math.min;
  var now = function() {
    return root.Date.now();
  };
  function debounce2(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
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
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
  }
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, "");
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }
  lodash_debounce = debounce2;
  return lodash_debounce;
}
var lodash_debounceExports = requireLodash_debounce();
const debounce = /* @__PURE__ */ getDefaultExportFromCjs(lodash_debounceExports);
var lodash_reduce = { exports: {} };
lodash_reduce.exports;
var hasRequiredLodash_reduce;
function requireLodash_reduce() {
  if (hasRequiredLodash_reduce) return lodash_reduce.exports;
  hasRequiredLodash_reduce = 1;
  (function(module, exports) {
    var LARGE_ARRAY_SIZE = 200;
    var FUNC_ERROR_TEXT = "Expected a function";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var UNORDERED_COMPARE_FLAG = 1, PARTIAL_COMPARE_FLAG = 2;
    var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", promiseTag = "[object Promise]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, reLeadingDot = /^\./, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reEscapeChar = /\\(\\)?/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
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
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
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
    var Symbol = root.Symbol, Uint8Array = root.Uint8Array, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice;
    var nativeKeys = overArg(Object.keys, Object);
    var DataView = getNative(root, "DataView"), Map = getNative(root, "Map"), Promise2 = getNative(root, "Promise"), Set2 = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
    var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set2), weakMapCtorString = toSource(WeakMap);
    var symbolProto = Symbol ? Symbol.prototype : void 0, symbolValueOf = symbolProto ? symbolProto.valueOf : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
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
        "map": new (Map || ListCache)(),
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
    function SetCache(values) {
      var index = -1, length = values ? values.length : 0;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }
    function stackClear() {
      this.__data__ = new ListCache();
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
      if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          return this;
        }
        cache = this.__data__ = new MapCache(pairs);
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
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key in value) {
        if (hasOwnProperty.call(value, key) && !(skipIndexes && (key == "length" || isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
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
      return objectToString.call(value);
    }
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }
    function baseIsEqual(value, other, customizer, bitmask, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObject(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
    }
    function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
      var objIsArr = isArray(object), othIsArr = isArray(other), objTag = arrayTag, othTag = arrayTag;
      if (!objIsArr) {
        objTag = getTag(object);
        objTag = objTag == argsTag ? objectTag : objTag;
      }
      if (!othIsArr) {
        othTag = getTag(other);
        othTag = othTag == argsTag ? objectTag : othTag;
      }
      var objIsObj = objTag == objectTag && !isHostObject(object), othIsObj = othTag == objectTag && !isHostObject(other), isSameTag = objTag == othTag;
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, equalFunc, customizer, bitmask, stack) : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
      }
      if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
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
      var index = matchData.length, length = index;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if (data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0], objValue = object[key], srcValue = data[1];
        if (data[2]) {
          if (objValue === void 0 && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack();
          var result;
          if (!(result === void 0 ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack) : result)) {
            return false;
          }
        }
      }
      return true;
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
    }
    function baseIteratee(value) {
      if (typeof value == "function") {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == "object") {
        return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
      }
      return property(value);
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
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
        var objValue = get(object, path);
        return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, void 0, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
      };
    }
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
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
    function castPath(value) {
      return isArray(value) ? value : stringToPath(value);
    }
    function createBaseEach(eachFunc, fromRight) {
      return function(collection, iteratee) {
        if (collection == null) {
          return collection;
        }
        if (!isArrayLike(collection)) {
          return eachFunc(collection, iteratee);
        }
        var length = collection.length, index = -1, iterable = Object(collection);
        while (++index < length) {
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
          var key = props[++index];
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
          return eq(+object, +other);
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
        case symbolTag:
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
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
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
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getMatchData(object) {
      var result = keys(object), length = result.length;
      while (length--) {
        var key = result[length], value = object[key];
        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    var getTag = baseGetTag;
    if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : void 0;
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
      return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isKey(value, object) {
      if (isArray(value)) {
        return false;
      }
      var type = typeof value;
      if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
        return true;
      }
      return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function isStrictComparable(value) {
      return value === value && !isObject(value);
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
      string = toString(string);
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
      if (typeof value == "string" || isSymbol(value)) {
        return value;
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
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
    function reduce2(collection, iteratee, accumulator) {
      var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
      return func(collection, baseIteratee(iteratee), accumulator, initAccum, baseEach);
    }
    function memoize2(func, resolver) {
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
      memoized.cache = new (memoize2.Cache || MapCache)();
      return memoized;
    }
    memoize2.Cache = MapCache;
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    function isFunction(value) {
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function toString(value) {
      return value == null ? "" : baseToString(value);
    }
    function get(object, path, defaultValue) {
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
  return lodash_reduce.exports;
}
var lodash_reduceExports = requireLodash_reduce();
const reduce = /* @__PURE__ */ getDefaultExportFromCjs(lodash_reduceExports);
var lodash_startswith;
var hasRequiredLodash_startswith;
function requireLodash_startswith() {
  if (hasRequiredLodash_startswith) return lodash_startswith;
  hasRequiredLodash_startswith = 1;
  var INFINITY = 1 / 0, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
  var symbolTag = "[object Symbol]";
  var reTrim = /^\s+|\s+$/g;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();
  var objectProto = Object.prototype;
  var objectToString = objectProto.toString;
  var Symbol = root.Symbol;
  var symbolProto = Symbol ? Symbol.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
  function baseClamp(number, lower, upper) {
    if (number === number) {
      if (upper !== void 0) {
        number = number <= upper ? number : upper;
      }
      {
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
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
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
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
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
  function startsWith2(string, target, position) {
    string = toString(string);
    position = baseClamp(toInteger(position), 0, string.length);
    target = baseToString(target);
    return string.slice(position, position + target.length) == target;
  }
  lodash_startswith = startsWith2;
  return lodash_startswith;
}
var lodash_startswithExports = requireLodash_startswith();
const startsWith = /* @__PURE__ */ getDefaultExportFromCjs(lodash_startswithExports);
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
  if (extendingObject === null) return;
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
  if (!userContent.length) return countries;
  return countries.map((o) => {
    const userContentIndex = userContent.findIndex((arr) => arr[0] === o[2]);
    if (userContentIndex === -1) return o;
    const userContentCountry = userContent[userContentIndex];
    if (userContentCountry[1]) o[4] = userContentCountry[1];
    if (userContentCountry[3]) o[5] = userContentCountry[3];
    if (userContentCountry[2]) o[6] = userContentCountry[2];
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
      if (countryCodes.length === 0) return sourceCountryList;
      let filteredCountries;
      if (preserveOrder2) {
        filteredCountries = countryCodes.map((countryCode) => {
          const country = sourceCountryList.find((country2) => country2.iso2 === countryCode);
          if (country) return country;
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
    if (regions) initializedCountries = this.filterRegions(regions, initializedCountries);
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
var lodash_memoize;
var hasRequiredLodash_memoize;
function requireLodash_memoize() {
  if (hasRequiredLodash_memoize) return lodash_memoize;
  hasRequiredLodash_memoize = 1;
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
  var Map = getNative(root, "Map"), nativeCreate = getNative(Object, "create");
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
      "map": new (Map || ListCache)(),
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
  function memoize2(func, resolver) {
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
    memoized.cache = new (memoize2.Cache || MapCache)();
    return memoized;
  }
  memoize2.Cache = MapCache;
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
  lodash_memoize = memoize2;
  return lodash_memoize;
}
var lodash_memoizeExports = requireLodash_memoize();
const memoize = /* @__PURE__ */ getDefaultExportFromCjs(lodash_memoizeExports);
const scrollTo = (country, enableSearch, container, middle) => {
  if (!country) return;
  if (!container || !document.body) return;
  const containerHeight = $$(container).offsetHeight;
  const containerOffset = $$(container).getBoundingClientRect();
  const containerTop = containerOffset.top + document.body.scrollTop;
  const containerBottom = containerTop + containerHeight;
  const element = country;
  const elementOffset = element.getBoundingClientRect();
  const elementHeight = element.offsetHeight;
  const elementTop = elementOffset.top + document.body.scrollTop;
  const elementBottom = elementTop + elementHeight;
  let newScrollTop = elementTop - containerTop + $$(container).scrollTop;
  const middleOffset = containerHeight / 2 - elementHeight / 2;
  if (enableSearch ? elementTop < containerTop + 32 : elementTop < containerTop) {
    if (middle) {
      newScrollTop -= middleOffset;
    }
    $$(container).scrollTop = newScrollTop;
  } else if (elementBottom > containerBottom) {
    if (middle) {
      newScrollTop += middleOffset;
    }
    const heightDifference = containerHeight - elementHeight;
    $$(container).scrollTop = newScrollTop - heightDifference;
  }
};
const scrollToTop = (container) => {
  if (!container || !document.body) return;
  container.scrollTop = 0;
};
const getProbableCandidate = memoize((queryString, onlyCountries) => {
  if (!queryString || queryString.length === 0) {
    return null;
  }
  const probableCountries = $$(onlyCountries).filter((country) => {
    return startsWith(country.name.toLowerCase(), queryString.toLowerCase());
  }, void 0);
  return probableCountries[0];
});
const getCountryData = (selectedCountry) => {
  if (!selectedCountry) return {};
  return {
    name: selectedCountry.name || "",
    dialCode: selectedCountry.dialCode || "",
    countryCode: selectedCountry.iso2 || "",
    format: selectedCountry.format || ""
  };
};
const guessSelectedCountry = memoize((inputNumber, country, onlyCountries, hiddenAreaCodes, enableAreaCodes, THIS) => {
  if (enableAreaCodes === false) {
    let mainCode;
    $$(hiddenAreaCodes).some((country2) => {
      if (startsWith(inputNumber, country2.dialCode)) {
        $$(onlyCountries).some((o) => {
          if (country2.iso2 === o.iso2 && o.mainCode) {
            mainCode = o;
            return true;
          }
        });
        return true;
      }
    });
    if (mainCode) return mainCode;
  }
  const secondBestGuess = $$(onlyCountries).find((o) => o.iso2 == country);
  if (inputNumber.trim() === "") return secondBestGuess;
  const bestGuess = onlyCountries.reduce(
    (selectedCountry, country2) => {
      if (startsWith(inputNumber, country2.dialCode)) {
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
  if (!bestGuess.name) return secondBestGuess;
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
  if (document.activeElement !== input) return;
  input.focus();
  let len = input.value.length;
  if (input.value.charAt(len - 1) === ")") len = len - 1;
  input.setSelectionRange(len, len);
};
const PhoneInput = (propertis) => {
  const props = {
    country: $(""),
    value: $(""),
    onlyCountries: $([]),
    preferredCountries: $([]),
    excludeCountries: $([]),
    placeholder: $("1 (702) 123-4567"),
    searchPlaceholder: $("search"),
    searchNotFound: $("No entries to show"),
    flagsImagePath: $("./flags.png"),
    disabled: $(false),
    containerStyle: $({}),
    inputStyle: $({}),
    buttonStyle: $({}),
    dropdownStyle: $({}),
    searchStyle: $({}),
    containerClass: $(""),
    inputClass: $(null),
    buttonClass: $(null),
    dropdownClass: $(null),
    searchClass: $(null),
    className: $(null),
    autoFormat: $(true),
    enableAreaCodes: $(false),
    enableTerritories: $(false),
    disableCountryCode: $(false),
    disableDropdown: $(false),
    enableLongNumbers: $(false),
    countryCodeEditable: $(true),
    enableSearch: $(false),
    disableSearchIcon: $(false),
    disableInitialCountryGuess: $(false),
    disableCountryGuess: $(false),
    regions: $(""),
    inputProps: $({}),
    localization: $({}),
    masks: $(null),
    priority: $(null),
    areaCodes: $(null),
    preserveOrder: $([]),
    defaultMask: $("... ... ... ... .."),
    // prefix+dialCode+' '+defaultMask
    alwaysDefaultMask: $(false),
    prefix: $("+"),
    copyNumbersOnly: $(true),
    renderStringAsFlag: $(""),
    autocompleteSearch: $(false),
    jumpCursorToEnd: $(true),
    enableAreaCodeStretch: $(false),
    enableClickOutside: $(true),
    showDropdown: $(false),
    isValid: $(true),
    // (value, $$(selectedCountry), $$(onlyCountries), hiddenAreaCodes) => true | false | 'Message'
    defaultErrorMessage: $(""),
    specialLabel: $("Phone"),
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
  const showDropdown = isObservable(props.showDropdown) ? props.showDropdown : $(props.showDropdown);
  const formattedNumber = $("");
  const hiddenAreaCodes = $([]);
  const selectedCountry = $(null);
  const highlightCountryIndex = $(null);
  const queryString = $("");
  const freezeSelection = $(false);
  const searchValue = $("");
  const debouncedQueryStingSearcher = $();
  const dropdownRef = $(null);
  const numberInputRef = $(null);
  const dropdownContainerRef = $(null);
  const countryGuess = $();
  const placeholder = $("");
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
    $$(enableAreaCodes),
    $$(enableTerritories),
    $$(regions),
    $$(onlyCountries),
    $$(preferredCountries),
    $$(excludeCountries),
    $$(preserveOrder),
    $$(masks),
    $$(priority),
    $$(areaCodes),
    $$(localization),
    $$(prefix),
    $$(defaultMask),
    $$(alwaysDefaultMask)
  );
  onlyCountries(oc);
  preferredCountries(pc);
  hiddenAreaCodes(ha);
  const inputNumber = $$(props.value) ? $$(props.value).replace(/\D/g, "") : "";
  if ($$(props.disableInitialCountryGuess)) {
    countryGuess(0);
  } else if (inputNumber.length > 1) {
    countryGuess(guessSelectedCountry(inputNumber.substring(0, 6), $$(props.country), $$(onlyCountries), $$(hiddenAreaCodes), $$(props.enableAreaCodes), THIS) || 0);
  } else if ($$(props.country)) {
    countryGuess($$(onlyCountries).find((o) => o.iso2 == $$(props.country)) || 0);
  } else {
    countryGuess(0);
  }
  const dialCode = inputNumber.length < 2 && $$(countryGuess) && !startsWith(inputNumber, $$(countryGuess).dialCode) ? $$(countryGuess).dialCode : "";
  const formatNumber = (text, country2) => {
    if (!country2) return text;
    const { format } = country2;
    let pattern;
    if ($$(disableCountryCode)) {
      pattern = format.split(" ");
      pattern.shift();
      pattern = pattern.join(" ");
    } else {
      if ($$(enableAreaCodeStretch) && country2.isAreaCode) {
        pattern = format.split(" ");
        pattern[1] = pattern[1].replace(/\.+/, "".padEnd(country2.areaCodeLength, "."));
        pattern = pattern.join(" ");
      } else {
        pattern = format;
      }
    }
    if (!text || text.length === 0) {
      return $$(disableCountryCode) ? "" : $$(props.prefix);
    }
    if (text && text.length < 2 || !pattern || !$$(autoFormat)) {
      return $$(disableCountryCode) ? text : $$(props.prefix) + text;
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
    if ($$(enableLongNumbers)) {
      formattedNumber_ = formattedObject.formattedText + formattedObject.remainingText.join("");
    } else {
      formattedNumber_ = formattedObject.formattedText;
    }
    if (formattedNumber_.includes("(") && !formattedNumber_.includes(")")) formattedNumber_ += ")";
    return formattedNumber_;
  };
  formattedNumber(
    inputNumber === "" && $$(countryGuess) === 0 ? "" : formatNumber(
      ($$(props.disableCountryCode) ? "" : dialCode) + inputNumber,
      $$(countryGuess).name ? $$(countryGuess) : void 0
    )
  );
  const searchCountry = () => {
    const probableCandidate = getProbableCandidate($$(queryString), $$(onlyCountries)) || $$(onlyCountries)[0];
    const probableCandidateIndex = $$(onlyCountries).findIndex((o) => o == probableCandidate) + $$(preferredCountries).length;
    scrollTo(getElement(probableCandidateIndex), $$(props.enableSearch), dropdownRef, true);
    queryString("");
    highlightCountryIndex(probableCandidateIndex);
  };
  highlightCountryIndex($$(onlyCountries).findIndex((o) => o == $$(countryGuess)));
  selectedCountry($$(countryGuess));
  queryString("");
  freezeSelection(false);
  debouncedQueryStingSearcher(debounce(searchCountry, 250));
  searchValue("");
  const updateCountry = (country2) => {
    let newSelectedCountry;
    if (country2.indexOf(0) >= "0" && country2.indexOf(0) <= "9") {
      newSelectedCountry = $$(onlyCountries).find((o) => +o.dialCode == +country2);
    } else {
      newSelectedCountry = $$(onlyCountries).find((o) => o.iso2 == country2);
    }
    if (newSelectedCountry && newSelectedCountry.dialCode) {
      selectedCountry(newSelectedCountry);
      formattedNumber($$(props.disableCountryCode) ? "" : formatNumber(newSelectedCountry.dialCode, newSelectedCountry));
    }
  };
  function updateFormattedNumber(value) {
    if (!$$(value)) {
      selectedCountry(null);
      formattedNumber("");
      return;
    }
    if ($$(value) === "") {
      formattedNumber("");
      return;
    }
    let inputNumber2 = $$(value).replace(/\D/g, "");
    let newSelectedCountry;
    if ($$(selectedCountry) && startsWith($$(value), $$(prefix) + $$(selectedCountry).dialCode)) {
      formattedNumber(formatNumber(inputNumber2, $$(selectedCountry)));
    } else {
      if ($$(props.disableCountryGuess)) {
        newSelectedCountry = $$(selectedCountry);
      } else {
        newSelectedCountry = guessSelectedCountry(inputNumber2.substring(0, 6), $$(country), $$(onlyCountries), $$(hiddenAreaCodes), $$(props.enableAreaCodes), THIS) || $$(selectedCountry);
      }
      const dialCode2 = newSelectedCountry && startsWith(inputNumber2, $$(prefix) + newSelectedCountry.dialCode) ? newSelectedCountry.dialCode : "";
      formattedNumber(formatNumber(
        ($$(props.disableCountryCode) ? "" : dialCode2) + inputNumber2,
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
    if (!$$(showDropdown) && $$(props.disabled)) return;
    const allCountries = concatPreferredCountries($$(preferredCountries), $$(onlyCountries));
    const highlightCountryIndex_ = allCountries.findIndex((o) => o.dialCode === $$(selectedCountry).dialCode && o.iso2 === $$(selectedCountry).iso2);
    highlightCountryIndex(highlightCountryIndex_);
    showDropdown(!$$(showDropdown));
  };
  useEffect(() => {
    if ($$(showDropdown)) {
      scrollTo(getElement($$(highlightCountryIndex)), $$(props.enableSearch), dropdownRef);
    }
  });
  const handleInput = (e) => {
    let { value } = e.target;
    let formattedNumber_ = $$(props.disableCountryCode) ? "" : $$(prefix);
    let newSelectedCountry = $$(selectedCountry);
    let freezeSelection_ = $$(freezeSelection);
    if (!$$(props.countryCodeEditable)) {
      const mainCode = newSelectedCountry.hasAreaCodes ? $$(onlyCountries).find((o) => o.iso2 === newSelectedCountry.iso2 && o.mainCode).dialCode : newSelectedCountry.dialCode;
      const updatedInput = $$(prefix) + mainCode;
      if (value.slice(0, updatedInput.length) !== updatedInput) return;
    }
    if (value === $$(prefix)) {
      onChange == null ? void 0 : onChange("", getCountryData($$(selectedCountry)), "");
      return formattedNumber("");
    }
    if (value.replace(/\D/g, "").length > 15) {
      value = value.replace(/\D/g, "").substring(0, Math.max(+$$(props.enableLongNumbers), 15));
    }
    if (value === $$(formattedNumber_)) return;
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
    if (value.length > 0) {
      const inpNum = value.replace(/\D/g, "");
      if ($$(props.disableCountryGuess)) {
        newSelectedCountry = $$(selectedCountry);
      } else {
        newSelectedCountry = guessSelectedCountry(inpNum.substring(0, 6), $$(country), $$(onlyCountries), $$(hiddenAreaCodes), $$(props.enableAreaCodes), THIS) || $$(selectedCountry);
      }
      freezeSelection_ = false;
      formattedNumber_ = formatNumber(inpNum, newSelectedCountry);
      newSelectedCountry = newSelectedCountry.dialCode ? newSelectedCountry : $$(selectedCountry);
    }
    const oldCaretPosition = e.target.selectionStart;
    let caretPosition = e.target.selectionStart;
    const oldFormattedText = $$(formattedNumber_);
    const diff = formattedNumber_.length - oldFormattedText.length;
    formattedNumber(formattedNumber_);
    freezeSelection(freezeSelection_);
    selectedCountry(newSelectedCountry);
    e.target.value = formattedNumber_;
    if (diff > 0) {
      caretPosition = caretPosition - diff;
    }
    const lastChar = $$(formattedNumber).charAt($$(formattedNumber).length - 1);
    if (lastChar == ")") {
      $$(numberInputRef).setSelectionRange($$(formattedNumber).length - 1, $$(formattedNumber).length - 1);
    } else if (caretPosition > 0 && oldFormattedText.length >= $$(formattedNumber).length) {
      $$(numberInputRef).setSelectionRange(caretPosition, caretPosition);
    } else if (oldCaretPosition < oldFormattedText.length) {
      $$(numberInputRef).setSelectionRange(oldCaretPosition, oldCaretPosition);
    }
    onChange == null ? void 0 : onChange($$(formattedNumber).replace(/[^0-9]+/g, ""), getCountryData($$(selectedCountry)), $$(formattedNumber));
  };
  const handleInputClick = (e) => {
    var _a;
    showDropdown(false);
    (_a = props.onClick) == null ? void 0 : _a.call(props, e, getCountryData($$(selectedCountry)));
  };
  const handleDoubleClick = (e) => {
    const len = e.target.value.length;
    e.target.setSelectionRange(0, len);
  };
  const handleFlagItemClick = (country2, e) => {
    const currentSelectedCountry = $$(selectedCountry);
    const newSelectedCountry = $$(onlyCountries).find((o) => o == country2);
    if (!newSelectedCountry) return;
    const unformattedNumber = $$(formattedNumber).replace(" ", "").replace("(", "").replace(")", "").replace("-", "");
    const newNumber = unformattedNumber.length > 1 ? unformattedNumber.replace(currentSelectedCountry.dialCode, newSelectedCountry.dialCode) : newSelectedCountry.dialCode;
    formattedNumber(formatNumber(newNumber.replace(/\D/g, ""), newSelectedCountry));
    showDropdown(false);
    selectedCountry(newSelectedCountry);
    freezeSelection(true);
    searchValue("");
  };
  useEffect(() => {
    var _a;
    cursorToEnd($$(numberInputRef));
    (_a = props.onChange) == null ? void 0 : _a.call(props, $$(formattedNumber).replace(/[^0-9]+/g, ""), getCountryData($$(selectedCountry)), $$(formattedNumber));
  });
  const handleInputFocus = (e) => {
    var _a;
    if ($$(numberInputRef)) {
      if ($$(numberInputRef).value === $$(props.prefix) && $$(selectedCountry) && !$$(props.disableCountryCode)) {
        formattedNumber($$(props.prefix) + $$(selectedCountry).dialCode);
      }
    }
    placeholder("");
    (_a = props.onFocus) == null ? void 0 : _a.call(props, e, getCountryData($$(selectedCountry)));
    $$(props.jumpCursorToEnd) && setTimeout(() => cursorToEnd($$(numberInputRef)), 0);
  };
  useEffect(() => {
    $$(props.jumpCursorToEnd) && setTimeout(() => cursorToEnd($$(numberInputRef)), 0);
  });
  const handleInputBlur = (e) => {
    var _a;
    if (!e.target.value) placeholder($$(props.placeholder));
    (_a = props.onBlur) == null ? void 0 : _a.call(props, e, getCountryData($$(selectedCountry)));
  };
  const handleInputCopy = (e) => {
    if (!$$(props.copyNumbersOnly)) return;
    const text = window.getSelection().toString().replace(/[^0-9]+/g, "");
    e.clipboardData.setData("text/plain", text);
    e.preventDefault();
  };
  const getHighlightCountryIndex = (direction) => {
    const highlightCountryIndex_ = $$(highlightCountryIndex) + direction;
    if (highlightCountryIndex_ < 0 || highlightCountryIndex_ >= $$(onlyCountries).length + $$(preferredCountries).length) {
      return highlightCountryIndex_ - direction;
    }
    if ($$(props.enableSearch) && highlightCountryIndex_ > getSearchFilteredCountries().length) return 0;
    return highlightCountryIndex_;
  };
  useEffect(() => {
    scrollTo(getElement($$(highlightCountryIndex)), $$(props.enableSearch), dropdownRef, true);
  });
  const handleKeydown = (e) => {
    const { target: { className } } = e;
    if (className.includes("selected-flag") && e.which === keys.ENTER && !$$(showDropdown)) return handleFlagDropdownClick(e);
    if (className.includes("form-control") && (e.which === keys.ENTER || e.which === keys.ESC)) return e.target.blur();
    if (!$$(showDropdown) || $$(props.disabled)) return;
    if (className.includes("search-box")) {
      if (e.which !== keys.UP && e.which !== keys.DOWN && e.which !== keys.ENTER) {
        if (e.which === keys.ESC && e.target.value === "") ;
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
        if ($$(props.enableSearch)) {
          handleFlagItemClick(getSearchFilteredCountries()[$$(highlightCountryIndex)] || getSearchFilteredCountries()[0]);
        } else {
          handleFlagItemClick([...$$(preferredCountries), ...$$(onlyCountries)][$$(highlightCountryIndex)]);
        }
        break;
      case keys.ESC:
      case keys.TAB:
        showDropdown(false);
        cursorToEnd($$(numberInputRef));
        break;
      default:
        if (e.which >= keys.A && e.which <= keys.Z || e.which === keys.SPACE) {
          queryString($$(queryString) + String.fromCharCode(e.which));
          $$(debouncedQueryStingSearcher);
        }
    }
  };
  const handleInputKeyDown = (e) => {
    if (e.which === keys.ENTER) onEnterKeyPress == null ? void 0 : onEnterKeyPress(e);
    onKeyDown == null ? void 0 : onKeyDown(e);
  };
  const handleClickOutside = (e) => {
    if ($$(dropdownRef) && !$$(dropdownContainerRef).contains(e.target)) {
      $$(showDropdown) && showDropdown(false);
    }
  };
  useEffect(() => {
    var _a;
    if (document.addEventListener && $$(props.enableClickOutside)) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    (_a = props.onMount) == null ? void 0 : _a.call(props, $$(formattedNumber).replace(/[^0-9]+/g, ""), getCountryData($$(selectedCountry)), $$(formattedNumber));
    return () => {
      if (document.removeEventListener && $$(props.enableClickOutside)) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  });
  useEffect(() => {
    updateCountry($$(props.country));
  });
  useEffect(() => {
    updateFormattedNumber(props.value);
  });
  const handleSearchChange = (e) => {
    const { currentTarget: { value: searchValue2 } } = e;
    let highlightCountryIndex_ = 0;
    if (searchValue2 === "" && $$(selectedCountry)) {
      highlightCountryIndex_ = concatPreferredCountries($$(preferredCountries), $$(onlyCountries)).findIndex((o) => o == $$(selectedCountry));
      setTimeout(() => scrollTo(getElement(highlightCountryIndex_), $$(props.enableSearch), dropdownRef), 100);
    }
    highlightCountryIndex(highlightCountryIndex_);
  };
  const getSearchFilteredCountries = () => {
    const allCountries = concatPreferredCountries($$(preferredCountries), $$(onlyCountries));
    const sanitizedSearchValue = $$(searchValue).trim().toLowerCase().replace("+", "");
    if ($$(enableSearch) && sanitizedSearchValue) {
      if (/^\d+$/.test(sanitizedSearchValue)) {
        return allCountries.filter(({ dialCode: dialCode2 }) => [`${dialCode2}`].some((field) => field.toLowerCase().includes(sanitizedSearchValue)));
      } else {
        const iso2countries = allCountries.filter(({ iso2 }) => [`${iso2}`].some((field) => field.toLowerCase().includes(sanitizedSearchValue)));
        const searchedCountries = allCountries.filter(({ name, localName, iso2 }) => [`${name}`, `${localName || ""}`].some((field) => field.toLowerCase().includes(sanitizedSearchValue)));
        scrollToTop($$(dropdownRef));
        return [...new Set([].concat(iso2countries, searchedCountries))];
      }
    } else {
      return allCountries;
    }
  };
  const getCountryDropdownList = () => {
    const searchedCountries = getSearchFilteredCountries();
    let countryDropdownList = searchedCountries.map((country2, index) => {
      const highlight = $$(highlightCountryIndex) === index;
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
      return /* @__PURE__ */ jsxs(
        "li",
        {
          ref: (el) => THIS[`flag_no_${index}`] = el,
          "data-flag-key": `flag_no_${index}`,
          class: itemClasses,
          "data-dial-code": "1",
          tabIndex: () => $$(disableDropdown) ? -1 : 0,
          "data-country-code": country2.iso2,
          onClick: (e) => handleFlagItemClick(country2),
          role: "option",
          ...highlight ? { "aria-selected": true } : {},
          children: [
            /* @__PURE__ */ jsx("div", { class: inputFlagClasses2 }),
            /* @__PURE__ */ jsx("span", { class: "country-name mr-1.5", children: getDropdownCountryName(country2) }),
            /* @__PURE__ */ jsx("span", { class: "dial-code text-[#6b6b6b]", children: country2.format ? formatNumber(country2.dialCode, country2) : $$(prefix) + country2.dialCode })
          ]
        },
        `flag_no_${index}`
      );
    });
    const dashedLi = /* @__PURE__ */ jsx("li", { class: "divider mb-[5px] pb-[5px] border-b-[#ccc] border-b border-solid" }, "dashes");
    $$(preferredCountries).length > 0 && (!$$(enableSearch) || $$(enableSearch) && !$$(searchValue).trim()) && countryDropdownList.splice($$(preferredCountries).length, 0, dashedLi);
    const dropDownClasses = [
      {
        "country-list": true,
        "hide hidden": () => !$$(showDropdown)
      },
      props.dropdownClass,
      `z-[1] absolute shadow-[1px_2px_18px_rgba(0,0,0,0.25)] bg-[white] w-[300px] max-h-[220px] overflow-y-scroll -ml-px mr-0 mt-0 mb-2.5 p-0 rounded-[7px]
  [outline:none] list-none`
    ];
    return /* @__PURE__ */ jsxs(
      "ul",
      {
        ref: (el) => {
          !$$(enableSearch) && el && el.focus();
          return dropdownRef(el);
        },
        class: dropDownClasses,
        style: props.dropdownStyle,
        role: "listbox",
        tabIndex: 0,
        children: [
          () => $$(enableSearch) && /* @__PURE__ */ jsxs(
            "li",
            {
              class: [
                {
                  search: true
                },
                searchClass,
                "z-[2] sticky bg-white pl-2.5 pr-0 pt-2.5 pb-1.5 top-0"
              ],
              children: [
                !$$(disableSearchIcon) && /* @__PURE__ */ jsx(
                  "span",
                  {
                    class: [
                      {
                        "search-emoji": true,
                        [`${() => $$(searchClass)}-emoji`]: !!$$(searchClass)
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
                    class: [
                      {
                        "search-box": true,
                        [`${() => $$(searchClass)}-box`]: !!$$(searchClass)
                      },
                      "border text-[15px] leading-[15px] ml-1.5 pt-[3px] pb-[5px] px-2 rounded-[3px] border-solid border-[#cacaca] hover:border-[#505050]"
                    ],
                    style: searchStyle,
                    type: "search",
                    placeholder: searchPlaceholder,
                    autoFocus: true,
                    autoComplete: () => $$(autocompleteSearch) ? "on" : "off",
                    value: searchValue,
                    onChange: handleSearchChange
                  }
                )
              ]
            }
          ),
          countryDropdownList.length > 0 ? countryDropdownList : /* @__PURE__ */ jsx("li", { class: "no-entries-message opacity-70 pt-[7px] pb-[11px] px-2.5", children: /* @__PURE__ */ jsx("span", { children: searchNotFound }) })
        ]
      }
    );
  };
  const isValidValue = $();
  const errorMessage = $();
  useEffect(() => {
    if (isObservable(isValid)) {
      isValidValue($$(isValid));
    } else if (typeof isValid === "function") {
      const isValidProcessed = isValid($$(formattedNumber).replace(/\D/g, ""), $$(selectedCountry), $$(onlyCountries), $$(hiddenAreaCodes));
      if (typeof isValidProcessed === "boolean") {
        isValidValue(isValidProcessed);
        if ($$(isValidValue) === false) errorMessage($$(defaultErrorMessage));
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
      'invalid-number border border-solid border-[#f44336] focus:shadow-[0_0_0_1px_#f44336] [&+div]:before:content-["Error"] [&+div]:before:hidden [&+div]:before:text-[#f44336] [&+div]:before:w-[27px]': () => !$$(isValidValue),
      "open": $$(showDropdown),
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
      "open": $$(showDropdown)
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
      "open z-[2]": $$(showDropdown)
    },
    props.buttonClass
  ];
  const inputFlagClasses = ["flag w-[25px] h-5 bg-no-repeat", () => {
    var _a;
    return flag[(_a = $$(selectedCountry)) == null ? void 0 : _a.iso2];
  }];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      class: [containerClasses, props.className],
      style: props.style || props.containerStyle,
      onKeyDown: handleKeydown,
      children: [
        () => $$(specialLabel) && /* @__PURE__ */ jsx("div", { class: "special-label absolute z-[1] top-[-7px] block bg-[white] text-[13px] whitespace-nowrap px-[5px] py-0 left-[25px]", children: specialLabel }),
        () => $$(errorMessage) && /* @__PURE__ */ jsx("div", { class: "invalid-number-message absolute z-[1] text-[13px] top-[-7px] bg-white text-[#de0000] px-[5px] py-0 left-[25px]", children: errorMessage }),
        /* @__PURE__ */ jsx(
          "input",
          {
            class: inputClasses,
            style: props.inputStyle,
            onChange: handleInput,
            onClick: handleInputClick,
            onDblClick: handleDoubleClick,
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
        /* @__PURE__ */ jsxs(
          "div",
          {
            class: [
              flagViewClasses,
              "[&:disabled+.flag-dropdown:hover]:cursor-default [&:disabled+.flag-dropdown:hover]:border-[#CACACA]",
              "[&:disabled+.flag-dropdown:hover.selected-flag]:bg-transparent"
            ],
            style: props.buttonStyle,
            ref: dropdownContainerRef,
            children: [
              () => $$(renderStringAsFlag) ? /* @__PURE__ */ jsx("div", { class: selectedFlagClasses, children: renderStringAsFlag }) : /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => $$(disableDropdown) ? void 0 : handleFlagDropdownClick,
                  class: [selectedFlagClasses],
                  title: () => $$(selectedCountry) ? `${$$(selectedCountry).localName || $$(selectedCountry).name}: + ${$$(selectedCountry).dialCode}` : "",
                  tabIndex: () => $$(disableDropdown) ? -1 : 0,
                  role: "button",
                  "aria-haspopup": "listbox",
                  "aria-expanded": () => $$(showDropdown) ? true : void 0,
                  children: /* @__PURE__ */ jsx("div", { class: inputFlagClasses, children: !$$(disableDropdown) && /* @__PURE__ */ jsx("div", { class: arrowClasses }) })
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
export {
  PhoneInput
};
//# sourceMappingURL=index.es.js.map
