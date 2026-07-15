(function () {
  'use strict';
  var key = new URLSearchParams(window.location.search).get('soin');
  var care = window.DIVARIS_INTERVENTIONS && window.DIVARIS_INTERVENTIONS[key];
  if (!care) {
    window.location.replace('interventions.html');
    return;
  }

  document.title = care[0] + ' Dr Marc Divaris';
  document.querySelector('meta[name="description"]').content = care[2];
  document.getElementById('care-pole').textContent = 'Interventions / ' + care[1];
  document.getElementById('care-title').textContent = care[0];
  document.getElementById('care-intro').textContent = care[2];
  document.getElementById('care-analysis').textContent = care[3];
  document.getElementById('care-suites').textContent = care[4];
  document.getElementById('care-source').href = care[5];

  var longform = window.DIVARIS_LONGFORM && window.DIVARIS_LONGFORM[key];
  var container = document.getElementById('care-longform');
  if (longform && container) {
    longform.forEach(function (part) {
      var section = document.createElement('section');
      section.className = 'care-long-section';
      var title = document.createElement('h2');
      title.textContent = part.title;
      section.appendChild(title);
      part.paragraphs.forEach(function (text) {
        var paragraph = document.createElement('p');
        paragraph.textContent = text;
        section.appendChild(paragraph);
      });
      container.appendChild(section);
    });
  }
}());
