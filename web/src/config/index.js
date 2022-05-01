import { isTrue } from '@/utils';
export const APP_CLOSED = isTrue(process.env.VUE_APP_CLOSE);
export const PRODUCTION = process.env.NODE_ENV === 'production';
export const SITE_URL = process.env.VUE_APP_URL;
export const SITE_TITLE = process.env.VUE_APP_TITLE;
export const API_URL = process.env.VUE_APP_API_URL;

export const LOGO_SRC = './img/logo.png';
//AUTH
export const GOOGLE_AUTH_PARAMS = {
   clientId: process.env.VUE_APP_GOOGLE_AUTH_CLIENT_ID,
   scope: 'email',
   discoveryDocs: ['https://people.googleapis.com/$discovery/rest?version=v1']
};


export const GOOGLE_RECAPTCHA_PARAMS = {
   sitekey: process.env.VUE_APP_GOOGLE_RECAPTCHA_SITEKEY,
};


//UI
export const DIALOG_MAX_WIDTH = 420;

export const NOTES_SETTINGS = {
   subjects: [{
      id: 1, text: '臺灣自然及人文地理', showTerm: false, modes: [{
         text: '全部內容', value: 0
      },{
         text: '重點濃縮', value: 1
      }]
   },{
      id: 2, text: '郵政法大意及交通安全常識', showTerm: true, modes: []
   }]
};