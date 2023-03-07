import {
  STORAGE_KEY_FAVORITE,
  VISUALLY_HIDDEN_CLASS,
  REMOTE_FAVORITE_BTN,
  ADD_FAVORITE_BTN,
  LIST_CARD_SELECTOR,
} from './constants';

const FAVORITE_PAGE_PATH = '/favorite.html';

const newsList = document.querySelector(LIST_CARD_SELECTOR);
newsList.addEventListener('click', saveFavotiteNews);
newsList.addEventListener('click', removeFavorite);

function saveFavotiteNews(e) {
  e.preventDefault();
  if (e.target.classList.contains(ADD_FAVORITE_BTN)) {
    const elementBlockPhoto = e.target.parentElement;
    const elementCard = elementBlockPhoto.parentElement;

    const favoriteObj = {};
    favoriteObj.imgUrl = elementBlockPhoto.children[0].src;
    favoriteObj.category = elementBlockPhoto.children[1].innerText;
    favoriteObj.title = elementCard.children[1].innerText;
    favoriteObj.text = elementCard.children[2].innerText;
    favoriteObj.date = elementCard.children[3].children[0].innerText;
    favoriteObj.readMoreLink = elementCard.children[3].children[1].href;
    favoriteObj.id = elementCard.id;

    const savedApiData =
      JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITE)) || [];
    savedApiData.push(favoriteObj);

    localStorage.setItem(STORAGE_KEY_FAVORITE, JSON.stringify(savedApiData));

    // приховуємо "add to favorite", включаємо 'Remove from favorite'
    e.target.classList.add(VISUALLY_HIDDEN_CLASS);
    elementBlockPhoto.children[4].classList.remove(VISUALLY_HIDDEN_CLASS);
  }
}

function removeFavorite(e) {
  if (e.target.classList.contains(REMOTE_FAVORITE_BTN)) {
    const currentLi = e.target.parentElement.parentElement;
    const currentId = currentLi.id;

    const savedData =
      JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITE)) || [];

    const newSavedData = savedData.filter(item => item.id !== currentId);

    localStorage.setItem(STORAGE_KEY_FAVORITE, JSON.stringify(newSavedData));

    turnOffFavorite(currentLi);

    visibleNoData();
  }
}

function turnOffFavorite(elem) {
  if (window.location.pathname.includes(FAVORITE_PAGE_PATH)) {
    elem.remove();
  } else {
    elem
      .querySelector(`.${REMOTE_FAVORITE_BTN}`)
      .classList.add(VISUALLY_HIDDEN_CLASS);
    elem
      .querySelector(`.${ADD_FAVORITE_BTN}`)
      .classList.remove(VISUALLY_HIDDEN_CLASS);
  }
}

function visibleNoData() {
  if (window.location.pathname.includes(FAVORITE_PAGE_PATH)) {
    const savedData =
      JSON.parse(localStorage.getItem(STORAGE_KEY_FAVORITE)) || [];
    const noDataBlock = document.querySelector('.no-data .error');
    const containerCardList = document.querySelector('.container.list__cards');
    if (savedData.length == 0) {
      noDataBlock.querySelector('.title-error').innerHTML =
        'We haven’t found <br> favorite news';
      noDataBlock.classList.remove(VISUALLY_HIDDEN_CLASS);
      containerCardList.classList.add(VISUALLY_HIDDEN_CLASS);
    } else {
      noDataBlock.classList.add(VISUALLY_HIDDEN_CLASS);
      containerCardList.classList.remove(VISUALLY_HIDDEN_CLASS);
    }
  }
}

visibleNoData();
