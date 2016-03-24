'use strict';
/**
 * 有功能函数;
 * setCookie,removeCookie,getCookie,serialize,get请求,
 * (兼容版本)
 * Array.prototype.slice,
 * Array.prototype.forEach;
 * Function.prototype.bind;
 */
function setCookie(name, value, days, path, domain, secure) {
    if (!name) return;
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    // document.cookie = name + '=' + value + '; expires=' + date.toGMTString();
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (days) cookie += '; expires=' + date.toGMTString();
    if (path) cookie += '; path=' + path;
    if (domain) cookie += '; domain=' + domain;
    if (secure) cookie += '; secure=' + secure;
    document.cookie = cookie;
}

function removeCookie(name) {
    setCookie(name, '', 0);
    // document.cookie = name + '='; + ';path' + path + ';domain' + domain + '; max-age=0';
}

function getCookie(names) {
    var cookie = {};
    var all = document.cookie;
    if (all === '') return '';
    var list = all.split('; ');
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
        if (name == names) {
            return value;
        }
    }
    return "";
}

function serialize(data) {
    if (!data) return '';
    var pairs = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}
//get请求
function get(url, formdata, callback) {
    var url = url + "?" + serialize(formdata);
    var xhr = null;
    if (window.XDomainRequest) {
        xhr = new XDomainRequest();
        xhr.onload = function() {
            callback(xhr.responseText);
        }
    } else {
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    callback(xhr.responseText);
                } else {
                    console.log("请求不成功! unsuccesful ! 没网? " + xhr.status);
                }
            }
        };
    }
    xhr.open("get", url);
    xhr.send(null);
}
// Array.prototype.slice
(function() {
    'use strict';
    var _slice = Array.prototype.slice;
    try {
        _slice.call(document.documentElement);
    } catch (e) {
        Array.prototype.slice = function(begin, end) {
            end = (typeof end !== 'undefined') ? end : this.length;
            if (Object.prototype.toString.call(this) === '[object Array]') {
                return _slice.call(this, begin, end);
            }
            var i, cloned = [],
                size, len = this.length;
            var start = begin || 0;
            start = (start >= 0) ? start : len + start;
            var upTo = (end) ? end : len;
            if (end < 0) {
                upTo = len + end;
            }
            size = upTo - start;
            if (size > 0) {
                cloned = new Array(size);
                if (this.charAt) {
                    for (i = 0; i < size; i++) {
                        cloned[i] = this.charAt(start + i);
                    }
                } else {
                    for (i = 0; i < size; i++) {
                        cloned[i] = this[start + i];
                    }
                }
            }
            return cloned;
        };
    }
}());
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(callback, thisArg) {
        var T, k;
        if (this == null) {
            throw new TypeError("this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;
        while (k < len) {
            var kValue;
            if (k in O) {
                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP ? this : oThis || this, aArgs.concat(Array.prototype.slice.call(arguments)));
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}

/**
 * 组件扩展原型
 * 节点的class添加移除
 */
var util = (function() {
    return {
        //扩展
        extend: function(o1, o2) {
            for (var i in o2)
                if (o1[i] == undefined) {
                    o1[i] = o2[i]
                }
        },
        html2node: function(str) {
            var container = document.createElement('div');
            container.innerHTML = str;
            return container.children[0];
        },
        addClass: function(node, className) {
            var current = node.className || "";
            if ((" " + current + " ").indexOf(" " + className + " ") === -1) {
                node.className = current ? (current + " " + className) : className;
            }
        },
        delClass: function(node, className) {
            var current = node.className || "";
            node.className = (" " + current + " ").replace(" " + className + " ", " ");
            // IE没法使用trim(),这里用正则代替去掉多余空格
            node.className = node.className.replace(/(^\s*)|(\s*$)/g, "");
            // .trim();
        },
    }
})();
/**
 * 事件单元兼容
 */
var Event = (function() {
    return {
        addHandler: function(element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },
        removeHandler: function(element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        },
        getEvent: function(event) {
            return event ? event : window.event;
        },
        getTarget: function(event) {
            return event.target || event.srcElement;
        },
        preventDefault: function(event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }
    }
})();
/**
 * 用于组件注册事件,和触发事件
 */
var emitter = (function() {
    return {
        // 注册事件
        on: function(event, fn) {
            var handles = this._handles || (this._handles = {}),
                calls = handles[event] || (handles[event] = []);
            // 找到对应名字的栈
            calls.push(fn);
            return this;
        },
        // 解绑事件
        off: function(event, fn) {
            if (!event || !this._handles) this._handles = {};
            if (!this._handles) return;
            var handles = this._handles,
                calls;
            if (calls = handles[event]) {
                if (!fn) {
                    handles[event] = [];
                    return this;
                }
                // 找到栈内对应listener 并移除
                for (var i = 0, len = calls.length; i < len; i++) {
                    if (fn === calls[i]) {
                        calls.splice(i, 1);
                        return this;
                    }
                }
            }
            return this;
        },
        // 触发事件
        emit: function(event) {
            var args = [].slice.call(arguments, 1),
                handles = this._handles,
                calls;
            if (!handles || !(calls = handles[event])) return this;
            // 触发所有对应名字的listeners
            for (var i = 0, len = calls.length; i < len; i++) {
                calls[i].apply(this, args)
            }
            return this;
        }
    }
})()
