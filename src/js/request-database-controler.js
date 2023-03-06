import axios from 'axios';
import { PAGE_SIZE } from './constants';

const URL = 'https://api.nytimes.com';
const API_KEY = 'api-key=SWTGJZG6lt2ntZukcf6TH36zlYgqv0Eb';

const TMP_LINK = 'https://image-placeholder.com/images/actual-size/200x200.png';
const domain = 'https://static01.nyt.com/';
const httpProtocol = 'https://';

const REQUEST_TYPE = {
  NEWS: 'news',
  CATEGORY: 'category',
  POPULAR: 'popular',
};

/**
 * Контролер запитів до бекенду
 */
export default class RequestDataBaseControler {
  #searchParams = {
    searchLine: '',
    category: '',
    date: '',
    page: 0,
  };

  #requestURL = new RequestURL();
  #loadData = new LoadData();

  constructor() {}

  set searchLine(value) {
    this.#searchParams.searchLine = value;
  }
  get searchLine() {
    return this.#searchParams.searchLine;
  }

  set category(value) {
    this.#searchParams.category = value.trim();
  }

  get category() {
    return this.#searchParams.category;
  }

  set date(value) {
    this.#searchParams.date = this.#formatDate(value);
  }

  get date() {
    return this.#searchParams.date;
  }

  set page(value) {
    // приведення номера сторінки у відповідність до нумерації бекенда
    this.#searchParams.page = value <= 1 ? 0 : value - 1;
  }

  get page() {
    // приведення номера сторінки у відповідність до нумерації на фронті
    return this.#searchParams.page + 1;
  }

  async requestData(pageNumber = 1) {
    this.page = pageNumber;

    const resultFetchData = async () =>
      await this.#loadData.getData(
        this.#requestURL.getNewsRequestURL(this.#searchParams)
      );

    return await resultFetchData().then(data => {
      const resultData = this.#createResultData(
        data,
        this.#requestURL.getRequestType()
      );
      return resultData;
    });
  }

  // перетворення отриманих даних у результуючі в залежності від різних форматів у відповідях
  #createResultData(data, dataType) {
    const result = {
      hits: 0,
      data: [],
    };

    switch (dataType) {
      case REQUEST_TYPE.NEWS:
        result.hits = data.response.meta.hits;
        result.data = data.response.docs.map(elem => {
          const obj = {};
          obj.urlPhoto = this.#getUrlPhotoForNews(elem);
          obj.category = elem.section_name;
          obj.title = this.#checkTitleLength(elem.headline.main);
          obj.text = this.#checkTextLength(elem.abstract);
          obj.date = this.#getDate(elem.pub_date);
          obj.url = elem.web_url;
          obj.alt = 'no picture description';
          obj.id = elem.uri;
          return obj;
        });
        break;
      case REQUEST_TYPE.CATEGORY:
        // if (data.results === null) {
        //   break;
        // }
        // result.hits = data.results.length;
        // result.data = data.results
        //   .filter(
        //     (elem, idx) =>
        //       idx >= this.#searchParams.page * PAGE_SIZE &&
        //       idx < (this.#searchParams.page + 1) * PAGE_SIZE
        //   )
        //   .map(elem => {
        //     const obj = {};
        //     obj.urlPhoto = this.#getUrlPhotoForNews(elem);
        //     obj.category = elem.section;
        //     obj.title = this.#checkTitleLength(elem.title);
        //     obj.text = this.#checkTextLength(elem.abstract);
        //     obj.date = this.#getDate(elem.published_date);
        //     obj.url = elem.url;
        //     obj.alt = this.#getAltCategory(elem);
        //     obj.id = elem.uri;
        //     return obj;
        //   });
        result.hits = data.response.meta.hits;
        result.data = data.response.docs.map(elem => {
          const obj = {};
          obj.urlPhoto = this.#getUrlPhotoForNews(elem);
          obj.category = elem.section_name;
          obj.title = this.#checkTitleLength(elem.headline.main);
          obj.text = this.#checkTextLength(elem.abstract);
          obj.date = this.#getDate(elem.pub_date);
          obj.url = elem.web_url;
          obj.alt = 'no picture description';
          obj.id = elem.uri;
          return obj;
        });

        break;
      case REQUEST_TYPE.POPULAR:
        result.hits = data.num_results;
        result.data = data.results
          .filter(
            (elem, idx) =>
              idx >= this.#searchParams.page * PAGE_SIZE &&
              idx < (this.#searchParams.page + 1) * PAGE_SIZE
          )
          .map(elem => {
            const obj = {};
            obj.urlPhoto = this.#getUrlPhotoPopular(elem);
            obj.category = elem.section;
            obj.title = this.#checkTitleLength(elem.title);
            obj.text = this.#checkTextLength(elem.abstract);
            obj.date = this.#getDate(elem.published_date);
            obj.url = elem.url;
            obj.alt = this.#getAltPopular(elem);
            obj.id = elem.uri;
            return obj;
          });
        break;
    }
    return result;
  }

  // формування шляху по фото для REQUEST_TYPE.NEWS
  #getUrlPhotoForNews(el) {
    if (el.multimedia.length <= 0) {
      return TMP_LINK;
    }

    const url = el.multimedia[0].url;
    if (url.length <= 0) {
      return TMP_LINK;
    }

    return url.search(httpProtocol) !== -1 ? url : `${domain}${url}`;
  }

  // формування шляху по фото для REQUEST_TYPE.POPULAR
  #getUrlPhotoPopular(el) {
    if (el.media.length == 0) {
      return TMP_LINK;
    }
    return el.media[0]['media-metadata'][2].url;
  }

  #checkTitleLength(title) {
    if (title.length > 50) {
      return title.slice(0, 50) + '...';
    }
    return title;
  }

  #checkTextLength(text) {
    if (text.length > 150) {
      return text.slice(0, 150) + '...';
    }
    return text;
  }

  #getDate(date) {
    return date.slice(0, 10);
  }

  // формування властивості alt для REQUEST_TYPE.POPULAR
  #getAltPopular(el) {
    if (el.media.length == 0) {
      return 'There is no photo for the article';
    }
    if (el.media[0].copyright.length == 0) {
      return 'There is no photo for the article';
    }
    return el.media[0].copyright;
  }

  // формування властивості alt для REQUEST_TYPE.CATEGORY
  #getAltCategory(el) {
    if (el.multimedia.length == 0) {
      return 'There is no photo for the article';
    }
    if (el.multimedia[0].copyright.length == 0) {
      return 'There is no photo for the article';
    }
    return el.multimedia[0].copyright;
  }

  // перетворення дати
  #formatDate(date) {
    const arrDate = date.split('/');
    if (arrDate.length == 3) {
      return `${arrDate[2]}${arrDate[1]}${arrDate[0]}`;
    }
    return '';
  }
}

/**
 * формування рядку запиту до бекенду
 */
class RequestURL {
  #requestType;

  constructor() {}

  getRequestType() {
    return this.#requestType;
  }

  // формування рядка get запиту до бекенда
  getNewsRequestURL(searchParams) {
    this.#setRequestType(searchParams);

    return (
      URL +
      this.#getNewsRequestURLDirection(searchParams) +
      this.#getNewsRequestURLParams(searchParams)
    );
  }

  // визначення типу запиту
  #setRequestType(searchParams) {
    if (searchParams.searchLine.length !== 0) {
      this.#requestType = REQUEST_TYPE.NEWS;
      return;
    }

    if (searchParams.category.length !== 0) {
      this.#requestType = REQUEST_TYPE.CATEGORY;
      return;
    }

    this.#requestType = REQUEST_TYPE.POPULAR;
  }

  // визначення API шляху в залежності від типу запиту
  #getNewsRequestURLDirection(searchParams) {
    switch (this.#requestType) {
      case REQUEST_TYPE.NEWS:
        return '/svc/search/v2/articlesearch.json';
      case REQUEST_TYPE.CATEGORY:
        return '/svc/search/v2/articlesearch.json';
      // return `/svc/news/v3/content/inyt/${searchParams.category}.json`;
      case REQUEST_TYPE.POPULAR:
        return `/svc/mostpopular/v2/viewed/1.json`;
    }
  }

  // формування параметрів для запиту в залежності від типу запиту
  #getNewsRequestURLParams(searchParams) {
    let paramsLine = `?${API_KEY}`;

    switch (this.#requestType) {
      case REQUEST_TYPE.NEWS:
        if (searchParams.searchLine.length > 0) {
          paramsLine += `&q=${searchParams.searchLine}`;
        }

      case REQUEST_TYPE.CATEGORY:
        // paramsLine += `&sortBy=popularity`;
        if (searchParams.category.length > 0) {
          paramsLine += `&fq=section_name: ("${this.#changeSpecSymbol(
            searchParams.category
          )}")`;
        }

        paramsLine += `&page=${searchParams.page}`;

        if (searchParams.date.length > 0) {
          paramsLine += `&begin_date=${searchParams.date}&end_date=${searchParams.date}`;
        }

        paramsLine += `&pageSize=${PAGE_SIZE}`;
    }
    return paramsLine;
  }

  // заміна & на %26amp;
  #changeSpecSymbol(value) {
    return value.split('&').join('%26');
  }
}

/**
 * запит до бекенду
 */
class LoadData {
  constructor() {}

  async getData(httpRequest) {
    const reuestData = await axios.get(httpRequest);
    return reuestData.data;
  }
}
