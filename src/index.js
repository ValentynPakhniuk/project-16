import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
// import { includes } from 'lodash';
import NewsApiService from './js/NewsApiService';

import './js/change-theme';

import Pagination from './js/pagination';

const pagination = new Pagination();
pagination.addEventListener('next', callback);
pagination.addEventListener('prew', callback);
pagination.addEventListener('page', callback);

pagination.setItemsPerPage(10);
pagination.setTotalItems(70);

function callback(e) {
  console.log(e);
}
