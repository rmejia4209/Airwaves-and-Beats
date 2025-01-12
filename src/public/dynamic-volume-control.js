


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
  }
  )
}


document.addEventListener('DOMContentLoaded', () => {
  initVolumeSliders('atc');
  initVolumeSliders('music');
})