import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import zh_TW from 'vee-validate/dist/locale/zh_TW';

Vue.use(VeeValidate);

Validator.localize('zh_TW', zh_TW);

const dictionary = {
   zh_TW: {
      messages: {
        email: () => '請輸入正確的Email格式',
        required: ( field )=> '請輸入' + field
      },
      attributes:{
         name: '名稱',
         email: 'Email',
         oldPassword:'舊密碼',
         password:'密碼',
         confirmPassword:'確認密碼',
         fullname:'姓名',
         phone: '手機',
         code: '代碼',
         description: '說明',
      }
   }
};
Validator.localize(dictionary);

Validator.extend('phone', {
   getMessage: field => field + '格式不正確',
   validate: value => {
      if(!value) return true;
      return !isNaN(value);
   }
});