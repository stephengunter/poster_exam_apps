import moment from 'moment';
import { expect } from 'chai';
import request from 'supertest';
import { isDevelopment, initState,
   API_URL, testAction, getAdminRequestModel
} from '@/utils';


if(isDevelopment()){
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

initState();

const apiKey = '92a0ca5759e143c9a71ac23690bda7a5';

describe('import fake notices', () => {
   var context = {
      models: [],
   };

   it('can fetch news api', (done) => {
      request('https://newsapi.org')
      .get(`/v2/top-headlines?country=cn&apiKey=${apiKey}&pageSize=100&page=1`)
      .expect(200)
      .end((err, res) => {
         if (err) return done(err);
         else {
            let news = res.body.articles;
            let models = [];
            for(let i = 0; i < news.length; i++) {
               let item = news[i];
               models.push({
                  title: item.title,
                  content: item.description,
                  public: true,
                  createdAt: item.publishedAt
               });
            }
            context.models = models;
            done();
         }
      })

   });

   it('submit', (done) => {
      let data = JSON.stringify(context.models);
   
      request(API_URL)
      .post(testAction)     
      .send(getAdminRequestModel('fake-notices', data))
      .expect(200)
      .end((err, res) => {
         if (err) return done(err);
         else {
            done();
         }
      })
   });


   
});