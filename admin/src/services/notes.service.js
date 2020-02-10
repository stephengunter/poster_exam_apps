import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/notes`;

const categories = () => BaseService.fetch(`${source}/categories`);

const fetch = (params) => BaseService.fetch(source, params);

const store = (model) => BaseService.post(source, model);

const update = (id, model) => BaseService.put(`${source}/${id}`, model);

const remove = (id) => BaseService.remove(`${source}/${id}`);

export default { categories, fetch, store, update, remove };