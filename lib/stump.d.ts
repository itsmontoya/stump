export declare function stump(opts: options): void;
declare type options = {
    targetID: string;
    view: view;
    state: state;
    dispatchers: [];
};
export declare type view = (state: state) => component;
export declare type state = {};
export interface dispatcher {
    ondispatch: ondispatch;
}
export declare type component = {
    type: string;
    children: (component | string)[];
    options: {};
};
export declare type ondispatch = (dispatch: dispatch) => void;
export declare type dispatch = (fn: response) => void;
export declare type response = (state: state) => state;
export declare type event = (evt: Event, dispatch: dispatch) => void;
export declare type action = (evt: Event, state: state) => state;
declare type child = component | string;
export declare const c: (opts: component) => {
    type: string;
    children: child[];
    options: {};
};
export declare const dispatcher: (fn: ondispatch) => dispatcher;
export declare const response: (fn: response) => dispatcher;
export declare const action: (fn: action) => (event: Event, dispatch: dispatch) => void;
export {};
