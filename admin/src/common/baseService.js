import axios from 'axios';
import { buildQuery } from '@/utils';

const BaseService = {	
	setHeader(token){
		if(token) token = axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		else axios.defaults.headers.common['Authorization'] = null;				
	},
   fetch(url, params){
		url = buildQuery(url, params);
     
      return new Promise((resolve, reject) => {
			axios.get(url)
				.then(response => {
					resolve(response.data);
				})
				.catch(error => {
					reject(error.response);
				})
      })
   },
   submit(requestType, url, data){
      return new Promise((resolve, reject) => {
			axios[requestType](url, data)
				.then(response => {
					resolve(response.data);
				})
				.catch(error => {
					reject(error.response);
				});
      });
  }
   
};

export default BaseService;