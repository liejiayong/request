'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

/**
 * @author liejiayong (809206619@qq.com)
 * @Date: 2022-07-01 14：34：45
 * @LastEditTime: 2022-08-04 18:29:28
 * @LastEditors: liejiayong(809206619@qq.com)
 * @Description: In User Settings Edit
 */
var isBoolean = function (val) {
    return Object.prototype.toString.call(val) === "[object Boolean]";
};
var isArray = function (val) {
    return Object.prototype.toString.call(val) === "[object Array]";
};
function getSuccessFlag(raw, ref) {
    if (raw === void 0) { raw = {}; }
    if (ref === void 0) { ref = {}; }
    var flag = false;
    var _loop_1 = function (key) {
        var v1 = raw[key];
        var v2 = ref[key];
        var state = isArray(v2)
            ? v2.some(function (item) { return v1 === item; })
            : v1 === v2;
        if (state) {
            flag = true;
        }
    };
    for (var key in ref) {
        _loop_1(key);
    }
    return flag;
}
var Request = /** @class */ (function () {
    function Request(config) {
        var _a, _b, _c, _d;
        this.instance = axios__default["default"].create(config);
        this.interceptorsObj = config.interceptors;
        this.requestUrlList = [];
        this.successMap = config.successMap || {};
        this.cancelRequestSourceList = [];
        this.instance.interceptors.request.use(function (res) { return res; }, function (err) { return err; });
        this.instance.interceptors.request.use((_a = this.interceptorsObj) === null || _a === void 0 ? void 0 : _a.requestInterceptors, (_b = this.interceptorsObj) === null || _b === void 0 ? void 0 : _b.requestInterceptorsCatch);
        this.instance.interceptors.response.use((_c = this.interceptorsObj) === null || _c === void 0 ? void 0 : _c.responseInterceptors, (_d = this.interceptorsObj) === null || _d === void 0 ? void 0 : _d.responseInterceptorsCatch);
        this.instance.interceptors.response.use(function (res) { return res; }, function (err) { return err; });
    }
    Request.prototype.request = function (config) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var _a, _b;
            config.canRepeat = isBoolean(config.canRepeat) ? config.canRepeat : true;
            if ((_a = config.interceptors) === null || _a === void 0 ? void 0 : _a.requestInterceptors) {
                config = config.interceptors.requestInterceptors(config);
            }
            var url = config.url, canRepeat = config.canRepeat;
            if (!canRepeat && url) {
                (_b = _this.requestUrlList) === null || _b === void 0 ? void 0 : _b.push(url);
                config.cancelToken = new axios__default["default"].CancelToken(function (c) {
                    var _a;
                    var _b;
                    (_b = _this.cancelRequestSourceList) === null || _b === void 0 ? void 0 : _b.push((_a = {},
                        _a[url] = c,
                        _a));
                });
            }
            _this.instance
                .request(config)
                .then(function (res) {
                var _a;
                if ((_a = config.interceptors) === null || _a === void 0 ? void 0 : _a.responseInterceptors) {
                    res = config.interceptors.responseInterceptors(res);
                }
                if (res.status === 200) {
                    if (JSON.stringify(_this.successMap) !== "{}") {
                        if (getSuccessFlag(res.data, _this.successMap)) {
                            resolve(res.data);
                        }
                        else {
                            reject(res.data);
                        }
                    }
                    else {
                        resolve(res.data);
                    }
                }
                else {
                    reject(res.data);
                }
            })
                .catch(function (err) {
                reject(err);
            })
                .finally(function () {
                url && _this.delUrl(url);
            });
        });
    };
    Request.prototype.getSourceIndex = function (url) {
        var _a;
        return (_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a.findIndex(function (item) { return Object.keys(item)[0] === url; });
    };
    Request.prototype.delUrl = function (url) {
        var _a, _b, _c;
        var urlIndex = (_a = this.requestUrlList) === null || _a === void 0 ? void 0 : _a.findIndex(function (u) { return u === url; });
        var sourceIndex = this.getSourceIndex(url);
        urlIndex !== -1 && ((_b = this.requestUrlList) === null || _b === void 0 ? void 0 : _b.splice(urlIndex, 1));
        sourceIndex !== -1 &&
            ((_c = this.cancelRequestSourceList) === null || _c === void 0 ? void 0 : _c.splice(sourceIndex, 1));
    };
    Request.prototype.cancelAllRequest = function () {
        var _a;
        (_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a.forEach(function (source) {
            var key = Object.keys(source)[0];
            source[key]();
        });
    };
    Request.prototype.cancelRequest = function (url) {
        var _this = this;
        var _a;
        if (typeof url === "string") {
            var sourceIndex = this.getSourceIndex(url);
            sourceIndex >= 0 && ((_a = this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a[sourceIndex][url]());
        }
        else {
            url.forEach(function (u) {
                var _a;
                var sourceIndex = _this.getSourceIndex(u);
                sourceIndex >= 0 && ((_a = _this.cancelRequestSourceList) === null || _a === void 0 ? void 0 : _a[sourceIndex][u]());
            });
        }
    };
    return Request;
}());

exports["default"] = Request;
