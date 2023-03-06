const VOTING_LABELS = [
  'Terrible',
  'Bad',
  'Below Average',
  'Average',
  'Above Average',
  'Good',
  'Incredible'
];

//storedVote is an array of numbers, 0 index is the first song vote value in the list.

// format_vote
// song: string
// vote: Number
// is_my_song: bool
// returns string
function format_vote (song, vote, is_my_song) {
  const out = song + ' / ';

  if (is_my_song) {
    return out + 'my song';
  }

  const hundreds = Math.round(vote / 100);
  const offset = '+' + ((vote - (hundreds * 100)) / 100).toFixed(2);
  const label = VOTING_LABELS[hundreds].toLowerCase();

  return out + label + ' ' + offset.replace('+-', '-');
}

// monthDateAndTheme: string
function update_votes (monthDateAndTheme) {
  let votes = '';

  $('.voting-slider').each(function (i) {
    const $el = $(this);

    const song = $el.data('song');
    const vote = $el.data('ionRangeSlider').result.from;

    const $checkbox = $('input[data-id="' + $el.data('id') + '"]');
    const is_my_song = $checkbox.prop('checked');

    votes += format_vote(song, vote, is_my_song) + '\n';
    update_local_storage_vote(monthDateAndTheme, i, vote)
  });

  $('#voting-result').val(votes.trim());
}

// initialize_default_votes initializes all votes to the default value of 300 and stores in localStorage.
// monthDateAndTheme: string // used as key for storing votes in local storage, should be like '20-01-brevity'
function initialize_default_votes (monthDateAndTheme) {
  let arrayOfVotes = [];

  $('.voting-slider').each(function () {
    arrayOfVotes.push(300);
  });

  localStorage.setItem(monthDateAndTheme, JSON.stringify(arrayOfVotes))
}

// load_stored_votes
// monthDateAndTheme: string // used as key for retrieving from localstorage
// returns []int
function load_stored_votes(monthDateAndTheme) {
  let storedVotes = localStorage.getItem(monthDateAndTheme);
  if (storedVotes === null) {
    initialize_default_votes(monthDateAndTheme);
    storedVotes = localStorage.getItem(monthDateAndTheme);
  }
  return JSON.parse(storedVotes);
}

// monthDateAndTheme: string
// index: int //index of song to update vote for
// vote: int // the vote amount/slider amount the vote has now
function update_local_storage_vote(monthDateAndTheme, index, vote) {
  let storedVotes = JSON.parse(localStorage.getItem(monthDateAndTheme));
  storedVotes[index] = vote;
  localStorage.setItem(monthDateAndTheme, JSON.stringify(storedVotes));
}

// make_voting
// monthDateAndTheme: string // used as key for storing votes in local storage, should be like '20-01-brevity'
function make_voting (monthDateAndTheme) {
  let arrayOfStoredVotes = load_stored_votes(monthDateAndTheme);

  $('.voting-slider').each(function(i, slider) {
    console.debug(slider)
    $(slider).ionRangeSlider({
      min: 0,
      max: 600,
      from: arrayOfStoredVotes[i],
      grid: true,
      grid_snap: true,
      hide_min_max: true,
      hide_from_to: true,

      prettify: function (num) {
        return num / 100;
      },

      prettify_labels: function (num) {
        return num % 100 === 0 ? VOTING_LABELS[num / 100] : num;
      },

      grid_line_visible: function (num) {
        return num % 100 === 0;
      },

      additional_grid_line_class: function (num) {
        return 'small';
      },

      onFinish: function (data) {
        update_votes(monthDateAndTheme);
      }
    });
  })



  $('input[type="checkbox"]').change(function (e) {
    const $el = $(e.target);
    const $sliders = $('.irs-with-grid');
    const $slider = $sliders.eq($el.data('id'));

    update_votes();

    $slider[$el.prop('checked') ? 'addClass' : 'removeClass']('irs-disabled');
  });
}


// send_votes will POST the votes to the vote receiving endpoint
function send_votes(token) {
        let theWholeForm = document.getElementById("submit-form");
        let submitButton = document.getElementById("submitButton");
        let bodyFormData = new FormData(theWholeForm);
        let votesTextArea = document.getElementById('voting-result');
        let successBox = document.getElementById("successBox");

        submitButton.disabled = true;

        //ensure all fields filled in
        console.log(bodyFormData)
        if (bodyFormData.get("submitterEmail") === "" ||
                bodyFormData.get("submitterEmailConfirm") === ""){
            successBox.innerText = "Must fill in all required fields!";
            return;
        }

        if (bodyFormData.get("submitterEmail") !== bodyFormData.get("submitterEmailConfirm")){
            successBox.innerText = "Email fields mismatch!";
            return;
        }

        successBox.innerText = "Submitting votes...";
        axios({
            method: "post",
            url: "https://5fn6tt1ii8.execute-api.us-east-1.amazonaws.com/dev/vote",
            //url: "http://localhost:8000/",
            data: {
                submitterEmail: bodyFormData.get("submitterEmail"),
                votes: votesTextArea.value,
                "g-recaptcha-response": token,
            },
            headers: { "Content-Type": `application/json` },
        })
        .then(function () {
            successBox.innerText = "Votes submitted!";
        })
        .catch(function (error) {
            //handle error
            successBox.innerText = `Error :(\n${error}`;
            console.log("error", error);
        });
    }