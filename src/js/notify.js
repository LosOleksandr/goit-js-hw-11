import { Notify } from 'notiflix';

const messages = {
  notifyFailure() {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  },
  notifyInfo() {
    Notify.info("We're sorry, but you've reached the end of search results.");
  },
  notifySuccess(totalHits) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  },
};

export { messages };
