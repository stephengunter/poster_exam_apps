import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/uploads`;

const fetch = (params) => BaseService.fetch(source, params);

const store = (model) => BaseService.post(source, model);

export default { fetch, store };