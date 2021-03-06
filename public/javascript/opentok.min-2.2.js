/*
 OpenTok JavaScript Library v2.2.5.1
 http://www.tokbox.com/

 Copyright (c) 2014 TokBox, Inc.

 Date: June 04 01:24:31 2014
 Common JS Helpers on OpenTok 0.2.0 1f056b9 master
 http://www.tokbox.com/

 Copyright (c) 2014 TokBox, Inc.

 Date: May 19 04:04:43 2014

 Copyright 2014 Joshua Bell

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Original source: https://github.com/inexorabletash/text-encoding
 */
(function (d) {
    d.OT || (d.OT = {});
    OT.properties = {
        version: "v2.2.5.1",
        build: "5217017",
        debug: "false",
        websiteURL: "http://www.tokbox.com",
        cdnURL: "http://static.opentok.com",
        loggingURL: "http://hlg.tokbox.com/prod",
        apiURL: "http://anvil.opentok.com",
        messagingProtocol: "wss",
        messagingPort: 443,
        supportSSL: "true",
        cdnURLSSL: "https://static.opentok.com",
        loggingURLSSL: "https://hlg.tokbox.com/prod",
        apiURLSSL: "https://anvil.opentok.com",
        minimumVersion: {firefox: parseFloat("26"), chrome: parseFloat("32")}
    }
})(window);
!function (d, a) {
    var h = function (a) {
        return document.getElementById(a)
    }, g = d.OTHelpers;
    d.OTHelpers = h;
    h.keys = Object.keys || function (a) {
        var c = [], b = Object.prototype.hasOwnProperty, f;
        for (f in a)b.call(a, f) && c.push(f);
        return c
    };
    var c = Array.prototype.forEach || function (a, c) {
            for (var b = 0, f = this.length || 0; b < f; ++b)b in this && a.call(c, this[b], b)
        };
    h.forEach = function (a, b, f) {
        return c.call(a, b, f)
    };
    var b = Array.prototype.map || function (a, b) {
            var f = [];
            c.call(this, function (c, e) {
                f.push(a.call(b, c, e))
            });
            return f
        };
    h.map = function (a,
                      c) {
        return b.call(a, c)
    };
    var e = Array.prototype.filter || function (a, b) {
            var f = [];
            c.call(this, function (c, e) {
                a.call(b, c, e) && f.push(c)
            });
            return f
        };
    h.filter = function (a, b, c) {
        return e.call(a, b, c)
    };
    var l = Array.prototype.some || function (a, b) {
            for (var c = !1, f = 0, e = this.length || 0; f < e; ++f)if (f in this && a.call(b, this[f], f)) {
                c = !0;
                break
            }
            return c
        };
    h.some = function (a, c, b) {
        return l.call(a, c, b)
    };
    var f = Array.prototype.indexOf || function (a, c) {
            var b;
            b = c ? c : 0;
            var f;
            if (!this)throw new TypeError;
            f = this.length;
            if (0 === f || b >= f)return -1;
            for (0 > b && (b = f - Math.abs(b)); b < f; b++)if (this[b] === a)return b;
            return -1
        };
    h.arrayIndexOf = function (a, b, c) {
        return f.call(a, b, c)
    };
    var k = Function.prototype.bind || function () {
            var a = Array.prototype.slice.call(arguments), b = a.shift(), c = this;
            return function () {
                return c.apply(b, a.concat(Array.prototype.slice.call(arguments)))
            }
        };
    h.bind = function () {
        var a = Array.prototype.slice.call(arguments), b = a.shift();
        return k.apply(b, a)
    };
    var n = String.prototype.trim || function () {
            return this.replace(/^\s+|\s+$/g, "")
        };
    h.trim = function (a) {
        return n.call(a)
    };
    h.noConflict = function () {
        h.noConflict = function () {
            return h
        };
        d.OTHelpers = g;
        return h
    };
    h.isNone = function (b) {
        return b === a || null === b
    };
    h.isObject = function (a) {
        return a === Object(a)
    };
    h.isFunction = function (a) {
        return !!a && (-1 !== a.toString().indexOf("()") || "[object Function]" === Object.prototype.toString.call(a))
    };
    h.isArray = h.isFunction(Array.isArray) && Array.isArray || function (a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    };
    h.isEmpty = function (b) {
        if (null === b || b === a)return !0;
        if (h.isArray(b) || "string" === typeof b)return 0 === b.length;
        for (var c in b)if (b.hasOwnProperty(c))return !1;
        return !0
    };
    h.extend = function () {
        var a = Array.prototype.slice.call(arguments), b = a.shift();
        h.forEach(a, function (a) {
            for (var c in a)b[c] = a[c]
        });
        return b
    };
    h.defaults = function () {
        var a = Array.prototype.slice.call(arguments), b = a.shift();
        h.forEach(a, function (a) {
            for (var c in a)void 0 === b[c] && (b[c] = a[c])
        });
        return b
    };
    h.clone = function (a) {
        return !h.isObject(a) ? a : h.isArray(a) ? a.slice() : h.extend({}, a)
    };
    h.noop = function () {
    };
    h.supportsWebSockets =
        function () {
            return "WebSocket"in d
        };
    h.now = function () {
        var a = d.performance || {}, b, c = a.now || a.mozNow || a.msNow || a.oNow || a.webkitNow;
        return c ? (c = h.bind(c, a), b = a.timing.navigationStart, function () {
            return b + c()
        }) : function () {
            return (new Date).getTime()
        }
    }();
    var m = function () {
        var a = d.navigator.userAgent.toLowerCase(), b = d.navigator.appName, c, f = "unknown", e = -1;
        if (-1 < a.indexOf("opera") || -1 < a.indexOf("opr"))f = "Opera", null !== /opr\/([0-9]{1,}[\.0-9]{0,})/.exec(a) && (e = parseFloat(RegExp.$1)); else if (-1 < a.indexOf("firefox"))f =
            "Firefox", null !== /firefox\/([0-9]{1,}[\.0-9]{0,})/.exec(a) && (e = parseFloat(RegExp.$1)); else if ("Microsoft Internet Explorer" === b)f = "IE", null !== /msie ([0-9]{1,}[\.0-9]{0,})/.exec(a) && (e = parseFloat(RegExp.$1)); else if ("Netscape" === b && -1 < a.indexOf("trident"))f = "IE", null !== /trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(a) && (e = parseFloat(RegExp.$1)); else if (-1 < a.indexOf("chrome"))f = "Chrome", null !== /chrome\/([0-9]{1,}[\.0-9]{0,})/.exec(a) && (e = parseFloat(RegExp.$1)); else if ((c = d.navigator.vendor) && -1 < c.toLowerCase().indexOf("apple"))f =
            "Safari", null !== /version\/([0-9]{1,}[\.0-9]{0,})/.exec(a) && (e = parseFloat(RegExp.$1));
        return {browser: f, version: e, iframeNeedsLoad: 0 > a.indexOf("webkit")}
    }();
    h.browser = function () {
        return m.browser
    };
    h.browserVersion = function () {
        return m
    };
    h.canDefineProperty = !0;
    try {
        Object.defineProperty({}, "x", {})
    } catch (q) {
        h.canDefineProperty = !1
    }
    h.defineGetters = function (a, b, c) {
        var f = {};
        void 0 === c && (c = !1);
        for (var e in b)f[e] = {get: b[e], enumerable: c};
        h.defineProperties(a, f)
    };
    var s = function (a, b, c) {
        return b && !c ? function () {
            return b.call(a)
        } :
            b && c ? function (f) {
                void 0 !== f && c.call(a, f);
                return b.call(a)
            } : function (b) {
                void 0 !== b && c.call(a, b)
            }
    };
    h.defineProperties = function (a, b) {
        for (var c in b)a[c] = s(a, b[c].get, b[c].set)
    };
    Object.create || (Object.create = function (a) {
        function b() {
        }

        if (1 < arguments.length)throw Error("Object.create implementation only accepts the first parameter.");
        b.prototype = a;
        return new b
    });
    h.setCookie = function (a, b) {
        try {
            localStorage.setItem(a, b)
        } catch (c) {
            var f = new Date;
            f.setTime(f.getTime() + 31536E6);
            f = "; expires\x3d" + f.toGMTString();
            document.cookie = a + "\x3d" + b + f + "; path\x3d/"
        }
    };
    h.getCookie = function (a) {
        var b;
        try {
            return b = localStorage.getItem("opentok_client_id")
        } catch (c) {
            a += "\x3d";
            for (var f = document.cookie.split(";"), e = 0; e < f.length; e++) {
                for (var k = f[e]; " " === k.charAt(0);)k = k.substring(1, k.length);
                0 === k.indexOf(a) && (b = k.substring(a.length, k.length))
            }
            if (b)return b
        }
        return null
    };
    h.invert = function (a) {
        var b = {}, c;
        for (c in a)a.hasOwnProperty(c) && (b[a[c]] = c);
        return b
    };
    var r = {
        escape: {
            "\x26": "\x26amp;", "\x3c": "\x26lt;", "\x3e": "\x26gt;", '"': "\x26quot;",
            "'": "\x26#x27;", "/": "\x26#x2F;"
        }
    };
    r.unescape = h.invert(r.escape);
    var p = {
        escape: RegExp("[" + h.keys(r.escape).join("") + "]", "g"),
        unescape: RegExp("(" + h.keys(r.unescape).join("|") + ")", "g")
    };
    h.forEach(["escape", "unescape"], function (b) {
        h[b] = function (c) {
            return null === c || c === a ? "" : ("" + c).replace(p[b], function (a) {
                return r[b][a]
            })
        }
    });
    h.templateSettings = {evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g};
    var u = /(.)^/, v = {
        "'": "'", "\\": "\\", "\r": "r", "\n": "n", "\t": "t", "\u2028": "u2028",
        "\u2029": "u2029"
    }, t = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    h.template = function (a, b, c) {
        var f;
        c = h.defaults({}, c, h.templateSettings);
        var e = RegExp([(c.escape || u).source, (c.interpolate || u).source, (c.evaluate || u).source].join("|") + "|$", "g"), k = 0, l = "__p+\x3d'";
        a.replace(e, function (b, c, f, e, g) {
            l += a.slice(k, g).replace(t, function (a) {
                return "\\" + v[a]
            });
            c && (l += "'+\n((__t\x3d(" + c + "))\x3d\x3dnull?'':OTHelpers.escape(__t))+\n'");
            f && (l += "'+\n((__t\x3d(" + f + "))\x3d\x3dnull?'':__t)+\n'");
            e && (l += "';\n" + e + "\n__p+\x3d'");
            k = g + b.length;
            return b
        });
        l += "';\n";
        c.variable || (l = "with(obj||{}){\n" + l + "}\n");
        l = "var __t,__p\x3d'',__j\x3dArray.prototype.join,print\x3dfunction(){__p+\x3d__j.call(arguments,'');};\n" + l + "return __p;\n";
        try {
            f = new Function(c.variable || "obj", l)
        } catch (g) {
            throw g.source = l, g;
        }
        if (b)return f(b);
        b = function (a) {
            return f.call(this, a)
        };
        b.source = "function(" + (c.variable || "obj") + "){\n" + l + "}";
        return b
    }
}(window);
(function (d, a, h) {
    a.statable = function (g, c, b, e, l) {
        var f, k = g.currentState = b;
        g.is = function () {
            return -1 !== a.arrayIndexOf(arguments, k)
        };
        g.isNot = function () {
            return -1 === a.arrayIndexOf(arguments, k)
        };
        return function (b) {
            k !== b && (-1 === a.arrayIndexOf(c, b) ? l && a.isFunction(l) && l("invalidState", b) : (g.previousState = f = k, g.currentState = k = b, e && a.isFunction(e) && e(b, f)))
        }
    }
})(window, window.OTHelpers);
(function (d, a, h) {
    function g(a, b) {
        var c = b || 0, f = n;
        return f[a[c++]] + f[a[c++]] + f[a[c++]] + f[a[c++]] + "-" + f[a[c++]] + f[a[c++]] + "-" + f[a[c++]] + f[a[c++]] + "-" + f[a[c++]] + f[a[c++]] + "-" + f[a[c++]] + f[a[c++]] + f[a[c++]] + f[a[c++]] + f[a[c++]] + f[a[c++]]
    }

    function c(a, b, c) {
        c = b && c || 0;
        "string" == typeof a && (b = "binary" == a ? new k(16) : null, a = null);
        a = a || {};
        a = a.random || (a.rng || f)();
        a[6] = a[6] & 15 | 64;
        a[8] = a[8] & 63 | 128;
        if (b)for (var e = 0; 16 > e; e++)b[c + e] = a[e];
        return b || g(a)
    }

    var b, e = Array(16);
    h = function () {
        for (var a, b = 0, b = 0; 16 > b; b++)0 === (b &
        3) && (a = 4294967296 * Math.random()), e[b] = a >>> ((b & 3) << 3) & 255;
        return e
    };
    if (d.crypto && crypto.getRandomValues) {
        var l = new Uint32Array(4);
        b = function () {
            crypto.getRandomValues(l);
            for (var a = 0; 16 > a; a++)e[a] = l[a >> 2] >>> 8 * (a & 3) & 255;
            return e
        }
    }
    var f = b || h, k = "function" == typeof Buffer ? Buffer : Array, n = [], m = {};
    for (d = 0; 256 > d; d++)n[d] = (d + 256).toString(16).substr(1), m[n[d]] = d;
    c.v4 = c;
    c.parse = function (a, b, c) {
        var f = b && c || 0, e = 0;
        b = b || [];
        for (a.toLowerCase().replace(/[0-9a-f]{2}/g, function (a) {
            16 > e && (b[f + e++] = m[a])
        }); 16 > e;)b[f + e++] =
            0;
        return b
    };
    c.unparse = g;
    c.BufferClass = k;
    c.mathRNG = h;
    c.whatwgRNG = b;
    a.uuid = c
})(window, window.OTHelpers);
(function (d, a, h) {
    a.useLogHelpers = function (g) {
        function c(a, c, f) {
            return function () {
                if (g.shouldLog(c)) {
                    var e = d.console, m = q(arguments);
                    if (e && e[a])if (e[a].apply || h)e[a].apply || (e[a] = Function.prototype.bind.call(e[a], e)), e[a].apply(e, m); else e[a](m); else if (f) {
                        f.apply(g, m);
                        return
                    }
                    if (e = q(arguments))e = l(e), 2 >= e.length || k.push([a, b(), e])
                }
            }
        }

        function b() {
            var a = new Date;
            return a.toLocaleTimeString() + a.getMilliseconds()
        }

        function e(a) {
            try {
                return JSON.stringify(a)
            } catch (b) {
                return a.toString()
            }
        }

        function l(b) {
            var c =
                [];
            if ("undefined" !== typeof b)if (null === b)c.push("NULL"); else if (a.isArray(b))for (var f = 0; f < b.length; ++f)c.push(e(b[f])); else if (a.isObject(b))for (f in b) {
                var k;
                a.isFunction(b[f]) ? b.hasOwnProperty(f) && (k = "function " + f + "()") : k = e(b[f]);
                c.push(f + ": " + k)
            } else if (a.isFunction(b))try {
                c.push(b.toString())
            } catch (l) {
                c.push("function()")
            } else c.push(b.toString());
            return c.join(", ")
        }

        g.DEBUG = 5;
        g.LOG = 4;
        g.INFO = 3;
        g.WARN = 2;
        g.ERROR = 1;
        g.NONE = 0;
        var f = g.NONE, k = [], h = !0;
        try {
            Function.prototype.bind.call(d.console.log, d.console)
        } catch (m) {
            h = !1
        }
        var q = function (a) {
            return a
        };
        "IE" === a.browser() && (q = function (a) {
            return [l(Array.prototype.slice.apply(a))]
        });
        g.log = c("log", g.LOG);
        g.debug = c("debug", g.DEBUG, g.log);
        g.info = c("info", g.INFO, g.log);
        g.warn = c("warn", g.WARN, g.log);
        g.error = c("error", g.ERROR, g.log);
        g.setLogLevel = function (a) {
            f = "number" === typeof a ? a : 0;
            g.debug("TB.setLogLevel(" + f + ")");
            return f
        };
        g.getLogs = function () {
            return k
        };
        g.shouldLog = function (a) {
            return f >= a
        }
    };
    a.useLogHelpers(a);
    a.setLogLevel(a.ERROR)
})(window, window.OTHelpers);
(function (d, a, h) {
    a.castToBoolean = function (a, c) {
        return a === h ? c : "true" === a || !0 === a
    };
    a.roundFloat = function (a, c) {
        return Number(a.toFixed(c))
    }
})(window, window.OTHelpers);
(function (d, a, h) {
    var g = [], c = "OTHelpers." + a.uuid.v4() + ".zero-timeout";
    h = function (b) {
        b.data === c && (a.isFunction(b.stopPropagation) && b.stopPropagation(), b.cancelBubble = !0, 0 < g.length && (b = g.shift(), b.shift().apply(null, b)))
    };
    d.addEventListener ? d.addEventListener("message", h, !0) : d.attachEvent && d.attachEvent("onmessage", h);
    a.callAsync = function () {
        g.push(Array.prototype.slice.call(arguments));
        d.postMessage(c, "*")
    };
    a.createAsyncHandler = function (b) {
        return function () {
            var c = Array.prototype.slice.call(arguments);
            a.callAsync(function () {
                b.apply(null, c)
            })
        }
    }
})(window, window.OTHelpers);
(function (d, a, h) {
    a.eventing = function (g, c) {
        function b(b, c, f) {
            var e = l[b];
            if (e && 0 !== e.length) {
                var k = e.length;
                a.forEach(e, function (e) {
                    function g(a) {
                        return a.context === e.context && a.handler === e.handler
                    }

                    a.callAsync(function () {
                        try {
                            l[b] && a.some(l[b], g) && (e.closure || e.handler).apply(e.context || null, c)
                        } finally {
                            k--, 0 === k && f && f.apply(null, c.slice())
                        }
                    })
                })
            }
        }

        function e(b, c) {
            var f = l[b];
            f && 0 !== f.length && a.forEach(f, function (a) {
                (a.closure || a.handler).apply(a.context || null, c)
            })
        }

        var l = {}, f = !0 === c ? e : b, k = function (b, c) {
            l[b] &&
            (c ? l[b] = a.filter(l[b], function (a) {
                return a.context !== c
            }) : delete l[b])
        }, d = a.bind(function (b, c, f, e) {
            var k = {handler: c};
            f && (k.context = f);
            e && (k.closure = e);
            a.forEach(b, function (a) {
                l[a] || (l[a] = []);
                l[a].push(k)
            })
        }, g), m = function (b, c, f) {
            function e(a) {
                return !(a.handler === c && a.context === f)
            }

            a.forEach(b, a.bind(function (b) {
                l[b] && (l[b] = a.filter(l[b], e), 0 === l[b].length && delete l[b])
            }, g))
        };
        g.dispatchEvent = function (b, c) {
            if (!b.type)throw a.error("OTHelpers.Eventing.dispatchEvent: Event has no type"), a.error(b), Error("OTHelpers.Eventing.dispatchEvent: Event has no type");
            b.target || (b.target = this);
            if (!l[b.type] || 0 === l[b.type].length) {
                var e = [b];
                c && c.apply(null, e.slice())
            } else return f(b.type, [b], c), this
        };
        g.trigger = function (a) {
            if (l[a] && 0 !== l[a].length) {
                var b = Array.prototype.slice.call(arguments);
                b.shift();
                f(a, b);
                return this
            }
        };
        g.on = function (a, b, c) {
            if ("string" === typeof a && b)d(a.split(" "), b, c); else for (var f in a)a.hasOwnProperty(f) && d([f], a[f], b);
            return this
        };
        g.off = function (b, c, f) {
            if ("string" === typeof b)c && a.isFunction(c) ? m(b.split(" "), c, f) : a.forEach(b.split(" "), function (a) {
                k(a,
                    c)
            }, this); else if (b)for (var e in b)b.hasOwnProperty(e) && m([e], b[e], c); else l = {};
            return this
        };
        g.once = function (b, c, f) {
            var e = b.split(" ");
            b = a.bind(function () {
                var a = c.apply(f || null, arguments);
                m(e, c, f);
                return a
            }, this);
            d(e, c, f, b);
            return this
        };
        g.addEventListener = function (b, c, f) {
            a.warn("The addEventListener() method is deprecated. Use on() or once() instead.");
            d([b], c, f)
        };
        g.removeEventListener = function (b, c, f) {
            a.warn("The removeEventListener() method is deprecated. Use off() instead.");
            m([b], c, f)
        };
        return g
    };
    a.eventing.Event = function () {
        return function (g, c) {
            this.type = g;
            this.cancelable = c !== h ? c : !0;
            var b = !1;
            this.preventDefault = function () {
                this.cancelable ? b = !0 : a.warn("Event.preventDefault :: Trying to preventDefault on an Event that isn't cancelable")
            };
            this.isDefaultPrevented = function () {
                return b
            }
        }
    }
})(window, window.OTHelpers);
(function (d, a, h) {
    function g(a) {
        for (var b in a)if (a.hasOwnProperty(b))return !0;
        return !1
    }

    a.isElementNode = function (a) {
        return a && "object" === typeof a && 1 == a.nodeType
    };
    a.supportsClassList = function () {
        var c = typeof("undefined" !== document) && "classList"in document.createElement("a");
        a.supportsClassList = function () {
            return c
        };
        return c
    };
    a.removeElement = function (a) {
        a && a.parentNode && a.parentNode.removeChild(a)
    };
    a.removeElementById = function (c) {
        this.removeElement(a(c))
    };
    a.removeElementsByType = function (a, b) {
        if (a)for (var e =
            a.getElementsByTagName(b); e.length;)a.removeChild(e[0])
    };
    a.emptyElement = function (a) {
        for (; a.firstChild;)a.removeChild(a.firstChild);
        return a
    };
    a.createElement = function (c, b, e, l) {
        var f = (l || document).createElement(c);
        if (b)for (var k in b)if ("object" === typeof b[k]) {
            f[k] || (f[k] = {});
            c = b[k];
            for (var g in c)f[k][g] = c[g]
        } else"className" === k ? f.className = b[k] : f.setAttribute(k, b[k]);
        b = function (a) {
            "string" === typeof a ? f.innerHTML += a : f.appendChild(a)
        };
        a.isArray(e) ? a.forEach(e, b) : e && b(e);
        return f
    };
    a.createButton = function (c,
                               b, e) {
        c = a.createElement("button", b, c);
        if (e) {
            for (var l in e)if (e.hasOwnProperty(l))a.on(c, l, e[l]);
            c._boundEvents = e
        }
        return c
    };
    a.on = function (a, b, e) {
        if (a.addEventListener)a.addEventListener(b, e, !1); else if (a.attachEvent)a.attachEvent("on" + b, e); else {
            var l = a["on" + b];
            a["on" + b] = function () {
                e.apply(this, arguments);
                l && l.apply(this, arguments)
            }
        }
        return a
    };
    a.off = function (a, b, e) {
        a.removeEventListener ? a.removeEventListener(b, e, !1) : a.detachEvent && a.detachEvent("on" + b, e)
    };
    a.isDisplayNone = function (c) {
        return (0 === c.offsetWidth ||
        0 === c.offsetHeight) && "none" === a.css(c, "display") ? !0 : c.parentNode && c.parentNode.style ? a.isDisplayNone(c.parentNode) : !1
    };
    a.findElementWithDisplayNone = function (c) {
        return (0 === c.offsetWidth || 0 === c.offsetHeight) && "none" === a.css(c, "display") ? c : c.parentNode && c.parentNode.style ? a.findElementWithDisplayNone(c.parentNode) : null
    };
    a.observeStyleChanges = function (c, b, e) {
        var l = {}, f = function (b) {
            switch (b) {
                case "width":
                    return a.width(c);
                case "height":
                    return a.height(c);
                default:
                    return a.css(c)
            }
        };
        a.forEach(b, function (a) {
            l[a] =
                f(a)
        });
        var k = new MutationObserver(function (k) {
            var d = {};
            a.forEach(k, function (e) {
                if ("style" === e.attributeName) {
                    var k = a.isDisplayNone(c);
                    a.forEach(b, function (a) {
                        if (!k || !("width" == a || "height" == a)) {
                            var b = f(a);
                            b !== l[a] && (d[a] = [l[a], b], l[a] = b)
                        }
                    })
                }
            });
            g(d) && a.callAsync(function () {
                e.call(null, d)
            })
        });
        k.observe(c, {attributes: !0, attributeFilter: ["style"], childList: !1, characterData: !1, subtree: !1});
        return k
    };
    a.observeNodeOrChildNodeRemoval = function (c, b) {
        var e = new MutationObserver(function (c) {
            var f = [];
            a.forEach(c,
                function (a) {
                    a.removedNodes.length && (f = f.concat(Array.prototype.slice.call(a.removedNodes)))
                });
            f.length && a.callAsync(function () {
                b(f)
            })
        });
        e.observe(c, {attributes: !1, childList: !0, characterData: !1, subtree: !0});
        return e
    }
})(window, window.OTHelpers);
(function (d, a, h) {
    a.dialog = function (g) {
        a.eventing(this, !0);
        var c = arguments[arguments.length - 1];
        if (!a.isFunction(c))throw Error("OTHelpers.dialog2 must be given a callback");
        2 > arguments.length && (g = {});
        var b = document.createElement("iframe");
        b.id = g.id || a.uuid();
        b.style.position = "absolute";
        b.style.position = "fixed";
        b.style.height = "100%";
        b.style.width = "100%";
        b.style.top = "0px";
        b.style.left = "0px";
        b.style.right = "0px";
        b.style.bottom = "0px";
        b.style.zIndex = 1E3;
        b.style.border = "0";
        try {
            b.style.backgroundColor = "rgba(0,0,0,0.2)"
        } catch (e) {
            b.style.backgroundColor =
                "transparent", b.setAttribute("allowTransparency", "true")
        }
        b.scrolling = "no";
        b.setAttribute("scrolling", "no");
        var l = function () {
            var a = b.contentDocument || b.contentWindow.document;
            a.body.style.backgroundColor = "transparent";
            a.body.style.border = "none";
            c(b.contentWindow, a)
        };
        document.body.appendChild(b);
        if (a.browserVersion().iframeNeedsLoad)a.on(b, "load", l); else setTimeout(l);
        this.close = function () {
            a.removeElement(b);
            this.trigger("closed");
            this.element = b = null;
            return this
        };
        this.element = b
    }
})(window, window.OTHelpers);
(function (d, a, h) {
    function g(a, b, c, k) {
        var d = b[c];
        b = parseFloat(d);
        d = d.split(/\d/)[0];
        k = null != k ? k : /%|em/.test(d) && a.parentElement ? g(a.parentElement, a.parentElement.currentStyle, "fontSize", null) : 16;
        a = "fontSize" === c ? k : /width/i.test(c) ? a.clientWidth : a.clientHeight;
        return "em" === d ? b * k : "in" === d ? 96 * b : "pt" === d ? 96 * b / 72 : "%" === d ? b / 100 * a : b
    }

    function c(a, b) {
        var c = "border" === b ? "Width" : "", k = b + "Top" + c, d = b + "Right" + c, g = b + "Bottom" + c, c = b + "Left" + c;
        a[b] = (a[k] === a[d] === a[g] === a[c] ? [a[k]] : a[k] === a[g] && a[c] === a[d] ? [a[k], a[d]] :
            a[c] === a[d] ? [a[k], a[d], a[g]] : [a[k], a[d], a[g], a[c]]).join(" ")
    }

    function b(a) {
        var b = a.currentStyle, f = g(a, b, "fontSize", null), k;
        for (k in b)/width|height|margin.|padding.|border.+W/.test(k) && "auto" !== this[k] ? this[k] = g(a, b, k, f) + "px" : "styleFloat" === k ? this["float"] = b[k] : this[k] = b[k];
        c(this, "margin");
        c(this, "padding");
        c(this, "border");
        this.fontSize = f + "px";
        return this
    }

    b.prototype = {
        constructor: b, getPropertyPriority: function () {
        }, getPropertyValue: function (a) {
            return this[a] || ""
        }, item: function () {
        }, removeProperty: function () {
        },
        setProperty: function () {
        }, getPropertyCSSValue: function () {
        }
    };
    a.getComputedStyle = function (a) {
        return a && a.ownerDocument && a.ownerDocument.defaultView && a.ownerDocument.defaultView.getComputedStyle ? a.ownerDocument.defaultView.getComputedStyle(a) : new b(a)
    }
})(window, window.OTHelpers);
(function (d, a, h) {
    a.addClass = function (c, b) {
        if (1 === c.nodeType) {
            var e = a.trim(b).split(/\s+/), d, f;
            if (a.supportsClassList()) {
                d = 0;
                for (f = e.length; d < f; ++d)c.classList.add(e[d])
            } else {
                if (!c.className && 1 === e.length)c.className = b; else {
                    var k = " " + c.className + " ";
                    d = 0;
                    for (f = e.length; d < f; ++d)~k.indexOf(" " + e[d] + " ") || (k += e[d] + " ");
                    c.className = a.trim(k)
                }
                return this
            }
        }
    };
    a.removeClass = function (c, b) {
        if (b && 1 === c.nodeType) {
            var e = a.trim(b).split(/\s+/), d, f;
            if (a.supportsClassList()) {
                d = 0;
                for (f = e.length; d < f; ++d)c.classList.remove(e[d])
            } else {
                var k =
                    (" " + c.className + " ").replace(/[\s+]/, " ");
                d = 0;
                for (f = e.length; d < f; ++d)k = k.replace(" " + e[d] + " ", " ");
                c.className = a.trim(k);
                return this
            }
        }
    };
    var g = function (c) {
        return 0 < c.offsetHeight ? c.offsetHeight + "px" : a.css(c, "height")
    };
    a.width = function (c, b) {
        return b ? (a.css(c, "width", b), this) : a.isDisplayNone(c) ? a.makeVisibleAndYield(c, function () {
            return 0 < c.offsetWidth ? c.offsetWidth + "px" : a.css(c, "width")
        }) : 0 < c.offsetWidth ? c.offsetWidth + "px" : a.css(c, "width")
    };
    a.height = function (c, b) {
        return b ? (a.css(c, "height", b), this) :
            a.isDisplayNone(c) ? a.makeVisibleAndYield(c, function () {
                return g(c)
            }) : g(c)
    };
    a.centerElement = function (c, b, e) {
        b || (b = parseInt(a.width(c), 10));
        e || (e = parseInt(a.height(c), 10));
        a.css(c, "margin", -0.5 * e + "px 0 0 " + (-0.5 * b + "px"));
        a.addClass(c, "OT_centered")
    }
})(window, window.OTHelpers);
(function (d, a, h) {
    var g = {}, c = {};
    a.show = function (b) {
        var e = b.style.display;
        if ("" === e || "none" === e)b.style.display = g[b] || "", delete g[b];
        if ("none" === a.getComputedStyle(b).getPropertyValue("display")) {
            g[b] = "none";
            e = b.style;
            if (c[b.ownerDocument] && c[b.ownerDocument][b.nodeName])b = c[b.ownerDocument][b.nodeName]; else {
                c[b.ownerDocument] || (c[b.ownerDocument] = {});
                var d = b.ownerDocument.createElement(b.nodeName);
                b.ownerDocument.body.appendChild(d);
                b = c[b.ownerDocument][b.nodeName] = a.css(d, "display");
                a.removeElement(d)
            }
            e.display =
                b
        }
        return this
    };
    a.hide = function (a) {
        if ("none" !== a.style.display)return g[a] = a.style.display, a.style.display = "none", this
    };
    a.css = function (b, c, d) {
        if ("string" !== typeof c) {
            b = b.style;
            for (var f in c)b[f] = c[f];
            return this
        }
        if (d !== h)return b.style[c] = d, this;
        c = c.replace(/([A-Z]|^ms)/g, "-$1").toLowerCase();
        f = a.getComputedStyle(b).getPropertyValue(c);
        "" === f && (f = b.style[c]);
        return f
    };
    a.applyCSS = function (b, c, d) {
        var f = {}, k;
        for (k in c)c.hasOwnProperty(k) && (f[k] = b.style[k], a.css(b, k, c[k]));
        d = d();
        for (k in c)c.hasOwnProperty(k) &&
        a.css(b, k, f[k] || "");
        return d
    };
    a.makeVisibleAndYield = function (b, c) {
        var d = a.findElementWithDisplayNone(b);
        if (d)return a.applyCSS(d, {display: "block", visibility: "hidden"}, c)
    }
})(window, window.OTHelpers);
(function (d, a, h) {
    function g(a) {
        if ("string" === typeof a)return a;
        var b = [], e;
        for (e in a)b.push(encodeURIComponent(e) + "\x3d" + encodeURIComponent(a[e]));
        return b.join("\x26").replace(/\+/g, "%20")
    }

    a.getJSON = function (c, b, e) {
        b = b || {};
        var d = function (a, b) {
            if (a)e(a, b && b.target && b.target.responseText); else {
                var c;
                try {
                    c = JSON.parse(b.target.responseText)
                } catch (f) {
                    e(f, b && b.target && b.target.responseText);
                    return
                }
                e(null, c, b)
            }
        };
        if (b.xdomainrequest)a.xdomainRequest(c, {method: "GET"}, d); else {
            var f = a.extend({Accept: "application/json"},
                b.headers || {});
            a.get(c, a.extend(b || {}, {headers: f}), d)
        }
    };
    a.xdomainRequest = function (a, b, e) {
        function d(a, b) {
            f.onload = f.onerror = f.ontimeout = function () {
            };
            f = void 0;
            e(a, b)
        }

        var f = new XDomainRequest, k = (b || {}).method;
        k ? (k = k.toUpperCase(), "GET" === k || "POST" === k ? (f.onload = function () {
            d(null, {target: {responseText: f.responseText, headers: {"content-type": f.contentType}}})
        }, f.onerror = function () {
            d(Error("XDomainRequest of " + a + " failed"))
        }, f.ontimeout = function () {
            d(Error("XDomainRequest of " + a + " timed out"))
        }, f.open(k,
            a), f.send(b.body && g(b.body))) : e(Error("HTTP method can only be "))) : e(Error("No HTTP method specified in options"))
    };
    a.request = function (a, b, e) {
        var d = new XMLHttpRequest, f = b || {};
        if (f.method) {
            e && (d.addEventListener("load", function (a) {
                var b = a.target.status;
                200 <= b && 300 > b || 304 === b ? e(null, a) : e(a)
            }, !1), d.addEventListener("error", e, !1));
            d.open(b.method, a, !0);
            f.headers || (f.headers = {});
            for (var k in f.headers)d.setRequestHeader(k, f.headers[k]);
            d.send(b.body && g(b.body))
        } else e(Error("No HTTP method specified in options"))
    };
    a.get = function (c, b, e) {
        b = a.extend(b || {}, {method: "GET"});
        a.request(c, b, e)
    };
    a.post = function (c, b, e) {
        b = a.extend(b || {}, {method: "POST"});
        b.xdomainrequest ? a.xdomainRequest(c, b, e) : a.request(c, b, e)
    }
})(window, window.OTHelpers);
!function () {
    OT.Dialogs = {};
    var d = function (a, c, b) {
        a = a.head || a.getElementsByTagName("head")[0];
        var e = OT.$.createElement("link", {type: "text/css", media: "screen", rel: "stylesheet", href: c});
        a.appendChild(e);
        OT.$.on(e, "error", function (a) {
            OT.error("Could not load CSS for dialog", c, a && a.message || a)
        });
        OT.$.on(e, "load", b)
    }, a = function (a, c, b) {
        c = ["//fonts.googleapis.com/css?family\x3dDidact+Gothic", OT.properties.cssURL].concat(c);
        var e = c.length;
        OT.$.forEach(c, function (c) {
            d(a, c, function () {
                0 >= --e && b()
            })
        })
    }, h = function (a,
                     c, b) {
        a = OT.$.createElement(b || "div", {"class": a}, c, this);
        a.on = OT.$.bind(OT.$.on, OT.$, a);
        return a
    };
    OT.Dialogs.AllowDeny = {};
    OT.Dialogs.AllowDeny.Chrome = {};
    OT.Dialogs.AllowDeny.Firefox = {};
    OT.Dialogs.AllowDeny.Chrome.initialPrompt = function () {
        var d = new OT.$.dialog(function (c, b) {
            var e = h.bind(b), l, f;
            l = e("OT_closeButton", "\x26times;").on("click", function () {
                d.close()
            });
            f = e("OT_root OT_dialog OT_dialog-allow-deny-chrome-first", [l, e("OT_dialog-messages", [e("OT_dialog-messages-main", "Allow camera and mic access"),
                e("OT_dialog-messages-minor", "Click the Allow button in the upper-right corner of your browser to enable real-time communication."), e("OT_dialog-allow-highlight-chrome")])]);
            a(b, [], function () {
                b.body.appendChild(f)
            })
        });
        return d
    };
    OT.Dialogs.AllowDeny.Chrome.previouslyDenied = function (d) {
        var c = new OT.$.dialog(function (b, e) {
            var l = h.bind(e), f, k;
            f = l("OT_closeButton", "\x26times;").on("click", function () {
                c.close()
            });
            k = l("OT_root OT_dialog OT_dialog-allow-deny-chrome-pre-denied", [f, l("OT_dialog-messages", [l("OT_dialog-messages-main",
                "Allow camera and mic access"), l("OT_dialog-messages-minor", ["To interact with this app, follow these 3 steps:", l("OT_dialog-3steps", [l("OT_dialog-3steps-step", [l("OT_dialog-3steps-step-num", "1"), "Find this icon in the URL bar and click it", l("OT_dialog-allow-camera-icon")]), l("OT_dialog-3steps-seperator"), l("OT_dialog-3steps-step", [l("OT_dialog-3steps-step-num", "2"), 'Select "Ask if ' + d + ' wants to access your camera and mic" and then click Done.']), l("OT_dialog-3steps-seperator"), l("OT_dialog-3steps-step",
                [l("OT_dialog-3steps-step-num", "3"), "Refresh your browser."])])])])]);
            a(e, [], function () {
                e.body.appendChild(k)
            })
        });
        return c
    };
    OT.Dialogs.AllowDeny.Chrome.deniedNow = function () {
        return new OT.$.dialog(function (d, c) {
            var b = h.bind(c), e;
            e = b("OT_root OT_dialog-blackout", b("OT_dialog OT_dialog-allow-deny-chrome-now-denied", [b("OT_dialog-messages", [b("OT_dialog-messages-main ", b("OT_dialog-allow-camera-icon")), b("OT_dialog-messages-minor", "Find \x26 click this icon to allow camera and mic access.")])]));
            a(c, [],
                function () {
                    c.body.appendChild(e)
                })
        })
    };
    OT.Dialogs.AllowDeny.Firefox.maybeDenied = function () {
        var d = new OT.$.dialog(function (c, b) {
            var e = h.bind(b), l, f;
            l = e("OT_closeButton", "\x26times;").on("click", function () {
                d.close()
            });
            f = e("OT_root OT_dialog OT_dialog-allow-deny-firefox-maybe-denied", [l, e("OT_dialog-messages", [e("OT_dialog-messages-main", "Please allow camera \x26 mic access"), e("OT_dialog-messages-minor", ["To interact with this app, follow these 3 steps:", e("OT_dialog-3steps", [e("OT_dialog-3steps-step",
                [e("OT_dialog-3steps-step-num", "1"), "Reload the page, or click the camera icon in the browser URL bar."]), e("OT_dialog-3steps-seperator"), e("OT_dialog-3steps-step", [e("OT_dialog-3steps-step-num", "2"), "In the menu, select your camera \x26 mic."]), e("OT_dialog-3steps-seperator"), e("OT_dialog-3steps-step", [e("OT_dialog-3steps-step-num", "3"), 'Click "Share Selected Devices."'])])])])]);
            a(b, [], function () {
                b.body.appendChild(f)
            })
        });
        return d
    };
    OT.Dialogs.AllowDeny.Firefox.denied = function () {
        var d = new OT.$.dialog(function (c,
                                          b) {
            var e = h.bind(b), l, f;
            f = h.bind(b, "OT_dialog-button OT_dialog-button-large")("Reload").on("click", function () {
                d.trigger("refresh")
            });
            l = e("OT_root OT_dialog-blackout", e("OT_dialog OT_dialog-allow-deny-firefox-denied", [e("OT_dialog-messages", [e("OT_dialog-messages-minor", "Access to camera and microphone has been denied. Click the button to reload page.")]), e("OT_dialog-single-button", f)]));
            a(b, [], function () {
                b.body.appendChild(l)
            })
        });
        return d
    }
}();
!function (d) {
    d.OT || (d.OT = {});
    OT.$ = OTHelpers.noConflict();
    OT.$.eventing(OT);
    OT.$.defineGetters = function (a, c, b) {
        var d = {};
        void 0 === b && (b = !1);
        for (var l in c)d[l] = {get: c[l], enumerable: b};
        Object.defineProperties(a, d)
    };
    OT.dialog = OT.$.dialog;
    OT.$.useLogHelpers(OT);
    var a = !1, h = OT.setLogLevel;
    OT.setLogLevel = function (d) {
        OT.$.setLogLevel(d);
        d = h.call(OT, d);
        OT.shouldLog(OT.DEBUG) && !a && (OT.debug("OpenTok JavaScript library " + OT.properties.version), OT.debug("Release notes: " + OT.properties.websiteURL + "/opentok/webrtc/docs/js/release-notes.html"),
            OT.debug("Known issues: " + OT.properties.websiteURL + "/opentok/webrtc/docs/js/release-notes.html#knownIssues"), a = !0);
        OT.debug("OT.setLogLevel(" + d + ")");
        return d
    };
    OT.setLogLevel(OT.properties.debug ? OT.DEBUG : OT.ERROR)
}(window);
!function (d) {
    d.OT || (d.OT = {});
    if (!OT.properties)throw Error("OT.properties does not exist, please ensure that you include a valid properties file.");
    var a = OT, h = OT.properties, g = OT.$.clone(h);
    g.debug = "true" === h.debug || !0 === h.debug;
    g.supportSSL = "true" === h.supportSSL || !0 === h.supportSSL;
    g.supportSSL && (0 <= d.location.protocol.indexOf("https") || 0 <= d.location.protocol.indexOf("chrome-extension")) ? (g.assetURL = g.cdnURLSSL + "/webrtc/" + g.version, g.loggingURL = g.loggingURLSSL) : g.assetURL = g.cdnURL + "/webrtc/" + g.version;
    g.configURL = g.assetURL + "/js/dynamic_config.min.js";
    g.cssURL = g.assetURL + "/css/ot.min.css";
    a.properties = g
}(window);
!function () {
    OT.Config = function () {
        var d = !1, a = {}, h = {}, g, c = document.head || document.getElementsByTagName("head")[0], b, e = function () {
            b && (clearTimeout(b), b = null);
            g && (g.onload = g.onreadystatechange = null, c && g.parentNode && c.removeChild(g), g = void 0)
        }, l = function () {
            if (!g.readyState || /loaded|complete/.test(g.readyState))b && (clearTimeout(b), b = null), d || f._onLoadTimeout()
        }, f;
        f = {
            loadTimeout: 4E3, load: function (a) {
                if (!a)throw Error("You must pass a valid configUrl to Config.load");
                d = !1;
                setTimeout(function () {
                    g = document.createElement("script");
                    g.async = "async";
                    g.src = a;
                    g.onload = g.onreadystatechange = l.bind(this);
                    c.appendChild(g)
                }, 1);
                b = setTimeout(function () {
                    f._onLoadTimeout()
                }, this.loadTimeout)
            }, _onLoadTimeout: function () {
                e();
                OT.warn("TB DynamicConfig failed to load in " + f.loadTimeout + " ms");
                this.trigger("dynamicConfigLoadFailed")
            }, isLoaded: function () {
                return d
            }, reset: function () {
                e();
                d = !1;
                a = {};
                h = {}
            }, replaceWith: function (b) {
                e();
                b || (b = {});
                a = b.global || {};
                h = b.partners || {};
                d || (d = !0);
                this.trigger("dynamicConfigChanged")
            }, get: function (b, c, f) {
                b = f && h[f] &&
                h[f][b] ? h[f][b] : a[b];
                return b ? b[c] : null
            }
        };
        OT.$.eventing(f);
        return f
    }()
}(window);
!function () {
    function d(a, b, c, d, e) {
        b = b ? parseInt(b, 10) : parseInt(OT.$.width(a.parentNode), 10);
        c = c ? parseInt(c, 10) : parseInt(OT.$.height(a.parentNode), 10);
        if (!(0 === b || 0 === c))if (d || (d = h), c = (b + 0) / c, b = {
                width: "100%",
                height: "100%",
                left: 0,
                top: 0
            }, c > d ? (d = 100 * (c / d), b.height = d + "%", b.top = "-" + (d - 100) / 2 + "%") : c < d && (d = 100 * (d / c), b.width = d + "%", b.left = "-" + (d - 100) / 2 + "%"), OT.$.css(a, b), d = a.querySelector("video"))e ? (e = a.offsetWidth, a = a.offsetHeight, b = e - a, b = {
            width: a + "px",
            height: e + "px",
            marginTop: -(b / 2) + "px",
            marginLeft: b / 2 + "px"
        },
            OT.$.css(d, b)) : OT.$.css(d, {width: "", height: "", marginTop: "", marginLeft: ""})
    }

    function a(a, d, l) {
        d = parseInt(d, 10);
        l = parseInt(l, 10);
        d < b || l < e ? OT.$.addClass(a, "OT_micro") : OT.$.removeClass(a, "OT_micro");
        d < g || l < c ? OT.$.addClass(a, "OT_mini") : OT.$.removeClass(a, "OT_mini")
    }

    var h = 4 / 3, g = 128, c = 128, b = 64, e = 64, l = function (a, b) {
        var c, d;
        a && a.nodeName ? (c = a, (!c.getAttribute("id") || 0 === c.getAttribute("id").length) && c.setAttribute("id", "OT_" + OT.$.uuid()), d = c.getAttribute("id")) : (c = OT.$(a), d = a || "OT_" + OT.$.uuid());
        c ? null == b ||
        "replace" === b ? OT.$.emptyElement(c) : (d = document.createElement("div"), d.id = "OT_" + OT.$.uuid(), "append" === b ? (c.appendChild(d), c = d) : "before" === b ? (c.parentNode.insertBefore(d, c), c = d) : "after" === b && (c.parentNode.insertBefore(d, c.nextSibling), c = d)) : (c = OT.$.createElement("div", {id: d}), c.style.backgroundColor = "#000000", document.body.appendChild(c));
        return c
    };
    OT.WidgetView = function (b, c) {
        var e = l(b, c && c.insertMode), g = document.createElement("div"), h, s, r, p, u, v, t = !0;
        c && (u = c.width, v = c.height, u && "number" === typeof u &&
        (u += "px"), v && "number" === typeof v && (v += "px"), e.style.width = u ? u : "264px", e.style.height = v ? v : "198px", e.style.overflow = "hidden", a(e, u || "264px", v || "198px"), (void 0 === c.mirror || c.mirror) && OT.$.addClass(e, "OT_mirrored"));
        c.classNames && OT.$.addClass(e, c.classNames);
        OT.$.addClass(e, "OT_loading");
        OT.$.addClass(g, "OT_video-container");
        g.style.width = e.style.width;
        g.style.height = e.style.height;
        e.appendChild(g);
        d(g, e.offsetWidth, e.offsetHeight);
        u = document.createElement("div");
        OT.$.addClass(u, "OT_video-loading");
        g.appendChild(u);
        p = document.createElement("div");
        OT.$.addClass(p, "OT_video-poster");
        g.appendChild(p);
        h = OT.$.observeStyleChanges(e, ["width", "height"], function (b) {
            var c = b.width ? b.width[1] : e.offsetWidth;
            b = b.height ? b.height[1] : e.offsetHeight;
            a(e, c, b);
            d(g, c, b, s ? s.aspectRatio : null)
        });
        r = OT.$.observeNodeOrChildNodeRemoval(e, function (a) {
            s && (a.some(function (a) {
                return a === g || "VIDEO" === a.nodeName
            }) && (s.destroy(), s = null), g && (OT.$.removeElement(g), g = null), h && (h.disconnect(), h = null), r && (r.disconnect(), r = null))
        });
        this.destroy = function () {
            h && (h.disconnect(), h = null);
            r && (r.disconnect(), r = null);
            s && (s.destroy(), s = null);
            e && (OT.$.removeElement(e), e = null)
        };
        Object.defineProperties(this, {
            showPoster: {
                get: function () {
                    return !OT.$.isDisplayNone(p)
                }, set: function (a) {
                    a ? OT.$.show(p) : OT.$.hide(p)
                }
            }, poster: {
                get: function () {
                    return OT.$.css(p, "backgroundImage")
                }, set: function (a) {
                    OT.$.css(p, "backgroundImage", "url(" + a + ")")
                }
            }, loading: {
                get: function () {
                    return t
                }, set: function (a) {
                    (t = a) ? OT.$.addClass(e, "OT_loading") : OT.$.removeClass(e, "OT_loading")
                }
            },
            video: {
                get: function () {
                    return s
                }, set: function (a) {
                    s && s.destroy();
                    a.appendTo(g);
                    s = a;
                    s.on({
                        orientationChanged: function () {
                            d(g, e.offsetWidth, e.offsetHeight, s.aspectRatio, s.isRotated)
                        }
                    });
                    if (s)if (a = function () {
                            d(g, e.offsetWidth, e.offsetHeight, s ? s.aspectRatio : null, s ? s.isRotated : null)
                        }, isNaN(s.aspectRatio))s.on("streamBound", a); else a()
                }
            }, domElement: {
                get: function () {
                    return e
                }
            }, domId: {
                get: function () {
                    return e.getAttribute("id")
                }
            }
        });
        this.addError = function (a, b, c) {
            e.innerHTML = "\x3cp\x3e" + a + (b ? ' \x3cspan class\x3d"ot-help-message"\x3e' +
            b + "\x3c/span\x3e" : "") + "\x3c/p\x3e";
            OT.$.addClass(e, c || "OT_subscriber_error");
            e.querySelector("p").offsetHeight > e.offsetHeight && (e.querySelector("span").style.display = "none")
        }
    }
}(window);
!function (d) {
    var a, h, g, c, b, e, l;
    a = function () {
        if (navigator.getUserMedia)return navigator.getUserMedia.bind(navigator);
        if (navigator.mozGetUserMedia)return navigator.mozGetUserMedia.bind(navigator);
        if (navigator.webkitGetUserMedia)return navigator.webkitGetUserMedia.bind(navigator)
    }();
    navigator.webkitGetUserMedia ? (webkitMediaStream.prototype.getVideoTracks || (webkitMediaStream.prototype.getVideoTracks = function () {
        return this.videoTracks
    }), webkitMediaStream.prototype.getAudioTracks || (webkitMediaStream.prototype.getAudioTracks =
        function () {
            return this.audioTracks
        }), webkitRTCPeerConnection.prototype.getLocalStreams || (webkitRTCPeerConnection.prototype.getLocalStreams = function () {
        return this.localStreams
    }), webkitRTCPeerConnection.prototype.getRemoteStreams || (webkitRTCPeerConnection.prototype.getRemoteStreams = function () {
        return this.remoteStreams
    })) : navigator.mozGetUserMedia && (MediaStream.prototype.getVideoTracks || (MediaStream.prototype.getVideoTracks = function () {
        return []
    }), MediaStream.prototype.getAudioTracks || (MediaStream.prototype.getAudioTracks =
        function () {
            return []
        }));
    h = {
        PERMISSION_DENIED: "PermissionDeniedError",
        NOT_SUPPORTED_ERROR: "NotSupportedError",
        MANDATORY_UNSATISFIED_ERROR: " ConstraintNotSatisfiedError",
        NO_DEVICES_FOUND: "NoDevicesFoundError",
        HARDWARE_UNAVAILABLE: "HardwareUnavailableError"
    };
    g = {1: "PermissionDeniedError"};
    c = {
        PermissionDeniedError: "End-user denied permission to hardware devices",
        NotSupportedError: "A constraint specified is not supported by the browser.",
        ConstraintNotSatisfiedError: "It's not possible to satisfy one or more constraints passed into the getUserMedia function",
        OverconstrainedError: "Due to changes in the environment, one or more mandatory constraints can no longer be satisfied.",
        NoDevicesFoundError: "No voice or video input devices are available on this machine.",
        HardwareUnavailableError: "The selected voice or video devices are unavailable. Verify that the chosen devices are not in use by another application."
    };
    b = function (a, b) {
        var d = b[a], e = c[d];
        e || (e = null, d = a);
        return {name: d, message: e}
    };
    e = function (a) {
        var d;
        OT.$.isObject(a) && a.name ? d = {
            name: a.name, message: a.message ||
            c[a.name], constraintName: a.constraintName
        } : OT.$.isObject(a) ? (d = b(a.code, g), a.message && (d.message = a.message), a.constraintName && (d.constraintName = a.constraintName)) : d = a && h.hasOwnProperty(a) ? b(a, h) : {message: "Unknown Error while getting user media"};
        return d
    };
    l = function (a) {
        if (!a || !OT.$.isObject(a))return !0;
        for (var b in a)if (a[b])return !1;
        return !0
    };
    OT.$.supportsWebRTC = function () {
        var a = !1, b = OT.$.browserVersion(), c = (OT.properties.minimumVersion || {})[b.browser.toLowerCase()];
        if (c && c > b.version)OT.debug("Support for",
            b.browser, "is disabled because we require", c, "but this is", b.version), a = !1; else if (navigator.webkitGetUserMedia)a = "function" === typeof webkitRTCPeerConnection && !!webkitRTCPeerConnection.prototype.addStream; else if (navigator.mozGetUserMedia && "function" === typeof mozRTCPeerConnection && 20 < b.version)try {
            new mozRTCPeerConnection, a = !0
        } catch (d) {
            a = !1
        }
        OT.$.supportsWebRTC = function () {
            return a
        };
        return a
    };
    OT.$.supportedCryptoScheme = function () {
        if (!OT.$.supportsWebRTC())return "NONE";
        var a = d.navigator.userAgent.toLowerCase().match(/chrome\/([0-9\.]+)/i);
        return a && 25 > parseFloat(a[1], 10) ? "SDES_SRTP" : "DTLS_SRTP"
    };
    OT.$.supportsBundle = function () {
        return OT.$.supportsWebRTC() && "Chrome" === OT.$.browser()
    };
    OT.$.supportsRtcpMux = function () {
        return OT.$.supportsWebRTC() && "Chrome" === OT.$.browser()
    };
    OT.$.shouldAskForDevices = function (a) {
        var b = function (b, c) {
            OT.$.shouldAskForDevices = function (a) {
                setTimeout(a.bind(null, {video: c, audio: b}))
            };
            OT.$.shouldAskForDevices(a)
        }, c = d.MediaStreamTrack;
        null != c && OT.$.isFunction(c.getSources) ? d.MediaStreamTrack.getSources(function (a) {
            var c =
                a.some(function (a) {
                    return "audio" === a.kind
                });
            a = a.some(function (a) {
                return "video" === a.kind
            });
            b(c, a)
        }) : b(!0, !0)
    };
    OT.$.getUserMedia = function (b, g, h, m, q, s, r) {
        var p = a;
        OT.$.isFunction(r) && (p = r);
        if (l(b))OT.error("Couldn't get UserMedia: All constraints were false"), h.call(null, {
            name: "NO_VALID_CONSTRAINTS",
            message: "Video and Audio was disabled, you need to enabled at least one"
        }); else {
            var u = null, v = !1;
            r = function () {
                u = null;
                v = !0;
                m && m()
            };
            var t = function (a) {
                u && clearTimeout(u);
                v && q && q();
                g.call(null, a)
            }, B = function (a) {
                u &&
                clearTimeout(u);
                v && q && q();
                var b = e(a);
                "PermissionDeniedError" === b.name ? (a = d.MediaStreamTrack, null != a && OT.$.isFunction(a.getSources) ? d.MediaStreamTrack.getSources(function (a) {
                    0 < a.length ? s.call(null, b) : h.call(null, {
                        name: "NoDevicesFoundError",
                        message: c.NoDevicesFoundError
                    })
                }) : s.call(null, b)) : h.call(null, b)
            };
            try {
                p(b, t, B)
            } catch (x) {
                OT.error("Couldn't get UserMedia: " + x.toString());
                B();
                return
            }
            u = -1 === location.protocol.indexOf("https") ? setTimeout(r, 100) : setTimeout(r, 500)
        }
    };
    OT.$.createPeerConnection = function (a,
                                          b) {
        return new (d.webkitRTCPeerConnection || d.mozRTCPeerConnection)(a, b)
    }
}(window);
!function (d) {
    function a(a, b) {
        var c = document.createElement("video");
        c.setAttribute("autoplay", "");
        c.innerHTML = a;
        if (b) {
            !0 === b.muted && (delete b.muted, c.muted = "true");
            for (var d in b)c.setAttribute(d, b[d])
        }
        return c
    }

    function h(a) {
        return c[parseInt(a, 10)] || "An unknown error occurred."
    }

    function g(a, b, c, g) {
        var n, m, q, s, r;
        navigator.mozGetUserMedia || 0 < b.getVideoTracks().length && b.getVideoTracks()[0].enabled ? (n = function () {
            clearTimeout(r);
            a.removeEventListener("loadedmetadata", m, !1);
            a.removeEventListener("error",
                q, !1);
            b.onended = null
        }, m = function () {
            n();
            c()
        }, q = function (a) {
            n();
            g("There was an unexpected problem with the Video Stream: " + h(a.target.error.code))
        }, s = function () {
            n();
            g("Stream ended while trying to bind it to a video element.")
        }, r = setTimeout(function () {
            0 === a.currentTime ? g("The video stream failed to connect. Please notify the site owner if this continues to happen.") : (OT.warn("Never got the loadedmetadata event but currentTime \x3e 0"), c())
        }.bind(this), 3E4), a.addEventListener("loadedmetadata", m, !1),
            a.addEventListener("error", q, !1), b.onended = s) : c();
        void 0 !== a.srcObject ? a.srcObject = b : void 0 !== a.mozSrcObject ? a.mozSrcObject = b : a.src = d.URL.createObjectURL(b);
        a.play()
    }

    var c = {}, b;
    b = {"0": "rotate(0deg)", 270: "rotate(90deg)", 90: "rotate(-90deg)", 180: "rotate(180deg)"};
    OT.VideoOrientation = {ROTATED_NORMAL: 0, ROTATED_LEFT: 270, ROTATED_RIGHT: 90, ROTATED_UPSIDE_DOWN: 180};
    OT.VideoElement = function (b) {
        var c, f, k, n = !1, m = !1, q, s, r, p;
        b = OT.$.defaults(b || {}, {fallbackText: "Sorry, Web RTC is not available in your browser"});
        OT.$.eventing(this);
        q = function (a) {
            a = "There was an unexpected problem with the Video Stream: " + h(a.target.error.code);
            this.trigger("error", null, a, this, "VideoElement")
        }.bind(this);
        s = function () {
            n = !0;
            f.addEventListener("error", q, !1);
            this.trigger("streamBound", this)
        }.bind(this);
        r = function (a) {
            this.trigger("loadError", OT.ExceptionCodes.P2P_CONNECTION_FAILED, a, this, "VideoElement")
        }.bind(this);
        p = function () {
            m || (OT.warn("Video element paused, auto-resuming. If you intended to do this, use publishVideo(false) or subscribeToVideo(false) instead."),
                m = !0);
            f.play()
        };
        f = a(b.fallbackText, b.attributes);
        f.addEventListener("pause", p);
        Object.defineProperties(this, {
            stream: {
                get: function () {
                    return c
                }
            }, domElement: {
                get: function () {
                    return f
                }
            }, parentElement: {
                get: function () {
                    return k
                }
            }, isBoundToStream: {
                get: function () {
                    return n
                }
            }, poster: {
                get: function () {
                    return f.getAttribute("poster")
                }, set: function (a) {
                    f.setAttribute("poster", a)
                }
            }
        });
        this.appendTo = function (a) {
            k = a;
            k.appendChild(f);
            return this
        };
        this.bindToStream = function (a) {
            n = !1;
            c = a;
            g(f, c, s, r);
            return this
        };
        this.unbindStream =
            function () {
                if (!c)return this;
                f && (navigator.mozGetUserMedia ? f.mozSrcObject = null : d.URL.revokeObjectURL(f.src));
                c = null;
                return this
            };
        this.setAudioVolume = function (a) {
            f && (f.volume = OT.$.roundFloat(a / 100, 2))
        };
        this.getAudioVolume = function () {
            return f ? parseInt(100 * f.volume, 10) : 50
        };
        this.whenTimeIncrements = function (a, b) {
            if (f) {
                var c, d;
                d = function () {
                    !c || c >= f.currentTime ? c = f.currentTime : (f.removeEventListener("timeupdate", d, !1), a.call(b, this))
                }.bind(this);
                f.addEventListener("timeupdate", d, !1)
            }
        };
        this.destroy = function () {
            this.off();
            this.unbindStream();
            f && (f.removeEventListener("pause", p), OT.$.removeElement(f), f = null);
            k = null
        }
    };
    OT.$.canDefineProperty && Object.defineProperties(OT.VideoElement.prototype, {
        imgData: {
            get: function () {
                var a, b;
                a = OT.$.createElement("canvas", {
                    width: this.domElement.videoWidth,
                    height: this.domElement.videoHeight,
                    style: {display: "none"}
                });
                document.body.appendChild(a);
                try {
                    a.getContext("2d").drawImage(this.domElement, 0, 0, a.width, a.height)
                } catch (c) {
                    return OT.warn("Cannot get image data yet"), null
                }
                b = a.toDataURL("image/png");
                OT.$.removeElement(a);
                return b.replace("data:image/png;base64,", "").trim()
            }
        }, videoWidth: {
            get: function () {
                return this.domElement["video" + (this.isRotated ? "Height" : "Width")]
            }
        }, videoHeight: {
            get: function () {
                return this.domElement["video" + (this.isRotated ? "Width" : "Height")]
            }
        }, aspectRatio: {
            get: function () {
                return (this.videoWidth + 0) / this.videoHeight
            }
        }, isRotated: {
            get: function () {
                return this._orientation && (270 === this._orientation.videoOrientation || 90 === this._orientation.videoOrientation)
            }
        }, orientation: {
            get: function () {
                return this._orientation
            },
            set: function (a) {
                var c = b[a.videoOrientation] || b.ROTATED_NORMAL;
                this._orientation = a;
                switch (OT.$.browser()) {
                    case "Chrome":
                    case "Safari":
                        this.domElement.style.webkitTransform = c;
                        break;
                    case "IE":
                        this.domElement.style.msTransform = c;
                        break;
                    default:
                        this.domElement.style.transform = c
                }
                this.trigger("orientationChanged")
            }
        }
    });
    d.MediaError && (c[d.MediaError.MEDIA_ERR_ABORTED] = "The fetching process for the media resource was aborted by the user agent at the user's request.", c[d.MediaError.MEDIA_ERR_NETWORK] = "A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.",
        c[d.MediaError.MEDIA_ERR_DECODE] = "An error of some description occurred while decoding the media resource, after the resource was established to be  usable.", c[d.MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED] = "The media resource indicated by the src attribute was not suitable.")
}(window);
!function (d) {
    var a = [], h = !1;
    OT.Analytics = function () {
        var g = OT.properties.loggingURL + "/logging/ClientEvent", c = OT.properties.loggingURL + "/logging/ClientQos", b = {}, e, l = function (a, b, d) {
            OT.$.post(b ? c : g, {body: a, headers: {"Content-Type": "application/x-www-form-urlencoded"}}, d)
        }, f = function () {
            if (!h && 0 < a.length) {
                h = !0;
                var b = a[0], c = function () {
                    a.shift();
                    h = !1;
                    f()
                };
                b && l(b.data, b.isQos, function (a) {
                    if (a)OT.debug("Failed to send ClientEvent, moving on to the next item."); else b.onComplete();
                    setTimeout(c, 50)
                })
            }
        };
        e = {
            payloadType: "payload_type",
            partnerId: "partner_id",
            streamId: "stream_id",
            sessionId: "session_id",
            connectionId: "connection_id",
            widgetType: "widget_type",
            widgetId: "widget_id",
            avgAudioBitrate: "avg_audio_bitrate",
            avgVideoBitrate: "avg_video_bitrate",
            localCandidateType: "local_candidate_type",
            remoteCandidateType: "remote_candidate_type",
            transportType: "transport_type"
        };
        this.logError = function (a, c, d, f, e) {
            e || (e = {});
            d = e.partnerId;
            if (!0 === OT.Config.get("exceptionLogging", "enabled", d)) {
                var g;
                d ? (g = [d, c, a].join("_"), g = 100 >= (b[g] || 0)) : g = !1;
                if (!g) {
                    d =
                        [d, c, a].join("_");
                    var h = this.escapePayload(OT.$.extend(f || {}, {message: h, userAgent: navigator.userAgent}));
                    b[d] = "undefined" !== typeof b[d] ? b[d] + 1 : 1;
                    return this.logEvent(OT.$.extend(e, {action: c + "." + a, payloadType: h[0], payload: h[1]}))
                }
            }
        };
        this.logEvent = function (b) {
            var c = b.partnerId;
            b || (b = {});
            b = OT.$.extend({
                variation: "",
                guid: this.getClientGuid(),
                widget_id: "",
                session_id: "",
                connection_id: "",
                stream_id: "",
                partner_id: c,
                source: d.location.href,
                section: "",
                build: ""
            }, b);
            for (var g in e)e.hasOwnProperty(g) && b[g] && (b[e[g]] =
                b[g], delete b[g]);
            a.push({
                data: b, onComplete: function () {
                }, isQos: !1
            });
            f()
        };
        this.logQOS = function (b) {
            var c = b.partnerId;
            b || (b = {});
            b = OT.$.extend({
                guid: this.getClientGuid(),
                widget_id: "",
                session_id: "",
                connection_id: "",
                stream_id: "",
                partner_id: c,
                source: d.location.href,
                build: "",
                duration: 0
            }, b);
            for (var g in e)e.hasOwnProperty(g) && b[g] && (b[e[g]] = b[g], delete b[g]);
            a.push({
                data: b, onComplete: function () {
                }, isQos: !0
            });
            f()
        };
        this.escapePayload = function (a) {
            var b = [], c = [], d;
            for (d in a)a.hasOwnProperty(d) && (null !== a[d] && void 0 !==
            a[d]) && (b.push(a[d] ? a[d].toString().replace("|", "\\|") : ""), c.push(d.toString().replace("|", "\\|")));
            return [c.join("|"), b.join("|")]
        };
        this.getClientGuid = function () {
            var a = OT.$.getCookie("opentok_client_id");
            a || (a = OT.$.uuid(), OT.$.setCookie("opentok_client_id", a));
            this.getClientGuid = function () {
                return a
            };
            return a
        }
    }
}(window);
!function (d) {
    "file:" === location.protocol && alert("You cannot test a page using WebRTC through the file system due to browser permissions. You must run it over a web server.");
    d.OT || (d.OT = {});
    !d.URL && d.webkitURL && (d.URL = d.webkitURL);
    var a, h = document.location.hash;
    OT.initSession = function (a, c) {
        null == c && (c = a, a = null);
        var b = OT.sessions.get(c);
        b || (b = new OT.Session(a, c), OT.sessions.add(b));
        return b
    };
    OT.initPublisher = function (a, c, b, d) {
        OT.debug("OT.initPublisher(" + a + ")");
        if (null != a && !("object" === typeof a && a.nodeType ===
            Node.ELEMENT_NODE || "string" === typeof a && document.getElementById(a)) && "function" !== typeof a)a = c, c = b, b = d;
        "function" === typeof a && (b = a, a = c = void 0);
        "function" === typeof c && (b = c, c = void 0);
        var h = new OT.Publisher;
        OT.publishers.add(h);
        var f = function (a) {
            a ? OT.dispatchError(a.code, a.message, b, h.session) : b && OT.$.isFunction(b) && b.apply(null, arguments)
        }, k = function (a) {
            h.off("publishComplete", n);
            f(a)
        }, n = function (a) {
            h.off("initSuccess", k);
            a && f(a)
        };
        h.once("initSuccess", k);
        h.once("publishComplete", n);
        h.publish(a, c);
        return h
    };
    OT.checkSystemRequirements = function () {
        OT.debug("OT.checkSystemRequirements()");
        var a = OT.$.supportsWebSockets() && OT.$.supportsWebRTC() ? this.HAS_REQUIREMENTS : this.NOT_HAS_REQUIREMENTS;
        OT.checkSystemRequirements = function () {
            OT.debug("OT.checkSystemRequirements()");
            return a
        };
        return a
    };
    OT.upgradeSystemRequirements = function () {
        OT.onLoad(function () {
            document.body.appendChild(function () {
                var a = document.createElement("iframe");
                a.id = "_upgradeFlash";
                a.style.position = "absolute";
                a.style.position = "fixed";
                a.style.height =
                    "100%";
                a.style.width = "100%";
                a.style.top = "0px";
                a.style.left = "0px";
                a.style.right = "0px";
                a.style.bottom = "0px";
                a.style.zIndex = 1E3;
                try {
                    a.style.backgroundColor = "rgba(0,0,0,0.2)"
                } catch (c) {
                    a.style.backgroundColor = "transparent", a.setAttribute("allowTransparency", "true")
                }
                a.setAttribute("frameBorder", "0");
                a.frameBorder = "0";
                a.scrolling = "no";
                a.setAttribute("scrolling", "no");
                var b = OT.$.browserVersion(), b = OT.properties.minimumVersion[b.browser.toLowerCase()];
                a.src = OT.properties.assetURL + "/html/upgrade.html#" + encodeURIComponent(b ?
                    "true" : "false") + "," + encodeURIComponent(JSON.stringify(OT.properties.minimumVersion)) + "|" + encodeURIComponent(document.location.href);
                return a
            }());
            a && clearInterval(a);
            a = setInterval(function () {
                var a = document.location.hash, c = /^#?\d+&/;
                a !== h && c.test(a) && (h = a, "close_window" === a.replace(c, "") && (document.body.removeChild(document.getElementById("_upgradeFlash")), document.location.hash = ""))
            }, 100)
        })
    };
    OT.reportIssue = function () {
        OT.warn("ToDo: haven't yet implemented OT.reportIssue")
    };
    OT.components = {};
    OT.sessions =
    {};
    OT.rtc = {};
    OT.APIKEY = function () {
        var a = document.getElementsByTagName("script"), a = a[a.length - 1], a = a.getAttribute("src") || a.src;
        return (a = a.match(/[\?\&]apikey=([^&]+)/i)) ? a[1] : ""
    }();
    OT.HAS_REQUIREMENTS = 1;
    OT.NOT_HAS_REQUIREMENTS = 0;
    d.OT || (d.OT = OT);
    d.TB || (d.TB = OT)
}(window);
!function () {
    OT.Collection = function (d) {
        var a = [], h = {}, g = d || "id";
        OT.$.eventing(this, !0);
        var c = function (a) {
            this.trigger("update", a);
            this.trigger("update:" + a.target.id, a)
        }.bind(this), b = function (a) {
            this.remove(a.target, a.reason)
        }.bind(this);
        this.reset = function () {
            a.forEach(function (a) {
                a.off("updated", c, this);
                a.off("destroyed", b, this)
            }, this);
            a = [];
            h = {}
        };
        this.destroy = function () {
            a.forEach(function (a) {
                a && "function" === typeof a.destroy && a.destroy(void 0, !0)
            });
            this.reset();
            this.off()
        };
        this.get = function (b) {
            return b &&
            void 0 !== h[b] ? a[h[b]] : void 0
        };
        this.has = function (a) {
            return a && void 0 !== h[a]
        };
        this.toString = function () {
            return a.toString()
        };
        this.where = function (b, c) {
            return OT.$.isFunction(b) ? a.filter(b, c) : a.filter(function (a) {
                for (var c in b)if (a[c] !== b[c])return !1;
                return !0
            })
        };
        this.find = function (b, c) {
            var d;
            d = OT.$.isFunction(b) ? b : function (a) {
                for (var c in b)if (a[c] !== b[c])return !1;
                return !0
            };
            d = d.bind(c);
            for (var g = 0; g < a.length; ++g)if (!0 === d(a[g]))return a[g];
            return null
        };
        this.add = function (d) {
            var l = d[g];
            if (this.has(l))return OT.warn("Model " +
            l + " is already in the collection", a), this;
            h[l] = a.push(d) - 1;
            d.on("updated", c, this);
            d.on("destroyed", b, this);
            this.trigger("add", d);
            this.trigger("add:" + l, d);
            return this
        };
        this.remove = function (d, l) {
            var f = d[g];
            a.splice(h[f], 1);
            for (var k = h[f]; k < a.length; ++k)h[a[k][g]] = k;
            delete h[f];
            d.off("updated", c, this);
            d.off("destroyed", b, this);
            this.trigger("remove", d, l);
            this.trigger("remove:" + f, d, l);
            return this
        };
        this._triggerAddEvents = function () {
            this.where.apply(this, arguments).forEach(function (a) {
                this.trigger("add",
                    a);
                this.trigger("add:" + a[g], a)
            }, this)
        };
        OT.$.defineGetters(this, {
            length: function () {
                return a.length
            }
        })
    }
}(this);
!function () {
    OT.Event = OT.$.eventing.Event();
    OT.Event.names = {
        ACTIVE: "active",
        INACTIVE: "inactive",
        UNKNOWN: "unknown",
        PER_SESSION: "perSession",
        PER_STREAM: "perStream",
        EXCEPTION: "exception",
        ISSUE_REPORTED: "issueReported",
        SESSION_CONNECTED: "sessionConnected",
        SESSION_DISCONNECTED: "sessionDisconnected",
        STREAM_CREATED: "streamCreated",
        STREAM_DESTROYED: "streamDestroyed",
        CONNECTION_CREATED: "connectionCreated",
        CONNECTION_DESTROYED: "connectionDestroyed",
        SIGNAL: "signal",
        STREAM_PROPERTY_CHANGED: "streamPropertyChanged",
        MICROPHONE_LEVEL_CHANGED: "microphoneLevelChanged",
        RESIZE: "resize",
        SETTINGS_BUTTON_CLICK: "settingsButtonClick",
        DEVICE_INACTIVE: "deviceInactive",
        INVALID_DEVICE_NAME: "invalidDeviceName",
        ACCESS_ALLOWED: "accessAllowed",
        ACCESS_DENIED: "accessDenied",
        ACCESS_DIALOG_OPENED: "accessDialogOpened",
        ACCESS_DIALOG_CLOSED: "accessDialogClosed",
        ECHO_CANCELLATION_MODE_CHANGED: "echoCancellationModeChanged",
        PUBLISHER_DESTROYED: "destroyed",
        SUBSCRIBER_DESTROYED: "destroyed",
        DEVICES_DETECTED: "devicesDetected",
        DEVICES_SELECTED: "devicesSelected",
        CLOSE_BUTTON_CLICK: "closeButtonClick",
        MICLEVEL: "microphoneActivityLevel",
        MICGAINCHANGED: "microphoneGainChanged",
        ENV_LOADED: "envLoaded"
    };
    OT.ExceptionCodes = {
        JS_EXCEPTION: 2E3,
        AUTHENTICATION_ERROR: 1004,
        INVALID_SESSION_ID: 1005,
        CONNECT_FAILED: 1006,
        CONNECT_REJECTED: 1007,
        CONNECTION_TIMEOUT: 1008,
        NOT_CONNECTED: 1010,
        P2P_CONNECTION_FAILED: 1013,
        API_RESPONSE_FAILURE: 1014,
        UNABLE_TO_PUBLISH: 1500,
        UNABLE_TO_SUBSCRIBE: 1501,
        UNABLE_TO_FORCE_DISCONNECT: 1520,
        UNABLE_TO_FORCE_UNPUBLISH: 1530
    };
    OT.ExceptionEvent = function (a,
                                  c, d, f, g, h) {
        OT.Event.call(this, a);
        this.message = c;
        this.title = d;
        this.code = f;
        this.component = g;
        this.target = h
    };
    OT.IssueReportedEvent = function (a, c) {
        OT.Event.call(this, a);
        this.issueId = c
    };
    OT.EnvLoadedEvent = function (a) {
        OT.Event.call(this, a)
    };
    var d = !1;
    OT.ConnectionEvent = function (a, c, g) {
        OT.Event.call(this, a, !1);
        OT.$.canDefineProperty ? Object.defineProperty(this, "connections", {
            get: function () {
                d || (OT.warn("OT.ConnectionEvent connections property is deprecated, use connection instead."), d = !0);
                return [c]
            }
        }) : this.connections =
            [c];
        this.connection = c;
        this.reason = g
    };
    var a = !1;
    OT.StreamEvent = function (b, c, d, f) {
        OT.Event.call(this, b, f);
        OT.$.canDefineProperty ? Object.defineProperty(this, "streams", {
            get: function () {
                a || (OT.warn("OT.StreamEvent streams property is deprecated, use stream instead."), a = !0);
                return [c]
            }
        }) : this.streams = [c];
        this.stream = c;
        this.reason = d
    };
    var h = !1, g = !1, c = !1;
    OT.SessionConnectEvent = function (a) {
        OT.Event.call(this, a, !1);
        OT.$.canDefineProperty ? Object.defineProperties(this, {
            connections: {
                get: function () {
                    h || (OT.warn("OT.SessionConnectedEvent no longer includes connections. Listen for connectionCreated events instead."),
                        h = !0);
                    return []
                }
            }, streams: {
                get: function () {
                    OT.warn("OT.SessionConnectedEvent no longer includes streams. Listen for streamCreated events instead.");
                    h = !0;
                    return []
                }
            }, archives: {
                get: function () {
                    g || (OT.warn("OT.SessionConnectedEvent no longer includes archives. Listen for archiveStarted events instead."), g = !0);
                    return []
                }
            }, groups: {
                get: function () {
                    c || (OT.error("OT.SessionConnectedEvent no longer includes groups. There is no equivelant in OpenTok v2.2"), c = !0);
                    return []
                }
            }
        }) : (this.connections = [], this.streams = [],
            this.archives = [], this.groups = [])
    };
    OT.SessionDisconnectEvent = function (a, c, d) {
        OT.Event.call(this, a, d);
        this.reason = c
    };
    OT.StreamPropertyChangedEvent = function (a, c, d, f, g) {
        OT.Event.call(this, a, !1);
        this.type = a;
        this.stream = c;
        this.changedProperty = d;
        this.oldValue = f;
        this.newValue = g
    };
    OT.ArchiveEvent = function (a, c) {
        OT.Event.call(this, a, !1);
        this.type = a;
        this.id = c.id;
        this.name = c.name;
        this.status = c.status;
        this.archive = c
    };
    OT.ArchiveUpdatedEvent = function (a, c, d, f) {
        OT.Event.call(this, "updated", !1);
        this.target = a;
        this.changedProperty =
            c;
        this.oldValue = d;
        this.newValue = f
    };
    OT.SignalEvent = function (a, c, d) {
        OT.Event.call(this, a ? "signal:" + a : OT.Event.names.SIGNAL, !1);
        this.data = c;
        this.from = d
    };
    OT.StreamUpdatedEvent = function (a, c, d, f) {
        OT.Event.call(this, "updated", !1);
        this.target = a;
        this.changedProperty = c;
        this.oldValue = d;
        this.newValue = f
    };
    OT.DestroyedEvent = function (a, c, d) {
        OT.Event.call(this, a, !1);
        this.target = c;
        this.reason = d
    }
}(window);
(function (d) {
    function a(a, b, c) {
        return b <= a && a <= c
    }

    function h(a, b) {
        return Math.floor(a / b)
    }

    function g(a) {
        var b = 0;
        this.get = function () {
            return b >= a.length ? -1 : Number(a[b])
        };
        this.offset = function (c) {
            b += c;
            if (0 > b)throw Error("Seeking past start of the buffer");
            if (b > a.length)throw Error("Seeking past EOF");
        };
        this.match = function (c) {
            if (c.length > b + a.length)return !1;
            var d;
            for (d = 0; d < c.length; d += 1)if (Number(a[b + d]) !== c[d])return !1;
            return !0
        }
    }

    function c(a) {
        var b = 0;
        this.emit = function (c) {
            var d = -1, f;
            for (f = 0; f < arguments.length; ++f)d =
                Number(arguments[f]), a[b++] = d;
            return d
        }
    }

    function b(b) {
        var c = 0, d = function (b) {
            for (var c = [], d = 0, f = b.length; d < b.length;) {
                var e = b.charCodeAt(d);
                if (a(e, 55296, 57343))if (a(e, 56320, 57343))c.push(65533); else if (d === f - 1)c.push(65533); else {
                    var g = b.charCodeAt(d + 1);
                    a(g, 56320, 57343) ? (e &= 1023, g &= 1023, d += 1, c.push(65536 + (e << 10) + g)) : c.push(65533)
                } else c.push(e);
                d += 1
            }
            return c
        }(b);
        this.offset = function (a) {
            c += a;
            if (0 > c)throw Error("Seeking past start of the buffer");
            if (c > d.length)throw Error("Seeking past EOF");
        };
        this.get =
            function () {
                return c >= d.length ? -1 : d[c]
            }
    }

    function e() {
        var a = "";
        this.string = function () {
            return a
        };
        this.emit = function (b) {
            65535 >= b ? a += String.fromCharCode(b) : (b -= 65536, a += String.fromCharCode(55296 + (b >> 10 & 1023)), a += String.fromCharCode(56320 + (b & 1023)))
        }
    }

    function l(a) {
        this.name = "EncodingError";
        this.message = a;
        this.code = 0
    }

    function f(a, b) {
        if (a)throw new l("Decoder error");
        return b || 65533
    }

    function k(a) {
        throw new l("The code point " + a + " could not be encoded.");
    }

    function n(a) {
        a = String(a).trim().toLowerCase();
        return Object.prototype.hasOwnProperty.call(O,
            a) ? O[a] : null
    }

    function m(a, b) {
        return (b || [])[a] || null
    }

    function q(a, b) {
        var c = b.indexOf(a);
        return -1 === c ? null : c
    }

    function s(b) {
        var c = b.fatal, d = 0, e = 0, g = 0, h = 0;
        this.decode = function (b) {
            var k = b.get();
            if (-1 === k)return 0 !== e ? f(c) : -1;
            b.offset(1);
            if (0 === e) {
                if (a(k, 0, 127))return k;
                if (a(k, 194, 223))e = 1, h = 128, d = k - 192; else if (a(k, 224, 239))e = 2, h = 2048, d = k - 224; else if (a(k, 240, 244))e = 3, h = 65536, d = k - 240; else return f(c);
                d *= Math.pow(64, e);
                return null
            }
            if (!a(k, 128, 191))return h = g = e = d = 0, b.offset(-1), f(c);
            g += 1;
            d += (k - 128) * Math.pow(64,
                e - g);
            if (g !== e)return null;
            b = d;
            k = h;
            h = g = e = d = 0;
            return a(b, k, 1114111) && !a(b, 55296, 57343) ? b : f(c)
        }
    }

    function r(b) {
        this.encode = function (b, c) {
            var d = c.get();
            if (-1 === d)return -1;
            c.offset(1);
            if (a(d, 55296, 57343))return k(d);
            if (a(d, 0, 127))return b.emit(d);
            var f, e;
            a(d, 128, 2047) ? (f = 1, e = 192) : a(d, 2048, 65535) ? (f = 2, e = 224) : a(d, 65536, 1114111) && (f = 3, e = 240);
            for (e = b.emit(h(d, Math.pow(64, f)) + e); 0 < f;)e = h(d, Math.pow(64, f - 1)), e = b.emit(128 + e % 64), f -= 1;
            return e
        }
    }

    function p(b, c) {
        var d = c.fatal;
        this.decode = function (c) {
            var e = c.get();
            if (-1 === e)return -1;
            c.offset(1);
            if (a(e, 0, 127))return e;
            c = b[e - 128];
            return null === c ? f(d) : c
        }
    }

    function u(b, c) {
        this.encode = function (c, d) {
            var f = d.get();
            if (-1 === f)return -1;
            d.offset(1);
            if (a(f, 0, 127))return c.emit(f);
            var e = q(f, b);
            null === e && k(f);
            return c.emit(e + 128)
        }
    }

    function v(b, c) {
        var d = c.fatal, e = 0, g = 0, h = 0;
        this.decode = function (c) {
            var k = c.get();
            if (-1 === k && 0 === e && 0 === g && 0 === h)return -1;
            if (-1 === k && (0 !== e || 0 !== g || 0 !== h))h = g = e = 0, f(d);
            c.offset(1);
            var l;
            if (0 !== h) {
                l = null;
                if (a(k, 48, 57))if (k = 10 * (126 * (10 * (e - 129) + (g - 48)) +
                    (h - 129)) + k - 48, 39419 < k && 189E3 > k || 1237575 < k)l = null; else {
                    var J = 0;
                    l = 0;
                    var n = A.gb18030, H;
                    for (H = 0; H < n.length; ++H) {
                        var r = n[H];
                        if (r[0] <= k)J = r[0], l = r[1]; else break
                    }
                    l = l + k - J
                }
                h = g = e = 0;
                return null === l ? (c.offset(-3), f(d)) : l
            }
            if (0 !== g) {
                if (a(k, 129, 254))return h = k, null;
                c.offset(-2);
                g = e = 0;
                return f(d)
            }
            if (0 !== e) {
                if (a(k, 48, 57) && b)return g = k, null;
                l = e;
                J = null;
                e = 0;
                n = 127 > k ? 64 : 65;
                if (a(k, 64, 126) || a(k, 128, 254))J = 190 * (l - 129) + (k - n);
                l = null === J ? null : m(J, A.gbk);
                null === J && c.offset(-1);
                return null === l ? f(d) : l
            }
            return a(k, 0, 127) ? k : 128 ===
            k ? 8364 : a(k, 129, 254) ? (e = k, null) : f(d)
        }
    }

    function t(b, c) {
        this.encode = function (c, d) {
            var f = d.get();
            if (-1 === f)return -1;
            d.offset(1);
            if (a(f, 0, 127))return c.emit(f);
            var e = q(f, A.gbk);
            if (null !== e)return f = h(e, 190) + 129, e %= 190, c.emit(f, e + (63 > e ? 64 : 65));
            if (null === e && !b)return k(f);
            var g = e = 0, l = A.gb18030, m;
            for (m = 0; m < l.length; ++m) {
                var J = l[m];
                if (J[1] <= f)e = J[1], g = J[0]; else break
            }
            e = g + f - e;
            f = h(h(h(e, 10), 126), 10);
            e -= 12600 * f;
            g = h(h(e, 10), 126);
            e -= 1260 * g;
            l = h(e, 10);
            return c.emit(f + 129, g + 48, l + 129, e - 10 * l + 48)
        }
    }

    function B(b) {
        var c =
            b.fatal, d = !1, e = 0;
        this.decode = function (b) {
            var g = b.get();
            if (-1 === g && 0 === e)return -1;
            if (-1 === g && 0 !== e)return e = 0, f(c);
            b.offset(1);
            if (126 === e) {
                e = 0;
                if (123 === g)return d = !0, null;
                if (125 === g)return d = !1, null;
                if (126 === g)return 126;
                if (10 === g)return null;
                b.offset(-1);
                return f(c)
            }
            if (0 !== e) {
                b = e;
                e = 0;
                var h = null;
                a(g, 33, 126) && (h = m(190 * (b - 1) + (g + 63), A.gbk));
                10 === g && (d = !1);
                return null === h ? f(c) : h
            }
            if (126 === g)return e = 126, null;
            if (d) {
                if (a(g, 32, 127))return e = g, null;
                10 === g && (d = !1);
                return f(c)
            }
            return a(g, 0, 127) ? g : f(c)
        }
    }

    function x(b) {
        var c =
            !1;
        this.encode = function (b, d) {
            var f = d.get();
            if (-1 === f)return -1;
            d.offset(1);
            if (a(f, 0, 127) && c)return d.offset(-1), c = !1, b.emit(126, 125);
            if (126 === f)return b.emit(126, 126);
            if (a(f, 0, 127))return b.emit(f);
            if (!c)return d.offset(-1), c = !0, b.emit(126, 123);
            var e = q(f, A.gbk);
            if (null === e)return k(f);
            var g = h(e, 190) + 1, e = e % 190 - 63;
            return !a(g, 33, 126) || !a(e, 33, 126) ? k(f) : b.emit(g, e)
        }
    }

    function D(b) {
        var c = b.fatal, d = 0, e = null;
        this.decode = function (b) {
            if (null !== e)return b = e, e = null, b;
            var g = b.get();
            if (-1 === g && 0 === d)return -1;
            if (-1 ===
                g && 0 !== d)return d = 0, f(c);
            b.offset(1);
            if (0 !== d) {
                var h = d, k = null;
                d = 0;
                var l = 127 > g ? 64 : 98;
                if (a(g, 64, 126) || a(g, 161, 254))k = 157 * (h - 129) + (g - l);
                if (1133 === k)return e = 772, 202;
                if (1135 === k)return e = 780, 202;
                if (1164 === k)return e = 772, 234;
                if (1166 === k)return e = 780, 234;
                g = null === k ? null : m(k, A.big5);
                null === k && b.offset(-1);
                return null === g ? f(c) : g
            }
            return a(g, 0, 127) ? g : a(g, 129, 254) ? (d = g, null) : f(c)
        }
    }

    function w(b) {
        this.encode = function (b, c) {
            var d = c.get();
            if (-1 === d)return -1;
            c.offset(1);
            if (a(d, 0, 127))return b.emit(d);
            var f = q(d, A.big5);
            if (null === f)return k(d);
            d = h(f, 157) + 129;
            f %= 157;
            return b.emit(d, f + (63 > f ? 64 : 98))
        }
    }

    function E(b) {
        var c = b.fatal, d = 0, e = 0;
        this.decode = function (b) {
            var g = b.get();
            if (-1 === g) {
                if (0 === d && 0 === e)return -1;
                e = d = 0;
                return f(c)
            }
            b.offset(1);
            var h, k;
            return 0 !== e ? (h = e, e = 0, k = null, a(h, 161, 254) && a(g, 161, 254) && (k = m(94 * (h - 161) + g - 161, A.jis0212)), a(g, 161, 254) || b.offset(-1), null === k ? f(c) : k) : 142 === d && a(g, 161, 223) ? (d = 0, 65377 + g - 161) : 143 === d && a(g, 161, 254) ? (d = 0, e = g, null) : 0 !== d ? (h = d, d = 0, k = null, a(h, 161, 254) && a(g, 161, 254) && (k = m(94 * (h - 161) +
            g - 161, A.jis0208)), a(g, 161, 254) || b.offset(-1), null === k ? f(c) : k) : a(g, 0, 127) ? g : 142 === g || 143 === g || a(g, 161, 254) ? (d = g, null) : f(c)
        }
    }

    function G(b) {
        this.encode = function (b, c) {
            var d = c.get();
            if (-1 === d)return -1;
            c.offset(1);
            if (a(d, 0, 127))return b.emit(d);
            if (165 === d)return b.emit(92);
            if (8254 === d)return b.emit(126);
            if (a(d, 65377, 65439))return b.emit(142, d - 65377 + 161);
            var f = q(d, A.jis0208);
            if (null === f)return k(d);
            d = h(f, 94) + 161;
            return b.emit(d, f % 94 + 161)
        }
    }

    function K(b) {
        var c = b.fatal, d = 0, e = !1, g = 0;
        this.decode = function (b) {
            var h =
                b.get();
            -1 !== h && b.offset(1);
            switch (d) {
                default:
                case 0:
                    return 27 === h ? (d = 1, null) : a(h, 0, 127) ? h : -1 === h ? -1 : f(c);
                case 1:
                    if (36 === h || 40 === h)return g = h, d = 2, null;
                    -1 !== h && b.offset(-1);
                    d = 0;
                    return f(c);
                case 2:
                    var k = g;
                    g = 0;
                    if (36 === k && (64 === h || 66 === h))return e = !1, d = 4, null;
                    if (36 === k && 40 === h)return d = 3, null;
                    if (40 === k && (66 === h || 74 === h))return d = 0, null;
                    if (40 === k && 73 === h)return d = 6, null;
                    -1 === h ? b.offset(-1) : b.offset(-2);
                    d = 0;
                    return f(c);
                case 3:
                    if (68 === h)return e = !0, d = 4, null;
                    -1 === h ? b.offset(-2) : b.offset(-3);
                    d = 0;
                    return f(c);
                case 4:
                    if (10 === h)return d = 0, f(c, 10);
                    if (27 === h)return d = 1, null;
                    if (-1 === h)return -1;
                    g = h;
                    d = 5;
                    return null;
                case 5:
                    d = 4;
                    if (-1 === h)return f(c);
                    b = null;
                    k = 94 * (g - 33) + h - 33;
                    a(g, 33, 126) && a(h, 33, 126) && (b = !1 === e ? m(k, A.jis0208) : m(k, A.jis0212));
                    return null === b ? f(c) : b;
                case 6:
                    return 27 === h ? (d = 1, null) : a(h, 33, 95) ? 65377 + h - 33 : -1 === h ? -1 : f(c)
            }
        }
    }

    function C(b) {
        var c = 0;
        this.encode = function (b, d) {
            var f = d.get();
            if (-1 === f)return -1;
            d.offset(1);
            if ((a(f, 0, 127) || 165 === f || 8254 === f) && 0 !== c)return d.offset(-1), c = 0, b.emit(27, 40, 66);
            if (a(f,
                    0, 127))return b.emit(f);
            if (165 === f)return b.emit(92);
            if (8254 === f)return b.emit(126);
            if (a(f, 65377, 65439) && 2 !== c)return d.offset(-1), c = 2, b.emit(27, 40, 73);
            if (a(f, 65377, 65439))return b.emit(f - 65377 - 33);
            if (1 !== c)return d.offset(-1), c = 1, b.emit(27, 36, 66);
            var e = q(f, A.jis0208);
            if (null === e)return k(f);
            f = h(e, 94) + 33;
            return b.emit(f, e % 94 + 33)
        }
    }

    function I(b) {
        var c = b.fatal, d = 0;
        this.decode = function (b) {
            var e = b.get();
            if (-1 === e && 0 === d)return -1;
            if (-1 === e && 0 !== d)return d = 0, f(c);
            b.offset(1);
            if (0 !== d) {
                var g = d;
                d = 0;
                if (a(e,
                        64, 126) || a(e, 128, 252))return b = m(188 * (g - (160 > g ? 129 : 193)) + e - (127 > e ? 64 : 65), A.jis0208), null === b ? f(c) : b;
                b.offset(-1);
                return f(c)
            }
            return a(e, 0, 128) ? e : a(e, 161, 223) ? 65377 + e - 161 : a(e, 129, 159) || a(e, 224, 252) ? (d = e, null) : f(c)
        }
    }

    function L(b) {
        this.encode = function (b, c) {
            var d = c.get();
            if (-1 === d)return -1;
            c.offset(1);
            if (a(d, 0, 128))return b.emit(d);
            if (165 === d)return b.emit(92);
            if (8254 === d)return b.emit(126);
            if (a(d, 65377, 65439))return b.emit(d - 65377 + 161);
            var f = q(d, A.jis0208);
            if (null === f)return k(d);
            d = h(f, 188);
            f %= 188;
            return b.emit(d +
            (31 > d ? 129 : 193), f + (63 > f ? 64 : 65))
        }
    }

    function z(b) {
        var c = b.fatal, d = 0;
        this.decode = function (b) {
            var e = b.get();
            if (-1 === e && 0 === d)return -1;
            if (-1 === e && 0 !== d)return d = 0, f(c);
            b.offset(1);
            if (0 !== d) {
                var g = d, h = null;
                d = 0;
                if (a(g, 129, 198)) {
                    var k = 178 * (g - 129);
                    a(e, 65, 90) ? h = k + e - 65 : a(e, 97, 122) ? h = k + 26 + e - 97 : a(e, 129, 254) && (h = k + 26 + 26 + e - 129)
                }
                a(g, 199, 253) && a(e, 161, 254) && (h = 12460 + 94 * (g - 199) + (e - 161));
                e = null === h ? null : m(h, A["euc-kr"]);
                null === h && b.offset(-1);
                return null === e ? f(c) : e
            }
            return a(e, 0, 127) ? e : a(e, 129, 253) ? (d = e, null) : f(c)
        }
    }

    function F(b) {
        this.encode =
            function (b, c) {
                var d = c.get();
                if (-1 === d)return -1;
                c.offset(1);
                if (a(d, 0, 127))return b.emit(d);
                var f = q(d, A["euc-kr"]);
                if (null === f)return k(d);
                if (12460 > f)return d = h(f, 178) + 129, f %= 178, b.emit(d, f + (26 > f ? 65 : 52 > f ? 71 : 77));
                f -= 12460;
                d = h(f, 94) + 199;
                return b.emit(d, f % 94 + 161)
            }
    }

    function H(b) {
        var c = b.fatal, d = 0, e = 0;
        this.decode = function (b) {
            var g = b.get();
            -1 !== g && b.offset(1);
            switch (d) {
                default:
                case 0:
                    return 14 === g ? (d = 4, null) : 15 === g ? null : 27 === g ? (d = 1, null) : a(g, 0, 127) ? g : -1 === g ? -1 : f(c);
                case 1:
                    if (36 === g)return d = 2, null;
                    -1 !== g &&
                    b.offset(-1);
                    d = 0;
                    return f(c);
                case 2:
                    if (41 === g)return d = 3, null;
                    -1 === g ? b.offset(-1) : b.offset(-2);
                    d = 0;
                    return f(c);
                case 3:
                    if (67 === g)return d = 0, null;
                    -1 === g ? b.offset(-2) : b.offset(-3);
                    d = 0;
                    return f(c);
                case 4:
                    if (10 === g)return d = 0, f(c, 10);
                    if (14 === g)return null;
                    if (15 === g)return d = 0, null;
                    if (-1 === g)return -1;
                    e = g;
                    d = 5;
                    return null;
                case 5:
                    d = 4;
                    if (-1 === g)return f(c);
                    b = null;
                    a(e, 33, 70) && a(g, 33, 126) ? b = m(178 * (e - 1) + 52 + g - 1, A["euc-kr"]) : a(e, 71, 126) && a(g, 33, 126) && (b = m(12460 + 94 * (e - 71) + (g - 33), A["euc-kr"]));
                    return null !== b ? b : f(c)
            }
        }
    }

    function N(b) {
        var c = !1, d = 0;
        this.encode = function (b, f) {
            var e = f.get();
            if (-1 === e)return -1;
            c || (c = !0, b.emit(27, 36, 41, 67));
            f.offset(1);
            if (a(e, 0, 127) && 0 !== d)return f.offset(-1), d = 0, b.emit(15);
            if (a(e, 0, 127))return b.emit(e);
            if (1 !== d)return f.offset(-1), d = 1, b.emit(14);
            var g = q(e, A["euc-kr"]);
            if (null === g)return k(e);
            var l;
            if (12460 > g)return l = h(g, 178) + 1, g = g % 178 - 26 - 26 + 1, !a(l, 33, 70) || !a(g, 33, 126) ? k(e) : b.emit(l, g);
            g -= 12460;
            l = h(g, 94) + 71;
            g = g % 94 + 33;
            return !a(l, 71, 126) || !a(g, 33, 126) ? k(e) : b.emit(l, g)
        }
    }

    function M(b, c) {
        var d =
            c.fatal, e = null, g = null;
        this.decode = function (c) {
            var h = c.get();
            if (-1 === h && null === e && null === g)return -1;
            if (-1 === h && (null !== e || null !== g))return f(d);
            c.offset(1);
            if (null === e)return e = h, null;
            h = b ? (e << 8) + h : (h << 8) + e;
            e = null;
            if (null !== g) {
                var k = g;
                g = null;
                if (a(h, 56320, 57343))return 65536 + 1024 * (k - 55296) + (h - 56320);
                c.offset(-2);
                return f(d)
            }
            return a(h, 55296, 56319) ? (g = h, null) : a(h, 56320, 57343) ? f(d) : h
        }
    }

    function R(b, c) {
        this.encode = function (c, d) {
            function f(a) {
                var d = a >> 8;
                a &= 255;
                return b ? c.emit(d, a) : c.emit(a, d)
            }

            var e = d.get();
            if (-1 === e)return -1;
            d.offset(1);
            a(e, 55296, 57343) && k(e);
            if (65535 >= e)return f(e);
            var g = h(e - 65536, 1024) + 55296, e = (e - 65536) % 1024 + 56320;
            f(g);
            return f(e)
        }
    }

    function P(a, b) {
        if (!this || this === d)return new P(a, b);
        a = a ? String(a) : "utf-8";
        b = Object(b);
        this._encoding = n(a);
        if (null === this._encoding || "utf-8" !== this._encoding.name && "utf-16" !== this._encoding.name && "utf-16be" !== this._encoding.name)throw new TypeError("Unknown encoding: " + a);
        this._streaming = !1;
        this._encoder = null;
        this._options = {fatal: Boolean(b.fatal)};
        Object.defineProperty ?
            Object.defineProperty(this, "encoding", {
                get: function () {
                    return this._encoding.name
                }
            }) : this.encoding = this._encoding.name;
        return this
    }

    function Q(a, b) {
        if (!this || this === d)return new Q(a, b);
        a = a ? String(a) : "utf-8";
        b = Object(b);
        this._encoding = n(a);
        if (null === this._encoding)throw new TypeError("Unknown encoding: " + a);
        this._streaming = !1;
        this._decoder = null;
        this._options = {fatal: Boolean(b.fatal)};
        Object.defineProperty ? Object.defineProperty(this, "encoding", {
            get: function () {
                return this._encoding.name
            }
        }) : this.encoding =
            this._encoding.name;
        return this
    }

    if (!(void 0 !== d.TextEncoder && void 0 !== d.TextDecoder)) {
        l.prototype = Error.prototype;
        var y = {}, O = {};
        [{encodings: [{labels: ["unicode-1-1-utf-8", "utf-8", "utf8"], name: "utf-8"}], heading: "The Encoding"}, {
            encodings: [{labels: ["cp864", "ibm864"], name: "ibm864"}, {
                labels: ["cp866", "ibm866"],
                name: "ibm866"
            }, {
                labels: "csisolatin2 iso-8859-2 iso-ir-101 iso8859-2 iso_8859-2 l2 latin2".split(" "),
                name: "iso-8859-2"
            }, {
                labels: "csisolatin3 iso-8859-3 iso_8859-3 iso-ir-109 l3 latin3".split(" "),
                name: "iso-8859-3"
            }, {
                labels: "csisolatin4 iso-8859-4 iso_8859-4 iso-ir-110 l4 latin4".split(" "),
                name: "iso-8859-4"
            }, {
                labels: ["csisolatincyrillic", "cyrillic", "iso-8859-5", "iso_8859-5", "iso-ir-144"],
                name: "iso-8859-5"
            }, {
                labels: "arabic csisolatinarabic ecma-114 iso-8859-6 iso_8859-6 iso-ir-127".split(" "),
                name: "iso-8859-6"
            }, {
                labels: "csisolatingreek ecma-118 elot_928 greek greek8 iso-8859-7 iso_8859-7 iso-ir-126".split(" "),
                name: "iso-8859-7"
            }, {
                labels: "csisolatinhebrew hebrew iso-8859-8 iso-8859-8-i iso-ir-138 iso_8859-8 visual".split(" "),
                name: "iso-8859-8"
            }, {
                labels: "csisolatin6 iso-8859-10 iso-ir-157 iso8859-10 l6 latin6".split(" "),
                name: "iso-8859-10"
            }, {labels: ["iso-8859-13"], name: "iso-8859-13"}, {
                labels: ["iso-8859-14", "iso8859-14"],
                name: "iso-8859-14"
            }, {labels: ["iso-8859-15", "iso_8859-15"], name: "iso-8859-15"}, {
                labels: ["iso-8859-16"],
                name: "iso-8859-16"
            }, {labels: ["koi8-r", "koi8_r"], name: "koi8-r"}, {
                labels: ["koi8-u"],
                name: "koi8-u"
            }, {labels: ["csmacintosh", "mac", "macintosh", "x-mac-roman"], name: "macintosh"}, {
                labels: ["iso-8859-11", "tis-620",
                    "windows-874"], name: "windows-874"
            }, {labels: ["windows-1250", "x-cp1250"], name: "windows-1250"}, {
                labels: ["windows-1251", "x-cp1251"],
                name: "windows-1251"
            }, {
                labels: "ascii ansi_x3.4-1968 csisolatin1 iso-8859-1 iso8859-1 iso_8859-1 l1 latin1 us-ascii windows-1252".split(" "),
                name: "windows-1252"
            }, {
                labels: ["cp1253", "windows-1253"],
                name: "windows-1253"
            }, {
                labels: "csisolatin5 iso-8859-9 iso-ir-148 l5 latin5 windows-1254".split(" "),
                name: "windows-1254"
            }, {labels: ["cp1255", "windows-1255"], name: "windows-1255"}, {
                labels: ["cp1256",
                    "windows-1256"], name: "windows-1256"
            }, {labels: ["windows-1257"], name: "windows-1257"}, {
                labels: ["cp1258", "windows-1258"],
                name: "windows-1258"
            }, {labels: ["x-mac-cyrillic", "x-mac-ukrainian"], name: "x-mac-cyrillic"}],
            heading: "Legacy single-byte encodings"
        }, {
            encodings: [{
                labels: "chinese csgb2312 csiso58gb231280 gb2312 gbk gb_2312 gb_2312-80 iso-ir-58 x-gbk".split(" "),
                name: "gbk"
            }, {labels: ["gb18030"], name: "gb18030"}, {labels: ["hz-gb-2312"], name: "hz-gb-2312"}],
            heading: "Legacy multi-byte Chinese (simplified) encodings"
        },
            {
                encodings: [{labels: ["big5", "big5-hkscs", "cn-big5", "csbig5", "x-x-big5"], name: "big5"}],
                heading: "Legacy multi-byte Chinese (traditional) encodings"
            }, {
            encodings: [{
                labels: ["cseucpkdfmtjapanese", "euc-jp", "x-euc-jp"],
                name: "euc-jp"
            }, {
                labels: ["csiso2022jp", "iso-2022-jp"],
                name: "iso-2022-jp"
            }, {
                labels: "csshiftjis ms_kanji shift-jis shift_jis sjis windows-31j x-sjis".split(" "),
                name: "shift_jis"
            }],
            heading: "Legacy multi-byte Japanese encodings"
        }, {
            encodings: [{
                labels: "cseuckr csksc56011987 euc-kr iso-ir-149 korean ks_c_5601-1987 ks_c_5601-1989 ksc5601 ksc_5601 windows-949".split(" "),
                name: "euc-kr"
            }, {labels: ["csiso2022kr", "iso-2022-kr"], name: "iso-2022-kr"}],
            heading: "Legacy multi-byte Korean encodings"
        }, {
            encodings: [{labels: ["utf-16", "utf-16le"], name: "utf-16"}, {labels: ["utf-16be"], name: "utf-16be"}],
            heading: "Legacy utf-16 encodings"
        }].forEach(function (a) {
                a.encodings.forEach(function (a) {
                    y[a.name] = a;
                    a.labels.forEach(function (b) {
                        O[b] = a
                    })
                })
            });
        var A = d["encoding-indexes"] || {};
        y["utf-8"].getEncoder = function (a) {
            return new r(a)
        };
        y["utf-8"].getDecoder = function (a) {
            return new s(a)
        };
        (function () {
            "ibm864 ibm866 iso-8859-2 iso-8859-3 iso-8859-4 iso-8859-5 iso-8859-6 iso-8859-7 iso-8859-8 iso-8859-10 iso-8859-13 iso-8859-14 iso-8859-15 iso-8859-16 koi8-r koi8-u macintosh windows-874 windows-1250 windows-1251 windows-1252 windows-1253 windows-1254 windows-1255 windows-1256 windows-1257 windows-1258 x-mac-cyrillic".split(" ").forEach(function (a) {
                var b =
                    y[a], c = A[a];
                b.getDecoder = function (a) {
                    return new p(c, a)
                };
                b.getEncoder = function (a) {
                    return new u(c, a)
                }
            })
        })();
        y.gbk.getEncoder = function (a) {
            return new t(!1, a)
        };
        y.gbk.getDecoder = function (a) {
            return new v(!1, a)
        };
        y.gb18030.getEncoder = function (a) {
            return new t(!0, a)
        };
        y.gb18030.getDecoder = function (a) {
            return new v(!0, a)
        };
        y["hz-gb-2312"].getEncoder = function (a) {
            return new x(a)
        };
        y["hz-gb-2312"].getDecoder = function (a) {
            return new B(a)
        };
        y.big5.getEncoder = function (a) {
            return new w(a)
        };
        y.big5.getDecoder = function (a) {
            return new D(a)
        };
        y["euc-jp"].getEncoder = function (a) {
            return new G(a)
        };
        y["euc-jp"].getDecoder = function (a) {
            return new E(a)
        };
        y["iso-2022-jp"].getEncoder = function (a) {
            return new C(a)
        };
        y["iso-2022-jp"].getDecoder = function (a) {
            return new K(a)
        };
        y.shift_jis.getEncoder = function (a) {
            return new L(a)
        };
        y.shift_jis.getDecoder = function (a) {
            return new I(a)
        };
        y["euc-kr"].getEncoder = function (a) {
            return new F(a)
        };
        y["euc-kr"].getDecoder = function (a) {
            return new z(a)
        };
        y["iso-2022-kr"].getEncoder = function (a) {
            return new N(a)
        };
        y["iso-2022-kr"].getDecoder =
            function (a) {
                return new H(a)
            };
        y["utf-16"].getEncoder = function (a) {
            return new R(!1, a)
        };
        y["utf-16"].getDecoder = function (a) {
            return new M(!1, a)
        };
        y["utf-16be"].getEncoder = function (a) {
            return new R(!0, a)
        };
        y["utf-16be"].getDecoder = function (a) {
            return new M(!0, a)
        };
        P.prototype = {
            encode: function (a, d) {
                a = a ? String(a) : "";
                d = Object(d);
                this._streaming || (this._encoder = this._encoding.getEncoder(this._options));
                this._streaming = Boolean(d.stream);
                for (var f = [], e = new c(f), g = new b(a); -1 !== g.get();)this._encoder.encode(e, g);
                if (!this._streaming) {
                    var h;
                    do h = this._encoder.encode(e, g); while (-1 !== h);
                    this._encoder = null
                }
                return new Uint8Array(f)
            }
        };
        Q.prototype = {
            decode: function (a, b) {
                if (a && !("buffer"in a && "byteOffset"in a && "byteLength"in a))throw new TypeError("Expected ArrayBufferView");
                a || (a = new Uint8Array(0));
                b = Object(b);
                this._streaming || (this._decoder = this._encoding.getDecoder(this._options));
                this._streaming = Boolean(b.stream);
                var c = new Uint8Array(a.buffer, a.byteOffset, a.byteLength), c = new g(c);
                if (!this._BOMseen) {
                    this._BOMseen = !0;
                    var d = this._encoding.name;
                    c.match([255, 254]) && "utf-16" === d ? c.offset(2) : c.match([254, 255]) && "utf-16be" == d ? c.offset(2) : c.match([239, 187, 191]) && "utf-8" == d && c.offset(3)
                }
                for (var d = new e, f; -1 !== c.get();)f = this._decoder.decode(c), null !== f && -1 !== f && d.emit(f);
                if (!this._streaming) {
                    do f = this._decoder.decode(c), null !== f && -1 !== f && d.emit(f); while (-1 !== f && -1 != c.get());
                    this._decoder = null
                }
                return d.string()
            }
        };
        d.TextEncoder = d.TextEncoder || P;
        d.TextDecoder = d.TextDecoder || Q
    }
})(this);
!function () {
    OT.Rumor = {
        MessageType: {
            SUBSCRIBE: 0,
            UNSUBSCRIBE: 1,
            MESSAGE: 2,
            CONNECT: 3,
            DISCONNECT: 4,
            PING: 7,
            PONG: 8,
            STATUS: 9
        }
    }
}(this);
!function () {
    var d;
    d = {
        1002: "The endpoint is terminating the connection due to a protocol error. (CLOSE_PROTOCOL_ERROR)",
        1003: "The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data). (CLOSE_UNSUPPORTED)",
        1004: "The endpoint is terminating the connection because a data frame was received that is too large. (CLOSE_TOO_LARGE)",
        1005: "Indicates that no status code was provided even though one was expected. (CLOSE_NO_STATUS)",
        1006: "Used to indicate that a connection was closed abnormally (that is, with no close frame being sent) when a status code is expected. (CLOSE_ABNORMAL)",
        1007: "Indicates that an endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [RFC3629] data within a text message)",
        1008: "Indicates that an endpoint is terminating the connection because it has received a message that violates its policy.  This is a generic status code that can be returned when there is no other more suitable status code (e.g., 1003 or 1009) or if there is a need to hide specific details about the policy",
        1009: "Indicates that an endpoint is terminating the connection because it has received a message that is too big for it to process",
        1011: "Indicates that a server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request",
        4001: "Connectivity loss was detected as it was too long since the socket received the last PONG message"
    };
    OT.Rumor.SocketError = function (a, d) {
        this.code = a;
        this.message = d
    };
    OT.Rumor.Socket = function (a, h, g) {
        var c, b, e, l, f,
            k, n, m, q, s, r, p = OT.$.statable(this, ["disconnected", "error", "connected", "connecting", "disconnecting"], "disconnected", function (a) {
                switch (a) {
                    case "disconnected":
                    case "error":
                        if (c = null, f) {
                            var b;
                            if (!s ? 0 : 44900 <= OT.$.now() - s)b = Error(d[4001]), b.code = 4001;
                            f(b)
                        }
                }
            }), u = function (a, b) {
                if (null === b || !OT.$.isFunction(b))throw Error("The Rumor.Socket " + a + " callback must be a valid function or null");
            }, v = function (a) {
                OT.error("Rumor.Socket: " + a);
                a = new OT.Rumor.SocketError(null, a || "Unknown Socket Error");
                q && clearTimeout(q);
                p("error");
                "connecting" === this.previousState && n && (n(a, null), n = null);
                l && l(a)
            }.bind(this), t = function C(a) {
                c && (void 0 === a && (a = 0), m && clearTimeout(m), 0 < c.bufferedAmount && 10 >= a + 1 ? m = setTimeout(C, 100, a + 1) : (p("disconnecting"), m && (clearTimeout(m), m = null), c.close()))
            }, B = function I() {
                this.is("connected") && ((!s ? 0 : 44900 <= OT.$.now() - s) ? E({code: 4001}) : (c.send(OT.Rumor.Message.Ping().serialize()), r = setTimeout(I.bind(this), 9E3)))
            }.bind(this), x = function () {
                q && clearTimeout(q);
                this.isNot("connecting") ? OT.debug("webSocketConnected reached in state other than connecting") :
                    (c.send(OT.Rumor.Message.Connect(b, h).serialize()), p("connected"), n && (n(null, b), n = null), e && e(b), setTimeout(function () {
                        s = OT.$.now();
                        B()
                    }, 9E3))
            }.bind(this), D = function () {
                var a = c;
                v("Timed out while waiting for the Rumor socket to connect.");
                try {
                    a.close()
                } catch (b) {
                }
            }, w = function () {
            }, E = function (a) {
                q && clearTimeout(q);
                r && clearTimeout(r);
                if (1E3 !== a.code && 1001 !== a.code) {
                    var b = a.reason || a.message;
                    !b && d.hasOwnProperty(a.code) && (b = d[a.code]);
                    v("Rumor Socket Disconnected: " + b)
                }
                this.isNot("error") && p("disconnected")
            }.bind(this),
            G = function (a) {
                s = OT.$.now();
                k && (a = OT.Rumor.Message.deserialize(a.data), a.type !== OT.Rumor.MessageType.PONG && k(a))
            };
        this.publish = function (a, b, d) {
            c.send(OT.Rumor.Message.Publish(a, b, d).serialize())
        };
        this.subscribe = function (a) {
            c.send(OT.Rumor.Message.Subscribe(a).serialize())
        };
        this.unsubscribe = function (a) {
            c.send(OT.Rumor.Message.Unsubscribe(a).serialize())
        };
        this.connect = function (d, f) {
            if (this.is("connecting", "connected"))f(new OT.Rumor.SocketError(null, "Rumor.Socket cannot connect when it is already connecting or connected."));
            else {
                b = d;
                n = f;
                try {
                    p("connecting"), c = new (g || WebSocket)(a), c.binaryType = "arraybuffer", c.onopen = x, c.onclose = E, c.onerror = w, c.onmessage = G, q = setTimeout(D, OT.Rumor.Socket.CONNECT_TIMEOUT)
                } catch (e) {
                    OT.error(e), v("Could not connect to the Rumor socket, possibly because of a blocked port.")
                }
            }
        };
        this.disconnect = function () {
            q && clearTimeout(q);
            r && clearTimeout(r);
            c ? 3 === c.readyState ? this.isNot("error") && p("disconnected") : (this.is("connected") && c.send(OT.Rumor.Message.Disconnect().serialize()), t()) : this.isNot("error") &&
            p("disconnected")
        };
        Object.defineProperties(this, {
            id: {
                get: function () {
                    return b
                }
            }, onOpen: {
                set: function (a) {
                    u("onOpen", a);
                    e = a
                }, get: function () {
                    return e
                }
            }, onError: {
                set: function (a) {
                    u("onError", a);
                    l = a
                }, get: function () {
                    return l
                }
            }, onClose: {
                set: function (a) {
                    u("onClose", a);
                    f = a
                }, get: function () {
                    return f
                }
            }, onMessage: {
                set: function (a) {
                    u("onMessage", a);
                    k = a
                }, get: function () {
                    return k
                }
            }
        })
    };
    OT.Rumor.Socket.CONNECT_TIMEOUT = 15E3
}(this);
!function () {
    OT.Rumor.Message = function (d, a, h, g) {
        this.type = d;
        this.toAddress = a;
        this.headers = h;
        this.data = g;
        this.transactionId = this.headers["TRANSACTION-ID"];
        this.status = this.headers.STATUS;
        this.isError = !(this.status && "2" === this.status[0])
    };
    OT.Rumor.Message.prototype.serialize = function () {
        var d = 8, a = 7, h = [], g = [], c = [], b, e, l;
        a++;
        for (e = 0; e < this.toAddress.length; e++)h.push((new TextEncoder("utf-8")).encode(this.toAddress[e])), a += 2, a += h[e].length;
        a++;
        e = 0;
        for (b in this.headers)g.push((new TextEncoder("utf-8")).encode(b)),
            c.push((new TextEncoder("utf-8")).encode(this.headers[b])), a += 4, a += g[e].length, a += c[e].length, e++;
        b = (new TextEncoder("utf-8")).encode(this.data);
        var a = a + b.length, f = new ArrayBuffer(a), k = new Uint8Array(f, 0, a), a = a - 4;
        k[0] = (a & 4278190080) >>> 24;
        k[1] = (a & 16711680) >>> 16;
        k[2] = (a & 65280) >>> 8;
        k[3] = (a & 255) >>> 0;
        k[4] = 0;
        k[5] = 0;
        k[6] = this.type;
        k[7] = this.toAddress.length;
        for (e = 0; e < h.length; e++) {
            a = h[e];
            k[d++] = a.length >> 8 & 255;
            k[d++] = a.length >> 0 & 255;
            for (l = 0; l < a.length; l++)k[d++] = a[l]
        }
        k[d++] = g.length;
        for (e = 0; e < g.length; e++) {
            a =
                g[e];
            k[d++] = a.length >> 8 & 255;
            k[d++] = a.length >> 0 & 255;
            for (l = 0; l < a.length; l++)k[d++] = a[l];
            a = c[e];
            k[d++] = a.length >> 8 & 255;
            k[d++] = a.length >> 0 & 255;
            for (l = 0; l < a.length; l++)k[d++] = a[l]
        }
        for (e = 0; e < b.length; e++)k[d++] = b[e];
        return f
    };
    OT.Rumor.Message.deserialize = function (d) {
        if ("undefined" !== typeof Buffer && Buffer.isBuffer(d)) {
            var a = d, h = new ArrayBuffer(a.length), g = new Uint8Array(h);
            for (d = 0; d < a.length; ++d)g[d] = a[d];
            d = h
        }
        var c = 8, b = new Uint8Array(d), e, l, f, k, n, a = b[6], g = [];
        for (n = 0; n < b[7]; n++)k = b[c++] << 8, k += b[c++], e = new Uint8Array(d,
            c, k), g[n] = (new TextDecoder("utf-8")).decode(e), c += k;
        l = b[c++];
        h = {};
        for (n = 0; n < l; n++)k = b[c++] << 8, k += b[c++], e = new Uint8Array(d, c, k), f = (new TextDecoder("utf-8")).decode(e), c += k, k = b[c++] << 8, k += b[c++], e = new Uint8Array(d, c, k), e = (new TextDecoder("utf-8")).decode(e), h[f] = e, c += k;
        d = new Uint8Array(d, c);
        d = (new TextDecoder("utf-8")).decode(d);
        return new OT.Rumor.Message(a, g, h, d)
    };
    OT.Rumor.Message.Connect = function (d, a) {
        return new OT.Rumor.Message(OT.Rumor.MessageType.CONNECT, [], {uniqueId: d, notifyDisconnectAddress: a},
            "")
    };
    OT.Rumor.Message.Disconnect = function () {
        return new OT.Rumor.Message(OT.Rumor.MessageType.DISCONNECT, [], [], "")
    };
    OT.Rumor.Message.Subscribe = function (d) {
        return new OT.Rumor.Message(OT.Rumor.MessageType.SUBSCRIBE, d, [], "")
    };
    OT.Rumor.Message.Unsubscribe = function (d) {
        return new OT.Rumor.Message(OT.Rumor.MessageType.UNSUBSCRIBE, d, [], "")
    };
    OT.Rumor.Message.Publish = function (d, a, h) {
        return new OT.Rumor.Message(OT.Rumor.MessageType.MESSAGE, d, h || [], a)
    };
    OT.Rumor.Message.Ping = function () {
        return new OT.Rumor.Message(OT.Rumor.MessageType.PING,
            [], [], "")
    }
}(this);
!function () {
    OT.Raptor = {
        Actions: {
            CONNECT: 100,
            CREATE: 101,
            UPDATE: 102,
            DELETE: 103,
            STATE: 104,
            FORCE_DISCONNECT: 105,
            FORCE_UNPUBLISH: 106,
            SIGNAL: 107,
            CREATE_ARCHIVE: 108,
            CLOSE_ARCHIVE: 109,
            START_RECORDING_SESSION: 110,
            STOP_RECORDING_SESSION: 111,
            START_RECORDING_STREAM: 112,
            STOP_RECORDING_STREAM: 113,
            LOAD_ARCHIVE: 114,
            START_PLAYBACK: 115,
            STOP_PLAYBACK: 116,
            APPSTATE_PUT: 117,
            APPSTATE_DELETE: 118,
            OFFER: 119,
            ANSWER: 120,
            PRANSWER: 121,
            CANDIDATE: 122,
            SUBSCRIBE: 123,
            UNSUBSCRIBE: 124,
            QUERY: 125,
            SDP_ANSWER: 126,
            PONG: 127,
            REGISTER: 128,
            QUALITY_CHANGED: 129
        },
        Types: {
            RPC_REQUEST: 100,
            RPC_RESPONSE: 101,
            STREAM: 102,
            ARCHIVE: 103,
            CONNECTION: 104,
            APPSTATE: 105,
            CONNECTIONCOUNT: 106,
            MODERATION: 107,
            SIGNAL: 108,
            SUBSCRIBER: 110,
            JSEP: 109
        }
    }
}(this);
!function () {
    OT.Raptor.serializeMessage = function (d) {
        return JSON.stringify(d)
    };
    OT.Raptor.deserializeMessage = function (d) {
        if (0 === d.length)return {};
        d = JSON.parse(d);
        var a = d.uri.substr(1).split("/");
        a.shift();
        "" === a[a.length - 1] && a.pop();
        d.params = {};
        for (var h = 0, g = a.length; h < g - 1; h += 2)d.params[a[h]] = a[h + 1];
        d.resource = 0 === a.length % 2 ? "channel" === a[a.length - 2] && 6 < a.length ? a[a.length - 4] + "_" + a[a.length - 2] : a[a.length - 2] : "channel" === a[a.length - 1] && 5 < a.length ? a[a.length - 3] + "_" + a[a.length - 1] : a[a.length - 1];
        d.signature =
            d.resource + "#" + d.method;
        return d
    };
    OT.Raptor.unboxFromRumorMessage = function (d) {
        var a = OT.Raptor.deserializeMessage(d.data);
        a.transactionId = d.transactionId;
        a.fromAddress = d.headers["X-TB-FROM-ADDRESS"];
        return a
    };
    OT.Raptor.parseIceServers = function (d) {
        try {
            return JSON.parse(d.data).content.iceServers
        } catch (a) {
            return []
        }
    };
    OT.Raptor.Message = {};
    OT.Raptor.Message.connections = {};
    OT.Raptor.Message.connections.create = function (d, a, h) {
        return OT.Raptor.serializeMessage({
            method: "create", uri: "/v2/partner/" + d + "/session/" +
            a + "/connection/" + h, content: {userAgent: navigator.userAgent}
        })
    };
    OT.Raptor.Message.connections.destroy = function (d, a, h) {
        return OT.Raptor.serializeMessage({
            method: "delete",
            uri: "/v2/partner/" + d + "/session/" + a + "/connection/" + h,
            content: {}
        })
    };
    OT.Raptor.Message.sessions = {};
    OT.Raptor.Message.sessions.get = function (d, a) {
        return OT.Raptor.serializeMessage({method: "read", uri: "/v2/partner/" + d + "/session/" + a, content: {}})
    };
    OT.Raptor.Message.streams = {};
    OT.Raptor.Message.streams.get = function (d, a, h) {
        return OT.Raptor.serializeMessage({
            method: "read",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h, content: {}
        })
    };
    OT.Raptor.Message.streams.create = function (d, a, h, g, c, b, e, l, f, k, n, m) {
        var q = [];
        void 0 !== l && q.push({id: "audio1", type: "audio", active: l});
        void 0 !== f && (c = {
            id: "video1",
            type: "video",
            active: f,
            width: b,
            height: e,
            orientation: c
        }, k && (c.frameRate = k), q.push(c));
        g = {id: h, name: g, channel: q};
        n && (g.minBitrate = n);
        m && (g.maxBitrate = m);
        return OT.Raptor.serializeMessage({
            method: "create",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h,
            content: g
        })
    };
    OT.Raptor.Message.streams.destroy =
        function (d, a, h) {
            return OT.Raptor.serializeMessage({
                method: "delete",
                uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h,
                content: {}
            })
        };
    OT.Raptor.Message.streams.offer = function (d, a, h, g) {
        return OT.Raptor.serializeMessage({
            method: "offer",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h,
            content: {sdp: g}
        })
    };
    OT.Raptor.Message.streams.answer = function (d, a, h, g) {
        return OT.Raptor.serializeMessage({
            method: "answer",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h,
            content: {sdp: g}
        })
    };
    OT.Raptor.Message.streams.candidate =
        function (d, a, h, g) {
            return OT.Raptor.serializeMessage({
                method: "candidate",
                uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h,
                content: g
            })
        };
    OT.Raptor.Message.streamChannels = {};
    OT.Raptor.Message.streamChannels.update = function (d, a, h, g, c) {
        return OT.Raptor.serializeMessage({
            method: "update",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h + "/channel/" + g,
            content: c
        })
    };
    OT.Raptor.Message.subscribers = {};
    OT.Raptor.Message.subscribers.create = function (d, a, h, g, c, b) {
        c = {
            id: g, connection: c, keyManagementMethod: OT.$.supportedCryptoScheme(),
            bundleSupport: OT.$.supportsBundle(), rtcpMuxSupport: OT.$.supportsRtcpMux()
        };
        b && (c.channel = b);
        return OT.Raptor.serializeMessage({
            method: "create",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h + "/subscriber/" + g,
            content: c
        })
    };
    OT.Raptor.Message.subscribers.destroy = function (d, a, h, g) {
        return OT.Raptor.serializeMessage({
            method: "delete",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h + "/subscriber/" + g,
            content: {}
        })
    };
    OT.Raptor.Message.subscribers.update = function (d, a, h, g, c) {
        return OT.Raptor.serializeMessage({
            method: "update",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h + "/subscriber/" + g, content: c
        })
    };
    OT.Raptor.Message.subscribers.candidate = function (d, a, h, g, c) {
        return OT.Raptor.serializeMessage({
            method: "candidate",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h + "/subscriber/" + g,
            content: c
        })
    };
    OT.Raptor.Message.subscribers.offer = function (d, a, h, g, c) {
        return OT.Raptor.serializeMessage({
            method: "offer",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h + "/subscriber/" + g,
            content: {sdp: c}
        })
    };
    OT.Raptor.Message.subscribers.answer = function (d,
                                                     a, h, g, c) {
        return OT.Raptor.serializeMessage({
            method: "answer",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h + "/subscriber/" + g,
            content: {sdp: c}
        })
    };
    OT.Raptor.Message.subscriberChannels = {};
    OT.Raptor.Message.subscriberChannels.update = function (d, a, h, g, c, b) {
        return OT.Raptor.serializeMessage({
            method: "update",
            uri: "/v2/partner/" + d + "/session/" + a + "/stream/" + h + "/subscriber/" + g + "/channel/" + c,
            content: b
        })
    };
    OT.Raptor.Message.signals = {};
    OT.Raptor.Message.signals.create = function (d, a, h, g, c) {
        var b = {};
        void 0 !== g && (b.type =
            g);
        void 0 !== c && (b.data = c);
        return OT.Raptor.serializeMessage({
            method: "signal",
            uri: "/v2/partner/" + d + "/session/" + a + (void 0 !== h ? "/connection/" + h : "") + "/signal/" + OT.$.uuid(),
            content: b
        })
    }
}(this);
!function () {
    OT.Signal = function (d, a, h) {
        a = function (a) {
            var b = null;
            null === a || void 0 === a ? b = {
                code: 400,
                reason: "The signal type was null or undefined. Either set it to a String value or omit it"
            } : 128 < a.length ? b = {
                code: 413,
                reason: "The signal type was too long, the maximum length of it is 128 characters"
            } : /^[a-zA-Z0-9\-\._~]+$/.exec(a) || (b = {
                code: 400,
                reason: "The signal type was invalid, it can only contain letters, numbers, '-', '_', and '~'."
            });
            return b
        };
        var g = function (a) {
            var b = null;
            if (null === a || void 0 === a)b =
            {
                code: 400,
                reason: "The signal data was null or undefined. Either set it to a String value or omit it"
            }; else try {
                8192 < JSON.stringify(a).length && (b = {
                    code: 413,
                    reason: "The data field was too long, the maximum size of it is 8192 characters"
                })
            } catch (d) {
                b = {code: 400, reason: "The data field was not valid JSON"}
            }
            return b
        };
        this.toRaptorMessage = function () {
            var a = this.to;
            a && "string" !== typeof a && (a = a.id);
            return OT.Raptor.Message.signals.create(OT.APIKEY, d, a, this.type, this.data)
        };
        this.toHash = function () {
            return h
        };
        this.error =
            null;
        h && (h.hasOwnProperty("data") && (this.data = OT.$.clone(h.data), this.error = g(this.data)), h.hasOwnProperty("to") && (this.to = h.to, this.error || (this.error = !this.to ? {
            code: 400,
            reason: "The signal type was null or an empty String. Either set it to a non-empty String value or omit it"
        } : !(this.to instanceof OT.Connection || this.to instanceof OT.Session) ? {
            code: 400,
            reason: "The To field was invalid"
        } : null)), h.hasOwnProperty("type") && (this.error || (this.error = a(h.type)), this.type = h.type));
        this.valid = null === this.error
    }
}(this);
!function () {
    function d(a, d) {
        this.code = a;
        this.reason = d
    }

    OT.Raptor.Socket = function (a, h, g, c) {
        var b, e, l, f, k, n = OT.$.statable(this, ["disconnected", "connecting", "connected", "error", "disconnecting"], "disconnected"), m = function (a) {
            a ? n("error") : n("connected");
            k.apply(null, arguments)
        }, q = function (a) {
            var b = this.is("disconnecting") ? "clientDisconnected" : "networkDisconnected";
            a && 4001 === a.code && (b = "networkTimedout");
            n("disconnected");
            f.onClose(b)
        }.bind(this), s = function () {
        };
        this.connect = function (a, c, d) {
            if (this.is("disconnected",
                    "error")) {
                n("connecting");
                b = c.sessionId;
                e = a;
                k = d;
                a = OT.$.uuid();
                var v = "/v2/partner/" + OT.APIKEY + "/session/" + b;
                l = new OT.Rumor.Socket(h, g);
                l.onClose = q;
                l.onMessage = f.dispatch.bind(f);
                l.connect(a, function (a) {
                    a ? (a.message = "WebSocketConnection:" + a.code + ":" + a.message, m(a)) : (l.onError = s, OT.debug("Raptor Socket connected. Subscribing to " + v + " on " + h), l.subscribe([v]), a = OT.Raptor.Message.connections.create(OT.APIKEY, b, l.id), this.publish(a, {"X-TB-TOKEN-AUTH": e}, function (a) {
                        a ? (a.message = "ConnectToSession:" + a.code +
                        ":Received error response to connection create message.", m(a)) : this.publish(OT.Raptor.Message.sessions.get(OT.APIKEY, b), function (a) {
                            a && (a.message = "GetSessionState:" + a.code + ":Received error response to session read");
                            m.apply(null, arguments)
                        })
                    }.bind(this)))
                }.bind(this))
            } else OT.warn("Cannot connect the Raptor Socket as it is currently connected. You should disconnect first.")
        };
        this.disconnect = function () {
            this.is("disconnected") || (n("disconnecting"), l.disconnect())
        };
        this.publish = function (a, b, c) {
            if (l.isNot("connected"))OT.error("OT.Raptor.Socket: cannot publish until the socket is connected." +
            a); else {
                var d = OT.$.uuid(), e = {}, h;
                b && (OT.$.isFunction(b) ? (e = {}, h = b) : e = b);
                !h && (c && OT.$.isFunction(c)) && (h = c);
                h && f.registerCallback(d, h);
                OT.debug("OT.Raptor.Socket Publish (ID:" + d + ") ");
                OT.debug(a);
                l.publish([g], a, OT.$.extend(e, {
                    "Content-Type": "application/x-raptor+v2",
                    "TRANSACTION-ID": d,
                    "X-TB-FROM-ADDRESS": l.id
                }));
                return d
            }
        };
        this.streamCreate = function (a, c, d, f, e, g, h, k, l, m) {
            var n = OT.$.uuid();
            a = OT.Raptor.Message.streams.create(OT.APIKEY, b, n, a, c, d, f, e, g, h, k, l);
            this.publish(a, function (a, b) {
                m(a, n, b)
            })
        };
        this.streamDestroy =
            function (a) {
                this.publish(OT.Raptor.Message.streams.destroy(OT.APIKEY, b, a))
            };
        this.streamChannelUpdate = function (a, c, d) {
            this.publish(OT.Raptor.Message.streamChannels.update(OT.APIKEY, b, a, c, d))
        };
        this.subscriberCreate = function (a, c, d, f) {
            this.publish(OT.Raptor.Message.subscribers.create(OT.APIKEY, b, a, c, l.id, d), f)
        };
        this.subscriberDestroy = function (a, c) {
            this.publish(OT.Raptor.Message.subscribers.destroy(OT.APIKEY, b, a, c))
        };
        this.subscriberUpdate = function (a, c, d) {
            this.publish(OT.Raptor.Message.subscribers.update(OT.APIKEY,
                b, a, c, d))
        };
        this.subscriberChannelUpdate = function (a, c, d, f) {
            this.publish(OT.Raptor.Message.subscriberChannels.update(OT.APIKEY, b, a, c, d, f))
        };
        this.forceDisconnect = function (a, c) {
            this.publish(OT.Raptor.Message.connections.destroy(OT.APIKEY, b, a), c)
        };
        this.forceUnpublish = function (a, c) {
            this.publish(OT.Raptor.Message.streams.destroy(OT.APIKEY, b, a), c)
        };
        this.jsepCandidate = function (a, c) {
            this.publish(OT.Raptor.Message.streams.candidate(OT.APIKEY, b, a, c))
        };
        this.jsepCandidateP2p = function (a, c, d) {
            this.publish(OT.Raptor.Message.subscribers.candidate(OT.APIKEY,
                b, a, c, d))
        };
        this.jsepOffer = function (a, c) {
            this.publish(OT.Raptor.Message.streams.offer(OT.APIKEY, b, a, c))
        };
        this.jsepOfferP2p = function (a, c, d) {
            this.publish(OT.Raptor.Message.subscribers.offer(OT.APIKEY, b, a, c, d))
        };
        this.jsepAnswer = function (a, c) {
            this.publish(OT.Raptor.Message.streams.answer(OT.APIKEY, b, a, c))
        };
        this.jsepAnswerP2p = function (a, c, d) {
            this.publish(OT.Raptor.Message.subscribers.answer(OT.APIKEY, b, a, c, d))
        };
        this.signal = function (a, c) {
            var f = new OT.Signal(b, l.id, a || {});
            f.valid ? this.publish(f.toRaptorMessage(),
                function (a) {
                    var b;
                    a && (b = new d(a.code, a.message));
                    c && OT.$.isFunction(c) && c(b, f.toHash())
                }) : c && OT.$.isFunction(c) && c(new d(f.error.code, f.error.reason), f.toHash())
        };
        OT.$.defineGetters(this, {
            id: function () {
                return l && l.id
            }, sessionId: function () {
                return b
            }, dispatcher: function () {
                return f
            }
        });
        null == c && (c = new OT.Raptor.Dispatcher);
        f = c
    }
}(this);
!function () {
    OT.Raptor.Dispatcher = function () {
        "undefined" !== typeof EventEmitter ? EventEmitter.call(this) : (OT.$.eventing(this, !0), this.emit = this.trigger);
        this.callbacks = {}
    };
    "undefined" !== typeof EventEmitter && util.inherits(OT.Raptor.Dispatcher, EventEmitter);
    OT.Raptor.Dispatcher.prototype.registerCallback = function (d, a) {
        this.callbacks[d] = a
    };
    OT.Raptor.Dispatcher.prototype.triggerCallback = function (d) {
        if (d) {
            var a = this.callbacks[d];
            if (a && OT.$.isFunction(a)) {
                var h = Array.prototype.slice.call(arguments);
                h.shift();
                a.apply(null, h)
            }
            delete this.callbacks[d]
        }
    };
    OT.Raptor.Dispatcher.prototype.onClose = function (d) {
        this.emit("close", d)
    };
    OT.Raptor.Dispatcher.prototype.dispatch = function (d) {
        if (d.type === OT.Rumor.MessageType.STATUS) {
            OT.debug("OT.Raptor.dispatch: STATUS");
            OT.debug(d);
            var a;
            d.isError && (a = new OT.Error(d.status));
            this.triggerCallback(d.transactionId, a, d)
        } else switch (d = OT.Raptor.unboxFromRumorMessage(d), OT.debug("OT.Raptor.dispatch " + d.signature), OT.debug(d), d.resource) {
            case "session":
                this.dispatchSession(d);
                break;
            case "connection":
                this.dispatchConnection(d);
                break;
            case "stream":
                this.dispatchStream(d);
                break;
            case "stream_channel":
                this.dispatchStreamChannel(d);
                break;
            case "subscriber":
                this.dispatchSubscriber(d);
                break;
            case "subscriber_channel":
                this.dispatchSubscriberChannel(d);
                break;
            case "signal":
                this.dispatchSignal(d);
                break;
            case "archive":
                this.dispatchArchive(d);
                break;
            default:
                OT.warn("OT.Raptor.dispatch: Type " + d.resource + " is not currently implemented")
        }
    };
    OT.Raptor.Dispatcher.prototype.dispatchSession = function (d) {
        switch (d.method) {
            case "read":
                this.emit("session#read",
                    d.content, d.transactionId);
                break;
            default:
                OT.warn("OT.Raptor.dispatch: " + d.signature + " is not currently implemented")
        }
    };
    OT.Raptor.Dispatcher.prototype.dispatchConnection = function (d) {
        switch (d.method) {
            case "created":
                this.emit("connection#created", d.content);
                break;
            case "deleted":
                this.emit("connection#deleted", d.params.connection, d.reason);
                break;
            default:
                OT.warn("OT.Raptor.dispatch: " + d.signature + " is not currently implemented")
        }
    };
    OT.Raptor.Dispatcher.prototype.dispatchStream = function (d) {
        switch (d.method) {
            case "created":
                this.emit("stream#created",
                    d.content, d.transactionId);
                break;
            case "deleted":
                this.emit("stream#deleted", d.params.stream, d.reason);
                break;
            case "updated":
                this.emit("stream#updated", d.params.stream, d.content);
                break;
            case "generateoffer":
            case "answer":
            case "pranswer":
            case "offer":
            case "candidate":
                this.dispatchJsep(d.method, d);
                break;
            default:
                OT.warn("OT.Raptor.dispatch: " + d.signature + " is not currently implemented")
        }
    };
    OT.Raptor.Dispatcher.prototype.dispatchStreamChannel = function (d) {
        switch (d.method) {
            case "updated":
                this.emit("streamChannel#updated",
                    d.params.stream, d.params.channel, d.content);
                break;
            default:
                OT.warn("OT.Raptor.dispatch: " + d.signature + " is not currently implemented")
        }
    };
    OT.Raptor.Dispatcher.prototype.dispatchJsep = function (d, a) {
        this.emit("jsep#" + d, a.params.stream, a.fromAddress, a)
    };
    OT.Raptor.Dispatcher.prototype.dispatchSubscriberChannel = function (d) {
        switch (d.method) {
            case "updated":
                this.emit("subscriberChannel#updated", d.params.stream, d.params.channel, d.content);
                break;
            case "update":
                this.emit("subscriberChannel#update", d.params.subscriber,
                    d.params.stream, d.content);
                break;
            default:
                OT.warn("OT.Raptor.dispatch: " + d.signature + " is not currently implemented")
        }
    };
    OT.Raptor.Dispatcher.prototype.dispatchSubscriber = function (d) {
        switch (d.method) {
            case "created":
                this.emit("subscriber#created", d.params.stream, d.fromAddress, d.content.id);
                break;
            case "deleted":
                this.dispatchJsep("unsubscribe", d);
                this.emit("subscriber#deleted", d.params.stream, d.fromAddress);
                break;
            case "generateoffer":
            case "answer":
            case "pranswer":
            case "offer":
            case "candidate":
                this.dispatchJsep(d.method,
                    d);
                break;
            default:
                OT.warn("OT.Raptor.dispatch: " + d.signature + " is not currently implemented")
        }
    };
    OT.Raptor.Dispatcher.prototype.dispatchSignal = function (d) {
        "signal" !== d.method ? OT.warn("OT.Raptor.dispatch: " + d.signature + " is not currently implemented") : this.emit("signal", d.fromAddress, d.content.type, d.content.data)
    };
    OT.Raptor.Dispatcher.prototype.dispatchArchive = function (d) {
        switch (d.method) {
            case "created":
                this.emit("archive#created", d.content);
                break;
            case "updated":
                this.emit("archive#updated", d.params.archive,
                    d.content)
        }
    }
}(this);
(function (d) {
    function a(a, b) {
        var d = a.channel.map(function (a) {
            return new OT.StreamChannel(a)
        });
        return new OT.Stream(a.id, a.name, a.creationTime, b.connections.get(a.connection.id), b, d)
    }

    function h(c, b) {
        if (!b.streams.has(c.id)) {
            var d = a(c, b);
            b.streams.add(d);
            return d
        }
    }

    function g(a, b) {
        if (!b.archives.has(a.id)) {
            var d = new OT.Archive(a.id, a.name, a.status);
            b.archives.add(d);
            return d
        }
    }

    OT.publishers = new OT.Collection("guid");
    OT.subscribers = new OT.Collection("widgetId");
    OT.sessions = new OT.Collection;
    d.OT.SessionDispatcher =
        function (a) {
            var b = new OT.Raptor.Dispatcher;
            b.on("close", function (b) {
                var d = a.connection;
                d && (d.destroyedReason ? OT.debug("OT.Raptor.Socket: Socket was closed but the connection had already been destroyed. Reason: " + d.destroyedReason) : d.destroy(b))
            });
            b.on("session#read", function (d, f) {
                var e = {}, n;
                e.streams = [];
                e.connections = [];
                e.archives = [];
                d.connection.forEach(function (b) {
                    n = OT.Connection.fromHash(b);
                    e.connections.push(n);
                    a.connections.add(n)
                });
                d.stream.forEach(function (b) {
                    e.streams.push(h(b, a))
                });
                (d.archive ||
                d.archives).forEach(function (b) {
                        e.archives.push(g(b, a))
                    });
                a._.subscriberMap = {};
                b.triggerCallback(f, null, e)
            });
            b.on("connection#created", function (b) {
                b = OT.Connection.fromHash(b);
                a.connection && b.id !== a.connection.id && a.connections.add(b)
            });
            b.on("connection#deleted", function (b, d) {
                b = a.connections.get(b);
                b.destroy(d)
            });
            b.on("stream#created", function (d, f) {
                d = h(d, a);
                d.publisher && (d.publisher.stream = d);
                b.triggerCallback(f, null, d)
            });
            b.on("stream#deleted", function (b, d) {
                var e = a.streams.get(b);
                e ? e.destroy(d) : OT.error("OT.Raptor.dispatch: A stream does not exist with the id of " +
                b + ", for stream#deleted message!")
            });
            b.on("stream#updated", function (b, d) {
                var e = a.streams.get(b);
                e ? e._.update(d) : OT.error("OT.Raptor.dispatch: A stream does not exist with the id of " + b + ", for stream#updated message!")
            });
            b.on("streamChannel#updated", function (b, d, e) {
                var g;
                !b || !(g = a.streams.get(b)) ? OT.error("OT.Raptor.dispatch: Unable to determine streamId, or the stream does not exist, for streamChannel message!") : g._.updateChannel(d, e)
            });
            var d = function (a, b, c, d) {
                var e, g;
                switch (a) {
                    case "offer":
                        g = [];
                        (b = OT.subscribers.find({streamId: b})) && g.push(b);
                        break;
                    case "answer":
                    case "pranswer":
                    case "generateoffer":
                    case "unsubscribe":
                        console.warn("generateoffer maybe?");
                        g = OT.publishers.where({streamId: b});
                        break;
                    case "candidate":
                        g = OT.publishers.where({streamId: b}).concat(OT.subscribers.where({streamId: b}));
                        break;
                    default:
                        OT.warn("OT.Raptor.dispatch: jsep#" + a + " is not currently implemented");
                        return
                }
                if (0 !== g.length) {
                    e = g[0].session.connections.get(c);
                    if (!e && c.match(/^symphony\./))e = OT.Connection.fromHash({
                        id: c,
                        creationTime: Date.now()
                    }), g[0].session.connections.add(e); else if (!e) {
                        OT.warn("OT.Raptor.dispatch: Messsage comes from a connection (" + c + ") that we do not know about. The message was ignored.");
                        return
                    }
                    g.forEach(function (b) {
                        b.processMessage(a, e, d)
                    })
                }
            };
            b.on("jsep#offer", d.bind(null, "offer"));
            b.on("jsep#answer", d.bind(null, "answer"));
            b.on("jsep#pranswer", d.bind(null, "pranswer"));
            b.on("jsep#generateoffer", d.bind(null, "generateoffer"));
            b.on("jsep#unsubscribe", d.bind(null, "unsubscribe"));
            b.on("jsep#candidate",
                d.bind(null, "candidate"));
            b.on("subscriberChannel#updated", function (b, d, e) {
                !b || !a.streams.has(b) ? OT.error("OT.Raptor.dispatch: Unable to determine streamId, or the stream does not exist, for subscriberChannel#updated message!") : a.streams.get(b)._.updateChannel(d, e)
            });
            b.on("subscriberChannel#update", function (b, d, e) {
                !d || !a.streams.has(d) ? OT.error("OT.Raptor.dispatch: Unable to determine streamId, or the stream does not exist, for subscriberChannel#update message!") : OT.subscribers.has(b) ? OT.subscribers.get(b).disableVideo(e.active) :
                    OT.error("OT.Raptor.dispatch: Unable to determine subscriberId, or the subscriber does not exist, for subscriberChannel#update message!")
            });
            b.on("subscriber#created", function (b, d, e) {
                (b = b ? a.streams.get(b) : null) ? a._.subscriberMap[d + "_" + b.id] = e : OT.error("OT.Raptor.dispatch: Unable to determine streamId, or the stream does not exist, for subscriber#created message!")
            });
            b.on("subscriber#deleted", function (b, d) {
                var e = b ? a.streams.get(b) : null;
                e ? delete a._.subscriberMap[d + "_" + e.id] : OT.error("OT.Raptor.dispatch: Unable to determine streamId, or the stream does not exist, for subscriber#created message!")
            });
            b.on("signal", function (b, d, e) {
                a._.dispatchSignal(a.connections.get(b), d, e)
            });
            b.on("archive#created", function (b) {
                g(b, a)
            });
            b.on("archive#updated", function (b, d) {
                var e = a.archives.get(b);
                e ? e._.update(d) : OT.error("OT.Raptor.dispatch: An archive does not exist with the id of " + b + ", for archive#updated message!")
            });
            return b
        }
})(window);
!function (d) {
    var a = new function () {
        var a = !1, g = !1, c = function () {
            g && a && OT.dispatchEvent(new OT.EnvLoadedEvent(OT.Event.names.ENV_LOADED))
        }, b = function () {
            g = !0;
            OT.$.on(d, "unload", function () {
                OT.publishers.destroy();
                OT.subscribers.destroy();
                OT.sessions.destroy()
            });
            OT.Config.load(OT.properties.configURL);
            c()
        }, e = function () {
            a = !0;
            OT.Config.off("dynamicConfigChanged", e);
            OT.Config.off("dynamicConfigLoadFailed", l);
            c()
        }, l = function () {
            e()
        };
        OT.Config.on("dynamicConfigChanged", e);
        OT.Config.on("dynamicConfigLoadFailed",
            l);
        "complete" === document.readyState || "interactive" === document.readyState && document.body ? b() : document.addEventListener ? document.addEventListener("DOMContentLoaded", b, !1) : document.attachEvent && document.attachEvent("onreadystatechange", function () {
            "complete" === document.readyState && b()
        });
        this.onLoad = function (b) {
            if (g && a)b(); else OT.on(OT.Event.names.ENV_LOADED, b)
        }
    };
    OT.onLoad = function (d, g) {
        if (g)a.onLoad(d.bind(g)); else a.onLoad(d)
    }
}(window);
!function () {
    function d(d, c, b, e) {
        var l = a[b];
        e = e ? OT.$.clone(e) : {};
        OT.error("OT.exception :: title: " + l + " (" + b + ") msg: " + c);
        e.partnerId || (e.partnerId = OT.APIKEY);
        try {
            h || (h = new OT.Analytics), h.logError(b, "tb.exception", l, {details: c}, e), OT.dispatchEvent(new OT.ExceptionEvent(OT.Event.names.EXCEPTION, c, l, b, d, d))
        } catch (f) {
            OT.error("OT.exception :: Failed to dispatch exception - " + f.toString())
        }
    }

    OT.Error = function (a, c) {
        this.code = a;
        this.message = c
    };
    var a = {
        1004: "Authentication error",
        1005: "Invalid Session ID",
        1006: "Connect Failed",
        1007: "Connect Rejected",
        1008: "Connect Time-out",
        1009: "Security Error",
        1010: "Not Connected",
        1011: "Invalid Parameter",
        1012: "Peer-to-peer Stream Play Failed",
        1013: "Connection Failed",
        1014: "API Response Failure",
        1500: "Unable to Publish",
        1520: "Unable to Force Disconnect",
        1530: "Unable to Force Unpublish",
        2E3: "Internal Error",
        2001: "Embed Failed",
        4E3: "WebSocket Connection Failed",
        4001: "WebSocket Network Disconnected"
    }, h;
    OT.handleJsException = function (a, c, b) {
        b = b || {};
        var e, h = b.session;
        h ? (e = {sessionId: h.sessionId}, h.connected && (e.connectionId = h.connection.connectionId), b.target || (b.target = h)) : b.sessionId && (e = {sessionId: b.sessionId}, b.target || (b.target = null));
        d(b.target, a, c, e)
    };
    OT.exceptionHandler = function (a, c, b, e, h) {
        var f;
        a && ((f = OT.components[a]) || OT.warn("Could not find the component with component ID " + a));
        d(f, c, e, h)
    };
    OT.dispatchError = function (a, c, b, d) {
        OT.error(a, c);
        b && OT.$.isFunction(b) && b.call(null, new OT.Error(a, c));
        OT.handleJsException(c, a, {session: d})
    }
}(window);
!function () {
    OT.ConnectionCapabilities = function (d) {
        d.supportsWebRTC = OT.$.castToBoolean(d.supportsWebRTC);
        this.supportsWebRTC = d.supportsWebRTC
    }
}(window);
!function () {
    OT.Connection = function (d, a, h, g, c) {
        var b;
        this.id = this.connectionId = d;
        this.creationTime = a ? Number(a) : null;
        this.data = h;
        this.capabilities = new OT.ConnectionCapabilities(g);
        this.permissions = new OT.Capabilities(c);
        this.quality = null;
        OT.$.eventing(this);
        this.destroy = function (a, c) {
            b = a || "clientDisconnected";
            !0 !== c && this.dispatchEvent(new OT.DestroyedEvent("destroyed", this, b))
        }.bind(this);
        Object.defineProperties(this, {
            destroyed: {
                get: function () {
                    return void 0 !== b
                }, enumerable: !0
            }, destroyedReason: {
                get: function () {
                    return b
                },
                enumerable: !0
            }
        })
    };
    OT.Connection.fromHash = function (d) {
        return new OT.Connection(d.id, d.creationTime, d.data, OT.$.extend(d.capablities || {}, {supportsWebRTC: !0}), d.permissions || [])
    }
}(window);
!function () {
    OT.StreamChannel = function (d) {
        this.id = d.id;
        this.type = d.type;
        this.active = OT.$.castToBoolean(d.active);
        this.orientation = d.orientation || OT.VideoOrientation.ROTATED_NORMAL;
        d.frameRate && (this.frameRate = parseFloat(d.frameRate, 10));
        this.width = parseInt(d.width, 10);
        this.height = parseInt(d.height, 10);
        OT.$.eventing(this, !0);
        this.update = function (a) {
            var d = {}, g = {}, c;
            for (c in a) {
                var b = this[c];
                switch (c) {
                    case "active":
                        this.active = OT.$.castToBoolean(a[c]);
                        break;
                    case "frameRate":
                        this.frameRate = parseFloat(a[c],
                            10);
                        break;
                    case "width":
                    case "height":
                        this[c] = parseInt(a[c], 10);
                        d[c] = this[c];
                        g[c] = b;
                        break;
                    case "orientation":
                        this[c] = a[c];
                        d[c] = this[c];
                        g[c] = b;
                        break;
                    default:
                        OT.warn("Tried to update unknown key " + c + " on " + this.type + " channel " + this.id);
                        return
                }
                this.trigger("update", this, c, b, this[c])
            }
            Object.keys(d).length && this.trigger("update", this, "videoDimensions", g, d);
            return !0
        }
    }
}(window);
!function () {
    var d = ["name", "archiving"];
    OT.Stream = function (a, h, g, c, b, e) {
        var l;
        this.id = this.streamId = a;
        this.name = h;
        this.creationTime = Number(g);
        this.connection = c;
        this.channel = e;
        this.publisherId = (this.publisher = OT.publishers.find({streamId: this.id})) ? this.publisher.id : null;
        OT.$.eventing(this);
        a = function (a, b, c, d) {
            switch (b) {
                case "active":
                    b = "audio" === a.type ? "hasAudio" : "hasVideo";
                    this[b] = d;
                    break;
                case "orientation":
                case "width":
                case "height":
                    this.videoDimensions = {width: a.width, height: a.height, orientation: a.orientation};
                    return
            }
            this.dispatchEvent(new OT.StreamUpdatedEvent(this, b, c, d))
        }.bind(this);
        var f = function () {
            return this.publisher ? this.publisher : OT.subscribers.find(function (a) {
                return a.streamId === this.id && a.session.id === b.id
            })
        }.bind(this);
        this.getChannelsOfType = function (a) {
            return this.channel.filter(function (b) {
                return b.type === a
            })
        };
        this.getChannel = function (a) {
            for (var b = 0; b < this.channel.length; ++b)if (this.channel[b].id === a)return this.channel[b];
            return null
        };
        h = this.getChannelsOfType("audio")[0];
        g = this.getChannelsOfType("video")[0];
        this.hasAudio = null != h && h.active;
        this.hasVideo = null != g && g.active;
        this.videoDimensions = {};
        g && (this.videoDimensions.width = g.width, this.videoDimensions.height = g.height, this.videoDimensions.orientation = g.orientation, g.on("update", a));
        if (h)h.on("update", a);
        this.setChannelActiveState = function (a, b, c) {
            b = {active: b};
            c && (b.activeReason = c);
            k(a, b)
        };
        this.setRestrictFrameRate = function (a) {
            k("video", {restrictFrameRate: a})
        };
        var k = function (a, c) {
            var d;
            if (this.publisher)d = function (a) {
                b._.streamChannelUpdate(this, a, c)
            };
            else {
                var e = OT.subscribers.find(function (a) {
                    return a.streamId === this.id && a.session.id === b.id
                }, this);
                d = function (a) {
                    b._.subscriberChannelUpdate(this, e, a, c)
                }
            }
            this.getChannelsOfType(a).forEach(d.bind(this))
        }.bind(this);
        this.destroy = function (a, b) {
            l = a || "clientDisconnected";
            !0 !== b && this.dispatchEvent(new OT.DestroyedEvent("destroyed", this, l))
        };
        Object.defineProperties(this, {
            destroyed: {
                get: function () {
                    return void 0 !== l
                }, enumerable: !0
            }, destroyedReason: {
                get: function () {
                    return l
                }, enumerable: !0
            }, frameRate: {
                get: function () {
                    return this.getChannelsOfType("video")[0].frameRate
                },
                enumerable: !0
            }
        });
        this._ = {};
        this._.updateProperty = function (a, b) {
            if (-1 === d.indexOf(a))OT.warn('Unknown stream property "' + a + '" was modified to "' + b + '".'); else {
                var c = this[a];
                switch (a) {
                    case "name":
                        this[a] = b;
                        break;
                    case "archiving":
                        var e = f();
                        e && e._.archivingStatus(b);
                        this[a] = b
                }
                c = new OT.StreamUpdatedEvent(this, a, c, b);
                this.dispatchEvent(c)
            }
        }.bind(this);
        this._.update = function (a) {
            for (var b in a)this._.updateProperty(b, a[b])
        }.bind(this);
        this._.updateChannel = function (a, b) {
            this.getChannel(a).update(b)
        }.bind(this)
    }
}(window);
!function () {
    OT.Archive = function (d, a, h) {
        this.id = d;
        this.name = a;
        this.status = h;
        this._ = {};
        OT.$.eventing(this);
        this._.update = function (a) {
            for (var c in a) {
                var b = this[c];
                this[c] = a[c];
                b = new OT.ArchiveUpdatedEvent(this, c, b, this[c]);
                this.dispatchEvent(b)
            }
        }.bind(this);
        this.destroy = function () {
        }
    }
}(window);
!function (d) {
    var a = d.mozRTCSessionDescription || d.RTCSessionDescription, h = d.mozRTCIceCandidate || d.RTCIceCandidate, g = function (a) {
            return function (b) {
                b.candidate ? a(OT.Raptor.Actions.CANDIDATE, b.candidate) : OT.debug("IceCandidateForwarder: No more ICE candidates.")
            }
        }, c = function () {
            var a = [], b = null;
            Object.defineProperty(this, "peerConnection", {
                set: function (a) {
                    b = a
                }
            });
            this.process = function (c) {
                c = new h(c.content);
                b ? b.addIceCandidate(c) : a.push(c)
            };
            this.processPending = function () {
                for (; a.length;)b.addIceCandidate(a.shift())
            }
        },
        b = function (a) {
            var b = /a=rtpmap:(\d+) CN\/\d+/i, c = [], d, e;
            a = a.split("\r\n").filter(function (a, f) {
                -1 !== a.indexOf("m\x3daudio") && (d = f);
                e = a.match(b);
                return null !== e ? (c.push(e[1]), !1) : !0
            });
            c.length && d && (a[d] = a[d].replace(RegExp(c.join("|"), "ig"), "").replace(/\s+/g, " "));
            return a.join("\r\n")
        }, e = function (a, c, d, e) {
            var g, h;
            g = function (a, b) {
                return function (c) {
                    OT.error(a);
                    OT.error(c);
                    e && e(a, c, b)
                }
            };
            h = function (c) {
                c.sdp = b(c.sdp);
                a.setLocalDescription(c, function () {
                    d(c)
                }, g("Error while setting LocalDescription", "SetLocalDescription"))
            };
            -1 === c.sdp.indexOf("a\x3dcrypto") && (c.sdp = c.sdp.replace(/^c=IN(.*)$/gmi, "c\x3dIN$1\r\na\x3dcrypto:1 AES_CM_128_HMAC_SHA1_80 inline:FakeFakeFakeFakeFakeFakeFakeFakeFakeFake\\r\\n"));
            -1 === c.sdp.indexOf("a\x3drtcp-fb") && (c.sdp = c.sdp.replace(/^m=video(.*)$/gmi, "m\x3dvideo$1\r\na\x3drtcp-fb:* ccm fir\r\na\x3drtcp-fb:* nack "));
            a.setRemoteDescription(c, function () {
                a.createAnswer(h, g("Error while setting createAnswer", "CreateAnswer"), null, !1)
            }, g("Error while setting RemoteDescription", "SetRemoteDescription"))
        },
        l = function (a, c, d) {
            var e, g;
            e = {mandatory: {}, optional: []};
            g = function (a, b) {
                return function (c) {
                    OT.error(a);
                    OT.error(c);
                    d && d(a, c, b)
                }
            };
            navigator.mozGetUserMedia && (e.mandatory.MozDontOfferDataChannel = !0);
            a.createOffer(function (d) {
                d.sdp = b(d.sdp);
                a.setLocalDescription(d, function () {
                    c(d)
                }, g("Error while setting LocalDescription", "SetLocalDescription"))
            }, g("Error while creating Offer", "CreateOffer"), e)
        };
    OT.PeerConnection = function (b) {
        var h, n = new c, m, q, s = "new", r = [], p, u = OT.$.now();
        OT.$.eventing(this);
        b.iceServers ||
        (b.iceServers = []);
        var v = function (a, b) {
            if (r.length)r[0](a, b)
        }.bind(this), t = function () {
            if (!h) {
                try {
                    OT.debug('Creating peer connection config "' + JSON.stringify(b) + '".'), (!b.iceServers || 0 === b.iceServers.length) && OT.error("No ice servers present"), h = OT.$.createPeerConnection(b, {optional: [{DtlsSrtpKeyAgreement: !0}]})
                } catch (a) {
                    return C("Failed to create PeerConnection, exception: " + a.message, "NewPeerConnection"), null
                }
                h.onicecandidate = g(v);
                h.onaddstream = D.bind(this);
                h.onremovestream = w.bind(this);
                void 0 !==
                h.onsignalingstatechange ? h.onsignalingstatechange = x.bind(this) : void 0 !== h.onstatechange && (h.onstatechange = x.bind(this));
                void 0 !== h.oniceconnectionstatechange && (h.oniceconnectionstatechange = function (a) {
                    "failed" === a.target.iceConnectionState && setTimeout(function () {
                        "failed" === a.target.iceConnectionState && C("The stream was unable to connect due to a network error. Make sure your connection isn't blocked by a firewall.", "ICEWorkflow")
                    }, 5E3)
                })
            }
            return h
        }.bind(this), B = function () {
            n && (n.peerConnection = null);
            null !== h && (h = null, this.trigger("close"))
        }, x = function (a) {
            a = "string" === typeof a ? a : a.target && a.target.signalingState ? a.target.signalingState : a.target.readyState;
            OT.debug("PeerConnection.stateChange: " + a);
            if (a && a.toLowerCase() !== s)switch (s = a.toLowerCase(), OT.debug("PeerConnection.stateChange: " + s), s) {
                case "closed":
                    B.call(this)
            }
        }, D = function (a) {
            this.trigger("streamAdded", a.stream)
        }, w = function (a) {
            this.trigger("streamRemoved", a.stream)
        }, E = function (b) {
            b = new a({type: "offer", sdp: b.content.sdp});
            t();
            e(h, b, function (a) {
                n.peerConnection =
                    h;
                n.processPending();
                v(OT.Raptor.Actions.ANSWER, a)
            }, function (a, b, c) {
                C("PeerConnection.offerProcessor " + a + ": " + b, c)
            })
        }, G = function (b) {
            b.content.sdp ? (q = new a({type: "answer", sdp: b.content.sdp}), h.setRemoteDescription(q, function () {
                OT.debug("setRemoteDescription Success")
            }, function (a) {
                C("Error while setting RemoteDescription " + a, "SetRemoteDescription")
            }), n.peerConnection = h, n.processPending()) : OT.error("PeerConnection.processMessage: Weird answer message, no SDP.")
        }, K = function () {
            OT.debug("PeerConnection.processSubscribe: Sending offer to subscriber.");
            t();
            l(h, function (a) {
                m = a;
                v(OT.Raptor.Actions.OFFER, m)
            }, function (a, b, c) {
                C("PeerConnection.suscribeProcessor " + a + ": " + b, c)
            })
        }, C = function (a, b) {
            OT.error(a);
            this.trigger("error", a, b)
        }.bind(this);
        this.addLocalStream = function (a) {
            t();
            h.addStream(a)
        };
        this.disconnect = function () {
            n = null;
            if (h) {
                var a = h.signalingState || h.readyState;
                a && "closed" !== a.toLowerCase() && h.close();
                B.call(this)
            }
            this.off()
        };
        this.processMessage = function (a, b) {
            OT.debug("PeerConnection.processMessage: Received " + a + " from " + b.fromAddress);
            OT.debug(b);
            switch (a) {
                case "generateoffer":
                    K.call(this, b);
                    break;
                case "offer":
                    E.call(this, b);
                    break;
                case "answer":
                case "pranswer":
                    G.call(this, b);
                    break;
                case "candidate":
                    n.process(b);
                    break;
                default:
                    OT.debug("PeerConnection.processMessage: Received an unexpected message of type " + a + " from " + b.fromAddress + ": " + JSON.stringify(b))
            }
            return this
        };
        this.setIceServers = function (a) {
            a && (b.iceServers = a)
        };
        this.registerMessageDelegate = function (a) {
            return r.push(a)
        };
        this.unregisterMessageDelegate = function (a) {
            a = r.indexOf(a);
            -1 !== a &&
            r.splice(a, 1);
            return r.length
        };
        this.getStats = function (a, b) {
            var c = {}, e, f, g, l, m, n, r;
            !0 === p ? OT.warn("PeerConnection.getStats: Already getting the stats!") : (p = !0, e = OT.$.now(), f = (e - a.timeStamp) / 1E3, a.timeStamp = e, g = function (b) {
                var c = a.videoBytesTransferred || 0;
                return b.bytesSent || b.bytesReceived ? (a.videoBytesTransferred = b.bytesSent || b.bytesReceived, Math.round(8 * (a.videoBytesTransferred - c) / f)) : b.stat("googFrameHeightSent") ? (a.videoBytesTransferred = b.stat("bytesSent"), Math.round(8 * (a.videoBytesTransferred -
                c) / f)) : b.stat("googFrameHeightReceived") ? (a.videoBytesTransferred = b.stat("bytesReceived"), Math.round(8 * (a.videoBytesTransferred - c) / f)) : NaN
            }, l = function (b) {
                var c = a.audioBytesTransferred || 0;
                return b.bytesSent || b.bytesReceived ? (a.audioBytesTransferred = b.bytesSent || b.bytesReceived, Math.round(8 * (a.audioBytesTransferred - c) / f)) : b.stat("audioInputLevel") ? (a.audioBytesTransferred = b.stat("bytesSent"), Math.round(8 * (a.audioBytesTransferred - c) / f)) : b.stat("audioOutputLevel") ? (a.audioBytesTransferred = b.stat("bytesReceived"),
                    Math.round(8 * (a.audioBytesTransferred - c) / f)) : NaN
            }, m = function (a) {
                return a.stat("googFrameRateSent") ? a.stat("googFrameRateSent") : a.stat("googFrameRateReceived") ? a.stat("googFrameRateReceived") : null
            }, n = function (a) {
                if (a.result) {
                    a = a.result();
                    for (var d = 0; d < a.length; d++) {
                        var e = a[d];
                        if (e.stat) {
                            "true" === e.stat("googActiveConnection") && (c.localCandidateType = e.stat("googLocalCandidateType"), c.remoteCandidateType = e.stat("googRemoteCandidateType"), c.transportType = e.stat("googTransportType"));
                            var f = g(e);
                            isNaN(f) ||
                            (c.avgVideoBitrate = f);
                            f = l(e);
                            isNaN(f) || (c.avgAudioBitrate = f);
                            e = m(e);
                            null != e && (c.frameRate = e)
                        }
                    }
                }
                p = !1;
                b(c)
            }, c.duration = Math.round(e - u), e = function (a) {
                for (var d in a)if (a.hasOwnProperty(d) && ("outboundrtp" === a[d].type || "inboundrtp" === a[d].type)) {
                    var e = a[d];
                    -1 !== e.id.indexOf("video") ? (e = g(e), isNaN(e) || (c.avgVideoBitrate = e)) : -1 !== e.id.indexOf("audio") && (e = l(e), isNaN(e) || (c.avgAudioBitrate = e))
                }
                p = !1;
                b(c)
            }, r = function () {
                var a = d.navigator.userAgent.toLowerCase().match(/Firefox\/([0-9\.]+)/i), b = null !== a && 27 <=
                    parseFloat(a[1], 10);
                r = function () {
                    return b
                };
                return b
            }, h && h.getStats ? r() ? h.getStats(null, e, function (a) {
                OT.warn("Error collecting stats", a);
                p = !1
            }) : h.getStats(n) : (p = !1, b(c)))
        };
        Object.defineProperty(this, "remoteStreams", {
            get: function () {
                var a;
                if (h) {
                    if (h.getRemoteStreams)a = h.getRemoteStreams(); else if (h.remoteStreams)a = h.remoteStreams; else throw Error("Invalid Peer Connection object implements no method for retrieving remote streams");
                    a = Array.prototype.slice.call(a)
                } else a = [];
                return a
            }
        })
    }
}(window);
!function () {
    var d = {};
    OT.PeerConnections = {
        add: function (a, h, g) {
            a = a.id + "_" + h;
            (h = d[a]) || (h = d[a] = {count: 0, pc: new OT.PeerConnection(g)});
            h.count += 1;
            return h.pc
        }, remove: function (a, h) {
            var g = a.id + "_" + h, c = d[g];
            c && (c.count -= 1, 0 === c.count && (c.pc.disconnect(), delete d[g]))
        }
    }
}(window);
!function () {
    OT.PublisherPeerConnection = function (d, a, h, g) {
        var c, b = !1, e = a._.subscriberMap[d.id + "_" + h], l, f, k;
        l = function () {
            this.destroy();
            this.trigger("disconnected", this)
        };
        f = function (a, b) {
            this.trigger("error", null, a, this, b);
            this.destroy()
        };
        k = function (c, d) {
            if (!b && (c === OT.Raptor.Actions.CANDIDATE || c === OT.Raptor.Actions.OFFER || c === OT.Raptor.Actions.ANSWER || c === OT.Raptor.Actions.PRANSWER))b = -1 !== (c === OT.Raptor.Actions.CANDIDATE ? d.candidate : d.sdp).indexOf("typ relay");
            switch (c) {
                case OT.Raptor.Actions.ANSWER:
                case OT.Raptor.Actions.PRANSWER:
                    a.sessionInfo.p2pEnabled ?
                        a._.jsepAnswerP2p(h, e, d.sdp) : a._.jsepAnswer(h, d.sdp);
                    break;
                case OT.Raptor.Actions.OFFER:
                    this.trigger("connected");
                    a.sessionInfo.p2pEnabled ? a._.jsepOfferP2p(h, e, d.sdp) : a._.jsepOffer(h, d.sdp);
                    break;
                case OT.Raptor.Actions.CANDIDATE:
                    a.sessionInfo.p2pEnabled ? a._.jsepCandidateP2p(h, e, d) : a._.jsepCandidate(h, d)
            }
        }.bind(this);
        OT.$.eventing(this);
        this.destroy = function () {
            c && OT.PeerConnections.remove(d, h);
            c.off();
            c = null
        };
        this.processMessage = function (a, b) {
            c.processMessage(a, b)
        };
        this.getStats = function (a, b) {
            c.getStats(a,
                b)
        };
        this.init = function (a) {
            c = OT.PeerConnections.add(d, h, {iceServers: a});
            c.on({close: l, error: f}, this);
            c.registerMessageDelegate(k);
            c.addLocalStream(g);
            Object.defineProperty(this, "remoteConnection", {value: d});
            Object.defineProperty(this, "hasRelayCandidates", {
                get: function () {
                    return b
                }
            })
        }
    }
}(window);
!function () {
    OT.SubscriberPeerConnection = function (d, a, h, g, c) {
        var b, e = !1, l, f, k, n, m, q;
        l = function () {
            this.destroy();
            this.trigger("disconnected", this)
        };
        f = function (a) {
            this.trigger("remoteStreamAdded", a, this)
        };
        k = function (a) {
            this.trigger("remoteStreamRemoved", a, this)
        };
        n = function (a, b) {
            this.trigger("error", null, a, this, b)
        };
        m = function (b, c) {
            if (!e && (b === OT.Raptor.Actions.CANDIDATE || b === OT.Raptor.Actions.OFFER || b === OT.Raptor.Actions.ANSWER || b === OT.Raptor.Actions.PRANSWER))e = -1 !== (b === OT.Raptor.Actions.CANDIDATE ?
                c.candidate : c.sdp).indexOf("typ relay");
            switch (b) {
                case OT.Raptor.Actions.ANSWER:
                case OT.Raptor.Actions.PRANSWER:
                    this.trigger("connected");
                    a._.jsepAnswerP2p(h.id, g.widgetId, c.sdp);
                    break;
                case OT.Raptor.Actions.OFFER:
                    a._.jsepOfferP2p(h.id, g.widgetId, c.sdp);
                    break;
                case OT.Raptor.Actions.CANDIDATE:
                    a._.jsepCandidateP2p(h.id, g.widgetId, c)
            }
        }.bind(this);
        q = function (a) {
            var c = "get" + (a ? "Video" : "Audio") + "Tracks";
            return function (a) {
                var d = b.remoteStreams, e;
                if (0 !== d.length && d[0][c])for (var f = 0, g = d.length; f < g; ++f) {
                    e =
                        d[f];
                    e = e[c]();
                    for (var h = 0, k = e.length; h < k; ++h)e[h].enabled !== a && (e[h].enabled = a)
                }
            }
        };
        OT.$.eventing(this);
        this.destroy = function () {
            b && (0 === b.unregisterMessageDelegate(m) && (a && (a.connected && h && !h.destroyed) && a._.subscriberDestroy(h, g), this.subscribeToAudio(!1)), OT.PeerConnections.remove(d, h.streamId));
            b = null;
            this.off()
        };
        this.processMessage = function (a, c) {
            b.processMessage(a, c)
        };
        this.getStats = function (a, c) {
            b.getStats(a, c)
        };
        this.subscribeToAudio = q(!1);
        this.subscribeToVideo = q(!0);
        Object.defineProperty(this,
            "hasRelayCandidates", {
                get: function () {
                    return e
                }
            });
        this.init = function () {
            b = OT.PeerConnections.add(d, h.streamId, {});
            b.on({close: l, streamAdded: f, streamRemoved: k, error: n}, this);
            var e = b.registerMessageDelegate(m);
            if (0 < b.remoteStreams.length)b.remoteStreams.forEach(f, this); else if (1 === e) {
                var q;
                if (c.subscribeToVideo || c.subscribeToAudio)e = h.getChannelsOfType("audio"), q = h.getChannelsOfType("video"), q = e.map(function (a) {
                    return {id: a.id, type: a.type, active: c.subscribeToAudio}
                }).concat(q.map(function (a) {
                    return {
                        id: a.id,
                        type: a.type,
                        active: c.subscribeToVideo,
                        restrictFrameRate: void 0 !== c.restrictFrameRate ? c.restrictFrameRate : !1
                    }
                }));
                a._.subscriberCreate(h, g, q, function (a, c) {
                    a && this.trigger("error", null, a.message, this, "Subscribe");
                    b.setIceServers(OT.Raptor.parseIceServers(c))
                }.bind(this))
            }
        }
    }
}(window);
!function () {
    OT.Chrome = function (d) {
        var a = {}, h = function (g, c) {
            c.parent = this;
            c.appendTo(d.parent);
            a[g] = c;
            Object.defineProperty(this, g, {
                get: function () {
                    return a[g]
                }
            })
        };
        d.parent && (OT.$.eventing(this), this.destroy = function () {
            this.off();
            this.hide();
            for (var d in a)a[d].destroy()
        }, this.show = function () {
            for (var d in a)a[d].show()
        }, this.hide = function () {
            for (var d in a)a[d].hide()
        }, this.set = function (a, c) {
            if ("string" === typeof a && c)h.call(this, a, c); else for (var b in a)a.hasOwnProperty(b) && h.call(this, b, a[b]);
            return this
        })
    }
}(window);
!function () {
    OT.Chrome.Behaviour || (OT.Chrome.Behaviour = {});
    OT.Chrome.Behaviour.Widget = function (d, a) {
        var h = a || {}, g, c;
        d.setDisplayMode = function (a) {
            a = a || "auto";
            g !== a && (OT.$.removeClass(this.domElement, "OT_mode-" + g), OT.$.addClass(this.domElement, "OT_mode-" + a), c = g, g = a)
        };
        d.show = function () {
            this.setDisplayMode(c);
            if (h.onShow)h.onShow();
            return this
        };
        d.hide = function () {
            this.setDisplayMode("off");
            if (h.onHide)h.onHide();
            return this
        };
        d.destroy = function () {
            if (h.onDestroy)h.onDestroy(this.domElement);
            this.domElement &&
            OT.$.removeElement(this.domElement);
            return d
        };
        d.appendTo = function (a) {
            this.domElement = OT.$.createElement(h.nodeName || "div", h.htmlAttributes, h.htmlContent);
            if (h.onCreate)h.onCreate(this.domElement);
            "auto" !== h.mode ? d.setDisplayMode(h.mode) : (d.setDisplayMode("on"), setTimeout(function () {
                d.setDisplayMode(h.mode)
            }, 2E3));
            a.appendChild(this.domElement);
            return d
        }
    }
}(window);
!function () {
    OT.Chrome.BackingBar = function (d) {
        function a() {
            return "on" === h || "on" === g ? "on" : "mini" === h || "mini" === g ? "mini" : "mini-auto" === h || "mini-auto" === g ? "mini-auto" : "auto" === h || "auto" === g ? "auto" : "off"
        }

        var h = d.nameMode, g = d.muteMode, c;
        Object.defineProperty(this, "domElement", {
            get: function () {
                return c
            }, set: function (a) {
                c = a
            }
        });
        OT.Chrome.Behaviour.Widget(this, {
            mode: a(),
            nodeName: "div",
            htmlContent: "",
            htmlAttributes: {className: "OT_bar OT_edge-bar-item"}
        });
        this.setNameMode = function (b) {
            h = b;
            this.setDisplayMode(a())
        };
        this.setMuteMode = function (b) {
            g = b;
            this.setDisplayMode(a())
        }
    }
}(window);
!function () {
    OT.Chrome.NamePanel = function (d) {
        var a = d.name, h = d.bugMode, g;
        if (!a || "" === a.trim().length)a = null, d.mode = "off";
        Object.defineProperty(this, "domElement", {
            get: function () {
                return g
            }, set: function (a) {
                g = a
            }
        });
        Object.defineProperty(this, "name", {
            set: function (c) {
                a || this.setDisplayMode("auto");
                a = c;
                g.innerHTML = a
            }.bind(this)
        });
        this.setBugMode = function (a) {
            h = a;
            "off" === a ? OT.$.addClass(g, "OT_name-no-bug") : OT.$.removeClass(g, "OT_name-no-bug")
        };
        OT.Chrome.Behaviour.Widget(this, {
            mode: d.mode, nodeName: "h1", htmlContent: a,
            htmlAttributes: {className: "OT_name OT_edge-bar-item"}, onCreate: function () {
                this.setBugMode(h)
            }.bind(this)
        })
    }
}(window);
!function () {
    OT.Chrome.MuteButton = function (d) {
        var a, h = d.muted || !1, g, c, b;
        Object.defineProperty(this, "domElement", {
            get: function () {
                return g
            }, set: function (a) {
                g = a
            }
        });
        c = function () {
            h ? OT.$.addClass(g, "OT_active") : OT.$.removeClass(g, "OT_active ")
        };
        b = function () {
            h = !h;
            c();
            h ? this.parent.trigger("muted", this) : this.parent.trigger("unmuted", this);
            return !1
        };
        Object.defineProperty(this, "muted", {
            get: function () {
                return h
            }, set: function (a) {
                h = a;
                c()
            }
        });
        OT.Chrome.Behaviour.Widget(this, {
            mode: d.mode,
            nodeName: "button",
            htmlContent: "Mute",
            htmlAttributes: {className: h ? "OT_edge-bar-item OT_mute OT_active" : "OT_edge-bar-item OT_mute"},
            onCreate: function (c) {
                a = b.bind(this);
                c.addEventListener("click", a, !1)
            }.bind(this),
            onDestroy: function (b) {
                a = null;
                b.removeEventListener("click", a, !1)
            }.bind(this)
        })
    }
}(window);
!function () {
    OT.Chrome.OpenTokButton = function (d) {
        var a;
        Object.defineProperty(this, "domElement", {
            get: function () {
                return a
            }, set: function (d) {
                a = d
            }
        });
        OT.Chrome.Behaviour.Widget(this, {
            mode: d ? d.mode : null,
            nodeName: "span",
            htmlContent: "OpenTok",
            htmlAttributes: {className: "OT_opentok OT_edge-bar-item"}
        })
    }
}(window);
!function () {
    OT.Chrome.Archiving = function (d) {
        var a = d.archiving, h = d.archivingStarted || "Archiving on", g = d.archivingEnded || "Archiving off", c = !0, b, e, l, f, k, n, m;
        Object.defineProperty(this, "domElement", {
            get: function () {
                return f
            }, set: function (a) {
                f = a
            }
        });
        n = function (a) {
            l.innerText = a;
            b.setAttribute("title", a)
        };
        m = function () {
            k && (clearTimeout(k), k = null);
            a ? OT.$.addClass(e, "OT_active") : OT.$.removeClass(e, "OT_active");
            OT.$.removeClass(f, "OT_archiving-" + (!a ? "on" : "off"));
            OT.$.addClass(f, "OT_archiving-" + (a ? "on" : "off"));
            d.show && a ? (n(h), OT.$.addClass(l, "OT_mode-on"), OT.$.removeClass(l, "OT_mode-auto"), this.setDisplayMode("on"), k = setTimeout(function () {
                OT.$.addClass(l, "OT_mode-auto");
                OT.$.removeClass(l, "OT_mode-on")
            }.bind(this), 5E3)) : d.show && !c ? (OT.$.addClass(l, "OT_mode-on"), OT.$.removeClass(l, "OT_mode-auto"), this.setDisplayMode("on"), n(g), k = setTimeout(function () {
                this.setDisplayMode("off")
            }.bind(this), 5E3)) : this.setDisplayMode("off")
        }.bind(this);
        OT.Chrome.Behaviour.Widget(this, {
            mode: a && d.show && "on" || "off", nodeName: "h1",
            htmlAttributes: {className: "OT_archiving OT_edge-bar-item OT_edge-bottom"}, onCreate: function () {
                b = OT.$.createElement("div", {className: "OT_archiving-light-box"}, "");
                e = OT.$.createElement("div", {className: "OT_archiving-light"}, "");
                b.appendChild(e);
                l = OT.$.createElement("div", {className: "OT_archiving-status OT_mode-on OT_edge-bar-item OT_edge-bottom"}, "");
                f.appendChild(b);
                f.appendChild(l);
                m()
            }
        });
        this.setShowArchiveStatus = function (a) {
            d.show = a;
            f && m.call(this)
        };
        this.setArchiving = function (b) {
            a = b;
            c = !1;
            f && m.call(this)
        }
    }
}(window);
(function () {
    OT.StylableComponent = function (a, h) {
        if (!a.trigger)throw Error("OT.StylableComponent is dependent on the mixin OT.$.eventing. Ensure that this is included in the object before StylableComponent.");
        var g = new d(h, function (c, b, d) {
            d ? a.trigger("styleValueChanged", c, b, d) : a.trigger("styleValueChanged", c, b)
        });
        a.getStyle = function (a) {
            return g.get(a)
        };
        a.setStyle = function (a, b, d) {
            "string" !== typeof a ? g.setAll(a, d) : g.set(a, b);
            return this
        }
    };
    var d = function (a, d) {
        var g = {}, c, b, e, l;
        c = "showMicButton showSpeakerButton nameDisplayMode buttonDisplayMode backgroundImageURI bugDisplayMode".split(" ");
        b = {
            buttonDisplayMode: ["auto", "mini", "mini-auto", "off", "on"],
            nameDisplayMode: ["auto", "off", "on"],
            bugDisplayMode: ["auto", "off", "on"],
            showSettingsButton: [!0, !1],
            showMicButton: [!0, !1],
            backgroundImageURI: null,
            showControlBar: [!0, !1],
            showArchiveStatus: [!0, !1]
        };
        e = function (a, c) {
            return "backgroundImageURI" === a || b.hasOwnProperty(a) && -1 !== b[a].indexOf(c)
        };
        l = function (a) {
            switch (a) {
                case "true":
                    return !0;
                case "false":
                    return !1;
                default:
                    return a
            }
        };
        this.getAll = function () {
            var a = OT.$.clone(g), b;
            for (b in a)0 > c.indexOf(b) && delete a[b];
            return a
        };
        this.get = function (a) {
            return a ? g[a] : this.getAll()
        };
        this.setAll = function (a, b) {
            var c, m, q;
            for (q in a)m = l(a[q]), e(q, m) ? (c = g[q], m !== c && (g[q] = m, b || d(q, m, c))) : OT.warn("Style.setAll::Invalid style property passed " + q + " : " + m);
            return this
        };
        this.set = function (a, b) {
            OT.debug("Publisher.setStyle: " + a.toString());
            var c = l(b), m;
            if (!e(a, c))return OT.warn("Style.set::Invalid style property passed " + a + " : " + c), this;
            m = g[a];
            c !== m && (g[a] = c, d(a, b, m));
            return this
        };
        a && this.setAll(a, !0)
    }
})(window);
!function () {
    OT.Microphone = function (d, a) {
        var h, g = 50;
        Object.defineProperty(this, "muted", {
            get: function () {
                return h
            }, set: function (a) {
                if (h !== a) {
                    h = a;
                    a = d.getAudioTracks();
                    for (var b = 0, e = a.length; b < e; ++b)a[b].enabled = !h
                }
            }
        });
        Object.defineProperty(this, "gain", {
            get: function () {
                return g
            }, set: function (a) {
                OT.warn("OT.Microphone.gain IS NOT YET IMPLEMENTED");
                g = a
            }
        });
        void 0 !== a ? this.muted = !0 === a : d.getAudioTracks().length ? this.muted = !d.getAudioTracks()[0].enabled : this.muted = !1
    }
}(window);
!function () {
    OT.generateSimpleStateMachine = function (d, a, h) {
        var g = a.slice(), c = OT.$.clone(h);
        return function (a) {
            function e(c, d) {
                a({message: c, newState: d, currentState: h, previousState: f})
            }

            var h = d, f = null;
            this.set = function (a) {
                var b;
                -1 !== g.indexOf(a) ? c[h] && -1 !== c[h].indexOf(a) ? b = !0 : (e("'" + h + "' cannot transition to '" + a + "'", a), b = !1) : (e("'" + a + "' is not a valid state", a), b = !1);
                b && (f = h, h = a)
            };
            Object.defineProperties(this, {
                current: {
                    get: function () {
                        return h
                    }
                }, subscribing: {
                    get: function () {
                        return "Subscribing" === h
                    }
                }
            })
        }
    }
}(window);
!function () {
    OT.SubscribingState = OT.generateSimpleStateMachine("NotSubscribing", "NotSubscribing Init ConnectingToPeer BindingRemoteStream Subscribing Failed".split(" "), {
        NotSubscribing: ["NotSubscribing", "Init"],
        Init: ["NotSubscribing", "ConnectingToPeer", "BindingRemoteStream"],
        ConnectingToPeer: ["NotSubscribing", "BindingRemoteStream", "Failed"],
        BindingRemoteStream: ["NotSubscribing", "Subscribing", "Failed"],
        Subscribing: ["NotSubscribing", "Failed"],
        Failed: []
    });
    Object.defineProperty(OT.SubscribingState.prototype,
        "attemptingToSubscribe", {
            get: function () {
                return -1 !== ["Init", "ConnectingToPeer", "BindingRemoteStream"].indexOf(this.current)
            }
        })
}(window);
!function () {
    OT.PublishingState = OT.generateSimpleStateMachine("NotPublishing", "NotPublishing GetUserMedia BindingMedia MediaBound PublishingToSession Publishing Failed".split(" "), {
        NotPublishing: ["NotPublishing", "GetUserMedia"],
        GetUserMedia: ["BindingMedia", "Failed", "NotPublishing"],
        BindingMedia: ["MediaBound", "Failed", "NotPublishing"],
        MediaBound: ["NotPublishing", "PublishingToSession", "Failed"],
        PublishingToSession: ["NotPublishing", "Publishing", "Failed"],
        Publishing: ["NotPublishing", "MediaBound", "Failed"],
        Failed: []
    });
    Object.defineProperties(OT.PublishingState.prototype, {
        attemptingToPublish: {
            get: function () {
                return -1 !== ["GetUserMedia", "BindingMedia", "MediaBound", "PublishingToSession"].indexOf(this.current)
            }
        }, publishing: {
            get: function () {
                return "Publishing" === this.current
            }
        }
    })
}(window);
!function () {
    var d = {audio: !0, video: !0};
    OT.Publisher = function () {
        if (OT.checkSystemRequirements()) {
            var a = OT.Publisher.nextId(), h, g, c, b, e, l, f, k = {}, n = !1, m, q, s, r, p = new OT.Analytics, u, v = [1, 7, 15, 30], t = {}, B, x, D;
            u = {
                "320x240": {width: 320, height: 240},
                "640x480": {width: 640, height: 480},
                "1280x720": {width: 1280, height: 720}
            };
            B = {timeStamp: OT.$.now()};
            OT.$.eventing(this);
            OT.StylableComponent(this, {
                showMicButton: !0,
                showArchiveStatus: !0,
                nameDisplayMode: "auto",
                buttonDisplayMode: "auto",
                bugDisplayMode: "auto",
                backgroundImageURI: null
            });
            var w = function (c, d, e, g) {
                    p.logEvent({
                        action: c,
                        variation: d,
                        payload_type: e,
                        payload: g,
                        session_id: f ? f.sessionId : null,
                        connection_id: f && f.connected ? f.connection.connectionId : null,
                        partner_id: f ? f.apiKey : OT.APIKEY,
                        streamId: b ? b.id : null,
                        widget_id: a,
                        widget_type: "Publisher"
                    })
                }, E = function (c) {
                    var d = {
                        widget_type: "Publisher",
                        stream_type: "WebRTC",
                        sessionId: f ? f.sessionId : null,
                        connectionId: f && f.connected ? f.connection.connectionId : null,
                        partnerId: f ? f.apiKey : OT.APIKEY,
                        streamId: b ? b.id : null,
                        widgetId: a,
                        version: OT.properties.version,
                        media_server_name: f ? f.sessionInfo.messagingServer : null,
                        p2pFlag: f ? f.sessionInfo.p2pEnabled : !1,
                        duration: q ? (new Date).getTime() - q.getTime() : 0,
                        remote_connection_id: c
                    };
                    k[c].getStats(B, function (a) {
                        var b;
                        if (a)for (b in a)d[b] = a[b];
                        p.logQOS(d)
                    })
                }, G = function () {
                    OT.debug("OT.Publisher.onLoaded");
                    x.set("MediaBound");
                    g.loading = !1;
                    n = !0;
                    "off" === this.getStyle("bugDisplayMode") && w("bugDisplayMode", "createChrome", "mode", "off");
                    this.getStyle("showArchiveStatus") || w("showArchiveStatus", "createChrome", "mode", "off");
                    r =
                        (new OT.Chrome({parent: g.domElement})).set({
                            backingBar: new OT.Chrome.BackingBar({
                                nameMode: this.getStyle("nameDisplayMode"),
                                muteMode: A.call(this, this.getStyle("showMicButton"))
                            }),
                            name: new OT.Chrome.NamePanel({
                                name: m.name,
                                mode: this.getStyle("nameDisplayMode"),
                                bugMode: this.getStyle("bugDisplayMode")
                            }),
                            muteButton: new OT.Chrome.MuteButton({
                                muted: !1 === m.publishAudio,
                                mode: A.call(this, this.getStyle("showMicButton"))
                            }),
                            opentokButton: new OT.Chrome.OpenTokButton({mode: this.getStyle("bugDisplayMode")}),
                            archive: new OT.Chrome.Archiving({
                                show: this.getStyle("showArchiveStatus"),
                                archiving: !1
                            })
                        }).on({muted: this.publishAudio.bind(this, !1), unmuted: this.publishAudio.bind(this, !0)});
                    this.trigger("initSuccess");
                    this.trigger("loaded", this)
                }, K = function (a) {
                    w("publish", "Failure", "reason", "Publisher PeerConnection Error: " + a);
                    x.set("Failed");
                    this.trigger("publishComplete", new OT.Error(OT.ExceptionCodes.P2P_CONNECTION_FAILED, "Publisher PeerConnection Error: " + a));
                    OT.handleJsException("Publisher PeerConnection Error: " + a, OT.ExceptionCodes.P2P_CONNECTION_FAILED, {
                        session: f,
                        target: this
                    })
                },
                C = function (a) {
                    OT.debug("OT.Publisher.onStreamAvailable");
                    x.set("BindingMedia");
                    l && (l.stop(), l = null);
                    l = a;
                    s = new OT.Microphone(l, !m.publishAudio);
                    this.publishVideo(m.publishVideo && 0 < l.getVideoTracks().length);
                    this.dispatchEvent(new OT.Event(OT.Event.names.ACCESS_ALLOWED, !1));
                    c = new OT.VideoElement({attributes: {muted: !0}});
                    c.on({streamBound: G, loadError: K, error: R}, this).bindToStream(l);
                    g.video = c
                }, I = function (a) {
                    OT.error("OT.Publisher.onStreamAvailableError " + a.name + ": " + a.message);
                    x.set("Failed");
                    this.trigger("publishComplete",
                        new OT.Error(OT.ExceptionCodes.UNABLE_TO_PUBLISH, a.message));
                    g && g.destroy();
                    w("publish", "Failure", "reason", "GetUserMedia:Publisher failed to access camera/mic: " + a.message);
                    OT.handleJsException("Publisher failed to access camera/mic: " + a.message, OT.ExceptionCodes.UNABLE_TO_PUBLISH, {
                        session: f,
                        target: this
                    })
                }, L = function (a) {
                    OT.error("OT.Publisher.onStreamAvailableError Permission Denied");
                    x.set("Failed");
                    this.trigger("publishComplete", new OT.Error(OT.ExceptionCodes.UNABLE_TO_PUBLISH, "Publisher Access Denied: Permission Denied" +
                    (a.message ? ": " + a.message : "")));
                    w("publish", "Failure", "reason", "GetUserMedia:Publisher Access Denied: Permission Denied");
                    var b = OT.$.browserVersion(), c = new OT.Event(OT.Event.names.ACCESS_DENIED);
                    this.dispatchEvent(c, function () {
                        c.isDefaultPrevented() || ("Chrome" === b.browser ? (g && g.addError("", null, "OT_publisher-denied-chrome"), H ? OT.Dialogs.AllowDeny.Chrome.deniedNow() : OT.Dialogs.AllowDeny.Chrome.previouslyDenied(window.location.hostname)) : "Firefox" === b.browser && (g && g.addError("", "Click the reload button in the URL bar to change camera \x26 mic settings.",
                            "OT_publisher-denied-firefox"), OT.Dialogs.AllowDeny.Firefox.denied().on({
                            refresh: function () {
                                window.location.reload()
                            }
                        })))
                    })
                }, z, F, H = !1, N = function () {
                    H = !0;
                    w("accessDialog", "Opened", "", "");
                    var a = OT.$.browserVersion();
                    this.dispatchEvent(new OT.Event(OT.Event.names.ACCESS_DIALOG_OPENED, !0), function (b) {
                        b.isDefaultPrevented() || ("Chrome" === a.browser ? z = OT.Dialogs.AllowDeny.Chrome.initialPrompt() : "Firefox" === a.browser && (F = setTimeout(function () {
                            z = OT.Dialogs.AllowDeny.Firefox.maybeDenied()
                        }, 7E3)))
                    })
                }, M = function () {
                    w("accessDialog",
                        "Closed", "", "");
                    F && (clearTimeout(F), F = null);
                    z && (z.close(), z = null);
                    this.dispatchEvent(new OT.Event(OT.Event.names.ACCESS_DIALOG_CLOSED, !1))
                }, R = function (a, b) {
                    OT.error("OT.Publisher.onVideoError");
                    var c = b + (a ? " (" + a + ")" : "");
                    w("stream", null, "reason", "Publisher while playing stream: " + c);
                    x.set("Failed");
                    x.attemptingToPublish ? this.trigger("publishComplete", new OT.Error(OT.ExceptionCodes.UNABLE_TO_PUBLISH, c)) : this.trigger("error", c);
                    OT.handleJsException("Publisher error playing stream: " + c, OT.ExceptionCodes.UNABLE_TO_PUBLISH,
                        {session: f, target: this})
                }, P = function (a) {
                    OT.debug("OT.Subscriber has been disconnected from the Publisher's PeerConnection");
                    this.cleanupSubscriber(a.remoteConnection.id)
                }, Q = function (a, b, c, d) {
                    w("publish", "Failure", "reason|hasRelayCandidates", (d ? d : "") + [":Publisher PeerConnection with connection " + (c && c.remoteConnection && c.remoteConnection.id) + " failed: " + b, c.hasRelayCandidates].join("|"));
                    OT.handleJsException("Publisher PeerConnection Error: " + b, OT.ExceptionCodes.UNABLE_TO_PUBLISH, {
                        session: f,
                        target: this
                    });
                    clearInterval(t[c.remoteConnection.id]);
                    delete t[c.remoteConnection.id];
                    delete k[c.remoteConnection.id]
                }, y = function (a) {
                    b = a;
                    b.on("destroyed", this.disconnect, this);
                    x.set("Publishing");
                    q = new Date;
                    this.trigger("publishComplete", null, this);
                    this.dispatchEvent(new OT.StreamEvent("streamCreated", a, null, !1));
                    w("publish", "Success", "streamType:streamId", "WebRTC:" + e)
                }.bind(this), O = function (a) {
                    var b = k[a.id];
                    if (!b) {
                        var c = OT.$.now();
                        w("createPeerConnection", "Attempt", "", "");
                        a.on("destroyed", this.cleanupSubscriber.bind(this,
                            a.id));
                        b = k[a.id] = new OT.PublisherPeerConnection(a, f, e, l);
                        b.on({
                            connected: function () {
                                w("createPeerConnection", "Success", "pcc|hasRelayCandidates", [parseInt(OT.$.now() - c, 10), b.hasRelayCandidates].join("|"));
                                t[a.id] = setInterval(function () {
                                    E(a.id)
                                }, 3E4)
                            }, disconnected: P, error: Q
                        }, this);
                        b.init(D)
                    }
                    return b
                }, A = function (a) {
                    if (!1 === a)return "off";
                    a = this.getStyle("buttonDisplayMode");
                    return !1 === a ? "on" : a
                }, S = function () {
                    r && (r.destroy(), r = null);
                    this.disconnect();
                    s = null;
                    c && (c.destroy(), c = null);
                    l && (l.stop(), l = null);
                    g && (g.destroy(), g = null);
                    this.session && this._.unpublishFromSession(this.session, "reset");
                    for (var a in t)clearInterval(t[a]), delete t[a];
                    b = h = null;
                    n = !1;
                    f = null;
                    x.set("NotPublishing")
                }.bind(this);
            this.publish = function (a, b) {
                OT.debug("OT.Publisher: publish");
                (x.attemptingToPublish || x.publishing) && S();
                x.set("GetUserMedia");
                m = OT.$.defaults(b || {}, {publishAudio: !0, publishVideo: !0, mirror: !0});
                m.constraints ? OT.warn("You have passed your own constraints not using ours") : (m.constraints = OT.$.clone(d), m.resolution &&
                (void 0 !== m.resolution && !u.hasOwnProperty(m.resolution) ? OT.warn("Invalid resolution passed to the Publisher. Got: " + m.resolution + ' expecting one of "' + Object.keys(u).join('","') + '"') : (m.videoDimensions = u[m.resolution], m.constraints.video = {
                    mandatory: {},
                    optional: [{minWidth: m.videoDimensions.width}, {maxWidth: m.videoDimensions.width}, {minHeight: m.videoDimensions.height}, {maxHeight: m.videoDimensions.height}]
                })), void 0 !== m.frameRate && -1 === v.indexOf(m.frameRate) ? (OT.warn("Invalid frameRate passed to the publisher got: " +
                m.frameRate + " expecting one of " + v.join(",")), delete m.frameRate) : m.frameRate && (m.constraints.video.optional || ("object" !== typeof m.constraints.video && (m.constraints.video = {}), m.constraints.video.optional = []), m.constraints.video.optional.push({minFrameRate: m.frameRate}), m.constraints.video.optional.push({maxFrameRate: m.frameRate})));
                m.style && this.setStyle(m.style, null, !0);
                m.name && (m.name = m.name.toString());
                m.classNames = "OT_root OT_publisher";
                OT.onLoad(function () {
                    g = new OT.WidgetView(a, m);
                    h = g.domId;
                    OT.$.shouldAskForDevices(function (a) {
                        a.video || (OT.warn("Setting video constraint to false, there are no video sources"), m.constraints.video = !1);
                        a.audio || (OT.warn("Setting audio constraint to false, there are no audio sources"), m.constraints.audio = !1);
                        OT.$.getUserMedia(m.constraints, C.bind(this), I.bind(this), N.bind(this), M.bind(this), L.bind(this))
                    }.bind(this))
                }, this);
                return this
            };
            this.publishAudio = function (a) {
                m.publishAudio = a;
                s && (s.muted = !a);
                r && (r.muteButton.muted = !a);
                f && b && b.setChannelActiveState("audio",
                    a);
                return this
            };
            this.publishVideo = function (a) {
                var c = m.publishVideo;
                m.publishVideo = a;
                f && (b && m.publishVideo !== c) && b.setChannelActiveState("video", a);
                if (l)for (var c = l.getVideoTracks(), d = 0, e = c.length; d < e; ++d)c[d].enabled = a;
                g && (g.showPoster = !a);
                return this
            };
            this.recordQOS = function () {
                for (var a in k)E(a)
            };
            this.destroy = function (a, b) {
                S();
                !0 !== b && this.dispatchEvent(new OT.DestroyedEvent(OT.Event.names.PUBLISHER_DESTROYED, this, a), this.off.bind(this));
                return this
            };
            this.disconnect = function () {
                for (var a in k)this.cleanupSubscriber(a)
            };
            this.cleanupSubscriber = function (a) {
                var b = k[a];
                clearInterval(t[a]);
                delete t[a];
                b && (b.destroy(), delete k[a], w("disconnect", "PeerConnection", "subscriberConnection", a))
            };
            this.processMessage = function (a, b, c) {
                OT.debug("OT.Publisher.processMessage: Received " + a + " from " + b.id);
                OT.debug(c);
                switch (a) {
                    case "unsubscribe":
                        this.cleanupSubscriber(c.content.connection.id);
                        break;
                    default:
                        O.call(this, b).processMessage(a, c)
                }
            };
            this.getImgData = function () {
                return !n ? (OT.error("OT.Publisher.getImgData: Cannot getImgData before the Publisher is publishing."),
                    null) : c.imgData
            };
            this._ = {
                publishToSession: function (a) {
                    this.session = a;
                    var b = function () {
                        var b, d;
                        if (this.session) {
                            x.set("PublishingToSession");
                            var f = function (a, b, c) {
                                a ? (w("publish", "Failure", "reason", "Publish:" + OT.ExceptionCodes.UNABLE_TO_PUBLISH + ":" + a.message), x.attemptingToPublish && this.trigger("publishComplete", new OT.Error(OT.ExceptionCodes.UNABLE_TO_PUBLISH, a.message))) : (e = b, D = OT.Raptor.parseIceServers(c))
                            }.bind(this);
                            m.videoDimensions ? (b = Math.min(m.videoDimensions.width, c.videoWidth || 640), d = Math.min(m.videoDimensions.height,
                                c.videoHeight || 480)) : (b = c.videoWidth || 640, d = c.videoHeight || 480);
                            a._.streamCreate(m && m.name ? m.name : "", OT.VideoOrientation.ROTATED_NORMAL, b, d, m.publishAudio, m.publishVideo, m.frameRate, f)
                        }
                    };
                    if (n)b.call(this); else this.on("initSuccess", b, this);
                    w("publish", "Attempt", "streamType", "WebRTC");
                    return this
                }.bind(this), unpublishFromSession: function (a, b) {
                    if (!this.session || a.id !== this.session.id)return OT.warn("The publisher " + this.guid + " is trying to unpublish from a session " + a.id + " it is not attached to (" +
                    (this.session && this.session.id || "no this.session") + ")"), this;
                    a.connected && this.stream && a._.streamDestroy(this.stream.id);
                    this.disconnect();
                    this.session = null;
                    x.set("MediaBound");
                    w("unpublish", "Success", "sessionId", a.id);
                    this._.streamDestroyed(b);
                    return this
                }.bind(this), streamDestroyed: function (a) {
                    if (0 > ["reset"].indexOf(a)) {
                        var c = new OT.StreamEvent("streamDestroyed", b, a, !0);
                        a = function () {
                            c.isDefaultPrevented() || this.destroy()
                        }.bind(this);
                        this.dispatchEvent(c, a)
                    }
                }.bind(this), archivingStatus: function (a) {
                    r &&
                    r.archive.setArchiving(a);
                    return a
                }.bind(this)
            };
            this.detectDevices = function () {
                OT.warn("Fixme: Haven't implemented detectDevices")
            };
            this.detectMicActivity = function () {
                OT.warn("Fixme: Haven't implemented detectMicActivity")
            };
            this.getEchoCancellationMode = function () {
                OT.warn("Fixme: Haven't implemented getEchoCancellationMode");
                return "fullDuplex"
            };
            this.setMicrophoneGain = function () {
                OT.warn("Fixme: Haven't implemented setMicrophoneGain")
            };
            this.getMicrophoneGain = function () {
                OT.warn("Fixme: Haven't implemented getMicrophoneGain");
                return 0.5
            };
            this.setCamera = function () {
                OT.warn("Fixme: Haven't implemented setCamera")
            };
            this.setMicrophone = function () {
                OT.warn("Fixme: Haven't implemented setMicrophone")
            };
            Object.defineProperties(this, {
                id: {
                    get: function () {
                        return h
                    }, enumerable: !0
                }, element: {
                    get: function () {
                        return g.domElement
                    }, enumerable: !0
                }, guid: {
                    get: function () {
                        return a
                    }, enumerable: !0
                }, stream: {
                    get: function () {
                        return b
                    }, set: function (a) {
                        y(a)
                    }, enumerable: !0
                }, streamId: {
                    get: function () {
                        return e
                    }, enumerable: !0
                }, targetElement: {
                    get: function () {
                        return c.domElement
                    }
                },
                domId: {
                    get: function () {
                        return h
                    }
                }, session: {
                    get: function () {
                        return f
                    }, set: function (a) {
                        f = a
                    }, enumerable: !0
                }, isWebRTC: {
                    get: function () {
                        return !0
                    }
                }, loading: {
                    get: function () {
                        return g && g.loading
                    }
                }, videoWidth: {
                    get: function () {
                        return c.videoWidth
                    }, enumerable: !0
                }, videoHeight: {
                    get: function () {
                        return c.videoHeight
                    }, enumerable: !0
                }
            });
            Object.defineProperty(this._, "webRtcStream", {
                get: function () {
                    return l
                }
            });
            this.on("styleValueChanged", function (a, b) {
                if (r)switch (a) {
                    case "nameDisplayMode":
                        r.name.setDisplayMode(b);
                        r.backingBar.nameMode =
                            b;
                        break;
                    case "showArchiveStatus":
                        w("showArchiveStatus", "styleChange", "mode", b ? "on" : "off"), r.archive.setShowArchiveStatus(b)
                }
            }, this);
            x = new OT.PublishingState(function (a) {
                OT.error("Publisher State Change Failed: ", a.message);
                OT.debug(a)
            })
        } else OT.upgradeSystemRequirements()
    };
    OT.Publisher.nextId = OT.$.uuid
}(window);
!function (d) {
    OT.Subscriber = function (a, h) {
        var g = OT.$.uuid(), c = a || g, b, e, l, f, k, n, m = h.session, q, s, r, p = OT.$.clone(h), u = new OT.Analytics, v = 50, t, B, x, D;
        x = {timeStamp: OT.$.now()};
        if (m) {
            OT.$.eventing(this);
            OT.StylableComponent(this, {
                nameDisplayMode: "auto",
                buttonDisplayMode: "auto",
                backgroundImageURI: null,
                showArchiveStatus: !0,
                showMicButton: !0
            });
            var w = function (a, b, c, d) {
                u.logEvent({
                    action: a,
                    variation: b,
                    payload_type: c,
                    payload: d,
                    stream_id: f ? f.id : null,
                    session_id: m ? m.sessionId : null,
                    connection_id: m && m.connected ? m.connection.connectionId :
                        null,
                    partner_id: m && m.connected ? m.sessionInfo.partnerId : null,
                    widget_id: g,
                    widget_type: "Subscriber"
                })
            }, E = function () {
                if (t.subscribing && m && m.connected) {
                    var a = {
                        widget_type: "Subscriber",
                        stream_type: "WebRTC",
                        session_id: m ? m.sessionId : null,
                        connectionId: m ? m.connection.connectionId : null,
                        media_server_name: m ? m.sessionInfo.messagingServer : null,
                        p2pFlag: m ? m.sessionInfo.p2pEnabled : !1,
                        partner_id: m ? m.apiKey : null,
                        stream_id: f.id,
                        widget_id: g,
                        version: OT.properties.version,
                        duration: parseInt(OT.$.now() - q, 10),
                        remote_connection_id: f.connection.connectionId
                    };
                    n.getStats(x, function (b) {
                        var c;
                        if (b)for (c in b)a[c] = b[c];
                        u.logQOS(a)
                    })
                }
            }, G = function () {
                !t.subscribing && e && (OT.debug("OT.Subscriber.onLoaded"), t.set("Subscribing"), q = OT.$.now(), w("createPeerConnection", "Success", "pcc|hasRelayCandidates", [parseInt(q - s, 10), n && n.hasRelayCandidates].join("|")), r = setInterval(E, 3E4), B && (B = null, this.subscribeToVideo(!1)), b.loading = !1, N.call(this), this.trigger("subscribeComplete", null, this), this.trigger("loaded", this), w("subscribe", "Success", "streamId", f.id))
            }, K = function () {
                OT.debug("OT.Subscriber has been disconnected from the Publisher's PeerConnection");
                t.attemptingToSubscribe ? (t.set("Failed"), this.trigger("subscribeComplete", new OT.Error(null, "ClientDisconnected"))) : t.subscribing && t.set("Failed");
                this.disconnect()
            }, C = function (a, c, d, e) {
                t.attemptingToSubscribe ? (w("createPeerConnection", "Failure", "reason|hasRelayCandidates", ["Subscriber PeerConnection Error: " + c, n && n.hasRelayCandidates].join("|")), t.set("Failed"), this.trigger("subscribeComplete", new OT.Error(null, c))) : t.subscribing && (t.set("Failed"), this.trigger("error", c));
                this.disconnect();
                w("subscribe",
                    "Failure", "reason", (e ? e : "") + ":Subscriber PeerConnection Error: " + c);
                OT.handleJsException("Subscriber PeerConnection Error: " + c, OT.ExceptionCodes.P2P_CONNECTION_FAILED, {
                    session: m,
                    target: this
                });
                b && b.addError("The stream was unable to connect due to a network error.", "Make sure your connection isn't blocked by a firewall.")
            }, I = function (a) {
                OT.debug("OT.Subscriber.onRemoteStreamAdded");
                t.set("BindingRemoteStream");
                this.subscribeToAudio(p.subscribeToAudio);
                var c = B;
                this.subscribeToVideo(p.subscribeToVideo);
                B = c;
                c = new OT.VideoElement;
                c.setAudioVolume(v);
                c.on({streamBound: G, loadError: C, error: C}, this);
                c.bindToStream(a);
                e = b.video = c;
                e.orientation = {
                    width: f.videoDimensions.width,
                    height: f.videoDimensions.height,
                    videoOrientation: f.videoDimensions.orientation
                };
                w("createPeerConnection", "StreamAdded", "", "");
                this.trigger("streamAdded", this)
            }, L = function (a) {
                OT.debug("OT.Subscriber.onStreamRemoved");
                e.stream === a && (e.destroy(), e = null);
                this.trigger("streamRemoved", this)
            }, z = function () {
                this.disconnect()
            }, F = function (a) {
                switch (a.changedProperty) {
                    case "videoDimensions":
                        e.orientation =
                        {width: a.newValue.width, height: a.newValue.height, videoOrientation: a.newValue.orientation};
                        break;
                    case "hasVideo":
                        b && (b.showPoster = !(f.hasVideo && p.subscribeToVideo))
                }
            }, H = function (a) {
                if (!1 === a)return "off";
                a = this.getStyle("buttonDisplayMode");
                return !1 === a ? "on" : a
            }, N = function () {
                "off" === this.getStyle("bugDisplayMode") && w("bugDisplayMode", "createChrome", "mode", "off");
                l = (new OT.Chrome({parent: b.domElement})).set({
                    backingBar: new OT.Chrome.BackingBar({
                        nameMode: this.getStyle("nameDisplayMode"), muteMode: H.call(this,
                            this.getStyle("showMuteButton"))
                    }),
                    name: new OT.Chrome.NamePanel({
                        name: p.name,
                        mode: this.getStyle("nameDisplayMode"),
                        bugMode: this.getStyle("bugDisplayMode")
                    }),
                    muteButton: new OT.Chrome.MuteButton({
                        muted: p.muted,
                        mode: H.call(this, this.getStyle("showMuteButton"))
                    }),
                    opentokButton: new OT.Chrome.OpenTokButton({mode: this.getStyle("bugDisplayMode")}),
                    archive: new OT.Chrome.Archiving({show: this.getStyle("showArchiveStatus"), archiving: !1})
                }).on({
                    muted: function () {
                        M.call(this, !0)
                    }, unmuted: function () {
                        M.call(this,
                            !1)
                    }
                }, this)
            };
            this.recordQOS = function () {
                E()
            };
            this.subscribe = function (d) {
                OT.debug("OT.Subscriber: subscribe to " + d.id);
                if (t.subscribing)return OT.error("OT.Subscriber.Subscribe: Cannot subscribe, already subscribing."), !1;
                t.set("Init");
                if (!d)return OT.error("OT.Subscriber: No stream parameter."), !1;
                if (f)return OT.error("OT.Subscriber: Already subscribed"), !1;
                f = d;
                f.on({updated: F, destroyed: z}, this);
                k = d.connection.id;
                p.name = p.name || f.name;
                p.classNames = "OT_root OT_subscriber";
                p.style && this.setStyle(p.style,
                    null, !0);
                p.audioVolume && this.setAudioVolume(p.audioVolume);
                p.subscribeToAudio = OT.$.castToBoolean(p.subscribeToAudio, !0);
                p.subscribeToVideo = OT.$.castToBoolean(p.subscribeToVideo, !0);
                b = new OT.WidgetView(a, p);
                c = b.domId;
                !p.subscribeToVideo && "Chrome" === OT.$.browser() && (B = !0, p.subscribeToVideo = !0);
                s = OT.$.now();
                if (f.connection.id !== m.connection.id)w("createPeerConnection", "Attempt", "", ""), t.set("ConnectingToPeer"), n = new OT.SubscriberPeerConnection(f.connection, m, f, this, p), n.on({
                    disconnected: K, error: C, remoteStreamAdded: I,
                    remoteStreamRemoved: L
                }, this), n.init(); else {
                    w("createPeerConnection", "Attempt", "", "");
                    d = m.getPublisherForStream(f);
                    if (!d || !d._.webRtcStream)return this.trigger("subscribeComplete", new OT.Error(null, "InvalidStreamID")), this;
                    I.call(this, m.getPublisherForStream(f)._.webRtcStream)
                }
                w("subscribe", "Attempt", "streamId", f.id);
                return this
            };
            this.destroy = function (a, d) {
                "streamDestroyed" === a && t.attemptingToSubscribe && this.trigger("subscribeComplete", new OT.Error(null, "InvalidStreamID"));
                clearInterval(r);
                r = null;
                this.disconnect();
                l && (l.destroy(), l = null);
                b && (b.destroy(), b = null);
                f && !f.destroyed && w("unsubscribe", null, "streamId", f.id);
                p = m = f = c = null;
                !0 !== d && this.dispatchEvent(new OT.DestroyedEvent(OT.Event.names.SUBSCRIBER_DESTROYED, this, a), this.off.bind(this));
                return this
            };
            this.disconnect = function () {
                t.set("NotSubscribing");
                e && (e.destroy(), e = null);
                n && (n.destroy(), n = null, w("disconnect", "PeerConnection", "streamId", f.id))
            };
            this.processMessage = function (a, b, c) {
                OT.debug("OT.Subscriber.processMessage: Received " + a + " message from " +
                b.id);
                OT.debug(c);
                k !== b.id && (k = b.id);
                n && n.processMessage(a, c)
            };
            this.disableVideo = function (a) {
                if (a)if ("auto" === D)OT.info("Video has been re-enabled"); else {
                    OT.info("Video was not re-enabled because it was manually disabled");
                    return
                } else OT.warn("Due to high packet loss and low bandwidth, video has been disabled");
                this.subscribeToVideo(a, "auto");
                this.dispatchEvent(new OT.Event(a ? "videoEnabled" : "videoDisabled"));
                w("updateQuality", "video", a ? "videoEnabled" : "videoDisabled", !0)
            };
            this.getImgData = function () {
                return !this.subscribing ?
                    (OT.error("OT.Subscriber.getImgData: Cannot getImgData before the Subscriber is subscribing."), null) : e.imgData
            };
            this.setAudioVolume = function (a) {
                a = parseInt(a, 10);
                if (isNaN(a))return OT.error("OT.Subscriber.setAudioVolume: value should be an integer between 0 and 100"), this;
                v = Math.max(0, Math.min(100, a));
                v !== a && OT.warn("OT.Subscriber.setAudioVolume: value should be an integer between 0 and 100");
                p.muted && 0 < v && (p.premuteVolume = a, M.call(this, !1));
                e && e.setAudioVolume(v);
                return this
            };
            this.getAudioVolume =
                function () {
                    return p.muted ? 0 : e ? e.getAudioVolume() : v
                };
            this.subscribeToAudio = function (a) {
                a = OT.$.castToBoolean(a, !0);
                n && (n.subscribeToAudio(a && !p.subscribeMute), m && (f && a !== p.subscribeToAudio) && f.setChannelActiveState("audio", a && !p.subscribeMute));
                p.subscribeToAudio = a;
                return this
            };
            var M = function (a) {
                l.muteButton.muted = a;
                if (a !== p.mute) {
                    if (0 <= d.navigator.userAgent.toLowerCase().indexOf("chrome"))p.subscribeMute = p.muted = a, this.subscribeToAudio(p.subscribeToAudio); else if (a)p.premuteVolume = this.getAudioVolume(),
                        p.muted = !0, this.setAudioVolume(0); else if (p.premuteVolume || p.audioVolume)p.muted = !1, this.setAudioVolume(p.premuteVolume || p.audioVolume);
                    p.mute = p.mute
                }
            };
            this.subscribeToVideo = function (a, c) {
                if (B && !0 === a)B = !1; else {
                    var d = OT.$.castToBoolean(a, !0);
                    b && (b.showPoster = !(d && f.hasVideo), d && b.video && (b.loading = d, b.video.whenTimeIncrements(function () {
                        b.loading = !1
                    }, this)));
                    n && (n.subscribeToVideo(d), m && (f && (d !== p.subscribeToVideo || c !== D)) && f.setChannelActiveState("video", d, c));
                    p.subscribeToVideo = d;
                    D = c;
                    return this
                }
            };
            Object.defineProperties(this, {
                id: {
                    get: function () {
                        return c
                    }, enumerable: !0
                }, element: {
                    get: function () {
                        return b.domElement
                    }, enumerable: !0
                }, widgetId: {
                    get: function () {
                        return g
                    }
                }, stream: {
                    get: function () {
                        return f
                    }, enumerable: !0
                }, streamId: {
                    get: function () {
                        return !f ? null : f.id
                    }, enumerable: !0
                }, targetElement: {
                    get: function () {
                        return e ? e.domElement : null
                    }
                }, subscribing: {
                    get: function () {
                        return t.subscribing
                    }, enumerable: !0
                }, isWebRTC: {
                    get: function () {
                        return !0
                    }
                }, loading: {
                    get: function () {
                        return b && b.loading
                    }
                }, session: {
                    get: function () {
                        return m
                    }
                },
                videoWidth: {
                    get: function () {
                        return e.videoWidth
                    }, enumerable: !0
                }, videoHeight: {
                    get: function () {
                        return e.videoHeight
                    }, enumerable: !0
                }
            });
            this.restrictFrameRate = function (a) {
                OT.debug("OT.Subscriber.restrictFrameRate(" + a + ")");
                w("restrictFrameRate", a.toString(), "streamId", f.id);
                m.sessionInfo.p2pEnabled && OT.warn("OT.Subscriber.restrictFrameRate: Cannot restrictFrameRate on a P2P session");
                "boolean" !== typeof a ? OT.error("OT.Subscriber.restrictFrameRate: expected a boolean value got a " + typeof a) : f.setRestrictFrameRate(a);
                return this
            };
            this.on("styleValueChanged", function (a, b) {
                if (l)switch (a) {
                    case "nameDisplayMode":
                        l.name.setDisplayMode(b);
                        break;
                    case "showArchiveStatus":
                        l.archive.setShowArchiveStatus(b)
                }
            }, this);
            this._ = {
                archivingStatus: function (a) {
                    l && l.archive.setArchiving(a)
                }
            };
            t = new OT.SubscribingState(function (a) {
                OT.error("Subscriber State Change Failed: ", a.message);
                OT.debug(a)
            })
        } else OT.handleJsException("Subscriber must be passed a session option", 2E3, {session: m, target: this})
    }
}(window);
!function () {
    var d, a, h;
    OT.SessionInfo = function (a) {
        var b = a[0];
        OT.log("SessionInfo Response:");
        OT.log(a);
        this.sessionId = b.session_id;
        this.partnerId = b.partner_id;
        this.sessionStatus = b.session_status;
        this.messagingServer = b.messaging_server_url;
        this.messagingURL = b.messaging_url;
        this.symphonyAddress = b.symphony_address;
        this.p2pEnabled = b.properties && b.properties.p2p && b.properties.p2p.preference && "enabled" === b.properties.p2p.preference.value
    };
    OT.SessionInfo.get = function (c, b, e) {
        var g = OT.properties.apiURLSSL +
            "/session/" + c.id + "?extended\x3dtrue", f = OT.$.now();
        c.logEvent("getSessionInfo", "Attempt", "api_url", OT.properties.apiURLSSL);
        OT.$.getJSON(g, {headers: {"X-TB-TOKEN-AUTH": c.token, "X-TB-VERSION": 1}}, function (g, l) {
            if (g)console.log("getJSON said error:", g), h(c, e, new OT.Error(g.target && g.target.status || g.code, g.message || "Could not connect to the OpenTok API Server."), l); else {
                c.logEvent("Instrumentation", null, "gsi", OT.$.now() - f);
                var m = d(l);
                !1 === m ? a(c, b, l) : h(c, e, m, JSON.stringify(l))
            }
        })
    };
    var g = {};
    g["404"] = OT.ExceptionCodes.INVALID_SESSION_ID;
    g["409"] = OT.ExceptionCodes.INVALID_SESSION_ID;
    g["400"] = OT.ExceptionCodes.INVALID_SESSION_ID;
    g["403"] = OT.ExceptionCodes.AUTHENTICATION_ERROR;
    d = function (a) {
        if (Array.isArray(a)) {
            a = a.filter(function (a) {
                return null != a.error
            });
            if (0 === a.length)return !1;
            var b = a[0].error.code;
            g[b.toString()] && (b = g[b]);
            return {code: b, message: a[0].error.errorMessage && a[0].error.errorMessage.message}
        }
        return {code: null, message: "Unknown error: getSessionInfo JSON response was badly formed"}
    };
    a = function (a, b, d) {
        a.logEvent("getSessionInfo",
            "Success", "api_url", OT.properties.apiURLSSL);
        b(new OT.SessionInfo(d))
    };
    h = function (a, b, d, g) {
        a.logEvent("Connect", "Failure", "errorMessage", "GetSessionInfo:" + d.code + ":" + d.message + ":" + g);
        b(d, a)
    }
}(window);
!function () {
    OT.Capabilities = function (d) {
        this.publish = -1 !== d.indexOf("publish") ? 1 : 0;
        this.subscribe = -1 !== d.indexOf("subscribe") ? 1 : 0;
        this.forceUnpublish = -1 !== d.indexOf("forceunpublish") ? 1 : 0;
        this.forceDisconnect = -1 !== d.indexOf("forcedisconnect") ? 1 : 0;
        this.supportsWebRTC = OT.$.supportsWebRTC() ? 1 : 0;
        this.permittedTo = function (a) {
            return this.hasOwnProperty(a) && 1 === this[a]
        }
    }
}(window);
!function (d) {
    OT.Session = function (a, h) {
        if (OT.checkSystemRequirements()) {
            null == h && (h = a, a = null);
            var g = !0, c = a, b, e = h, l, f = OT.$.uuid(), k, n = new OT.Analytics, m, q, s, r, p, u, v, t, B, x, D, w, E, G, K, C, I, L, z;
            OT.$.eventing(this);
            var F = OT.$.statable(this, ["disconnected", "connecting", "connected", "disconnecting"], "disconnected");
            this.connections = new OT.Collection;
            this.streams = new OT.Collection;
            this.archives = new OT.Collection;
            m = function (a, b) {
                F("disconnected");
                OT.error(a);
                this.trigger("sessionConnectFailed", new OT.Error(b ||
                OT.ExceptionCodes.CONNECT_FAILED, a));
                OT.handleJsException(a, b || OT.ExceptionCodes.CONNECT_FAILED, {session: this})
            };
            q = function (a) {
                var b = a.reason;
                "networkTimedout" === b ? (b = "networkDisconnected", this.logEvent("Connect", "TimeOutDisconnect", "reason", a.reason)) : this.logEvent("Connect", "Disconnected", "reason", a.reason);
                var c = new OT.SessionDisconnectEvent("sessionDisconnected", b);
                D.call(this);
                w.call(this, b);
                a = function () {
                    E.call(this, c.reason);
                    c.isDefaultPrevented() || G.call(this, c.reason)
                }.bind(this);
                this.dispatchEvent(c,
                    a)
            };
            s = function (a) {
                a.id.match(/^symphony\./) || this.dispatchEvent(new OT.ConnectionEvent(OT.Event.names.CONNECTION_CREATED, a))
            };
            r = function (a, b) {
                a.id.match(/^symphony\./) || a.id !== l.id && this.dispatchEvent(new OT.ConnectionEvent(OT.Event.names.CONNECTION_DESTROYED, a, b))
            };
            p = function (a) {
                a.connection.id !== this.connection.id && this.dispatchEvent(new OT.StreamEvent(OT.Event.names.STREAM_CREATED, a, null, !1))
            };
            u = function (a) {
                var b = a.target, c = a.changedProperty, d = a.newValue;
                "orientation" === c && (c = "videoDimensions",
                    d = {width: d.width, height: d.height});
                this.dispatchEvent(new OT.StreamPropertyChangedEvent(OT.Event.names.STREAM_PROPERTY_CHANGED, b, c, a.oldValue, d))
            };
            v = function (a, b) {
                if (a.connection.id === this.connection.id)OT.publishers.where({streamId: a.id}).forEach(function (a) {
                    a._.unpublishFromSession(this, b)
                }.bind(this)); else {
                    var c = new OT.StreamEvent("streamDestroyed", a, b, !0), d = function () {
                        c.isDefaultPrevented() || OT.subscribers.where({streamId: a.id}).forEach(function (a) {
                                a.session.id === this.id && a.stream && a.destroy("streamDestroyed")
                            },
                            this)
                    }.bind(this);
                    this.dispatchEvent(c, d)
                }
            };
            t = function (a) {
                this.dispatchEvent(new OT.ArchiveEvent("archiveStarted", a))
            };
            B = function (a) {
                this.dispatchEvent(new OT.ArchiveEvent("archiveDestroyed", a))
            };
            x = function (a) {
                var b = a.target, c = a.newValue;
                "status" === a.changedProperty && "stopped" === c ? this.dispatchEvent(new OT.ArchiveEvent("archiveStopped", b)) : this.dispatchEvent(new OT.ArchiveEvent("archiveUpdated", b))
            };
            D = function () {
                b = null;
                F("disconnected");
                this.connections.destroy();
                this.streams.destroy();
                this.archives.destroy()
            };
            w = function (a) {
                OT.publishers.where({session: this}).forEach(function (b) {
                    b.disconnect(a)
                });
                OT.subscribers.where({session: this}).forEach(function (a) {
                    a.disconnect()
                })
            };
            E = function (a) {
                OT.publishers.where({session: this}).forEach(function (b) {
                    b._.streamDestroyed(a)
                })
            };
            G = function (a) {
                OT.subscribers.where({session: this}).forEach(function (b) {
                    b.destroy(a)
                })
            };
            K = function () {
                OT.debug("OT.Session: connecting to Raptor");
                var a = OT.properties.messagingProtocol + "://" + this.sessionInfo.messagingServer + ":" + OT.properties.messagingPort +
                    "/rumorwebsocketsv2";
                l = new OT.Raptor.Socket(f, a, OT.properties.symphonyAddresss || "symphony." + this.sessionInfo.messagingServer, OT.SessionDispatcher(this));
                var c = [a, navigator.userAgent, OT.properties.version, d.externalHost ? "yes" : "no"];
                l.connect(b, this.sessionInfo, function (a, b) {
                    a ? (c.splice(0, 0, a.message), this.logEvent("Connect", "Failure", "reason|webSocketServerUrl|userAgent|sdkVersion|chromeFrame", c.map(function (a) {
                        return a.replace("|", "\\|")
                    }).join("|")), m.call(this, a.message, a.code)) : (OT.debug("OT.Session: Received session state from Raptor",
                        b), F("connected"), this.logEvent("Connect", "Success", "webSocketServerUrl|userAgent|sdkVersion|chromeFrame", c.map(function (a) {
                        return a.replace("|", "\\|")
                    }).join("|"), {connectionId: this.connection.id}), this.connection.on("destroyed", q, this), this.connections.on({
                        add: s,
                        remove: r
                    }, this), this.streams.on({add: p, remove: v, update: u}, this), this.archives.on({
                        add: t,
                        remove: B,
                        update: x
                    }, this), this.dispatchEvent(new OT.SessionConnectEvent(OT.Event.names.SESSION_CONNECTED), function () {
                        this.connections._triggerAddEvents();
                        this.streams._triggerAddEvents();
                        this.archives._triggerAddEvents()
                    }.bind(this)))
                }.bind(this))
            };
            C = function () {
                this.is("connecting") && OT.SessionInfo.get(this, I.bind(this), function (a) {
                    m.call(this, a.message + (a.code ? " (" + a.code + ")" : ""), a.code)
                }.bind(this))
            };
            I = function (a) {
                this.is("connecting") && (this.sessionInfo = a, this.sessionInfo.partnerId && this.sessionInfo.partnerId !== c ? (c = this.sessionInfo.partnerId, this.logEvent("Connect", "Failure", "reason", "GetSessionInfo:" + OT.ExceptionCodes.AUTHENTICATION_ERROR + ":Authentication Error: The API key does not match the token or session."),
                    m.call(this, "Authentication Error: The API key does not match the token or session.", OT.ExceptionCodes.AUTHENTICATION_ERROR)) : K.call(this))
            };
            L = function (a) {
                return this.capabilities.permittedTo(a)
            }.bind(this);
            z = function (a, b, c) {
                OT.dispatchError(a, b, c, this)
            }.bind(this);
            this.logEvent = function (a, b, d, g, h) {
                a = {
                    action: a,
                    variation: b,
                    payload_type: d,
                    payload: g,
                    session_id: e,
                    partner_id: c,
                    widget_id: f,
                    widget_type: "Controller"
                };
                this.connection && this.connection.id ? k = a.connection_id = this.connection.id : k && (a.connection_id =
                    k);
                h && (a = OT.$.extend(h, a));
                n.logEvent(a)
            };
            this.connect = function (h) {
                if (null == a && 1 < arguments.length && ("string" === typeof arguments[0] || "number" === typeof arguments[0]) && "string" === typeof arguments[1])c = h.toString(), h = arguments[1];
                var k = arguments[arguments.length - 1];
                if (this.is("connecting", "connected"))return OT.warn("OT.Session: Cannot connect, the session is already " + this.state), this;
                D.call(this);
                F("connecting");
                b = !OT.$.isFunction(h) && h;
                g ? g = !1 : f = OT.$.uuid();
                k && OT.$.isFunction(k) && (this.once("sessionConnected",
                    k.bind(null, null)), this.once("sessionConnectFailed", k));
                if (null == c || OT.$.isFunction(c))return setTimeout(m.bind(this, "API Key is undefined. You must pass an API Key to initSession.", OT.ExceptionCodes.AUTHENTICATION_ERROR)), this;
                if (!e)return setTimeout(m.bind(this, "SessionID is undefined. You must pass a sessionID to initSession.", OT.ExceptionCodes.INVALID_SESSION_ID)), this;
                c = c.toString();
                0 === OT.APIKEY.length && (OT.APIKEY = c);
                this.logEvent("Connect", "Attempt", "userAgent|sdkVersion|chromeFrame", [navigator.userAgent,
                    OT.properties.version, d.externalHost ? "yes" : "no"].map(function (a) {
                        return a.replace("|", "\\|")
                    }).join("|"));
                C.call(this);
                return this
            };
            this.disconnect = function () {
                l && l.isNot("disconnected") ? (F("disconnecting"), l.disconnect()) : D.call(this)
            };
            this.destroy = function () {
                this.streams.destroy();
                this.connections.destroy();
                this.archives.destroy();
                this.disconnect()
            };
            this.publish = function (a, b, d) {
                "function" === typeof a && (d = a, a = void 0);
                "function" === typeof b && (d = b, b = void 0);
                if (this.isNot("connected"))return n.logError(1010,
                    "OT.exception", "We need to be connected before you can publish", null, {
                        action: "publish",
                        variation: "Failure",
                        payload_type: "reason",
                        payload: "We need to be connected before you can publish",
                        session_id: e,
                        partner_id: c,
                        widgetId: f,
                        widget_type: "Controller"
                    }), d && OT.$.isFunction(d) && z(OT.ExceptionCodes.NOT_CONNECTED, "We need to be connected before you can publish", d), null;
                if (!L("publish"))return this.logEvent("publish", "Failure", "reason", "This token does not allow publishing. The role must be at least `publisher` to enable this functionality"),
                    z(OT.ExceptionCodes.UNABLE_TO_PUBLISH, "This token does not allow publishing. The role must be at least `publisher` to enable this functionality", d), null;
                if (!a || "string" === typeof a || a.nodeType === Node.ELEMENT_NODE)a = OT.initPublisher(a, b); else if (a instanceof OT.Publisher)"session"in a && (a.session && "sessionId"in a.session) && (a.session.sessionId === this.sessionId ? OT.warn("Cannot publish " + a.guid + " again to " + this.sessionId + ". Please call session.unpublish(publisher) first.") : OT.warn("Cannot publish " +
                a.guid + " publisher already attached to " + a.session.sessionId + ". Please call session.unpublish(publisher) first.")); else {
                    z(OT.ExceptionCodes.UNABLE_TO_PUBLISH, "Session.publish :: First parameter passed in is neither a string nor an instance of the Publisher", d);
                    return
                }
                a.once("publishComplete", function (a) {
                    a ? z(OT.ExceptionCodes.UNABLE_TO_PUBLISH, "Session.publish :: " + a.message, d) : d && OT.$.isFunction(d) && d.apply(null, arguments)
                });
                a._.publishToSession(this);
                return a
            };
            this.unpublish = function (a) {
                a ? a._.unpublishFromSession(this,
                    "unpublished") : OT.error("OT.Session.unpublish: publisher parameter missing.")
            };
            this.subscribe = function (a, b, c, d) {
                if (!this.connection || !this.connection.connectionId)z(OT.ExceptionCodes.UNABLE_TO_SUBSCRIBE, "Session.subscribe :: Connection required to subscribe", d); else if (a) {
                    if (a.hasOwnProperty("streamId"))return "function" === typeof b && (d = b, b = void 0), "function" === typeof c && (d = c, c = void 0), b = new OT.Subscriber(b, OT.$.extend(c || {}, {session: this})), b.once("subscribeComplete", function (a) {
                        a ? z(OT.ExceptionCodes.UNABLE_TO_SUBSCRIBE,
                            "Session.subscribe :: " + a.message, d) : d && OT.$.isFunction(d) && d.apply(null, arguments)
                    }), OT.subscribers.add(b), b.subscribe(a), b;
                    z(OT.ExceptionCodes.UNABLE_TO_SUBSCRIBE, "Session.subscribe :: invalid stream object", d)
                } else z(OT.ExceptionCodes.UNABLE_TO_SUBSCRIBE, "Session.subscribe :: stream cannot be null", d)
            };
            this.unsubscribe = function (a) {
                if (!a)throw OT.error("OT.Session.unsubscribe: subscriber cannot be null"), Error("OT.Session.unsubscribe: subscriber cannot be null");
                if (!a.stream)return OT.warn("OT.Session.unsubscribe:: tried to unsubscribe a subscriber that had no stream"),
                    !1;
                OT.debug("OT.Session.unsubscribe: subscriber " + a.id);
                a.destroy();
                return !0
            };
            this.getSubscribersForStream = function (a) {
                return OT.subscribers.where({streamId: a.id})
            };
            this.getPublisherForStream = function (a) {
                if ("string" !== typeof a)if ("object" === typeof a && a && a.hasOwnProperty("id"))a = a.id; else throw OT.error("Session.getPublisherForStream :: Invalid stream type"), Error("Session.getPublisherForStream :: Invalid stream type");
                return OT.publishers.where({streamId: a})[0]
            };
            this._ = {
                jsepCandidateP2p: function (a,
                                            b, c) {
                    return l.jsepCandidateP2p(a, b, c)
                }.bind(this), jsepCandidate: function (a, b) {
                    return l.jsepCandidate(a, b)
                }.bind(this), jsepOffer: function (a, b) {
                    return l.jsepOffer(a, b)
                }.bind(this), jsepOfferP2p: function (a, b, c) {
                    return l.jsepOfferP2p(a, b, c)
                }.bind(this), jsepAnswer: function (a, b) {
                    return l.jsepAnswer(a, b)
                }.bind(this), jsepAnswerP2p: function (a, b, c) {
                    return l.jsepAnswerP2p(a, b, c)
                }.bind(this), dispatchSignal: function (a, b, c) {
                    a = new OT.SignalEvent(b, c, a);
                    a.target = this;
                    this.trigger(OT.Event.names.SIGNAL, a);
                    b && this.dispatchEvent(a)
                }.bind(this),
                subscriberCreate: function (a, b, c, d) {
                    return l.subscriberCreate(a.id, b.widgetId, c, d)
                }.bind(this), subscriberDestroy: function (a, b) {
                    return l.subscriberDestroy(a.id, b.widgetId)
                }.bind(this), subscriberUpdate: function (a, b, c) {
                    return l.subscriberUpdate(a.id, b.widgetId, c)
                }.bind(this), subscriberChannelUpdate: function (a, b, c, d) {
                    return l.subscriberChannelUpdate(a.id, b.widgetId, c.id, d)
                }.bind(this), streamCreate: function (a, b, c, d, e, f, g, h) {
                    l.streamCreate(a, b, c, d, e, f, g, OT.Config.get("bitrates", "min", OT.APIKEY), OT.Config.get("bitrates",
                        "max", OT.APIKEY), h)
                }.bind(this), streamDestroy: function (a) {
                    l.streamDestroy(a)
                }.bind(this), streamChannelUpdate: function (a, b, c) {
                    l.streamChannelUpdate(a.id, b.id, c)
                }.bind(this)
            };
            this.signal = function (a, b) {
                var c = a, d = b;
                OT.$.isFunction(c) && (d = c, c = null);
                this.isNot("connected") ? z(500, "Unable to send signal - you are not connected to the session.", d) : (l.signal(c, d), a && (a.data && "string" !== typeof a.data) && OT.warn("Signaling of anything other than Strings is deprecated. Please update the data property to be a string."),
                    this.logEvent("signal", "send", "type", a && a.data ? typeof a.data : "null"))
            };
            this.forceDisconnect = function (a, b) {
                this.isNot("connected") ? z(OT.ExceptionCodes.NOT_CONNECTED, "Cannot call forceDisconnect(). You are not connected to the session.", b) : L("forceDisconnect") ? l.forceDisconnect("string" === typeof a ? a : a.id, function (a) {
                    a ? z(OT.ExceptionCodes.UNABLE_TO_FORCE_DISCONNECT, "This token does not allow forceDisconnect. The role must be at least `moderator` to enable this functionality", b) : b && OT.$.isFunction(b) &&
                    b.apply(null, arguments)
                }) : z(OT.ExceptionCodes.UNABLE_TO_FORCE_DISCONNECT, "This token does not allow forceDisconnect. The role must be at least `moderator` to enable this functionality", b)
            };
            this.forceUnpublish = function (a, b) {
                if (this.isNot("connected"))z(OT.ExceptionCodes.NOT_CONNECTED, "Cannot call forceUnpublish(). You are not connected to the session.", b); else if (L("forceUnpublish")) {
                    var c = "string" === typeof a ? this.streams.get(a) : a;
                    l.forceUnpublish(c.id, function (a) {
                        a ? z(OT.ExceptionCodes.UNABLE_TO_FORCE_UNPUBLISH,
                            "This token does not allow forceUnpublish. The role must be at least `moderator` to enable this functionality", b) : b && OT.$.isFunction(b) && b.apply(null, arguments)
                    })
                } else z(OT.ExceptionCodes.UNABLE_TO_FORCE_UNPUBLISH, "This token does not allow forceUnpublish. The role must be at least `moderator` to enable this functionality", b)
            };
            this.getStateManager = function () {
                OT.warn("Fixme: Have not implemented session.getStateManager")
            };
            OT.$.defineGetters(this, {
                apiKey: function () {
                    return c
                }, token: function () {
                    return b
                },
                connected: function () {
                    return this.is("connected")
                }, connection: function () {
                    return l && l.id ? this.connections.get(l.id) : null
                }, sessionId: function () {
                    return e
                }, id: function () {
                    return e
                }, capabilities: function () {
                    var a = this.connection;
                    return a ? a.permissions : new OT.Capabilities([])
                }.bind(this)
            }, !0)
        } else OT.upgradeSystemRequirements()
    }
}(window);
!function () {
    var d = document.createElement("link");
    d.type = "text/css";
    d.media = "screen";
    d.rel = "stylesheet";
    d.href = OT.properties.cssURL;
    (document.head || document.getElementsByTagName("head")[0]).appendChild(d)
}(window);
!function () {
    "function" === typeof define && define.amd && define("TB", [], function () {
        return TB
    })
}(window);
