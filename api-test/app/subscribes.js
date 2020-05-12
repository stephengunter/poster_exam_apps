import { expect } from 'chai';
import { isDevelopment, initState,
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



describe('Subscribes Test', () => {
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

   const createSubscribePage  = (done) => {
      createSubscribe(getToken(), (err, res) => {
         if (err) return done(err);
         else {
            let model = res.body;
            context.billEditForm = model;
            done();
         }
      });
   }
   
   

   //begin 移除(所有的)subscribes與角色
   it('can remove subscribes', (done) => {
      removeSubscribes((err, res) => {
         if(err) return done(err);
         else {
            done();
         }
      })
   });

   it('can login', submitLogin);

   it('should not a subscriber', (done) => {

      let claims = getClaims();
      if(!claims) throw new Error(`get no claims`);

      expect(isSubscriber(claims), 'user isSubscriber should be false').to.be.false;
      
      done();
     
   });

   it('should got  403 Forbidden for Notes', (done) => {
      notesCategories(getToken(), (err, res) => {
         if (err) return done(err);
         else done();
      }, 403)
   });

   it('get subscribe index', getSubscribeIndex);

   it('assert after remove subscribes', (done) => {
      //當前訂閱應為null
      expect(context.current, 'current should be null').to.be.a('null');
      //帳單紀錄應為空
      expect(context.bills, 'bills should be a empty array').to.be.an('array').that.is.empty;
      //訂閱紀錄應為空
      expect(context.records).to.be.an('array').that.is.empty;
      //payways不該為空
      expect(context.payWays).to.be.an('array');
      expect(context.payWays.length).to.not.equal(0);

      //應該有(active) plan
      expect(context.plan).to.not.be.a('null', '(active)plan should not be null');

      //應該可建立新的訂閱
      expect(context.canCreate, 'canCreate should be true').to.be.true;
      done();
      

   });


   //end 移除subscribes與角色

   //begin create subscribe
   it('create subscribe', createSubscribePage);

   it('assert billEditForm, before save.', (done) => {
      let bill = context.billEditForm.bill;

      expect(bill).to.not.be.a('null', 'bill model should not be null');
      expect(bill.id).to.equal(0, 'bill model id should be 0');

      let plan = context.billEditForm.plan;
      //應該有(active) plan
      expect(plan).to.not.be.a('null', '(active)plan should not be null');
      expect(plan.id).to.equal(context.plan.id, 'plan should be the same');

      //應該是原價, 無折扣
      expect(plan.hasDiscount, 'plan should not hasDiscount').to.be.false;
      

      let payWays = context.billEditForm.payWays;
      //payways不該為空
      expect(payWays).to.be.an('array');
      expect(payWays.length).to.not.equal(0);

      done();
      

   });

   it('store subscribe(create a new bill)', (done) => {
      let model = context.billEditForm.bill;
      model.planId = context.billEditForm.plan.id;

      let payway = context.billEditForm.payWays.find(item => item.code === ATM);
      if(!payway) throw new Error(`payway not found: ATM`);
      model.payWayId = payway.id; 

      storeSubscribes(getToken(), model, (err, res) => {
         if (err) return done(err);
         else {
            let model = res.body;
            context.billEditForm.bill = model;
            done();
         }
      })

   });

   it('assert new bill created', (done) => {
      let bill = context.billEditForm.bill;
      let plan = context.billEditForm.plan;

      //是否可支付
      expect(bill).to.not.be.a('null', 'bill model should not be null');
      expect(bill.payed, 'bill should not be payed').to.be.false;
      expect(bill.expired, 'bill should not be expired').to.be.false;
      
      //比對金額
      let amount = parseInt(bill.amount);
      let needPayMoney = parseInt(bill.needPayMoney);
      expect(amount).to.equal(needPayMoney, 'bill amount should = needPayMoney');

      expect(amount).to.equal(plan.price, 'bill amount should = plan price');
      //也應該等於原價, 無折扣
      let planMoney = parseInt(plan.money);
      expect(amount).to.equal(planMoney, 'bill amount should = plan money(no discount)');
      expect(bill.hasDiscount, 'bill should not hasDiscount').to.be.false;

      done();

   });
   //end create subscribe


   //begin create pay
   it('can create pay (ATM)', (done) => {
      let bill = context.billEditForm.bill;
      let payway = context.billEditForm.payWays.find(item => item.id === bill.payWayId);
      if(payway) {
         expect(payway.code === ATM, 'payway should be ATM').to.be.true;
      }else throw new Error(`payway not found (id: ${bill.payWayId})`);

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
      expect(ecPayTradeModel.paymentType === ATM, 'PaymentType should be ATM').to.be.true;

      done();

   });

   it('get subscribe index', getSubscribeIndex);

   it('assert after bill & pay created', (done) => {
      //當前訂閱應為null
      expect(context.current).to.be.a('null', 'current should be null');
      
      //應有一筆帳單紀錄
      expect(context.bills, 'bills should be a array').to.be.an('array');
      expect(context.bills, 'bills should have length of 1').to.have.lengthOf(1);


      
      done();
      

   });

   //模擬ATM帳號通知
   it('assert pay && ecPayTradeModel', (done) => {
      let ecPayTradeModel = context.ecPayTradeModel;

      let pays = context.bills[0].pays;
      expect(pays, 'bill should have a array of pays').to.be.an('array');
      expect(pays, 'pays should have length of 1').to.have.lengthOf(1);
      
      let pay = pays[0];
      expect(parseInt(pay.money)).to.equal(0, 'pay money should be 0');
      //確認payWay
      expect(pay.payWay === ATM, 'payWay should be ATM').to.be.true;
     
      let merchantTradeNo = ecPayTradeModel.tokenModel.merchantTradeNo;
      expect(pay.code === merchantTradeNo, '訂單號碼需相同').to.be.true;
      
      context.fakeATMInfo = fakeEcPayATMInfo(merchantTradeNo);

      done();

   });

   //傳送模擬的EcPay ATM Info
   it('fake EcPay ATM Info', (done) => {
      let data = JSON.stringify(context.fakeATMInfo);
      fakePay(data, (err, res) => {
         if(err) return done(err);
         else {
            expect(res.text).to.be.a('string');
            expect(res.text, 'should return 1|OK').to.equal('1|OK');
            done();
         }
      })
   });

   it('my subscribes page', getSubscribeIndex);

   it('assert after fake EcPay ATM Info saved', (done) => {
      
      //當前訂閱應為null
      expect(context.current).to.be.a('null', 'current should be null');
      
      // 應有一筆帳單紀錄
      expect(context.bills, 'bills should be a array').to.be.an('array');
      expect(context.bills, 'bills should have length of 1').to.have.lengthOf(1);

      let bill = context.bills[0];
      expect(bill.payed, 'bill.payed should be false').to.be.false;

      expect(bill.payInfo, 'bill should have payInfo').to.be.an('object');
      expect(bill.payInfo.id, 'check bill payInfo').to.equal(bill.pays[0].id);
      expect(parseInt(bill.payInfo.money), 'check bill payInfo money').to.equal(0);
      expect(bill.payInfo.bankAccount, 'check payInfo bankAccount').to.equal(context.fakeATMInfo.bankAccount);
     
      console.log('context', context);
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

   //嘗試新增或者編輯, 應該都是編輯同一筆"已存在, 未支付, 期限內"的訂單

   it('assert when edit bill', (done) => {
      
      let billEditForm = context.billEditForm;
      let bill = billEditForm.bill;
      expect(bill.id, 'should edit existing bill').to.equal(context.bills[0].id);
      expect(bill.payed, 'bill.payed should be false').to.be.false;
      expect(bill.expired, 'bill.expired should be false').to.be.false;
      done();

   });

   it('create subscribe', createSubscribePage);

   it('assert when try to create another subscribe', (done) => {
      
      let billEditForm = context.billEditForm;
      let bill = billEditForm.bill;
      expect(bill.id, 'should edit existing bill').to.equal(context.bills[0].id);
      expect(bill.payed, 'bill.payed should be false').to.be.false;
      expect(bill.expired, 'bill.expired should be false').to.be.false;
      done();

   });


   //fake pay by ATM
   // it('send fake EcPay TradeResult', (done) => {
   //    let bill = context.bills[0];
   //    let payInfo = bill.payInfo;

   //    let fakeTradeResult = fakeEcPayTradeResult(payInfo, bill.needPayMoney);
   //    context.fakeTradeResult = fakeTradeResult;

   //    let data = JSON.stringify(fakeTradeResult);
   //    fakePay(data, (err, res) => {
   //       if(err) return done(err);
   //       else {
   //          expect(res.text).to.be.a('string');
   //          expect(res.text, 'should return 1|OK').to.equal('1|OK');
   //          done();
   //       }
   //    })
   // });

   // it('get subscribe index', getSubscribeIndex);

   // it('assert after payed', (done) => {
      
      
   //    //應有當前訂閱null
   //    let currentSubscribe = context.current;
      
   //    expect(currentSubscribe).to.be.an('object', 'should have current subscribe');
   //    expect(currentSubscribe.active, 'currentSubscribe should be active').to.be.true;
      
   //    expect(context.plan).to.be.a('null', 'should has no plan can subscribe');


   //    //應有一筆訂閱紀錄
   //    expect(context.records).to.be.an('array').to.have.lengthOf(1);
   //    expect(context.records[0].id).to.equal(currentSubscribe.id);
      
   //    // 應有一筆帳單紀錄
   //    expect(context.bills, 'bills should be a array').to.be.an('array');
   //    expect(context.bills, 'bills should have length of 1').to.have.lengthOf(1);

   //    let bill = context.bills[0];
   //    expect(bill.id, 'check bill with currentSubscribe.bill').to.equal(currentSubscribe.bill.id);
   //    expect(bill.payed, 'bill.payed should be true').to.be.true;
      
   //    expect(bill.payInfo, 'bill payInfo should be null').to.be.a('null');

   //    //應該不可建立新的訂閱
   //    expect(context.canCreate, 'canCreate should be false').to.be.false;

   //    done();
      

   // });

   // it('can login', submitLogin);

   // it('should be a subscriber', (done) => {

   //    let claims = getClaims();
   //    if(!claims) throw new Error(`get no claims`);

   //    expect(isSubscriber(claims), 'user isSubscriber should be true').to.be.true;
   //    done();
   // });

   // it('should can access for Notes', (done) => {
   //    notesCategories(getToken(), (err, res) => {
   //       if (err) return done(err);
   //       else done();
   //    }, 200)
   // });

   //end create  pay

});