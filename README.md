A Simple NodeJS Akamai token generator library

## Installation 

using **yarn**:

`yarn add akamai-auth-token`

Or with **npm**:

`npm install akamai-auth-token`

## Uses

```js
var Akamai = require('akamai-auth-token').default;
var config = {
         algorithm : 'SHA256',
         acl : '/*',
         window : 6000,
         key : "myPrivateKey",
         encoding: false
    };
 
 
 var akamai = new Akamai.default(config),
     token = akamai.generateToken();
```
