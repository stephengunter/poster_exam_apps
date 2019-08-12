import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source = `${API_URL}/auth`;

const AuthService = {
   refreshToken(credentials){
      let url = `${source}/RefreshToken`;
      let method = 'post';
      return BaseService.submit(method, url, credentials);
   },
   login(credentials) {
      let url = `${source}/login`;
      let method = 'post';
      return BaseService.submit(method, url, credentials);
   },
};

export default AuthService;