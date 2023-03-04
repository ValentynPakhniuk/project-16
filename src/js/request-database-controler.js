import axios from 'axios';
import { PAGE_SIZE } from './constants';

const URL = 'https://api.nytimes.com';
const API_KEY = 'api-key=SWTGJZG6lt2ntZukcf6TH36zlYgqv0Eb';

export default class RequestDataBaseControler {
  #searchParams = {
    searchLine: '',
    category: '',
    date: '',
    page: 1,
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
    this.#searchParams.page = value <= 0 ? 1 : value;
  }

  get page() {
    return this.#searchParams.page;
  }

  async requestData(pageNumber = 1) {
    this.page = pageNumber;
    console.log(this.#requestURL.getNewsRequestURL(this.#searchParams));
    return await this.#loadData.getData(
      this.#requestURL.getNewsRequestURL(this.#searchParams)
    );
  }
}

class RequestURL {
  constructor() {}

  getNewsRequestURL(searchParams) {
    return (
      URL +
      this.#getNewsRequestURLDirection(searchParams) +
      this.#getNewsRequestURLParams(searchParams)
    );
  }

  #isSearchPopular(searchParams) {
    if (
      searchParams.searchLine.length == 0 &&
      searchParams.category.length == 0
    ) {
      return true;
    }
    return false;
  }

  #getNewsRequestURLDirection(searchParams) {
    if (this.#isSearchPopular(searchParams)) {
      return `/svc/mostpopular/v2/viewed/1.json`;
    } else {
      return `/svc/search/v2/articlesearch.json`;
    }
  }

  #getNewsRequestURLParams(searchParams) {
    let paramsLine = `?${API_KEY}`;

    if (this.#isSearchPopular(searchParams)) {
      return paramsLine;
    }

    paramsLine += `&sortBy=popularity`;

    paramsLine += `&page=${searchParams.page}`;

    // paramsLine += `&pageSize=${searchParams.pageSize}`;

    if (searchParams.searchLine.length > 0) {
      paramsLine += `&q=${searchParams.searchLine}`;
    }
    if (searchParams.category.length > 0) {
      paramsLine += `&fq=${searchParams.category}`;
    }
    if (searchParams.date.length > 0) {
      paramsLine += `&from=${searchParams.date}&to=${searchParams.date}`;
    }

    return paramsLine;
  }
}

class LoadData {
  constructor() {}

  async getData(httpRequest) {
    const reuestData = await axios.get(httpRequest);
    return reuestData.data;
  }
}
