import NewsApiService from './NewsApiService';

const newsPopular = new NewsApiService();
const refs = {
    listCards: document.querySelector('.list-card'),
};

const getPopularNews = async () => {
    const results = await newsPopular.getPopular();
    // const test = results.map(result => console.log(result));
    const cardNews = results
    .map(
        result => { 
            const title = checkTitleLength(result.title);
            const text = checkTextLength(result.abstract);
            const url = getUrl(result);
            const card = `<li class="card">
            <div class="block-photo">
            <img class="card-photo" src="${url}" alt="Сітка користувачів">
            <p class="news-category-text">${result.section}</p>
            <p class="checked-news visually-hidden">Already read
                <svg class="checked-news-icon" width="18" height="18">
                    <use href="/src/images/icons_heart.svg#icons_bird"></use>
                </svg>
            </p>
            <button class="card-button add-favorite-btn" type="button">Add to favorite<svg class="card-button-icon" width="16" height="16">
                    <use href="/src/images/icons_heart.svg#icons_heart"></use>
                </svg>
            </button>
            <button class="card-button remove-favorite-btn visually-hidden" type="button">Remove from favorite<svg class="card-button-icon" width="16" height="16">
                    <use href="/src/images/icons_heart.svg#icons_heart-checked"></use>
                </svg>
            </button>
        </div>
        <h2 class="card-title">${title}</h2>
        <p class="card-text">${text}</p>
        <div class="card-link">
            <p class="card-data">${result.published_date}</p>
            <a href="${result.url}" target="_blank" class="card-more-news">Read more</a>
        </div>
    </li>`;
            return card;
        })
    .join('');
    refs.listCards.insertAdjacentHTML('beforeend', cardNews);
}

getPopularNews()

const getUrl = el => {
    const photosArray = el.media[0];
    const photos = photosArray['media-metadata'];
    const photosEl = photos[2].url;
    return photosEl;
};

const checkTextLength = text => {
    if (text.length > 150) {
        return text.slice(0, 150) + "..."
    }
    return text
}

const checkTitleLength = title => {
    if (title.length > 50) {
        return title.slice(0, 50) + '...';
    }
    return title;
};