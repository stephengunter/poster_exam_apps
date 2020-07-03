import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/settings`;

const findExamSettings = (params) => BaseService.fetch(`${source}/exam`, params);

const saveExamSettings = (model) => BaseService.post(`${source}/exam`, model);

export default { findExamSettings, saveExamSettings };