import { expect } from 'chai';
import request from 'supertest';
import { API_URL, getAdminRequestModel
} from '@/utils';

export const dbBackup = (token, callback, expect = 200) => {
   request(API_URL)
   .post('/admin/db/backup')      
   .set('Authorization', `Bearer ${token}`)
   .send(getAdminRequestModel('db-backup'))
   .expect(expect)
   .end(callback)
};
