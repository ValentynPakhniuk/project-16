import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
// import { includes } from 'lodash';
import NewsApiService from './js/NewsApiService';

import './js/change-theme';

import Pagination from './js/pagination';

const pagination = new Pagination();
pagination.addEventListener('next-page-number', callback);
pagination.addEventListener('prew-page-number', callback);
pagination.addEventListener('select-page-number', callback);

pagination.setItemsPerPage(10);
pagination.setTotalItems(100);

function callback(e) {
  console.log(e);
}

console.dir(document.body);
