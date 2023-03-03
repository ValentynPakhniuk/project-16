import axios from 'axios';
import { PAGE_SIZE } from './constants';

const URL = 'https://api.nytimes.com';
const API_KEY = 'api-key=SWTGJZG6lt2ntZukcf6TH36zlYgqv0Eb';

export default  class NewsApiService {
  constructor() {
    this.news = []; // [{ title: 'Title', description: 'Description', isFavorite: false}, ...] `<div>${title}</div>${isFavorite ? '<button id="remove">Remove</button>' : '<button>Add</button>'}`
    this.category = null;
    this.search = '';
    this.page = 1;
    this.data = '';
  }

  async getCategories() {
    const categoryApi = `${URL}/svc/news/v3/content/section-list.json?${API_KEY}`;
    const responseCategories = await axios.get(categoryApi);
    return responseCategories.data.results;
  }

  async getNews() {
    const articlesApi = `${URL}/svc/search/v2/articlesearch.json?q=${this.search}&fq=${this.category ? `&category=${this.category}` : ''}&from=${this.data}&to=${Date.now()}&sortBy=popularity&page=${this.page}&pageSize=${PAGE_SIZE}&${API_KEY}`;
    const response = await axios.get(articlesApi);
    this.nextPage();
    this.news = response.data.response;
    console.log('this.news:', this.news);
    // const mapData = (data) => {
    //   return {
    //     title: data.title || data.header || data.bla,
    //   }
    // }
  }

  async getPopular() {
    const popularApi = `${URL}/svc/mostpopular/v2/viewed/1.json?${API_KEY}`;
    const responsePopular = await axios.get(popularApi);
    return responsePopular.data.results;
  }

  nextPage() {
    this.page += 1;
  }
    
  resetPage() {
    this.page = 1;
  }

  getFavoriteNews() {
    // fetch favorite news
  }

  getReadNews() {
    // fetch read news
  }

  markAsRead() {
    // on click "Read more" button
  }

  addToFavorite(id) {
    // on click "Add to favorite" button
    // this.news = this.news.map((post) => {
    //   if (post.id === id) {
    //     return {...post, isFavorite: true}
    //   }
    // })
  }

  removeToFavorite() {
    // on click "Remove from favorite" button
  }
}

// export default new NewsApiService();
