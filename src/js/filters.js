import NewsApiService from './NewsApiService';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import axios from 'axios';

const categoryApiService = new NewsApiService();
const categories = getResponseCategory();
onResize();

window.addEventListener('resize', debounce(onResize, 500));

const refs = {
  categoriesContainer: document.querySelector('.js-category-container'),
  categoriesList: document.querySelector('.js-category'),
  categoriesOthersList: document.querySelector('.js-category-others'),
  othersTextInBtn: document.querySelector('.js-text-btn'),
  openOthersBtn: document.querySelector('.js-others-btn'),
  othersWrapper: document.querySelector('.js-others-wrapper'),
  othersIconOpen: document.querySelector('.others__icon-open'),
  othersIconClose: document.querySelector('.others__icon-close'),
  othersItemBtn: document.querySelector('.others__item-btn'),
};

async function getResponseCategory() {
  try {
    let categories = await categoryApiService.getCategories();
    let filteredCategories = categories.filter(function (category) {
      return category.section.indexOf(' ') === -1;
    });
    return filteredCategories;
  } catch (error) {
    Notiflix.Notify.warning(
      'No response category list from server. Please, try again later.'
    );
    console.log(error);
    return [];
  }
}

function onResize() {
  categories.then(renderByViewportWidth);
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
refs.openOthersBtn.addEventListener('click', onOthersBtnClick);
refs.categoriesList.addEventListener('click', onClickCategories);

function onClickOtherCategories(e) {
  let target = e.target;
  if (target.tagName != 'BUTTON') {
    return;
  } else {
    console.log(e);
    refs.othersTextInBtn.textContent = e.srcElement.textContent;
    refs.othersWrapper.classList.remove('is-open');
    refs.othersIconOpen.style.display = 'block';
    refs.othersIconOpen.style.fill = 'var(--clr-fill-toogle-ground)';
    refs.othersIconClose.style.display = 'none';
  }
}

function clearCategoriesMarkup() {
  refs.categoriesList.innerHTML = '';
  refs.categoriesOthersList.innerHTML = '';
}

function onOthersBtnClick(e) {
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
    refs.othersIconOpen.style.fill = 'var(--clr-categoty-btn)';
  } else {
    refs.openOthersBtn.classList.remove('others__btn-active');
  }
}

function onClickCategories(e) {
  refs.othersTextInBtn.textContent = 'Others';
  refs.othersWrapper.classList.remove('is-open');
  refs.openOthersBtn.classList.remove('others__btn-active');
  refs.othersIconOpen.style.fill = 'var(--clr-categoty-btn)';
}
