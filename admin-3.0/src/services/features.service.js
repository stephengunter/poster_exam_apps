import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/features`;

const create = () => BaseService.fetch(`${source}/create`);

const store = (model) => BaseService.post(source, model);

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`);

const update = (id, model) => BaseService.put(`${source}/${id}`, model);

const order = (model) => BaseService.post(`${source}/order`, model);

const remove = (id) => BaseService.remove(`${source}/${id}`);

export default { create, store, edit, update, order, remove };