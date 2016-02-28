function normalize (s) {
  return s.toLowerCase().replace('š', 's').replace('é', 'e');
}

function make_filter () {
  var input = document.getElementById('filter');

  input.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  input.addEventListener('input', function (e) {
    var query = normalize(e.target.value);
    var rows = document.querySelectorAll('tbody tr');
    var length = rows.length;

    for (var i = 0; i < length; i++) {
      var s = normalize(rows[i].querySelectorAll('a')[0].textContent);

      rows[i].style.display = s.indexOf(query) !== -1 ? 'table-row' : 'none';
    }
  });
}
