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

const createCategoryCard = (category) => {
  const categoryCard = document.createElement('div');
  categoryCard.className = 'col s12 m6 l4 xl3';

  const classCard = document.createElement('div');
  classCard.className = 'card hoverable category';
  classCard.dataset.key = category;

  const classCardImage = document.createElement('div');
  classCardImage.className = 'card-image';

  const cardImage = document.createElement('img');
  cardImage.setAttribute('src', `/cards/${cards[category][0].image}`);
  cardImage.setAttribute('alt', category);

  const cardTitle = document.createElement('span');
  cardTitle.className = 'card-title';
  cardTitle.innerHTML = `<span class="new badge truncate" data-badge-caption="">${category}</span>`;

  classCardImage.append(cardImage);
  classCardImage.append(cardTitle);
  classCard.append(classCardImage);
  categoryCard.append(classCard);

  return categoryCard;
};

const createWordCard = (word) => {
  const wordCard = document.createElement('div');
  wordCard.className = 'col s12 m6 l4 xl3';

  const classCard = document.createElement('div');
  classCard.className = 'card hoverable word';
  classCard.dataset.key = word.word;

  const classCardImage = document.createElement('div');
  classCardImage.className = 'card-image';

  const cardImage = document.createElement('img');
  cardImage.setAttribute('src', `/cards/${word.image}`);
  cardImage.setAttribute('alt', word.word);

  const classCardContent = document.createElement('div');
  classCardContent.className = 'card-content truncate';
  classCardContent.textContent = word.word;

  classCardImage.append(cardImage);
  classCard.append(classCardImage);
  classCard.append(classCardContent);
  wordCard.append(classCard);

  return wordCard;
};

const getActiveLink = () => {
  return sidenav.querySelector('a.active');
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

  sidenav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && !e.target.classList.contains('active')) {
      getActiveLink().classList.remove('active');
      e.target.classList.add('active');

      renderLogo();
      renderPageContainer();
    }

    const instance = M.Sidenav.getInstance(sidenav);
    instance.close();
  });

  pageContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.card');

    if (logo.textContent === startPage) {
      getActiveLink().classList.remove('active');

      const sidenavLinks = Array.from(sidenav.querySelectorAll('a'));
      const targetLink = sidenavLinks.find(
        (a) => a.textContent === card.dataset.key,
      );

      targetLink.classList.add('active');

      renderLogo();
      renderPageContainer();
    }
  });
};

renderSidenav();
renderLogo();
renderPageContainer();

addListeners();
