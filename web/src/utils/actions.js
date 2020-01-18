import { SELECT_RQS_MODE, STORE_EXAM,
   SAVE_EXAM, ABORT_EXAM
} from '@/store/actions.type';

const actions = [{
   views: ['rqs'],
   name: SELECT_RQS_MODE,
   icon: 'mdi-settings-outline',
   title: '選擇模式',
   description: ''
},{
   views: ['rqs'],
   name: STORE_EXAM,
   icon: 'mdi-check-circle-outline',
   title: '交券',
   description: '交券，計分與存檔'
},{
   views: ['rqs'],
   name: SAVE_EXAM,
   icon:'mdi-content-save-outline',
   title: '存檔',
   description: '存檔，保留此試券，下次繼續'
},{
   views: ['rqs'],
   name: ABORT_EXAM,
   icon:'mdi-arrow-left-circle-outline',
   title: '放棄',
   description: '放棄，不存檔'
}];


export const fetchActions = (view) => actions.filter(item => item.views.includes(view));