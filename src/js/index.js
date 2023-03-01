import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
// import { includes } from 'lodash';
import newsApiService from './NewsApiService';
import weatherApiService from './WeatherApiService';

import './change-theme';
import './notFound'

weatherApiService.getCategories();
newsApiService.getCategories();
newsApiService.getNews();
newsApiService.getPopular();
