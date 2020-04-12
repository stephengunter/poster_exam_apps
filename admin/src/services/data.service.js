import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/data`;

const storeSubjectQuestions = (model) => BaseService.post(`${source}/subject-questions`, model);

const storeYearRecruits = (model) => BaseService.post(`${source}/year-recruits`, model);

export default { storeSubjectQuestions, storeYearRecruits };