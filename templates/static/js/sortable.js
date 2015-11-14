(function() {
  var SELECTOR, addEventListener, clickEvents, numberRegExp, sortable, touchDevice, trimRegExp;

  SELECTOR = 'table[data-sortable]';

  numberRegExp = /^-?[£$¤]?[\d,.]+%?$/;

  trimRegExp = /^\s+|\s+$/g;

  clickEvents = ['click'];

  touchDevice = 'ontouchstart' in document.documentElement;

  if (touchDevice) {
    clickEvents.push('touchstart');
  }

  addEventListener = function(el, event, handler) {
    if (el.addEventListener != null) {
      return el.addEventListener(event, handler, false);
    } else {
      return el.attachEvent("on" + event, handler);
    }
  };

  sortable = {
    init: function(options) {
      var j, len, results, table, tables;
      if (options == null) {
        options = {};
      }
      if (options.selector == null) {
        options.selector = SELECTOR;
      }
      tables = document.querySelectorAll(options.selector);
      results = [];
      for (j = 0, len = tables.length; j < len; j++) {
        table = tables[j];
        results.push(sortable.initTable(table));
      }
      return results;
    },
    initTable: function(table) {
      var i, j, len, ref, th, ths;
      if (((ref = table.tHead) != null ? ref.rows.length : void 0) !== 1) {
        return;
      }
      if (table.getAttribute('data-sortable-initialized') === 'true') {
        return;
      }
      table.setAttribute('data-sortable-initialized', 'true');
      ths = table.querySelectorAll('th');
      for (i = j = 0, len = ths.length; j < len; i = ++j) {
        th = ths[i];
        if (th.getAttribute('data-sortable') !== 'false') {
          sortable.setupClickableTH(table, th, i);
        }
      }
      return table;
    },
    setupClickableTH: function(table, th, i) {
      var eventHandled, eventName, j, len, onClick, results, type;
      type = sortable.getColumnType(table, i);
      eventHandled = false;
      onClick = function(e) {
        var _compare, compare, item, j, k, l, len, len1, len2, len3, len4, m, n, newSortedDirection, position, ref, ref1, row, rowArray, sorted, sortedDirection, tBody, ths, value;
        if (eventHandled) {
          return;
        }
        eventHandled = true;
        setTimeout(function() {
          return eventHandled = false;
        }, 0);
        sorted = this.getAttribute('data-sorted') === 'true';
        sortedDirection = this.getAttribute('data-sorted-direction');
        if (sorted) {
          newSortedDirection = sortedDirection === 'ascending' ? 'descending' : 'ascending';
        } else {
          newSortedDirection = type.defaultSortDirection;
        }
        ths = this.parentNode.querySelectorAll('th');
        for (j = 0, len = ths.length; j < len; j++) {
          th = ths[j];
          th.setAttribute('data-sorted', 'false');
          th.removeAttribute('data-sorted-direction');
        }
        this.setAttribute('data-sorted', 'true');
        this.setAttribute('data-sorted-direction', newSortedDirection);
        tBody = table.tBodies[0];
        rowArray = [];
        if (!sorted) {
          if (type.compare != null) {
            _compare = type.compare;
          } else {
            _compare = function(a, b) {
              return b - a;
            };
          }
          compare = function(a, b) {
            if (a[0] === b[0]) {
              return a[2] - b[2];
            }
            if (type.reverse) {
              return _compare(b[0], a[0]);
            } else {
              return _compare(a[0], b[0]);
            }
          };
          ref = tBody.rows;
          for (position = k = 0, len1 = ref.length; k < len1; position = ++k) {
            row = ref[position];
            value = sortable.getNodeValue(row.cells[i]);
            if (type.comparator != null) {
              value = type.comparator(value);
            }
            rowArray.push([value, row, position]);
          }
          rowArray.sort(compare);
          for (l = 0, len2 = rowArray.length; l < len2; l++) {
            row = rowArray[l];
            tBody.appendChild(row[1]);
          }
        } else {
          ref1 = tBody.rows;
          for (m = 0, len3 = ref1.length; m < len3; m++) {
            item = ref1[m];
            rowArray.push(item);
          }
          rowArray.reverse();
          for (n = 0, len4 = rowArray.length; n < len4; n++) {
            row = rowArray[n];
            tBody.appendChild(row);
          }
        }
        if (typeof window['CustomEvent'] === 'function') {
          return typeof table.dispatchEvent === "function" ? table.dispatchEvent(new CustomEvent('Sortable.sorted', {
            bubbles: true
          })) : void 0;
        }
      };
      results = [];
      for (j = 0, len = clickEvents.length; j < len; j++) {
        eventName = clickEvents[j];
        results.push(addEventListener(th, eventName, onClick));
      }
      return results;
    },
    getColumnType: function(table, i) {
      var j, k, len, len1, ref, ref1, ref2, row, specified, text, type;
      specified = (ref = table.querySelectorAll('th')[i]) != null ? ref.getAttribute('data-sortable-type') : void 0;
      if (specified != null) {
        return sortable.typesObject[specified];
      }
      ref1 = table.tBodies[0].rows;
      for (j = 0, len = ref1.length; j < len; j++) {
        row = ref1[j];
        text = sortable.getNodeValue(row.cells[i]);
        ref2 = sortable.types;
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          type = ref2[k];
          if (type.match(text)) {
            return type;
          }
        }
      }
      return sortable.typesObject.alpha;
    },
    getNodeValue: function(node) {
      var dataValue;
      if (!node) {
        return '';
      }
      dataValue = node.getAttribute('data-value');
      if (dataValue !== null) {
        return dataValue;
      }
      if (typeof node.innerText !== 'undefined') {
        return node.innerText.replace(trimRegExp, '');
      }
      return node.textContent.replace(trimRegExp, '');
    },
    setupTypes: function(types) {
      var j, len, results, type;
      sortable.types = types;
      sortable.typesObject = {};
      results = [];
      for (j = 0, len = types.length; j < len; j++) {
        type = types[j];
        results.push(sortable.typesObject[type.name] = type);
      }
      return results;
    }
  };

  sortable.setupTypes([
    {
      name: 'numeric',
      defaultSortDirection: 'descending',
      match: function(a) {
        return a.match(numberRegExp);
      },
      comparator: function(a) {
        return parseFloat(a.replace(/[^0-9.-]/g, ''), 10) || 0;
      }
    }, {
      name: 'date',
      defaultSortDirection: 'ascending',
      reverse: true,
      match: function(a) {
        return !isNaN(Date.parse(a));
      },
      comparator: function(a) {
        return Date.parse(a) || 0;
      }
    }, {
      name: 'alpha',
      defaultSortDirection: 'ascending',
      match: function() {
        return true;
      },
      compare: function(a, b) {
        return a.localeCompare(b);
      }
    }
  ]);

  setTimeout(sortable.init, 0);

  if (typeof define === 'function' && define.amd) {
    define(function() {
      return sortable;
    });
  } else if (typeof exports !== 'undefined') {
    module.exports = sortable;
  } else {
    window.Sortable = sortable;
  }

}).call(this);
