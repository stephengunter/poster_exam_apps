import BaseService from '@/common/baseService';
import { SITE_URL } from '@/config';

const source =`${SITE_URL}/api/admin/options`;

const store = (model) => BaseService.post(source, model);

export default { store };