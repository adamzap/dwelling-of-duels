var play_src = $('.play-button').attr('src');
var stop_src = play_src.replace('play.svg', 'stop.svg');

var player = new Audio();

player.preload = 'none';

$('.play-button').click(function (e) {
  $img = $(e.target);

  var song_url = $img.data('song-url');

  if (player.paused) {
    player.src = song_url;

    $img.attr('src', stop_src);

    player.play();
  } else {
    player.pause();

    if ($img.attr('src') === play_src) {
      player.src = song_url;

      $('.play-button').attr('src', play_src);

      $img.attr('src', stop_src);

      player.play();
    } else {
      player.src = '';

      $img.attr('src', play_src);
    }
  }
});
