// Stump core
export function stump(opts: options) {
	const target = document.getElementById(opts.targetID);
	target.innerHTML = "";

	let state = { ...opts.state };
	update(dispatch, target, opts.view(opts.state), undefined, 0);
	opts.dispatchers
		.forEach(dispatcher =>
			// Pass dispatch to dispacher's ondispatch func
			dispatcher(dispatch));

	function dispatch(fn: response) {
		state = fn(state);
		update(dispatch, target, opts.view(state), target.children[0]);
	}
}

export type options = {
	targetID: string,
	view: view,
	state: state,
	dispatchers: ondispatch[],
};

export type view = (state: state) => component;

export type state = { [key: string]: any };

export type component = {
	type: string,
	children?: child[],
	options?: componentOpts,
};

export interface componentOpts {
	// Derived from properties defined on MDN:
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
	[key: string]: any,

	onabort?: event,
	onanimationcancel?: event,
	onanimationend?: event,
	onanimationiteration?: event,
	onauxclick?: event,
	onblur?: event,
	oncancel?: event,
	oncanplay?: event,
	oncanplaythrough?: event,
	onchange?: event,
	onclick?: event,
	onclose?: event,
	oncontextmenu?: event,
	oncopy?: event,
	oncuechange?: event,
	oncut?: event,
	ondblclick?: event,
	ondurationchange?: event,
	onended?: event,
	onerror?: event,
	onfocus?: event,
	onformdata?: event,
	ongotpointercapture?: event,
	oninput?: event,
	oninvalid?: event,
	onkeydown?: event,
	onkeypress?: event,
	onkeyup?: event,
	onload?: event,
	onloadeddata?: event,
	onloadedmetadata?: event,
	onloadend?: event,
	onloadstart?: event,
	onlostpointercapture?: event,
	onmousedown?: event,
	onmouseenter?: event,
	onmouseleave?: event,
	onmousemove?: event,
	onmouseout?: event,
	onmouseover?: event,
	onmouseup?: event,
	onpaste?: event,
	onpause?: event,
	onplay?: event,
	onplaying?: event,
	onpointercancel?: event,
	onpointerdown?: event,
	onpointerenter?: event,
	onpointerleave?: event,
	onpointermove?: event,
	onpointerout?: event,
	onpointerover?: event,
	onpointerup?: event,
	onreset?: event,
	onresize?: event,
	onscroll?: event,
	onselect?: event,
	onselectionchange?: event,
	onselectstart?: event,
	onsubmit?: event,
	ontouchcancel?: event,
	ontouchstart?: event,
	ontransitioncancel?: event,
	ontransitionend?: event,
	onwheel?: event,
};

export type ondispatch = (dispatch: dispatch) => void;

export type dispatch = (fn: response) => void;

export type response = (state: state) => state;

export type eventValue = (Event | any);

export type event = (evt: eventValue, dispatch: dispatch) => void;

export type action = (evt: eventValue, state: state) => state;

export type element = Element | ChildNode;

export type maybeelement = element | undefined;

export type child = component | string;

export type maybechild = child | undefined;

type stringobj = { [key: string]: string; };

// Shortcut aliases for basic types
export const c = (c: component) => ({
	type: c.type,
	children: c.children || [],
	options: c.options || {},
});

// response is a shorthand alias for dispatchers who want to instantly update state
export const response = (fn: response) =>
	(dispatch: dispatch) => dispatch(fn);

// action is a shorthand alias for events who want to instantly update state
export const action = (fn: action) =>
	(event: Event, dispatch: dispatch) =>
		dispatch(state =>
			fn(event, state));

// Helper types
const eventFn = (dispatch: dispatch, fn: event) =>
	(evt: Event) => fn(evt, dispatch);

// Funcs
function create(dispatch: dispatch, component: child): Element | Text {
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

function update(dispatch: dispatch, parent: element, child: maybechild, element: maybeelement, index: number = 0) {
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

	updateChildren(dispatch, <child>child, <Element>element);
	updateElement(dispatch, <child>child, <Element>element);
}

function updateElement(dispatch: dispatch, child: child, node: Element) {
	if (typeof child === "string") {
		return;
	}

	const c = <component>child;
	clearAttributes(node, c.options);
	clearFunctions(node);
	setOptions(dispatch, node, c.options);
}

function updateChildren(dispatch: dispatch, a: child, b: element) {
	if (typeof a === "string") {
		return;
	}

	const newLength = a.children.length;
	const oldLength = b.childNodes.length;
	if (newLength > oldLength) {
		updateForward(dispatch, a, b, newLength);
	} else {
		updateBackward(dispatch, a, b, oldLength);
	}
}

function updateChild(dispatch: dispatch, a: component, b: element, i: number) {
	const ac = getChild(a, i);
	const bc = getChildNode(b, i);
	update(dispatch, b, ac, bc, i);
}

function updateForward(dispatch: dispatch, a: component, b: element, end: number) {
	for (let i = 0; i < end; i++) {
		updateChild(dispatch, a, b, i);
	}
}

function updateBackward(dispatch: dispatch, a: component, b: element, end: number) {
	for (let i = end - 1; i > -1; i--) {
		updateChild(dispatch, a, b, i);
	}
}


function setOptions(dispatch: dispatch, node: Element, options: componentOpts) {
	for (let key in options) {
		setOption(dispatch, node, options, key);
	}
}

function setOption(dispatch: dispatch, node: Element, options: componentOpts, key: string) {
	const optKey = getOptionKey(key)
	const optValue = getOption(dispatch, options, key);
	if (isEventKey(key)) {
		setEventFunction(node, key, optValue);
	} else {
		node.setAttribute(optKey, optValue);
	}
}

function setEventFunction(e: Element, key: string, fn: (evt: Event) => void) {
	const c = (<componentOpts>e);
	c[key] = fn;

	if (c["__stumpFns"] === undefined) {
		c["__stumpFns"] = [];
	}

	c["__stumpFns"].push(key);
}

function getChild(parent: component, index: number) {
	return parent.children[index]
}

function getChildNode(parent: element, index: number): ChildNode {
	return parent.childNodes[index]
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

function getOptionKey(key: string): string {
	switch (key) {
		case "contenteditable":
			return "contentEditable";

		default:
			return key;
	}
}

function getOption(dispatch: dispatch, options: componentOpts, key: string): string | any {
	const val = options[key];
	if (key === "style") {
		return getStyleValue(val);
	}

	if (isEventKey(key)) {
		const evt = <event>val;
		return eventFn(dispatch, evt);
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

function isEventKey(key: string): boolean {
	return key.substr(0, 2) === "on"
}

function clearAttributes(node: Element, options: componentOpts): void {
	const nodeAttr = node.attributes;
	for (let i = 0; i < node.attributes.length; i++) {
		clearAttribute(node, options, i);
	}
}

function clearAttribute(node: Element, options: componentOpts, i: number): void {
	const attr = node.attributes[i];
	const key = attr.name;
	if (options[key]) {
		// Option still exists, return
		return;
	}

	// Option doesn't exist anymore, remove
	node.removeAttribute(key);
}

function clearFunctions(node: Element): void {
	const c = <componentOpts>node;
	if (!c.__stumpFns) {
		return;
	}

	while (c.__stumpFns.length) {
		let key = c.__stumpFns.pop();
		c[key] = undefined;
	}
}
