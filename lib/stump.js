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
eval("\nvar __assign = (this && this.__assign) || function () {\n    __assign = Object.assign || function(t) {\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\n            s = arguments[i];\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\n                t[p] = s[p];\n        }\n        return t;\n    };\n    return __assign.apply(this, arguments);\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nexports.action = exports.response = exports.dispatcher = exports.c = exports.stump = void 0;\n// Stump core\nfunction stump(opts) {\n    var target = document.getElementById(opts.targetID);\n    target.innerHTML = \"\";\n    var state = __assign({}, opts.state);\n    update(dispatch, target, opts.view(opts.state), undefined, 0);\n    opts.dispatchers.forEach(function (dispatcher) {\n        return launchDispatcher(dispatch, dispatcher);\n    });\n    function dispatch(fn) {\n        state = fn(state);\n        update(dispatch, target, opts.view(state), target.children[0]);\n    }\n}\nexports.stump = stump;\nfunction launchDispatcher(dispatch, dispatcher) {\n    if (!isDispatcher(dispatcher)) {\n        // Provided dispatcher is not the proper type, throw error\n        throw (\"invalid type, expected dispatcher and received \" + dispatcher);\n    }\n    // Pass dispatch to dispacher's ondispatch func\n    dispatcher.ondispatch(dispatch);\n}\n// Shortcut aliases for basic types\nexports.c = function (opts) { return ({\n    type: opts.type,\n    children: opts.children,\n    options: opts.options\n}); };\n// dispatcher is the backbone of the state updating process\nexports.dispatcher = function (fn) {\n    return ({ ondispatch: fn });\n};\n// response is a shorthand alias for dispatchers who want to instantly update state\nexports.response = function (fn) {\n    return exports.dispatcher(function (dispatch) { return dispatch(fn); });\n};\n// action is a shorthand alias for events who want to instantly update state\nexports.action = function (fn) {\n    return function (event, dispatch) {\n        return dispatch(function (state) {\n            return fn(event, state);\n        });\n    };\n};\n// Helper types\nvar eventFn = function (dispatch, fn) {\n    return function (evt) {\n        return fn(evt, dispatch);\n    };\n};\n// Funcs\nfunction create(dispatch, component) {\n    if (typeof component === 'string') {\n        // Component is type of string, create text node\n        return document.createTextNode(component);\n    }\n    var node = document.createElement(component.type);\n    createChildren(dispatch, node, component.children);\n    setOptions(dispatch, node, component.options);\n    return node;\n}\nfunction createChildren(dispatch, node, children) {\n    if (!children) {\n        return;\n    }\n    children\n        .map(function (child) { return create(dispatch, child); })\n        .forEach(node.appendChild.bind(node));\n}\nfunction setOptions(dispatch, node, options) {\n    for (var key in options) {\n        var optKey = getOptionKey(key);\n        var optValue = getOption(dispatch, options, key);\n        node.setAttribute(optKey, optValue);\n    }\n}\nfunction getOptionKey(key) {\n    switch (key) {\n        case \"class\":\n            return \"className\";\n        case \"contenteditable\":\n            return \"contentEditable\";\n        default:\n            return key;\n    }\n}\nfunction getOption(dispatch, options, key) {\n    var val = options[key];\n    if (key === \"style\") {\n        return getStyleValue(val);\n    }\n    if (key.substr(0, 2) === \"on\") {\n        return getEventValue(dispatch, val);\n    }\n    return val;\n}\nfunction getStyleValue(obj) {\n    var arr = [];\n    for (var key in obj) {\n        arr.push(key + \": \" + obj[key] + \";\");\n    }\n    return arr.join(\" \");\n}\nfunction getEventValue(dispatch, val) {\n    if (!isEvent(val)) {\n        return val;\n    }\n    var fn = val.onevent;\n    return eventFn(dispatch, fn);\n}\nfunction update(dispatch, parent, newNode, oldNode, index) {\n    if (index === void 0) { index = 0; }\n    if (!oldNode) {\n        var created = create(dispatch, newNode);\n        parent.appendChild(created);\n        return;\n    }\n    if (!newNode) {\n        parent.removeChild(getChildNode(parent, index));\n        return;\n    }\n    if (hasNodeChanged(newNode, oldNode)) {\n        console.log(\"Swapping!\");\n        var created = create(dispatch, newNode);\n        parent.replaceChild(created, getChildNode(parent, index));\n        return;\n    }\n    updateChildren(dispatch, newNode, oldNode);\n}\nfunction updateChildren(dispatch, a, b) {\n    if (typeof a === \"string\") {\n        return;\n    }\n    var iteratingLength = getIteratingLength(a, b);\n    for (var i = iteratingLength - 1; i > -1; i--) {\n        updateChild(dispatch, a, b, i);\n    }\n}\nfunction updateChild(dispatch, a, b, i) {\n    var ac = getChild(a, i);\n    var bc = getChildNode(b, i);\n    update(dispatch, b, ac, bc, i);\n}\nfunction getChild(parent, index) {\n    return parent.children[index];\n}\nfunction getChildNode(parent, index) {\n    return parent.childNodes[index];\n}\nfunction hasNodeChanged(a, b) {\n    if (typeof a === \"string\") {\n        return hasValueChanged(a, b);\n    }\n    if (hasTypeofChanged(a, b)) {\n        return true;\n    }\n    if (hasTypeChanged(a, b)) {\n        return true;\n    }\n    return false;\n}\nfunction hasTypeofChanged(a, b) {\n    return typeof a !== typeof b;\n}\nfunction hasTypeChanged(a, b) {\n    return a.type !== getTagName(b);\n}\nfunction hasValueChanged(a, b) {\n    return a !== b.nodeValue;\n}\nfunction getIteratingLength(a, b) {\n    var newLength = a.children.length;\n    var oldLength = b.childNodes.length;\n    return newLength > oldLength ? newLength : oldLength;\n}\nfunction getTagName(node) {\n    if (!node) {\n        return \"\";\n    }\n    node = node;\n    var e = node;\n    if (!e.tagName) {\n        return \"\";\n    }\n    return e.tagName.toLowerCase();\n}\nfunction isEvent(val) {\n    if (typeof val !== \"object\") {\n        return false;\n    }\n    return typeof val.onevent === \"function\";\n}\nfunction isDispatcher(val) {\n    if (typeof val !== \"object\") {\n        return false;\n    }\n    return typeof val.ondispatch === \"function\";\n}\n\n\n//# sourceURL=webpack:///./stump.ts?");

/***/ })

/******/ });