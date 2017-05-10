'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AkamaiException = require('./exception/AkamaiException');

var _AkamaiException2 = _interopRequireDefault(_AkamaiException);

var _Common = require('./utils/Common');

var _Common2 = _interopRequireDefault(_Common);

var _Crypt = require('./utils/Crypt');

var _Crypt2 = _interopRequireDefault(_Crypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Akamai = function () {
    function Akamai(config) {
        _classCallCheck(this, Akamai);

        this._algorithm = config.algorithm ? config.algorithm : 'SHA256';
        this._ip = config.ip ? config.ip : '';
        this._start_time = config.time ? config.time : 0;
        this._window = config.window ? config.window : 30000;
        this._acl = config.acl ? config.acl : '';
        this._url = config.url ? config.url : '';
        this._session_id = config.session ? config.session : '';
        this._data = config.data ? config.data : '';
        this._salt = config.salt ? config.salt : '';
        this._key = config.key ? config.key : 'xxxx';
        this._field_delimiter = config.delimiter ? config.delimiter : '~';
        this._early_user_encoding = config.encoding ? config.encoding : false;
    }

    _createClass(Akamai, [{
        key: 'getIpField',
        value: function getIpField() {
            if (this.ip != "") {
                return 'ip=' + this._ip + this.delimiter;
            }
            return "";
        }
    }, {
        key: 'getStartTimeValue',
        value: function getStartTimeValue() {
            if (this.startTime > 0) {
                return Math.round(this.startTime / 1000);
            } else {
                var dateTime = new Date().getTime();
                var time = Math.round(dateTime / 1000);
                return time - 120;
            }
        }
    }, {
        key: 'getStartTimeField',
        value: function getStartTimeField() {
            return "st=" + this.getStartTimeValue() + this.delimiter;
        }
    }, {
        key: 'getExprField',
        value: function getExprField() {
            return 'exp=' + (this.getStartTimeValue() + this.window) + this.delimiter;
        }
    }, {
        key: 'getAclField',
        value: function getAclField() {
            var acl = this.acl;
            if (acl) {
                return 'acl=' + this._encode(acl) + this.delimiter;
            } else {
                return 'acl=' + this._encode('/*') + this.delimiter;
            }
        }
    }, {
        key: 'getUrlField',
        value: function getUrlField() {
            return this.url && !this.acl ? "url=" + this._encode(this.url) + this.delimiter : '';
        }
    }, {
        key: 'getSessionIdField',
        value: function getSessionIdField() {
            return this.session ? "id=" + this.session + this.delimiter : '';
        }
    }, {
        key: 'getDataField',
        value: function getDataField() {
            return this.data ? "data=" + this.data + this.delimiter : '';
        }
    }, {
        key: 'getSaltField',
        value: function getSaltField() {
            return this.salt ? 'salt='.this.salt + this.delimiter : '';
        }
    }, {
        key: '_encode',
        value: function _encode(val) {
            if (this.userEncoding === true) {
                return _Common2.default.urlEncode(val);
            }
            return val;
        }
    }, {
        key: 'generateToken',
        value: function generateToken() {
            var h2b = function h2b(str) {
                var bin = '',
                    pointer = 0;
                do {
                    var subStr = str[pointer] + str[pointer + 1],
                        hexVal = parseInt((subStr + '').replace(/[^a-f0-9]/gi, ''), 16);
                    bin += String.fromCharCode(hexVal);
                    pointer += 2;
                } while (pointer < str.length);
                return bin;
            };

            var token = this.getIpField() + this.getStartTimeField() + this.getExprField() + this.getAclField() + this.getSessionIdField() + this.getDataField(),
                digest = String(token) + this.getUrlField() + this.getSaltField(),
                regex = new RegExp(this.delimiter + "$"),
                signature = _Crypt2.default.HmacSHA256(digest.replace(regex, ''), h2b(this.key));
            return token + 'hmac=' + signature;
        }
    }, {
        key: 'algorithm',
        get: function get() {
            return this._algorithm;
        },
        set: function set(val) {
            var availableAlgorithm = ['sha256', 'sha1', 'md5'];
            if ($.inArray(val, availableAlgorithm)) {
                this._algorithm = val;
            } else {
                var message = 'Invalid Algorithm, must be one of ' + availableAlgorithm.join(" , ");
                throw new _AkamaiException2.default({ message: message });
            }
        }
    }, {
        key: 'ip',
        get: function get() {
            return this._ip;
        },
        set: function set(value) {
            this._ip = value;
        }
    }, {
        key: 'startTime',
        get: function get() {
            return this._start_time;
        },
        set: function set(startTime) {
            if ($.isNumeric(startTime) && startTime > 0) {
                this._start_time = +startTime;
            } else {
                var message = 'start time input invalid or out of range';
                throw new _AkamaiException2.default({ message: message });
            }
        }
    }, {
        key: 'window',
        get: function get() {
            return this._window;
        },
        set: function set(window) {
            if ($.isNumeric(window) && window > 0) {
                this._window = +window;
            } else {
                var message = 'window input invalid';
                throw new _AkamaiException2.default({ message: message });
            }
        }
    }, {
        key: 'acl',
        get: function get() {
            return this._acl;
        },
        set: function set(acl) {
            if (this.url != '') {
                var message = 'Cannot set both an ACL and a URL at the same time';
                throw new _AkamaiException2.default({ message: message });
            }
            this._acl = acl;
        }
    }, {
        key: 'url',
        set: function set(url) {
            if (this.acl) {
                var message = 'Cannot set both an ACL and a URL at the same time';
                throw new _AkamaiException2.default({ message: message });
            }
            this._url = url;
        },
        get: function get() {
            return this._url;
        }
    }, {
        key: 'session',
        set: function set(sessionId) {
            this._session_id = sessionId;
        },
        get: function get() {
            return this._session_id;
        }
    }, {
        key: 'data',
        set: function set(data) {
            return this._data = data;
        },
        get: function get() {
            return this._data;
        }
    }, {
        key: 'key',
        set: function set(key) {
            var regex = new RegExp('^[a-fA-F0-9]+$');
            if (key.match(regex) && key.length % 2 == 0) {
                this._key = key;
            } else {
                var message = 'Key must be a hex string (a-f,0-9 and even number of chars';
                throw new _AkamaiException2.default({ message: message });
            }
        },
        get: function get() {
            return this._key;
        }
    }, {
        key: 'salt',
        get: function get() {
            return this._salt;
        },
        set: function set(val) {
            this._salt = val;
        }
    }, {
        key: 'delimiter',
        get: function get() {
            return this._field_delimiter;
        },
        set: function set(val) {
            this._field_delimiter = val;
        }
    }, {
        key: 'userEncoding',
        get: function get() {
            return this._early_user_encoding;
        },
        set: function set(val) {
            this._early_user_encoding = val;
        }
    }]);

    return Akamai;
}();

exports.default = Akamai;