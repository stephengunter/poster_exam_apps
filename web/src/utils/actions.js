import { SELECT_RQS_MODE, STORE_EXAM,
   SAVE_EXAM, ABORT_EXAM, NEW_EXAM, FILTER_EXAMS
} from '@/store/actions.type';

const actions = [
//RQs
   {
   views: ['rqs'],
   name: SELECT_RQS_MODE,
   icon: 'mdi-settings-outline',
   title: '選擇模式',
   description: ''
},{
   views: ['rqs'],
   name: SAVE_EXAM,
   icon:'mdi-content-save-outline',
   title: '存檔',
   description: '存檔，保留此試券，下次繼續'
},{
   views: ['rqs'],
   name: STORE_EXAM,
   icon: 'mdi-check-circle-outline',
   title: '交券',
   description: '交券，計分與存檔'
},{
   views: ['rqs'],
   name: ABORT_EXAM,
   icon:'mdi-arrow-left-circle-outline',
   title: '放棄',
   description: '放棄，不存檔'
}
//Exams
,{
   views: ['exams'],
   name: FILTER_EXAMS,
   icon:'mdi-filter-outline',
   title: '篩選',
   description: '篩選測驗紀錄'
   
},{
   views: ['exams'],
   name: NEW_EXAM,
   icon:'mdi-plus-circle-outline',
   title: '新測驗',
   description: '開始新的模擬測驗'
}];


export const fetchActions = (view) => actions.filter(item => item.views.includes(view));