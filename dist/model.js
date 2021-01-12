;
export const model = (key) => newDeepModel(undefined, key);
export const arrayModel = (key) => newArrayModel(undefined, key);
const newDeepModel = (parent, key) => {
    if (typeof key === "number")
        return newModel(parent, key);
    let m = parent;
    key.split(".")
        .forEach((key) => m = newModel(m, key));
    return m;
};
const newModel = (parent, modelKey) => {
    const getSelf = (state) => parent === undefined
        ? state[modelKey] || {}
        : parent.get(state, modelKey) || {};
    const get = (state, key) => getSelf(state)[key];
    const find = (state, fn) => getObjectMatch(getSelf(state), fn);
    const putSelf = (state, updated) => {
        if (parent === undefined)
            return Object.assign(Object.assign({}, state), { [modelKey]: updated });
        if (parent.hasOwnProperty("put"))
            return parent.put(state, modelKey, updated);
        if (parent.hasOwnProperty("updateMatch"))
            return parent.update(state, modelKey, updated);
        throw (`invalid parent model type, <${parent}> is not supported`);
    };
    const put = (state, key, value) => putSelf(state, Object.assign(Object.assign({}, getSelf(state)), { [key]: value }));
    const remove = (state, key) => putSelf(state, deleteObjectValue(getSelf(state), key));
    const model = (key) => newDeepModel(self, key);
    const arrayModel = (key) => newArrayModel(self, key);
    const self = { get, getSelf, find, put, remove, model, arrayModel };
    return self;
};
const newArrayModel = (parent, modelKey) => {
    const getSelf = (state) => parent === undefined
        ? state[modelKey] || []
        : parent.get(state, modelKey) || [];
    const get = (state, index) => getSelf(state)[index];
    const find = (state, fn) => (getSelf(state) || []).find(fn);
    const findIndex = (state, fn) => (getSelf(state) || []).findIndex(fn);
    const putSelf = (state, updated) => {
        if (parent === undefined)
            return Object.assign(Object.assign({}, state), { [modelKey]: updated });
        if (parent.hasOwnProperty("put"))
            return parent.put(state, modelKey, updated);
        if (parent.hasOwnProperty("updateMatch"))
            return parent.update(state, modelKey, updated);
        throw (`invalid parent model type, <${parent}> is not supported`);
    };
    const append = (state, value) => putSelf(state, [...(getSelf(state) || []), value]);
    const update = (state, index, value) => putSelf(state, updateArrayValue(getSelf(state) || [], index, value));
    const remove = (state, index) => putSelf(state, deleteArrayValue(getSelf(state) || [], index));
    const updateMatch = (state, fn, value) => putSelf(state, updateMatchedArrayValue(getSelf(state) || [], fn, value));
    const updateOrAppendMatch = (state, fn, value) => putSelf(state, updateOrAppendMatchedArrayValue(getSelf(state) || [], fn, value));
    const removeMatch = (state, fn) => putSelf(state, deleteMatchedArrayValue(getSelf(state) || [], fn));
    const model = (key) => newDeepModel(self, key);
    const arrayModel = (key) => newArrayModel(self, key);
    const self = { get, getSelf, find, findIndex, append, update, remove, updateMatch, updateOrAppendMatch, removeMatch, model, arrayModel };
    return self;
};
const getObjectMatch = (obj, fn) => {
    for (let key in obj) {
        const value = obj[key];
        if (fn(value) === true) {
            return value;
        }
    }
    return null;
};
const deleteObjectValue = (obj, key) => {
    var newObj = Object.assign({}, obj);
    delete (newObj[key]);
    return newObj;
};
const updateArrayValue = (arr = [], index, value) => index === -1
    // Value doesn't exist, pass original array back
    ? [...arr]
    // Value exists, update within array
    : [...arr.slice(0, index), value, ...arr.slice(index + 1)];
const updateOrAppendArrayValue = (arr = [], index, value) => index === -1
    // Value doesn't exist, spread array and include new value
    ? [...arr, value]
    // Value exists, update within array
    : [...arr.slice(0, index), value, ...arr.slice(index + 1)];
const deleteArrayValue = (arr, index) => index === -1
    ? [...arr]
    : [...arr.slice(0, index), ...arr.slice(index + 1)];
const updateMatchedArrayValue = (arr = [], fn, value) => updateArrayValue(arr, arr.findIndex(fn), value);
const updateOrAppendMatchedArrayValue = (arr = [], fn, value) => updateOrAppendArrayValue(arr, arr.findIndex(fn), value);
const deleteMatchedArrayValue = (arr = [], fn) => deleteArrayValue(arr, arr.findIndex(fn));
//# sourceMappingURL=model.js.map