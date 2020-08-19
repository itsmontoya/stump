"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.response = exports.c = exports.stump = void 0;
// Stump core
function stump(opts) {
    const target = document.getElementById(opts.targetID);
    target.innerHTML = "";
    let state = Object.assign({}, opts.state);
    update(dispatch, target, opts.view(opts.state), undefined, 0);
    opts.dispatchers
        .forEach(dispatcher => 
    // Pass dispatch to dispacher's ondispatch func
    dispatcher(dispatch));
    function dispatch(fn) {
        state = fn(state);
        update(dispatch, target, opts.view(state), target.children[0]);
    }
}
exports.stump = stump;
;
// Shortcut aliases for basic types
exports.c = (c) => ({
    type: c.type,
    children: c.children || [],
    options: c.options || {},
});
// response is a shorthand alias for dispatchers who want to instantly update state
exports.response = (fn) => (dispatch) => dispatch(fn);
// action is a shorthand alias for events who want to instantly update state
exports.action = (fn) => (event, dispatch) => dispatch(state => fn(event, state));
// Helper types
const eventFn = (dispatch, fn) => (evt) => fn(evt, dispatch);
// Funcs
function create(dispatch, component) {
    if (typeof component === 'string') {
        // Component is type of string, create text node
        return document.createTextNode(component);
    }
    const node = document.createElement(component.type);
    createChildren(dispatch, node, component.children);
    setOptions(dispatch, node, component.options);
    return node;
}
function createChildren(dispatch, node, children) {
    if (!children) {
        return;
    }
    children
        .map(child => create(dispatch, child))
        .forEach(node.appendChild.bind(node));
}
function update(dispatch, parent, child, element, index = 0) {
    if (!element) {
        const created = create(dispatch, child);
        parent.appendChild(created);
        return;
    }
    if (!child) {
        parent.removeChild(getChildNode(parent, index));
        return;
    }
    if (hasNodeChanged(child, element)) {
        const created = create(dispatch, child);
        parent.replaceChild(created, getChildNode(parent, index));
        return;
    }
    updateChildren(dispatch, child, element);
    updateElement(dispatch, child, element);
}
function updateElement(dispatch, child, node) {
    if (typeof child === "string") {
        return;
    }
    const c = child;
    clearAttributes(node, c.options);
    clearFunctions(node);
    setOptions(dispatch, node, c.options);
}
function updateChildren(dispatch, a, b) {
    if (typeof a === "string") {
        return;
    }
    const newLength = a.children.length;
    const oldLength = b.childNodes.length;
    if (newLength > oldLength) {
        updateForward(dispatch, a, b, newLength);
    }
    else {
        updateBackward(dispatch, a, b, oldLength);
    }
}
function updateChild(dispatch, a, b, i) {
    const ac = getChild(a, i);
    const bc = getChildNode(b, i);
    update(dispatch, b, ac, bc, i);
}
function updateForward(dispatch, a, b, end) {
    for (let i = 0; i < end; i++) {
        updateChild(dispatch, a, b, i);
    }
}
function updateBackward(dispatch, a, b, end) {
    for (let i = end - 1; i > -1; i--) {
        updateChild(dispatch, a, b, i);
    }
}
function setOptions(dispatch, node, options) {
    for (let key in options) {
        setOption(dispatch, node, options, key);
    }
}
function setOption(dispatch, node, options, key) {
    const optKey = getOptionKey(key);
    const optValue = getOption(dispatch, options, key);
    if (isEventKey(key)) {
        setEventFunction(node, key, optValue);
    }
    else {
        node.setAttribute(optKey, optValue);
    }
}
function setEventFunction(e, key, fn) {
    const c = e;
    c[key] = fn;
    if (c["__stumpFns"] === undefined) {
        c["__stumpFns"] = [];
    }
    c["__stumpFns"].push(key);
}
function getChild(parent, index) {
    return parent.children[index];
}
function getChildNode(parent, index) {
    return parent.childNodes[index];
}
function getTagName(node) {
    if (!node) {
        return "";
    }
    node = node;
    const e = node;
    if (!e.tagName) {
        return "";
    }
    return e.tagName.toLowerCase();
}
function getOptionKey(key) {
    switch (key) {
        case "contenteditable":
            return "contentEditable";
        default:
            return key;
    }
}
function getOption(dispatch, options, key) {
    const val = options[key];
    if (key === "style") {
        return getStyleValue(val);
    }
    if (isEventKey(key)) {
        const evt = val;
        return eventFn(dispatch, evt);
    }
    return val;
}
function getStyleValue(obj) {
    var arr = [];
    for (let key in obj) {
        arr.push(`${key}: ${obj[key]};`);
    }
    return arr.join(" ");
}
function hasNodeChanged(a, b) {
    if (typeof a === "string") {
        return hasValueChanged(a, b);
    }
    if (hasTypeofChanged(a, b)) {
        return true;
    }
    if (hasTypeChanged(a, b)) {
        return true;
    }
    return false;
}
function hasTypeofChanged(a, b) {
    return typeof a !== typeof b;
}
function hasTypeChanged(a, b) {
    return a.type !== getTagName(b);
}
function hasValueChanged(a, b) {
    return a !== b.nodeValue;
}
function isEventKey(key) {
    return key.substr(0, 2) === "on";
}
function clearAttributes(node, options) {
    const nodeAttr = node.attributes;
    for (let i = 0; i < node.attributes.length; i++) {
        clearAttribute(node, options, i);
    }
}
function clearAttribute(node, options, i) {
    const attr = node.attributes[i];
    const key = attr.name;
    if (options[key]) {
        // Option still exists, return
        return;
    }
    // Option doesn't exist anymore, remove
    node.removeAttribute(key);
}
function clearFunctions(node) {
    const c = node;
    if (!c.__stumpFns) {
        return;
    }
    while (c.__stumpFns.length) {
        let key = c.__stumpFns.pop();
        c[key] = undefined;
    }
}
//# sourceMappingURL=stump.js.map