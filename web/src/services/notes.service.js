import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/notes`;

const categories = () => BaseService.fetch(`${source}/categories`);

const fetch = (params) => BaseService.fetch(source, params);

export default { categories, fetch };