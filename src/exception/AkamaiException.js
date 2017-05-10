/*
  This Class Contain Structure of Akamai Exceptions
  param @error Object {
   name String,
   message String
   }
 */
class AkamaiException {
    constructor(error){
        console.log(error.message);
        this._name =  "Akamai Exception";
        this._message = error.message
    }

    get name(){
        return this._name;
    }

    set name(name){
        this._name = name
    }

    get message(){
        return this._message;
    }

    set message(message){
        this._message = message
    }
}

export default AkamaiException;