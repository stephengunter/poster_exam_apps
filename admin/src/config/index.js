export const PRODUCTION = false;
export const SITE_URL = PRODUCTION ? 'https://poster-admin.exam-learner.com' : 'https://localhost:8080';
export const SITE_TITLE = 'PosterExam 管理';

export const API_URL = PRODUCTION ? 'https://poster-api.exam-learner.com/api' : 'http://localhost:50070';

//AUTH
export const GOOGLE_AUTH_PARAMS = {
   client_id: PRODUCTION ? '54788512269-m8q9l3r9rr9igji0vge4iskub6e8t5ce.apps.googleusercontent.com' : '887790459951-h1iard4tmdafi630p7vlq25b63ujm35v.apps.googleusercontent.com',
   scope: 'email'
};

//UI
export const DIALOG_MAX_WIDTH = 480;