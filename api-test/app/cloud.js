import { expect } from 'chai';
import { isDevelopment, initState,
   setState, setToken, getToken, getClaims
} from '@/utils';

import { passwordLogin, dbBackupFiles
} from '@/actions';

if(isDevelopment()){
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

initState();

describe('backup files to cloud', () => {
   var context = {
      
   };

   before(`Initialize cloud process`, (done) => {
      passwordLogin((err, res) => {
         if(err) done(new Error(`Failed to initialize cloud process. Login failed.`));
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

   it('can upload db-backup files', (done) => {
      dbBackupFiles(getToken(), (err, res) => {
         if(err) done(new Error(`Failed to upload db-backup files.`));
         else done();
      })
   });
})