import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/analysis`;

const index = () => BaseService.fetch(source);

const rq = (params) => BaseService.fetch(`${source}/rq`, params);

export default { index, rq };