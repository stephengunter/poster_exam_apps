import { isDevelopment } from '@/utils';

if(isDevelopment()){
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

let testList = [
   { name: 'Subscribes', path: './subscribes/index.js' },
];


testList.forEach(item => {
   require(item.path);
})
