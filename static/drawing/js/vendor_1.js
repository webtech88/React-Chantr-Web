function voidF() {}
var segment = 0.01;

function calculateHULL() {
  var list;
  list = svgDOM.querySelectorAll("#svg_file>path");
  if (list.length < 1) return;
  var points = new Array();
  var i, res, path, j, totalLength, line_width = 0.0175;
  var max_x = -999,
    max_y = -999,
    min_x = 999,
    min_y = 999;

  for (j = 0; j < list.length; j++)
  {
    path = list[j];
    totalLength = path.getTotalLength();
	//console.log("Path [" + j + "] size is [" + totalLength + "].");

    for (var si = 0.0; si < totalLength; si += segment)
	{

      res = path.getPointAtLength(si);
	  //console.log("Reading path [" + j + "] segment [" + si + "] = [" + res.x + "," + res.y +" + ].");

      res.y = res.y;
      points.push(new Coords(res.x + line_width, res.y));
      points.push(new Coords(res.x - line_width, res.y));
      points.push(new Coords(res.x, res.y + line_width));
      points.push(new Coords(res.x, res.y - line_width));
      max_x = Math.max(max_x, res.x + line_width);
      max_y = Math.max(max_y, res.y + line_width);
      min_x = Math.min(min_x, res.x - line_width);
      min_y = Math.min(min_y, res.y - line_width);
      ////console.log("Point at [" + i + "] is [" + res.x + "," + res.y + "]");
    }
  }
  var obj, translate, dim, img_x, img_y, img_size, angle, angle_segment = (Math.PI * 2.0) / 24.0,
    jj;
  for (j = 0; j < 5; j++) {
    obj = svgDOM.getElementById("image_" + j);
    if (obj != null) {
      //get image position
      translate = getTextBetween(obj.getAttribute("transform"), "translate(", ")");
      dim = translate.split(" ");
      img_x = Number(dim[0]);
      img_y = Number(dim[1]);
      if (isNaN(img_y)) img_y = 0;
      	img_size = obj.getAttribute("width") * 0.5;
      for (jj = 0; jj < 24; jj++)
	  {
        angle = angle_segment * jj;
        //console.log("Angle [" + angle + "] Coords are [" + (Math.cos(angle) * img_size) + "," + (img_y + Math.sin(angle) * img_size) + "]");
        points.push(new Coords(img_x + Math.cos(angle) * img_size, img_y + Math.sin(angle) * img_size));
      }


	  console.log("SVG Scene Extremes are  [" + max_y + "," + max_x + "," + min_y + "," + min_x + "]");
	  console.log("Image size is  [" + img_size + "] Position [" + img_x + "," + img_y + "]");

      max_x = Math.max(max_x, img_x + img_size);
      max_y = Math.max(max_y, img_y + img_size);
      min_x = Math.min(min_x, img_x - img_size);
      min_y = Math.min(min_y, img_y - img_size);
	  console.log("SVG Scene Extremes are  [" + max_y + "," + max_x + "," + min_y + "," + min_x + "]");
    }
  }

  var final_height = max_y - min_y;
  var final_width  = max_x - min_x;





  var offset_x = (min_x + (max_x - min_x) * 0.5);
  var offset_y = (min_y + (max_y - min_y) * 0.5);
  console.log("Middle points are  [" + offset_x + " , " + offset_y + "]");







  var hull = calculateConvexHull(points);
  var i;

  //var data = "M" + hull[0].x + " " + hull[0].y;

  var cHull = "[";
  for (i = 1; i < hull.length - 1; i++) {
   // data += "L" + hull[i].x + " " + hull[i].y;
    ////console.log("Hull point [" + i + "] is [" + hull[i].x + "," + hull[i].y + "].");
    hull[i].x -= offset_x;
    hull[i].y -= offset_y;
    cHull += "[" + hull[i].x + "," + (-hull[i].y) + "],";
  }
  cHull = cHull.substring(0, cHull.length - 1) + "]";
  var svg_output = "<svg width=\"800\" height=\"800\" viewBox=\"" + (final_width * -0.5) + " " + (final_height * -0.5) + " " + final_width+ " " + final_height + "\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><defs><clipPath id=\"circle\" clipPathUnits=\"objectBoundingBox\"><circle cx=\".5\" cy=\".5\" r=\".5\" /></clipPath></defs><g transform=\"scale(1.0 -1.0)\">"
  var parts = new Array();
  for (j = 0; j < list.length; j++)
  {
    parts[j] = getMove(list[j], offset_x, offset_y);
  }
  svg_output += parts.join("") + "</g>";
  var imgs = new Array();
  var obj, translate, dim, img_x, img_y, img_size, angle, angle_segment = (Math.PI * 2.0) / 24.0,
    jj;
  for (j = 0; j < 5; j++) {
    obj = svgDOM.getElementById("image_" + j);
    imgs[j] = getImage(j, offset_x, offset_y);
  }
  svg_output += imgs.join("") + "</svg>";
  /*
  data += " Z";
  var para = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  para.setAttribute("fill","red");
  para.setAttribute("opacity","0.4");
  para.setAttribute("d",data);
  svgDOM.insertBefore(para,box);
  /**/
  document.getElementById("hull").value = cHull;
  document.getElementById("svg_text").value = svg_output;
}

function getMove(path, offset_x, offset_y) {
  var color = path.getAttribute("stroke"),
    color_index = path.getAttribute("color_index"),
    stroke_width = path.getAttribute("stroke-width");
  var output = "<path stroke-width=\"" + stroke_width + "\" stroke=\"" + color + "\" color_index=\"" + color_index + "\" style=\"fill: none;stroke-linejoin: round;stroke-linecap: round;\" d=\"";
  totalLength = path.getTotalLength();
  var res = path.getPointAtLength(0.0);

  res.x -= offset_x;
  res.y -= offset_y;
  output += "M" + res.x + "," + -res.y;
  for (i = segment; i < totalLength; i += segment) {
    if (i > totalLength)
	{
      i = totalLength;
      res = path.getPointAtLength(i);

      res.x -= offset_x;
      res.y -= offset_y;
      output += " L" + res.x + "," + -res.y;
      break;
    }
    res = path.getPointAtLength(i);
    res.x -= offset_x;
    res.y -= offset_y;
    output += " L" + res.x + "," + -res.y;
  }
  output += "\"></path>";
  return output;
}

function getImage(i, offset_x, offset_y)
{
  var obj = svgDOM.getElementById("image_" + i);
  if (obj == null) return "";
  var i_width = Number(obj.getAttribute("width"));
  var i_height = Number(obj.getAttribute("height"));
  var translate = getTextBetween(obj.getAttribute("transform"), "translate(", ")");
  var dim = translate.split(" ");
  var i_x = Number(dim[0]);
  var i_y = Number(dim[1]);
  if (isNaN(i_y)) i_y = 0.0;
  var i_angle = Number(getTextBetween(obj.getAttribute("transform"), "rotate(", ")"));
  i_x -= offset_x;
  i_y -= offset_y;
  return "<image xlink:href=\"" + obj.getAttributeNS("http://www.w3.org/1999/xlink", "href") + "\" x=\"" + i_width * -0.5 + "\" y=\"" + i_height * -0.5 + "\" width=\"" + i_width + "\" height=\"" + i_height + "\" transform=\"translate(" + i_x + " " + i_y + ") rotate(" + i_angle + ")\" clip-path=\"url(#circle)\" \/>";
}
var leftBar = null;
var btn_back = null;
var btn_photo = null;;
var btn_done = null;
var btn_colors = null;
