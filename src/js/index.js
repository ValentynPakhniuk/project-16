import throttle from 'lodash.throttle';

// import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
// import 'flatpickr/dist/flatpickr.min.css';
// import { includes } from 'lodash';
// import newsApiService from './NewsApiService';
// import weatherApiService from './WeatherApiService';

import './change-theme';
import './weather';
import './mobile-menu';
import './filters';
import './calendar';

// ToDo List
// Додати запит по категорії
// Підкючити календар на заповнення в параметр контролеру

// підправити класс формування карток
// підключити вибір категорії
// зробити 3 варіанти запитів до серверу

import Pagination from './pagination';
const pagination = new Pagination();
pagination.addEventListener('next-page-number', callbackMainRequest);
pagination.addEventListener('prew-page-number', callbackMainRequest);
pagination.addEventListener('select-page-number', callbackMainRequest);
pagination.setItemsPerPage(10);

function callbackMainRequest(e) {
  mainRequestData(e.page);
}

import RequestDataBaseControler from './request-database-controler';
const requestDataBaseControler = new RequestDataBaseControler();

import CardsList from './card-list';
const cardsList = new CardsList('.list-card');

document.querySelector('#search-form').addEventListener('submit', e => {
  e.preventDefault();
  requestDataBaseControler.searchLine =
    e.currentTarget.elements.search.value.trim();
  mainRequestData();
});

// requestDataBaseControler.date = '20230101';
//requestDataBaseControler.searchLine = 'magic cat';
// requestDataBaseControler.category = 'books';

window.addEventListener('resize', throttle(windowsResize, 300));
const listCards = document.querySelectorAll('.card');
const weather = document.querySelector('.card__weather');
function windowsResize(e) {
  if (window.screen.availWidth < 768) {
    weather.style.order = -1;
  } else if (window.screen.availWidth < 1280) {
    weather.style.order = 1;
  } else {
    weather.style.order = 3;
  }
}

const htmlCardList = document.querySelector('.list__cards');

function mainRequestData(pageNumber = 1) {
  htmlCardList.style.display = 'none';

  const data = requestDataBaseControler.requestData(pageNumber);

  data.then(data => {
    cardsList.getCardsList(data.data);
    if (requestDataBaseControler.page == 1) {
      pagination.setTotalItems(data.hits);
    }
    windowsResize();
    htmlCardList.style.display = 'block';
  });
}

mainRequestData();
