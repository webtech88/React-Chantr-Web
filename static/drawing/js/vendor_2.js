var bin_pos_x = 1.0;
var bin_pos_y = 0.96;
var bin_size = 0.2;
var targetObj = null;
targetObj = document.getElementById("testID");

/*---- START : Changes for mac scroll -----*/
var scrollImgArray = [{
  x:0,
  y:0,
  radius: 30,
  scrollImageWidth: 60,
  scrollImageHeight: 114.8,
  imgUrl: "/static/images/signature_scroll.svg",
  greyBar: 'hidden',
  marginTop: 0,
  marginBottom: -14,
  initialPosition:0
}, {
  x:0.5,
  y:0,
  radius: 15,
  scrollImageWidth: 30,
  scrollImageHeight: 129,
  imgUrl: "/static/images/signature_scroll_arrows.png",
  greyBar: 'visible',
  marginTop: 0,
  marginBottom: 0,
  initialPosition:25
}];
var screenHeight, signatureHeight;
var macScrollScale = d3.scaleLinear();
/*---- END : Changes for mac scroll -----*/

function performClick(elemId) {
  var elem = document.getElementById(elemId);
  if (elem && document.createEvent) {
    var evt = document.createEvent("MouseEvents");
    evt.initEvent("click", true, false);
    elem.dispatchEvent(evt);
  }
}

function handleFileSelect(evt) {
  var files = evt.target.files; // FileList object
  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {
    // Only process image files.
    if (!f.type.match('image.*')) {
      continue;
    }
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        var image = new Image();
        image.onload = function() {
          document.getElementById('files').value = "";
          addAttachmentX(getThumb(this, 128), image_size_default, 0.0, 0.0, getMaxSize(this, 1500));
        };
        image.src = e.target.result;
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
}

function getThumb(img, new_size) {
  // create an off-screen canvas
  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
  // set its dimension to target size
  canvas.width = new_size;
  canvas.height = new_size;
  var width = img.width;
  var height = img.height;
  var size = Math.min(width, height);
  var offset_x = (width - size) * 0.5;
  var offset_y = (height - size) * 0.5;
  //console.log("Image size is [" + width + "," + height + "].Offset set at [" + offset_x + "," + offset_y + "]");
  // draw source image into the off-screen canvas:
  ctx.drawImage(img, offset_x, offset_y, size, size, 0, 0, new_size, new_size);
  // encode image to data-uri with base64 version of compressed image
  return canvas.toDataURL("image/jpeg", 0.75);
}

function getMaxSize(img, max_size) {
  // create an off-screen canvas
  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
  // set its dimension to target size
  var scale = max_size / Math.max(img.width, img.height);
  if (scale > 1.0) scale = 1.0;
  var new_width = Math.round(img.width * scale);
  var new_height = Math.round(img.height * scale);
  canvas.width = new_width;
  canvas.height = new_height;
  var width = img.width;
  var height = img.height;
  ctx.drawImage(img, 0, 0, width, height, 0, 0, new_width, new_height);
  //console.log(canvas.toDataURL());
  // encode image to data-uri with base64 version of compressed image
  return canvas.toDataURL("image/jpeg", 0.75);
}
document.getElementById('files').addEventListener('change', handleFileSelect, false);
var locked_on = -1;
var locked_obj = null;
var svgDOM = document.getElementById("svg_file");
var box = svgDOM.getElementById("attachment_box");
var pin = svgDOM.getElementById("img_pin");

function uploadPhoto() {
  //loadAttachment("photo_1.jpg");
  var i;
  for (i = 0; i < 5; i++) {
    if (document.getElementById("image_" + i) == null) {
      break;
    }
  }
  if (i > 4) {
    alert("You cannot upload more than 5 photo attachments.");
    return;
  }
  performClick("files");
}
var color_index = 0;
var colors = ["#050505", "#131313", "#ffffff", "#ff3f72", "#ff75c2", "#c920ea", "#9ca3ff", "#9edee6", "#9adeb5", "#bcfc72", "#ffe256", "#f3904e", "#211759", "#4c49a6", "#3f48f2", "#4a7ff4", "#9b42a1", "#fb90a2", "#4293b4", "#3dcfd3", "#94d595", "#ffed00", "#ffb34c", "#fe7756", "#ff5535", "#e59ea9", "#e1474c", "#ce4061", "#ec5095", "#ef84ac", "#f3a9c4", "#e4bad4", "#ed4c78", "#802750", "#80243c", "#4b4b4b", "#71c059", "#fabf39", "#eb8a29", "#e24b4a", "#a452a6", "#16aae0", "#4c7987", "#ea5b0c", "#fe515d", "#353a51", "#0c9da9", "#9f0737", "#03326c", "#f39200"];
var i;
var obj = document.getElementById('color_picker');
for (i = 0; i < colors.length; i++) {
  obj.innerHTML += '<a href="javascript:pickColor(' + i + ');" style="background-color:' + colors[i] + ';"></a>';
}
var color_visible = 0;
var line = d3.line().curve(d3.curveBasis);
var svg = d3.select("svg").call(d3.drag().container(function() {
  return this;
}).subject(function() {
  var p = [d3.event.x, d3.event.y];
  return [p, p];
}).on("start", dragstarted).on("end", dragEnded));
var drawing = svgDOM.getElementById("handwriting");

function dragEnded() {
  //alert("Drag ended...");
  //<path stroke-width="0.0144" stroke="#050505" color_index="0" style="fill: none;stroke-linejoin: round;stroke-linecap: round;"
  last_x = d3.event.x;
  last_y = d3.event.y;
  /*Osama-Maha Start*/
  globalMouseUp();
  var segments = simplify(d, 0.00006);
  var context = d3.path();
  drawSegments( context, segments);
  active.attr("d", context.toString())
  /*Osama-Maha End*/

}
var pointer_offset_x = 0.0;
var pointer_offset_y = 0.0;
var image_size_max = 0.48;
var image_size_min = 0.2;
var image_size = 0.35;
var image_size_default = 0.35;
var image_x = 0;
var image_y = 0;
var drag_action = 0;
var mouse_down = -1;
var last_x;
var last_y;
var starting_distance;
var start_image_size;
/*Osama-Maha Start*/
var active;
var d;
/*Osama-Maha End*/
/*
function checkForAttachmentTouchDown()
{
var i;
var obj;
for(i=0;i<5;i++)
{
  obj = document.getElementById('image_'+i);
  if(obj!=null)
  {
    if(lastTouchInAttachment(obj))
    {
      mouseDownOnAttachment(i);
      return;
    }
  }
}
}

function lastTouchInAttachment(obj)
{
var translate = getTextBetween(obj.getAttribute("transform"),"translate(",")");
var dim = translate.split(" ");

var px = Number(dim[0]);
var py = Number(dim[1]);
if(isNaN(py))
  y = 0.0;

var size = obj.getAttribute("width") * 0.5;

if(vector2DLength(px -last_x,py - last_y) < size)
  return true;

return false;

}
/**/
function dragstarted() {
  //<path stroke-width="0.0144" stroke="#050505" color_index="0" style="fill: none;stroke-linejoin: round;stroke-linecap: round;"
  last_x = d3.event.x;
  last_y = d3.event.y;
  if (locked_on > -1) {
    var translate = getTextBetween(locked_obj.getAttribute("transform"), "translate(", ")");
    var dim = translate.split(" ");
    image_x = Number(dim[0]);
    image_y = Number(dim[1]);
    if (isNaN(image_y)) image_y = 0.0;
    pointer_offset_y = image_y - last_y;
    pointer_offset_x = image_x - last_x;
    //alert("Moving offsets are [" + pointer_offset_x + "," + pointer_offset_y + "]");
  }
  else {
    if (mouse_down < 0)
    {
      /*Osama-Maha Start*/
      var x0 = d3.event.x,
           y0 = d3.event.y;
      d = d3.event.subject,
      active = svg.append("path").datum(d);
      /*Osama-Maha End*/
      active.attr("stroke", colors[color_index]);
      active.attr("color_index", color_index);
      active.attr("stroke-width", "0.0144");
      active.attr("style", "fill: none;stroke-linejoin: round;stroke-linecap: round;pointer-events: none;");
      active.attr("d", "M" + x0 + "," + y0 + "L" + x0 + "," + y0);
    }
  }
  switch (drag_action) {
    case 2: //rotation starting
      {
        angle_offset_mouse = angleOf(last_x - image_x, last_y - image_y);
        break;
      }
    case 3: //scaling starting
      {
        starting_distance = vector2DLength(last_x - image_x, last_y - image_y);
        start_image_size = image_size;
        break;
      }
  };
  d3.event.on("drag", function() {
    //console.log("Drag happened.");
    last_x = d3.event.x;
    last_y = d3.event.y;
    if (locked_on > -1) {
      switch (drag_action) {
        case 1: //move attachment
          {
            image_x = d3.event.x + pointer_offset_x;
            image_y = d3.event.y + pointer_offset_y;
            setTranslate(locked_obj, image_x, image_y);
            matchBoxWithAttachment(d3.event.x + pointer_offset_x, d3.event.y + pointer_offset_y);
            updatePinPos();
            break;
          }
        case 2: //rotate attachment
          {
            var cAngle = angleOf(last_x - image_x, last_y - image_y);
            var angle_delta = cAngle - angle_offset_mouse;
            var new_angle = Number(angle_offset) + Number(angle_delta);
            //console.log("cAngle = [" + cAngle + "], angle_delta = [" + angle_delta + "], new_angle = [" + new_angle + "], angle_offset = [" + angle_offset + "]");
            setImageAngle(locked_obj, new_angle);
            setImageAngle(box, new_angle);
            break;
          }
        case 3: //scale attachment
          {
            var cDistance = vector2DLength(last_x - image_x, last_y - image_y);
            var delta = cDistance - starting_distance;
            //console.log("Old distance was [" + starting_distance + "], New distance is [" + cDistance + "], Delta is [" + delta + "]");
            image_size = start_image_size + (delta * 2.0);
            if (image_size > image_size_max) {
              image_size = image_size_max;
            }
            else if (image_size < image_size_min) {
              image_size = image_size_min;
            }
            setScaleImage(locked_obj, image_size, image_size);
            setScale(box, image_size * 0.5, image_size * 0.5);
            updatePinPos();
            break;
          }
      };
    }
    else if (mouse_down < 0) {
      //console.log("Mouse Down is [" + mouse_down +"]");
      var x1 = d3.event.x,
        y1 = d3.event.y;
      /*Osama-Maha Start*/
      /*dx = x1 - x0,
      dy = y1 - y0;
      if (dx * dx + dy * dy > 0.00012) {
      d.push([x0 = x1, y0 = y1]);
      }
      else d[d.length - 1] = [x1, y1];*/
          d.push([x1, y1]);
      /*Osama-Maha End*/
      active.attr("d", line);
    }
  });
}

function moveBack() {
  var el;
  var i, count = svgDOM.children.length;
  var tagName;
  for (i = count - 1; i > -1; i--) {
    el = svgDOM.children[i];
    //console.log("Acquiring element [" + i +"]");
    tagName = el.tagName;
    if (tagName.indexOf("path") == 0) {
      svgDOM.removeChild(el);
      return;
    }
  }
}

function toggleColors() {
  if (color_visible == 0) {
    document.getElementById('color_picker').style.display = "block";
    color_visible = 1;
  }
  else {
    document.getElementById('color_picker').style.display = "none";
    color_visible = 0;
  }
}

function hideColorPicker() {
  if (color_visible != 0) {
    document.getElementById('color_picker').style.display = "none";
    color_visible = 0;
  }
}

function pickColor(ind) {
  color_index = ind;
  hideColorPicker();
}
var drawing_height = 800;
var preventOnClick = false;

function mouseDown(event) {
  preventOnClick = false;
  hideColorPicker();
}

function matchBoxWithAttachment(x, y) {
  box.setAttribute("visibility", "visible");
  var size = locked_obj.getAttribute("width") * 0.5;
  setTranslate(box, x, y);
}
var select_session = 0;

function touchDownOnAttachment(event) {
  var e = event || window.event;
  e = e.target || e.srcElement;
  mouse_down = Number(e.getAttribute("index"));
  console.log("Mouse Down on attachment [" + mouse_down + "]...");
  drag_action = 1;
  select_session++;
  setTimeout("stillDown(" + mouse_down + ", " + select_session + ");", 950);
  e.preventDefault && e.preventDefault();
  e.stopPropagation && e.stopPropagation();
  e.cancelBubble = true;
  e.returnValue = false;
  return false;
}

function mouseDownOnAttachment(index) {
  mouse_down = index;
  console.log("Mouse Down on attachment [" + mouse_down + "]...");
  drag_action = 1;
  select_session++;
  setTimeout("stillDown(" + mouse_down + ", " + select_session + ");", 950);
}

function stillDown(index, sess) {
  console.log("CHecking still down with session [" + index + " ? " + mouse_down + "], And indes [" + sess + " ? " + select_session + "]");
  if ((mouse_down == index) && (sess == select_session)) {
    enterImageEditMode(index);
  }
}

function enterImageEditMode(index) {
  locked_on = index;
  locked_obj = svgDOM.getElementById("image_" + index);
  box.setAttribute("visibility", "visible");
  pin.setAttribute("visibility", "visible");
  var translate = getTextBetween(locked_obj.getAttribute("transform"), "translate(", ")");
  //console.log("Parsing transform[" + locked_obj.getAttribute("transform") + "], translate [" + translate + "]");
  var dim = translate.split(" ");
  image_x = Number(dim[0]);
  image_y = Number(dim[1]);
  if (isNaN(image_y)) image_y = 0;
  //console.log("Parsed into [" + image_x + "," + image_y + "]");
  pointer_offset_y = image_y - last_y;
  pointer_offset_x = image_x - last_x;
  matchBoxWithAttachment(image_x, image_y);
  image_size = locked_obj.getAttribute("width") * 1.0;
  setScale(box, image_size * 0.5, -image_size * 0.5);
  preventOnClick = true;
  showBin();
  svgDOM.insertBefore(locked_obj, box);
  updatePinPos();
}

function updatePinPos() {
  setTranslate(pin, image_x, image_y + image_size * -0.5);
}

function showBin() {
  document.getElementById("img_bin").style.display = "block";
}

function hideBin() {
  document.getElementById("img_bin").style.display = "none";
}

function mouseGoesOutOfAttachment() {
  //alert("mouseGoesOutOfAttachment");
  mouse_down = -2;
}
var attachment_to_remove = false;
function globalMouseUp()
{
  if (attachment_to_remove)
  {
    //alert(drag_action);
    if (drag_action == 1) deleteSelectedAttachment();
  }
  mouseUpOnAttachment();
  drag_action = 0;
}

function mouseUpOnAttachment() {
  var bin_half_size = bin_size * 0.5;
  var distance = vector2DLength(last_x - bin_pos_x - bin_half_size, last_y + bin_pos_y - bin_half_size);
  if (distance < bin_size * 0.5) {
    //alert(drag_action);
    if (drag_action == 1) deleteSelectedAttachment();
  }
  drag_action = 0;
  mouse_down = -3;
  //console.log("mouseUpOnAttachment");
}

function boardClicked() {
  drag_action = 0;
  //console.log("boardClicked");
  if ((mouse_down < 0) && (!preventOnClick)) leaveImageEditMode();
}

function leaveImageEditMode() {
  drag_action = 0;
  //console.log("Leaving image edit mode...");
  locked_on = -1;
  locked_obj = null;
  box.setAttribute("visibility", "hidden");
  pin.setAttribute("visibility", "hidden");
  hideBin();
}
var angle_offset = 0.0;
var angle_offset_mouse = 0.0;

function rotationButtonDown() {
  //console.log("Rotate button down captured.");
  var transform = locked_obj.getAttribute("transform");
  angle_offset = getTextBetween(transform, "rotate(", ")");
  if ((angle_offset.length < 1) || (isNaN(angle_offset))) angle_offset = 0.0;
  var translate = getTextBetween(transform, "translate(", ")");
  var dim = translate.split(" ");
  image_x = Number(dim[0]);
  image_y = Number(dim[1]);
  if (isNaN(image_y)) image_y = 0.0;
  angle_offset_mouse = angleOf(last_x - image_x, last_y - image_y);
  //console.log("Angle Offset = [" + angle_offset + "], Angle Offset Mouse = [" + angle_offset_mouse + "]");
  drag_action = 2;
}

function scaleButtonDown() {
  drag_action = 3;
  var transform = locked_obj.getAttribute("transform");
  angle_offset = getTextBetween(transform, "rotate(", ")");
  if ((angle_offset.length < 1) || (isNaN(angle_offset))) angle_offset = 0.0;
  var translate = getTextBetween(transform, "translate(", ")");
  var dim = translate.split(" ");
  image_x = Number(dim[0]);
  image_y = Number(dim[1]);
  if (isNaN(image_y)) image_y = 0.0;
  starting_distance = vector2DLength(last_x - image_x, last_y - image_y);
}

function vector2DLength(x, y) {
  return Math.sqrt(x * x + y * y);
}

function multiplyVectorDot2D(ax, ay, bx, by) {
  return ax * bx + ay * by;
}

function angleOf(x, y) {
  if (Math.abs(y) < 0.0001) {
    if (x > 0.001) return 0.0;
    else return 180.0;
  }
  else if (Math.abs(x) < 0.0001) {
    if (y > 0.001) return 90.0;
    else return 270.0;
  }
  var tan = y / x;
  var angle = Math.atan(tan);
  angle *= (180.0 / Math.PI);
  if (x < 0.0) {
    angle += 180.0;
  }
  //console.log("Angle of [" + x + "," + y +"] is [" + angle +"]");
  return angle;
}

function setTranslate(obj, x, y) {
  var transform = obj.getAttribute("transform");
  var old_value = getTextBetweenInclude(transform, "translate(", ")");
  var new_value = transform.replace(old_value, "translate(" + x + " " + y + ")");
  obj.setAttribute("transform", new_value);
}

function setScale(obj, x, y) {
  var transform = obj.getAttribute("transform");
  var old_value = getTextBetweenInclude(transform, "scale(", ")");
  var new_value = transform.replace(old_value, "scale(" + x + " " + y + ")");
  obj.setAttribute("transform", new_value);
}

function setScaleImage(obj, x, y) {
  obj.setAttribute("x", x * -0.5);
  obj.setAttribute("y", y * -0.5);
  obj.setAttribute("width", x);
  obj.setAttribute("height", y);
}

function setImageAngle(obj, angle) {
  var transform = obj.getAttribute("transform");
  ////console.log("Transform value is [" + transform + "]");
  var old_value = getTextBetweenInclude(transform, "rotate(", ")");
  if (old_value.length > 5) {
    ////console.log("Rotate value is [" + old_value + "]");
    var new_value = transform.replace(old_value, "rotate(" + angle + ")");
    ////console.log("Setting transform to [" + new_value + "]");
    obj.setAttribute("transform", new_value);
  }
  else {
    var new_value = transform + " rotate(" + angle + ")";
    ////console.log("Setting transform to [" + new_value + "]");
    obj.setAttribute("transform", new_value);
  }
}
var move_direction = -0.5;

function addAttachmentX(text, size, pos_x, pos_y, full_size_rep) {
  //text = text.replace(/\//gi,/);
  //alert(text);
  var para = document.createElementNS("http://www.w3.org/2000/svg", 'image');
  //x="-0.3" y="-0.3" width="0.6" height="0.6" transform="translate(-0.92664 1.28959) rotate(-0)" clip-path="url(#circle)"
  var obj, objID;
  var i;
  var xx, yy;
  var cSize = 0;
  var translate = "";
  var moved = false;
  var clear = false;
  var iterations = 0;
  while (!clear) {
    clear = true;
    for (i = 0; i < 5; i++) {
      obj = svgDOM.getElementById('image_' + i);
      if (obj != null) {
        cSize = obj.getAttribute("width");
        translate = getTextBetween(obj.getAttribute("transform"), "translate(", ")");
        var dim = translate.split(" ");
        xx = Number(dim[0]);
        yy = Number(dim[1]);
        if (isNaN(yy)) yy = 0.0;
        var distance = vector2DLength(xx - pos_x, yy - pos_y);
        var compare = Number(image_size_default) + Number(cSize);
        ////console.log("Checking for collision with image position is [" + xx + "," + yy + "] With size [" + cSize + "] , Distance is [" + distance + "] , Comparing with [" + compare + "]");
        if (distance < compare * 0.5) {
          ////console.log("OLD position is [" + pos_x + "]");
          pos_x = xx + move_direction * (compare + 0.02);
          ////console.log("New position is [" + pos_x + "]");
          clear = false;
          moved = true;
        }
      }
    }
    iterations++;
    if (iterations > 4) break;
    /**/
  }
  if (moved) {
    if (move_direction > 0.0) move_direction = -0.5;
    else move_direction = 0.5;
  }
  for (i = 0; i < 5; i++) {
    obj = svgDOM.getElementById('image_' + i);
    if (obj == null) {
      objID = 'image_' + i;
      break;
    }
  }
  if (i > 4) {
    alert("Only up to 5 photo attachments can be added to your signature.");
    return;
  }
  para.setAttribute("id", objID);
  para.setAttribute("onmousedown", " mouseDownOnAttachment(" + i + ")");
  para.setAttribute("ontouchstart", "return touchDownOnAttachment()");
  para.setAttribute("onmouseup", "mouseUpOnAttachment();");
  para.setAttribute("ontouchend", "mouseUpOnAttachment();");
  para.setAttribute("onmouseleave", "mouseGoesOutOfAttachment();");
  para.setAttribute("ontouchcancel", "mouseGoesOutOfAttachment();");
  para.setAttribute("index", i);
  para.setAttribute("style", "pointer-events:inherit !important;cursor:pointer;");
  para.setAttributeNS("http://www.w3.org/1999/xlink", "href", text);
  para.setAttribute("x", -size * 0.5);
  para.setAttribute("y", -size * 0.5);
  if (window.orientation !== undefined) {
    para.setAttribute("transform", "translate(" + pos_x + " " + pos_y + ") rotate(90)");
  } else {
    para.setAttribute("transform", "translate(" + pos_x + " " + pos_y + ") rotate(0)");
  }
  para.setAttribute("width", size);
  para.setAttribute("height", size);
  para.setAttribute("clip-path", "url(#circle)");
  //alert(full_size_rep);
  document.getElementById('image_full_' + i).innerHTML = full_size_rep;
  //svgDOM.appendChild(para);
  svgDOM.insertBefore(para, box);
  enterImageEditMode(i);
}
leftBar = document.getElementById('leftBar');
btn_back = document.getElementById('btn_back');
btn_photo = document.getElementById('btn_photo');
btn_done = document.getElementById('btn_done');
btn_colors = document.getElementById('btn_colors');

function resizeLayout() {
  var svgHolder = document.getElementById("svg_file_holder");
  var ref_width = document.documentElement.clientWidth - 16; //Math.min(800/ratio,svgHolder.clientWidth);
  var ref_height = document.documentElement.clientHeight - 4; //Math.min(800,svgHolder.clientHeight);


  //alert("Resized to [" + document.documentElement.clientWidth + "," + document.documentElement.clientHeight + "]");

  var left_bar_size = Math.min(80, Math.round(ref_height * 0.06 )   );
  left_bar_size = Math.max(54,left_bar_size);

  svgHolder.style.height = (ref_height - left_bar_size - 10) + "px";
  //alert("Setting svg holder height to [" + (ref_height - left_bar_size - 10) + "px]");

  //console.log("SVG ELement size is [" + svgHolder.clientWidth + "," + svgHolder.clientHeight +"]");
  var bin = document.getElementById("img_bin");
  var bin_size_x = Math.round(ref_width * 0.10);//-xScreen + 0.05;
  bin.setAttribute("width", bin_size_x);
  bin.setAttribute("height", bin_size_x);


  var ratio = ref_height / ref_width;
  var xScreen = ref_width / ref_height;


  leftBar.style.height =  left_bar_size +  "px";


  //console.log("Moving BIN to [" + bin_pos_x + "]");
  var logo_pos_x = Math.round(ref_width * 0.25);//-xScreen + 0.05;
  document.getElementById("img_logo").setAttribute("width", logo_pos_x);
  document.getElementById("img_logo").setAttribute("height", Math.round(logo_pos_x * 0.5));
  var new_height = ref_height + "px";
  //console.log("SVG ELement height set to [" + new_height + "]");
  var surface_height;
  if(ref_width > ref_height)
    surface_height = Math.round((ref_height - left_bar_size - 10)* 3.4);
  else
    surface_height = (ref_height - left_bar_size - 10);

  /*---- START : Changes for mac scroll -----*/
  var index = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 0 : 1;

  var halfImageHeight = scrollImgArray[index].scrollImageHeight / 2;
  screenHeight = (ref_height - left_bar_size - 10);
  signatureHeight = surface_height;
  macScrollScale.range([0, (signatureHeight - screenHeight)]).domain([halfImageHeight, screenHeight - halfImageHeight]);

  var svg_file_holder = $("#svg_file_holder");
  svg_file_holder.scrollTop(macScrollScale(0));
  $("#svg_file_holder").addClass("mac-os-scroll-width");

  $("#brush").css({display: "block", position: "absolute", width: scrollImgArray[index].scrollImageWidth + 6+"px", height: "calc(100% - 7px)", bottom: "0px", right: 0});

  function setBrushPosition() {
    var Y = d3.event.y;
    if (halfImageHeight < Y && Y < screenHeight - halfImageHeight) {
      d3.select("#brushImage").attr("y", Y - halfImageHeight);
      d3.select("#scrollLine").attr("y1", Y + halfImageHeight + scrollImgArray[index].marginBottom);
      d3.select("#scrollLineBG").attr("y2", Y - halfImageHeight + scrollImgArray[index].marginTop);
      $("#svg_file_holder").scrollTop(macScrollScale(Y));
    } else if (Y > screenHeight - halfImageHeight) {
      d3.select("#brushImage").attr("y", screenHeight - scrollImgArray[index].scrollImageHeight);
      d3.select("#scrollLine").attr("y1", screenHeight + scrollImgArray[index].marginBottom);
      d3.select("#scrollLineBG").attr("y2", screenHeight - scrollImgArray[index].scrollImageHeight + scrollImgArray[index].marginTop);
      $("#svg_file_holder").scrollTop(macScrollScale(screenHeight));
    } else if (halfImageHeight > Y) {
      d3.select("#brushImage").attr("y", 0);
      d3.select("#scrollLine").attr("y1", scrollImgArray[index].scrollImageHeight + scrollImgArray[index].marginBottom);
      d3.select("#scrollLineBG").attr("y2",  scrollImgArray[index].marginTop);
      $("#svg_file_holder").scrollTop(macScrollScale(0));
    }
  }
  $("#svg_file_holder").scrollTop(macScrollScale(scrollImgArray[index].initialPosition + halfImageHeight));
  var brushImageSelection = d3.select("#brushImage").data([1]);

  brushImageSelection
    .attr("id", "brushImage")
    .attr("class", "brushImageElement")
    .attr("xlink:href", scrollImgArray[index].imgUrl)
    .attr("width", scrollImgArray[index].scrollImageWidth)
    .attr("height", scrollImgArray[index].scrollImageHeight);

  d3.select("#scrollLineBG")
    .attr("stroke-width", scrollImgArray[index].radius)
    .attr("x1", scrollImgArray[index].radius)
    .attr("x2", scrollImgArray[index].radius)
    .attr("y1", 0)
    .attr("y2", scrollImgArray[index].initialPosition)
    .style("pointer-events", "auto")
    .style("visibility", scrollImgArray[index].greyBar)
    .style("stroke", "rgba(88, 88, 88, 0.5)")
    .style("stroke-width", (scrollImgArray[index].radius * 2) - 8 + "px")
    .on("click", setBrushPosition);

  d3.select("#scrollLine")
    .attr("stroke-width", scrollImgArray[index].radius)
    .attr("x1", scrollImgArray[index].radius)
    .attr("x2", scrollImgArray[index].radius)
    .attr("y1", scrollImgArray[index].scrollImageHeight + scrollImgArray[index].marginBottom +scrollImgArray[index].initialPosition)
    .attr("y2", screenHeight)
    .style("pointer-events", "auto")
    .style("stroke", "rgba(255, 138, 21, 0.5)")
    .style("stroke-width", (scrollImgArray[index].radius * 2) - 8 + "px")
    .on("click", setBrushPosition);

  d3.select("#brushImage")
    .attr("x", scrollImgArray[index].x)
    .attr("y", scrollImgArray[index].y + scrollImgArray[index].initialPosition)
    .style("pointer-events", "auto")
    .call(d3.drag().on("drag", setBrushPosition));
  /*---- END : Changes for mac scroll -----*/

  //svgDom.height = (ref_height - left_bar_size - 10);
  //alert("Setting surface height [" + surface_height + "]");
  svgDOM.style.height = surface_height + "px";

  var btn_height = Math.round(ref_height * 0.115) + "px";
  btn_colors.style.height = btn_height;
  btn_done.style.height = btn_height;
  btn_back.style.height = btn_height;
  btn_photo.style.height = btn_height;
  btn_colors.style.width = btn_height;
  btn_done.style.width = btn_height;
  btn_back.style.width = btn_height;
  btn_photo.style.width = btn_height;
  btn_colors.style.marginTop = btn_height;
  btn_done.style.marginTop = btn_height;
  btn_back.style.marginTop = btn_height;
  btn_photo.style.marginTop = btn_height;
  color_picker.style.right = Math.round(ref_height * 0.12) + "px";
  //console.log("Setting fontSize to [" + Math.round(ref_height * 0.02) + "px]");
  btn_done.style.fontSize = Math.round(ref_height * 0.02) + "px";
}

function deleteSelectedAttachment()
{
  if (locked_obj != null)
  {
    var obj = locked_obj;
    leaveImageEditMode();
    svgDOM.removeChild(obj);
  }
}
resizeLayout();

/*Osama-Maha Start*/

var Base = new function() {
  var hidden = /^(statics|enumerable|beans|preserve)$/,

    forEach = [].forEach || function(iter, bind) {
      for (var i = 0, l = this.length; i < l; i++)
        iter.call(bind, this[i], i, this);
    },

    forIn = function(iter, bind) {
      for (var i in this)
        if (this.hasOwnProperty(i))
          iter.call(bind, this[i], i, this);
    },

    create = Object.create || function(proto) {
      return { __proto__: proto };
    },

    describe = Object.getOwnPropertyDescriptor || function(obj, name) {
      var get = obj.__lookupGetter__ && obj.__lookupGetter__(name);
      return get
          ? { get: get, set: obj.__lookupSetter__(name),
            enumerable: true, configurable: true }
          : obj.hasOwnProperty(name)
            ? { value: obj[name], enumerable: true,
              configurable: true, writable: true }
            : null;
    },

    _define = Object.defineProperty || function(obj, name, desc) {
      if ((desc.get || desc.set) && obj.__defineGetter__) {
        if (desc.get)
          obj.__defineGetter__(name, desc.get);
        if (desc.set)
          obj.__defineSetter__(name, desc.set);
      } else {
        obj[name] = desc.value;
      }
      return obj;
    },

    define = function(obj, name, desc) {
      delete obj[name];
      return _define(obj, name, desc);
    };

  function inject(dest, src, enumerable, beans, preserve) {
    var beansNames = {};

    function field(name, val) {
      val = val || (val = describe(src, name))
          && (val.get ? val : val.value);
      if (typeof val === 'string' && val[0] === '#')
        val = dest[val.substring(1)] || val;
      var isFunc = typeof val === 'function',
        res = val,
        prev = preserve || isFunc && !val.base
            ? (val && val.get ? name in dest : dest[name])
            : null,
        bean;
      if (!preserve || !prev) {
        if (isFunc && prev)
          val.base = prev;
        if (isFunc && beans !== false
            && (bean = name.match(/^([gs]et|is)(([A-Z])(.*))$/)))
          beansNames[bean[3].toLowerCase() + bean[4]] = bean[2];
        if (!res || isFunc || !res.get || typeof res.get !== 'function'
            || !Base.isPlainObject(res))
          res = { value: res, writable: true };
        if ((describe(dest, name)
            || { configurable: true }).configurable) {
          res.configurable = true;
          res.enumerable = enumerable;
        }
        define(dest, name, res);
      }
    }
    if (src) {
      for (var name in src) {
        if (src.hasOwnProperty(name) && !hidden.test(name))
          field(name);
      }
      for (var name in beansNames) {
        var part = beansNames[name],
          set = dest['set' + part],
          get = dest['get' + part] || set && dest['is' + part];
        if (get && (beans === true || get.length === 0))
          field(name, { get: get, set: set });
      }
    }
    return dest;
  }

  function each(obj, iter, bind) {
    if (obj)
      ('length' in obj && !obj.getLength
          && typeof obj.length === 'number'
        ? forEach
        : forIn).call(obj, iter, bind = bind || obj);
    return bind;
  }

  function set(obj, args, start) {
    for (var i = start, l = args.length; i < l; i++) {
      var props = args[i];
      for (var key in props)
        if (props.hasOwnProperty(key))
          obj[key] = props[key];
    }
    return obj;
  }

  return inject(function Base() {
    set(this, arguments, 0);
  }, {
    inject: function(src) {
      if (src) {
        var statics = src.statics === true ? src : src.statics,
          beans = src.beans,
          preserve = src.preserve;
        if (statics !== src)
          inject(this.prototype, src, src.enumerable, beans, preserve);
        inject(this, statics, true, beans, preserve);
      }
      for (var i = 1, l = arguments.length; i < l; i++)
        this.inject(arguments[i]);
      return this;
    },

    extend: function() {
      var base = this,
        ctor,
        proto;
      for (var i = 0, obj, l = arguments.length;
          i < l && !(ctor && proto); i++) {
        obj = arguments[i];
        ctor = ctor || obj.initialize;
        proto = proto || obj.prototype;
      }
      ctor = ctor || function() {
        base.apply(this, arguments);
      };
      proto = ctor.prototype = proto || create(this.prototype);
      define(proto, 'constructor',
          { value: ctor, writable: true, configurable: true });
      inject(ctor, this, true);
      if (arguments.length)
        this.inject.apply(ctor, arguments);
      ctor.base = base;
      return ctor;
    }
  }, true).inject({
    inject: function() {
      for (var i = 0, l = arguments.length; i < l; i++) {
        var src = arguments[i];
        if (src)
          inject(this, src, src.enumerable, src.beans, src.preserve);
      }
      return this;
    },

    extend: function() {
      var res = create(this);
      return res.inject.apply(res, arguments);
    },

    each: function(iter, bind) {
      return each(this, iter, bind);
    },

    set: function() {
      return set(this, arguments, 0);
    },

    clone: function() {
      return new this.constructor(this);
    },

    statics: {
      each: each,
      create: create,
      define: define,
      describe: describe,

      set: function(obj) {
        return set(obj, arguments, 1);
      },

      clone: function(obj) {
        return set(new obj.constructor(), arguments, 0);
      },

      isPlainObject: function(obj) {
        var ctor = obj != null && obj.constructor;
        return ctor && (ctor === Object || ctor === Base
            || ctor.name === 'Object');
      },

      pick: function(a, b) {
        return a !== undefined ? a : b;
      }
    }
  });
};

if (typeof module !== 'undefined')
  module.exports = Base;

Base.inject({
  toString: function() {
    return this._id != null
      ?  (this._class || 'Object') + (this._name
        ? " '" + this._name + "'"
        : ' @' + this._id)
      : '{ ' + Base.each(this, function(value, key) {
        if (!/^_/.test(key)) {
          var type = typeof value;
          this.push(key + ': ' + (type === 'number'
              ? Formatter.instance.number(value)
              : type === 'string' ? "'" + value + "'" : value));
        }
      }, []).join(', ') + ' }';
  },

  getClassName: function() {
    return this._class || '';
  },

  importJSON: function(json) {
    return Base.importJSON(json, this);
  },

  exportJSON: function(options) {
    return Base.exportJSON(this, options);
  },

  toJSON: function() {
    return Base.serialize(this);
  },

  _set: function(props) {
    if (props && Base.isPlainObject(props))
      return Base.filter(this, props);
  },

  statics: {

    exports: {
      enumerable: true
    },

    extend: function extend() {
      var res = extend.base.apply(this, arguments),
        name = res.prototype._class;
      if (name && !Base.exports[name])
        Base.exports[name] = res;
      return res;
    },

    equals: function(obj1, obj2) {
      if (obj1 === obj2)
        return true;
      if (obj1 && obj1.equals)
        return obj1.equals(obj2);
      if (obj2 && obj2.equals)
        return obj2.equals(obj1);
      if (obj1 && obj2
          && typeof obj1 === 'object' && typeof obj2 === 'object') {
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
          var length = obj1.length;
          if (length !== obj2.length)
            return false;
          while (length--) {
            if (!Base.equals(obj1[length], obj2[length]))
              return false;
          }
        } else {
          var keys = Object.keys(obj1),
            length = keys.length;
          if (length !== Object.keys(obj2).length)
            return false;
          while (length--) {
            var key = keys[length];
            if (!(obj2.hasOwnProperty(key)
                && Base.equals(obj1[key], obj2[key])))
              return false;
          }
        }
        return true;
      }
      return false;
    },

    read: function(list, start, options, length) {
      if (this === Base) {
        var value = this.peek(list, start);
        list.__index++;
        return value;
      }
      var proto = this.prototype,
        readIndex = proto._readIndex,
        index = start || readIndex && list.__index || 0;
      if (!length)
        length = list.length - index;
      var obj = list[index];
      if (obj instanceof this
        || options && options.readNull && obj == null && length <= 1) {
        if (readIndex)
          list.__index = index + 1;
        return obj && options && options.clone ? obj.clone() : obj;
      }
      obj = Base.create(this.prototype);
      if (readIndex)
        obj.__read = true;
      obj = obj.initialize.apply(obj, index > 0 || length < list.length
        ? Array.prototype.slice.call(list, index, index + length)
        : list) || obj;
      if (readIndex) {
        list.__index = index + obj.__read;
        obj.__read = undefined;
      }
      return obj;
    },

    peek: function(list, start) {
      return list[list.__index = start || list.__index || 0];
    },

    remain: function(list) {
      return list.length - (list.__index || 0);
    },

    readAll: function(list, start, options) {
      var res = [],
        entry;
      for (var i = start || 0, l = list.length; i < l; i++) {
        res.push(Array.isArray(entry = list[i])
            ? this.read(entry, 0, options)
            : this.read(list, i, options, 1));
      }
      return res;
    },

    readNamed: function(list, name, start, options, length) {
      var value = this.getNamed(list, name),
        hasObject = value !== undefined;
      if (hasObject) {
        var filtered = list._filtered;
        if (!filtered) {
          filtered = list._filtered = Base.create(list[0]);
          filtered._filtering = list[0];
        }
        filtered[name] = undefined;
      }
      return this.read(hasObject ? [value] : list, start, options, length);
    },

    getNamed: function(list, name) {
      var arg = list[0];
      if (list._hasObject === undefined)
        list._hasObject = list.length === 1 && Base.isPlainObject(arg);
      if (list._hasObject)
        return name ? arg[name] : list._filtered || arg;
    },

    hasNamed: function(list, name) {
      return !!this.getNamed(list, name);
    },

    filter: function(dest, source, exclude) {
      var keys = Object.keys(source._filtering || source);
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        if (!(exclude && exclude[key])) {
          var value = source[key];
          if (value !== undefined)
            dest[key] = value;
        }
      }
      return dest;
    },

    isPlainValue: function(obj, asString) {
      return this.isPlainObject(obj) || Array.isArray(obj)
          || asString && typeof obj === 'string';
    },

    serialize: function(obj, options, compact, dictionary) {
      options = options || {};

      var isRoot = !dictionary,
        res;
      if (isRoot) {
        options.formatter = new Formatter(options.precision);
        dictionary = {
          length: 0,
          definitions: {},
          references: {},
          add: function(item, create) {
            var id = '#' + item._id,
              ref = this.references[id];
            if (!ref) {
              this.length++;
              var res = create.call(item),
                name = item._class;
              if (name && res[0] !== name)
                res.unshift(name);
              this.definitions[id] = res;
              ref = this.references[id] = [id];
            }
            return ref;
          }
        };
      }
      if (obj && obj._serialize) {
        res = obj._serialize(options, dictionary);
        var name = obj._class;
        if (name && !obj._compactSerialize && (isRoot || !compact)
            && res[0] !== name) {
          res.unshift(name);
        }
      } else if (Array.isArray(obj)) {
        res = [];
        for (var i = 0, l = obj.length; i < l; i++)
          res[i] = Base.serialize(obj[i], options, compact,
              dictionary);
      } else if (Base.isPlainObject(obj)) {
        res = {};
        var keys = Object.keys(obj);
        for (var i = 0, l = keys.length; i < l; i++) {
          var key = keys[i];
          res[key] = Base.serialize(obj[key], options, compact,
              dictionary);
        }
      } else if (typeof obj === 'number') {
        res = options.formatter.number(obj, options.precision);
      } else {
        res = obj;
      }
      return isRoot && dictionary.length > 0
          ? [['dictionary', dictionary.definitions], res]
          : res;
    },

    deserialize: function(json, create, _data, _setDictionary, _isRoot) {
      var res = json,
        isFirst = !_data,
        hasDictionary = isFirst && json && json.length
          && json[0][0] === 'dictionary';
      _data = _data || {};
      if (Array.isArray(json)) {
        var type = json[0],
          isDictionary = type === 'dictionary';
        if (json.length == 1 && /^#/.test(type)) {
          return _data.dictionary[type];
        }
        type = Base.exports[type];
        res = [];
        for (var i = type ? 1 : 0, l = json.length; i < l; i++) {
          res.push(Base.deserialize(json[i], create, _data,
              isDictionary, hasDictionary));
        }
        if (type) {
          var args = res;
          if (create) {
            res = create(type, args, isFirst || _isRoot);
          } else {
            res = Base.create(type.prototype);
            type.apply(res, args);
          }
        }
      } else if (Base.isPlainObject(json)) {
        res = {};
        if (_setDictionary)
          _data.dictionary = res;
        for (var key in json)
          res[key] = Base.deserialize(json[key], create, _data);
      }
      return hasDictionary ? res[1] : res;
    },

    exportJSON: function(obj, options) {
      var json = Base.serialize(obj, options);
      return options && options.asString === false
          ? json
          : JSON.stringify(json);
    },

    importJSON: function(json, target) {
      return Base.deserialize(
          typeof json === 'string' ? JSON.parse(json) : json,
          function(ctor, args, isRoot) {
            var useTarget = isRoot && target
                && target.constructor === ctor,
              obj = useTarget ? target
                : Base.create(ctor.prototype);
            if (args.length === 1 && obj instanceof Item
                && (useTarget || !(obj instanceof Layer))) {
              var arg = args[0];
              if (Base.isPlainObject(arg))
                arg.insert = false;
            }
            (useTarget ? obj._set : ctor).apply(obj, args);
            if (useTarget)
              target = null;
            return obj;
          });
    },

    splice: function(list, items, index, remove) {
      var amount = items && items.length,
        append = index === undefined;
      index = append ? list.length : index;
      if (index > list.length)
        index = list.length;
      for (var i = 0; i < amount; i++)
        items[i]._index = index + i;
      if (append) {
        list.push.apply(list, items);
        return [];
      } else {
        var args = [index, remove];
        if (items)
          args.push.apply(args, items);
        var removed = list.splice.apply(list, args);
        for (var i = 0, l = removed.length; i < l; i++)
          removed[i]._index = undefined;
        for (var i = index + amount, l = list.length; i < l; i++)
          list[i]._index = i;
        return removed;
      }
    },

    capitalize: function(str) {
      return str.replace(/\b[a-z]/g, function(match) {
        return match.toUpperCase();
      });
    },

    camelize: function(str) {
      return str.replace(/-(.)/g, function(all, chr) {
        return chr.toUpperCase();
      });
    },

    hyphenate: function(str) {
      return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
  }
});

var Numerical = new function() {

  var abscissas = [
    [  0.5773502691896257645091488],
    [0,0.7745966692414833770358531],
    [  0.3399810435848562648026658,0.8611363115940525752239465],
    [0,0.5384693101056830910363144,0.9061798459386639927976269],
    [  0.2386191860831969086305017,0.6612093864662645136613996,0.9324695142031520278123016],
    [0,0.4058451513773971669066064,0.7415311855993944398638648,0.9491079123427585245261897],
    [  0.1834346424956498049394761,0.5255324099163289858177390,0.7966664774136267395915539,0.9602898564975362316835609],
    [0,0.3242534234038089290385380,0.6133714327005903973087020,0.8360311073266357942994298,0.9681602395076260898355762],
    [  0.1488743389816312108848260,0.4333953941292471907992659,0.6794095682990244062343274,0.8650633666889845107320967,0.9739065285171717200779640],
    [0,0.2695431559523449723315320,0.5190961292068118159257257,0.7301520055740493240934163,0.8870625997680952990751578,0.9782286581460569928039380],
    [  0.1252334085114689154724414,0.3678314989981801937526915,0.5873179542866174472967024,0.7699026741943046870368938,0.9041172563704748566784659,0.9815606342467192506905491],
    [0,0.2304583159551347940655281,0.4484927510364468528779129,0.6423493394403402206439846,0.8015780907333099127942065,0.9175983992229779652065478,0.9841830547185881494728294],
    [  0.1080549487073436620662447,0.3191123689278897604356718,0.5152486363581540919652907,0.6872929048116854701480198,0.8272013150697649931897947,0.9284348836635735173363911,0.9862838086968123388415973],
    [0,0.2011940939974345223006283,0.3941513470775633698972074,0.5709721726085388475372267,0.7244177313601700474161861,0.8482065834104272162006483,0.9372733924007059043077589,0.9879925180204854284895657],
    [  0.0950125098376374401853193,0.2816035507792589132304605,0.4580167776572273863424194,0.6178762444026437484466718,0.7554044083550030338951012,0.8656312023878317438804679,0.9445750230732325760779884,0.9894009349916499325961542]
  ];

  var weights = [
    [1],
    [0.8888888888888888888888889,0.5555555555555555555555556],
    [0.6521451548625461426269361,0.3478548451374538573730639],
    [0.5688888888888888888888889,0.4786286704993664680412915,0.2369268850561890875142640],
    [0.4679139345726910473898703,0.3607615730481386075698335,0.1713244923791703450402961],
    [0.4179591836734693877551020,0.3818300505051189449503698,0.2797053914892766679014678,0.1294849661688696932706114],
    [0.3626837833783619829651504,0.3137066458778872873379622,0.2223810344533744705443560,0.1012285362903762591525314],
    [0.3302393550012597631645251,0.3123470770400028400686304,0.2606106964029354623187429,0.1806481606948574040584720,0.0812743883615744119718922],
    [0.2955242247147528701738930,0.2692667193099963550912269,0.2190863625159820439955349,0.1494513491505805931457763,0.0666713443086881375935688],
    [0.2729250867779006307144835,0.2628045445102466621806889,0.2331937645919904799185237,0.1862902109277342514260976,0.1255803694649046246346943,0.0556685671161736664827537],
    [0.2491470458134027850005624,0.2334925365383548087608499,0.2031674267230659217490645,0.1600783285433462263346525,0.1069393259953184309602547,0.0471753363865118271946160],
    [0.2325515532308739101945895,0.2262831802628972384120902,0.2078160475368885023125232,0.1781459807619457382800467,0.1388735102197872384636018,0.0921214998377284479144218,0.0404840047653158795200216],
    [0.2152638534631577901958764,0.2051984637212956039659241,0.1855383974779378137417166,0.1572031671581935345696019,0.1215185706879031846894148,0.0801580871597602098056333,0.0351194603317518630318329],
    [0.2025782419255612728806202,0.1984314853271115764561183,0.1861610000155622110268006,0.1662692058169939335532009,0.1395706779261543144478048,0.1071592204671719350118695,0.0703660474881081247092674,0.0307532419961172683546284],
    [0.1894506104550684962853967,0.1826034150449235888667637,0.1691565193950025381893121,0.1495959888165767320815017,0.1246289712555338720524763,0.0951585116824927848099251,0.0622535239386478928628438,0.0271524594117540948517806]
  ];

  var abs = Math.abs,
    sqrt = Math.sqrt,
    pow = Math.pow,
    log2 = Math.log2 || function(x) {
      return Math.log(x) * Math.LOG2E;
    },
    EPSILON = 1e-12,
    MACHINE_EPSILON = 1.12e-16;

  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }

  function getDiscriminant(a, b, c) {
    function split(v) {
      var x = v * 134217729,
        y = v - x,
        hi = y + x,
        lo = v - hi;
      return [hi, lo];
    }

    var D = b * b - a * c,
      E = b * b + a * c;
    if (abs(D) * 3 < E) {
      var ad = split(a),
        bd = split(b),
        cd = split(c),
        p = b * b,
        dp = (bd[0] * bd[0] - p + 2 * bd[0] * bd[1]) + bd[1] * bd[1],
        q = a * c,
        dq = (ad[0] * cd[0] - q + ad[0] * cd[1] + ad[1] * cd[0])
            + ad[1] * cd[1];
      D = (p - q) + (dp - dq);
    }
    return D;
  }

  function getNormalizationFactor() {
    var norm = Math.max.apply(Math, arguments);
    return norm && (norm < 1e-8 || norm > 1e8)
        ? pow(2, -Math.round(log2(norm)))
        : 0;
  }

  return {
    TOLERANCE: 1e-6,
    EPSILON: EPSILON,
    MACHINE_EPSILON: MACHINE_EPSILON,
    CURVETIME_EPSILON: 4e-7,
    GEOMETRIC_EPSILON: 2e-7,
    WINDING_EPSILON: 2e-7,
    TRIGONOMETRIC_EPSILON: 1e-7,
    CLIPPING_EPSILON: 1e-9,
    KAPPA: 4 * (sqrt(2) - 1) / 3,

    isZero: function(val) {
      return val >= -EPSILON && val <= EPSILON;
    },

    clamp: clamp,

    integrate: function(f, a, b, n) {
      var x = abscissas[n - 2],
        w = weights[n - 2],
        A = (b - a) * 0.5,
        B = A + a,
        i = 0,
        m = (n + 1) >> 1,
        sum = n & 1 ? w[i++] * f(B) : 0;
      while (i < m) {
        var Ax = A * x[i];
        sum += w[i++] * (f(B + Ax) + f(B - Ax));
      }
      return A * sum;
    },

    findRoot: function(f, df, x, a, b, n, tolerance) {
      for (var i = 0; i < n; i++) {
        var fx = f(x),
          dx = fx / df(x),
          nx = x - dx;
        if (abs(dx) < tolerance)
          return nx;
        if (fx > 0) {
          b = x;
          x = nx <= a ? (a + b) * 0.5 : nx;
        } else {
          a = x;
          x = nx >= b ? (a + b) * 0.5 : nx;
        }
      }
      return x;
    },

    solveQuadratic: function(a, b, c, roots, min, max) {
      var x1, x2 = Infinity;
      if (abs(a) < EPSILON) {
        if (abs(b) < EPSILON)
          return abs(c) < EPSILON ? -1 : 0;
        x1 = -c / b;
      } else {
        b *= -0.5;
        var D = getDiscriminant(a, b, c);
        if (D && abs(D) < MACHINE_EPSILON) {
          var f = getNormalizationFactor(abs(a), abs(b), abs(c));
          if (f) {
            a *= f;
            b *= f;
            c *= f;
            D = getDiscriminant(a, b, c);
          }
        }
        if (D >= -MACHINE_EPSILON) {
          var Q = D < 0 ? 0 : sqrt(D),
            R = b + (b < 0 ? -Q : Q);
          if (R === 0) {
            x1 = c / a;
            x2 = -x1;
          } else {
            x1 = R / a;
            x2 = c / R;
          }
        }
      }
      var count = 0,
        boundless = min == null,
        minB = min - EPSILON,
        maxB = max + EPSILON;
      if (isFinite(x1) && (boundless || x1 > minB && x1 < maxB))
        roots[count++] = boundless ? x1 : clamp(x1, min, max);
      if (x2 !== x1
          && isFinite(x2) && (boundless || x2 > minB && x2 < maxB))
        roots[count++] = boundless ? x2 : clamp(x2, min, max);
      return count;
    },

    solveCubic: function(a, b, c, d, roots, min, max) {
      var f = getNormalizationFactor(abs(a), abs(b), abs(c), abs(d)),
        x, b1, c2, qd, q;
      if (f) {
        a *= f;
        b *= f;
        c *= f;
        d *= f;
      }

      function evaluate(x0) {
        x = x0;
        var tmp = a * x;
        b1 = tmp + b;
        c2 = b1 * x + c;
        qd = (tmp + b1) * x + c2;
        q = c2 * x + d;
      }

      if (abs(a) < EPSILON) {
        a = b;
        b1 = c;
        c2 = d;
        x = Infinity;
      } else if (abs(d) < EPSILON) {
        b1 = b;
        c2 = c;
        x = 0;
      } else {
        evaluate(-(b / a) / 3);
        var t = q / a,
          r = pow(abs(t), 1/3),
          s = t < 0 ? -1 : 1,
          td = -qd / a,
          rd = td > 0 ? 1.324717957244746 * Math.max(r, sqrt(td)) : r,
          x0 = x - s * rd;
        if (x0 !== x) {
          do {
            evaluate(x0);
            x0 = qd === 0 ? x : x - q / qd / (1 + MACHINE_EPSILON);
          } while (s * x0 > s * x);
          if (abs(a) * x * x > abs(d / x)) {
            c2 = -d / x;
            b1 = (c2 - c) / x;
          }
        }
      }
      var count = Numerical.solveQuadratic(a, b1, c2, roots, min, max),
        boundless = min == null;
      if (isFinite(x) && (count === 0
          || count > 0 && x !== roots[0] && x !== roots[1])
          && (boundless || x > min - EPSILON && x < max + EPSILON))
        roots[count++] = boundless ? x : clamp(x, min, max);
      return count;
    }
  };
};

var Formatter = Base.extend({
  initialize: function(precision) {
    this.precision = Base.pick(precision, 5);
    this.multiplier = Math.pow(10, this.precision);
  },

  number: function(val) {
    return this.precision < 16
        ? Math.round(val * this.multiplier) / this.multiplier : val;
  },

  pair: function(val1, val2, separator) {
    return this.number(val1) + (separator || ',') + this.number(val2);
  },

  point: function(val, separator) {
    return this.number(val.x) + (separator || ',') + this.number(val.y);
  },

  size: function(val, separator) {
    return this.number(val.width) + (separator || ',')
        + this.number(val.height);
  },

  rectangle: function(val, separator) {
    return this.point(val, separator) + (separator || ',')
        + this.size(val, separator);
  }
});

Formatter.instance = new Formatter();

var Point = Base.extend({
  _class: 'Point',
  _readIndex: true,

  initialize: function Point(arg0, arg1) {
    var type = typeof arg0;
    if (type === 'number') {
      var hasY = typeof arg1 === 'number';
      this.x = arg0;
      this.y = hasY ? arg1 : arg0;
      if (this.__read)
        this.__read = hasY ? 2 : 1;
    } else if (type === 'undefined' || arg0 === null) {
      this.x = this.y = 0;
      if (this.__read)
        this.__read = arg0 === null ? 1 : 0;
    } else {
      var obj = type === 'string' ? arg0.split(/[\s,]+/) || [] : arg0;
      if (Array.isArray(obj)) {
        this.x = obj[0];
        this.y = obj.length > 1 ? obj[1] : obj[0];
      } else if ('x' in obj) {
        this.x = obj.x;
        this.y = obj.y;
      } else if ('width' in obj) {
        this.x = obj.width;
        this.y = obj.height;
      } else if ('angle' in obj) {
        this.x = obj.length;
        this.y = 0;
        this.setAngle(obj.angle);
      } else {
        this.x = this.y = 0;
        if (this.__read)
          this.__read = 0;
      }
      if (this.__read)
        this.__read = 1;
    }
  },

  equals: function(point) {
    return this === point || point
        && (this.x === point.x && this.y === point.y
          || Array.isArray(point)
            && this.x === point[0] && this.y === point[1])
        || false;
  },

  clone: function() {
    return new Point(this.x, this.y);
  },

  getLength: function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },

  getAngleInDegrees: '#getAngle',
  setAngleInDegrees: '#setAngle'
}, {
  beans: false,

  getDistance: function() {
    var point = Point.read(arguments),
      x = point.x - this.x,
      y = point.y - this.y,
      d = x * x + y * y,
      squared = Base.read(arguments);
    return squared ? d : Math.sqrt(d);
  },

  normalize: function(length) {
    if (length === undefined)
      length = 1;
    var current = this.getLength(),
      scale = current !== 0 ? length / current : 0,
      point = new Point(this.x * scale, this.y * scale);
    if (scale >= 0)
      point._angle = this._angle;
    return point;
  },

  add: function() {
    var point = Point.read(arguments);
    return new Point(this.x + point.x, this.y + point.y);
  },

  subtract: function() {
    var point = Point.read(arguments);
    return new Point(this.x - point.x, this.y - point.y);
  },

  multiply: function() {
    var point = Point.read(arguments);
    return new Point(this.x * point.x, this.y * point.y);
  },

  divide: function() {
    var point = Point.read(arguments);
    return new Point(this.x / point.x, this.y / point.y);
  },

  negate: function() {
    return new Point(-this.x, -this.y);
  },

  isColinear: '#isCollinear',

  dot: function() {
    var point = Point.read(arguments);
    return this.x * point.x + this.y * point.y;
  }
}, Base.each(['round', 'ceil', 'floor', 'abs'], function(key) {
  var op = Math[key];
  this[key] = function() {
    return new Point(op(this.x), op(this.y));
  };
}, {}));

var Segment = Base.extend({
  _class: 'Segment',
  beans: true,
  _selection: 0,

  initialize: function Segment(arg0, arg1, arg2, arg3, arg4, arg5) {
    var count = arguments.length,
      point, handleIn, handleOut,
      selection;
    if (count === 0) {
    } else if (count === 1) {
      if (arg0 && 'point' in arg0) {
        point = arg0.point;
        handleIn = arg0.handleIn;
        handleOut = arg0.handleOut;
        selection = arg0.selection;
      } else {
        point = arg0;
      }
    } else if (arg0 == null || typeof arg0 === 'object') {
      point = arg0;
      handleIn = arg1;
      handleOut = arg2;
      selection = arg3;
    } else {
      point = arg0 !== undefined ? [ arg0, arg1 ] : null;
      handleIn = arg2 !== undefined ? [ arg2, arg3 ] : null;
      handleOut = arg4 !== undefined ? [ arg4, arg5 ] : null;
    }
    new SegmentPoint(point, this, '_point');
    new SegmentPoint(handleIn, this, '_handleIn');
    new SegmentPoint(handleOut, this, '_handleOut');
    if (selection)
      this.setSelection(selection);
  },

  _changed: function(point) {
    var path = this._path;
    if (!path)
      return;
    var curves = path._curves,
      index = this._index,
      curve;
    if (curves) {
      if ((!point || point === this._point || point === this._handleIn)
          && (curve = index > 0 ? curves[index - 1] : path._closed
            ? curves[curves.length - 1] : null))
        curve._changed();
      if ((!point || point === this._point || point === this._handleOut)
          && (curve = curves[index]))
        curve._changed();
    }
    path._changed(25);
  },

  setHandleOut: function() {
    var point = Point.read(arguments);
    this._handleOut.set(point.x, point.y);
  }
});

var SegmentPoint = Point.extend({
  initialize: function SegmentPoint(point, owner, key) {
    var x, y,
      selected;
    if (!point) {
      x = y = 0;
    } else if ((x = point[0]) !== undefined) {
      y = point[1];
    } else {
      var pt = point;
      if ((x = pt.x) === undefined) {
        pt = Point.read(arguments);
        x = pt.x;
      }
      y = pt.y;
      selected = pt.selected;
    }
    this._x = x;
    this._y = y;
    this._owner = owner;
    owner[key] = this;
    if (selected)
      this.setSelected(true);
  },

  set: function(x, y) {
    this._x = x;
    this._y = y;
    this._owner._changed(this);
    return this;
  }
});

function simplify(path, tolerance) {
  var points = []
  for (var i = 0, prev, l = path.length; i < l; i++) {
        var point = new Point(path[i][0], path[i][1])
      if (!prev || !prev.equals(point)) {
        points.push(prev = point.clone());
      }
    }

    var segments =  fit(points, tolerance || 2.5);
    return segments;
}

function fit(points, error) {
      length = points.length,
      segments = null;
    if (length > 0) {
      segments = [new Segment(points[0])];
      if (length > 1) {
        fitCubic(points, segments, error, 0, length - 1,
            points[1].subtract(points[0]),
            points[length - 2].subtract(points[length - 1]));
      } else {
        fitCubic(points, segments, error, 0, 0,
          points[0],
          points[0]);
      }
    }
    return segments;
}

function fitCubic (points, segments, error, first, last, tan1, tan2) {
    if (last - first === 1) {
      var pt1 = points[first],
        pt2 = points[last],
        dist = pt1.getDistance(pt2) / 3;
      addCurve(segments, [pt1, pt1.add(tan1.normalize(dist)),
          pt2.add(tan2.normalize(dist)), pt2]);
      return;
    }
    var uPrime = chordLengthParameterize(points, first, last),
      maxError = Math.max(error, error * error),
      split,
      parametersInOrder = true;
    for (var i = 0; i <= 4; i++) {
      var curve = generateBezier(points, first, last, uPrime, tan1, tan2);
      var max = findMaxError(points, first, last, curve, uPrime);
      if (max.error < error && parametersInOrder) {
        addCurve(segments, curve);
        return;
      }
      split = max.index;
      if (max.error >= maxError)
        break;
      parametersInOrder = reparameterize(points, first, last, uPrime, curve);
      maxError = max.error;
    }
    var tanCenter = points[split - 1].subtract(points[split + 1]);
    fitCubic(points, segments, error, first, split, tan1, tanCenter);
    fitCubic(points, segments, error, split, last, tanCenter.negate(), tan2);
}

function addCurve (segments, curve) {
  var prev = segments[segments.length - 1];
  prev.setHandleOut(curve[1].subtract(curve[0]));
  segments.push(new Segment(curve[3], curve[2].subtract(curve[3])));
}

function generateBezier (points, first, last, uPrime, tan1, tan2) {
  var epsilon = 1e-12,
    abs = Math.abs,
    pt1 = points[first],
    pt2 = points[last],
    C = [[0, 0], [0, 0]],
    X = [0, 0];

  for (var i = 0, l = last - first + 1; i < l; i++) {
    var u = uPrime[i],
      t = 1 - u,
      b = 3 * u * t,
      b0 = t * t * t,
      b1 = b * t,
      b2 = b * u,
      b3 = u * u * u,
      a1 = tan1.normalize(b1),
      a2 = tan2.normalize(b2),
      tmp = points[first + i]
        .subtract(pt1.multiply(b0 + b1))
        .subtract(pt2.multiply(b2 + b3));
    C[0][0] += a1.dot(a1);
    C[0][1] += a1.dot(a2);
    C[1][0] = C[0][1];
    C[1][1] += a2.dot(a2);
    X[0] += a1.dot(tmp);
    X[1] += a2.dot(tmp);
  }

  var detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1],
    alpha1, alpha2;
  if (abs(detC0C1) > epsilon) {
    var detC0X = C[0][0] * X[1]    - C[1][0] * X[0],
      detXC1 = X[0]    * C[1][1] - X[1]    * C[0][1];
    alpha1 = detXC1 / detC0C1;
    alpha2 = detC0X / detC0C1;
  } else {
    var c0 = C[0][0] + C[0][1],
      c1 = C[1][0] + C[1][1];
    if (abs(c0) > epsilon) {
      alpha1 = alpha2 = X[0] / c0;
    } else if (abs(c1) > epsilon) {
      alpha1 = alpha2 = X[1] / c1;
    } else {
      alpha1 = alpha2 = 0;
    }
  }

  var segLength = pt2.getDistance(pt1),
    eps = epsilon * segLength,
    handle1,
    handle2;
  if (alpha1 < eps || alpha2 < eps) {
    alpha1 = alpha2 = segLength / 3;
  } else {
    var line = pt2.subtract(pt1);
    handle1 = tan1.normalize(alpha1);
    handle2 = tan2.normalize(alpha2);
    if (handle1.dot(line) - handle2.dot(line) > segLength * segLength) {
      alpha1 = alpha2 = segLength / 3;
      handle1 = handle2 = null;
    }
  }

  return [pt1,
      pt1.add(handle1 || tan1.normalize(alpha1)),
      pt2.add(handle2 || tan2.normalize(alpha2)),
      pt2];
}

function reparameterize (points, first, last, u, curve) {
  for (var i = first; i <= last; i++) {
    u[i - first] = findRoot(curve, points[i], u[i - first]);
  }
  for (var i = 1, l = u.length; i < l; i++) {
    if (u[i] <= u[i - 1])
      return false;
  }
  return true;
}

function findRoot (curve, point, u) {
  var curve1 = [],
    curve2 = [];
  for (var i = 0; i <= 2; i++) {
    curve1[i] = curve[i + 1].subtract(curve[i]).multiply(3);
  }
  for (var i = 0; i <= 1; i++) {
    curve2[i] = curve1[i + 1].subtract(curve1[i]).multiply(2);
  }
  var pt = evaluate(3, curve, u),
    pt1 = evaluate(2, curve1, u),
    pt2 = evaluate(1, curve2, u),
    diff = pt.subtract(point),
    df = pt1.dot(pt1) + diff.dot(pt2);
  if (Math.abs(df) < 1e-6)
    return u;
  return u - diff.dot(pt1) / df;
}

function evaluate(degree, curve, t) {
  var tmp = curve.slice();
  for (var i = 1; i <= degree; i++) {
    for (var j = 0; j <= degree - i; j++) {
      tmp[j] = tmp[j].multiply(1 - t).add(tmp[j + 1].multiply(t));
    }
  }
  return tmp[0];
}

function chordLengthParameterize(points, first, last) {
  var u = [0];
  for (var i = first + 1; i <= last; i++) {
    u[i - first] = u[i - first - 1]
        + points[i].getDistance(points[i - 1]);
  }
  for (var i = 1, m = last - first; i <= m; i++) {
    u[i] /= u[m];
  }
  return u;
}

function findMaxError(points, first, last, curve, u) {
  var index = Math.floor((last - first + 1) / 2),
    maxDist = 0;
  for (var i = first + 1; i < last; i++) {
    var P = evaluate(3, curve, u[i - first]);
    var v = P.subtract(points[i]);
    var dist = v.x * v.x + v.y * v.y;
    if (dist >= maxDist) {
      maxDist = dist;
      index = i;
    }
  }
  return {
    error: maxDist,
    index: index
  };
}

function turnRemoveOn()
{
  attachment_to_remove = true;
  console.log("To remove is ON.");
  //alert("it's ON.");
}
function turnRemoveOff()
{
  attachment_to_remove = false;
  console.log("To remove is OFF.");
  //alert("it's OFF.");
}

function drawSegments(ctx, segments) {
  var segments = segments,
    length = segments.length,
    coords = new Array(6),
    first = true,
    curX, curY,
    prevX, prevY,
    inX, inY,
    outX, outY;

  function drawSegment(segment) {
    var point = segment._point;
      curX = point._x;
      curY = point._y;
    if (first) {
      ctx.moveTo(curX, curY);
      first = false;
    } else {
      var handle = segment._handleIn;
        inX = curX + handle._x;
        inY = curY + handle._y;
      if (inX === curX && inY === curY
          && outX === prevX && outY === prevY) {
        ctx.lineTo(curX, curY);
      } else {
        ctx.bezierCurveTo(outX, outY, inX, inY, curX, curY);
      }
    }
    prevX = curX;
    prevY = curY;
    var handle = segment._handleOut;
      outX = prevX + handle._x;
      outY = prevY + handle._y;
  }

  for (var i = 0; i < length; i++)
    drawSegment(segments[i]);
}

/*Osama-Maha End*/
