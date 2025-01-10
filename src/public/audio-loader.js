

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

function connectButton(queue) {
  document.getElementById('my').addEventListener('click', () => {
    console.log(queue);
  })
}

const queue = []
queueAlbum(queue).then(() => loadSong(queue))
document.addEventListener('DOMContentLoaded', () => {
  connectButton(queue);
  initLofiAudio(queue);
})
