// Stump core
export function stump(opts: options) {
	const target = document.getElementById(opts.targetID);
	target.innerHTML = "";

	let state = { ...opts.state };

	update(dispatch, target, opts.view(opts.state), undefined, 0);
	opts.dispatchers.forEach(dispatcher =>
		launchDispatcher(dispatch, dispatcher));

	function dispatch(fn: response) {
		state = fn(state);
		update(dispatch, target, opts.view(state), target.children[0]);
	}
}

type options = {
	targetID: string,
	view: view,
	state: state,
	dispatchers: [],
};

type view = (state: state) => component;

type state = {};

interface dispatcher {
	ondispatch: ondispatch,
}

type component = {
	type: string,
	children: (component | string)[],
	options: {},
};

type element = Element | ChildNode;

type child = component | string;

type ondispatch = (dispatch: dispatch) => void;

type dispatch = (fn: response) => void;

type response = (state: state) => state;

type event = (evt: Event, dispatch: dispatch) => void;

type action = (evt: Event, state: state) => state;

type stringobj = { [key: string]: string; };

type anyobj = { [key: string]: any; };

type maybecomponent = component | string | undefined;

type maybechild = child | undefined;

type maybeelement = element | undefined;

function launchDispatcher(dispatch: dispatch, dispatcher: dispatcher) {
	if (!isDispatcher(dispatcher)) {
		// Provided dispatcher is not the proper type, throw error
		throw (`invalid type, expected dispatcher and received ${dispatcher}`);
	}

	// Pass dispatch to dispacher's ondispatch func
	dispatcher.ondispatch(dispatch);
}

// Shortcut aliases for basic types
export const c = (opts: component) => ({
	type: opts.type,
	children: opts.children,
	options: opts.options
});

// dispatcher is the backbone of the state updating process
export const dispatcher = (fn: ondispatch): dispatcher =>
	({ ondispatch: fn });

// response is a shorthand alias for dispatchers who want to instantly update state
export const response = (fn: response) =>
	dispatcher(dispatch => dispatch(fn));

// action is a shorthand alias for events who want to instantly update state
export const action = (fn: action) =>
	(event: Event, dispatch: dispatch) =>
		dispatch(state =>
			fn(event, state));

// Helper types
const eventFn = (dispatch: dispatch, fn: event) =>
	(evt: Event) =>
		fn(evt, dispatch);

// Funcs
function create(dispatch: dispatch, component: component | string): Element | Text {
	if (typeof component === 'string') {
		// Component is type of string, create text node
		return document.createTextNode(component);
	}

	const node = document.createElement(component.type);
	createChildren(dispatch, node, component.children);
	setOptions(dispatch, node, component.options);
	return node;
}

function createChildren(dispatch: dispatch, node: Element, children: (component | string)[]) {
	if (!children) {
		return;
	}

	children
		.map(child => create(dispatch, child))
		.forEach(node.appendChild.bind(node));
}

function setOptions(dispatch: dispatch, node: Element, options: {}) {
	for (let key in options) {
		const optKey = getOptionKey(key)
		const optValue = getOption(dispatch, options, key);
		node.setAttribute(optKey, optValue);
	}
}

function getOptionKey(key: string): string {
	switch (key) {
		case "class":
			return "className";
		case "contenteditable":
			return "contentEditable";

		default:
			return key;
	}
}

function getOption(dispatch: dispatch, options: anyobj, key: string): string | any {
	const val = options[key];
	if (key === "style") {
		return getStyleValue(val);
	}

	if (key.substr(0, 2) === "on") {
		return getEventValue(dispatch, val);
	}

	return val;
}

function getStyleValue(obj: stringobj) {
	var arr = [];
	for (let key in obj) {
		arr.push(`${key}: ${obj[key]};`)
	}

	return arr.join(" ");
}

function getEventValue(dispatch: dispatch, val: any) {
	if (!isEvent(val)) {
		return val;
	}

	const fn = val.onevent;
	return eventFn(dispatch, fn);
}

function update(dispatch: dispatch, parent: element, newNode: maybechild, oldNode: maybeelement, index: number = 0) {
	if (!oldNode) {
		const created = create(dispatch, newNode);
		parent.appendChild(created);
		return;
	}

	if (!newNode) {
		parent.removeChild(getChildNode(parent, index));
		return;
	}

	if (hasNodeChanged(newNode, oldNode)) {
		console.log("Swapping!")
		const created = create(dispatch, newNode);
		parent.replaceChild(created, getChildNode(parent, index));
		return;
	}

	updateChildren(dispatch, <child>newNode, <element>oldNode)
}

function updateChildren(dispatch: dispatch, a: child, b: element) {
	if (typeof a === "string") {
		return;
	}

	const iteratingLength = getIteratingLength(a, b);
	for (let i = iteratingLength - 1; i > -1; i--) {
		updateChild(dispatch, a, b, i);
	}
}

function updateChild(dispatch: dispatch, a: component, b: element, i: number) {
	const ac = getChild(a, i);
	const bc = getChildNode(b, i);
	update(dispatch, b, ac, bc, i);
}

function getChild(parent: component, index: number) {
	return parent.children[index]
}

function getChildNode(parent: element, index: number): ChildNode {
	return parent.childNodes[index]
}

function hasNodeChanged(a: child, b: element) {
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

function hasTypeofChanged(a: component, b: element) {
	return typeof a !== typeof b;
}

function hasTypeChanged(a: component, b: element) {
	return a.type !== getTagName(b);
}

function hasValueChanged(a: child, b: element) {
	return a !== b.nodeValue;
}

function getIteratingLength(a: component, b: element) {
	const newLength = a.children.length;
	const oldLength = b.childNodes.length;
	return newLength > oldLength ? newLength : oldLength;
}

function getTagName(node: maybeelement) {
	if (!node) {
		return "";
	}

	node = <element>node;
	const e = <Element>node;

	if (!e.tagName) {
		return "";
	}

	return e.tagName.toLowerCase();
}

function isEvent(val: any) {
	if (typeof val !== "object") {
		return false;
	}

	return typeof val.onevent === "function"
}

function isDispatcher(val: any) {
	if (typeof val !== "object") {
		return false;
	}

	return typeof val.ondispatch === "function"
}
