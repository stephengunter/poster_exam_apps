import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/options`;

const store = (model) => BaseService.post(source, model);

export default { store };