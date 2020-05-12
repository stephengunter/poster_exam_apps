import { expect } from 'chai';
import request from 'supertest';
import { API_URL, testAction, getAdminRequestModel
} from '@/utils';

export const subscribesIndex = (token, callback, expect = 200) => {
   request(API_URL)
   .get('/api/subscribes')      
   .set('Authorization', `Bearer ${token}`)
   .expect(expect)
   .end(callback)
};

export const createSubscribe = (token, callback, expect = 200) => {
   request(API_URL)
   .get('/api/subscribes/create')      
   .set('Authorization', `Bearer ${token}`)
   .expect(expect)
   .end(callback)
};

export const storeSubscribes = (token, model, callback, expect = 200) => {
   request(API_URL)
   .post('/api/subscribes')
   .set('Authorization', `Bearer ${token}`)  
   .send(model)
   .expect(expect)
   .end(callback)
};

export const removeSubscribes = (callback, expect = 200) => {
   request(API_URL)
   .post(testAction)      
   .send(getAdminRequestModel('remove-subsrcibes'))
   .expect(expect)
   .end(callback)
};