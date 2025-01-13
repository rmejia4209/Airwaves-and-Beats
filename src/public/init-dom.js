

function initPlaybackButtons() {
  const playButton = document.getElementById('play');
  const pauseButton = document.getElementById('pause');
  const lofiPlayer = document.getElementById('music-player');
  const background = document.getElementById('background-color');
  // TODO: add air traffic radio

  playButton.addEventListener('click', () => {
    lofiPlayer.play();
    playButton.style.display = 'none';
    pauseButton.style.display ='block';
    background.style.opacity = 1;
  })

  pauseButton.addEventListener('click', () => {
    lofiPlayer.pause();
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';
    background.style.opacity = 0;
  })
}

function adjustVolume(e, audioPlayer, volumeButton, sliderFill, slider) {
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
    volumeButton.style.left = `${newPos}%`;
    sliderFill.style.width = `${newPos}%`;
    audioPlayer.volume = newPos / 100;
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
  
function initVolumeSliders(audio) {
  const audioPlayer = document.getElementById(`${audio}-player`)
  audioPlayer.volume = 0.5
  const volumeButton = document.getElementById(`${audio}-volume-button`);
  const sliderFill = document.getElementById(
    `${audio}-slider-input-line-solid`
  );
  const slider = volumeButton.parentElement;
  
  volumeButton.addEventListener('mousedown', (e) => {
    adjustVolume(e, audioPlayer, volumeButton, sliderFill, slider);
  });
}

function initSidebar() {
  // Playback view & buttons
  const playBackView = document.getElementById('playback-view');
  const volumeSettingButton = document.getElementById('sidebar-volume');
  const airportSelectionButton = document.getElementById('sidebar-airport');
  
  // Volume adjustment view & buttons
  const volumeSettings = document.getElementById('volume-adjustment-view');
  const volumeSettingsBack = document.getElementById(
    'volume-adjustment-view-back'
  );

  // Airport selection view & buttons
  const airportSelection = document.getElementById('airport-selection-view');
  const airportSelectionBack = document.getElementById(
    'airport-selection-view-back'
  );

  volumeSettingButton.addEventListener('click', () => {
    volumeSettings.style.display = 'block';
    playBackView.style.display = 'none';
  });

  airportSelectionButton.addEventListener('click', () => {
    airportSelection.style.display = 'block';
    playBackView.style.display = 'none';
  })

  airportSelectionBack.addEventListener('click', () => {
    airportSelection.style.display = 'none';
    playBackView.style.display = 'block';  
  });

  volumeSettingsBack.addEventListener('click', () => {
    volumeSettings.style.display = 'none';
    playBackView.style.display = 'block';  
  });




}



document.addEventListener('DOMContentLoaded', () => {
  initPlaybackButtons();
  initSidebar();
  initVolumeSliders('atc');
  initVolumeSliders('music');
})