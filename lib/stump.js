!function(n){var t={};function e(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return n[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=n,e.c=t,e.d=function(n,t,r){e.o(n,t)||Object.defineProperty(n,t,{enumerable:!0,get:r})},e.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},e.t=function(n,t){if(1&t&&(n=e(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var o in n)e.d(r,o,function(t){return n[t]}.bind(null,o));return r},e.n=function(n){var t=n&&n.__esModule?function(){return n.default}:function(){return n};return e.d(t,"a",t),t},e.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},e.p="",e(e.s=0)}([function(n,t,e){"use strict";var r=this&&this.__assign||function(){return(r=Object.assign||function(n){for(var t,e=1,r=arguments.length;e<r;e++)for(var o in t=arguments[e])Object.prototype.hasOwnProperty.call(t,o)&&(n[o]=t[o]);return n}).apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.action=t.response=t.dispatcher=t.c=t.stump=void 0,t.stump=function(n){var t=document.getElementById(n.targetID);t.innerHTML="";var e=r({},n.state);function o(r){e=r(e),f(o,t,n.view(e),t.children[0])}f(o,t,n.view(n.state),void 0,0),n.dispatchers.forEach(function(n){return function(n,t){if("object"!=typeof(e=t)||"function"!=typeof e.ondispatch)throw"invalid type, expected dispatcher and received "+t;var e;t.ondispatch(n)}(o,n)})},t.c=function(n){return{type:n.type,children:n.children,options:n.options}},t.dispatcher=function(n){return{ondispatch:n}},t.response=function(n){return t.dispatcher(function(t){return t(n)})},t.action=function(n){return function(t,e){return e(function(e){return n(t,e)})}};var o=function(n,t){return function(e){return t(e,n)}};function i(n,t){if("string"==typeof t)return document.createTextNode(t);var e=document.createElement(t.type);return function(n,t,e){if(!e)return;e.map(function(t){return i(n,t)}).forEach(t.appendChild.bind(t))}(n,e,t.children),function(n,t,e){for(var r in e){var o=u(r),i=c(n,e,r);t.setAttribute(o,i)}}(n,e,t.options),e}function u(n){switch(n){case"class":return"className";case"contenteditable":return"contentEditable";default:return n}}function c(n,t,e){var r=t[e];return"style"===e?function(n){var t=[];for(var e in n)t.push(e+": "+n[e]+";");return t.join(" ")}(r):"on"===e.substr(0,2)?function(n,t){if(!function(n){if("object"!=typeof n)return!1;return"function"==typeof n.onevent}(t))return t;var e=t.onevent;return o(n,e)}(n,r):r}function f(n,t,e,r,o){if(void 0===o&&(o=0),r)if(e)if(function(n,t){if("string"==typeof n)return function(n,t){return n!==t.nodeValue}(n,t);if(function(n,t){return typeof n!=typeof t}(n,t))return!0;if(function(n,t){return n.type!==function(n){if(!n)return"";var t=n=n;if(!t.tagName)return"";return t.tagName.toLowerCase()}(t)}(n,t))return!0;return!1}(e,r)){console.log("Swapping!");u=i(n,e);t.replaceChild(u,s(t,o))}else!function(n,t,e){if("string"==typeof t)return;for(var r=function(n,t){var e=n.children.length,r=t.childNodes.length;return e>r?e:r}(t,e)-1;r>-1;r--)a(n,t,e,r)}(n,e,r);else t.removeChild(s(t,o));else{var u=i(n,e);t.appendChild(u)}}function a(n,t,e,r){var o;f(n,e,(o=r,t.children[o]),s(e,r),r)}function s(n,t){return n.childNodes[t]}}]);