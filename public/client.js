// custom scroll to hide title on header bar    
var rtime;
var timeout = false;
var delta = 100;
var doAfterScroll = function () {
  /* Things to do after done scrolling */
  if ($(window).scrollTop() > document.querySelector('#hero > div > h1').offsetTop) {
    // $('#header #logo h1 a').fadeIn('slow');
    $('#header').fadeIn(500);
  }
  else {
    // $('#header #logo h1 a').fadeOut('slow');
    $('#header').fadeOut(500);
  }

}
doAfterScroll();
var scrollend = function () {
  if (new Date() - rtime < delta) {
    setTimeout(scrollend, delta);
  } else {
    timeout = false;
    doAfterScroll();
  }
}
$(window).scroll(function () {
  rtime = new Date();
  if (timeout === false) {
    timeout = true;
    setTimeout(scrollend, delta);
  }
  return false;
});