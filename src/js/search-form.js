//**************imports*******************
//library imports
import { Notify } from 'notiflix';
import SimpleLightBox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import OnlyScroll from 'only-scrollbar';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

//local imports
import PixabayAPI from './pixabayAPI';
import makeGalleryHTMLString from './templates/galleryTemplate';
import handleElevator from './elevator';

//**************variables*****************
const refs = {
  searchFormEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.button--load-more'),
};
let searchInput = null;
const simpleLightBoxOptions = {};
const PER_PAGE = 15;
let page = 1;
let totalFound = 0;
let imgLeft = 0;
let simpleLightBox;

//*****************main*******************
refs.searchFormEl.addEventListener('submit', onSearchFormElSubmit);
refs.searchFormEl.addEventListener('change', onSearchQueryElChange);
refs.loadMoreBtnEl.addEventListener('click', onLoadMoreBtnElClick);

refs.searchFormEl.elements.searchQuery.value =
  localStorage.getItem('search-query');

console.dir(screen);
//*****************functions**************
async function onSearchFormElSubmit(event) {
  event.preventDefault();

  const inputValue = refs.searchFormEl.elements.searchQuery.value;
  searchInput = /^\s*$/.test(inputValue) ? null : inputValue;
  console.log('searchInput', searchInput);
  resetGallery();
  if (!searchInput) {
    Notify.failure('Enter correct value, please');
    return;
  }
  const imageArr = await getImageArr(searchInput, page, PER_PAGE);
  if (!imageArr) return;
  console.log('imageArr: ', imageArr);
  Notify.success(`Hooray! We found ${totalFound} images.`);
  fillGallery(imageArr);
  showLoadMoreBtn();
  simpleLightBox = new SimpleLightBox('.gallery a');
  handleElevator();
}

async function onLoadMoreBtnElClick() {
  page += 1;
  imgLeft = totalFound - PER_PAGE * page;
  console.log('imgLeft', imgLeft);
  if (imgLeft <= 0) {
    hideLoadMoreBtn();
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }
  const imageArr = await getImageArr(searchInput, page, PER_PAGE);
  fillGallery(imageArr);
  simpleLightBox.refresh();
  scroll();
}

function onSearchQueryElChange() {
  localStorage.setItem(
    'search-query',
    refs.searchFormEl.elements.searchQuery.value
  );
}

async function getImageArr(searchInput, page, per_page) {
  const pixabayAPI = new PixabayAPI(searchInput, page, per_page);
  const imageArr = await pixabayAPI
    .fetchPixabay(searchInput)
    .then(data => {
      if (!data) return;
      const { hits, totalHits } = data;
      console.log('data', data);
      totalFound = imgLeft = totalHits;
      console.log('totalFound', totalFound);
      return hits.map(convertData);
    })
    .catch(console.error);

  return imageArr;
}

function fillGallery(imageArr) {
  refs.galleryEl.insertAdjacentHTML(
    'beforeend',
    makeGalleryHTMLString(imageArr)
  );
}

function convertData(dataObj) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = dataObj;
  return {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  };
}

function resetGallery() {
  hideLoadMoreBtn();
  refs.searchFormEl.elements.searchQuery.value = '';
  localStorage.removeItem('search-query');
  refs.galleryEl.innerHTML = '';
  page = 1;
  totalFound = imgLeft = 0;
  handleElevator();
}

function showLoadMoreBtn() {
  if (totalFound <= PER_PAGE || imgLeft <= PER_PAGE) return;
  if (refs.loadMoreBtnEl.classList.contains('visually-hidden')) {
    refs.loadMoreBtnEl.classList.remove('visually-hidden');
  }
}

function hideLoadMoreBtn() {
  if (!refs.loadMoreBtnEl.classList.contains('visually-hidden')) {
    refs.loadMoreBtnEl.classList.add('visually-hidden');
  }
}

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
