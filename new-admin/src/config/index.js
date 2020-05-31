export const PRODUCTION = false;
export const CLIENT_URL = PRODUCTION ? 'https://poster.exam-learner.com' : 'http://localhost:8080';
export const SITE_URL = PRODUCTION ? 'https://poster-admin.exam-learner.com' : 'http://localhost:8088';
export const SITE_TITLE = 'PosterExam 管理';


export const API_URL = PRODUCTION ? 'https://poster-api.exam-learner.com' : 'http://localhost:50070';

//AUTH
export const GOOGLE_AUTH_PARAMS = {
   client_id: PRODUCTION ? '54788512269-m8q9l3r9rr9igji0vge4iskub6e8t5ce.apps.googleusercontent.com' : '753186496069-ru78fhjhbdvif7dqhskiq8j3ln9ab777.apps.googleusercontent.com',
   scope: 'email'
};

//UI
export const DIALOG_MAX_WIDTH = 480;