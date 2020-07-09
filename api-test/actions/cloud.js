import { expect } from 'chai';
import request from 'supertest';
import { API_URL, getAdminRequestModel
} from '@/utils';

export const dbBackupFiles = (token, callback, expect = 200) => {
   request(API_URL)
   .post('/admin/clouds')      
   .set('Authorization', `Bearer ${token}`)
   .send(getAdminRequestModel('upload db-backup files'))
   .expect(expect)
   .end(callback)
};
