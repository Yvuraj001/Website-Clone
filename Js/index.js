let currentsong = new Audio();
let songs;
let globalVolume;
let currfolder;
function secondsToMinutesSeconds(seconds) {
   if (isNaN(seconds) || seconds < 0) {
      return "00:00";
   }

   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = Math.floor(seconds % 60);

   const formattedMinutes = String(minutes).padStart(2, '0');
   const formattedSeconds = String(remainingSeconds).padStart(2, '0');

   return `${formattedMinutes}:${formattedSeconds} `;
}

// Creates a array of all the songs and returns it.

async function getsongs(folder) {

   currfolder = folder
   let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
   let response = await a.text();

   let div = document.createElement("div")
   div.innerHTML = response;

   let as = div.getElementsByTagName("a")
   songs = []
   for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
         songs.push(element.href.split(`/${folder}/`)[1])
      }

   }


   // Shpw all the songs in the libaray
   let songul = document.getElementsByTagName("ul")[1]
   songul.innerHTML = ""
   for (const song of songs) {

      songul.innerHTML = songul.innerHTML + ` 
      
       <li>
                        <img class="invert" src="Images/music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ").replaceAll("%", "")}</div>
                            <div>artist</div>
                        </div>
                        <div class="playnow">
                            <span>play now</span>
                            <img class="invert" src="Images/p2.svg" alt="">
                            
                        </div>
                     </li>
             `
   }

   // Creates array of all the li and get the song link and give it ro playmusic function 

   Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", element => {

         console.log(e.querySelector(".info").firstElementChild.innerHTML.trim())
         playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      })
   });
   return songs

}
getsongs()



const playmusic = (track, pause = false) => {
   // Play the clicked songs . Operated by main's event listener
   currentsong.src = `/${currfolder}/` + track
   if (!pause) {
      currentsong.play()
      play.src = "Images/pause.svg"
   }
   document.querySelector(".songinfo").innerHTML = decodeURI(track)
   document.querySelector(".songtime").innerHTML = "--:-- / --:--"

}

async function displayalbum() {
   let a = await fetch(`http://127.0.0.1:5501/songs/`)
   let response = await a.text();
   let div = document.createElement("div")
   div.innerHTML = response;
   let anchor = div.getElementsByTagName("a")

   let array = Array.from(anchor)
   for (let index = 0; index < array.length; index++) {
      const e = array[index];

      if (e.href.includes("/songs/")) {
         let folder = e.href.split("/").slice(-1)[0]
         // Get the meta data of the folder

         let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
         let response = await a.json();
         // alert("Working here")

         let cardcontainer = document.querySelector(".cardcontainer")
         cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28"
                                fill="none" color="white" style="display:block;">
                                <path
                                    d="M18.89 12.846c-.354 1.343-2.024 2.292-5.365 4.19-3.23 1.835-4.845 2.752-6.146 2.383-.538-.153-1.028-.442-1.423-.841C5 17.614 5 15.743 5 12s0-5.614.956-6.579c.395-.399.885-.689 1.423-.841 1.302-.369 2.917.548 6.146 2.383 3.341 1.898 5.011 2.847 5.365 4.19.146.554.146 1.138 0 1.693Z"
                                    fill="#000" stroke="#000" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img class="img" src="/songs/${folder}/cover.jpg" alt="">
                        <h3>${response.tittle}</h3>
                        <p>${response.description}</p>
                    </div>`
      }
   }

   // Adding event listener to the playlist cards
   Array.from(document.getElementsByClassName("card")).forEach(e => {
      e.addEventListener("click", async item => {

         songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
         playmusic(songs[0])
      })
   })

}


//  console.log(folder) !!!!!!

async function main() {

   // This creaters the card in library with the songs name
   await getsongs("songs/mast")

   playmusic(songs[0], true)
   //Disaplying all the folders on the page
   displayalbum()

   // Attaching event listener to the buttons
   play.addEventListener("click", () => {

      if (currentsong.paused) {
         currentsong.play()
         play.src = "Images/pause.svg"


      }
      else {
         currentsong.pause()
         play.src = "Images/p2.svg"
      }
   })

   // Listening the time and duration of the song and movement of the seek circle

   currentsong.addEventListener("timeupdate", () => {
      document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
      document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
   })
   // Making the seekbar to chagnge duration of the song

   document.querySelector(".seekbar").addEventListener("click", e => {
      let percent = e.offsetX / e.target.getBoundingClientRect().width * 100
      document.querySelector(".circle").style.left = percent + "%"

      currentsong.currentTime = ((currentsong.duration) * percent) / 100
   })


   // Adding event listner to the hamburger
   document.querySelector(".hamburger").addEventListener("click", () => {
      document.querySelector(".left").style.left = "-11px"
   })
   // Adding event listner to the close button
   document.querySelector(".close").addEventListener("click", () => {
      document.querySelector(".left").style.left = "-590px"
   })
   // Adding event listner to the previous and next
   previous.addEventListener("click", () => {

      let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

      if ((index - 1) >= 0) {
         playmusic(songs[index - 1])
      }

      else {
         playmusic(songs[(songs.length) - 1])
      }
   })

   next.addEventListener("click", () => {


      let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
      if ((index + 1) < songs.length) {
         playmusic(songs[index + 1])
      }

      else {
         playmusic(songs[0])
      }



   })


   // Making the size of playbar smaller

   toggle.addEventListener("click", () => {
      let a = toggle.classList.toggle("toggle")
      if (a) {
         document.querySelector(".songtime").style.display = "none"
         document.querySelector(".volume").style.display = "none"
         document.getElementsByTagName("svg")[4].style.transform = "rotate(970deg) !important"
      }
      else {
         document.querySelector(".songtime").style.display = "block"
         document.querySelector(".volume").style.display = "flex"
         document.getElementsByTagName("svg")[4].style.transform = "rotate(90deg)"
      }
   })

   // Adding event listner to the range
   document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
      let golvol = e.target.value

      currentsong.volume = parseInt(e.target.value) / 100
      if (parseInt(e.target.value) == 0) {

         volimg.src = "Images/mutevol.svg"
      }
      else {
         volimg.src = "Images/volume.svg"
      }
      return globalVolume = golvol
   })

   // Event listener to the volume image to mute and unmute the song


   volimg.addEventListener("click", () => {
      if (currentsong.volume != 0) {
         currentsong.volume = 0
         volimg.src = "Images/mutevol.svg"
      }
      else if(currentsong.volume >0 ){
         volimg.src = "Images/volume.svg"
         
      }
      else {
         globalVolume = document.querySelector(".range").getElementsByTagName("input")[0].value
         currentsong.volume = parseInt(globalVolume) / 100
         volimg.src = "Images/volume.svg"
      }
   })


}

// Autoplay of the song 
function Autoplay() {


   let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])


   if (document.querySelector(".circle").style.left === "100%") {
      if((index + 1) < songs.length){

         playmusic(songs[index + 1])
      }
      else{
         playmusic(songs[0])
      }
   }
    
 
}
setInterval(()=>{
   Autoplay()
},1000)

main()

