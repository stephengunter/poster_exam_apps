import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/data`;

const storeSubjectQuestions = (model) => BaseService.post(`${source}/subject-questions`, model);

export default { storeSubjectQuestions };