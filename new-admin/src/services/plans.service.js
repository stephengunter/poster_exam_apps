import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/plans`;

const fetch = (params) => BaseService.fetch(source, params);

const create = (params) => BaseService.fetch(`${source}/create`, params);

const store = (model) => BaseService.post(source, model);

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`);

const update = (id, model) => BaseService.put(`${source}/${id}`, model);

const remove = (id) => BaseService.remove(`${source}/${id}`);

export default { fetch, create, store, edit, update, remove };