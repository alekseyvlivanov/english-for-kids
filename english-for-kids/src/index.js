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

const playAudio = (url) => {
  if (url) {
    new Audio(url).play();
  }
};

const createCategoryCard = (category) => {
  const categoryCard = document.createElement('div');
  categoryCard.className = 'col s12 m6 l4 xl3';

  const classCard = document.createElement('div');
  classCard.className = 'card hoverable category';
  classCard.dataset.key = category;

  const classCardImage = document.createElement('div');
  classCardImage.className = 'card-image';

  const cardImage = document.createElement('img');
  cardImage.setAttribute(
    'src',
    `/cards/${
      cards[category][Math.floor(Math.random() * cards[category].length)].image
    }`,
  );
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

  const flipCard = document.createElement('div');
  flipCard.className = 'flip-card';

  const cardFaceFront = document.createElement('div');
  cardFaceFront.className = 'card-face-front';

  const classCardFront = document.createElement('div');
  classCardFront.className = 'card hoverable word';
  classCardFront.dataset.key = word.word;

  const classCardFrontImage = document.createElement('div');
  classCardFrontImage.className = 'card-image';

  const cardFrontImage = document.createElement('img');
  cardFrontImage.setAttribute('src', `/cards/${word.image}`);
  cardFrontImage.setAttribute('alt', word.word);

  const classCardFrontContent = document.createElement('div');
  classCardFrontContent.className = 'card-content truncate';
  classCardFrontContent.innerHTML = `<div>${word.word}</div><div class="rotate"></div>`;

  const cardFaceBack = document.createElement('div');
  cardFaceBack.className = 'card-face-back';

  const classCardBack = document.createElement('div');
  classCardBack.className = 'card hoverable word';
  classCardBack.dataset.key = word.word;

  const classCardBackImage = document.createElement('div');
  classCardBackImage.className = 'card-image';

  const cardBackImage = document.createElement('img');
  cardBackImage.setAttribute('src', `/cards/${word.image}`);
  cardBackImage.setAttribute('alt', word.word);

  const classCardBackContent = document.createElement('div');
  classCardBackContent.className = 'card-content truncate';
  classCardBackContent.innerHTML = `<div>${word.translation}</div>`;

  classCardFrontImage.append(cardFrontImage);
  classCardBackImage.append(cardBackImage);
  classCardFront.append(classCardFrontImage);
  classCardFront.append(classCardFrontContent);
  classCardBack.append(classCardBackImage);
  classCardBack.append(classCardBackContent);
  cardFaceFront.append(classCardFront);
  cardFaceBack.append(classCardBack);
  flipCard.append(cardFaceFront);
  flipCard.append(cardFaceBack);
  wordCard.append(flipCard);

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
    cards[activeLink.textContent]
      .sort(() => Math.random() - 0.5)
      .forEach((word) => {
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

    if (!card) return;

    if (logo.textContent === startPage) {
      getActiveLink().classList.remove('active');

      const sidenavLinks = Array.from(sidenav.querySelectorAll('a'));
      const targetLink = sidenavLinks.find(
        (a) => a.textContent === card.dataset.key,
      );

      targetLink.classList.add('active');

      renderLogo();
      renderPageContainer();

      return;
    }

    if (e.target.classList.contains('rotate')) {
      const flipCard = e.target.closest('.flip-card');
      flipCard.classList.add('is-flipped');

      return;
    }

    const categoryWords = cards[logo.textContent];
    const word = categoryWords.find((w) => w.word === card.dataset.key);

    playAudio(`/cards/${word.audioSrc}`);
  });

  pageContainer.addEventListener('mouseout', (e) => {
    const flipCard = e.target.closest('.is-flipped');

    if (flipCard && e.relatedTarget.contains(flipCard)) {
      flipCard.classList.remove('is-flipped');
    }
  });

  pageContainer.addEventListener('touchend', (e) => {
    if (e.target.classList.contains('rotate')) {
      setTimeout(() => {
        const flipCard = e.target.closest('.is-flipped');
        if (flipCard) {
          flipCard.classList.remove('is-flipped');
        }
      }, 1500);
    }
  });
};

renderSidenav();
renderLogo();
renderPageContainer();

addListeners();
