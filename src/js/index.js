import throttle from 'lodash.throttle';
import getResponseCategory from './filters';

import './change-theme';
import './weather';
import './mobile-menu';
import './filters';
getResponseCategory();
import './calendar';

/**
 * ToDo List
 * Додати запит по категорії
 * Підкючити календар на заповнення в параметр контролеру
 * підправити класс формування карток
 * підключити вибір категорії
 * підключити дату
 * зробити 3 варіанти запитів до серверу
 * адаптація для пагінатора
 */

/**
 * Блок пагінації,
 */
import Pagination from './pagination';
const pagination = new Pagination();
// перехоплення події натискання кнопок на пагінаторі
pagination.addEventListener('next-page-number', callbackMainRequest);
pagination.addEventListener('prew-page-number', callbackMainRequest);
pagination.addEventListener('select-page-number', callbackMainRequest);
// Колбек який викликає запит на нові статі по обраній на пагінаторі сторінці.
function callbackMainRequest(e) {
  mainRequestData(e.page);
}

/**
 * Блок формування списку карточок на сторінці
 */
import CardsList from './card-list';
const cardsList = new CardsList('.list-card');

/**
 * Блок запуску пошуку по "пошуковому рядку"
 */
document.querySelector('#search-form').addEventListener('submit', e => {
  e.preventDefault();
  requestDataBaseControler.searchLine =
    e.currentTarget.elements.search.value.trim();
  requestDataBaseControler.category = '';
  requestDataBaseControler.date = '';
  mainRequestData();
});

/**
 * Блок зміни позиції карточки з погодою в залежності від розміру екрану (мобайл, таблетка, десктоп)
 */
window.addEventListener('resize', throttle(windowsResize, 300));
const listCards = document.querySelectorAll('.card');
const weather = document.querySelector('.card__weather');
function windowsResize(e) {
  if (window.matchMedia('(min-width: 1280px)').matches) {
    weather.style.order = 3;
  } else if (window.matchMedia('(min-width: 768px)').matches) {
    weather.style.order = 1;
  } else {
    weather.style.order = -1;
  }
}

/**
 * Блок обробки вибору катерогії і дати
 */
const refCategories = document
  .querySelector('.category')
  .addEventListener('click', onClickCategories);
const refDate = document.querySelector('.calendar-input');
function onClickCategories(e) {
  e.preventDefault();
  let category = '';
  if (e.target.classList.contains('category__btn')) {
    category = e.target.innerHTML;
  } else if (e.target.classList.contains('others__item-btn')) {
    category = e.target.innerHTML;
  }

  if (category.length > 0) {
    requestDataBaseControler.searchLine = '';
    requestDataBaseControler.category = category;
    requestDataBaseControler.date = refDate.value;
    mainRequestData();
  }
}

/**
 * Блок контрлера сторінки
 */
import RequestDataBaseControler from './request-database-controler';
const requestDataBaseControler = new RequestDataBaseControler();
// функція формування наповнення карток на сторінці
const htmlCardList = document.querySelector('.list__cards');
const selectorClassNoData = '.error';
const refNoData = document.querySelector(selectorClassNoData);

function mainRequestData(pageNumber = 1) {
  htmlCardList.style.display = 'none';

  const data = requestDataBaseControler.requestData(pageNumber);

  data.then(data => {
    // перевірка на відсутність даних у запиті
    refNoData.classList.add('visually-hidden');
    if (data.hits <= 0) {
      refNoData.classList.remove('visually-hidden');
      return;
    }

    cardsList.getCardsList(data.data);
    if (requestDataBaseControler.page == 1) {
      pagination.setTotalItems(data.hits);
    }
    windowsResize();
    htmlCardList.style.display = 'block';
  });
}
// стартове заповнення сторінки картками
mainRequestData();
