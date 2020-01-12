import BaseService from '@/common/baseService';
import { SITE_URL } from '@/config';

const source =`${SITE_URL}/api/admin/resolves`;

const fetch = (params) => BaseService.fetch(source, params);

const store = (model) => BaseService.post(source, model);

const update = (id, model) => BaseService.put(`${source}/${id}`, model);

const remove = (id) => BaseService.remove(`${source}/${id}`);

export default { fetch, store, update, remove };