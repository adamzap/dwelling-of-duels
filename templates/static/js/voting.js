var LABELS = [
  'Terrible',
  'Bad',
  'Below Average',
  'Average',
  'Above Average',
  'Good',
  'Incredible'
];

function format_vote (song, vote) {
  var hundreds = Math.round(vote / 100);
  var offset = '+' + ((vote - (hundreds * 100)) / 100).toFixed(2);

  return song + ' / ' + LABELS[hundreds] + ' ' + offset.replace('+-', '-');
}

function update_votes () {
  var votes = '';

  $('.voting-slider').each(function () {
    var $el = $(this);

    var song = $el.data('song');
    var vote = $el.data('ionRangeSlider').result.from;

    votes += format_vote(song, vote) + '\n';
  });

  $('#voting-result').val(votes);
}

$('.voting-slider').ionRangeSlider({
  min: 0,
  max: 600,
  grid: true,
  grid_snap: true,
  hide_min_max: true,
  hide_from_to: true,

  prettify: function (num) {
    return num / 100;
  },

  prettify_labels: function (num) {
    return num % 100 === 0 ? LABELS[num / 100] : num;
  },

  grid_line_visible: function (num) {
    return num % 100 === 0;
  },

  additional_grid_line_class: function (num) {
    return 'small';
  },

  onFinish: function (data) {
    update_votes();
  }
});
