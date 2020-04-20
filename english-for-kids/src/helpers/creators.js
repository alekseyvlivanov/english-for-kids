import cards from '../cards/cards';

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

export { createCategoryCard, createWordCard };
