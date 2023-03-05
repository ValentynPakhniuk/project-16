import NewsApiService from './NewsApiService';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import axios from 'axios';

const categoryApiService = new NewsApiService();

window.addEventListener('resize', debounce(onResize, 300));

const refs = {
  categoriesContainer: document.querySelector('.js-category-container'),
  categoriesList: document.querySelector('.js-category'),
  categoriesOthersList: document.querySelector('.js-category-others'),
  othersTextInBtn: document.querySelector('.js-text-btn'),
  openOthersBtn: document.querySelector('.js-others-btn'),
  othersWrapper: document.querySelector('.js-others-wrapper'),
  othersIconOpen: document.querySelector('.others__icon-open'),
  othersIconClose: document.querySelector('.others__icon-close'),
};

export default async function getResponseCategory() {
  try {
    const response = await categoryApiService.getCategories();
    renderByViewportWidth(response);
  } catch (error) {
    Notiflix.Notify.warning(
      'No response category list from server. Please, try again later.'
    );
    console.log(error);
  }
}

function onResize(e) {
  getResponseCategory();
}

function renderByViewportWidth(response) {
  if (window.matchMedia('(min-width: 1280px)').matches) {
    clearCategoriesMarkup();
    renderCategoriesDesktop(response);
    renderCategoriesOtherDesktop(response);
  } else if (window.matchMedia('(min-width: 768px)').matches) {
    clearCategoriesMarkup();
    renderCategoriesTablet(response);
    renderCategoriesOtherTablet(response);
  } else {
    clearCategoriesMarkup();
    renderCategoriesOtherMobile(response);
  }
}

function renderCategoriesDesktop(response) {
  let markup = '';
  for (let i = 0; i < 6; i++) {
    markup += `
            <li class="category__item">
            <button class="category__btn" type="button">${response[i].display_name}</button>
            </li>
            `;
  }
  refs.categoriesList.insertAdjacentHTML('beforeend', markup);
  return;
}

function renderCategoriesOtherDesktop(response) {
  refs.othersTextInBtn.textContent = 'Others';
  let markup = '';
  for (let i = 6; i < response.length; i++) {
    markup += `
          <li class="others__item">
            <button class="others__item-btn">${response[i].display_name}</button>
          </li>
            `;
  }
  refs.categoriesOthersList.insertAdjacentHTML('beforeend', markup);
  return;
}

function renderCategoriesTablet(response) {
  let markup = '';
  for (let i = 0; i < 4; i++) {
    markup += `
            <li class="category__item"><button class="category__btn" type="button">${response[i].display_name}</button></li>
            `;
  }
  refs.categoriesList.insertAdjacentHTML('beforeend', markup);
  return;
}

function renderCategoriesOtherTablet(response) {
  refs.othersTextInBtn.textContent = 'Others';
  let markup = '';
  for (let i = 4; i < response.length; i++) {
    markup += `
          <li class="others__item">
            <button class="others__item-btn">${response[i].display_name}</button>
          </li>
            `;
  }
  refs.categoriesOthersList.insertAdjacentHTML('beforeend', markup);
  return;
}

function renderCategoriesOtherMobile(response) {
  refs.othersTextInBtn.textContent = 'Categories';
  let markup = '';
  for (let i = 0; i < response.length; i++) {
    markup += `
          <li class="others__item">
            <button class="others__item-btn">${response[i].display_name}</button>
          </li>
            `;
  }
  refs.categoriesOthersList.insertAdjacentHTML('beforeend', markup);
  return;
}

refs.categoriesOthersList.addEventListener('click', onClickOtherCategories);

function onClickOtherCategories(e) {
  refs.othersWrapper.classList.remove('is-open');
  refs.openOthersBtn.classList.remove('others__btn-active');
  refs.othersIconOpen.style.display = 'block';
  refs.othersIconClose.style.display = 'none';
}

function clearCategoriesMarkup() {
  refs.categoriesList.innerHTML = '';
  refs.categoriesOthersList.innerHTML = '';
}

refs.openOthersBtn.addEventListener('click', onBtnClick);

function onBtnClick(e) {
  refs.othersWrapper.classList.toggle('is-open');
  refs.othersIconOpen.style.display = refs.othersWrapper.classList.contains(
    'is-open'
  )
    ? 'none'
    : 'block';
  refs.othersIconClose.style.display = refs.othersWrapper.classList.contains(
    'is-open'
  )
    ? 'block'
    : 'none';
  if (refs.othersWrapper.classList.contains('is-open')) {
    refs.openOthersBtn.classList.add('others__btn-active');
  } else {
    refs.openOthersBtn.classList.remove('others__btn-active');
  }
}
