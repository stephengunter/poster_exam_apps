import { expect } from 'chai';
import request from 'supertest';
import { API_URL } from '@/utils';


export const notesCategories = (token, callback, expect = 200) => {
   request(API_URL)
   .get('/api/notes/categories')      
   .set('Authorization', `Bearer ${token}`)
   .expect(expect)
   .end(callback)
};