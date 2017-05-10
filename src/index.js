import Akamai from './Akamai';
import Config from './config/ConfigConstants'

const config = {
        algorithm : 'SHA256',
        acl : '/*',
        window : 60000,
        key : Config.SECRET_KEY,
        encoding: false
     },
     getStream = () => {
         const akamai = new Akamai(config);
         return `${Config.BASE_PATH}${akamai.generateToken()}`
     };


const token = getStream();
      console.log(token);
