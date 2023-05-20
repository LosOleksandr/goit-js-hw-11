import { Gallery } from './js/api';
import { refs } from './js/refs';
import { messages } from './js/notify';
import { loadMoreBtn } from './js/btnLoadMore';

const { notifyFailure, notifyInfo, notifySuccess } = messages;
const { searchFormEL, galleryContainerEl, loadBtnEl } = refs;

const gallery = new Gallery();
const loadMore = new loadMoreBtn({ btnEl: loadBtnEl, isHidden: true });

const onFormSubmit = evt => {
  clearHTML();
  const searchValue = evt.target.searchQuery.value;
  gallery.resetPage();
  checkRequest(searchValue);
};

let isNotifySuccessCalled = false;

const checkRequest = async searchValue => {
  try {
    loadMore.showBtn();
    loadMore.disableBtn();
    const data = await gallery.requestImgsFromServer(searchValue);
    const imgsArray = await getImgs(data.hits);

    if (!imgsArray.length) {
      throw new Error();
    }
    if (gallery.totalPhotos === data.total) {
      notifyInfo();
      loadMore.hideBtn();
    }

    if (!isNotifySuccessCalled) {
      notifySuccess(data.totalHits.toLocaleString());
      isNotifySuccessCalled = true;
    }

    renderGalleryMarkup(imgsArray);
    loadMore.enableBtn();
  } catch {
    notifyFailure();
  }
};

const createMarkup = ({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) => {
  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
};

const renderGalleryMarkup = data => {
  const galleryMarkup = data.reduce(
    (markup, img) => markup + createMarkup(img),
    ''
  );

  galleryContainerEl.insertAdjacentHTML('beforeend', galleryMarkup);
};

const clearHTML = () => {
  galleryContainerEl.innerHTML = '';
};

const getImgs = arr => {
  return arr.map(img => {
    return {
      webformatURL: img.webformatURL,
      largeImageURL: img.largeImageURL,
      tags: img.tags,
      likes: img.likes,
      views: img.views,
      comments: img.comments,
      downloads: img.downloads,
    };
  });
};

const loadMoreImgs = () => {
  const searchValue = gallery.searchValue;
  gallery.incrPage();
  checkRequest(searchValue);
};

searchFormEL.addEventListener('submit', evt => {
  evt.preventDefault();
  onFormSubmit(evt);
});

loadBtnEl.addEventListener('click', loadMoreImgs);
