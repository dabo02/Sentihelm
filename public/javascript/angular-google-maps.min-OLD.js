/*! angular-google-maps 1.1.11 2014-07-28
 *  AngularJS directives for Google Maps
 *  git: https://github.com/nlaplante/angular-google-maps.git
 */
function InfoBox(a) {
    a = a || {}, google.maps.OverlayView.apply(this, arguments), this.content_ = a.content || "", this.disableAutoPan_ = a.disableAutoPan || !1, this.maxWidth_ = a.maxWidth || 0, this.pixelOffset_ = a.pixelOffset || new google.maps.Size(0, 0), this.position_ = a.position || new google.maps.LatLng(0, 0), this.zIndex_ = a.zIndex || null, this.boxClass_ = a.boxClass || "infoBox", this.boxStyle_ = a.boxStyle || {}, this.closeBoxMargin_ = a.closeBoxMargin || "2px", this.closeBoxURL_ = a.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif", "" === a.closeBoxURL && (this.closeBoxURL_ = ""), this.infoBoxClearance_ = a.infoBoxClearance || new google.maps.Size(1, 1), "undefined" == typeof a.visible && (a.visible = "undefined" == typeof a.isHidden ? !0 : !a.isHidden), this.isHidden_ = !a.visible, this.alignBottom_ = a.alignBottom || !1, this.pane_ = a.pane || "floatPane", this.enableEventPropagation_ = a.enableEventPropagation || !1, this.div_ = null, this.closeListener_ = null, this.moveListener_ = null, this.contextListener_ = null, this.eventListeners_ = null, this.fixedWidthSet_ = null
}
function ClusterIcon(a, b) {
    a.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView), this.cluster_ = a, this.className_ = a.getMarkerClusterer().getClusterClass(), this.styles_ = b, this.center_ = null, this.div_ = null, this.sums_ = null, this.visible_ = !1, this.setMap(a.getMap())
}
function Cluster(a) {
    this.markerClusterer_ = a, this.map_ = a.getMap(), this.gridSize_ = a.getGridSize(), this.minClusterSize_ = a.getMinimumClusterSize(), this.averageCenter_ = a.getAverageCenter(), this.markers_ = [], this.center_ = null, this.bounds_ = null, this.clusterIcon_ = new ClusterIcon(this, a.getStyles())
}
function MarkerClusterer(a, b, c) {
    this.extend(MarkerClusterer, google.maps.OverlayView), b = b || [], c = c || {}, this.markers_ = [], this.clusters_ = [], this.listeners_ = [], this.activeMap_ = null, this.ready_ = !1, this.gridSize_ = c.gridSize || 60, this.minClusterSize_ = c.minimumClusterSize || 2, this.maxZoom_ = c.maxZoom || null, this.styles_ = c.styles || [], this.title_ = c.title || "", this.zoomOnClick_ = !0, void 0 !== c.zoomOnClick && (this.zoomOnClick_ = c.zoomOnClick), this.averageCenter_ = !1, void 0 !== c.averageCenter && (this.averageCenter_ = c.averageCenter), this.ignoreHidden_ = !1, void 0 !== c.ignoreHidden && (this.ignoreHidden_ = c.ignoreHidden), this.enableRetinaIcons_ = !1, void 0 !== c.enableRetinaIcons && (this.enableRetinaIcons_ = c.enableRetinaIcons), this.imagePath_ = c.imagePath || MarkerClusterer.IMAGE_PATH, this.imageExtension_ = c.imageExtension || MarkerClusterer.IMAGE_EXTENSION, this.imageSizes_ = c.imageSizes || MarkerClusterer.IMAGE_SIZES, this.calculator_ = c.calculator || MarkerClusterer.CALCULATOR, this.batchSize_ = c.batchSize || MarkerClusterer.BATCH_SIZE, this.batchSizeIE_ = c.batchSizeIE || MarkerClusterer.BATCH_SIZE_IE, this.clusterClass_ = c.clusterClass || "cluster", -1 !== navigator.userAgent.toLowerCase().indexOf("msie") && (this.batchSize_ = this.batchSizeIE_), this.setupStyles_(), this.addMarkers(b, !0), this.setMap(a)
}
function inherits(a, b) {
    function c() {
    }

    c.prototype = b.prototype, a.superClass_ = b.prototype, a.prototype = new c, a.prototype.constructor = a
}
function MarkerLabel_(a, b) {
    this.marker_ = a, this.handCursorURL_ = a.handCursorURL, this.labelDiv_ = document.createElement("div"), this.labelDiv_.style.cssText = "position: absolute; overflow: hidden;", this.eventDiv_ = document.createElement("div"), this.eventDiv_.style.cssText = this.labelDiv_.style.cssText, this.eventDiv_.setAttribute("onselectstart", "return false;"), this.eventDiv_.setAttribute("ondragstart", "return false;"), this.crossDiv_ = MarkerLabel_.getSharedCross(b)
}
function MarkerWithLabel(a) {
    a = a || {}, a.labelContent = a.labelContent || "", a.labelAnchor = a.labelAnchor || new google.maps.Point(0, 0), a.labelClass = a.labelClass || "markerLabels", a.labelStyle = a.labelStyle || {}, a.labelInBackground = a.labelInBackground || !1, "undefined" == typeof a.labelVisible && (a.labelVisible = !0), "undefined" == typeof a.raiseOnDrag && (a.raiseOnDrag = !0), "undefined" == typeof a.clickable && (a.clickable = !0), "undefined" == typeof a.draggable && (a.draggable = !1), "undefined" == typeof a.optimized && (a.optimized = !1), a.crossImage = a.crossImage || "http" + ("https:" === document.location.protocol ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png", a.handCursor = a.handCursor || "http" + ("https:" === document.location.protocol ? "s" : "") + "://maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur", a.optimized = !1, this.label = new MarkerLabel_(this, a.crossImage, a.handCursor), google.maps.Marker.apply(this, arguments)
}
(function () {
    angular.module("google-maps.extensions", []), angular.module("google-maps.directives.api.utils", ["google-maps.extensions"]), angular.module("google-maps.directives.api.managers", []), angular.module("google-maps.directives.api.models.child", ["google-maps.directives.api.utils"]), angular.module("google-maps.directives.api.models.parent", ["google-maps.directives.api.managers", "google-maps.directives.api.models.child"]), angular.module("google-maps.directives.api", ["google-maps.directives.api.models.parent"]), angular.module("google-maps", ["google-maps.directives.api"]).factory("debounce", ["$timeout", function (a) {
        return function (b) {
            var c;
            return c = 0, function () {
                var d, e, f;
                return f = this, d = arguments, c++, e = function (a) {
                    return function () {
                        return a === c ? b.apply(f, d) : void 0
                    }
                }(c), a(e, 0, !0)
            }
        }
    }])
}).call(this), function () {
    angular.module("google-maps.extensions").service("ExtendGWin", function () {
        return {
            init: _.once(function () {
                return (google || ("undefined" != typeof google && null !== google ? google.maps : void 0) || null != google.maps.InfoWindow) && (google.maps.InfoWindow.prototype._open = google.maps.InfoWindow.prototype.open, google.maps.InfoWindow.prototype._close = google.maps.InfoWindow.prototype.close, google.maps.InfoWindow.prototype._isOpen = !1, google.maps.InfoWindow.prototype.open = function (a, b) {
                    this._isOpen = !0, this._open(a, b)
                }, google.maps.InfoWindow.prototype.close = function () {
                    this._isOpen = !1, this._close()
                }, google.maps.InfoWindow.prototype.isOpen = function (a) {
                    return null == a && (a = void 0), null == a ? this._isOpen : this._isOpen = a
                }, window.InfoBox) ? (window.InfoBox.prototype._open = window.InfoBox.prototype.open, window.InfoBox.prototype._close = window.InfoBox.prototype.close, window.InfoBox.prototype._isOpen = !1, window.InfoBox.prototype.open = function (a, b) {
                    this._isOpen = !0, this._open(a, b)
                }, window.InfoBox.prototype.close = function () {
                    this._isOpen = !1, this._close()
                }, window.InfoBox.prototype.isOpen = function (a) {
                    return null == a && (a = void 0), null == a ? this._isOpen : this._isOpen = a
                }, MarkerLabel_.prototype.setContent = function () {
                    var a;
                    a = this.marker_.get("labelContent"), a && !_.isEqual(this.oldContent, a) && ("undefined" == typeof(null != a ? a.nodeType : void 0) ? (this.labelDiv_.innerHTML = a, this.eventDiv_.innerHTML = this.labelDiv_.innerHTML, this.oldContent = a) : (this.labelDiv_.innerHTML = "", this.labelDiv_.appendChild(a), a = a.cloneNode(!0), this.eventDiv_.appendChild(a), this.oldContent = a))
                }, MarkerLabel_.prototype.onRemove = function () {
                    null != this.labelDiv_.parentNode && this.labelDiv_.parentNode.removeChild(this.labelDiv_), null != this.eventDiv_.parentNode && this.eventDiv_.parentNode.removeChild(this.eventDiv_), this.listeners_ && this.listeners_.length && this.listeners_.forEach(function (a) {
                        return google.maps.event.removeListener(a)
                    })
                }) : void 0
            })
        }
    })
}.call(this), function () {
    _.intersectionObjects = function (a, b, c) {
        var d;
        return null == c && (c = void 0), d = _.map(a, function (a) {
            return _.find(b, function (b) {
                return null != c ? c(a, b) : _.isEqual(a, b)
            })
        }), _.filter(d, function (a) {
            return null != a
        })
    }, _.containsObject = _.includeObject = function (a, b, c) {
        return null == c && (c = void 0), null === a ? !1 : _.any(a, function (a) {
            return null != c ? c(a, b) : _.isEqual(a, b)
        })
    }, _.differenceObjects = function (a, b, c) {
        return null == c && (c = void 0), _.filter(a, function (a) {
            return !_.containsObject(b, a)
        })
    }, _.withoutObjects = function (a, b) {
        return _.differenceObjects(a, b)
    }, _.indexOfObject = function (a, b, c, d) {
        var e, f;
        if (null == a)return -1;
        if (e = 0, f = a.length, d) {
            if ("number" != typeof d)return e = _.sortedIndex(a, b), a[e] === b ? e : -1;
            e = 0 > d ? Math.max(0, f + d) : d
        }
        for (; f > e;) {
            if (null != c) {
                if (c(a[e], b))return e
            } else if (_.isEqual(a[e], b))return e;
            e++
        }
        return -1
    }, _["extends"] = function (a) {
        return _.reduce(a, function (a, b) {
            return _.extend(a, b)
        }, {})
    }
}.call(this), function () {
    var a;
    a = {
        each: function (a, b, c, d, e, f, g) {
            var h;
            if (null == e && (e = 20), null == f && (f = 0), null == g && (g = 1), !g)throw"pause (delay) must be set from _async!";
            return void 0 === a || (null != a ? a.length : void 0) <= 0 ? void c() : (h = function () {
                var i, j;
                for (i = e, j = f; i-- && j < (a ? a.length : j + 1);)b(a[j], j), ++j;
                if (a) {
                    if (j < a.length)return f = j, null != d && d(), setTimeout(h, g);
                    if (c)return c()
                }
            })()
        }, map: function (a, b, c, d, e) {
            var f;
            return f = [], null == a ? f : _async.each(a, function (a) {
                return f.push(b(a))
            }, function () {
                return c(f)
            }, d, e)
        }
    }, window._async = a, angular.module("google-maps.directives.api.utils").factory("async", function () {
        return window._async
    })
}.call(this), function () {
    var a = [].indexOf || function (a) {
            for (var b = 0, c = this.length; c > b; b++)if (b in this && this[b] === a)return b;
            return -1
        };
    angular.module("google-maps.directives.api.utils").factory("BaseObject", function () {
        var b, c;
        return c = ["extended", "included"], b = function () {
            function b() {
            }

            return b.extend = function (b) {
                var d, e, f;
                for (d in b)e = b[d], a.call(c, d) < 0 && (this[d] = e);
                return null != (f = b.extended) && f.apply(this), this
            }, b.include = function (b) {
                var d, e, f;
                for (d in b)e = b[d], a.call(c, d) < 0 && (this.prototype[d] = e);
                return null != (f = b.included) && f.apply(this), this
            }, b
        }()
    })
}.call(this), function () {
    angular.module("google-maps.directives.api.utils").factory("ChildEvents", function () {
        return {
            onChildCreation: function () {
            }
        }
    })
}.call(this), function () {
    angular.module("google-maps.directives.api.utils").service("CtrlHandle", ["$q", function (a) {
        var b;
        return b = {
            handle: function (b) {
                return b.deferred = a.defer(), {
                    getScope: function () {
                        return b
                    }
                }
            }
        }
    }])
}.call(this), function () {
    angular.module("google-maps.directives.api.utils").service("EventsHelper", ["Logger", function (a) {
        return {
            setEvents: function (b, c, d) {
                return angular.isDefined(c.events) && null != c.events && angular.isObject(c.events) ? _.compact(_.map(c.events, function (e, f) {
                    return c.events.hasOwnProperty(f) && angular.isFunction(c.events[f]) ? google.maps.event.addListener(b, f, function () {
                        return e.apply(c, [b, f, d, arguments])
                    }) : a.info("MarkerEventHelper: invalid event listener " + f)
                })) : void 0
            }
        }
    }])
}.call(this), function () {
    var a = {}.hasOwnProperty, b = function (b, c) {
        function d() {
            this.constructor = b
        }

        for (var e in c)a.call(c, e) && (b[e] = c[e]);
        return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
    };
    angular.module("google-maps.directives.api.utils").factory("FitHelper", ["BaseObject", "Logger", function (a) {
        var c, d;
        return c = function (a) {
            function c() {
                return d = c.__super__.constructor.apply(this, arguments)
            }

            return b(c, a), c.prototype.fit = function (a, b) {
                var c, d;
                return b && a && a.length > 0 ? (c = new google.maps.LatLngBounds, d = !1, _async.each(a, function (a) {
                    return a ? (d || (d = !0), c.extend(a.getPosition())) : void 0
                }, function () {
                    return d ? b.fitBounds(c) : void 0
                })) : void 0
            }, c
        }(a)
    }])
}.call(this), function () {
    angular.module("google-maps.directives.api.utils").service("GmapUtil", ["Logger", "$compile", function (a, b) {
        var c, d;
        return c = function (a) {
            return a ? Array.isArray(a) && 2 === a.length ? new google.maps.LatLng(a[1], a[0]) : angular.isDefined(a.type) && "Point" === a.type ? new google.maps.LatLng(a.coordinates[1], a.coordinates[0]) : new google.maps.LatLng(a.latitude, a.longitude) : void 0
        }, d = function (a) {
            if (angular.isUndefined(a))return !1;
            if (_.isArray(a)) {
                if (2 === a.length)return !0
            } else if (null != a && (null != a ? a.type : void 0) && "Point" === a.type && _.isArray(a.coordinates) && 2 === a.coordinates.length)return !0;
            return a && angular.isDefined((null != a ? a.latitude : void 0) && angular.isDefined(null != a ? a.longitude : void 0)) ? !0 : !1
        }, {
            getLabelPositionPoint: function (a) {
                var b, c;
                return void 0 === a ? void 0 : (a = /^([-\d\.]+)\s([-\d\.]+)$/.exec(a), b = parseFloat(a[1]), c = parseFloat(a[2]), null != b && null != c ? new google.maps.Point(b, c) : void 0)
            }, createMarkerOptions: function (a, b, e, f) {
                var g;
                return null == f && (f = void 0), null == e && (e = {}), g = angular.extend({}, e, {
                    position: null != e.position ? e.position : c(a),
                    icon: null != e.icon ? e.icon : b,
                    visible: null != e.visible ? e.visible : d(a)
                }), null != f && (g.map = f), g
            }, createWindowOptions: function (d, e, f, g) {
                return null != f && null != g && null != b ? angular.extend({}, g, {
                    content: this.buildContent(e, g, f),
                    position: null != g.position ? g.position : angular.isObject(d) ? d.getPosition() : c(e.coords)
                }) : g ? g : (a.error("infoWindow defaults not defined"), f ? void 0 : a.error("infoWindow content not defined"))
            }, buildContent: function (a, c, d) {
                var e, f;
                return null != c.content ? f = c.content : null != b ? (e = b(d)(a), e.length > 0 && (f = e[0])) : f = d, f
            }, defaultDelay: 50, isTrue: function (a) {
                return angular.isDefined(a) && null !== a && a === !0 || "1" === a || "y" === a || "true" === a
            }, isFalse: function (a) {
                return -1 !== ["false", "FALSE", 0, "n", "N", "no", "NO"].indexOf(a)
            }, getCoords: c, validateCoords: d, validatePath: function (a) {
                var b, c, d, e;
                if (c = 0, angular.isUndefined(a.type)) {
                    if (!Array.isArray(a) || a.length < 2)return !1;
                    for (; c < a.length;) {
                        if (!(angular.isDefined(a[c].latitude) && angular.isDefined(a[c].longitude) || "function" == typeof a[c].lat && "function" == typeof a[c].lng))return !1;
                        c++
                    }
                    return !0
                }
                if (angular.isUndefined(a.coordinates))return !1;
                if ("Polygon" === a.type) {
                    if (a.coordinates[0].length < 4)return !1;
                    b = a.coordinates[0]
                } else if ("MultiPolygon" === a.type) {
                    if (e = {max: 0, index: 0}, _.forEach(a.coordinates, function (a, b) {
                            return a[0].length > this.max ? (this.max = a[0].length, this.index = b) : void 0
                        }, e), d = a.coordinates[e.index], b = d[0], b.length < 4)return !1
                } else {
                    if ("LineString" !== a.type)return !1;
                    if (a.coordinates.length < 2)return !1;
                    b = a.coordinates
                }
                for (; c < b.length;) {
                    if (2 !== b[c].length)return !1;
                    c++
                }
                return !0
            }, convertPathPoints: function (a) {
                var b, c, d, e, f;
                if (c = 0, e = new google.maps.MVCArray, angular.isUndefined(a.type))for (; c < a.length;)angular.isDefined(a[c].latitude) && angular.isDefined(a[c].longitude) ? d = new google.maps.LatLng(a[c].latitude, a[c].longitude) : "function" == typeof a[c].lat && "function" == typeof a[c].lng && (d = a[c]), e.push(d), c++; else for ("Polygon" === a.type ? b = a.coordinates[0] : "MultiPolygon" === a.type ? (f = {
                    max: 0,
                    index: 0
                }, _.forEach(a.coordinates, function (a, b) {
                    return a[0].length > this.max ? (this.max = a[0].length, this.index = b) : void 0
                }, f), b = a.coordinates[f.index][0]) : "LineString" === a.type && (b = a.coordinates); c < b.length;)e.push(new google.maps.LatLng(b[c][1], b[c][0])), c++;
                return e
            }, extendMapBounds: function (a, b) {
                var c, d;
                for (c = new google.maps.LatLngBounds, d = 0; d < b.length;)c.extend(b.getAt(d)), d++;
                return a.fitBounds(c)
            }
        }
    }])
}.call(this), function () {
    var a = {}.hasOwnProperty, b = function (b, c) {
        function d() {
            this.constructor = b
        }

        for (var e in c)a.call(c, e) && (b[e] = c[e]);
        return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
    };
    angular.module("google-maps.directives.api.utils").factory("Linked", ["BaseObject", function (a) {
        var c;
        return c = function (a) {
            function c(a, b, c, d) {
                this.scope = a, this.element = b, this.attrs = c, this.ctrls = d
            }

            return b(c, a), c
        }(a)
    }])
}.call(this), function () {
    angular.module("google-maps.directives.api.utils").service("Logger", ["$log", function (a) {
        return {
            logger: a, doLog: !1, info: function (a) {
                return this.doLog ? null != this.logger ? this.logger.info(a) : console.info(a) : void 0
            }, error: function (a) {
                return this.doLog ? null != this.logger ? this.logger.error(a) : console.error(a) : void 0
            }, warn: function (a) {
                return this.doLog ? null != this.logger ? this.logger.warn(a) : console.warn(a) : void 0
            }
        }
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.utils").factory("ModelKey", ["BaseObject", function (b) {
        var d;
        return d = function (b) {
            function d(b) {
                this.scope = b, this.setIdKey = a(this.setIdKey, this), this.modelKeyComparison = a(this.modelKeyComparison, this), d.__super__.constructor.call(this), this.defaultIdKey = "id", this.idKey = void 0
            }

            return c(d, b), d.prototype.evalModelHandle = function (a, b) {
                return void 0 === a ? void 0 : "self" === b ? a : a[b]
            }, d.prototype.modelKeyComparison = function (a, b) {
                var c;
                if (c = null != this.scope.coords ? this.scope : this.parentScope, null == c)throw"No scope or parentScope set!";
                return this.evalModelHandle(a, c.coords).latitude === this.evalModelHandle(b, c.coords).latitude && this.evalModelHandle(a, c.coords).longitude === this.evalModelHandle(b, c.coords).longitude
            }, d.prototype.setIdKey = function (a) {
                return this.idKey = null != a.idKey ? a.idKey : this.defaultIdKey
            }, d
        }(b)
    }])
}.call(this), function () {
    angular.module("google-maps.directives.api.utils").factory("ModelsWatcher", ["Logger", function (a) {
        return {
            figureOutState: function (b, c, d, e, f) {
                var g, h, i;
                return g = [], h = {}, i = [], _async.each(c.models, function (c) {
                    var f;
                    return null == c[b] ? a.error("id missing for model " + c.toString() + ", can not use do comparison/insertion") : (h[c[b]] = {}, null == d[c[b]] ? g.push(c) : (f = d[c[b]], e(c, f.model) ? void 0 : (g.push(c), i.push(f))))
                }, function () {
                    return _async.each(d.values(), function (c) {
                        var d;
                        return null == c ? void a.error("child undefined in ModelsWatcher.") : null == c.model ? void a.error("child.model undefined in ModelsWatcher.") : (d = c.model[b], null == h[d] ? i.push(c) : void 0)
                    }, function () {
                        return f({adds: g, removals: i})
                    })
                })
            }
        }
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    };
    angular.module("google-maps.directives.api.utils").factory("PropMap", function () {
        var b, c;
        return c = ["get", "put", "remove", "values", "keys", "length"], b = function () {
            function b() {
                this.keys = a(this.keys, this), this.values = a(this.values, this), this.remove = a(this.remove, this), this.put = a(this.put, this), this.get = a(this.get, this), this.length = 0
            }

            return b.prototype.get = function (a) {
                return this[a]
            }, b.prototype.put = function (a, b) {
                return null == this[a] && this.length++, this[a] = b
            }, b.prototype.remove = function (a) {
                return delete this[a], this.length--
            }, b.prototype.values = function () {
                var a, b, d = this;
                return a = [], b = _.keys(this), _.each(b, function (b) {
                    return -1 === _.indexOf(c, b) ? a.push(d[b]) : void 0
                }), a
            }, b.prototype.keys = function () {
                var a, b;
                return b = _.keys(this), a = [], _.each(b, function (b) {
                    return -1 === _.indexOf(c, b) ? a.push(b) : void 0
                }), a
            }, b
        }()
    })
}.call(this), function () {
    angular.module("google-maps.directives.api.utils").factory("nggmap-PropertyAction", ["Logger", function () {
        var a;
        return a = function (a, b) {
            var c = this;
            return this.setIfChange = function (c, d) {
                return _.isEqual(d, c || b) ? void 0 : a(c)
            }, this.sic = function (a, b) {
                return c.setIfChange(a, b)
            }, this
        }
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.managers").factory("ClustererMarkerManager", ["Logger", "FitHelper", function (b, d) {
        var e;
        return e = function (d) {
            function e(c, d, f, g) {
                var h;
                this.opt_events = g, this.fit = a(this.fit, this), this.destroy = a(this.destroy, this), this.clear = a(this.clear, this), this.draw = a(this.draw, this), this.removeMany = a(this.removeMany, this), this.remove = a(this.remove, this), this.addMany = a(this.addMany, this), this.add = a(this.add, this), e.__super__.constructor.call(this), h = this, this.opt_options = f, this.clusterer = null != f && void 0 === d ? new MarkerClusterer(c, void 0, f) : null != f && null != d ? new MarkerClusterer(c, d, f) : new MarkerClusterer(c), this.attachEvents(this.opt_events, "opt_events"), this.clusterer.setIgnoreHidden(!0), this.noDrawOnSingleAddRemoves = !0, b.info(this)
            }

            return c(e, d), e.prototype.add = function (a) {
                return this.clusterer.addMarker(a, this.noDrawOnSingleAddRemoves)
            }, e.prototype.addMany = function (a) {
                return this.clusterer.addMarkers(a)
            }, e.prototype.remove = function (a) {
                return this.clusterer.removeMarker(a, this.noDrawOnSingleAddRemoves)
            }, e.prototype.removeMany = function (a) {
                return this.clusterer.addMarkers(a)
            }, e.prototype.draw = function () {
                return this.clusterer.repaint()
            }, e.prototype.clear = function () {
                return this.clusterer.clearMarkers(), this.clusterer.repaint()
            }, e.prototype.attachEvents = function (a, c) {
                var d, e, f;
                if (angular.isDefined(a) && null != a && angular.isObject(a)) {
                    f = [];
                    for (e in a)d = a[e], a.hasOwnProperty(e) && angular.isFunction(a[e]) ? (b.info("" + c + ": Attaching event: " + e + " to clusterer"), f.push(google.maps.event.addListener(this.clusterer, e, a[e]))) : f.push(void 0);
                    return f
                }
            }, e.prototype.clearEvents = function (a) {
                var c, d, e;
                if (angular.isDefined(a) && null != a && angular.isObject(a)) {
                    e = [];
                    for (d in a)c = a[d], a.hasOwnProperty(d) && angular.isFunction(a[d]) ? (b.info("" + optionsName + ": Clearing event: " + d + " to clusterer"), e.push(google.maps.event.clearListeners(this.clusterer, d))) : e.push(void 0);
                    return e
                }
            }, e.prototype.destroy = function () {
                return this.clearEvents(this.opt_events), this.clearEvents(this.opt_internal_events), this.clear()
            }, e.prototype.fit = function () {
                return e.__super__.fit.call(this, this.clusterer.getMarkers(), this.clusterer.getMap())
            }, e
        }(d)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.managers").factory("MarkerManager", ["Logger", "FitHelper", function (b, d) {
        var e;
        return e = function (e) {
            function f(c) {
                this.fit = a(this.fit, this), this.handleOptDraw = a(this.handleOptDraw, this), this.clear = a(this.clear, this), this.draw = a(this.draw, this), this.removeMany = a(this.removeMany, this), this.remove = a(this.remove, this), this.addMany = a(this.addMany, this), this.add = a(this.add, this);
                var d;
                f.__super__.constructor.call(this), d = this, this.gMap = c, this.gMarkers = [], this.$log = b, this.$log.info(this)
            }

            return c(f, e), f.include(d), f.prototype.add = function (a, b, c) {
                return null == c && (c = !0), this.handleOptDraw(a, b, c), this.gMarkers.push(a)
            }, f.prototype.addMany = function (a) {
                var b, c, d, e;
                for (e = [], c = 0, d = a.length; d > c; c++)b = a[c], e.push(this.add(b));
                return e
            }, f.prototype.remove = function (a, b) {
                var c, d;
                return this.handleOptDraw(a, b, !1), b ? (c = void 0, null != this.gMarkers.indexOf ? c = this.gMarkers.indexOf(a) : (d = 0, _.find(this.gMarkers, function (b) {
                    d += 1, b === a && (c = d)
                })), null != c ? this.gMarkers.splice(c, 1) : void 0) : void 0
            }, f.prototype.removeMany = function () {
                var a = this;
                return this.gMarkers.forEach(function (b) {
                    return a.remove(b)
                })
            }, f.prototype.draw = function () {
                var a, b = this;
                return a = [], this.gMarkers.forEach(function (c) {
                    return c.isDrawn ? void 0 : c.doAdd ? (c.setMap(b.gMap), c.isDrawn = !0) : a.push(c)
                }), a.forEach(function (a) {
                    return a.isDrawn = !1, b.remove(a, !0)
                })
            }, f.prototype.clear = function () {
                var a, b, c, d;
                for (d = this.gMarkers, b = 0, c = d.length; c > b; b++)a = d[b], a.setMap(null);
                return delete this.gMarkers, this.gMarkers = []
            }, f.prototype.handleOptDraw = function (a, b, c) {
                return b === !0 ? (a.setMap(c ? this.gMap : null), a.isDrawn = !0) : (a.isDrawn = !1, a.doAdd = c)
            }, f.prototype.fit = function () {
                return f.__super__.fit.call(this, this.gMarkers, this.gMap)
            }, f
        }(d)
    }])
}.call(this), function () {
    angular.module("google-maps").factory("array-sync", ["add-events", function (a) {
        return function (b, c, d) {
            var e, f, g, h, i, j, k, l, m;
            return h = !1, l = c.$eval(d), c["static"] || (i = {
                set_at: function (a) {
                    var c;
                    if (!h && (c = b.getAt(a)))return c.lng && c.lat ? (l[a].latitude = c.lat(), l[a].longitude = c.lng()) : l[a] = c
                }, insert_at: function (a) {
                    var c;
                    if (!h && (c = b.getAt(a)))return c.lng && c.lat ? l.splice(a, 0, {
                        latitude: c.lat(),
                        longitude: c.lng()
                    }) : l.splice(a, 0, c)
                }, remove_at: function (a) {
                    return h ? void 0 : l.splice(a, 1)
                }
            }, "Polygon" === l.type ? e = l.coordinates[0] : "LineString" === l.type && (e = l.coordinates), f = {
                set_at: function (a) {
                    var c;
                    if (!h && (c = b.getAt(a), c && c.lng && c.lat))return e[a][1] = c.lat(), e[a][0] = c.lng()
                }, insert_at: function (a) {
                    var c;
                    if (!h && (c = b.getAt(a), c && c.lng && c.lat))return e.splice(a, 0, [c.lng(), c.lat()])
                }, remove_at: function (a) {
                    return h ? void 0 : e.splice(a, 1)
                }
            }, k = a(b, angular.isUndefined(l.type) ? i : f)), j = function (a) {
                var c, d, e, f, g, i, j;
                if (h = !0, g = b, a) {
                    for (c = 0, i = g.getLength(), e = a.length, d = Math.min(i, e), f = void 0; d > c;)j = g.getAt(c), f = a[c], "function" == typeof f.equals ? f.equals(j) || g.setAt(c, f) : (j.lat() !== f.latitude || j.lng() !== f.longitude) && g.setAt(c, new google.maps.LatLng(f.latitude, f.longitude)), c++;
                    for (; e > c;)f = a[c], g.push("function" == typeof f.lat && "function" == typeof f.lng ? f : new google.maps.LatLng(f.latitude, f.longitude)), c++;
                    for (; i > c;)g.pop(), c++
                }
                return h = !1
            }, g = function (a) {
                var c, d, e, f, g, i, j, k;
                if (h = !0, i = b, a) {
                    for ("Polygon" === l.type ? c = a.coordinates[0] : "LineString" === l.type && (c = a.coordinates), d = 0, j = i.getLength(), f = c.length, e = Math.min(j, f), g = void 0; e > d;)k = i.getAt(d), g = c[d], (k.lat() !== g[1] || k.lng() !== g[0]) && i.setAt(d, new google.maps.LatLng(g[1], g[0])), d++;
                    for (; f > d;)g = c[d], i.push(new google.maps.LatLng(g[1], g[0])), d++;
                    for (; j > d;)i.pop(), d++
                }
                return h = !1
            }, c["static"] || (m = angular.isUndefined(l.type) ? c.$watchCollection(d, j) : c.$watch(d, g, !0)), function () {
                return k && (k(), k = null), m ? (m(), m = null) : void 0
            }
        }
    }])
}.call(this), function () {
    angular.module("google-maps").factory("add-events", ["$timeout", function (a) {
        var b, c;
        return b = function (b, c, d) {
            return google.maps.event.addListener(b, c, function () {
                return d.apply(this, arguments), a(function () {
                }, !0)
            })
        }, c = function (a, c, d) {
            var e;
            return d ? b(a, c, d) : (e = [], angular.forEach(c, function (c, d) {
                return e.push(b(a, d, c))
            }), function () {
                return angular.forEach(e, function (a) {
                    return google.maps.event.removeListener(a)
                }), e = null
            })
        }
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.models.child").factory("MarkerLabelChildModel", ["BaseObject", "GmapUtil", function (b, d) {
        var e;
        return e = function (b) {
            function e(b, c, d) {
                this.destroy = a(this.destroy, this), this.setOptions = a(this.setOptions, this);
                var f;
                e.__super__.constructor.call(this), f = this, this.gMarker = b, this.setOptions(c), this.gMarkerLabel = new MarkerLabel_(this.gMarker, c.crossImage, c.handCursor), this.gMarker.set("setMap", function (a) {
                    return f.gMarkerLabel.setMap(a), google.maps.Marker.prototype.setMap.apply(this, arguments)
                }), this.gMarker.setMap(d)
            }

            return c(e, b), e.include(d), e.prototype.setOption = function (a, b) {
                return this.gMarker.set(a, b)
            }, e.prototype.setOptions = function (a) {
                var b, c;
                return (null != a ? a.labelContent : void 0) && this.gMarker.set("labelContent", a.labelContent), (null != a ? a.labelAnchor : void 0) && this.gMarker.set("labelAnchor", this.getLabelPositionPoint(a.labelAnchor)), this.gMarker.set("labelClass", a.labelClass || "labels"), this.gMarker.set("labelStyle", a.labelStyle || {opacity: 100}), this.gMarker.set("labelInBackground", a.labelInBackground || !1), a.labelVisible || this.gMarker.set("labelVisible", !0), a.raiseOnDrag || this.gMarker.set("raiseOnDrag", !0), a.clickable || this.gMarker.set("clickable", !0), a.draggable || this.gMarker.set("draggable", !1), a.optimized || this.gMarker.set("optimized", !1), a.crossImage = null != (b = a.crossImage) ? b : document.location.protocol + "//maps.gstatic.com/intl/en_us/mapfiles/drag_cross_67_16.png", a.handCursor = null != (c = a.handCursor) ? c : document.location.protocol + "//maps.gstatic.com/intl/en_us/mapfiles/closedhand_8_8.cur"
            }, e.prototype.destroy = function () {
                return null != this.gMarkerLabel.labelDiv_.parentNode && null != this.gMarkerLabel.eventDiv_.parentNode ? this.gMarkerLabel.onRemove() : void 0
            }, e
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.models.child").factory("MarkerChildModel", ["ModelKey", "GmapUtil", "Logger", "$injector", "EventsHelper", function (b, d, e, f, g) {
        var h;
        return h = function (b) {
            function h(b, c, d, f, g, i, j, k) {
                var l, m = this;
                this.model = b, this.parentScope = c, this.gMap = d, this.$timeout = f, this.defaults = g, this.doClick = i, this.gMarkerManager = j, this.idKey = k, this.watchDestroy = a(this.watchDestroy, this), this.setLabelOptions = a(this.setLabelOptions, this), this.isLabelDefined = a(this.isLabelDefined, this), this.setOptions = a(this.setOptions, this), this.setIcon = a(this.setIcon, this), this.setCoords = a(this.setCoords, this), this.destroy = a(this.destroy, this), this.maybeSetScopeValue = a(this.maybeSetScopeValue, this), this.createMarker = a(this.createMarker, this), this.setMyScope = a(this.setMyScope, this), l = this, this.model[this.idKey] && (this.id = this.model[this.idKey]), this.iconKey = this.parentScope.icon, this.coordsKey = this.parentScope.coords, this.clickKey = this.parentScope.click(), this.labelContentKey = this.parentScope.labelContent, this.optionsKey = this.parentScope.options, this.labelOptionsKey = this.parentScope.labelOptions, h.__super__.constructor.call(this, this.parentScope.$new(!1)), this.scope.model = this.model, this.setMyScope(this.model, void 0, !0), this.createMarker(this.model), this.scope.$watch("model", function (a, b) {
                    return a !== b ? m.setMyScope(a, b) : void 0
                }, !0), this.$log = e, this.$log.info(l), this.watchDestroy(this.scope)
            }

            return c(h, b), h.include(d), h.include(g), h.prototype.setMyScope = function (a, b, c) {
                var d = this;
                return null == b && (b = void 0), null == c && (c = !1), this.maybeSetScopeValue("icon", a, b, this.iconKey, this.evalModelHandle, c, this.setIcon), this.maybeSetScopeValue("coords", a, b, this.coordsKey, this.evalModelHandle, c, this.setCoords), this.maybeSetScopeValue("labelContent", a, b, this.labelContentKey, this.evalModelHandle, c), _.isFunction(this.clickKey) && f ? this.scope.click = function () {
                    return f.invoke(d.clickKey, void 0, {$markerModel: a})
                } : (this.maybeSetScopeValue("click", a, b, this.clickKey, this.evalModelHandle, c), this.createMarker(a, b, c))
            }, h.prototype.createMarker = function (a, b, c) {
                var d = this;
                return null == b && (b = void 0), null == c && (c = !1), this.maybeSetScopeValue("options", a, b, this.optionsKey, function (a, b) {
                    var c;
                    return void 0 === a ? void 0 : (c = "self" === b ? a : a[b], void 0 === c ? c = void 0 === b ? d.defaults : d.scope.options : c)
                }, c, this.setOptions)
            }, h.prototype.maybeSetScopeValue = function (a, b, c, d, e, f, g) {
                var h, i;
                return null == g && (g = void 0), void 0 === c ? (this.scope[a] = e(b, d), void(f || null != g && g(this.scope))) : (i = e(c, d), h = e(b, d), h === i || this.scope[a] === h || (this.scope[a] = h, f) ? void 0 : (null != g && g(this.scope), this.gMarkerManager.draw()))
            }, h.prototype.destroy = function () {
                return this.scope.$destroy()
            }, h.prototype.setCoords = function (a) {
                return a.$id === this.scope.$id && void 0 !== this.gMarker ? null != a.coords ? this.validateCoords(this.scope.coords) ? (this.gMarker.setPosition(this.getCoords(a.coords)), this.gMarker.setVisible(this.validateCoords(a.coords)), this.gMarkerManager.remove(this.gMarker), this.gMarkerManager.add(this.gMarker)) : void this.$log.error("MarkerChildMarker cannot render marker as scope.coords as no position on marker: " + JSON.stringify(this.model)) : this.gMarkerManager.remove(this.gMarker) : void 0
            }, h.prototype.setIcon = function (a) {
                return a.$id === this.scope.$id && void 0 !== this.gMarker ? (this.gMarkerManager.remove(this.gMarker), this.gMarker.setIcon(a.icon), this.gMarkerManager.add(this.gMarker), this.gMarker.setPosition(this.getCoords(a.coords)), this.gMarker.setVisible(this.validateCoords(a.coords))) : void 0
            }, h.prototype.setOptions = function (a) {
                var b, c = this;
                if (a.$id === this.scope.$id && (null != this.gMarker && (this.gMarkerManager.remove(this.gMarker), delete this.gMarker), null != (b = a.coords) ? b : "function" == typeof a.icon ? a.icon(null != a.options) : void 0))return this.opts = this.createMarkerOptions(a.coords, a.icon, a.options), delete this.gMarker, this.gMarker = this.isLabelDefined(a) ? new MarkerWithLabel(this.setLabelOptions(this.opts, a)) : new google.maps.Marker(this.opts), this.setEvents(this.gMarker, this.parentScope, this.model), this.id && (this.gMarker.key = this.id), this.gMarkerManager.add(this.gMarker), google.maps.event.addListener(this.gMarker, "click", function () {
                    return c.doClick && null != c.scope.click ? c.scope.click() : void 0
                })
            }, h.prototype.isLabelDefined = function (a) {
                return null != a.labelContent
            }, h.prototype.setLabelOptions = function (a, b) {
                return a.labelAnchor = this.getLabelPositionPoint(b.labelAnchor), a.labelClass = b.labelClass, a.labelContent = b.labelContent, a
            }, h.prototype.watchDestroy = function (a) {
                var b = this;
                return a.$on("$destroy", function () {
                    var a, c;
                    return null != b.gMarker && (google.maps.event.clearListeners(b.gMarker, "click"), (null != (c = b.parentScope) ? c.events : void 0) && _.isArray(b.parentScope.events) && b.parentScope.events.forEach(function (a, b) {
                        return google.maps.event.clearListeners(this.gMarker, b)
                    }), b.gMarkerManager.remove(b.gMarker, !0), delete b.gMarker), a = void 0
                })
            }, h
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("PolylineChildModel", ["BaseObject", "Logger", "$timeout", "array-sync", "GmapUtil", function (b, d, e, f, g) {
        var h, i;
        return h = d, i = function (b) {
            function d(b, c, d, e, i) {
                var j, k, l = this;
                this.scope = b, this.attrs = c, this.map = d, this.defaults = e, this.model = i, this.buildOpts = a(this.buildOpts, this), k = this.convertPathPoints(b.path), this.polyline = new google.maps.Polyline(this.buildOpts(k)), b.fit && g.extendMapBounds(d, k), !b["static"] && angular.isDefined(b.editable) && b.$watch("editable", function (a, b) {
                    return a !== b ? l.polyline.setEditable(a) : void 0
                }), angular.isDefined(b.draggable) && b.$watch("draggable", function (a, b) {
                    return a !== b ? l.polyline.setDraggable(a) : void 0
                }), angular.isDefined(b.visible) && b.$watch("visible", function (a, b) {
                    return a !== b ? l.polyline.setVisible(a) : void 0
                }), angular.isDefined(b.geodesic) && b.$watch("geodesic", function (a, b) {
                    return a !== b ? l.polyline.setOptions(l.buildOpts(l.polyline.getPath())) : void 0
                }), angular.isDefined(b.stroke) && angular.isDefined(b.stroke.weight) && b.$watch("stroke.weight", function (a, b) {
                    return a !== b ? l.polyline.setOptions(l.buildOpts(l.polyline.getPath())) : void 0
                }), angular.isDefined(b.stroke) && angular.isDefined(b.stroke.color) && b.$watch("stroke.color", function (a, b) {
                    return a !== b ? l.polyline.setOptions(l.buildOpts(l.polyline.getPath())) : void 0
                }), angular.isDefined(b.stroke) && angular.isDefined(b.stroke.opacity) && b.$watch("stroke.opacity", function (a, b) {
                    return a !== b ? l.polyline.setOptions(l.buildOpts(l.polyline.getPath())) : void 0
                }), angular.isDefined(b.icons) && b.$watch("icons", function (a, b) {
                    return a !== b ? l.polyline.setOptions(l.buildOpts(l.polyline.getPath())) : void 0
                }), j = f(this.polyline.getPath(), b, "path", function (a) {
                    return b.fit ? g.extendMapBounds(d, a) : void 0
                }), b.$on("$destroy", function () {
                    return l.polyline.setMap(null), l.polyline = null, l.scope = null, j ? (j(), j = null) : void 0
                }), h.info(this)
            }

            return c(d, b), d.include(g), d.prototype.buildOpts = function (a) {
                var b, c = this;
                return b = angular.extend({}, this.defaults, {
                    map: this.map,
                    path: a,
                    icons: this.scope.icons,
                    strokeColor: this.scope.stroke && this.scope.stroke.color,
                    strokeOpacity: this.scope.stroke && this.scope.stroke.opacity,
                    strokeWeight: this.scope.stroke && this.scope.stroke.weight
                }), angular.forEach({
                    clickable: !0,
                    draggable: !1,
                    editable: !1,
                    geodesic: !1,
                    visible: !0,
                    "static": !1,
                    fit: !1
                }, function (a, d) {
                    return b[d] = angular.isUndefined(c.scope[d]) || null === c.scope[d] ? a : c.scope[d]
                }), b["static"] && (b.editable = !1), b
            }, d.prototype.destroy = function () {
                return this.scope.$destroy()
            }, d
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.models.child").factory("WindowChildModel", ["BaseObject", "GmapUtil", "Logger", "$compile", "$http", "$templateCache", function (b, d, e, f, g, h) {
        var i;
        return i = function (b) {
            function i(b, c, d, f, g, h, i, j, k) {
                this.model = b, this.scope = c, this.opts = d, this.isIconVisibleOnClick = f, this.mapCtrl = g, this.markerCtrl = h, this.element = i, this.needToManualDestroy = null != j ? j : !1, this.markerIsVisibleAfterWindowClose = null != k ? k : !0, this.destroy = a(this.destroy, this), this.remove = a(this.remove, this), this.hideWindow = a(this.hideWindow, this), this.getLatestPosition = a(this.getLatestPosition, this), this.showWindow = a(this.showWindow, this), this.handleClick = a(this.handleClick, this), this.watchCoords = a(this.watchCoords, this), this.watchShow = a(this.watchShow, this), this.createGWin = a(this.createGWin, this), this.watchElement = a(this.watchElement, this), this.googleMapsHandles = [], this.$log = e, this.createGWin(), null != this.markerCtrl && this.markerCtrl.setClickable(!0), this.handleClick(), this.watchElement(), this.watchShow(), this.watchCoords(), this.$log.info(this)
            }

            return c(i, b), i.include(d), i.prototype.watchElement = function () {
                var a = this;
                return this.scope.$watch(function () {
                    var b;
                    if (a.element && a.html)return a.html !== a.element.html() && a.gWin ? (null != (b = a.opts) && (b.content = void 0), a.remove(), a.createGWin(), a.showHide()) : void 0
                })
            }, i.prototype.createGWin = function () {
                var a, b = this;
                return null == this.gWin && (a = {}, null != this.opts && (this.scope.coords && (this.opts.position = this.getCoords(this.scope.coords)), a = this.opts), this.element && (this.html = _.isObject(this.element) ? this.element.html() : this.element), this.opts = this.createWindowOptions(this.markerCtrl, this.scope, this.html, a)), null == this.opts || this.gWin ? void 0 : (this.gWin = this.opts.boxClass && window.InfoBox && "function" == typeof window.InfoBox ? new window.InfoBox(this.opts) : new google.maps.InfoWindow(this.opts), this.googleMapsHandles.push(google.maps.event.addListener(this.gWin, "closeclick", function () {
                    return b.markerCtrl && (b.markerCtrl.setAnimation(b.oldMarkerAnimation), b.markerIsVisibleAfterWindowClose && _.delay(function () {
                        return b.markerCtrl.setVisible(!1), b.markerCtrl.setVisible(b.markerIsVisibleAfterWindowClose)
                    }, 250)), b.gWin.isOpen(!1), null != b.scope.closeClick ? b.scope.closeClick() : void 0
                })))
            }, i.prototype.watchShow = function () {
                var a = this;
                return this.scope.$watch("show", function (b, c) {
                    return b !== c ? b ? a.showWindow() : a.hideWindow() : null != a.gWin && b && !a.gWin.getMap() ? a.showWindow() : void 0
                }, !0)
            }, i.prototype.watchCoords = function () {
                var a, b = this;
                return a = null != this.markerCtrl ? this.scope.$parent : this.scope, a.$watch("coords", function (a, c) {
                    var d;
                    if (a !== c) {
                        if (null == a)return b.hideWindow();
                        if (!b.validateCoords(a))return void b.$log.error("WindowChildMarker cannot render marker as scope.coords as no position on marker: " + JSON.stringify(b.model));
                        if (d = b.getCoords(a), b.gWin.setPosition(d), b.opts)return b.opts.position = d
                    }
                }, !0)
            }, i.prototype.handleClick = function (a) {
                var b, c = this;
                return b = function () {
                    var a;
                    return null == c.gWin && c.createGWin(), a = c.markerCtrl.getPosition(), null != c.gWin && (c.gWin.setPosition(a), c.opts && (c.opts.position = a), c.showWindow()), c.initialMarkerVisibility = c.markerCtrl.getVisible(), c.oldMarkerAnimation = c.markerCtrl.getAnimation(), c.markerCtrl.setVisible(c.isIconVisibleOnClick)
                }, null != this.markerCtrl ? (a && b(), this.googleMapsHandles.push(google.maps.event.addListener(this.markerCtrl, "click", b))) : void 0
            }, i.prototype.showWindow = function () {
                var a, b = this;
                return a = function () {
                    return !b.gWin || !b.scope.show && null != b.scope.show || b.gWin.isOpen() ? void 0 : b.gWin.open(b.mapCtrl)
                }, this.scope.templateUrl ? (this.gWin && g.get(this.scope.templateUrl, {cache: h}).then(function (a) {
                    var c, d;
                    return d = b.scope.$new(), angular.isDefined(b.scope.templateParameter) && (d.parameter = b.scope.templateParameter), c = f(a.data)(d), b.gWin.setContent(c[0])
                }), a()) : a()
            }, i.prototype.showHide = function () {
                return this.scope.show ? this.showWindow() : this.hideWindow()
            }, i.prototype.getLatestPosition = function (a) {
                return null == this.gWin || null == this.markerCtrl || a ? a ? this.gWin.setPosition(a) : void 0 : this.gWin.setPosition(this.markerCtrl.getPosition())
            }, i.prototype.hideWindow = function () {
                return null != this.gWin && this.gWin.isOpen() ? this.gWin.close() : void 0
            }, i.prototype.remove = function () {
                return this.hideWindow(), _.each(this.googleMapsHandles, function (a) {
                    return google.maps.event.removeListener(a)
                }), this.googleMapsHandles.length = 0, delete this.gWin
            }, i.prototype.destroy = function (a) {
                var b;
                return null == a && (a = !1), this.remove(), null != this.scope && (this.needToManualDestroy || a) && this.scope.$destroy(), b = void 0
            }, i
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.models.parent").factory("IMarkerParentModel", ["ModelKey", "Logger", function (b, d) {
        var e;
        return e = function (b) {
            function e(b, c, f, g, h) {
                var i, j = this;
                if (this.scope = b, this.element = c, this.attrs = f, this.map = g, this.$timeout = h, this.onDestroy = a(this.onDestroy, this), this.onWatch = a(this.onWatch, this), this.watch = a(this.watch, this), this.validateScope = a(this.validateScope, this), e.__super__.constructor.call(this, this.scope), i = this, this.$log = d, !this.validateScope(b))throw new String("Unable to construct IMarkerParentModel due to invalid scope");
                this.doClick = angular.isDefined(f.click), null != b.options && (this.DEFAULTS = b.options), this.watch("coords", this.scope), this.watch("icon", this.scope), this.watch("options", this.scope), b.$on("$destroy", function () {
                    return j.onDestroy(b)
                })
            }

            return c(e, b), e.prototype.DEFAULTS = {}, e.prototype.validateScope = function (a) {
                var b;
                return null == a ? (this.$log.error(this.constructor.name + ": invalid scope used"), !1) : (b = null != a.coords, b ? b : (this.$log.error(this.constructor.name + ": no valid coords attribute found"), !1))
            }, e.prototype.watch = function (a, b) {
                var c = this;
                return b.$watch(a, function (d, e) {
                    return _.isEqual(d, e) ? void 0 : c.onWatch(a, b, d, e)
                }, !0)
            }, e.prototype.onWatch = function () {
                throw new String("OnWatch Not Implemented!!")
            }, e.prototype.onDestroy = function () {
                throw new String("OnDestroy Not Implemented!!")
            }, e
        }(b)
    }])
}.call(this), function () {
    var a = {}.hasOwnProperty, b = function (b, c) {
        function d() {
            this.constructor = b
        }

        for (var e in c)a.call(c, e) && (b[e] = c[e]);
        return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
    };
    angular.module("google-maps.directives.api.models.parent").factory("IWindowParentModel", ["ModelKey", "GmapUtil", "Logger", function (a, c, d) {
        var e;
        return e = function (a) {
            function e(a, b, c, f, g, h, i, j) {
                var k;
                e.__super__.constructor.call(this, a), k = this, this.$log = d, this.$timeout = g, this.$compile = h, this.$http = i, this.$templateCache = j, null != a.options && (this.DEFAULTS = a.options)
            }

            return b(e, a), e.include(c), e.prototype.DEFAULTS = {}, e
        }(a)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.models.parent").factory("LayerParentModel", ["BaseObject", "Logger", "$timeout", function (b, d) {
        var e;
        return e = function (b) {
            function e(b, c, e, f, g, h) {
                var i = this;
                return this.scope = b, this.element = c, this.attrs = e, this.gMap = f, this.onLayerCreated = null != g ? g : void 0, this.$log = null != h ? h : d, this.createGoogleLayer = a(this.createGoogleLayer, this), null == this.attrs.type ? void this.$log.info("type attribute for the layer directive is mandatory. Layer creation aborted!!") : (this.createGoogleLayer(), this.doShow = !0, angular.isDefined(this.attrs.show) && (this.doShow = this.scope.show), this.doShow && null != this.gMap && this.layer.setMap(this.gMap), this.scope.$watch("show", function (a, b) {
                    return a !== b ? (i.doShow = a, i.layer.setMap(a ? i.gMap : null)) : void 0
                }, !0), this.scope.$watch("options", function (a, b) {
                    return a !== b ? (i.layer.setMap(null), i.layer = null, i.createGoogleLayer()) : void 0
                }, !0), void this.scope.$on("$destroy", function () {
                    return i.layer.setMap(null)
                }))
            }

            return c(e, b), e.prototype.createGoogleLayer = function () {
                var a;
                return this.layer = null == this.attrs.options ? void 0 === this.attrs.namespace ? new google.maps[this.attrs.type] : new google.maps[this.attrs.namespace][this.attrs.type] : void 0 === this.attrs.namespace ? new google.maps[this.attrs.type](this.scope.options) : new google.maps[this.attrs.namespace][this.attrs.type](this.scope.options), null != this.layer && null != this.onLayerCreated && (a = this.onLayerCreated(this.scope, this.layer)) ? a(this.layer) : void 0
            }, e
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.models.parent").factory("MarkerParentModel", ["IMarkerParentModel", "GmapUtil", "EventsHelper", function (b, d, e) {
        var f;
        return f = function (b) {
            function f(b, c, d, e, g, h, i) {
                var j, k, l = this;
                this.gMarkerManager = h, this.doFit = i, this.onDestroy = a(this.onDestroy, this), this.setGMarker = a(this.setGMarker, this), this.onWatch = a(this.onWatch, this), f.__super__.constructor.call(this, b, c, d, e, g), k = this, j = this.createMarkerOptions(b.coords, b.icon, b.options, this.map), this.setGMarker(new google.maps.Marker(j)), this.listener = google.maps.event.addListener(this.scope.gMarker, "click", function () {
                    return l.doClick && null != b.click ? l.$timeout(function () {
                        return l.scope.click()
                    }) : void 0
                }), this.setEvents(this.scope.gMarker, b, b), this.$log.info(this)
            }

            return c(f, b), f.include(d), f.include(e), f.prototype.onWatch = function (a, b) {
                var c, d, e;
                switch (a) {
                    case"coords":
                        if (this.validateCoords(b.coords) && null != this.scope.gMarker) {
                            if (d = null != (e = this.scope.gMarker) ? e.getPosition() : void 0, d.lat() === this.scope.coords.latitude && this.scope.coords.longitude === d.lng())return;
                            return c = this.scope.gMarker.getAnimation(), this.scope.gMarker.setMap(this.map), this.scope.gMarker.setPosition(this.getCoords(b.coords)), this.scope.gMarker.setVisible(this.validateCoords(b.coords)), this.scope.gMarker.setAnimation(c)
                        }
                        return this.scope.gMarker.setMap(null);
                    case"icon":
                        if (null != b.icon && this.validateCoords(b.coords) && null != this.scope.gMarker)return this.scope.gMarker.setIcon(b.icon), this.scope.gMarker.setMap(null), this.scope.gMarker.setMap(this.map), this.scope.gMarker.setPosition(this.getCoords(b.coords)), this.scope.gMarker.setVisible(this.validateCoords(b.coords));
                        break;
                    case"options":
                        if (this.validateCoords(b.coords) && null != b.icon && b.options && null != this.scope.gMarker)return this.onDestroy(b), this.onTimeOut(b)
                }
            }, f.prototype.setGMarker = function (a) {
                return this.scope.gMarker && (delete this.scope.gMarker, this.gMarkerManager.remove(this.scope.gMarker, !1)), this.scope.gMarker = a, this.scope.gMarker && (this.gMarkerManager.add(this.scope.gMarker, !1), this.doFit) ? this.gMarkerManager.fit() : void 0
            }, f.prototype.onDestroy = function () {
                var a;
                return this.scope.gMarker ? (this.scope.gMarker.setMap(null), google.maps.event.removeListener(this.listener), this.listener = null, this.gMarkerManager.remove(this.scope.gMarker, !1), delete this.scope.gMarker, a = void 0) : void(a = void 0)
            }, f
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.models.parent").factory("MarkersParentModel", ["IMarkerParentModel", "ModelsWatcher", "PropMap", "MarkerChildModel", "ClustererMarkerManager", "MarkerManager", function (b, d, e, f, g, h) {
        var i;
        return i = function (b) {
            function i(b, c, d, f, g) {
                this.onDestroy = a(this.onDestroy, this), this.newChildMarker = a(this.newChildMarker, this), this.pieceMealMarkers = a(this.pieceMealMarkers, this), this.reBuildMarkers = a(this.reBuildMarkers, this), this.createMarkersFromScratch = a(this.createMarkersFromScratch, this), this.validateScope = a(this.validateScope, this), this.onWatch = a(this.onWatch, this);
                var h, j = this;
                i.__super__.constructor.call(this, b, c, d, f, g), h = this, this.scope.markerModels = new e, this.$timeout = g, this.$log.info(this), this.doRebuildAll = null != this.scope.doRebuildAll ? this.scope.doRebuildAll : !1, this.setIdKey(b), this.scope.$watch("doRebuildAll", function (a, b) {
                    return a !== b ? j.doRebuildAll = a : void 0
                }), this.watch("models", b), this.watch("doCluster", b), this.watch("clusterOptions", b), this.watch("clusterEvents", b), this.watch("fit", b), this.watch("idKey", b), this.gMarkerManager = void 0, this.createMarkersFromScratch(b)
            }

            return c(i, b), i.include(d), i.prototype.onWatch = function (a, b, c, d) {
                return "idKey" === a && c !== d && (this.idKey = c), this.doRebuildAll ? this.reBuildMarkers(b) : this.pieceMealMarkers(b)
            }, i.prototype.validateScope = function (a) {
                var b;
                return b = angular.isUndefined(a.models) || void 0 === a.models, b && this.$log.error(this.constructor.name + ": no valid models attribute found"), i.__super__.validateScope.call(this, a) || b
            }, i.prototype.createMarkersFromScratch = function (a) {
                var b = this;
                return a.doCluster ? (a.clusterEvents && (this.clusterInternalOptions = _.once(function () {
                    var c, d, e, f;
                    return c = b, b.origClusterEvents ? void 0 : (b.origClusterEvents = {
                        click: null != (d = a.clusterEvents) ? d.click : void 0,
                        mouseout: null != (e = a.clusterEvents) ? e.mouseout : void 0,
                        mouseover: null != (f = a.clusterEvents) ? f.mouseover : void 0
                    }, _.extend(a.clusterEvents, {
                        click: function (a) {
                            return c.maybeExecMappedEvent(a, "click")
                        }, mouseout: function (a) {
                            return c.maybeExecMappedEvent(a, "mouseout")
                        }, mouseover: function (a) {
                            return c.maybeExecMappedEvent(a, "mouseover")
                        }
                    }))
                })()), a.clusterOptions || a.clusterEvents ? void 0 === this.gMarkerManager ? this.gMarkerManager = new g(this.map, void 0, a.clusterOptions, this.clusterInternalOptions) : this.gMarkerManager.opt_options !== a.clusterOptions && (this.gMarkerManager = new g(this.map, void 0, a.clusterOptions, this.clusterInternalOptions)) : this.gMarkerManager = new g(this.map)) : this.gMarkerManager = new h(this.map), _async.each(a.models, function (c) {
                    return b.newChildMarker(c, a)
                }, function () {
                    return b.gMarkerManager.draw(), a.fit ? b.gMarkerManager.fit() : void 0
                })
            }, i.prototype.reBuildMarkers = function (a) {
                return a.doRebuild || void 0 === a.doRebuild ? (this.onDestroy(a), this.createMarkersFromScratch(a)) : void 0
            }, i.prototype.pieceMealMarkers = function (a) {
                var b = this;
                return null != this.scope.models && this.scope.models.length > 0 && this.scope.markerModels.length > 0 ? this.figureOutState(this.idKey, a, this.scope.markerModels, this.modelKeyComparison, function (c) {
                    var d;
                    return d = c, _async.each(d.removals, function (a) {
                        return null != a ? (null != a.destroy && a.destroy(), b.scope.markerModels.remove(a.id)) : void 0
                    }, function () {
                        return _async.each(d.adds, function (c) {
                            return b.newChildMarker(c, a)
                        }, function () {
                            return d.adds.length > 0 || d.removals.length > 0 ? (b.gMarkerManager.draw(), a.markerModels = b.scope.markerModels) : void 0
                        })
                    })
                }) : this.reBuildMarkers(a)
            }, i.prototype.newChildMarker = function (a, b) {
                var c;
                return null == a[this.idKey] ? void this.$log.error("Marker model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.") : (this.$log.info("child", c, "markers", this.scope.markerModels), c = new f(a, b, this.map, this.$timeout, this.DEFAULTS, this.doClick, this.gMarkerManager, this.idKey), this.scope.markerModels.put(a[this.idKey], c), c)
            }, i.prototype.onDestroy = function () {
                return _.each(this.scope.markerModels.values(), function (a) {
                    return null != a ? a.destroy() : void 0
                }), delete this.scope.markerModels, this.scope.markerModels = new e, null != this.gMarkerManager ? this.gMarkerManager.clear() : void 0
            }, i.prototype.maybeExecMappedEvent = function (a, b) {
                var c, d;
                return _.isFunction(null != (d = this.scope.clusterEvents) ? d[b] : void 0) && (c = this.mapClusterToMarkerModels(a), this.origClusterEvents[b]) ? this.origClusterEvents[b](c.cluster, c.mapped) : void 0
            }, i.prototype.mapClusterToMarkerModels = function (a) {
                var b, c, d = this;
                return b = a.getMarkers(), c = b.map(function (a) {
                    return d.scope.markerModels[a.key].model
                }), {cluster: a, mapped: c}
            }, i
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.models.parent").factory("PolylinesParentModel", ["$timeout", "Logger", "ModelKey", "ModelsWatcher", "PropMap", "PolylineChildModel", function (b, d, e, f, g, h) {
        var i;
        return i = function (b) {
            function e(b, c, f, h, i) {
                var j, k = this;
                this.scope = b, this.element = c, this.attrs = f, this.gMap = h, this.defaults = i, this.modelKeyComparison = a(this.modelKeyComparison, this), this.setChildScope = a(this.setChildScope, this), this.createChild = a(this.createChild, this), this.pieceMeal = a(this.pieceMeal, this), this.createAllNew = a(this.createAllNew, this), this.watchIdKey = a(this.watchIdKey, this), this.createChildScopes = a(this.createChildScopes, this), this.watchOurScope = a(this.watchOurScope, this), this.watchDestroy = a(this.watchDestroy, this), this.rebuildAll = a(this.rebuildAll, this), this.doINeedToWipe = a(this.doINeedToWipe, this), this.watchModels = a(this.watchModels, this), this.watch = a(this.watch, this), e.__super__.constructor.call(this, b), j = this, this.$log = d, this.plurals = new g, this.scopePropNames = ["path", "stroke", "clickable", "draggable", "editable", "geodesic", "icons", "visible"], _.each(this.scopePropNames, function (a) {
                    return k[a + "Key"] = void 0
                }), this.models = void 0, this.firstTime = !0, this.$log.info(this), this.watchOurScope(b), this.createChildScopes()
            }

            return c(e, b), e.include(f), e.prototype.watch = function (a, b, c) {
                var d = this;
                return a.$watch(b, function (a, e) {
                    return a !== e ? (d[c] = "function" == typeof a ? a() : a, _async.each(_.values(d.plurals), function (a) {
                        return a.scope[b] = "self" === d[c] ? a : a[d[c]]
                    }, function () {
                    })) : void 0
                })
            }, e.prototype.watchModels = function (a) {
                var b = this;
                return a.$watch("models", function (c, d) {
                    return _.isEqual(c, d) ? void 0 : b.doINeedToWipe(c) ? b.rebuildAll(a, !0, !0) : b.createChildScopes(!1)
                }, !0)
            }, e.prototype.doINeedToWipe = function (a) {
                var b;
                return b = null != a ? 0 === a.length : !0, this.plurals.length > 0 && b
            }, e.prototype.rebuildAll = function (a, b, c) {
                var d = this;
                return _async.each(this.plurals.values(), function (a) {
                    return a.destroy()
                }, function () {
                    return c && delete d.plurals, d.plurals = new g, b ? d.createChildScopes() : void 0
                })
            }, e.prototype.watchDestroy = function (a) {
                var b = this;
                return a.$on("$destroy", function () {
                    return b.rebuildAll(a, !1, !0)
                })
            }, e.prototype.watchOurScope = function (a) {
                var b = this;
                return _.each(this.scopePropNames, function (c) {
                    var d;
                    return d = c + "Key", b[d] = "function" == typeof a[c] ? a[c]() : a[c], b.watch(a, c, d)
                })
            }, e.prototype.createChildScopes = function (a) {
                return null == a && (a = !0), angular.isUndefined(this.scope.models) ? void this.$log.error("No models to create polylines from! I Need direct models!") : null != this.gMap && null != this.scope.models ? (this.watchIdKey(this.scope), a ? this.createAllNew(this.scope, !1) : this.pieceMeal(this.scope, !1)) : void 0
            }, e.prototype.watchIdKey = function (a) {
                var b = this;
                return this.setIdKey(a), a.$watch("idKey", function (c, d) {
                    return c !== d && null == c ? (b.idKey = c, b.rebuildAll(a, !0, !0)) : void 0
                })
            }, e.prototype.createAllNew = function (a, b) {
                var c = this;
                return null == b && (b = !1), this.models = a.models, this.firstTime && (this.watchModels(a), this.watchDestroy(a)), _async.each(a.models, function (a) {
                    return c.createChild(a, c.gMap)
                }, function () {
                    return c.firstTime = !1
                })
            }, e.prototype.pieceMeal = function (a, b) {
                var c = this;
                return null == b && (b = !0), this.models = a.models, null != a && null != a.models && a.models.length > 0 && this.plurals.length > 0 ? this.figureOutState(this.idKey, a, this.plurals, this.modelKeyComparison, function (a) {
                    var b;
                    return b = a, _async.each(b.removals, function (a) {
                        var b;
                        return b = c.plurals[a], null != b ? (b.destroy(), c.plurals.remove(a)) : void 0
                    }, function () {
                        return _async.each(b.adds, function (a) {
                            return c.createChild(a, c.gMap)
                        }, function () {
                        })
                    })
                }) : this.rebuildAll(this.scope, !0, !0)
            }, e.prototype.createChild = function (a, b) {
                var c, d, e = this;
                return d = this.scope.$new(!1), this.setChildScope(d, a), d.$watch("model", function (a, b) {
                    return a !== b ? e.setChildScope(d, a) : void 0
                }, !0), d["static"] = this.scope["static"], c = new h(d, this.attrs, b, this.defaults, a), null == a[this.idKey] ? void this.$log.error("Polyline model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.") : (this.plurals.put(a[this.idKey], c), c)
            }, e.prototype.setChildScope = function (a, b) {
                var c = this;
                return _.each(this.scopePropNames, function (d) {
                    var e, f;
                    return e = d + "Key", f = "self" === c[e] ? b : b[c[e]], f !== a[d] ? a[d] = f : void 0
                }), a.model = b
            }, e.prototype.modelKeyComparison = function (a, b) {
                return _.isEqual(this.evalModelHandle(a, this.scope.path), this.evalModelHandle(b, this.scope.path))
            }, e
        }(e)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api.models.parent").factory("WindowsParentModel", ["IWindowParentModel", "ModelsWatcher", "PropMap", "WindowChildModel", "Linked", function (b, d, e, f, g) {
        var h;
        return h = function (b) {
            function h(b, c, d, f, i, j, k, l, m) {
                var n, o, p = this;
                this.$interpolate = m, this.interpolateContent = a(this.interpolateContent, this), this.setChildScope = a(this.setChildScope, this), this.createWindow = a(this.createWindow, this), this.setContentKeys = a(this.setContentKeys, this), this.pieceMealWindows = a(this.pieceMealWindows, this), this.createAllNewWindows = a(this.createAllNewWindows, this), this.watchIdKey = a(this.watchIdKey, this), this.createChildScopesWindows = a(this.createChildScopesWindows, this), this.watchOurScope = a(this.watchOurScope, this), this.watchDestroy = a(this.watchDestroy, this), this.rebuildAll = a(this.rebuildAll, this), this.doINeedToWipe = a(this.doINeedToWipe, this), this.watchModels = a(this.watchModels, this), this.watch = a(this.watch, this), this.go = a(this.go, this), h.__super__.constructor.call(this, b, c, d, f, i, j, k, l), o = this, this.windows = new e, this.scopePropNames = ["show", "coords", "templateUrl", "templateParameter", "isIconVisibleOnClick", "closeClick"], _.each(this.scopePropNames, function (a) {
                    return p[a + "Key"] = void 0
                }), this.linked = new g(b, c, d, f), this.models = void 0, this.contentKeys = void 0, this.isIconVisibleOnClick = void 0, this.firstTime = !0, this.$log.info(o), this.parentScope = void 0, n = f[0].getScope(), n.deferred.promise.then(function (a) {
                    var c;
                    return p.gMap = a, c = f.length > 1 && null != f[1] ? f[1] : void 0, c ? c.getScope().deferred.promise.then(function () {
                        return p.markerScope = c.getScope(), p.go(b)
                    }) : void p.go(b)
                })
            }

            return c(h, b), h.include(d), h.prototype.go = function (a) {
                var b = this;
                return this.watchOurScope(a), this.doRebuildAll = null != this.scope.doRebuildAll ? this.scope.doRebuildAll : !1, a.$watch("doRebuildAll", function (a, c) {
                    return a !== c ? b.doRebuildAll = a : void 0
                }), this.createChildScopesWindows()
            }, h.prototype.watch = function (a, b, c) {
                var d = this;
                return a.$watch(b, function (a, e) {
                    return a !== e ? (d[c] = "function" == typeof a ? a() : a, _async.each(_.values(d.windows), function (a) {
                        return a.scope[b] = "self" === d[c] ? a : a[d[c]]
                    }, function () {
                    })) : void 0
                })
            }, h.prototype.watchModels = function (a) {
                var b = this;
                return a.$watch("models", function (c, d) {
                    return _.isEqual(c, d) ? void 0 : b.doRebuildAll || b.doINeedToWipe(c) ? b.rebuildAll(a, !0, !0) : b.createChildScopesWindows(!1)
                })
            }, h.prototype.doINeedToWipe = function (a) {
                var b;
                return b = null != a ? 0 === a.length : !0, this.windows.length > 0 && b
            }, h.prototype.rebuildAll = function (a, b, c) {
                var d = this;
                return _async.each(this.windows.values(), function (a) {
                    return a.destroy()
                }, function () {
                    return c && delete d.windows, d.windows = new e, b ? d.createChildScopesWindows() : void 0
                })
            }, h.prototype.watchDestroy = function (a) {
                var b = this;
                return a.$on("$destroy", function () {
                    return b.rebuildAll(a, !1, !0)
                })
            }, h.prototype.watchOurScope = function (a) {
                var b = this;
                return _.each(this.scopePropNames, function (c) {
                    var d;
                    return d = c + "Key", b[d] = "function" == typeof a[c] ? a[c]() : a[c], b.watch(a, c, d)
                })
            }, h.prototype.createChildScopesWindows = function (a) {
                var b, c;
                return null == a && (a = !0), this.isIconVisibleOnClick = !0, angular.isDefined(this.linked.attrs.isiconvisibleonclick) && (this.isIconVisibleOnClick = this.linked.scope.isIconVisibleOnClick), b = this.markerScope, c = angular.isUndefined(this.linked.scope.models), !c || void 0 !== b && void 0 !== b.markerModels && void 0 !== b.models ? null != this.gMap ? null != this.linked.scope.models ? (this.watchIdKey(this.linked.scope), a ? this.createAllNewWindows(this.linked.scope, !1) : this.pieceMealWindows(this.linked.scope, !1)) : (this.parentScope = b, this.watchIdKey(this.parentScope), a ? this.createAllNewWindows(b, !0, "markerModels", !1) : this.pieceMealWindows(b, !0, "markerModels", !1)) : void 0 : void this.$log.error("No models to create windows from! Need direct models or models derrived from markers!")
            }, h.prototype.watchIdKey = function (a) {
                var b = this;
                return this.setIdKey(a), a.$watch("idKey", function (c, d) {
                    return c !== d && null == c ? (b.idKey = c, b.rebuildAll(a, !0, !0)) : void 0
                })
            }, h.prototype.createAllNewWindows = function (a, b, c, d) {
                var e = this;
                return null == c && (c = "models"), null == d && (d = !1), this.models = a.models, this.firstTime && (this.watchModels(a), this.watchDestroy(a)), this.setContentKeys(a.models), _async.each(a.models, function (d) {
                    var f;
                    return f = b ? a[c][[d[e.idKey]]].gMarker : void 0, e.createWindow(d, f, e.gMap)
                }, function () {
                    return e.firstTime = !1
                })
            }, h.prototype.pieceMealWindows = function (a, b, c, d) {
                var e = this;
                return null == c && (c = "models"), null == d && (d = !0), this.models = a.models, null != a && null != a.models && a.models.length > 0 && this.windows.length > 0 ? this.figureOutState(this.idKey, a, this.windows, this.modelKeyComparison, function (b) {
                    var d;
                    return d = b, _async.each(d.removals, function (a) {
                        return null != a ? (null != a.destroy && a.destroy(), e.windows.remove(a.id)) : void 0
                    }, function () {
                        return _async.each(d.adds, function (b) {
                            var d;
                            return d = a[c][b[e.idKey]].gMarker, e.createWindow(b, d, e.gMap)
                        }, function () {
                        })
                    })
                }) : this.rebuildAll(this.scope, !0, !0)
            }, h.prototype.setContentKeys = function (a) {
                return a.length > 0 ? this.contentKeys = Object.keys(a[0]) : void 0
            }, h.prototype.createWindow = function (a, b, c) {
                var d, e, g, h, i = this;
                return e = this.linked.scope.$new(!1), this.setChildScope(e, a), e.$watch("model", function (a, b) {
                    return a !== b ? i.setChildScope(e, a) : void 0
                }, !0), g = {
                    html: function () {
                        return i.interpolateContent(i.linked.element.html(), a)
                    }
                }, h = this.createWindowOptions(b, e, g.html(), this.DEFAULTS), d = new f(a, e, h, this.isIconVisibleOnClick, c, b, g, !0, !0), null == a[this.idKey] ? void this.$log.error("Window model has no id to assign a child to. This is required for performance. Please assign id, or redirect id to a different key.") : (this.windows.put(a[this.idKey], d), d)
            }, h.prototype.setChildScope = function (a, b) {
                var c = this;
                return _.each(this.scopePropNames, function (d) {
                    var e, f;
                    return e = d + "Key", f = "self" === c[e] ? b : b[c[e]], f !== a[d] ? a[d] = f : void 0
                }), a.model = b
            }, h.prototype.interpolateContent = function (a, b) {
                var c, d, e, f, g, h;
                if (void 0 !== this.contentKeys && 0 !== this.contentKeys.length) {
                    for (c = this.$interpolate(a), d = {}, h = this.contentKeys, f = 0, g = h.length; g > f; f++)e = h[f], d[e] = b[e];
                    return c(d)
                }
            }, h
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("ILabel", ["BaseObject", "Logger", function (b, d) {
        var e;
        return e = function (b) {
            function e(b) {
                this.link = a(this.link, this);
                var c;
                c = this, this.restrict = "ECMA", this.replace = !0, this.template = void 0, this.require = void 0, this.transclude = !0, this.priority = -100, this.scope = {
                    labelContent: "=content",
                    labelAnchor: "@anchor",
                    labelClass: "@class",
                    labelStyle: "=style"
                }, this.$log = d, this.$timeout = b
            }

            return c(e, b), e.prototype.link = function () {
                throw new Exception("Not Implemented!!")
            }, e
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("IMarker", ["Logger", "BaseObject", "$q", function (b, d) {
        var e;
        return e = function (d) {
            function e(c) {
                this.link = a(this.link, this);
                var d;
                d = this, this.$log = b, this.$timeout = c, this.restrict = "ECMA", this.require = "^googleMap", this.priority = -1, this.transclude = !0, this.replace = !0, this.scope = {
                    coords: "=coords",
                    icon: "=icon",
                    click: "&click",
                    options: "=options",
                    events: "=events",
                    fit: "=fit"
                }
            }

            return c(e, d), e.prototype.link = function (a, b, c, d) {
                if (!d)throw new Error("No Map Control! Marker Directive Must be inside the map!")
            }, e.prototype.mapPromise = function (a, b) {
                var c;
                return c = b.getScope(), c.deferred.promise.then(function (b) {
                    return a.map = b
                }), c.deferred.promise
            }, e
        }(d)
    }])
}.call(this), function () {
    var a = {}.hasOwnProperty, b = function (b, c) {
        function d() {
            this.constructor = b
        }

        for (var e in c)a.call(c, e) && (b[e] = c[e]);
        return d.prototype = c.prototype, b.prototype = new d, b.__super__ = c.prototype, b
    };
    angular.module("google-maps.directives.api").factory("IPolyline", ["GmapUtil", "BaseObject", "Logger", function (a, c, d) {
        var e;
        return e = function (c) {
            function e() {
                var a;
                a = this
            }

            return b(e, c), e.include(a), e.prototype.restrict = "ECA", e.prototype.replace = !0, e.prototype.require = "^googleMap", e.prototype.scope = {
                path: "=",
                stroke: "=",
                clickable: "=",
                draggable: "=",
                editable: "=",
                geodesic: "=",
                icons: "=",
                visible: "=",
                "static": "=",
                fit: "="
            }, e.prototype.DEFAULTS = {}, e.prototype.$log = d, e
        }(c)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("IWindow", ["BaseObject", "ChildEvents", "Logger", function (b, d, e) {
        var f;
        return f = function (b) {
            function f(b, c, d, f) {
                var g;
                this.$timeout = b, this.$compile = c, this.$http = d, this.$templateCache = f, this.link = a(this.link, this), g = this, this.restrict = "ECMA", this.template = void 0, this.transclude = !0, this.priority = -100, this.require = void 0, this.replace = !0, this.scope = {
                    coords: "=coords",
                    show: "=show",
                    templateUrl: "=templateurl",
                    templateParameter: "=templateparameter",
                    isIconVisibleOnClick: "=isiconvisibleonclick",
                    closeClick: "&closeclick",
                    options: "=options"
                }, this.$log = e
            }

            return c(f, b), f.include(d), f.prototype.link = function () {
                throw new Exception("Not Implemented!!")
            }, f
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("Map", ["$timeout", "$q", "Logger", "GmapUtil", "BaseObject", "ExtendGWin", "CtrlHandle", function (b, d, e, f, g, h, i) {
        "use strict";
        var j, k, l;
        return j = e, k = {mapTypeId: google.maps.MapTypeId.ROADMAP}, l = function (b) {
            function d() {
                this.link = a(this.link, this);
                var b;
                b = this
            }

            return c(d, b), d.include(f), d.prototype.restrict = "ECMA", d.prototype.transclude = !0, d.prototype.replace = !1, d.prototype.template = '<div class="angular-google-map"><div class="angular-google-map-container"></div><div ng-transclude style="display: none"></div></div>', d.prototype.scope = {
                center: "=center",
                zoom: "=zoom",
                dragging: "=dragging",
                control: "=",
                windows: "=windows",
                options: "=options",
                events: "=events",
                styles: "=styles",
                bounds: "=bounds"
            }, d.prototype.controller = ["$scope", function (a) {
                var b;
                return b = i.handle(a), a.ctrlType = "Map", a.deferred.promise.then(function () {
                    return h.init()
                }), _.extend(b, {
                    getMap: function () {
                        return a.map
                    }
                })
            }], d.prototype.link = function (a, b, c) {
                var d, e, f, g, h, i, l, m, n = this;
                if (!this.validateCoords(a.center))return void j.error("angular-google-maps: could not find a valid center property");
                if (!angular.isDefined(a.zoom))return void j.error("angular-google-maps: map zoom property not set");
                if (e = angular.element(b), e.addClass("angular-google-map"), h = {options: {}}, c.options && (h.options = a.options), c.styles && (h.styles = a.styles), c.type && (l = c.type.toUpperCase(), google.maps.MapTypeId.hasOwnProperty(l) ? h.mapTypeId = google.maps.MapTypeId[c.type.toUpperCase()] : j.error('angular-google-maps: invalid map type "' + c.type + '"')), m = new google.maps.Map(e.find("div")[1], angular.extend({}, k, h, {
                        center: this.getCoords(a.center),
                        draggable: this.isTrue(c.draggable),
                        zoom: a.zoom,
                        bounds: a.bounds
                    })), d = !1, m ? a.deferred.resolve(m) : google.maps.event.addListener(m, "tilesloaded ", function (b) {
                        return a.deferred.resolve(b)
                    }), google.maps.event.addListener(m, "dragstart", function () {
                        return d = !0, _.defer(function () {
                            return a.$apply(function (a) {
                                return null != a.dragging ? a.dragging = d : void 0
                            })
                        })
                    }), google.maps.event.addListener(m, "dragend", function () {
                        return d = !1, _.defer(function () {
                            return a.$apply(function (a) {
                                return null != a.dragging ? a.dragging = d : void 0
                            })
                        })
                    }), google.maps.event.addListener(m, "drag", function () {
                        var b;
                        return b = m.center, _.defer(function () {
                            return a.$apply(function (a) {
                                return angular.isDefined(a.center.type) ? (a.center.coordinates[1] = b.lat(), a.center.coordinates[0] = b.lng()) : (a.center.latitude = b.lat(), a.center.longitude = b.lng())
                            })
                        })
                    }), google.maps.event.addListener(m, "zoom_changed", function () {
                        return a.zoom !== m.zoom ? _.defer(function () {
                            return a.$apply(function (a) {
                                return a.zoom = m.zoom
                            })
                        }) : void 0
                    }), i = !1, google.maps.event.addListener(m, "center_changed", function () {
                        var b;
                        return b = m.center, i ? void 0 : _.defer(function () {
                            return a.$apply(function (a) {
                                if (!m.dragging)if (angular.isDefined(a.center.type)) {
                                    if (a.center.coordinates[1] !== b.lat() && (a.center.coordinates[1] = b.lat()), a.center.coordinates[0] !== b.lng())return a.center.coordinates[0] = b.lng()
                                } else if (a.center.latitude !== b.lat() && (a.center.latitude = b.lat()), a.center.longitude !== b.lng())return a.center.longitude = b.lng()
                            })
                        })
                    }), google.maps.event.addListener(m, "idle", function () {
                        var b, c, d;
                        return b = m.getBounds(), c = b.getNorthEast(), d = b.getSouthWest(), _.defer(function () {
                            return a.$apply(function (a) {
                                return null !== a.bounds && void 0 !== a.bounds && void 0 !== a.bounds ? (a.bounds.northeast = {
                                    latitude: c.lat(),
                                    longitude: c.lng()
                                }, a.bounds.southwest = {latitude: d.lat(), longitude: d.lng()}) : void 0
                            })
                        })
                    }), angular.isDefined(a.events) && null !== a.events && angular.isObject(a.events)) {
                    g = function (b) {
                        return function () {
                            return a.events[b].apply(a, [m, b, arguments])
                        }
                    };
                    for (f in a.events)a.events.hasOwnProperty(f) && angular.isFunction(a.events[f]) && google.maps.event.addListener(m, f, g(f))
                }
                return a.map = m, null != c.control && null != a.control && (a.control.refresh = function (a) {
                    var b;
                    if (null != m)return google.maps.event.trigger(m, "resize"), null != (null != a ? a.latitude : void 0) && null != (null != a ? a.latitude : void 0) ? (b = n.getCoords(a), n.isTrue(c.pan) ? m.panTo(b) : m.setCenter(b)) : void 0
                }, a.control.getGMap = function () {
                    return m
                }), a.$watch("center", function (b) {
                    var e;
                    return e = n.getCoords(b), e.lat() !== m.center.lat() || e.lng() !== m.center.lng() ? (i = !0, d || (n.validateCoords(b) || j.error("Invalid center for newValue: " + JSON.stringify(b)), n.isTrue(c.pan) && a.zoom === m.zoom ? m.panTo(e) : m.setCenter(e)), i = !1) : void 0
                }, !0), a.$watch("zoom", function (a) {
                    return a !== m.zoom ? _.defer(function () {
                        return m.setZoom(a)
                    }) : void 0
                }), a.$watch("bounds", function (a, b) {
                    var c, d, e;
                    if (a !== b)return null == a.northeast.latitude || null == a.northeast.longitude || null == a.southwest.latitude || null == a.southwest.longitude ? void j.error("Invalid map bounds for new value: " + JSON.stringify(a)) : (d = new google.maps.LatLng(a.northeast.latitude, a.northeast.longitude), e = new google.maps.LatLng(a.southwest.latitude, a.southwest.longitude), c = new google.maps.LatLngBounds(e, d), m.fitBounds(c))
                }), a.$watch("options", function (a, b) {
                    return _.isEqual(a, b) || (h.options = a, null == m) ? void 0 : m.setOptions(h)
                }, !0), a.$watch("styles", function (a, b) {
                    return _.isEqual(a, b) || (h.styles = a, null == m) ? void 0 : m.setOptions(h)
                }, !0)
            }, d
        }(g)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("Marker", ["IMarker", "MarkerParentModel", "MarkerManager", "CtrlHandle", function (b, d, e, f) {
        var g;
        return g = function (b) {
            function g(b) {
                this.link = a(this.link, this), g.__super__.constructor.call(this, b), this.template = '<span class="angular-google-map-marker" ng-transclude></span>', this.$log.info(this)
            }

            return c(g, b), g.prototype.controller = ["$scope", "$element", function (a, b) {
                return a.ctrlType = "Marker", f.handle(a, b)
            }], g.prototype.link = function (a, b, c, f) {
                var h, i = this;
                return g.__super__.link.call(this, a, b, c, f), a.fit && (h = !0), this.mapPromise(a, f).then(function (f) {
                    return i.gMarkerManager || (i.gMarkerManager = new e(f)), new d(a, b, c, f, i.$timeout, i.gMarkerManager, h), a.deferred.resolve()
                })
            }, g
        }.call(this, b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("Markers", ["IMarker", "MarkersParentModel", "CtrlHandle", function (b, d, e) {
        var f;
        return f = function (b) {
            function f(b) {
                this.link = a(this.link, this);
                var c;
                f.__super__.constructor.call(this, b), this.template = '<span class="angular-google-map-markers" ng-transclude></span>', this.scope = _.extend(this.scope || {}, {
                    idKey: "=idkey",
                    doRebuildAll: "=dorebuildall",
                    models: "=models",
                    doCluster: "=docluster",
                    clusterOptions: "=clusteroptions",
                    clusterEvents: "=clusterevents",
                    labelContent: "=labelcontent",
                    labelAnchor: "@labelanchor",
                    labelClass: "@labelclass"
                }), this.$timeout = b, c = this, this.$log.info(this)
            }

            return c(f, b), f.prototype.controller = ["$scope", "$element", function (a, b) {
                return a.ctrlType = "Markers", e.handle(a, b)
            }], f.prototype.link = function (a, b, c, e) {
                var f = this;
                return this.mapPromise(a, e).then(function (e) {
                    return new d(a, b, c, e, f.$timeout), a.deferred.resolve()
                })
            }, f
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("Polyline", ["IPolyline", "$timeout", "array-sync", "PolylineChildModel", function (b, d, e, f) {
        var g, h;
        return g = function (b) {
            function d() {
                return this.link = a(this.link, this), h = d.__super__.constructor.apply(this, arguments)
            }

            return c(d, b), d.prototype.link = function (a, b, c, d) {
                var e = this;
                return angular.isUndefined(a.path) || null === a.path || !this.validatePath(a.path) ? void this.$log.error("polyline: no valid path attribute found") : d.getScope().deferred.promise.then(function (b) {
                    return new f(a, c, b, e.DEFAULTS)
                })
            }, d
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("Polylines", ["IPolyline", "$timeout", "array-sync", "PolylinesParentModel", function (b, d, e, f) {
        var g;
        return g = function (b) {
            function d() {
                this.link = a(this.link, this), d.__super__.constructor.call(this), this.scope.idKey = "=idkey", this.scope.models = "=models", this.$log.info(this)
            }

            return c(d, b), d.prototype.link = function (a, b, c, d) {
                var e = this;
                return angular.isUndefined(a.path) || null === a.path ? void this.$log.error("polylines: no valid path attribute found") : a.models ? d.getScope().deferred.promise.then(function (d) {
                    return new f(a, b, c, d, e.DEFAULTS)
                }) : void this.$log.error("polylines: no models found to create from")
            }, d
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("Window", ["IWindow", "GmapUtil", "WindowChildModel", "$q", function (b, d, e) {
        var f;
        return f = function (b) {
            function f(b, c, d, e) {
                this.init = a(this.init, this), this.link = a(this.link, this);
                var g;
                f.__super__.constructor.call(this, b, c, d, e), g = this, this.require = ["^googleMap", "^?marker"], this.template = '<span class="angular-google-maps-window" ng-transclude></span>', this.$log.info(g)
            }

            return c(f, b), f.include(d), f.prototype.link = function (a, b, c, d) {
                var e, f = this;
                return e = d[0].getScope(), e.deferred.promise.then(function (e) {
                    var g, h, i;
                    return g = !0, angular.isDefined(c.isiconvisibleonclick) && (g = a.isIconVisibleOnClick), (h = d.length > 1 && null != d[1] ? d[1] : void 0) ? (i = h.getScope(), i.deferred.promise.then(function () {
                        return f.init(a, b, g, e, i)
                    })) : void f.init(a, b, g, e)
                })
            }, f.prototype.init = function (a, b, c, d, f) {
                var g, h, i, j, k, l = this;
                return g = null != a.options ? a.options : {}, i = null != a && this.validateCoords(a.coords), null != f && (h = f.gMarker, f.$watch("coords", function (a, b) {
                    return null == f.gMarker || k.markerCtrl || (k.markerCtrl = f.gMarker, k.handleClick(!0)), l.validateCoords(a) ? angular.equals(a, b) ? void 0 : k.getLatestPosition(l.getCoords(a)) : k.hideWindow()
                }, !0)), j = i ? this.createWindowOptions(h, a, b.html(), g) : g, null != d && (k = new e({}, a, j, c, d, h, b)), a.$on("$destroy", function () {
                    return null != k ? k.destroy() : void 0
                }), null != this.onChildCreation && null != k ? this.onChildCreation(k) : void 0
            }, f
        }(b)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps.directives.api").factory("Windows", ["IWindow", "WindowsParentModel", function (b, d) {
        var e;
        return e = function (b) {
            function e(b, c, d, f, g) {
                this.link = a(this.link, this);
                var h;
                e.__super__.constructor.call(this, b, c, d, f), h = this, this.$interpolate = g, this.require = ["^googleMap", "^?markers"], this.template = '<span class="angular-google-maps-windows" ng-transclude></span>', this.scope.idKey = "=idkey", this.scope.doRebuildAll = "=dorebuildall", this.scope.models = "=models", this.$log.info(this)
            }

            return c(e, b), e.prototype.link = function (a, b, c, e) {
                return new d(a, b, c, e, this.$timeout, this.$compile, this.$http, this.$templateCache, this.$interpolate)
            }, e
        }(b)
    }])
}.call(this), function () {
    angular.module("google-maps").directive("googleMap", ["Map", function (a) {
        return new a
    }])
}.call(this), function () {
    angular.module("google-maps").directive("marker", ["$timeout", "Marker", function (a, b) {
        return new b(a)
    }])
}.call(this), function () {
    angular.module("google-maps").directive("markers", ["$timeout", "Markers", function (a, b) {
        return new b(a)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    }, b = {}.hasOwnProperty, c = function (a, c) {
        function d() {
            this.constructor = a
        }

        for (var e in c)b.call(c, e) && (a[e] = c[e]);
        return d.prototype = c.prototype, a.prototype = new d, a.__super__ = c.prototype, a
    };
    angular.module("google-maps").directive("markerLabel", ["$timeout", "ILabel", "MarkerLabelChildModel", "GmapUtil", "nggmap-PropertyAction", function (b, d, e, f, g) {
        var h;
        return new (h = function (b) {
            function d(b) {
                this.init = a(this.init, this), this.link = a(this.link, this);
                var c;
                d.__super__.constructor.call(this, b), c = this, this.require = "^marker", this.template = '<span class="angular-google-maps-marker-label" ng-transclude></span>', this.$log.info(this)
            }

            return c(d, b), d.prototype.link = function (a, b, c, d) {
                var e, f = this;
                return e = d.getScope(), e ? e.deferred.promise.then(function () {
                    return f.init(e, a)
                }) : void 0
            }, d.prototype.init = function (a, b) {
                var c, d, f;
                return f = null, c = function () {
                    return f ? void 0 : f = new e(a.gMarker, b, a.map)
                }, d = !0, a.$watch("gMarker", function () {
                    var e, h, i, j;
                    return null != a.gMarker && (i = new g(function () {
                        return c(), b.labelContent && null != f ? f.setOption("labelContent", b.labelContent) : void 0
                    }, d), e = new g(function () {
                        return c(), null != f ? f.setOption("labelAnchor", b.labelAnchor) : void 0
                    }, d), h = new g(function () {
                        return c(), null != f ? f.setOption("labelClass", b.labelClass) : void 0
                    }, d), j = new g(function () {
                        return c(), null != f ? f.setOption("labelStyle", b.labelStyle) : void 0
                    }, d), b.$watch("labelContent", i.sic), b.$watch("labelAnchor", e.sic), b.$watch("labelClass", h.sic), b.$watch("labelStyle", j.sic), d = !1), b.$on("$destroy", function () {
                        return null != f ? f.destroy() : void 0
                    })
                })
            }, d
        }(d))(b)
    }])
}.call(this), function () {
    angular.module("google-maps").directive("polygon", ["$log", "$timeout", "array-sync", "GmapUtil", function (a, b, c, d) {
        var e, f;
        return f = function (a) {
            return angular.isDefined(a) && null !== a && a === !0 || "1" === a || "y" === a || "true" === a
        }, e = {}, {
            restrict: "ECA",
            replace: !0,
            require: "^googleMap",
            scope: {
                path: "=path",
                stroke: "=stroke",
                clickable: "=",
                draggable: "=",
                editable: "=",
                geodesic: "=",
                fill: "=",
                icons: "=icons",
                visible: "=",
                "static": "=",
                events: "=",
                zIndex: "=zindex",
                fit: "="
            },
            link: function (b, f, g, h) {
                return angular.isUndefined(b.path) || null === b.path || !d.validatePath(b.path) ? void a.error("polygon: no valid path attribute found") : h.getScope().deferred.promise.then(function (a) {
                    var f, g, h, i, j, k;
                    if (g = function (c) {
                            var d;
                            return d = angular.extend({}, e, {
                                map: a,
                                path: c,
                                strokeColor: b.stroke && b.stroke.color,
                                strokeOpacity: b.stroke && b.stroke.opacity,
                                strokeWeight: b.stroke && b.stroke.weight,
                                fillColor: b.fill && b.fill.color,
                                fillOpacity: b.fill && b.fill.opacity
                            }), angular.forEach({
                                clickable: !0,
                                draggable: !1,
                                editable: !1,
                                geodesic: !1,
                                visible: !0,
                                "static": !1,
                                fit: !1,
                                zIndex: 0
                            }, function (a, c) {
                                return d[c] = angular.isUndefined(b[c]) || null === b[c] ? a : b[c]
                            }), d["static"] && (d.editable = !1), d
                        }, j = d.convertPathPoints(b.path), k = new google.maps.Polygon(g(j)), b.fit && d.extendMapBounds(a, j), !b["static"] && angular.isDefined(b.editable) && b.$watch("editable", function (a, b) {
                            return a !== b ? k.setEditable(a) : void 0
                        }), angular.isDefined(b.draggable) && b.$watch("draggable", function (a, b) {
                            return a !== b ? k.setDraggable(a) : void 0
                        }), angular.isDefined(b.visible) && b.$watch("visible", function (a, b) {
                            return a !== b ? k.setVisible(a) : void 0
                        }), angular.isDefined(b.geodesic) && b.$watch("geodesic", function (a, b) {
                            return a !== b ? k.setOptions(g(k.getPath())) : void 0
                        }), angular.isDefined(b.stroke) && angular.isDefined(b.stroke.opacity) && b.$watch("stroke.opacity", function () {
                            return k.setOptions(g(k.getPath()))
                        }), angular.isDefined(b.stroke) && angular.isDefined(b.stroke.weight) && b.$watch("stroke.weight", function (a, b) {
                            return a !== b ? k.setOptions(g(k.getPath())) : void 0
                        }), angular.isDefined(b.stroke) && angular.isDefined(b.stroke.color) && b.$watch("stroke.color", function (a, b) {
                            return a !== b ? k.setOptions(g(k.getPath())) : void 0
                        }), angular.isDefined(b.fill) && angular.isDefined(b.fill.color) && b.$watch("fill.color", function (a, b) {
                            return a !== b ? k.setOptions(g(k.getPath())) : void 0
                        }), angular.isDefined(b.fill) && angular.isDefined(b.fill.opacity) && b.$watch("fill.opacity", function (a, b) {
                            return a !== b ? k.setOptions(g(k.getPath())) : void 0
                        }), angular.isDefined(b.zIndex) && b.$watch("zIndex", function (a, b) {
                            return a !== b ? k.setOptions(g(k.getPath())) : void 0
                        }), angular.isDefined(b.events) && null !== b.events && angular.isObject(b.events)) {
                        i = function (a) {
                            return function () {
                                return b.events[a].apply(b, [k, a, arguments])
                            }
                        };
                        for (h in b.events)b.events.hasOwnProperty(h) && angular.isFunction(b.events[h]) && k.addListener(h, i(h))
                    }
                    return f = c(k.getPath(), b, "path", function (c) {
                        return b.fit ? d.extendMapBounds(a, c) : void 0
                    }), b.$on("$destroy", function () {
                        return k.setMap(null), f ? (f(), f = null) : void 0
                    })
                })
            }
        }
    }])
}.call(this), function () {
    angular.module("google-maps").directive("circle", ["$log", "$timeout", "GmapUtil", "EventsHelper", function (a, b, c, d) {
        "use strict";
        var e;
        return e = {}, {
            restrict: "ECA",
            replace: !0,
            require: "^googleMap",
            scope: {
                center: "=center",
                radius: "=radius",
                stroke: "=stroke",
                fill: "=fill",
                clickable: "=",
                draggable: "=",
                editable: "=",
                geodesic: "=",
                icons: "=icons",
                visible: "=",
                events: "="
            },
            link: function (f, g, h, i) {
                return i.getScope().deferred.promise.then(function (g) {
                    var h, i;
                    return h = function () {
                        var b;
                        return c.validateCoords(f.center) ? (b = angular.extend({}, e, {
                            map: g,
                            center: c.getCoords(f.center),
                            radius: f.radius,
                            strokeColor: f.stroke && f.stroke.color,
                            strokeOpacity: f.stroke && f.stroke.opacity,
                            strokeWeight: f.stroke && f.stroke.weight,
                            fillColor: f.fill && f.fill.color,
                            fillOpacity: f.fill && f.fill.opacity
                        }), angular.forEach({
                            clickable: !0,
                            draggable: !1,
                            editable: !1,
                            geodesic: !1,
                            visible: !0
                        }, function (a, c) {
                            return b[c] = angular.isUndefined(f[c]) || null === f[c] ? a : f[c]
                        }), b) : void a.error("circle: no valid center attribute found")
                    }, i = new google.maps.Circle(h()), f.$watchCollection("center", function (a, b) {
                        return a !== b ? i.setOptions(h()) : void 0
                    }), f.$watchCollection("stroke", function (a, b) {
                        return a !== b ? i.setOptions(h()) : void 0
                    }), f.$watchCollection("fill", function (a, b) {
                        return a !== b ? i.setOptions(h()) : void 0
                    }), f.$watch("radius", function (a, b) {
                        return a !== b ? i.setOptions(h()) : void 0
                    }), f.$watch("clickable", function (a, b) {
                        return a !== b ? i.setOptions(h()) : void 0
                    }), f.$watch("editable", function (a, b) {
                        return a !== b ? i.setOptions(h()) : void 0
                    }), f.$watch("draggable", function (a, b) {
                        return a !== b ? i.setOptions(h()) : void 0
                    }), f.$watch("visible", function (a, b) {
                        return a !== b ? i.setOptions(h()) : void 0
                    }), f.$watch("geodesic", function (a, b) {
                        return a !== b ? i.setOptions(h()) : void 0
                    }), d.setEvents(i, f, f), google.maps.event.addListener(i, "radius_changed", function () {
                        return f.radius = i.getRadius(), b(function () {
                            return f.$apply()
                        })
                    }), google.maps.event.addListener(i, "center_changed", function () {
                        return angular.isDefined(f.center.type) ? (f.center.coordinates[1] = i.getCenter().lat(), f.center.coordinates[0] = i.getCenter().lng()) : (f.center.latitude = i.getCenter().lat(), f.center.longitude = i.getCenter().lng()), b(function () {
                            return f.$apply()
                        })
                    }), f.$on("$destroy", function () {
                        return i.setMap(null)
                    })
                })
            }
        }
    }])
}.call(this), function () {
    angular.module("google-maps").directive("polyline", ["Polyline", function (a) {
        return new a
    }])
}.call(this), function () {
    angular.module("google-maps").directive("polylines", ["Polylines", function (a) {
        return new a
    }])
}.call(this), function () {
    angular.module("google-maps").directive("rectangle", ["$log", "$timeout", function (a) {
        var b, c, d, e, f;
        return f = function (a) {
            return angular.isUndefined(a.sw.latitude) || angular.isUndefined(a.sw.longitude) || angular.isUndefined(a.ne.latitude) || angular.isUndefined(a.ne.longitude) ? !1 : !0
        }, c = function (a) {
            var b;
            return b = new google.maps.LatLngBounds(new google.maps.LatLng(a.sw.latitude, a.sw.longitude), new google.maps.LatLng(a.ne.latitude, a.ne.longitude))
        }, d = function (a, b) {
            return a.fitBounds(b)
        }, e = function (a) {
            return angular.isDefined(a) && null !== a && a === !0 || "1" === a || "y" === a || "true" === a
        }, b = {}, {
            restrict: "ECA",
            require: "^googleMap",
            replace: !0,
            scope: {bounds: "=", stroke: "=", clickable: "=", draggable: "=", editable: "=", fill: "=", visible: "="},
            link: function (g, h, i, j) {
                return angular.isUndefined(g.bounds) || null === g.bounds || angular.isUndefined(g.bounds.sw) || null === g.bounds.sw || angular.isUndefined(g.bounds.ne) || null === g.bounds.ne || !f(g.bounds) ? void a.error("rectangle: no valid bound attribute found") : j.getScope().deferred.promise.then(function (f) {
                    var h, j, k, l;
                    return h = function (a) {
                        var c;
                        return c = angular.extend({}, b, {
                            map: f,
                            bounds: a,
                            strokeColor: g.stroke && g.stroke.color,
                            strokeOpacity: g.stroke && g.stroke.opacity,
                            strokeWeight: g.stroke && g.stroke.weight,
                            fillColor: g.fill && g.fill.color,
                            fillOpacity: g.fill && g.fill.opacity
                        }), angular.forEach({clickable: !0, draggable: !1, editable: !1, visible: !0}, function (a, b) {
                            return c[b] = angular.isUndefined(g[b]) || null === g[b] ? a : g[b]
                        }), c
                    }, k = new google.maps.Rectangle(h(c(g.bounds))), e(i.fit) && d(f, bounds), j = !1, google.maps.event.addListener(k, "mousedown", function () {
                        google.maps.event.addListener(k, "mousemove", function () {
                            return j = !0, _.defer(function () {
                                return g.$apply(function (a) {
                                    return null != a.dragging ? a.dragging = j : void 0
                                })
                            })
                        }), google.maps.event.addListener(k, "mouseup", function () {
                            return google.maps.event.clearListeners(k, "mousemove"), google.maps.event.clearListeners(k, "mouseup"), j = !1, _.defer(function () {
                                return g.$apply(function (a) {
                                    return null != a.dragging ? a.dragging = j : void 0
                                })
                            })
                        })
                    }), l = !1, google.maps.event.addListener(k, "bounds_changed", function () {
                        var a, b, c;
                        return a = k.getBounds(), b = a.getNorthEast(), c = a.getSouthWest(), l ? void 0 : _.defer(function () {
                            return g.$apply(function (a) {
                                k.dragging || null !== a.bounds && void 0 !== a.bounds && void 0 !== a.bounds && (a.bounds.ne = {
                                    latitude: b.lat(),
                                    longitude: b.lng()
                                }, a.bounds.sw = {latitude: c.lat(), longitude: c.lng()})
                            })
                        })
                    }), g.$watch("bounds", function (b, c) {
                        var d;
                        if (!_.isEqual(b, c))return l = !0, j || ((null == b.sw.latitude || null == b.sw.longitude || null == b.ne.latitude || null == b.ne.longitude) && a.error("Invalid bounds for newValue: " + JSON.stringify(b)), d = new google.maps.LatLngBounds(new google.maps.LatLng(b.sw.latitude, b.sw.longitude), new google.maps.LatLng(b.ne.latitude, b.ne.longitude)), k.setBounds(d)), l = !1
                    }, !0), angular.isDefined(g.editable) && g.$watch("editable", function (a) {
                        return k.setEditable(a)
                    }), angular.isDefined(g.draggable) && g.$watch("draggable", function (a) {
                        return k.setDraggable(a)
                    }), angular.isDefined(g.visible) && g.$watch("visible", function (a) {
                        return k.setVisible(a)
                    }), angular.isDefined(g.stroke) && (angular.isDefined(g.stroke.color) && g.$watch("stroke.color", function () {
                        return k.setOptions(h(k.getBounds()))
                    }), angular.isDefined(g.stroke.weight) && g.$watch("stroke.weight", function () {
                        return k.setOptions(h(k.getBounds()))
                    }), angular.isDefined(g.stroke.opacity) && g.$watch("stroke.opacity", function () {
                        return k.setOptions(h(k.getBounds()))
                    })), angular.isDefined(g.fill) && (angular.isDefined(g.fill.color) && g.$watch("fill.color", function () {
                        return k.setOptions(h(k.getBounds()))
                    }), angular.isDefined(g.fill.opacity) && g.$watch("fill.opacity", function () {
                        return k.setOptions(h(k.getBounds()))
                    })), g.$on("$destroy", function () {
                        return k.setMap(null)
                    })
                })
            }
        }
    }])
}.call(this), function () {
    angular.module("google-maps").directive("window", ["$timeout", "$compile", "$http", "$templateCache", "Window", function (a, b, c, d, e) {
        return new e(a, b, c, d)
    }])
}.call(this), function () {
    angular.module("google-maps").directive("windows", ["$timeout", "$compile", "$http", "$templateCache", "$interpolate", "Windows", function (a, b, c, d, e, f) {
        return new f(a, b, c, d, e)
    }])
}.call(this), function () {
    var a = function (a, b) {
        return function () {
            return a.apply(b, arguments)
        }
    };
    angular.module("google-maps").directive("layer", ["$timeout", "Logger", "LayerParentModel", function (b, c, d) {
        var e;
        return new (e = function () {
            function b() {
                this.link = a(this.link, this), this.$log = c, this.restrict = "ECMA", this.require = "^googleMap", this.priority = -1, this.transclude = !0, this.template = '<span class="angular-google-map-layer" ng-transclude></span>', this.replace = !0, this.scope = {
                    show: "=show",
                    type: "=type",
                    namespace: "=namespace",
                    options: "=options",
                    onCreated: "&oncreated"
                }
            }

            return b.prototype.link = function (a, b, c, e) {
                return e.getScope().deferred.promise.then(function (e) {
                    return null != a.onCreated ? new d(a, b, c, e, a.onCreated) : new d(a, b, c, e)
                })
            }, b
        }())
    }])
}.call(this), InfoBox.prototype = new google.maps.OverlayView, InfoBox.prototype.createInfoBoxDiv_ = function () {
    var a, b, c, d = this, e = function (a) {
        a.cancelBubble = !0, a.stopPropagation && a.stopPropagation()
    }, f = function (a) {
        a.returnValue = !1, a.preventDefault && a.preventDefault(), d.enableEventPropagation_ || e(a)
    };
    if (!this.div_) {
        if (this.div_ = document.createElement("div"), this.setBoxStyle_(), "undefined" == typeof this.content_.nodeType ? this.div_.innerHTML = this.getCloseBoxImg_() + this.content_ : (this.div_.innerHTML = this.getCloseBoxImg_(), this.div_.appendChild(this.content_)), this.getPanes()[this.pane_].appendChild(this.div_), this.addClickHandler_(), this.div_.style.width ? this.fixedWidthSet_ = !0 : 0 !== this.maxWidth_ && this.div_.offsetWidth > this.maxWidth_ ? (this.div_.style.width = this.maxWidth_, this.div_.style.overflow = "auto", this.fixedWidthSet_ = !0) : (c = this.getBoxWidths_(), this.div_.style.width = this.div_.offsetWidth - c.left - c.right + "px", this.fixedWidthSet_ = !1), this.panBox_(this.disableAutoPan_), !this.enableEventPropagation_) {
            for (this.eventListeners_ = [], b = ["mousedown", "mouseover", "mouseout", "mouseup", "click", "dblclick", "touchstart", "touchend", "touchmove"], a = 0; a < b.length; a++)this.eventListeners_.push(google.maps.event.addDomListener(this.div_, b[a], e));
            this.eventListeners_.push(google.maps.event.addDomListener(this.div_, "mouseover", function () {
                this.style.cursor = "default"
            }))
        }
        this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", f), google.maps.event.trigger(this, "domready")
    }
}, InfoBox.prototype.getCloseBoxImg_ = function () {
    var a = "";
    return "" !== this.closeBoxURL_ && (a = "<img", a += " src='" + this.closeBoxURL_ + "'", a += " align=right", a += " style='", a += " position: relative;", a += " cursor: pointer;", a += " margin: " + this.closeBoxMargin_ + ";", a += "'>"), a
}, InfoBox.prototype.addClickHandler_ = function () {
    var a;
    "" !== this.closeBoxURL_ ? (a = this.div_.firstChild, this.closeListener_ = google.maps.event.addDomListener(a, "click", this.getCloseClickHandler_())) : this.closeListener_ = null
}, InfoBox.prototype.getCloseClickHandler_ = function () {
    var a = this;
    return function (b) {
        b.cancelBubble = !0, b.stopPropagation && b.stopPropagation(), google.maps.event.trigger(a, "closeclick"), a.close()
    }
}, InfoBox.prototype.panBox_ = function (a) {
    var b, c, d = 0, e = 0;
    if (!a && (b = this.getMap(), b instanceof google.maps.Map)) {
        b.getBounds().contains(this.position_) || b.setCenter(this.position_), c = b.getBounds();
        var f = b.getDiv(), g = f.offsetWidth, h = f.offsetHeight, i = this.pixelOffset_.width, j = this.pixelOffset_.height, k = this.div_.offsetWidth, l = this.div_.offsetHeight, m = this.infoBoxClearance_.width, n = this.infoBoxClearance_.height, o = this.getProjection().fromLatLngToContainerPixel(this.position_);
        if (o.x < -i + m ? d = o.x + i - m : o.x + k + i + m > g && (d = o.x + k + i + m - g), this.alignBottom_ ? o.y < -j + n + l ? e = o.y + j - n - l : o.y + j + n > h && (e = o.y + j + n - h) : o.y < -j + n ? e = o.y + j - n : o.y + l + j + n > h && (e = o.y + l + j + n - h), 0 !== d || 0 !== e) {
            {
                b.getCenter()
            }
            b.panBy(d, e)
        }
    }
}, InfoBox.prototype.setBoxStyle_ = function () {
    var a, b;
    if (this.div_) {
        this.div_.className = this.boxClass_, this.div_.style.cssText = "", b = this.boxStyle_;
        for (a in b)b.hasOwnProperty(a) && (this.div_.style[a] = b[a]);
        "undefined" != typeof this.div_.style.opacity && "" !== this.div_.style.opacity && (this.div_.style.filter = "alpha(opacity=" + 100 * this.div_.style.opacity + ")"), this.div_.style.position = "absolute", this.div_.style.visibility = "hidden", null !== this.zIndex_ && (this.div_.style.zIndex = this.zIndex_)
    }
}, InfoBox.prototype.getBoxWidths_ = function () {
    var a, b = {top: 0, bottom: 0, left: 0, right: 0}, c = this.div_;
    return document.defaultView && document.defaultView.getComputedStyle ? (a = c.ownerDocument.defaultView.getComputedStyle(c, ""), a && (b.top = parseInt(a.borderTopWidth, 10) || 0, b.bottom = parseInt(a.borderBottomWidth, 10) || 0, b.left = parseInt(a.borderLeftWidth, 10) || 0, b.right = parseInt(a.borderRightWidth, 10) || 0)) : document.documentElement.currentStyle && c.currentStyle && (b.top = parseInt(c.currentStyle.borderTopWidth, 10) || 0, b.bottom = parseInt(c.currentStyle.borderBottomWidth, 10) || 0, b.left = parseInt(c.currentStyle.borderLeftWidth, 10) || 0, b.right = parseInt(c.currentStyle.borderRightWidth, 10) || 0), b
}, InfoBox.prototype.onRemove = function () {
    this.div_ && (this.div_.parentNode.removeChild(this.div_), this.div_ = null)
}, InfoBox.prototype.draw = function () {
    this.createInfoBoxDiv_();
    var a = this.getProjection().fromLatLngToDivPixel(this.position_);
    this.div_.style.left = a.x + this.pixelOffset_.width + "px", this.alignBottom_ ? this.div_.style.bottom = -(a.y + this.pixelOffset_.height) + "px" : this.div_.style.top = a.y + this.pixelOffset_.height + "px", this.div_.style.visibility = this.isHidden_ ? "hidden" : "visible"
}, InfoBox.prototype.setOptions = function (a) {
    "undefined" != typeof a.boxClass && (this.boxClass_ = a.boxClass, this.setBoxStyle_()), "undefined" != typeof a.boxStyle && (this.boxStyle_ = a.boxStyle, this.setBoxStyle_()), "undefined" != typeof a.content && this.setContent(a.content), "undefined" != typeof a.disableAutoPan && (this.disableAutoPan_ = a.disableAutoPan), "undefined" != typeof a.maxWidth && (this.maxWidth_ = a.maxWidth), "undefined" != typeof a.pixelOffset && (this.pixelOffset_ = a.pixelOffset), "undefined" != typeof a.alignBottom && (this.alignBottom_ = a.alignBottom), "undefined" != typeof a.position && this.setPosition(a.position), "undefined" != typeof a.zIndex && this.setZIndex(a.zIndex), "undefined" != typeof a.closeBoxMargin && (this.closeBoxMargin_ = a.closeBoxMargin), "undefined" != typeof a.closeBoxURL && (this.closeBoxURL_ = a.closeBoxURL), "undefined" != typeof a.infoBoxClearance && (this.infoBoxClearance_ = a.infoBoxClearance), "undefined" != typeof a.isHidden && (this.isHidden_ = a.isHidden), "undefined" != typeof a.visible && (this.isHidden_ = !a.visible), "undefined" != typeof a.enableEventPropagation && (this.enableEventPropagation_ = a.enableEventPropagation), this.div_ && this.draw()
}, InfoBox.prototype.setContent = function (a) {
    this.content_ = a, this.div_ && (this.closeListener_ && (google.maps.event.removeListener(this.closeListener_), this.closeListener_ = null), this.fixedWidthSet_ || (this.div_.style.width = ""), "undefined" == typeof a.nodeType ? this.div_.innerHTML = this.getCloseBoxImg_() + a : (this.div_.innerHTML = this.getCloseBoxImg_(), this.div_.appendChild(a)), this.fixedWidthSet_ || (this.div_.style.width = this.div_.offsetWidth + "px", "undefined" == typeof a.nodeType ? this.div_.innerHTML = this.getCloseBoxImg_() + a : (this.div_.innerHTML = this.getCloseBoxImg_(), this.div_.appendChild(a))), this.addClickHandler_()), google.maps.event.trigger(this, "content_changed")
}, InfoBox.prototype.setPosition = function (a) {
    this.position_ = a, this.div_ && this.draw(), google.maps.event.trigger(this, "position_changed")
}, InfoBox.prototype.setZIndex = function (a) {
    this.zIndex_ = a, this.div_ && (this.div_.style.zIndex = a), google.maps.event.trigger(this, "zindex_changed")
}, InfoBox.prototype.setVisible = function (a) {
    this.isHidden_ = !a, this.div_ && (this.div_.style.visibility = this.isHidden_ ? "hidden" : "visible")
}, InfoBox.prototype.getContent = function () {
    return this.content_
}, InfoBox.prototype.getPosition = function () {
    return this.position_
}, InfoBox.prototype.getZIndex = function () {
    return this.zIndex_
}, InfoBox.prototype.getVisible = function () {
    var a;
    return a = "undefined" == typeof this.getMap() || null === this.getMap() ? !1 : !this.isHidden_
}, InfoBox.prototype.show = function () {
    this.isHidden_ = !1, this.div_ && (this.div_.style.visibility = "visible")
}, InfoBox.prototype.hide = function () {
    this.isHidden_ = !0, this.div_ && (this.div_.style.visibility = "hidden")
}, InfoBox.prototype.open = function (a, b) {
    var c = this;
    b && (this.position_ = b.getPosition(), this.moveListener_ = google.maps.event.addListener(b, "position_changed", function () {
        c.setPosition(this.getPosition())
    })), this.setMap(a), this.div_ && this.panBox_()
}, InfoBox.prototype.close = function () {
    var a;
    if (this.closeListener_ && (google.maps.event.removeListener(this.closeListener_), this.closeListener_ = null), this.eventListeners_) {
        for (a = 0; a < this.eventListeners_.length; a++)google.maps.event.removeListener(this.eventListeners_[a]);
        this.eventListeners_ = null
    }
    this.moveListener_ && (google.maps.event.removeListener(this.moveListener_), this.moveListener_ = null), this.contextListener_ && (google.maps.event.removeListener(this.contextListener_), this.contextListener_ = null), this.setMap(null)
}, ClusterIcon.prototype.onAdd = function () {
    var a, b, c = this;
    this.div_ = document.createElement("div"), this.div_.className = this.className_, this.visible_ && this.show(), this.getPanes().overlayMouseTarget.appendChild(this.div_), this.boundsChangedListener_ = google.maps.event.addListener(this.getMap(), "bounds_changed", function () {
        b = a
    }), google.maps.event.addDomListener(this.div_, "mousedown", function () {
        a = !0, b = !1
    }), google.maps.event.addDomListener(this.div_, "click", function (d) {
        if (a = !1, !b) {
            var e, f, g = c.cluster_.getMarkerClusterer();
            google.maps.event.trigger(g, "click", c.cluster_), google.maps.event.trigger(g, "clusterclick", c.cluster_), g.getZoomOnClick() && (f = g.getMaxZoom(), e = c.cluster_.getBounds(), g.getMap().fitBounds(e), setTimeout(function () {
                g.getMap().fitBounds(e), null !== f && g.getMap().getZoom() > f && g.getMap().setZoom(f + 1)
            }, 100)), d.cancelBubble = !0, d.stopPropagation && d.stopPropagation()
        }
    }), google.maps.event.addDomListener(this.div_, "mouseover", function () {
        var a = c.cluster_.getMarkerClusterer();
        google.maps.event.trigger(a, "mouseover", c.cluster_)
    }), google.maps.event.addDomListener(this.div_, "mouseout", function () {
        var a = c.cluster_.getMarkerClusterer();
        google.maps.event.trigger(a, "mouseout", c.cluster_)
    })
}, ClusterIcon.prototype.onRemove = function () {
    this.div_ && this.div_.parentNode && (this.hide(), google.maps.event.removeListener(this.boundsChangedListener_), google.maps.event.clearInstanceListeners(this.div_), this.div_.parentNode.removeChild(this.div_), this.div_ = null)
}, ClusterIcon.prototype.draw = function () {
    if (this.visible_) {
        var a = this.getPosFromLatLng_(this.center_);
        this.div_.style.top = a.y + "px", this.div_.style.left = a.x + "px"
    }
}, ClusterIcon.prototype.hide = function () {
    this.div_ && (this.div_.style.display = "none"), this.visible_ = !1
}, ClusterIcon.prototype.show = function () {
    if (this.div_) {
        var a = "", b = this.backgroundPosition_.split(" "), c = parseInt(b[0].trim(), 10), d = parseInt(b[1].trim(), 10), e = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(e), a = "<img src='" + this.url_ + "' style='position: absolute; top: " + d + "px; left: " + c + "px; ", this.cluster_.getMarkerClusterer().enableRetinaIcons_ || (a += "clip: rect(" + -1 * d + "px, " + (-1 * c + this.width_) + "px, " + (-1 * d + this.height_) + "px, " + -1 * c + "px);"), a += "'>", this.div_.innerHTML = a + "<div style='position: absolute;top: " + this.anchorText_[0] + "px;left: " + this.anchorText_[1] + "px;color: " + this.textColor_ + ";font-size: " + this.textSize_ + "px;font-family: " + this.fontFamily_ + ";font-weight: " + this.fontWeight_ + ";font-style: " + this.fontStyle_ + ";text-decoration: " + this.textDecoration_ + ";text-align: center;width: " + this.width_ + "px;line-height:" + this.height_ + "px;'>" + this.sums_.text + "</div>", this.div_.title = "undefined" == typeof this.sums_.title || "" === this.sums_.title ? this.cluster_.getMarkerClusterer().getTitle() : this.sums_.title, this.div_.style.display = ""
    }
    this.visible_ = !0
}, ClusterIcon.prototype.useStyle = function (a) {
    this.sums_ = a;
    var b = Math.max(0, a.index - 1);
    b = Math.min(this.styles_.length - 1, b);
    var c = this.styles_[b];
    this.url_ = c.url, this.height_ = c.height, this.width_ = c.width, this.anchorText_ = c.anchorText || [0, 0], this.anchorIcon_ = c.anchorIcon || [parseInt(this.height_ / 2, 10), parseInt(this.width_ / 2, 10)], this.textColor_ = c.textColor || "black", this.textSize_ = c.textSize || 11, this.textDecoration_ = c.textDecoration || "none", this.fontWeight_ = c.fontWeight || "bold", this.fontStyle_ = c.fontStyle || "normal", this.fontFamily_ = c.fontFamily || "Arial,sans-serif", this.backgroundPosition_ = c.backgroundPosition || "0 0"
}, ClusterIcon.prototype.setCenter = function (a) {
    this.center_ = a
}, ClusterIcon.prototype.createCss = function (a) {
    var b = [];
    return b.push("cursor: pointer;"), b.push("position: absolute; top: " + a.y + "px; left: " + a.x + "px;"), b.push("width: " + this.width_ + "px; height: " + this.height_ + "px;"), b.join("")
}, ClusterIcon.prototype.getPosFromLatLng_ = function (a) {
    var b = this.getProjection().fromLatLngToDivPixel(a);
    return b.x -= this.anchorIcon_[1], b.y -= this.anchorIcon_[0], b.x = parseInt(b.x, 10), b.y = parseInt(b.y, 10), b
}, Cluster.prototype.getSize = function () {
    return this.markers_.length
}, Cluster.prototype.getMarkers = function () {
    return this.markers_
}, Cluster.prototype.getCenter = function () {
    return this.center_
}, Cluster.prototype.getMap = function () {
    return this.map_
}, Cluster.prototype.getMarkerClusterer = function () {
    return this.markerClusterer_
}, Cluster.prototype.getBounds = function () {
    var a, b = new google.maps.LatLngBounds(this.center_, this.center_), c = this.getMarkers();
    for (a = 0; a < c.length; a++)b.extend(c[a].getPosition());
    return b
}, Cluster.prototype.remove = function () {
    this.clusterIcon_.setMap(null), this.markers_ = [], delete this.markers_
}, Cluster.prototype.addMarker = function (a) {
    var b, c, d;
    if (this.isMarkerAlreadyAdded_(a))return !1;
    if (this.center_) {
        if (this.averageCenter_) {
            var e = this.markers_.length + 1, f = (this.center_.lat() * (e - 1) + a.getPosition().lat()) / e, g = (this.center_.lng() * (e - 1) + a.getPosition().lng()) / e;
            this.center_ = new google.maps.LatLng(f, g), this.calculateBounds_()
        }
    } else this.center_ = a.getPosition(), this.calculateBounds_();
    if (a.isAdded = !0, this.markers_.push(a), c = this.markers_.length, d = this.markerClusterer_.getMaxZoom(), null !== d && this.map_.getZoom() > d)a.getMap() !== this.map_ && a.setMap(this.map_); else if (c < this.minClusterSize_)a.getMap() !== this.map_ && a.setMap(this.map_); else if (c === this.minClusterSize_)for (b = 0; c > b; b++)this.markers_[b].setMap(null); else a.setMap(null);
    return this.updateIcon_(), !0
}, Cluster.prototype.isMarkerInClusterBounds = function (a) {
    return this.bounds_.contains(a.getPosition())
}, Cluster.prototype.calculateBounds_ = function () {
    var a = new google.maps.LatLngBounds(this.center_, this.center_);
    this.bounds_ = this.markerClusterer_.getExtendedBounds(a)
}, Cluster.prototype.updateIcon_ = function () {
    var a = this.markers_.length, b = this.markerClusterer_.getMaxZoom();
    if (null !== b && this.map_.getZoom() > b)return void this.clusterIcon_.hide();
    if (a < this.minClusterSize_)return void this.clusterIcon_.hide();
    var c = this.markerClusterer_.getStyles().length, d = this.markerClusterer_.getCalculator()(this.markers_, c);
    this.clusterIcon_.setCenter(this.center_), this.clusterIcon_.useStyle(d), this.clusterIcon_.show()
}, Cluster.prototype.isMarkerAlreadyAdded_ = function (a) {
    var b;
    if (this.markers_.indexOf)return -1 !== this.markers_.indexOf(a);
    for (b = 0; b < this.markers_.length; b++)if (a === this.markers_[b])return !0;
    return !1
}, MarkerClusterer.prototype.onAdd = function () {
    var a = this;
    this.activeMap_ = this.getMap(), this.ready_ = !0, this.repaint(), this.listeners_ = [google.maps.event.addListener(this.getMap(), "zoom_changed", function () {
        a.resetViewport_(!1), (this.getZoom() === (this.get("minZoom") || 0) || this.getZoom() === this.get("maxZoom")) && google.maps.event.trigger(this, "idle")
    }), google.maps.event.addListener(this.getMap(), "idle", function () {
        a.redraw_()
    })]
}, MarkerClusterer.prototype.onRemove = function () {
    var a;
    for (a = 0; a < this.markers_.length; a++)this.markers_[a].getMap() !== this.activeMap_ && this.markers_[a].setMap(this.activeMap_);
    for (a = 0; a < this.clusters_.length; a++)this.clusters_[a].remove();
    for (this.clusters_ = [], a = 0; a < this.listeners_.length; a++)google.maps.event.removeListener(this.listeners_[a]);
    this.listeners_ = [], this.activeMap_ = null, this.ready_ = !1
}, MarkerClusterer.prototype.draw = function () {
},MarkerClusterer.prototype.setupStyles_ = function () {
    var a, b;
    if (!(this.styles_.length > 0))for (a = 0; a < this.imageSizes_.length; a++)b = this.imageSizes_[a], this.styles_.push({
        url: this.imagePath_ + (a + 1) + "." + this.imageExtension_,
        height: b,
        width: b
    })
},MarkerClusterer.prototype.fitMapToMarkers = function () {
    var a, b = this.getMarkers(), c = new google.maps.LatLngBounds;
    for (a = 0; a < b.length; a++)c.extend(b[a].getPosition());
    this.getMap().fitBounds(c)
},MarkerClusterer.prototype.getGridSize = function () {
    return this.gridSize_
},MarkerClusterer.prototype.setGridSize = function (a) {
    this.gridSize_ = a
},MarkerClusterer.prototype.getMinimumClusterSize = function () {
    return this.minClusterSize_
},MarkerClusterer.prototype.setMinimumClusterSize = function (a) {
    this.minClusterSize_ = a
},MarkerClusterer.prototype.getMaxZoom = function () {
    return this.maxZoom_
},MarkerClusterer.prototype.setMaxZoom = function (a) {
    this.maxZoom_ = a
},MarkerClusterer.prototype.getStyles = function () {
    return this.styles_
},MarkerClusterer.prototype.setStyles = function (a) {
    this.styles_ = a
},MarkerClusterer.prototype.getTitle = function () {
    return this.title_
},MarkerClusterer.prototype.setTitle = function (a) {
    this.title_ = a
},MarkerClusterer.prototype.getZoomOnClick = function () {
    return this.zoomOnClick_
},MarkerClusterer.prototype.setZoomOnClick = function (a) {
    this.zoomOnClick_ = a
},MarkerClusterer.prototype.getAverageCenter = function () {
    return this.averageCenter_
},MarkerClusterer.prototype.setAverageCenter = function (a) {
    this.averageCenter_ = a
},MarkerClusterer.prototype.getIgnoreHidden = function () {
    return this.ignoreHidden_
},MarkerClusterer.prototype.setIgnoreHidden = function (a) {
    this.ignoreHidden_ = a
},MarkerClusterer.prototype.getEnableRetinaIcons = function () {
    return this.enableRetinaIcons_
},MarkerClusterer.prototype.setEnableRetinaIcons = function (a) {
    this.enableRetinaIcons_ = a
},MarkerClusterer.prototype.getImageExtension = function () {
    return this.imageExtension_
},MarkerClusterer.prototype.setImageExtension = function (a) {
    this.imageExtension_ = a
},MarkerClusterer.prototype.getImagePath = function () {
    return this.imagePath_
},MarkerClusterer.prototype.setImagePath = function (a) {
    this.imagePath_ = a
},MarkerClusterer.prototype.getImageSizes = function () {
    return this.imageSizes_
},MarkerClusterer.prototype.setImageSizes = function (a) {
    this.imageSizes_ = a
},MarkerClusterer.prototype.getCalculator = function () {
    return this.calculator_
},MarkerClusterer.prototype.setCalculator = function (a) {
    this.calculator_ = a
},MarkerClusterer.prototype.getBatchSizeIE = function () {
    return this.batchSizeIE_
},MarkerClusterer.prototype.setBatchSizeIE = function (a) {
    this.batchSizeIE_ = a
},MarkerClusterer.prototype.getClusterClass = function () {
    return this.clusterClass_
},MarkerClusterer.prototype.setClusterClass = function (a) {
    this.clusterClass_ = a
},MarkerClusterer.prototype.getMarkers = function () {
    return this.markers_
},MarkerClusterer.prototype.getTotalMarkers = function () {
    return this.markers_.length
},MarkerClusterer.prototype.getClusters = function () {
    return this.clusters_
},MarkerClusterer.prototype.getTotalClusters = function () {
    return this.clusters_.length
},MarkerClusterer.prototype.addMarker = function (a, b) {
    this.pushMarkerTo_(a), b || this.redraw_()
},MarkerClusterer.prototype.addMarkers = function (a, b) {
    var c;
    for (c in a)a.hasOwnProperty(c) && this.pushMarkerTo_(a[c]);
    b || this.redraw_()
},MarkerClusterer.prototype.pushMarkerTo_ = function (a) {
    if (a.getDraggable()) {
        var b = this;
        google.maps.event.addListener(a, "dragend", function () {
            b.ready_ && (this.isAdded = !1, b.repaint())
        })
    }
    a.isAdded = !1, this.markers_.push(a)
},MarkerClusterer.prototype.removeMarker = function (a, b) {
    var c = this.removeMarker_(a);
    return !b && c && this.repaint(), c
},MarkerClusterer.prototype.removeMarkers = function (a, b) {
    var c, d, e = !1;
    for (c = 0; c < a.length; c++)d = this.removeMarker_(a[c]), e = e || d;
    return !b && e && this.repaint(), e
},MarkerClusterer.prototype.removeMarker_ = function (a) {
    var b, c = -1;
    if (this.markers_.indexOf)c = this.markers_.indexOf(a); else for (b = 0; b < this.markers_.length; b++)if (a === this.markers_[b]) {
        c = b;
        break
    }
    return -1 === c ? !1 : (a.setMap(null), this.markers_.splice(c, 1), !0)
},MarkerClusterer.prototype.clearMarkers = function () {
    this.resetViewport_(!0), this.markers_ = []
},MarkerClusterer.prototype.repaint = function () {
    var a = this.clusters_.slice();
    this.clusters_ = [], this.resetViewport_(!1), this.redraw_(), setTimeout(function () {
        var b;
        for (b = 0; b < a.length; b++)a[b].remove()
    }, 0)
},MarkerClusterer.prototype.getExtendedBounds = function (a) {
    var b = this.getProjection(), c = new google.maps.LatLng(a.getNorthEast().lat(), a.getNorthEast().lng()), d = new google.maps.LatLng(a.getSouthWest().lat(), a.getSouthWest().lng()), e = b.fromLatLngToDivPixel(c);
    e.x += this.gridSize_, e.y -= this.gridSize_;
    var f = b.fromLatLngToDivPixel(d);
    f.x -= this.gridSize_, f.y += this.gridSize_;
    var g = b.fromDivPixelToLatLng(e), h = b.fromDivPixelToLatLng(f);
    return a.extend(g), a.extend(h), a
},MarkerClusterer.prototype.redraw_ = function () {
    this.createClusters_(0)
},MarkerClusterer.prototype.resetViewport_ = function (a) {
    var b, c;
    for (b = 0; b < this.clusters_.length; b++)this.clusters_[b].remove();
    for (this.clusters_ = [], b = 0; b < this.markers_.length; b++)c = this.markers_[b], c.isAdded = !1, a && c.setMap(null)
},MarkerClusterer.prototype.distanceBetweenPoints_ = function (a, b) {
    var c = 6371, d = (b.lat() - a.lat()) * Math.PI / 180, e = (b.lng() - a.lng()) * Math.PI / 180, f = Math.sin(d / 2) * Math.sin(d / 2) + Math.cos(a.lat() * Math.PI / 180) * Math.cos(b.lat() * Math.PI / 180) * Math.sin(e / 2) * Math.sin(e / 2), g = 2 * Math.atan2(Math.sqrt(f), Math.sqrt(1 - f)), h = c * g;
    return h
},MarkerClusterer.prototype.isMarkerInBounds_ = function (a, b) {
    return b.contains(a.getPosition())
},MarkerClusterer.prototype.addToClosestCluster_ = function (a) {
    var b, c, d, e, f = 4e4, g = null;
    for (b = 0; b < this.clusters_.length; b++)d = this.clusters_[b], e = d.getCenter(), e && (c = this.distanceBetweenPoints_(e, a.getPosition()), f > c && (f = c, g = d));
    g && g.isMarkerInClusterBounds(a) ? g.addMarker(a) : (d = new Cluster(this), d.addMarker(a), this.clusters_.push(d))
},MarkerClusterer.prototype.createClusters_ = function (a) {
    var b, c, d, e = this;
    if (this.ready_) {
        0 === a && (google.maps.event.trigger(this, "clusteringbegin", this), "undefined" != typeof this.timerRefStatic && (clearTimeout(this.timerRefStatic), delete this.timerRefStatic)), d = this.getMap().getZoom() > 3 ? new google.maps.LatLngBounds(this.getMap().getBounds().getSouthWest(), this.getMap().getBounds().getNorthEast()) : new google.maps.LatLngBounds(new google.maps.LatLng(85.02070771743472, -178.48388434375), new google.maps.LatLng(-85.08136444384544, 178.00048865625));
        var f = this.getExtendedBounds(d), g = Math.min(a + this.batchSize_, this.markers_.length);
        for (b = a; g > b; b++)c = this.markers_[b], !c.isAdded && this.isMarkerInBounds_(c, f) && (!this.ignoreHidden_ || this.ignoreHidden_ && c.getVisible()) && this.addToClosestCluster_(c);
        g < this.markers_.length ? this.timerRefStatic = setTimeout(function () {
            e.createClusters_(g)
        }, 0) : (delete this.timerRefStatic, google.maps.event.trigger(this, "clusteringend", this))
    }
},MarkerClusterer.prototype.extend = function (a, b) {
    return function (a) {
        var b;
        for (b in a.prototype)this.prototype[b] = a.prototype[b];
        return this
    }.apply(a, [b])
},MarkerClusterer.CALCULATOR = function (a, b) {
    for (var c = 0, d = "", e = a.length.toString(), f = e; 0 !== f;)f = parseInt(f / 10, 10), c++;
    return c = Math.min(c, b), {text: e, index: c, title: d}
},MarkerClusterer.BATCH_SIZE = 2e3,MarkerClusterer.BATCH_SIZE_IE = 500,MarkerClusterer.IMAGE_PATH = "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclustererplus/images/m",MarkerClusterer.IMAGE_EXTENSION = "png",MarkerClusterer.IMAGE_SIZES = [53, 56, 66, 78, 90],"function" != typeof String.prototype.trim && (String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "")
}),inherits(MarkerLabel_, google.maps.OverlayView),MarkerLabel_.getSharedCross = function (a) {
    var b;
    return "undefined" == typeof MarkerLabel_.getSharedCross.crossDiv && (b = document.createElement("img"), b.style.cssText = "position: absolute; z-index: 1000002; display: none;", b.style.marginLeft = "-8px", b.style.marginTop = "-9px", b.src = a, MarkerLabel_.getSharedCross.crossDiv = b), MarkerLabel_.getSharedCross.crossDiv
},MarkerLabel_.prototype.onAdd = function () {
    var a, b, c, d, e, f, g, h = this, i = !1, j = !1, k = 20, l = "url(" + this.handCursorURL_ + ")", m = function (a) {
        a.preventDefault && a.preventDefault(), a.cancelBubble = !0, a.stopPropagation && a.stopPropagation()
    }, n = function () {
        h.marker_.setAnimation(null)
    };
    this.getPanes().overlayImage.appendChild(this.labelDiv_), this.getPanes().overlayMouseTarget.appendChild(this.eventDiv_), "undefined" == typeof MarkerLabel_.getSharedCross.processed && (this.getPanes().overlayImage.appendChild(this.crossDiv_), MarkerLabel_.getSharedCross.processed = !0), this.listeners_ = [google.maps.event.addDomListener(this.eventDiv_, "mouseover", function (a) {
        (h.marker_.getDraggable() || h.marker_.getClickable()) && (this.style.cursor = "pointer", google.maps.event.trigger(h.marker_, "mouseover", a))
    }), google.maps.event.addDomListener(this.eventDiv_, "mouseout", function (a) {
        !h.marker_.getDraggable() && !h.marker_.getClickable() || j || (this.style.cursor = h.marker_.getCursor(), google.maps.event.trigger(h.marker_, "mouseout", a))
    }), google.maps.event.addDomListener(this.eventDiv_, "mousedown", function (a) {
        j = !1, h.marker_.getDraggable() && (i = !0, this.style.cursor = l), (h.marker_.getDraggable() || h.marker_.getClickable()) && (google.maps.event.trigger(h.marker_, "mousedown", a), m(a))
    }), google.maps.event.addDomListener(document, "mouseup", function (b) {
        var c;
        if (i && (i = !1, h.eventDiv_.style.cursor = "pointer", google.maps.event.trigger(h.marker_, "mouseup", b)), j) {
            if (e) {
                c = h.getProjection().fromLatLngToDivPixel(h.marker_.getPosition()), c.y += k, h.marker_.setPosition(h.getProjection().fromDivPixelToLatLng(c));
                try {
                    h.marker_.setAnimation(google.maps.Animation.BOUNCE), setTimeout(n, 1406)
                } catch (f) {
                }
            }
            h.crossDiv_.style.display = "none", h.marker_.setZIndex(a), d = !0, j = !1, b.latLng = h.marker_.getPosition(), google.maps.event.trigger(h.marker_, "dragend", b)
        }
    }), google.maps.event.addListener(h.marker_.getMap(), "mousemove", function (d) {
        var l;
        i && (j ? (d.latLng = new google.maps.LatLng(d.latLng.lat() - b, d.latLng.lng() - c), l = h.getProjection().fromLatLngToDivPixel(d.latLng), e && (h.crossDiv_.style.left = l.x + "px", h.crossDiv_.style.top = l.y + "px", h.crossDiv_.style.display = "", l.y -= k), h.marker_.setPosition(h.getProjection().fromDivPixelToLatLng(l)), e && (h.eventDiv_.style.top = l.y + k + "px"), google.maps.event.trigger(h.marker_, "drag", d)) : (b = d.latLng.lat() - h.marker_.getPosition().lat(), c = d.latLng.lng() - h.marker_.getPosition().lng(), a = h.marker_.getZIndex(), f = h.marker_.getPosition(), g = h.marker_.getMap().getCenter(), e = h.marker_.get("raiseOnDrag"), j = !0, h.marker_.setZIndex(1e6), d.latLng = h.marker_.getPosition(), google.maps.event.trigger(h.marker_, "dragstart", d)))
    }), google.maps.event.addDomListener(document, "keydown", function (a) {
        j && 27 === a.keyCode && (e = !1, h.marker_.setPosition(f), h.marker_.getMap().setCenter(g), google.maps.event.trigger(document, "mouseup", a))
    }), google.maps.event.addDomListener(this.eventDiv_, "click", function (a) {
        (h.marker_.getDraggable() || h.marker_.getClickable()) && (d ? d = !1 : (google.maps.event.trigger(h.marker_, "click", a), m(a)))
    }), google.maps.event.addDomListener(this.eventDiv_, "dblclick", function (a) {
        (h.marker_.getDraggable() || h.marker_.getClickable()) && (google.maps.event.trigger(h.marker_, "dblclick", a), m(a))
    }), google.maps.event.addListener(this.marker_, "dragstart", function () {
        j || (e = this.get("raiseOnDrag"))
    }), google.maps.event.addListener(this.marker_, "drag", function () {
        j || e && (h.setPosition(k), h.labelDiv_.style.zIndex = 1e6 + (this.get("labelInBackground") ? -1 : 1))
    }), google.maps.event.addListener(this.marker_, "dragend", function () {
        j || e && h.setPosition(0)
    }), google.maps.event.addListener(this.marker_, "position_changed", function () {
        h.setPosition()
    }), google.maps.event.addListener(this.marker_, "zindex_changed", function () {
        h.setZIndex()
    }), google.maps.event.addListener(this.marker_, "visible_changed", function () {
        h.setVisible()
    }), google.maps.event.addListener(this.marker_, "labelvisible_changed", function () {
        h.setVisible()
    }), google.maps.event.addListener(this.marker_, "title_changed", function () {
        h.setTitle()
    }), google.maps.event.addListener(this.marker_, "labelcontent_changed", function () {
        h.setContent()
    }), google.maps.event.addListener(this.marker_, "labelanchor_changed", function () {
        h.setAnchor()
    }), google.maps.event.addListener(this.marker_, "labelclass_changed", function () {
        h.setStyles()
    }), google.maps.event.addListener(this.marker_, "labelstyle_changed", function () {
        h.setStyles()
    })]
},MarkerLabel_.prototype.onRemove = function () {
    var a;
    for (null !== this.labelDiv_.parentNode && this.labelDiv_.parentNode.removeChild(this.labelDiv_), null !== this.eventDiv_.parentNode && this.eventDiv_.parentNode.removeChild(this.eventDiv_), a = 0; a < this.listeners_.length; a++)google.maps.event.removeListener(this.listeners_[a])
},MarkerLabel_.prototype.draw = function () {
    this.setContent(), this.setTitle(), this.setStyles()
},MarkerLabel_.prototype.setContent = function () {
    var a = this.marker_.get("labelContent");
    "undefined" == typeof a.nodeType ? (this.labelDiv_.innerHTML = a, this.eventDiv_.innerHTML = this.labelDiv_.innerHTML) : (this.labelDiv_.innerHTML = "", this.labelDiv_.appendChild(a), a = a.cloneNode(!0), this.eventDiv_.appendChild(a))
},MarkerLabel_.prototype.setTitle = function () {
    this.eventDiv_.title = this.marker_.getTitle() || ""
},MarkerLabel_.prototype.setStyles = function () {
    var a, b;
    this.labelDiv_.className = this.marker_.get("labelClass"), this.eventDiv_.className = this.labelDiv_.className, this.labelDiv_.style.cssText = "", this.eventDiv_.style.cssText = "", b = this.marker_.get("labelStyle");
    for (a in b)b.hasOwnProperty(a) && (this.labelDiv_.style[a] = b[a], this.eventDiv_.style[a] = b[a]);
    this.setMandatoryStyles()
},MarkerLabel_.prototype.setMandatoryStyles = function () {
    this.labelDiv_.style.position = "absolute", this.labelDiv_.style.overflow = "hidden", "undefined" != typeof this.labelDiv_.style.opacity && "" !== this.labelDiv_.style.opacity && (this.labelDiv_.style.MsFilter = '"progid:DXImageTransform.Microsoft.Alpha(opacity=' + 100 * this.labelDiv_.style.opacity + ')"', this.labelDiv_.style.filter = "alpha(opacity=" + 100 * this.labelDiv_.style.opacity + ")"), this.eventDiv_.style.position = this.labelDiv_.style.position, this.eventDiv_.style.overflow = this.labelDiv_.style.overflow, this.eventDiv_.style.opacity = .01, this.eventDiv_.style.MsFilter = '"progid:DXImageTransform.Microsoft.Alpha(opacity=1)"', this.eventDiv_.style.filter = "alpha(opacity=1)", this.setAnchor(), this.setPosition(), this.setVisible()
},MarkerLabel_.prototype.setAnchor = function () {
    var a = this.marker_.get("labelAnchor");
    this.labelDiv_.style.marginLeft = -a.x + "px", this.labelDiv_.style.marginTop = -a.y + "px", this.eventDiv_.style.marginLeft = -a.x + "px", this.eventDiv_.style.marginTop = -a.y + "px"
},MarkerLabel_.prototype.setPosition = function (a) {
    var b = this.getProjection().fromLatLngToDivPixel(this.marker_.getPosition());
    "undefined" == typeof a && (a = 0), this.labelDiv_.style.left = Math.round(b.x) + "px", this.labelDiv_.style.top = Math.round(b.y - a) + "px", this.eventDiv_.style.left = this.labelDiv_.style.left, this.eventDiv_.style.top = this.labelDiv_.style.top, this.setZIndex()
},MarkerLabel_.prototype.setZIndex = function () {
    var a = this.marker_.get("labelInBackground") ? -1 : 1;
    "undefined" == typeof this.marker_.getZIndex() ? (this.labelDiv_.style.zIndex = parseInt(this.labelDiv_.style.top, 10) + a, this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex) : (this.labelDiv_.style.zIndex = this.marker_.getZIndex() + a, this.eventDiv_.style.zIndex = this.labelDiv_.style.zIndex)
},MarkerLabel_.prototype.setVisible = function () {
    this.labelDiv_.style.display = this.marker_.get("labelVisible") && this.marker_.getVisible() ? "block" : "none", this.eventDiv_.style.display = this.labelDiv_.style.display
},inherits(MarkerWithLabel, google.maps.Marker),MarkerWithLabel.prototype.setMap = function (a) {
    google.maps.Marker.prototype.setMap.apply(this, arguments), this.label.setMap(a)
};
