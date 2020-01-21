import BaseService from '@/common/baseService';
import { SITE_URL } from '@/config';

const source =`${SITE_URL}/api/recruitQuestions`;

const fetch = (params) => BaseService.fetch(source, params);

export default { fetch };