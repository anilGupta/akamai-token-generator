'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Common = {
    urlEncode: function urlEncode(str) {
        var MyStr = (str + '').toString();
        return encodeURIComponent(MyStr).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
    },
    toChar: function toChar(codePt) {
        if (codePt < 128) {
            return String.fromCharCode(codePt);
        } else {
            return "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "[codePt - 128];
        }
    }
};
exports.default = Common;