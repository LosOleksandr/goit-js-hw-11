import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Gallery } from './js/api';
import { refs } from './js/refs';
import { messages } from './js/notify';
import { loadMoreBtn } from './js/btnLoadMore';
import { svgImgs } from './js/svg';

const { notifyFailure, notifyInfo, notifySuccess } = messages;
const { searchFormEL, galleryContainerEl, loadBtnEl, scrollTopBtnEl } = refs;

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

    if (!imgsArray.length || !gallery.searchValue) {
      loadMore.hideBtn();
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

    let lightbox = new SimpleLightbox('.gallery a', {});
    lightbox.refresh();

    loadMore.enableBtn();
  } catch {
    notifyFailure();
  }
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

const renderGalleryMarkup = data => {
  const galleryMarkup = data.reduce(
    (markup, img) => markup + createMarkup(img),
    ''
  );

  galleryContainerEl.insertAdjacentHTML('beforeend', galleryMarkup);
};

const createMarkup = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) => {
  return `<div class="photo-card">
  <a href="${largeImageURL}"
    ><img src="${webformatURL}" alt="${tags}" loading="lazy"
  /></a>
  <div class="info">
    <p class="info-item">
      <img src="${svgImgs.likes}" alt="" />
      <p> ${likes}</p>
    </p>
    <p class="info-item">
      <img src="${svgImgs.views}" alt="" />

      <p> ${views.toLocaleString()}</p>
    </p>
    <p class="info-item">
      <img src="${svgImgs.comments}" alt="" />
      <p> ${comments}</p>
    </p>
    <p class="info-item">
      <img src="${svgImgs.downloads}" alt="" />
      <p> ${downloads.toLocaleString()}</p>
    </p>
  </div>
</div>`;
};

const clearHTML = () => {
  galleryContainerEl.innerHTML = '';
};

const loadMoreImgs = () => {
  const searchValue = gallery.searchValue;
  gallery.incrPage();
  checkRequest(searchValue);
};

scrollTopBtnEl.classList.add('hidden');

function handleScroll() {
  if (window.pageYOffset > 0) {
    scrollTopBtnEl.classList.remove('hidden');
  } else {
    scrollTopBtnEl.classList.add('hidden');
  }
}

searchFormEL.addEventListener('submit', evt => {
  evt.preventDefault();
  onFormSubmit(evt);
});

loadBtnEl.addEventListener('click', loadMoreImgs);

window.addEventListener('scroll', handleScroll);

scrollTopBtnEl.addEventListener('click', evt => {
  window.scrollTo({
    top: 0,
  });
});
