

function loadSong(queue) {
  document.getElementById('lofi-player').src = queue.shift();
}


function initLofiAudio(queue) {
  const lofiPlayer = document.getElementById('lofi-player');
  lofiPlayer.addEventListener('ended', () => {
    URL.revokeObjectURL(lofiPlayer.src);
    loadSong(queue);
    lofiPlayer.play();
    if (queue.length < 2) {
      console.log('Getting next album');
      queueAlbum(queue);
    }
    console.log(queue);
  })  
}


function queueAlbum(queue) {
  return fetch('/get-album')
    .then(response => response.blob())
    .then(blob => {
      const zip = JSZip();
      return zip.loadAsync(blob);
    })
    .then(zip => {
      const songNames = Object.keys(zip.files);
      const promises = songNames.map(songName => {
        return zip.files[songName].async('blob').then(blob => {
          queue.push(URL.createObjectURL(blob));
        });
      });
      return Promise.all(promises);
    })
    .catch(error => alert(error.msg))
} 

function connectButtons() {
  const playButton = document.getElementById('play');
  const pauseButton = document.getElementById('pause');
  const lofiPlayer = document.getElementById('lofi-player');
  // TODO: add air traffic radio

  playButton.addEventListener('click', () => {
    lofiPlayer.play();
    playButton.style.display = 'none';
    pauseButton.style.display ='block';
  })

  pauseButton.addEventListener('click', () => {
    lofiPlayer.pause();
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';
  })
}




function adjustVolume(e, volumeButton, slider) {
  let adjusting = true;
  let startX = e.clientX;
  let start = parseFloat(window.getComputedStyle(volumeButton).left)
  
  const onMouseMove = (e) => {
    if (!adjusting) return;
    
    const shift = e.clientX - startX;
    const sliderWidth = slider.offsetWidth;
    const newPos = Math.max(
      0, Math.min(100,(start + shift) / sliderWidth * 100)
    );
    volumeButton.style.left = `${newPos}%`;
  }

  const onMouseUp = () => {
    adjusting = false;
    // clean up event listeners
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

}

function initVolumeSliders() {
  const volumeButton = document.getElementById('foo')
  const slider = volumeButton.parentElement;
  
  volumeButton.addEventListener('mousedown', (e) => {
    adjustVolume(e, volumeButton, slider);
  }
  )
}


const queue = []
queueAlbum(queue).then(() => loadSong(queue))
document.addEventListener('DOMContentLoaded', () => {
  connectButtons();
  initVolumeSliders();
  initLofiAudio(queue);
})
