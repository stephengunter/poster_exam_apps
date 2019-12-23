import BaseService from '@/common/baseService';
import { SITE_URL } from '@/config';

const source =`${SITE_URL}/api/oauth`;

const googleLogin = (token) => BaseService.post(`${source}/google`, { token });

export default { googleLogin };