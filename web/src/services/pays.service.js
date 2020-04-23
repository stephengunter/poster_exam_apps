import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/api/pays`;

const store = (model) => BaseService.post(source, model);

export default { store };