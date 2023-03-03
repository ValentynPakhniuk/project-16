import NewsApiService from './NewsApiService';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import axios from 'axios';

const categoryApiService = new NewsApiService();

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
// console.log(refs.othersIconOpen);

// const isFullCategoriesContainer = false;

export default async function getResponseCategory() {
  try {
    const response = await categoryApiService.getCategories();
    console.log(response);
    renderCategories(response);
    renderCategoriesOther(response);
  } catch (error) {
    Notiflix.Notify.warning(
      'No response category list from server. Please, try again later.'
    );
    console.log(error);
  }
}
getResponseCategory();

function renderCategories(response) {
  let markup = '';
  for (let i = 0; i <= 6; i++) {
    markup += `
            <li class="category__item">
            <button class="category__btn" type="button">${response[i].display_name}</button>
            </li>
            `;
  }
  refs.categoriesList.insertAdjacentHTML('beforeend', markup);
  return;
}

function renderCategoriesOther(response) {
  refs.othersTextInBtn.textContent = 'Others';
  console.log(refs.othersTextInBtn.textContent);
  let markup = '';
  for (let i = 7; i < 50; i++) {
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
