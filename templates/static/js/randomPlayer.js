/* globals Howl*/
var songButtons = $("table span.playerButton");
var playing = false;
var songName = "";
var currentVolume;
var muted;
var sound;
var currentSongBlock;
var shuffle = true;
var songList = $(".song");
var visibleSongs = songList.toArray();
var previousSearch = "";
var sorting = false;
var currentSort;
var favesOnly = false;
var $modal = $(".modl");
var initialLoad = true;



String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length === 0) return hash;
	for (let i = 0; i < this.length; i++) {
		let char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

window.onerror = function(msg, url, line, col, error) {
	var extra = !col ? '' : '\ncolumn: ' + col;
	extra += !error ? '' : '\nerror: ' + error;
	alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

	// TODO: Report this error via ajax so you can keep track
	//       of what pages have JS issues
	var blob ={
		playing: playing,
		songName: songName,
		currentVolume: currentVolume,
		sound: sound,
		currentSongBlock: currentSongBlock,
		shuffle: shuffle,
		songList: songList,
		visibleSongs: visibleSongs,
		previousSearch: previousSearch,
		sorting: sorting,
		currentSort: currentSort,
		favesOnly: favesOnly,
	};
	$.post('/', JSON.stringify(blob), null, "json");

	var suppressErrorAlert = true;
	return suppressErrorAlert;
};

function playerInit(){
	currentVolume = (localStorage.getItem('volume') === null || localStorage.getItem('volume') === undefined) ? 1.0 : localStorage.getItem('volume');
	$("#playerVolumeSlider").val(currentVolume*100);

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
  $("#playerToggle").click(function(){
		if (initialLoad){
			initialLoad = false;
			nextSong();
		} else {
			togglePlay();
		}
	});
  $("#playerShuffle").click(function(){
		if (initialLoad){
			initialLoad = false;
			nextSong();
		} else {
			toggleShuffle();
		}
	});
  $("#playerForward").click(nextSong);
  $("#playerProgressBar").click(function(){
		if (initialLoad){
			initialLoad = false;
			nextSong();
		} else {
			seekTrack();
		}
	});

  //add volume slider listener
	$("#playerVolumeSlider").on('input', function(){
		currentVolume = this.value*.01;
		localStorage.setItem("volume", currentVolume);
		sound.volume(currentVolume);
	});

	//add volume button listener
	$("#playerVolumeButton").click(function(){
		if(!muted){
			$("#playerVolumeButton").removeClass("fa-volume-up");
			$("#playerVolumeButton").addClass("fa-volume-off");
			$("#playerVolumeSlider").attr("disabled", true);
			muted = true;
			sound.volume(0);
		} else {
			$("#playerVolumeButton").removeClass("fa-volume-off");
			$("#playerVolumeButton").addClass("fa-volume-up");
			$("#playerVolumeSlider").removeAttr("disabled");
			muted = false;
			sound.volume(currentVolume);
		}
	});

  //Add sorter listeners
  $("#theadFavorite").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			toggleFaves();
			setModalVisible(false);
		}, 50);
	});
  $("#theadTitle").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			sortTable("title");
			setModalVisible(false);
		}, 50);
	});
  $("#theadArtist").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			sortTable("artist");
			setModalVisible(false);
		}, 50);
	});
  $("#theadGame").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			sortTable("game");
			setModalVisible(false);
		}, 50);
	});
  $("#theadDuel").click(()=>{
		setModalVisible(true);
		window.setTimeout(()=>{
			sortTable("duel");
			setModalVisible(false);
		}, 50);
	});

  //search bar listener
	countdown = false;
  $("#searchField").on("input", function(){
		if (countdown){
			clearTimeout(countdown);
		}
		countdown = setTimeout(function(){
			search($("#searchField").val());
			countdown=false;
		}, 250);
  });

  //get all things labeled "song" and add listeners to them
  songList.each(function(i, s){
    $(s).click(function(){songPressed(this);});
  });

  //load all favorites and set corresponding track icon to be faved
  loadFavorites();

  //add listener to all favorite buttons
  $(".favBtn").each(function(i, e){
    $(e).click(function(event){
      toggleFavorite($(this).parent().parent()[0]);
      event.stopPropagation();
    });
  });

  //currentSongBlock = songList.get(0);
  //nextSong();

	$("#title").text("Pick a song...");

  //TODO TODO
  //Add functionality to read the query parameters using getURLParams() and filter by first param then scroll to that track

	setModalVisible(false);
}

function loadFavorites(){
  //for each value in the favorites array
  let fav = JSON.parse(localStorage.getItem("favorites"));
	if(fav){
		fav.forEach(function(id){
			//find song with that id
			$("#"+id).toggleClass("favorite");
			//toggle favorite class
		});
	}
}


function toggleFavorite(song){
  song = $(song);

  if (song.hasClass("favorite")){
    song.removeClass("favorite");
    //remove from storage
    let fav = JSON.parse(localStorage.getItem("favorites"));
    let i = fav.indexOf(song.attr("id"));
    fav.splice(i, 1);
    localStorage.setItem("favorites", JSON.stringify(fav));
  } else {
    song.addClass("favorite");
    if(!localStorage.getItem("favorites")){
      localStorage.setItem("favorites", "[]");
    }
    let fav = JSON.parse(localStorage.getItem("favorites"));
    fav.push(song.attr("id"));
    localStorage.setItem("favorites", JSON.stringify(fav));
  }
}

function seekTrack(e){ //called when you click on progress bar
  var localX = e.pageX - $("#playerProgressBar").offset().left;
  var percent = localX/$("#playerProgressBar").width();
  var seekPos = Math.floor(sound.duration() * percent);
  sound.seek(seekPos);
  updateProgress();
  return seekPos;
}

function songPressed(s){
  //get song data for this block
	//TODO change title back to loading...
	setPageTitles("Loading...");
  var data = $(s).data("song");
  scrollToBlock($(visibleSongs).index(s));
  currentSongBlock = s;
  playNewSong(data);

}

function toggleShuffle(){
	let $playerShuffle = $("#playerShuffle");
  if (shuffle){
		$playerShuffle.css("color", "#FFF");
    shuffle = false;
  } else{
		$playerShuffle.css("color", "#e11a1a");
    shuffle = true;
  }
}

function updateProgress(){ //called via setinterval
  var percent = sound.seek()/sound.duration();
  $("#bar").width((percent*100)+"%");
  var sec = Math.floor(sound.seek()%60);
  var min = Math.floor(sound.seek()/60);
  if (sec<10)
    sec = "0"+sec;
  if (min<10)
    min = "0"+min;
  if(isNaN(min) || isNaN(sec))
    min = sec = "00";
  $("#playerTimer").text(min+":"+sec);
}

function nextSong(){
  var index;

  if(shuffle){
    index = Math.round( (Math.random() * visibleSongs.length)-1);
  } else {
    index = $(visibleSongs).index(currentSongBlock)+1;
    if (index > visibleSongs.length-1)
      index = 0;
  }
  scrollToBlock(index);


  currentSongBlock = $(visibleSongs).get(index);

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
    index = 2;
  try{
    $('.nano').nanoScroller({scrollTo: $($(visibleSongs).get(index-2))});
  }catch(e){}
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
	clearInterval($("#playerProgressBar").attr("data-id"));
	var x = setInterval(updateProgress, 200);
	$("#playerProgressBar").attr("data-id", x);
  $("#playerToggle").removeClass("fa-play");
  $("#playerToggle").addClass("fa-pause");
}

function playNewSong(obj){
  sound.unload();
  sound = new Howl({
    src: obj.src,
    volume: currentVolume,
    loop: false,
    onend: nextSong,
    preload: true,
    html5: true,
    autoplay: false,
		onload: function(){setPageTitles(decodeURIComponent(obj.title) + " - "+decodeURIComponent(obj.artist));},
  });
	setPageTitles(decodeURIComponent(obj.title) + " - "+decodeURIComponent(obj.artist));
  playSong();
}

function setPageTitles(newTitle){
	$("title").text(newTitle + " - Dwelling of Duels Archive Explorer");
  $("#title").text(newTitle);
}

function pauseSong(){
  playing = false;
  sound.pause();
  $("#playerToggle").removeClass("fa-pause");
  $("#playerToggle").addClass("fa-play");
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
  var blocks = songList.toArray();

  //detach all
  $(blocks).detach();

  if(favesOnly){
    blocks = songList.filter(".song.favorite").toArray();
  }else{
    blocks = songList.filter(".song").toArray();
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
  data = quickSort(data, 0, data.length-1, type);

  return data;
}

function toggleFaves(){ //TODO
  favesOnly = !favesOnly;
  if (!currentSort){
    currentSort="title";
  }
  sortTable(currentSort);
}

function setModalVisible(value){
	if (value === null || value === undefined){
		throw new Error("Value required");
	}
	if(value){
		$modal.css("display", "block");
		return;
	}
	$modal.css("display", "none");

}


////quicksort stuff///
function quickSort(arr, left, right, type){
   var pivot,
   partitionIndex;

  if(left < right){
    pivot = right;
    partitionIndex = partition(arr, pivot, left, right, type);

   //sort left and right
   quickSort(arr, left, partitionIndex - 1, type);
   quickSort(arr, partitionIndex + 1, right, type);
  }
  return arr;
}

function partition(arr, pivot, left, right, type){
	var pivotValue;
  switch(type){
    case "artist":
      pivotValue = $(arr[pivot]).data("song").artist[0];
      break;
    case "title":
      pivotValue = $(arr[pivot]).data("song").title;
      break;
    case "game":
      pivotValue = $(arr[pivot]).data("song").game[0];
      break;
    case "duel":
      pivotValue = $(arr[pivot]).data("song").duel;
      break;
  }
	pivotValue = decodeURI(pivotValue).toLowerCase().replace(/[\W]/gu, '');

  var partitionIndex = left;

  for(var i = left; i < right; i++){
		var val;
    switch(type){
      case "artist":
        val = $(arr[i]).data("song").artist[0];
        break;
      case "title":
        val = $(arr[i]).data("song").title;
        break;
      case "game":
        val = $(arr[i]).data("song").game[0];
        break;
      case "duel":
        val = $(arr[i]).data("song").duel;
        break;
    }
		val = decodeURI(val).toLowerCase().replace(/[\W]/gu, '');

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
  //only search previous strings if the new value is lnonger than the last one and contains the old value
  if (value.length > previousSearch.length && value.includes(previousSearch) && previousSearch !==""){
    previousSearch = value;
    visibleSongs = subsetSearch(value);
  }else{ //otherwise conduct new search
    songList.addClass("hidden");
    visibleSongs = songList.toArray();
    visibleSongs = subsetSearch(value); //technically a subset search but the subset is everything
  }

  $(visibleSongs).removeClass("hidden");
}

function subsetSearch(value){
  var newVisible = [];
  $(visibleSongs).each(function(i, e){
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
  for (let i=0; i<=data.length; i++){
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
  for (let i=0; i<=data.length; i++){
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
    definitions.forEach( function( val ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );
    return ( prop && prop in params ) ? params[ prop ] : params;
}
