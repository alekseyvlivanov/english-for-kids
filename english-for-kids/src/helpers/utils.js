import { sidenav } from './constants';

const audioPlayer = document.getElementById('audio');

const getActiveLink = () => {
  return sidenav.querySelector('a.active');
};

const playAudio = (url) => {
  if (url) {
    audioPlayer.src = url;
    audioPlayer.play();
  }
};

export { getActiveLink, playAudio };
