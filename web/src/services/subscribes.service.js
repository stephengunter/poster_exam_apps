import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/api/subscribes`;

const index = (params) => BaseService.fetch(source, params);

const create = () => BaseService.fetch(`${source}/create`);

const store = (model) => BaseService.post(source, model);

export default { index, create, store };