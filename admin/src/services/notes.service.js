import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/notes`;

const categories = () => BaseService.fetch(`${source}/categories`);

const fetch = (params) => BaseService.fetch(source, params);

const create = (params) => BaseService.fetch(`${source}/create`, params);

const store = (model) => BaseService.post(source, model);

const update = (id, model) => BaseService.put(`${source}/${id}`, model);

const order = (model) => BaseService.post(`${source}/order`, model);

const remove = (id) => BaseService.remove(`${source}/${id}`);

export default { categories, fetch, create, store, update, order, remove };