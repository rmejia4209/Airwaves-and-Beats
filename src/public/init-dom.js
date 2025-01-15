

function initPlaybackButtons() {
  const playButton = document.getElementById('play');
  const pauseButton = document.getElementById('pause');
  const lofiPlayer = document.getElementById('music-player');
  const atcPlayer = document.getElementById('atc-player')
  const background = document.getElementById('background-color');

  playButton.addEventListener('click', () => {
    lofiPlayer.play();
    atcPlayer.play();
    playButton.style.display = 'none';
    pauseButton.style.display ='block';
    background.style.opacity = 1;
  })

  pauseButton.addEventListener('click', () => {
    lofiPlayer.pause();
    atcPlayer.pause();
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';
    background.style.opacity = 0;
  })
}

function adjustVolume(e, atc, music, volumeButton, sliderFill, slider) {
  let adjusting = true;
  let startX = e.clientX;
  let start = parseFloat(window.getComputedStyle(volumeButton).left);
  /*
    * Moves the volume button, sets the width of the sliderFill,
    * and transmits the volume to the audio controller
    */
  const onMouseMove = (e) => {
    if (!adjusting) return;
    const shift = e.clientX - startX;
    const sliderWidth = slider.offsetWidth;
    const newPos = Math.max(
      0, Math.min(100, (start + shift) / sliderWidth * 100)
    );
    const p = newPos / 100;
    volumeButton.style.left = `${newPos}%`;
    sliderFill.style.width = `${newPos}%`;
    music.volume = Math.min(1, ((1-p)/p));
    atc.volume = Math.min(1, (p/(1-p)));
  }
  
  /**
   * Cleans up event listeners once the mouse is released.
   */
  const onMouseUp = () => {
    adjusting = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
  
  // Add event listeners
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  
}
  
function initVolumeSliders() {
  const atc = document.getElementById('atc-player')
  const music = document.getElementById('music-player')
  atc.volume = 1;
  music.volume = 1;

  const volumeButton = document.getElementById('ratio-button');
  const sliderFill = document.getElementById('ratio-line-solid');
  const slider = volumeButton.parentElement;
  
  volumeButton.addEventListener('mousedown', (e) => {
    adjustVolume(e, atc, music, volumeButton, sliderFill, slider);
  });
}

function initSidebar() {
  // Playback view & buttons
  const playBackView = document.getElementById('playback-view');
  const settingsView = document.getElementById('settings-view');
  const settingButton = document.getElementById('settings-button');
  const backButton = document.getElementById('settings-back-button');

  settingButton.addEventListener('click', () => {
    settingsView.style.display = 'block';
    playBackView.style.display = 'none';
  });

  backButton.addEventListener('click', () => {
    playBackView.style.display = 'block';
    settingsView.style.display = 'none';
  })
}



document.addEventListener('DOMContentLoaded', () => {
  initPlaybackButtons();
  initSidebar();
  initVolumeSliders('atc');
  initVolumeSliders('music');
})