// Stump core
export function stump(opts) {
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
        if (opts.debug === true) {
            console.log("State update", state);
        }
        update(dispatch, target, opts.view(state), target.children[0]);
    }
}
;
// Shortcut aliases for basic types
export const c = (c) => ({
    type: c.type,
    children: c.children || [],
    options: c.options || {},
});
// response is a shorthand alias for dispatchers who want to instantly update state
export const response = (fn) => (dispatch) => dispatch(fn);
// action is a shorthand alias for events who want to instantly update state
export const action = (fn) => (event, dispatch) => dispatch(state => fn(event, state));
export const children = (...children) => {
    const c = new Children();
    if (!!children)
        children.forEach((child) => c.append(child));
    return c;
};
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
        .map((child) => create(dispatch, child))
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
    return !parent.children ? void 0 : parent.children[index];
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
    for (let i = 0; i < node.attributes.length; i++) {
        clearAttribute(node, options, i);
    }
    clearValue(node, options);
}
function clearValue(node, options) {
    if (!node.value) {
        return;
    }
    if (!options.value) {
        node.value = "";
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
const Children = function () { };
Children.prototype.push = Array.prototype.push;
Children.prototype.map = Array.prototype.map;
Children.prototype.length = Array.prototype.length;
// Create new append method
Children.prototype.append = function (child) {
    if (child !== null && child !== undefined) {
        this.push(child);
    }
    return this;
};
;
export const model = (keys) => ({
    get: (state, key) => getModelValue(keys, state, key),
    getSelf: (state) => getModelValue(getKeysWithoutTail(keys), state, getTailKey(keys)),
    put: (state, key, value) => putModelValue(keys, state, key, value),
    find: (state, fn) => findModelValue(keys, state, fn),
    model: (additionalKeys) => model([...keys, ...additionalKeys]),
    arrayModel: (key) => newArrayModel(model([...keys]), key)
});
const getKeysWithoutTail = (keys) => [...keys]
    .splice(keys.length - 1);
const getTailKey = (keys) => keys[keys.length - 1];
export const arrayModel = (keys) => newArrayModel(model(keys.slice(0, keys.length - 2)), keys[keys.length - 1]);
const newArrayModel = (m, key) => ({
    get: (state, index) => m.get(state, key)[index],
    getSelf: (state) => m.get(state, key),
    find: (state, fn) => m.get(state, key).find(fn),
    append: (state, value) => m.put(state, key, [...m.get(state, key), value]),
    appendIfNotExist: (state, value) => m.put(state, key, appendIfNotExist(m.get(state, key) || [], value))
});
const appendIfNotExist = (arr, value) => arr.indexOf(value) === -1
    // Value doesn't exist, spread array and include new value
    ? [...arr, value]
    // No change was made, we can return our original array
    : arr;
const getObject = (obj, keys) => {
    keys.forEach((key) => obj = obj[key]);
    return Object.assign({}, obj);
};
const putObject = (state, keys, value) => {
    let last = keys.length - 2;
    if (last === -1) {
        // Fast track for single-depth key lists
        const key = keys[0];
        return Object.assign(Object.assign({}, state), { [key]: value });
    }
    let obj = state = Object.assign({}, state);
    // Iterate through key list
    keys.forEach((key, i) => {
        if (i !== last) {
            // TODO: Determine if it's more proper to spread apply value here for safety and correctness
            obj = obj[key];
            return;
        }
        // We've reached the parent key, apply value via spread operator and insert the value for our target key
        obj[key] = Object.assign(Object.assign({}, obj[key]), { [keys[i + 1]]: value });
    });
    return state;
};
const getModelValue = (keys, state, key) => {
    const obj = getObject(state, keys);
    return obj[key];
};
const findModelValue = (keys, state, fn) => {
    const obj = getObject(state, keys);
    for (let key in obj) {
        const value = obj[key];
        if (fn(value) === true) {
            return value;
        }
        return;
    }
    return null;
};
const putModelValue = (keys, state, key, value) => {
    state = Object.assign({}, state);
    const obj = getObject(state, keys);
    obj[key] = value;
    return putObject(state, keys, obj);
};
//# sourceMappingURL=stump.js.map