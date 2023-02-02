import { Notify } from 'notiflix';
import axios from 'axios';

export default class PixabayAPI {
  static #API_KEY = '33040565-62ebb5be52a9ae7dffb1334f6';
  static BASE_URL = 'https://pixabay.com/api/';

  constructor(searchWord, page = 1, perPage = 15) {
    this.searchWord = searchWord;
    this.page = page;
    this.perPage = perPage;

    this.searchParams = new URLSearchParams({
      key: PixabayAPI.#API_KEY,
      q: this.searchWord,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: this.perPage,
      page: this.page,
    });

    console.log('searchWord', this.searchWord);
  }

  async fetchPixabay() {
    const response = await axios.get(
      `${PixabayAPI.BASE_URL}?${this.searchParams}`
    );
    return response.data;
  }

  set imagesPerPage(number) {
    if (typeof number !== 'number') return;
    this.perPage = number;
  }

  get imagesPerPage() {
    return this.perPage;
  }
}
