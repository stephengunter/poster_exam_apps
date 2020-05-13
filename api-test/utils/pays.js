import moment from 'moment';
import { getNowText } from '@/utils';
import { ATM, CREDIT } from '@/consts';

const providerName = 'EcPay';
const fakeTradeNo =  '12345678';
const fakeBankCode =  '001';
const fakeBankAccount =  '9876543210';

const getExpireDate = () => moment().add(7, 'days').endOf('day').format('YYYY-MM-DD HH:mm:ss');

export const fakeEcPayATMInfo = (merchantTradeNo) => {
   return {
      provider: providerName,
      payWay: ATM,
      code: merchantTradeNo,
      tradeNo: fakeTradeNo,
      amount: 0,
      bankCode: fakeBankCode,
      bankAccount: fakeBankAccount,
      expireDate: getExpireDate(),
      payed: false,
      payedDate: '',
      data: ''
   };
};

export const fakeEcPayTradeResult = (pay, amount) => {
   return {
      provider: providerName,
      payWay: pay.payWay,
      code: pay.code,
      tradeNo: fakeTradeNo,
      amount: amount,
      bankCode: '',
      bankAccount: '',
      expireDate: '',
      payed: true,
      payedDate: getNowText(),
      data: ''
   };
};