/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./stump.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./stump.ts":
/*!******************!*\
  !*** ./stump.ts ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.action = exports.response = exports.c = exports.stump = void 0;\n// Stump core\nfunction stump(opts) {\n    const target = document.getElementById(opts.targetID);\n    target.innerHTML = \"\";\n    let state = Object.assign({}, opts.state);\n    update(dispatch, target, opts.view(opts.state), undefined, 0);\n    opts.dispatchers\n        .forEach(dispatcher => \n    // Pass dispatch to dispacher's ondispatch func\n    dispatcher(dispatch));\n    function dispatch(fn) {\n        state = fn(state);\n        update(dispatch, target, opts.view(state), target.children[0]);\n    }\n}\nexports.stump = stump;\n;\n// Shortcut aliases for basic types\nexports.c = (c) => ({\n    type: c.type,\n    children: c.children || [],\n    options: c.options || {},\n});\n// response is a shorthand alias for dispatchers who want to instantly update state\nexports.response = (fn) => (dispatch) => dispatch(fn);\n// action is a shorthand alias for events who want to instantly update state\nexports.action = (fn) => (event, dispatch) => dispatch(state => fn(event, state));\n// Helper types\nconst eventFn = (dispatch, fn) => (evt) => fn(evt, dispatch);\n// Funcs\nfunction create(dispatch, component) {\n    if (typeof component === 'string') {\n        // Component is type of string, create text node\n        return document.createTextNode(component);\n    }\n    const node = document.createElement(component.type);\n    createChildren(dispatch, node, component.children);\n    setOptions(dispatch, node, component.options);\n    return node;\n}\nfunction createChildren(dispatch, node, children) {\n    if (!children) {\n        return;\n    }\n    children\n        .map(child => create(dispatch, child))\n        .forEach(node.appendChild.bind(node));\n}\nfunction update(dispatch, parent, child, element, index = 0) {\n    if (!element) {\n        const created = create(dispatch, child);\n        parent.appendChild(created);\n        return;\n    }\n    if (!child) {\n        parent.removeChild(getChildNode(parent, index));\n        return;\n    }\n    if (hasNodeChanged(child, element)) {\n        const created = create(dispatch, child);\n        parent.replaceChild(created, getChildNode(parent, index));\n        return;\n    }\n    updateChildren(dispatch, child, element);\n    updateElement(dispatch, child, element);\n}\nfunction updateElement(dispatch, child, node) {\n    if (typeof child === \"string\") {\n        return;\n    }\n    const c = child;\n    clearAttributes(node, c.options);\n    clearFunctions(node);\n    setOptions(dispatch, node, c.options);\n}\nfunction updateChildren(dispatch, a, b) {\n    if (typeof a === \"string\") {\n        return;\n    }\n    const newLength = a.children.length;\n    const oldLength = b.childNodes.length;\n    if (newLength > oldLength) {\n        updateForward(dispatch, a, b, newLength);\n    }\n    else {\n        updateBackward(dispatch, a, b, oldLength);\n    }\n}\nfunction updateChild(dispatch, a, b, i) {\n    const ac = getChild(a, i);\n    const bc = getChildNode(b, i);\n    update(dispatch, b, ac, bc, i);\n}\nfunction updateForward(dispatch, a, b, end) {\n    for (let i = 0; i < end; i++) {\n        updateChild(dispatch, a, b, i);\n    }\n}\nfunction updateBackward(dispatch, a, b, end) {\n    for (let i = end - 1; i > -1; i--) {\n        updateChild(dispatch, a, b, i);\n    }\n}\nfunction setOptions(dispatch, node, options) {\n    for (let key in options) {\n        setOption(dispatch, node, options, key);\n    }\n}\nfunction setOption(dispatch, node, options, key) {\n    const optKey = getOptionKey(key);\n    const optValue = getOption(dispatch, options, key);\n    if (isEventKey(key)) {\n        setEventFunction(node, key, optValue);\n    }\n    else {\n        node.setAttribute(optKey, optValue);\n    }\n}\nfunction setEventFunction(e, key, fn) {\n    const c = e;\n    c[key] = fn;\n    if (c[\"__stumpFns\"] === undefined) {\n        c[\"__stumpFns\"] = [];\n    }\n    c[\"__stumpFns\"].push(key);\n}\nfunction getChild(parent, index) {\n    return parent.children[index];\n}\nfunction getChildNode(parent, index) {\n    return parent.childNodes[index];\n}\nfunction getTagName(node) {\n    if (!node) {\n        return \"\";\n    }\n    node = node;\n    const e = node;\n    if (!e.tagName) {\n        return \"\";\n    }\n    return e.tagName.toLowerCase();\n}\nfunction getOptionKey(key) {\n    switch (key) {\n        case \"contenteditable\":\n            return \"contentEditable\";\n        default:\n            return key;\n    }\n}\nfunction getOption(dispatch, options, key) {\n    const val = options[key];\n    if (key === \"style\") {\n        return getStyleValue(val);\n    }\n    if (isEventKey(key)) {\n        const evt = val;\n        return eventFn(dispatch, evt);\n    }\n    return val;\n}\nfunction getStyleValue(obj) {\n    var arr = [];\n    for (let key in obj) {\n        arr.push(`${key}: ${obj[key]};`);\n    }\n    return arr.join(\" \");\n}\nfunction hasNodeChanged(a, b) {\n    if (typeof a === \"string\") {\n        return hasValueChanged(a, b);\n    }\n    if (hasTypeofChanged(a, b)) {\n        return true;\n    }\n    if (hasTypeChanged(a, b)) {\n        return true;\n    }\n    return false;\n}\nfunction hasTypeofChanged(a, b) {\n    return typeof a !== typeof b;\n}\nfunction hasTypeChanged(a, b) {\n    return a.type !== getTagName(b);\n}\nfunction hasValueChanged(a, b) {\n    return a !== b.nodeValue;\n}\nfunction isEventKey(key) {\n    return key.substr(0, 2) === \"on\";\n}\nfunction clearAttributes(node, options) {\n    const nodeAttr = node.attributes;\n    for (let i = 0; i < node.attributes.length; i++) {\n        clearAttribute(node, options, i);\n    }\n}\nfunction clearAttribute(node, options, i) {\n    const attr = node.attributes[i];\n    const key = attr.name;\n    if (options[key]) {\n        // Option still exists, return\n        return;\n    }\n    // Option doesn't exist anymore, remove\n    node.removeAttribute(key);\n}\nfunction clearFunctions(node) {\n    const c = node;\n    if (!c.__stumpFns) {\n        return;\n    }\n    while (c.__stumpFns.length) {\n        let key = c.__stumpFns.pop();\n        c[key] = undefined;\n    }\n}\n\n\n//# sourceURL=webpack:///./stump.ts?");

/***/ })

/******/ });