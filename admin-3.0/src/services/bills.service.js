import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/bills`;

const fetch = (params) => BaseService.fetch(source, params);

const details = (id) => BaseService.fetch(`${source}/${id}`);

const clear = (plan) => BaseService.put(`${source}/clear/${plan}`);

export default { fetch, details, clear };