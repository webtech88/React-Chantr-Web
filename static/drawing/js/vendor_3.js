window.addEventListener('load', function() {
  var maybePreventPullToRefresh = false;
  var lastTouchY = 0;
  var touchstartHandler = function(e) {
    if (e.touches.length != 1) return;
    lastTouchY = e.touches[0].clientY;
    // Pull-to-refresh will only trigger if the scroll begins when the
    // document's Y offset is zero.
    maybePreventPullToRefresh = window.pageYOffset == 0;
  }
  var touchmoveHandler = function(e) {
    var touchY = e.touches[0].clientY;
    var touchYDelta = touchY - lastTouchY;
    lastTouchY = touchY;
    if (maybePreventPullToRefresh) {
      // To suppress pull-to-refresh it is sufficient to preventDefault the
      // first overscrolling touchmove.
      maybePreventPullToRefresh = false;
      if (touchYDelta > 0) {
        e.preventDefault();
        return;
      }
    }
  }
  document.addEventListener('touchstart', touchstartHandler, false);
  document.addEventListener('touchmove', touchmoveHandler, false);
});
document.getElementById('chant_id').value = getTextBetween(window.location + "&", "chant_id=", "&");
var txt = getTextBetween(window.location + "&", "theme=", "&");
var theme;
if(txt.length < 1)
	theme = 0;
else
	theme = Number(txt);
	
	

var bgs = ["bg_hbd.jpg", "bg_love.jpg", "bg_angels.jpg", "bg_sport.jpg", "bg_party.jpg", "bg_hearts.jpg", "bg_baby.jpg", "bg_jewish.jpg", "bg_thanks.jpg", "bg_love2.jpg", "bg_leaves.jpg"];
//svgDOM.getElementById("board_background").setAttributeNS( "http://www.w3.org/1999/xlink", "href","backgrounds/" + bgs[theme]);
//alert("backgrounds/" + bgs[theme]);
var img = new Image();
img.src = "backgrounds/" + bgs[theme];
img.onload = function()
{
  var el_img = document.createElementNS("http://www.w3.org/2000/svg", 'image');
  el_img.setAttribute("id", "board_background");
  el_img.setAttributeNS("http://www.w3.org/1999/xlink", "href", "backgrounds/" + bgs[theme]);
  //para.setAttribute("href", text);
  el_img.setAttribute("width", "100%");
  el_img.setAttribute("height", "100%");
  var el_pattern = document.createElementNS("http://www.w3.org/2000/svg", 'pattern');
  el_pattern.setAttribute("id", "pat1");
  el_pattern.setAttribute("patternUnits", "userSpaceOnUse");
  el_pattern.setAttribute("x", "-1.0");
  el_pattern.setAttribute("y", "-1.0");
  el_pattern.setAttribute("width", "100%");
  el_pattern.setAttribute("height", "100%");
  el_pattern.appendChild(el_img);
  svgDOM.insertBefore(el_pattern, svgDOM.childNodes[0]);
}

function pinClicked() {
  var i, j, k = locked_on;
  for (i = 1; i < 5; i++) {
    j = (i + k) % 5;
    if (document.getElementById('image_' + j) != null) {
      enterImageEditMode(j);
    }
  }
}
