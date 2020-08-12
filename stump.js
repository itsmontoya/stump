// Stump core
export function stump(targetID, view, state = {}, dispatchers = []) {
	const target = document.getElementById(targetID);
	update(dispatch, target, view(state), undefined, 0);
	dispatchers.forEach(dispatcher => dispatcher.ondispatch(dispatch));

	function dispatch(fn) {
		state = fn(state);
		update(dispatch, target, view(state), target.children[0]);
	}
}

// Shortcut aliases for basic types
export const c = opts => new Component(opts);
export const dispatcher = fn => ({ ondispatch: fn });
export const event = fn => ({ onevent: fn });
export const action = fn => dispatcher(dispatch => dispatch(fn));

// Helper types
const eventFn = (dispatch, fn) => evt => fn(evt, dispatch);

// Base types
function Component({ type, children = [], options = {} }) {
	this.type = type;
	this.children = children;
	this.options = options;
}

function Dispatcher(dispatch) {
	this.fn = dispatch;
}

// Funcs
function create(dispatch, component) {
	if (typeof component === 'string') {
		return document.createTextNode(component);
	}

	const n = document.createElement(component.type);
	createChildren(dispatch, component.children, n);
	setOptions(dispatch, n, component.options);
	return n;
}

function createChildren(dispatch, children, n) {
	if (!children) {
		return;
	}

	children
		.map(child => create(dispatch, child))
		.forEach(n.appendChild.bind(n));
}

function setOptions(dispatch, n, options) {
	for (let key in options) {
		n[getOptionKey(key)] = getOption(dispatch, options, key);
	}
}

function getOptionKey(key) {
	switch (key) {
		case "class":
			return "className";
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

	if (key.substr(0, 2) === "on") {
		return getEventValue(dispatch, val);
	}

	return val;
}

function getStyleValue(obj) {
	var arr = [];
	for (let key in obj) {
		arr.push(`${key}: ${obj[key]};`)
	}

	return arr.join(" ");
}

function getEventValue(dispatch, val) {
	if (!isEvent(val)) {
		return val;
	}

	const fn = val.onevent;
	return eventFn(dispatch, fn);
}

function update(dispatch, parent, newNode, oldNode, index = 0) {
	if (!oldNode) {
		parent.appendChild(create(dispatch, newNode));
		return;
	}

	if (!newNode) {
		parent.removeChild(getChild(parent, index));
		return;
	}

	if (hasNodeChanged(newNode, oldNode)) {
		parent.replaceChild(create(dispatch, newNode), getChild(parent, index));
		return;
	}

	updateChildren(dispatch, parent, newNode, oldNode)
}

function updateChildren(parent, a, b) {
	if (!a.type) {
		return;
	}

	const iteratingLength = getIteratingLength(a, b);
	for (let i = 0; i < iteratingLength; i++) {
		updateChild(parent, a, b, i);
	}
}

function updateChild(dispatch, parent, a, b, i) {
	const pc = getChild(parent, i);
	const ac = getChild(a, i);
	const bc = getChild(b, i);
	update(dispatch, pc, ac, bc);
}

function getChild(parent, index) {
	return parent.childNodes[index]
}

function hasNodeChanged(a, b) {
	if (hasTypeofChanged(a, b)) {
		return true;
	}

	if (hasTypeChanged(a, b)) {
		return true;
	}

	return hasValueChanged(a, b);
}

function hasTypeofChanged(a, b) {
	return typeof a !== typeof b;
}

function hasTypeChanged(a, b) {
	return a.type !== b.type;
}

function hasValueChanged(a, b) {
	return typeof a === "string" && a !== b;
}

function getIteratingLength(a, b) {
	const newLength = a.children.length;
	const oldLength = b.children.length;
	return newLength > oldLength ? newLength : oldLength;
}



function isEvent(val) {
	if (typeof val !== "object") {
		return false;
	}

	return val.onevent === "function"
}


function isDispatcher(val) {
	if (typeof val !== "object") {
		return false;
	}

	return val.ondispatch === "function"
}
