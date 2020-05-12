import moment from 'moment';

//let start = moment().add(7, 'days').startOf('day');
let end = moment().add(7, 'days').endOf('day');
console.log( end.format('YYYY-MM-DD HH:mm:ss'));