import { expect } from 'chai';
import request from 'supertest';
import { API_URL, testAction, getAdminRequestModel
} from '@/utils';

export const login = (callback, expect = 200) => {
   request(API_URL)
   .post(testAction)      
   .send(getAdminRequestModel('login'))
   .expect(expect)
   .end(callback)
};