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
    this.#searchParams.date = value;
  }

  get date() {
    return this.#searchParams.date;
  }

  set page(value) {
    this.#searchParams.page = value <= 1 ? 0 : value - 1;
  }

  get page() {
    return this.#searchParams.page + 1;
  }

  async requestData(pageNumber = 1) {
    this.page = pageNumber;
    console.log(this.#requestURL.getNewsRequestURL(this.#searchParams));

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

  #createResultData(data, dataType) {
    const result = {
      hits: 0,
      data: [],
    };

    switch (dataType) {
      case REQUEST_TYPE.NEWS:
        result.hits = data.response.meta.hits;
        result.data = data.response.docs.map(elem => {
          console.log(elem);
          const obj = {};
          obj.urlPhoto = this.#getUrlPhoto(elem);
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
      case REQUEST_TYPE.POPULAR:
        result.hits = data.num_results;
        result.data = data.results
          .filter(
            (elem, idx) =>
              idx >= this.#searchParams.page * PAGE_SIZE &&
              idx < (this.#searchParams.page + 1) * PAGE_SIZE
          )
          .map(elem => {
            console.log(elem);
            const obj = {};
            obj.urlPhoto = this.#getUrl(elem);
            obj.category = elem.section;
            obj.title = this.#checkTitleLength(elem.title);
            obj.text = this.#checkTextLength(elem.abstract);
            obj.date = this.#getDate(elem.published_date);
            obj.url = elem.url;
            obj.alt = this.#getAlt(elem);
            obj.id = elem.uri;
            return obj;
          });
        break;
    }
    console.log(result);
    return result;
  }

  #getUrlPhoto(el) {
    if (el.multimedia.length <= 0) {
      return TMP_LINK;
    }

    const url = el.multimedia[0].url;
    if (url.length <= 0) {
      return TMP_LINK;
    }

    return url.search(httpProtocol) !== -1 ? url : `${domain}${url}`;
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

  #getUrl(el) {
    if (el.media.length == 0) {
      return TMP_LINK;
    }
    return el.media[0]['media-metadata'][2].url;
  }

  #getAlt(el) {
    if (el.media.length == 0) {
      return 'There is no photo for the article';
    }
    if (el.media[0].copyright.length == 0) {
      return 'There is no photo for the article';
    }
    return el.media[0].copyright;
  }
}

class RequestURL {
  #requestType;

  constructor() {}

  getRequestType() {
    return this.#requestType;
  }

  getNewsRequestURL(searchParams) {
    this.#setRequestType(searchParams);

    return (
      URL +
      this.#getNewsRequestURLDirection(searchParams) +
      this.#getNewsRequestURLParams(searchParams)
    );
  }

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

  #getNewsRequestURLDirection(searchParams) {
    switch (this.#requestType) {
      case REQUEST_TYPE.NEWS:
        return '/svc/search/v2/articlesearch.json';
      case REQUEST_TYPE.CATEGORY:
        return `/svc/news/v3/content/nyt/${searchParams.category}.json`;
      case REQUEST_TYPE.POPULAR:
        return `/svc/mostpopular/v2/viewed/1.json`;
    }
  }

  #getNewsRequestURLParams(searchParams) {
    let paramsLine = `?${API_KEY}`;

    switch (this.#requestType) {
      case REQUEST_TYPE.NEWS:
        // if (searchParams.category.length > 0) {
        //   paramsLine += `&fq=${'{Article}'}`; //searchParams.category
        // }
        // console.log(searchParams.date + ' date ' + searchParams.date.length);
        if (searchParams.searchLine.length > 0) {
          paramsLine += `&q=${searchParams.searchLine}`;
        }
        paramsLine += `&pageSize=${PAGE_SIZE}`;

      case REQUEST_TYPE.CATEGORY:
        // paramsLine += `&sortBy=popularity`;

        paramsLine += `&page=${searchParams.page}`;

        if (searchParams.date.length > 0) {
          paramsLine += `&begin_date=${searchParams.date}&end_date=${searchParams.date}`;
        }
    }
    return paramsLine;

    // let paramsLine = `?${API_KEY}`;

    // if (this.#requestType == REQUEST_TYPE.POPULAR) {
    //   return paramsLine;
    // }

    // paramsLine += `&sortBy=popularity`;

    // paramsLine += `&page=${searchParams.page}`;

    // if (searchParams.date.length > 0) {
    //   paramsLine += `&begin_date=${searchParams.date}&end_date=${searchParams.date}`;
    // }

    // if (this.#requestType == REQUEST_TYPE.CATEGORY) {
    //   return paramsLine;
    // }

    // // paramsLine += `&offset=0`;
    // // paramsLine += `&pageSize=${searchParams.pageSize}`;

    // if (searchParams.category.length > 0) {
    //   paramsLine += `&fq=${searchParams.category}`;
    // }
    // // console.log(searchParams.date + ' date ' + searchParams.date.length);
    // if (searchParams.searchLine.length > 0) {
    //   paramsLine += `&q=${searchParams.searchLine}`;
    // }

    // return paramsLine;
  }
}

class LoadData {
  constructor() {}

  async getData(httpRequest) {
    const reuestData = await axios.get(httpRequest);
    return reuestData.data;
  }
}
