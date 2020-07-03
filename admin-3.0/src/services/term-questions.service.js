import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/termQuestions`;

const fetch = (params) => BaseService.fetch(source, params);

const store = (model) => BaseService.post(source, model);

const remove = (model) => BaseService.post(`${source}/remove`, model);

export default { fetch, store, remove };