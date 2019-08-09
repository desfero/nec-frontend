(() => {
  const $iframe = document.getElementById("storybook-preview-iframe");
  const $doc = $iframe.contentDocument;
  const $style = $doc.createElement("style");

  // disable animations
  $style.innerHTML = `* {
    transition: none !important;
    animation: none !important;
  }`;

  $doc.body.appendChild($style);

  // disable video play
  const videos = $doc.getElementsByTagName("video");

  for (video of videos) {
    video.currentTime = 1;
    video.pause();
  }
})();
