export declare function stump(opts: options): void;
declare type options = {
    targetID: string;
    view: view;
    state: state;
    dispatchers: [];
};
declare type view = (state: state) => component;
declare type state = {};
interface dispatcher {
    ondispatch: ondispatch;
}
declare type component = {
    type: string;
    children: (component | string)[];
    options: {};
};
declare type child = component | string;
declare type ondispatch = (dispatch: dispatch) => void;
declare type dispatch = (fn: response) => void;
declare type response = (state: state) => state;
declare type action = (evt: Event, state: state) => state;
export declare const c: (opts: component) => {
    type: string;
    children: child[];
    options: {};
};
export declare const dispatcher: (fn: ondispatch) => dispatcher;
export declare const response: (fn: response) => dispatcher;
export declare const action: (fn: action) => (event: Event, dispatch: dispatch) => void;
export {};
