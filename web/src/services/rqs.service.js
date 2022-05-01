import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/api/recruitQuestions`;

const fetch = (params) => BaseService.fetch(source, params);

export default { fetch };