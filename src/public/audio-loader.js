

function loadSong(queue) {
  document.getElementById('music-player').src = queue.shift();
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
    .catch(error => alert(error))
} 


function initLofiAudio(queue) {
  const lofiPlayer = document.getElementById('music-player');
  lofiPlayer.addEventListener('ended', () => {
    URL.revokeObjectURL(lofiPlayer.src);
    loadSong(queue);
    lofiPlayer.play();
    if (queue.length < 2) {
      queueAlbum(queue);
    }
  })  
}







const queue = []
queueAlbum(queue).then(() => loadSong(queue))
document.addEventListener('DOMContentLoaded', () => {
  initLofiAudio(queue);
})
