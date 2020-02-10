export const PRODUCTION = false;
export const SITE_URL = PRODUCTION ? 'https://posterexam-admin.waterapps.nctu.me.nctu.me' : 'https://localhost:8080';
export const SITE_TITLE = '郵差筆試學習器';
export const LOGO_SRC = './img/logo.png';
export const API_URL = PRODUCTION ? 'https://poster.waterapps.nctu.me/api' : 'https://localhost:44349/api';

//AUTH
export const GOOGLE_AUTH_PARAMS = {
   client_id: PRODUCTION ? '500246847220-bogdpfha4uhrise9i023e32t5vjkt2o5.apps.googleusercontent.com' : '887790459951-h1iard4tmdafi630p7vlq25b63ujm35v.apps.googleusercontent.com',
   scope: 'email'
};

//UI
export const DIALOG_MAX_WIDTH = 480;