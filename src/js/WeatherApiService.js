import axios from 'axios';

const ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'appid=6d60d21bce8976408f2b4a384ab1bffa';


class WeatherApiService {
  constructor() {
    
  }

  async getCategories() {
    console.log('here')
    const response = await axios.get(`${ENDPOINT}?lat=44.34&lon=10.99&${API_KEY}`);
    return response.data;
  }
}

export default new WeatherApiService();