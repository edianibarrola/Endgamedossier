/* Local files should load offline; preserve a useful fallback if a file is missing. */
(() => {
  document.querySelectorAll('img').forEach(image => {
    const fail = () => {image.parentElement.classList.add('image-failed'); image.hidden = true;};
    image.addEventListener('error', fail);
    if (image.complete && !image.naturalWidth) fail();
  });
})();
