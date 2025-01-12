

function loadSong(queue) {
  const song = queue.shift();
  document.getElementById('music-player').src = song.url;
  document.getElementById('song').textContent = song.name;
  document.getElementById('album').textContent = song.album;
  document.getElementById('artist').textContent = song.artist
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
        const songDetails = songName.split('-')
        return zip.files[songName].async('blob').then(blob => {
          console.log(songDetails)
          queue.push({
            url: URL.createObjectURL(blob),
            name: songDetails[1],
            album: songDetails[2],
            artist: songDetails[3].replace('.mp3', '')
          });
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
