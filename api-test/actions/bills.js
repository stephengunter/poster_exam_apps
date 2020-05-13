import { expect } from 'chai';
import request from 'supertest';
import { API_URL, testAction, getAdminRequestModel
} from '@/utils';

export const editBill  = (id, token, callback, expect = 200) => {
   request(API_URL)
   .get(`/api/bills/edit/${id}`)      
   .set('Authorization', `Bearer ${token}`)
   .expect(expect)
   .end(callback)
}

//create pay
export const updateBill = (token, model, callback, expect = 200) => {
   request(API_URL)
   .put(`/api/bills/${model.id}`)      
   .set('Authorization', `Bearer ${token}`)
   .send(model)
   .expect(expect)
   .end(callback)
};

//fake pay
export const fakePay = (data, callback, expect = 200) => {
   request(API_URL)
   .post(testAction)     
   .send(getAdminRequestModel('fake-pay', data))
   .expect(expect)
   .end(callback)
};


export const removeBill = (data, callback, expect = 200) => {
   request(API_URL)
   .post(testAction)      
   .send(getAdminRequestModel('remove-bill', data))
   .expect(expect)
   .end(callback)
};