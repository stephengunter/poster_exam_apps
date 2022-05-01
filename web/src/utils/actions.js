import { CANCEL, SUBMIT, SELECT,
   NOTE_CATEGORY, SEE_QUESTIONS,
   RQS_INDEX, SELECT_RQS_MODE, STORE_EXAM, DELETE_EXAM,
   SAVE_EXAM, ABORT_EXAM, NEW_EXAM, EXAM_RECORDS,
   FILTER_EXAMS, EXAM_SUMMARY,
   MANUAL_CATEGORY
} from '@/store/actions.type';

const actions = [
//Notes
{
   views: ['notes'],
   name: NOTE_CATEGORY,
   order: 0,
   type: SELECT,
   icon: 'mdi-format-list-bulleted',
   title: '筆記目錄',
   description: ''
},
{
   views: ['notes'],
   name: SEE_QUESTIONS,
   order: 0,
   type: SELECT,
   icon: 'mdi-database',
   title: '相關試題',
   description: ''
},
//RQs
{
   views: ['rqs'],
   name: RQS_INDEX,
   order: 0,
   type: SELECT,
   icon: 'mdi-database',
   title: '歷屆試題',
   description: ''
},{
   views: ['rqs'],
   name: SELECT_RQS_MODE,
   order: 0,
   type: SELECT,
   icon: 'mdi-cog-outline',
   title: '選擇模式',
   description: ''
},{
   views: ['rqs' , 'exams' , 'exam-new', 'exam-edit'],
   name: SAVE_EXAM,
   order: 1,
   type: SUBMIT,
   icon:'mdi-content-save-outline',
   title: '存檔',
   color: 'info',
   description: '存檔，保留此試券，下次繼續'
},{
   views: ['rqs' , 'exams' , 'exam-new', 'exam-edit'],
   name: STORE_EXAM,
   order: 2,
   type: SUBMIT,
   icon: 'mdi-check-circle-outline',
   title: '交券',
   color: 'success',
   description: '交券，計分與存檔'
},{
   views: ['rqs','exams', 'exam-new', 'exam-edit'],
   name: ABORT_EXAM,
   order: 1,
   type: CANCEL,
   icon:'mdi-arrow-left-circle-outline',
   color: '',
   title: '放棄',
   description: '放棄，不存檔'
}
//Exams
,{
   views: ['exams'],
   name: FILTER_EXAMS,
   order: 0,
   type: SELECT,
   icon:'mdi-filter-outline',
   title: '篩選',
   description: '篩選測驗紀錄'
   
},{
   views: ['exams', 'exam-new', 'exam-edit', 'exam-details'],
   name: EXAM_RECORDS,
   order: 0,
   type: SELECT,
   icon:'mdi-format-list-bulleted',
   title: '測驗紀錄',
   description: '測驗紀錄'
},{
   views: ['rqs' , 'exams', 'exam-new', 'exam-edit', 'exam-details'],
   name: EXAM_SUMMARY,
   order: 0,
   type: SELECT,
   icon: 'mdi-text-box-outline',
   title: '作答概況',
   description: '作答概況'
},{
   views: ['exams'],
   name: NEW_EXAM,
   order: 0,
   type: SELECT,
   icon:'mdi-plus-circle-outline',
   title: '新測驗',
   description: '開始新的模擬測驗'
},{
   views: ['exams', 'exam-edit', 'exam-details'],
   name: DELETE_EXAM,
   order: 5,
   type: CANCEL,
   icon:'mdi-delete-circle-outline',
   title: '刪除',
   color: 'error',
   description: '刪除這個測驗'
}
//Manuals
,{
   views: ['manuals'],
   name: MANUAL_CATEGORY,
   order: 0,
   type: SELECT,
   icon: 'mdi-format-list-bulleted',
   title: '目錄',
   description: ''
   
}
];


export const fetchViewActions = (view) => actions.filter(item => item.views.includes(view));

export const examActionNames = (exam) => {
   let names = [];
   if(!exam.isComplete) names = names.concat([SAVE_EXAM, STORE_EXAM]);

   if(exam.reserved) names.push(DELETE_EXAM);
   else names.push(ABORT_EXAM);
  
   return  names; 
}

export const examActions = (exam) => {
   let names = examActionNames(exam);
   return  actions.filter(item => names.includes(item.name)); 
}