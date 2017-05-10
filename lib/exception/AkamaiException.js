"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
  This Class Contain Structure of Akamai Exceptions
  param @error Object {
   name String,
   message String
   }
 */
var AkamaiException = function () {
    function AkamaiException(error) {
        _classCallCheck(this, AkamaiException);

        console.log(error.message);
        this._name = "Akamai Exception";
        this._message = error.message;
    }

    _createClass(AkamaiException, [{
        key: "name",
        get: function get() {
            return this._name;
        },
        set: function set(name) {
            this._name = name;
        }
    }, {
        key: "message",
        get: function get() {
            return this._message;
        },
        set: function set(message) {
            this._message = message;
        }
    }]);

    return AkamaiException;
}();

exports.default = AkamaiException;