export const PAGE_SIZE = 10;
export const STORAGE_KEY_FAVORITE = 'favoriteNews';
const date = new Date;
dateForKey = (`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
export const STORAGE_KEY_READ = dateForKey;
export const VISUALLY_HIDDEN_CLASS = 'visually-hidden';
export const REMOTE_FAVORITE_BTN = 'remove-favorite-btn';
export const REMOTE_READ_BTN = 'remove-read-btn';
export const ADD_FAVORITE_BTN = 'add-favorite-btn';
export const ADD_READ_BTN = 'card-more-news';
export const LIST_CARD_SELECTOR = '.list-card';



