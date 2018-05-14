var sources= [];
//var sources = ['Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3', 'Sleep Away.mp3', 'Kalimba.mp3']; //test sources
var songButtons = $("table span.playerButton");
var playing = false;
var songName = "";
var currentVolume = 1.0;
var sound;
var selectedNum = -1;
var currentSongBlock;
var shuffle = true;
var songList = $(".song");
var visibleSongs = songList.toArray();
var previousSearch = "";
var sorting = false;
var currentSort;
var favesOnly = false;

String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

window.onerror = function(msg, url, line, col, error) {
   // Note that col & error are new to the HTML 5 spec and may not be
   // supported in every browser.  It worked for me in Chrome.
   var extra = !col ? '' : '\ncolumn: ' + col;
   extra += !error ? '' : '\nerror: ' + error;

   // You can view the information in an alert to see things working like this:
   alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

   // TODO: Report this error via ajax so you can keep track
   //       of what pages have JS issues

   var suppressErrorAlert = true;
   // If you return true, then error alerts (like in older versions of
   // Internet Explorer) will be suppressed.
   return suppressErrorAlert;
};

function playerInit(){
   sound = new Howl({  //make sound object so we have it
    src: [''],
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

  //add volume slider listener TODO

  //Add sorter listeners
  $("#theadFavorite").click(toggleFaves);
  $("#theadTitle").click(sortTable.bind(this, "title"));
  $("#theadArtist").click(sortTable.bind(this, "artist"));
  $("#theadGame").click(sortTable.bind(this, "game"));
  $("#theadDuel").click(sortTable.bind(this, "duel"));

  //search bar listener
  $("#searchField").on("input",function(e){
      search($("#searchField").val());
    });

  //get all things labeled "song" and add listeners to them
  songList.each(function(i,s){
    $(s).click(function(){songPressed(this)});
  });

  //load all favorites and set corresponding track icon to be faved
  loadFavorites()

  //add listener to all favorite buttons
  $(".favBtn").each(function(i,e){
    $(e).click(function(event){
      toggleFavorite($(this).parent().parent()[0])
      event.stopPropagation()
    })
  })

  //currentSongBlock = songList.get(0);
  nextSong();
  setInterval(updateProgress, 200);

  //TODO TODO
  //Add functionality to read the query parameters using getURLParams() and filter by first param then scroll to that track
}

function loadFavorites(){
  //for each value in the favorites array
  let fav = JSON.parse(localStorage.getItem("favorites"))
	if(fav){
	  fav.forEach(function(id){
	    //find song with that id
	    $("#"+id).toggleClass("favorite")
	    //toggle favorite class
	  })
	}
}


function toggleFavorite(song){
  song = $(song)

  if (song.hasClass("favorite")){
    song.removeClass("favorite")
    //remove from storage
    let fav = JSON.parse(localStorage.getItem("favorites"))
    let i = fav.indexOf(song.attr("id"))
    fav.splice(i,1)
    localStorage.setItem("favorites", JSON.stringify(fav))
  } else {
    song.addClass("favorite");
    if(!localStorage.getItem("favorites")){
      localStorage.setItem("favorites", "[]")
    }
    let fav = JSON.parse(localStorage.getItem("favorites"))
    fav.push(song.attr("id"))
    localStorage.setItem("favorites", JSON.stringify(fav))
  }
}

function seekTrack(e){ //called when you click on progress bar
  var localX = e.pageX - $("#playerProgressBar").offset().left
  var percent = localX/$("#playerProgressBar").width();
  var seekPos = Math.floor(sound.duration() * percent);
  sound.seek(seekPos);
  updateProgress();
  return seekPos;
}

function songPressed(s){
  //get song data for this block
	//TODO change title back to loading...
	setPageTitles("Loading...")
  var data = $(s).data("song");
  scrollToBlock($(visibleSongs).index(s))
  currentSongBlock = s;
  playNewSong(data);

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
  $("#bar").width((percent*100)+"%");
  var sec = Math.floor(sound.seek()%60);
  var min = Math.floor(sound.seek()/60)
  if (sec<10)
    sec = "0"+sec
  if (min<10)
    min = "0"+min
  if(isNaN(min) || isNaN(sec))
    min = sec = "00";
  $("#playerTimer").text(min+":"+sec);
}

function nextSong(){
  var index;

  if(shuffle){
    index = Math.round( (Math.random() * visibleSongs.length)-1)
  } else {
    index = $(visibleSongs).index(currentSongBlock)+1;
    if (index > visibleSongs.length-1)
      index = 0;
  }
  scrollToBlock(index);


  currentSongBlock = $(visibleSongs).get(index)

  playNewSong($(currentSongBlock).data("song"));

  playSong();

}

function scrollToBlock(index){
  //remove styling from currentSongBlock
  $(currentSongBlock).removeClass("selected");
  //apply style
  $($(visibleSongs).get(index)).addClass("selected");
  //scroll to block at index via nanoScroller
  if (index <2)
    index = 2
  try{
    $('.nano').nanoScroller({scrollTo: $($(visibleSongs).get(index-2))});
  }catch{}
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

function playNewSong(obj){
  sound.stop();
  sound = new Howl({
    src: obj.src,
    volume: currentVolume,
    loop: false,
    onend: nextSong,
    preload: true,
    html5: true,
    autoplay: false,
		onload: function(){setPageTitles(decodeURIComponent(obj.title) + " - "+decodeURIComponent(obj.artist))},
  })
  playSong();
}

function setPageTitles(newTitle){
	$("title").text(newTitle + " - Dwelling of Duels Archive Explorer");
  $("#title").text(newTitle);
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


function sortTable(type){
  sorting = true;
  currentSort = type;
  //get all song blocks
  //input into array


  //var blocks = $(".song").toArray();
  var blocks = songList.toArray()

  //detach all
  $(blocks).detach();

  if(favesOnly){
    var blocks = songList.filter(".song.favorite").toArray();
  }else{
    var blocks = songList.filter(".song").toArray();
  }


  //sort array
  blocks = sortData(blocks, type);
  //songList = $(blocks);
  visibleSongs = blocks;



  //insert all in new order
  $(".nano-content table").append(blocks);
  $(".nano").nanoScroller();
  sorting = false;
}

function sortData(data, type){
  //modify the songList obj to reorder based on type.
  data = quickSort(data,0, data.length-1, type);

  return data;
}

function toggleFaves(){ //TODO
  favesOnly = !favesOnly
  // if (favesOnly){
  //   songList = $(".song.favorite")
  // } else {
  //   songList = $(".song")
  // }
  if (!currentSort){
    currentSort="title"
  }
  sortTable(currentSort)
}


////quicksort stuff///
function quickSort(arr, left, right,type){
   var len = arr.length,
   pivot,
   partitionIndex;

  if(left < right){
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right,type);

   //sort left and right
   quickSort(arr, left, partitionIndex - 1,type);
   quickSort(arr, partitionIndex + 1, right,type);
  }
  return arr;
}

function partition(arr, pivot, left, right,type){

  switch(type){
    case "artist":
      var pivotValue = $(arr[pivot]).data("song").artist[0].toLowerCase();
      break;
    case "title":
      var pivotValue = $(arr[pivot]).data("song").title.toLowerCase();
      break;
    case "game":
      var pivotValue = $(arr[pivot]).data("song").game[0].toLowerCase();
      break;
    case "duel":
      var pivotValue = $(arr[pivot]).data("song").duel.toLowerCase();
      break;
  }

  var partitionIndex = left;

  for(var i = left; i < right; i++){
    switch(type){
      case "artist":
        var val = $(arr[i]).data("song").artist[0].toLowerCase();
        break;
      case "title":
        var val = $(arr[i]).data("song").title.toLowerCase();
        break;
      case "game":
        var val = $(arr[i]).data("song").game[0].toLowerCase();
        break;
      case "duel":
        var val = $(arr[i]).data("song").duel.toLowerCase();
        break;
    }
    if(val < pivotValue){
      swap(arr, i, partitionIndex);
      partitionIndex++;
    }
  }
  swap(arr, right, partitionIndex);
  return partitionIndex;
}

function swap(arr, i, j){
   var temp = arr[i];
   arr[i] = arr[j];
   arr[j] = temp;
}

/////end quicksort stuff////


function search(value){ //only show .songs elements that contain the value
  let then = Date.now();
  //only search previous strings if the new value is lnonger than the last one and contains the old value
  if (value.length > previousSearch.length && value.includes(previousSearch) && previousSearch !==""){
    previousSearch = value;
    visibleSongs = subsetSearch(value);
  }else{ //otherwise conduct new search
    //songList.detach();
    //songList.hide();
    //songList.css({'display':'none'})   //fast
    songList.addClass("hidden");
    visibleSongs = songList.toArray();
    visibleSongs = subsetSearch(value); //technically a subset search but the subset is everything
  }

  $(visibleSongs).removeClass("hidden");

}

function subsetSearch(value){
  var newVisible = [];
  $(visibleSongs).each(function(i,e){
    if (containsString(e, value)){
      newVisible.push(this);
    }
  });
  return newVisible;
}

function containsString(song, text){
  var searchable = getArtist(song) +" " +getTitle(song)+" " + getGame(song)+" "+getDuel(song);
  return searchable.toLowerCase().includes(text.toLowerCase());
}

function getArtist(song){
  var data = $(song).data("song").artist;
  var artists;
  for (i=0; i<=data.length; i++){
      artists += (data[i] +", ");
  }
  return decodeURIComponent(artists.substring(0, artists.length-2));
}

function getTitle(song){
  return decodeURIComponent($(song).data("song").title);
}

function getGame(song){
  var data = $(song).data("song").game;
  var game;
  for (i=0; i<=data.length; i++){
    game += (data[i] +", ");
  }
  return decodeURIComponent(game.substring(0, game.length-2));
}

function getDuel(song){
  return decodeURIComponent($(song).data("song").duel);
}

function getUrlParams( prop ) {
    var params = {};
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
    var definitions = search.split( '&' );
    definitions.forEach( function( val, key ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );
    return ( prop && prop in params ) ? params[ prop ] : params;
}
