var sources= [];
//var sources = ['Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3']; //test sources
var songButtons = $("table span.playerButton");
var playing = false;
var songName = "";
var currentVolume = 1.0;
var muted = false;
var sound;
var selectedNum = -1;
var currentSongBlock;
var shuffle = true;
var songList = $(".song");



function playerInit(){
   sound = new Howl({  //make sound object so we have it
    src: ['static/js/Kalimba.mp3'],
    loop: false,
    volume: currentVolume,
    onend: nextSong,
    preload: true,
    html5: true,
    autoplay: false,
  });

  sound.load();
  //add listeners to top buttons on ui
  $("#playerToggle").click(togglePlay);
  $("#playerShuffle").click(toggleShuffle);
  $("#playerForward").click(nextSong);
  $("#playerProgressBar").click(seekTrack);
  $("#playerVolumeButton").click(toggleMute);
  //add volume listener

  //get all things labeled "song" and add listeners to them
  songList.each(function(i,s){
    $(s).click(function(){songPressed(this)});
  });

  //currentSongBlock = songList.get(0);
  nextSong();
  setInterval(updateProgress, 200);
}





function seekTrack(e){ //called when you click on progress bar
  var localX = e.pageX - $("#playerProgressBar").offset().left
  var percent = localX/$("#playerProgressBar").width();
  var seekPos = Math.floor(sound.duration() * percent);
  sound.seek(seekPos);
  updateProgress();
  return seekPos;
}



//JSON parse
//JSON.parse($($(".song").get(0)).attr('data-song'))
//<div class="song" data-song='{"src":"http://dwellingofduels.net/dodarchive/12-04-Free/01-PrinceOfDarkness-Solstice-Kastle-DoD.mp3", "artist":"Prince uf Darkness", "title":"Kastle Rock", "game":["Solstice"]}'>this is test</div>
//<div class="song" data-song='{"src":[]"TEMPLATE"], "artist":["TEMPLATE","TEMPLATE"], "title":"TEMPLATE", "game":["TEMPLATE","TEMPLATE"], "duel":"TEMPLATE"}'

function songPressed(s){
  //get song data for this block
  //playNewSong(src)
  var data = getData(s);
  scrollToBlock(songList.index(s))
  currentSongBlock = s;
  playNewSong(data.src);

}

function getData(element){
  return JSON.parse($(element).attr('data-song'));
}

function toggleShuffle(){
  if (shuffle){
    $("#playerShuffle").removeClass("fa-random")
    $("#playerShuffle").addClass("fa-arrow-right")
    shuffle = false;
  } else{
    $("#playerShuffle").removeClass("fa-arrow-right")
    $("#playerShuffle").addClass("fa-random")
    shuffle = true;
  }
}

function updateProgress(){ //called via setinterval
  var percent = sound.seek()/sound.duration();
  $("#bar").width((percent*100)+"%")
}

function nextSong(){
  var index;

  if(shuffle){
    index = Math.round( (Math.random() * songList.length))
    console.log("shuffle is tru, index is "+index);
  } else {
    index = songList.index(currentSongBlock)+1;
    if (index > songList.length-1)
      index = 0;
    console.log("shuffle NOT tru, index is "+index);
  }
  scrollToBlock(index);


  currentSongBlock = songList.get(index)
  try{
    playNewSong(getData(currentSongBlock).src);
  }catch(e){
    console.error(e);
    console.error("Skipping to next song.");
    nextSong();
  }

  playSong();

}

function scrollToBlock(index){
  //remove styling from currentSongBlock
  $(currentSongBlock).removeClass("selected");
  //scroll to block at index via nanoScroller
  $('.nano').nanoScroller({scrollTo: $(songList.get(index))});
  //apply style
  $(songList.get(index)).addClass("selected");
}


function togglePlay(){
  if (playing)
    pauseSong();
  else
    playSong();
}

function playSong(){
  playing = true;
  sound.play();
  $("#playerToggle").removeClass("fa-play")
  $("#playerToggle").addClass("fa-pause")
}

function playNewSong(src){
  sound.stop();
  sound = new Howl({
    src: src,
    volume: currentVolume,
    loop: false,
    onend: nextSong,
    preload: true,
    html5: true,
    autoplay: false
  })
  playSong();
}

function toggleMute(){
  if (!muted)
    sound.volume(0);
  else
    sound.fade(0,currentVolume,100);

  muted = !muted;
}

function pauseSong(){
  playing = false;
  sound.pause();
  $("#playerToggle").removeClass("fa-pause")
  $("#playerToggle").addClass("fa-play")
}


function adjustVolume(amount){
  currentVolume += amount;
  if (currentVolume > 1)
    currentVolume = 1;
  else if (currentVolume < 0)
    currentVolume = 0;
  sound.volume(currentVolume);
}
