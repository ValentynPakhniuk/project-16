import throttle from 'lodash.throttle';
import debounce from 'lodash.debounce';
import { LIST_CARD_SELECTOR, VISUALLY_HIDDEN_CLASS } from './constants';

import Pagination from './pagination';
import CardsList from './card-list';
import RequestDataBaseControler from './request-database-controler';

import './change-theme';
import './weather';
import './mobile-menu';
import './filters';
import './calendar';
import './favorite-add';
import './read-more-add';
import './active-page';
/**
 * Блок пагінації,
 */
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
const cardsList = new CardsList(LIST_CARD_SELECTOR);

/**
 * Блок запуску пошуку по "пошуковому рядку"
 */
const refDate = document.querySelector('.calendar-input');
document
  .querySelector('#search-form')
  .addEventListener('submit', onSubmitSearchLine);
function onSubmitSearchLine(e) {
  e.preventDefault();
  requestDataBaseControler.searchLine =
    e.currentTarget.elements.search.value.trim();
  requestDataBaseControler.category = '';
  requestDataBaseControler.date = refDate.value;
  mainRequestData();
}

/**
 * пошук по даті
 */
export function onSelectDataByCalendar() {
  requestDataBaseControler.date = refDate.value;
  mainRequestData();
}

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
  .addEventListener('click', debounce(onClickCategories, 300));
function onClickCategories(e) {
  e.preventDefault();
  let category = '';
  if (e.target.classList.contains('category__btn')) {
    category = e.target.innerHTML;
  } else if (e.target.classList.contains('others__item-btn')) {
    category = e.target.innerHTML;
  }

  if (category.length > 0) {
    document.querySelector('#search').value = '';

    requestDataBaseControler.searchLine = '';
    requestDataBaseControler.category = category;
    requestDataBaseControler.date = refDate.value;
    mainRequestData();
  }
}

/**
 * Блок контрлера сторінки
 */
const requestDataBaseControler = new RequestDataBaseControler();
// функція формування наповнення карток на сторінці
const htmlCardList = document.querySelector('.list__cards');
const selectorClassNoData = '.error';
const refNoData = document.querySelector(selectorClassNoData);

function mainRequestData(pageNumber = 1) {
  htmlCardList.style.display = 'none';

  const data = requestDataBaseControler.requestData(pageNumber);

  refNoData.parentElement.classList.remove(VISUALLY_HIDDEN_CLASS);

  data.then(data => {
    // перевірка на відсутність даних у запиті
    if (data.hits > 0) {
      refNoData.classList.add(VISUALLY_HIDDEN_CLASS);
      refNoData.parentElement.classList.add(VISUALLY_HIDDEN_CLASS);
    } else {
      refNoData.classList.remove(VISUALLY_HIDDEN_CLASS);
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
