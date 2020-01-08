import BaseService from '@/common/baseService';
import { SITE_URL } from '@/config';

const source =`${SITE_URL}/api/admin/uploads`;

const store = (model) => BaseService.post(source, model);

export default { store };