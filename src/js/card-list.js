export default class CardsList {
  #refPathInnerHTML;

  constructor(cardsListSelector) {
    this.#refPathInnerHTML = document.querySelector(cardsListSelector);
  }

  getCardsList(dataCardList) {
    console.dir(this.#refPathInnerHTML);
    [...this.#refPathInnerHTML.children].forEach(element => {
      if (!element.classList.contains('card__weather')) {
        this.#refPathInnerHTML.removeChild(element);
      }
    });

    this.#refPathInnerHTML.insertAdjacentHTML(
      'beforeend',
      this.#createCardsList(dataCardList)
    );
  }

  #createCardsList(dataCardList) {
    return dataCardList
      .map((elem, idx) => this.#createCard(elem, idx < 2 ? idx : idx + 1))
      .join('');
  }

  #createCard({ urlPhoto, category, title, text, date, url, alt, id }, order) {
    return `
        <li class="card" style="order: ${order}" id="${id}">
            <div class="block-photo">
            <img class="card-photo" src="${urlPhoto}" alt="${alt}">
            <p class="news-category-text">${category}</p>
            <p class="checked-news visually-hidden">Already read
                <svg class="checked-news-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.1882 3.59413C16.0324 3.59878 15.8844 3.66393 15.7757 3.77577L6.59995 12.9516L2.82417 9.17577C2.76888 9.11819 2.70266 9.07222 2.62939 9.04054C2.55611 9.00887 2.47725 8.99214 2.39742 8.99133C2.3176 8.99052 2.23842 9.00564 2.16451 9.03581C2.0906 9.06599 2.02346 9.11061 1.96701 9.16705C1.91057 9.2235 1.86595 9.29064 1.83578 9.36455C1.8056 9.43846 1.79048 9.51764 1.79129 9.59746C1.7921 9.67729 1.80883 9.75615 1.84051 9.82943C1.87218 9.9027 1.91815 9.96892 1.97573 10.0242L6.17573 14.2242C6.28826 14.3367 6.44085 14.3999 6.59995 14.3999C6.75906 14.3999 6.91165 14.3367 7.02417 14.2242L16.6242 4.62421C16.7109 4.53993 16.7701 4.43143 16.7941 4.31292C16.818 4.19441 16.8057 4.07141 16.7585 3.96006C16.7114 3.84871 16.6317 3.75419 16.53 3.6889C16.4282 3.6236 16.3091 3.59057 16.1882 3.59413Z" fill="#00DD73"/>
                </svg>
            </p>
            <button class="card-button add-favorite-btn" type="button">Add to favorite
                <svg class="card-button-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.66659 2C2.82592 2 1.33325 3.47733 1.33325 5.3C1.33325 6.77133 1.91659 10.2633 7.65858 13.7933C7.76144 13.8559 7.87952 13.889 7.99992 13.889C8.12032 13.889 8.2384 13.8559 8.34125 13.7933C14.0833 10.2633 14.6666 6.77133 14.6666 5.3C14.6666 3.47733 13.1739 2 11.3333 2C9.49258 2 7.99992 4 7.99992 4C7.99992 4 6.50725 2 4.66659 2Z" stroke="#4440F7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="card-button remove-favorite-btn visually-hidden" type="button">Remove from favorite
                <svg class="card-button-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.66683 2C2.82616 2 1.3335 3.47733 1.3335 5.3C1.3335 6.77133 1.91683 10.2633 7.65883 13.7933C7.76168 13.8559 7.87976 13.889 8.00016 13.889C8.12056 13.889 8.23864 13.8559 8.3415 13.7933C14.0835 10.2633 14.6668 6.77133 14.6668 5.3C14.6668 3.47733 13.1742 2 11.3335 2C9.49283 2 8.00016 4 8.00016 4C8.00016 4 6.5075 2 4.66683 2Z" fill="#4B48DA"/>
                </svg>
            </button>
            </div>
            <h2 class="card-title">${title}</h2>
            <p class="card-text">${text}</p>
            <div class="card-link">
                <p class="card-data">${date}</p>
                <a href="${url}" target="_blank" class="card-more-news">Read more</a>
            </div>
        </li>`;
  }
}
