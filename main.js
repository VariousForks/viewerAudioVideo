/* Copyright (c) 2013-present The TagSpaces Authors.
 * Use of this source code is governed by the MIT license which can be found in the LICENSE.txt file. */

/* globals plyr, initI18N, getParameterByName, $, sendMessageToHost */
'use strict';

let extSettings;

$(document).ready(() => {
  const locale = getParameterByName('locale');
  const filePath = getParameterByName('file');
  initI18N(locale, 'ns.viewerAudioVideo.json');

  loadExtSettings();

  // var extensionSupportedFileTypesVideo = ['mp4', 'webm', 'ogv', 'm4v'];
  const extensionSupportedFileTypesAudio = ['mp3', 'ogg'];

  loadSprite(
    $(document).find('body')
  );
  const ext = filePath
    .split('.')
    .pop()
    .toLowerCase();
  let controls = $('<video controls>');
  const controlsHTML = ["<div class='plyr__controls'>",
  "<button type='button' data-plyr='restart'>",
      "<svg><use xlink:href='#plyr-restart'></use></svg>",
      "<span class='plyr__sr-only'>Restart</span>",
  "</button>",
  "<button type='button' data-plyr='rewind'>",
      "<svg><use xlink:href='#plyr-rewind'></use></svg>",
      "<span class='plyr__sr-only'>Rewind {seektime} secs</span>",
  "</button>",
  "<button type='button' data-plyr='play'>",
      "<svg><use xlink:href='#plyr-play'></use></svg>",
      "<span class='plyr__sr-only'>Play</span>",
  "</button>",
  "<button type='button' data-plyr='pause'>",
      "<svg><use xlink:href='#plyr-pause'></use></svg>",
      "<span class='plyr__sr-only'>Pause</span>",
  "</button>",
  "<button type='button' data-plyr='fast-forward'>",
      "<svg><use xlink:href='#plyr-fast-forward'></use></svg>",
      "<span class='plyr__sr-only'>Forward {seektime} secs</span>",
  "</button>",
  "<span class='plyr__progress'>",
      "<label for='seek{id}' class='plyr__sr-only'>Seek</label>",
      "<input id='seek{id}' class='plyr__progress--seek' type='range' min='0' max='100' step='0.1' value='0' data-plyr='seek'>",
      "<progress class='plyr__progress--played' max='100' value='0' role='presentation'></progress>",
      "<progress class='plyr__progress--buffer' max='100' value='0'>",
          "<span>0</span>% buffered",
      "</progress>",
      "<span class='plyr__tooltip'>00:00</span>",
  "</span>",
  "<span class='plyr__time'>",
      "<span class='plyr__sr-only'>Current time</span>",
      "<span class='plyr__time--current'>00:00</span>",
  "</span>",
  "<span class='plyr__time'>",
      "<span class='plyr__sr-only'>Duration</span>",
      "<span class='plyr__time--duration'>00:00</span>",
  "</span>",
  "<button type='button' data-plyr='mute'>",
      "<svg class='icon--muted'><use xlink:href='#plyr-muted'></use></svg>",
      "<svg><use xlink:href='#plyr-volume'></use></svg>",
      "<span class='plyr__sr-only'>Toggle Mute</span>",
  "</button>",
  "<span class='plyr__volume'>",
      "<label for='volume{id}' class='plyr__sr-only'>Volume</label>",
      "<input id='volume{id}' class='plyr__volume--input' type='range' min='0' max='10' value='5' data-plyr='volume'>",
      "<progress class='plyr__volume--display' max='10' value='0' role='presentation'></progress>",
  "</span>",
  "<button type='button' data-plyr='captions'>",
      "<svg class='icon--captions-on'><use xlink:href='#plyr-captions-on'></use></svg>",
      "<svg><use xlink:href='#plyr-captions-off'></use></svg>",
      "<span class='plyr__sr-only'>Toggle Captions</span>",
  "</button>",
  // "<button type='button' data-plyr='fullscreen'>",
  //    "<svg class='icon--exit-fullscreen'><use xlink:href='#plyr-exit-fullscreen'></use></svg>",
  //    "<svg><use xlink:href='#plyr-enter-fullscreen'></use></svg>",
  //    "<span class='plyr__sr-only'>Toggle Fullscreen</span>",
  // "</button>",
"</div>"].join("");

  const options = {
    html: controlsHTML,
    title: 'TagSpaces',
    tooltips: {
      controls: false
    },
    captions: {
      defaultActive: true
    },
    hideControls: false
  };
  if (extensionSupportedFileTypesAudio.indexOf(ext) !== -1) {
    controls = $('<audio controls>');
  }
  controls.append('<source>').attr('src', filePath);

  $(document).find('.js-plyr').append(controls);

  const player = plyr.setup('.js-plyr', options)[0];
  player.play();
  let resume;

  window.addEventListener('resume', (e) => {
    if (resume === true && e.detail === true) {
      resume = false;
      player.play();
    } else {
      resume = true;
      player.pause();
    }
  });

  function loadSprite(body) {
    const jqxhr = $.get('./libs/plyr/dist/plyr.svg', () => {
      const $el = $('<div/>')
        .css('display', 'none')
        .html(jqxhr.responseText);
      body.prepend($el);
    });
  }

  function saveExtSettings() {
    const settings = {};
    localStorage.setItem('viewerAudioVideoSettings', JSON.stringify(settings));
  }

  function loadExtSettings() {
    extSettings = JSON.parse(localStorage.getItem('viewerAudioVideoSettings'));
  }

  document.querySelector('.js-plyr').addEventListener('ended', () => {
    sendMessageToHost({ command: 'playbackEnded', filepath: filePath });
  });
});
