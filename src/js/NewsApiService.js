import axios from 'axios';
import { PAGE_SIZE } from './constants';

const ENDPOINT = `https://newsapi.org/v2/everything`;
const options = {
  headers: {
    'X-Api-Key': '48f635e94984412c99886e3d4f3c6f3c',
  },
};

class NewsApiService {
  constructor() {
    this.news = [];
    this.category = 'admin';
    this.search = '';
    this.page = 1;
    this.data = '';
  }
  async getNews() {
    // fetch news when go to home, also during search, select a category, data, pagination
    const URL = `${ENDPOINT}?q=${this.search}&category=${this.category}&from=${this.data}&to=2023-02-25&sortBy=popularity&page=${this.page}&pageSize=${PAGE_SIZE}`;
    const response = await axios.get(URL, options);
    this.nextPage();
    return response.data.articles;
    // https://newsapi.org/v2/everything?q=apple&from=2023-02-25&to=2023-02-25&sortBy=popularity&apiKey=48f635e94984412c99886e3d4f3c6f3c
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

export default new NewsApiService();

