import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min';

import './styles.css';
import cards from './cards/cards';

const categories = Object.keys(cards);
const sidenav = document.getElementById('sidenav');
const logo = document.getElementById('logo');
const pageContainer = document.getElementById('page-container');

const startPage = 'Categories';

// const MODES = {
//   train: 'train',
//   play: 'play',
// };

// const currentState = {
//   mode: MODES.train,
//   categories,
//   cards,
//   activeCategory: null,
//   activeCard: null,
// };

// const mainPage = document.getElementById('main');
// const categoryPage = document.getElementById('category');
// const card = document.getElementById('card');

const createCategoryCard = (category) => {
  const categoryCard = document.createElement('div');
  categoryCard.className = 'col s8 offset-s2 m6 l4 xl3 hoverable';
  categoryCard.textContent = category;
  return categoryCard;
};

const createWordCard = (word) => {
  const wordCard = document.createElement('div');
  wordCard.textContent = word.word;
  return wordCard;
};

const getActiveLink = () => {
  return document.querySelector('#sidenav a.active');
};

const renderSidenav = () => {
  categories.forEach((e) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#">${e}</a>`;
    sidenav.append(li);
  });
};

const renderLogo = () => {
  logo.textContent = getActiveLink().textContent;
};

const renderPageContainer = () => {
  const activeLink = getActiveLink();

  const row = document.createElement('div');
  row.className = 'row';

  if (activeLink.textContent === startPage) {
    categories.forEach((category) => {
      row.append(createCategoryCard(category));
    });
  } else {
    cards[activeLink.textContent].forEach((word) => {
      row.append(createWordCard(word));
    });
  }

  pageContainer.innerHTML = '';
  pageContainer.append(row);
};

const addListeners = () => {
  document.addEventListener('DOMContentLoaded', () => {
    M.Sidenav.init(sidenav);
  });
};

renderSidenav();
renderLogo();
renderPageContainer();

addListeners();
