var player = new Audio();

player.preload = 'none';

$('.play-button').click(function (e) {
  $target = $(e.target);

  if (player.paused) {
    if (!player.src) {
      player.src = $target.next().find('a').attr('href');
    }

    $target.html('Pause');

    player.play();
  } else {
    $target.html('Play');

    player.pause();
  }
});

$(player).on('ended', function () {
  player.src = '';

  target.html('Play');
});
