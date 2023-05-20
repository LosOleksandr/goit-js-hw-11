import axios from 'axios';

class Gallery {
  static URL = 'https://pixabay.com/api';
  static API_KEY = '36500157-b7cca980640d9acdd8232fab9';

  constructor() {
    this.page = 1;
    this.searchValue = '';
    this.totalPhotos = 0;
  }

  getSearchParams() {
    return new URLSearchParams({
      key: Gallery.API_KEY,
      q: this.searchValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 4,
    });
  }

  async requestImgsFromServer(searchValue) {
    this.searchValue = searchValue;
    try {
      const { data } = await axios.get(
        `${Gallery.URL}/?${this.getSearchParams()}`
      );
      this.totalPhotos += data.hits.length;
      return data;
    } catch (error) {
      console.error(error.message);
    }
  }

  resetPage() {
    this.page = 1;
    this.totalPhotos = 0;
  }

  incrPage() {
    this.page += 1;
  }
}

export { Gallery };
