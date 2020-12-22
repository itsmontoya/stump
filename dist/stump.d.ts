export declare function stump(opts: options): void;
export declare type options = {
    targetID: string;
    view: view;
    state: state;
    dispatchers: ondispatch[];
    debug?: boolean;
};
export declare type view = (state: state) => component;
export declare type state = {
    [key: string]: any;
};
export declare type component = {
    type: string;
    children?: ChildList;
    options?: componentOpts;
};
export interface componentOpts {
    [key: string]: any;
    onabort?: event;
    onanimationcancel?: event;
    onanimationend?: event;
    onanimationiteration?: event;
    onauxclick?: event;
    onblur?: event;
    oncancel?: event;
    oncanplay?: event;
    oncanplaythrough?: event;
    onchange?: event;
    onclick?: event;
    onclose?: event;
    oncontextmenu?: event;
    oncopy?: event;
    oncuechange?: event;
    oncut?: event;
    ondblclick?: event;
    ondurationchange?: event;
    onended?: event;
    onerror?: event;
    onfocus?: event;
    onformdata?: event;
    ongotpointercapture?: event;
    oninput?: event;
    oninvalid?: event;
    onkeydown?: event;
    onkeypress?: event;
    onkeyup?: event;
    onload?: event;
    onloadeddata?: event;
    onloadedmetadata?: event;
    onloadend?: event;
    onloadstart?: event;
    onlostpointercapture?: event;
    onmousedown?: event;
    onmouseenter?: event;
    onmouseleave?: event;
    onmousemove?: event;
    onmouseout?: event;
    onmouseover?: event;
    onmouseup?: event;
    onpaste?: event;
    onpause?: event;
    onplay?: event;
    onplaying?: event;
    onpointercancel?: event;
    onpointerdown?: event;
    onpointerenter?: event;
    onpointerleave?: event;
    onpointermove?: event;
    onpointerout?: event;
    onpointerover?: event;
    onpointerup?: event;
    onreset?: event;
    onresize?: event;
    onscroll?: event;
    onselect?: event;
    onselectionchange?: event;
    onselectstart?: event;
    onsubmit?: event;
    ontouchcancel?: event;
    ontouchstart?: event;
    ontransitioncancel?: event;
    ontransitionend?: event;
    onwheel?: event;
}
export declare type ondispatch = (dispatch: dispatch) => void;
export declare type dispatch = (fn: response) => void;
export declare type response = (state: state) => state;
export declare type eventValue = (Event | any);
export declare type event = (evt: eventValue, dispatch: dispatch) => void;
export declare type action = (evt: eventValue, state: state) => state;
export declare type element = Element | ChildNode;
export declare type maybeelement = element | undefined;
export declare type child = component | string;
export declare type maybechild = child | undefined;
export declare const c: (c: component) => {
    type: string;
    children: ChildList | child[];
    options: componentOpts;
};
export declare const response: (fn: response) => (dispatch: dispatch) => void;
export declare const action: (fn: action) => (event: Event, dispatch: dispatch) => void;
export declare const children: (...children: child[]) => Children;
export interface Children {
    [key: number]: child;
    append(child: child): Children;
    forEach(callbackfn: (child: child, index: number, array: child[]) => void, thisArg?: any): void;
    map(fn: (child: child) => any): any[];
    length: number;
}
declare const Children: () => void;
interface ChildList {
    [key: number]: child;
    forEach(callbackfn: (child: child, index: number, array: child[]) => void, thisArg?: any): void;
    map(fn: (child: child) => any): any[];
    length: number;
}
export interface model {
    get: (state: any, key: string | number) => any;
    getSelf: (state: any) => any;
    put: (state: any, key: string | number, value: any) => state;
    find: (state: any, fn: matchFn) => any;
    model: (additionalKeys: string[]) => model;
    arrayModel: (key: string) => arrayModel;
}
export interface arrayModel {
    get: (state: any, index: number) => any;
    getSelf: (state: any) => any;
    find: (state: any, fn: matchFn) => any;
    append: (state: any, value: any) => state;
    appendIfNotExist: (state: any, value: string) => state;
}
export declare const model: (keys: string[]) => {
    get: (state: any, key: string | number) => any;
    getSelf: (state: any) => any;
    put: (state: any, key: string | number, value: any) => state;
    find: (state: any, fn: matchFn) => any;
    model: (additionalKeys: string[]) => model;
    arrayModel: (key: string) => arrayModel;
};
export declare const arrayModel: (keys: string[]) => {
    get: (state: any, index: number) => any;
    getSelf: (state: any) => any;
    find: (state: any, fn: matchFn) => any;
    append: (state: any, value: any) => state;
    appendIfNotExist: (state: any, value: string) => state;
};
export declare type matchFn = (value: any) => boolean;
export {};
