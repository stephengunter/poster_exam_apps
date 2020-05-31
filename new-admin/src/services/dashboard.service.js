import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const fetchExceptions = (params) => BaseService.fetch(`${API_URL}/admin/exceptions`, params);

export default { fetchExceptions };