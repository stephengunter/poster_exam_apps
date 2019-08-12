import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source = `${API_URL}/categories`;

const CategoryService = {
   fetch(params) {
      let url = `${source}`;
		return BaseService.fetch(url, params);
   },
   create(){
      let url = `${source}/create`;
		return BaseService.fetch(url);
   },
   store(model){
      let url = `${source}`;
      return BaseService.submit('post', url, model);
   },
   edit(id){
      let url = `${source}/${id}/edit`;
		return BaseService.fetch(url);
   },
   update(model){
      let url = `${source}/${model.id}`;
      return BaseService.submit('put', url, model);
   },
   remove(id){
      let url = `${source}/${id}`;
      return BaseService.submit('delete', url);
   }
};

export default CategoryService;