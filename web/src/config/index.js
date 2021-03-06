export const PRODUCTION = false;
export const SITE_URL = PRODUCTION ? 'https://poster.exam-learner.com' : 'http://localhost:8080';
export const SITE_TITLE = '郵差考試學習器';
export const LOGO_SRC = './img/logo.png';
export const API_URL = PRODUCTION ? 'https://poster-api.exam-learner.com' : 'http://localhost:54741';

//AUTH
export const GOOGLE_AUTH_PARAMS = {
   client_id: PRODUCTION ? '54788512269-m8q9l3r9rr9igji0vge4iskub6e8t5ce.apps.googleusercontent.com' : '753186496069-ru78fhjhbdvif7dqhskiq8j3ln9ab777.apps.googleusercontent.com',
   scope: 'email'
};

export const GOOGLE_RECAPTCHA_PARAMS = {
   sitekey: PRODUCTION ? '6Leeu_QUAAAAAGZf2QcUPkexxklK3Rkj__qL-Kj7' : '6LeWpPMUAAAAAFEPuds36P9BawyiymYtZDo2eynh'  
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