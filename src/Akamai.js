import AkamaiException from './exception/AkamaiException'
import Utils from './utils/Common';
import CryptoJS from './utils/Crypt';

class Akamai {

    constructor(config){
        this._algorithm =  config.algorithm ? config.algorithm : 'SHA256';
        this._ip = config.ip ? config.ip : '';
        this._start_time =  config.time ? config.time : 0;
        this._window = config.window ? config.window : 30000;
        this._acl = config.acl ? config.acl : '';
        this._url = config.url ? config.url : '';
        this._session_id = config.session ? config.session : '';
        this._data = config.data ? config.data : '';
        this._salt = config.salt ? config.salt : '';
        this._key = config.key ? config.key : 'xxxx';
        this._field_delimiter = config.delimiter ? config.delimiter : '~';
        this._early_user_encoding =  config.encoding ? config.encoding : false;
    }

    get algorithm(){
        return this._algorithm;
    }
    set algorithm(val){
        let availableAlgorithm = ['sha256','sha1','md5'];
        if($.inArray(val, availableAlgorithm)){
            this._algorithm = val;
        }else{
            let message = 'Invalid Algorithm, must be one of ' + availableAlgorithm.join(" , ");
            throw new AkamaiException({ message })
        }

    }
    get ip(){
        return this._ip;
    }

    getIpField(){
        if ( this.ip != "" ) {
            return 'ip=' + this._ip + this.delimiter
        }
        return "";
    }

    set ip(value){
        this._ip = value;
    }

    get startTime(){
        return this._start_time;
    }

    getStartTimeValue(){
        if (this.startTime > 0 ) {
            return Math.round(this.startTime/ 1000);
        } else {
            let dateTime = new Date().getTime();
            let time = Math.round(dateTime/ 1000);
            return (time -120);
        }
    }

    getStartTimeField(){
        return "st="+ this.getStartTimeValue() + this.delimiter;
    }

    set startTime(startTime){
        if ( $.isNumeric(startTime) && startTime > 0  ) {
            this._start_time = +startTime;
        } else {
            let message = 'start time input invalid or out of range';
            throw new AkamaiException({ message })
        }
    }

    get window(){
        return this._window;
    }

    getExprField(){
        return 'exp=' + (this.getStartTimeValue() +  this.window) + this.delimiter
    }

    set window(window){
        if ( $.isNumeric(window) && window > 0) {
            this._window = +window;
        } else {
            let message = 'window input invalid';
            throw new AkamaiException({ message })
        }
    }

    get acl(){
        return this._acl;
    }

    getAclField(){
        let acl = this.acl;
        if(acl){
            return 'acl=' + this._encode(acl) + this.delimiter
        }else{
            return 'acl=' + this._encode('/*') + this.delimiter
        }
    }

    set acl(acl){
        if(this.url != ''){
            let message = 'Cannot set both an ACL and a URL at the same time';
            throw new AkamaiException({ message })
        }
        this._acl = acl;
    }

    set url(url){
        if(this.acl){
            let message = 'Cannot set both an ACL and a URL at the same time';
            throw new AkamaiException({ message })
        }
        this._url = url;
    }

    get url(){
        return this._url;
    }

    getUrlField(){
        return this.url && !this.acl ? "url="+ this._encode(this.url) + this.delimiter : '';
    }

    set session(sessionId){
        this._session_id = sessionId;
    }

    get session(){
        return this._session_id;
    }

    getSessionIdField(){
        return this.session? "id=" + this.session + this.delimiter : '';
    }

    set data(data){
        return this._data = data
    }

    get data(){
        return this._data;
    }

    getDataField(){
        return this.data ? "data=" + this.data + this.delimiter : '';
    }


    set key(key){
        const regex = new RegExp('^[a-fA-F0-9]+$');
        if (key.match(regex) && (key.length %2) == 0) {
            this._key = key;
        } else {
            let message = 'Key must be a hex string (a-f,0-9 and even number of chars';
            throw new AkamaiException({ message });
        }
    }

    get key(){
        return this._key;
    }

    get salt(){
        return this._salt;
    }

    getSaltField(){
        return this.salt ? 'salt='.this.salt + this.delimiter : '';
    }

    set salt(val){
        this._salt = val;
    }

    get delimiter(){
        return this._field_delimiter;
    }

    set delimiter(val){
        this._field_delimiter = val;
    }

    get userEncoding(){
        return this._early_user_encoding;
    }

    set userEncoding(val){
        this._early_user_encoding = val;
    }


    _encode(val){
        if (this.userEncoding === true) {
            return Utils.urlEncode(val);
        }
        return val;
    }

    generateToken (){
        const h2b = str => {
            let bin = '',
                pointer = 0;
                do{
                    let subStr = str[pointer] + str[(pointer + 1)],
                        hexVal = parseInt((subStr + '').replace(/[^a-f0-9]/gi, '') ,16);
                        bin += String.fromCharCode(hexVal);
                        pointer += 2;
                } while(pointer < str.length);
            return bin;
        };

        let token = this.getIpField() + this.getStartTimeField() + this.getExprField() + this.getAclField() + this.getSessionIdField() + this.getDataField(),
            digest = String(token) + this.getUrlField() + this.getSaltField(),
            regex = new RegExp(this.delimiter + "$"),
            signature = CryptoJS.HmacSHA256(digest.replace(regex, ''), h2b(this.key));
        return token + 'hmac=' + signature;
    }
}

export default Akamai