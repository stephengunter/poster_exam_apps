import BaseService from '@/common/baseService';
import { SITE_URL } from '@/config';

const source =`${SITE_URL}/api/exams`;

const fetch = (params) => BaseService.fetch(source, params);

const create = (params) => BaseService.fetch(`${source}/create`, params);

const abort = (id) => BaseService.remove(`${source}/${id}`);

const save = (id, model) => BaseService.put(`${source}/${id}`, model);

const edit = (id) => BaseService.fetch(`${source}/edit/${id}`);

export default { fetch, create, abort, save, edit };