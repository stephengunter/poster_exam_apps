import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/api/bills`;

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`);

const update = (id, model) => BaseService.put(`${source}/${id}`, model);

const details = (id) => BaseService.fetch(`${source}/${id}`);

export default { edit, update, details };