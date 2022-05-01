import { expect } from 'chai';
import { isDevelopment, initState, getRandomItem,
   setState, setToken, getToken, getClaims, isSubscriber,
   fakeEcPayATMInfo, fakeEcPayTradeResult
} from '@/utils';

import { removeSubscribes, login, subscribesIndex, notesCategories,
   createSubscribe, storeSubscribes, editBill, updateBill, fakePay
} from '@/actions';
import { ATM, CREDIT } from '@/consts';

if(isDevelopment()){
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

initState();


describe('Pay by CREDIT Test', () => {
   var context = {
      current: null,
      bills: [],
      records: [],
      plan: null,
      payWays: [],
      canCreate: false,

      billEditForm: null,
      ecPayTradeModel: null,
      fakeATMInfo: null,
   };

   const getSubscribeIndex = (done) => {
      subscribesIndex(getToken(), (err, res) => {
         if (err) return done(err);
         else {
            let model = res.body;
            context.current = model.current;
            context.bills = model.bills;
            context.records = model.records;
            context.plan = model.plan;
            context.payWays = model.payWays;
            context.canCreate = model.canCreate;
   
            done();
         }
      });
   }

   const submitLogin = (done) => {
      login((err, res) => {
         if (err) return done(err);
         else {
            let model = res.body;
            let token = model.accessToken.token;
            let refreshToken =  model.refreshToken;
            setToken(token);
            setState('refreshToken', refreshToken);
            done();
         }
      });
   }

   it('can login', submitLogin);

   it('get subscribe index', getSubscribeIndex);

   it('assert before pay', (done) => {
      //當前訂閱應為null
      expect(context.current, 'current should be null').to.be.a('null');
      // 應有一筆帳單紀錄
      expect(context.bills, 'bills should be a array').to.be.an('array');
      expect(context.bills, 'bills should have length of 1').to.have.lengthOf(1);

      
      done();
      

   });

   //模擬在訂單紀錄頁面, 選取一筆未支付的訂單
   it('edit bill', (done) => {
      let bill = context.bills[0];
      editBill(bill.id, getToken(), (err, res) => {
         if (err) return done(err);
         else {
            let model = res.body;
            context.billEditForm = model;
            done();
         }
      });
   });

   //begin 創建新的Pay (新的CREDIT付款資訊)
   it('can create another pay (ATM)', (done) => {
      let bill = context.billEditForm.bill;
      //將payway改成credit
      let payway = context.billEditForm.payWays.find(item => item.code === CREDIT);
      if(payway) bill.payWayId = payway.id;
      else throw new Error(`payway not found (code: ${CREDIT})`);

      
      updateBill(getToken(), bill, (err, res) => {
         if (err) return done(err);
         else {
            context.ecPayTradeModel = res.body;
            done();
         }
      })

   });

   it('assert ecPayTradeModel', (done) => {
      let ecPayTradeModel = context.ecPayTradeModel;
      //是否有SPToken
      expect(ecPayTradeModel).to.not.be.a('null', 'ecPayTradeModel should not be null');
      expect(ecPayTradeModel.hasToken, 'ecPayTradeModel should has SPToken').to.be.true;
      

      //確認PaymentType
      expect(ecPayTradeModel.paymentType === CREDIT, 'PaymentType should be CREDIT').to.be.true;

      done();

   });

   it('edit bill', (done) => {
      let bill = context.bills[0];
     
      editBill(bill.id, getToken(), (err, res) => {
         if (err) return done(err);
         else {
            let model = res.body;
            context.billEditForm = model;
            done();
         }
      });
   });

   it('send fake EcPay CREDIT TradeResult', (done) => {
      let merchantTradeNo = context.ecPayTradeModel.tokenModel.merchantTradeNo;
      
      let bill = context.billEditForm.bill;
      let pay = bill.pays.find(x => x.code === merchantTradeNo);

      expect(pay).to.not.be.a('null', `pay should be found by merchantTradeNo: ${merchantTradeNo}`);
      
      let fakeTradeResult = fakeEcPayTradeResult(pay, bill.needPayMoney);
      context.fakeTradeResult = fakeTradeResult;

      let data = JSON.stringify(fakeTradeResult);
      fakePay(data, (err, res) => {
         if(err) return done(err);
         else {
            expect(res.text).to.be.a('string');
            expect(res.text, 'should return 1|OK').to.equal('1|OK');
            done();
         }
      })
   });


   it('get subscribe index', getSubscribeIndex);

   it('assert after payed', (done) => {
      
      //應有當前訂閱null
      let currentSubscribe = context.current;
      
      expect(currentSubscribe).to.be.an('object', 'should have current subscribe');
      expect(currentSubscribe.active, 'currentSubscribe should be active').to.be.true;
      
      expect(context.plan).to.be.a('null', 'should has no plan can subscribe');


      //應有一筆訂閱紀錄
      expect(context.records).to.be.an('array').to.have.lengthOf(1);
      expect(context.records[0].id).to.equal(currentSubscribe.id);
      
      // 應有一筆帳單紀錄
      expect(context.bills, 'bills should be a array').to.be.an('array');
      expect(context.bills, 'bills should have length of 1').to.have.lengthOf(1);

      let bill = context.bills[0];
      console.log('bill', bill);
      expect(bill.id, 'check bill with currentSubscribe.bill').to.equal(currentSubscribe.bill.id);
      expect(bill.payed, 'bill.payed should be true').to.be.true;
      expect(parseInt(bill.amount), 'check bill amount & totalPayed').to.equal(parseInt(bill.totalPayed));

      expect(bill.deadLine, 'bill deadLine should be null').to.be.a('null');
      expect(bill.expired, 'bill expired should be fake').to.be.false;
      expect(bill.payInfo, 'bill payInfo should be null').to.be.a('null');

      //應該不可建立新的訂閱
      expect(context.canCreate, 'canCreate should be false').to.be.false;

      done();
      

   });

   it('can login', submitLogin);

   it('should be a subscriber', (done) => {

      let claims = getClaims();
      if(!claims) throw new Error(`get no claims`);

      expect(isSubscriber(claims), 'user isSubscriber should be true').to.be.true;
      done();
   });

   it('should can access for Notes', (done) => {
      notesCategories(getToken(), (err, res) => {
         if (err) return done(err);
         else done();
      }, 200)
   });


   //end 創建新的Pay (新的CREDIT付款資訊)
})