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
  categoryCard.className = 'col s10 offset-s1 m6 l4 xl3';

  const classCard = document.createElement('div');
  classCard.className = 'card hoverable';

  const classCardImage = document.createElement('div');
  classCardImage.className = 'card-image';

  const cardImage = document.createElement('img');
  cardImage.setAttribute('src', `/cards/${cards[category][0].image}`);
  cardImage.setAttribute('alt', category);

  const classCardContent = document.createElement('div');
  classCardContent.className = 'card-content truncate';
  classCardContent.textContent = category;

  classCardImage.append(cardImage);
  classCard.append(classCardImage);
  classCard.append(classCardContent);
  categoryCard.append(classCard);

  return categoryCard;
};

const createWordCard = (word) => {
  const wordCard = document.createElement('div');
  wordCard.className = 'col s10 offset-s1 m6 l4 xl3';

  const classCard = document.createElement('div');
  classCard.className = 'card hoverable';

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
};

renderSidenav();
renderLogo();
renderPageContainer();

addListeners();
