import { expect } from 'chai';
import { isDevelopment, initState,
   setState, setToken, getToken, getClaims
} from '@/utils';

import { passwordLogin, dbBackup
} from '@/actions';

if(isDevelopment()){
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

initState();

describe('backup', () => {
   var context = {
      
   };

   before(`Initialize backup process`, (done) => {
      passwordLogin((err, res) => {
         if(err) done(new Error(`Failed to initialize backup process. Login failed.`));
         else {
            let model = res.body;
            console.log('model', model);
            let token = model.accessToken.token;
            let refreshToken =  model.refreshToken;
            setToken(token);
            setState('refreshToken', refreshToken);
            done();
         }
      })
      
   });

   it('can backup db', (done) => {
      dbBackup(getToken(), (err, res) => {
         if(err) done(new Error(`Failed to backup db.`));
         else done();
      })
   });
})