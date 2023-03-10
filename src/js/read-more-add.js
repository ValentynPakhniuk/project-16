import {
  STORAGE_KEY_READ,
  VISUALLY_HIDDEN_CLASS,
  ADD_READ_BTN,
  REMOTE_READ_BTN,
  ADD_FAVORITE_BTN,
  LIST_CARD_SELECTOR,
} from './constants';

const READ_MORE_PAGE_PATH = '/read.html';

const newsList = document.querySelector(LIST_CARD_SELECTOR);
newsList.addEventListener('click', saveReadNews);
let idFrom = [];
let readfromobj;
function saveReadNews(e) {
  if (e.target.classList.contains(ADD_READ_BTN)) {
    const date = new Date();
    const dateForKey = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
    const elementBlockPhoto2 = e.target.parentElement;

    const elementCard = elementBlockPhoto2.parentElement;
    const elementBlockPhoto = elementCard.children[0];

    const readObj = {};
    readObj.imgUrl = elementBlockPhoto.children[0].src;

    readObj.category = elementBlockPhoto.children[1].innerText;
    readObj.title = elementCard.children[1].innerText;
    readObj.text = elementCard.children[2].innerText;
    readObj.date = elementCard.children[3].children[0].innerText;
    readObj.readMoreLink = elementCard.children[3].children[1].href;
    readObj.id = elementCard.id;
    readfromobj = readObj.id;

    if (idFrom.includes(readObj.id)) {
      return;
    }
    const savedApiData2 =
      JSON.parse(localStorage.getItem(STORAGE_KEY_READ)) || {};

    if (savedApiData2[dateForKey]) {
      savedApiData2[dateForKey].push(readObj);
    } else {
      savedApiData2[dateForKey] = [readObj];
    }

    localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(savedApiData2));
  }
}

function visibleReadNoData() {
  if (window.location.pathname.includes(READ_MORE_PAGE_PATH)) {
    const savedApiData2 =
      JSON.parse(localStorage.getItem(STORAGE_KEY_READ)) || [];
    const noDataBlock = document.querySelector('.no-data .error');
    const containerCardList = document.querySelector('.container.list__cards');
    if (savedApiData2.length == 0) {
      noDataBlock.querySelector('.title-error').innerHTML =
        'No read news found';
      noDataBlock.classList.remove(VISUALLY_HIDDEN_CLASS);
      containerCardList.classList.add(VISUALLY_HIDDEN_CLASS);
    } else {
      noDataBlock.classList.add(VISUALLY_HIDDEN_CLASS);
      containerCardList.classList.remove(VISUALLY_HIDDEN_CLASS);
    }
  }
}

visibleReadNoData();
