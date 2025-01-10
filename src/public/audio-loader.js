

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

const queue = []
queueAlbum(queue).then(() => loadSong(queue))
document.addEventListener('DOMContentLoaded', () => {
  connectButtons();
  initLofiAudio(queue);
})
