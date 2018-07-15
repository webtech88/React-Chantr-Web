var http_request;

function getPostRequestObject() {
  var obj1;
  obj1 = false;
  if (window.XMLHttpRequest) { // Mozilla, Safari,...
    obj1 = new XMLHttpRequest();
    if (obj1.overrideMimeType) {
      // set type accordingly to anticipated content type
      //http_request.overrideMimeType('text/xml');
      obj1.overrideMimeType('text/html');
    }
  }
  else if (window.ActiveXObject) { // IE
    try {
      obj1 = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
      try {
        obj1 = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (e) {}
    }
  }
  if (!obj1) {
    return false;
  }
  else {
    return obj1;
  }
}

function getTextBetween(txt, textA, textB) {
  var a = txt.indexOf(textA);
  if (a < 0) return "";
  a += textA.length;
  var b = txt.indexOf(textB, a);
  if (b < 0) return "";
  return txt.substring(a, b);
}

function getTextBetweenInclude(txt, textA, textB) {
  var a = txt.indexOf(textA);
  if (a < 0) return "";
  var b = txt.indexOf(textB, a);
  if (b < 0) return "";
  b += textB.length;
  return txt.substring(a, b);
}

function Value(xmltext, node) {
  a = xmltext.search("<" + node + ">");
  a = a + node.length + 2;
  b = xmltext.search("</" + node + ">");
  return xmltext.substr(a, b - a);
}

function removeClassFromObject(obj, classname) {
  var a = obj.className;
  var b = a.search(classname);
  while (b > -1) {
    a = a.substr(0, b) + a.substr(b + classname.length);
    b = a.search(classname);
  }
  obj.className = a;
}

function addClassToObject(obj, classname) {
  obj.className = obj.className + ' ' + classname;
}