import { expect } from 'chai';
import request from 'supertest';
import { API_URL, ADMIN_USER, ADMIN_PASSWORD,
   testAction, getAdminRequestModel
} from '@/utils';

export const login = (callback, expect = 200) => {
   request(API_URL)
   .post(testAction)      
   .send(getAdminRequestModel('login'))
   .expect(expect)
   .end(callback)
};

export const passwordLogin = (callback, expect = 200) => {
   request(API_URL)
   .post('/auth')      
   .send({
      username: ADMIN_USER,
      password: ADMIN_PASSWORD
   })
   .expect(expect)
   .end(callback)
};