import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/api/exams`;

const fetch = (params) => BaseService.fetch(source, params);

const create = (params) => BaseService.fetch(`${source}/create`, params);

const abort = (id) => BaseService.remove(`${source}/${id}`);

const update = (id, model) => BaseService.put(`${source}/${id}`, model);

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`);

const save = (id, model) => BaseService.put(`${source}/${id}/save`, model);

const store = (model) => BaseService.post(source, model);

const details = (id) => BaseService.fetch(`${source}/${id}`);

export default { fetch, create, abort, save, edit, update, store, details };