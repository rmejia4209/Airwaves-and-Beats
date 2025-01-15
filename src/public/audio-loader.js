

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

function changeAirport(code) {
  const atcPlayer = document.getElementById('atc-player');

  airport = code;
  document.getElementById('airport-display').textContent = code

  if (!atcPlayer.paused) {
    atcPlayer.src = `/select-airport/${airport}`
  }
}

function initATCAudio() {
  const playButton = document.getElementById('play');
  const atcPlayer = document.getElementById('atc-player');

  playButton.addEventListener('click', (e) => {
    atcPlayer.src = `/select-airport/${airport}`
  }, { capture: true })
  
  // Removes the source to prevent server from streaming data needlessly
  atcPlayer.addEventListener('pause', (e) => {
    console.log('Firing')
    setTimeout(() => {
      atcPlayer.src = '';
    }, 100)
  })
}


function initDropDown() {
  const currAirport = document.getElementById('airport-display');
  const dropDown = document.getElementById('airport-selection-dropdown');
  let selected = false;
  fetch('/select-airport/all')
    .then(response => response.json())
    .then(codes => {
      codes.forEach(code => {
        const option = document.createElement('option');
        option.text = code;
        option.value = code;
        if (!selected) {
          currAirport.textContent = code
          airport = code;
          option.selected = true;
          selected = true;
        }
        dropDown.appendChild(option);
      });
    })
    .catch(error => console.error(error))
  
  dropDown.addEventListener('change', (e) => {
    changeAirport(dropDown.value)
  });
}


const queue = []
let airport = ''
queueAlbum(queue).then(() => loadSong(queue))
document.addEventListener('DOMContentLoaded', () => {
  initLofiAudio(queue);
  initDropDown();
  initATCAudio()
})
