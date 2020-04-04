import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/notes`;

const categories = () => BaseService.fetch(`${source}/categories`);

const fetch = (params) => BaseService.fetch(source, params);

const details = (id) => BaseService.fetch(`${source}/${id}`);

export default { categories, fetch, details };