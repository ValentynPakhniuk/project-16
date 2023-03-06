import '/src/images/icons_heart.svg';
import NewsApiService from './NewsApiService';
import { getCard } from './cards.js';

const newsPopular = new NewsApiService();
const refs = {
  listCards: document.querySelector('.list-card'),
};

const getUrl = el => {
  if (el.media.length === 0) {
    return 'https://image-placeholder.com/images/actual-size/200x200.png';
  }
  const photosArray = el.media[0];
  const photos = photosArray['media-metadata'];
  const photosEl = photos[2].url;
  return photosEl;
};

const getPopularNews = async () => {
  const results = await newsPopular.getPopular();
  const cardNews = results
    .map(result => {
      const card = getCard(
        getUrl(result),
        result.section,
        checkTitleLength(result.title),
        checkTextLength(result.abstract),
        result.published_date,
        result.url
      );
      return card;
    })
    .join('');
  refs.listCards.insertAdjacentHTML('beforeend', cardNews);
};

const checkTextLength = text => {
  if (text.length > 150) {
    return text.slice(0, 150) + '...';
  }
  return text;
};

const checkTitleLength = title => {
  if (title.length > 50) {
    return title.slice(0, 50) + '...';
  }
  return title;
};

getPopularNews();
