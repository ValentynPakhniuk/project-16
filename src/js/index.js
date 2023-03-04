// import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
// import 'flatpickr/dist/flatpickr.min.css';
// import { includes } from 'lodash';
// import newsApiService from './NewsApiService';
// import weatherApiService from './WeatherApiService';

import './change-theme';
// import './filters';
// import './calendar';

// --> tmp
// import './popular-cards';
// import './cards';
// import './weather';
// import './filters';
// --> tmp

import Pagination from './pagination';
const pagination = new Pagination();
pagination.setItemsPerPage(10);

import RequestDataBaseControler from './request-database-controler';
const requestDataBaseControler = new RequestDataBaseControler();

requestDataBaseControler.searchLine = 'fds';
const data = async () => await requestDataBaseControler.requestData(1);
data().then(data => {
  console.dir(data);
  console.log(data.response.meta.hits);
  pagination.setTotalItems(data.response.meta.hits);
});
