import BaseService from '@/common/baseService';

const source =`https://localhost:44356/api/ecpay/store`;

const store = (model) => BaseService.post(source, model);

export default { store };