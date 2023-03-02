import NewsApiService from './NewsApiService';

const newsPopular = new NewsApiService();
const refs = {
    listCards: document.querySelector('.list-card'),
};

const link =
'https://static01.nyt.com/images/2023/03/01/multimedia/01xp-whiskey-fugus-03/01xp-whiskey-fugus-03-mediumThreeByTwo440.jpg';

const getPopularNews = async () => {
    const results = await newsPopular.getPopular();
    const test = results.map(result => console.log(result));
    const cardNews = results
    .map(
        result => { 
            const photosArray = result.media[0];
            const photos = photosArray['media-metadata'];
            const photosEl = photos[2].url;
            return `<li class="card">
            <div class="block-photo">
            <img class="card-photo" src="${photosEl}" alt="Сітка користувачів">
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
        <h2 class="card-title">${result.title}</h2>
        <p class="card-text">${result.abstract}</p>
        <div class="card-link">
            <p class="card-data">${result.published_date}</p>
            <a href="${result.url}" target="_blank" class="card-more-news">Read more</a>
        </div>
    </li>`;
        })
    .join('');
    refs.listCards.insertAdjacentHTML('beforeend', cardNews);
}

getPopularNews()


