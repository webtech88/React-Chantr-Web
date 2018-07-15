var http_request;
var server = "/api/v3/";
var next_attachment = 0;
var signature_id;
var canSubmit=false;
var canRedirect=false;
var sId='';
var cId='';
var cardCategory='';
var phantomUserId='';

(function(w) {
  if (w.FormData)
      return;
  function FormData() {
    this.fake = true;
    this.boundary = "--------FormData" + Math.random();
    this._fields = [];
  }
  FormData.prototype.append = function(key, value) {
    this._fields.push([key, value]);
  }
  FormData.prototype.toString = function() {
    var boundary = this.boundary;
    var body = "";
    this._fields.forEach(function(field) {
        body += "--" + boundary + "\r\n";
        // file upload
        if (field[1].name) {
            var file = field[1];
            body += "Content-Disposition: form-data; name=\""+ field[0] +"\"; filename=\""+ file.name +"\"\r\n";
            body += "Content-Type: "+ file.type +"\r\n\r\n";
            body += file.getAsBinary() + "\r\n";
        } else {
            body += "Content-Disposition: form-data; name=\""+ field[0] +"\";\r\n\r\n";
            body += field[1] + "\r\n";
        }
    });
    body += "--" + boundary +"--";
    return body;
  }
  w.FormData = FormData;
})(window);

function sendSignature() {
  $('#patience1').modal('show');
  document.getElementById('overloaded').style.display = 'none';
  document.getElementById('overloaded1').style.display = 'none';
  document.getElementById('loader-patience').style.display = 'none';
  document.getElementById('girl_zen_mad').style.display = 'none';
  document.getElementById('girl_zen').style.display = 'block';
  NProgress.set(0.2);

  setTimeout(function() {
    document.getElementById('loader-patience').style.display = 'block';
  }, 5000)

  setTimeout(function(){
    document.getElementById('loader-patience').style.display = 'none';
    document.getElementById('girl_zen').style.display = 'none';
    document.getElementById('girl_zen_mad').style.display = 'block';
    document.getElementById('overloaded').style.display = 'block';
    document.getElementById('overloaded1').style.display = 'block';
  }, 15000);
  checkIsCardSubmitted();
}

function checkIsCardSubmitted() {
  $.ajax({
    type: 'GET',
    url: `${server}chants/${document.getElementById("chant_id").value}`,
    error: function() {
      alert('There was a problem with the HTTP request.');
    },
    success: function(response) {
     if (response.isSubmitted) {
      sweetAlert({
        title: "Oops...",
        text: "This card has been already sent",
        type: "error",
        confirmButtonText: "OK",
      },
      function(isConfirm) {
        if (isConfirm) {
          window.top.location = "/card/" + document.getElementById("chant_id").value;
        }
      }
      );
     } else {
      startUploadProcess();
     }
    }
  });
}

function startUploadProcess() {
  calculateHULL();
  NProgress.set(0.4)
  next_attachment = 0;
  http_request = false;
  http_request = getPostRequestObject();
  if (!http_request) {
    alert('Your web browser doesn\'t support ajax');
  }
  else {
    var url = server + "cards/" + document.getElementById("chant_id").value + "/guest/signature";
    var formdata = new FormData();
    formdata.append("signature", document.getElementById('svg_text').value);
    formdata.append("hull", document.getElementById('hull').value);
    formdata.append("angle", 0);

    http_request.onreadystatechange = signatureAddComplete;
    http_request.open('POST', url, true);
    http_request.send(formdata);
  }
}

function signatureAddComplete() {
  if (http_request.readyState == 4) {
    if (http_request.status == 200) {
      NProgress.set(0.6);
      var Response = http_request.responseText;
      var obj = JSON.parse(Response);
      signature_id = obj.status.guest;
      if (obj.status.guest != null) {
        next_attachment = 0;
        uploadAttachment(next_attachment);
      }
      else {}
    }
    else {
      alert('There was a problem with the HTTP request');
    }
  }
}
var http_request_uploader;

function uploadAttachment(id) {
  http_request_uploader = false;
  http_request_uploader = getPostRequestObject();
  if (!http_request_uploader) {
    alert('Your web browser doesn\'t support ajax');
    document.getElementById('loading_final').style.display = 'none';
  }
  else {
    var url = server + "cards/" + document.getElementById("chant_id").value + "/guest/" + signature_id + "/attachment";
    /*
    "key": "file",
    "type": "file",
    "enabled": false,
    "src": "4.jpg"
    /**/
    var obj, obj_full;
    while (id < 5) {
      obj = svgDOM.getElementById('image_' + id);
      obj_full = document.getElementById('image_full_' + id);
      if (obj != null) break;
      id++;
    }
    if (id > 4) {
      signatureUploadIsDONE();
      return;
    }
    //console.log(svgDOM.getElementById(obj_id).getAttribute("href"));
    //var poststr = "image_data="+obj.getAttribute("href").replace(/\+/gi,"%2B");
    //
    var poststr = "image_data=" + encodeURI(obj_full.value.replace(/\+/gi, "%2B"));
    http_request_uploader.onreadystatechange = attachmentUploaded;
    http_request_uploader.open('POST', url, true);
    http_request_uploader.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http_request_uploader.setRequestHeader("Content-length", poststr.length);
    http_request_uploader.setRequestHeader("Connection", "close");
    http_request_uploader.send(poststr);
  }
}

function attachmentUploaded() {
  if (http_request_uploader.readyState == 4) {
    if (http_request_uploader.status == 200) {
      NProgress.set(0.8);
      var Response = http_request_uploader.responseText;
      var obj = JSON.parse(Response);
      if (obj.id != null) {
        next_attachment++;
      }
      if (next_attachment > 4) {
        signatureUploadIsDONE();
      }
      else {
        uploadAttachment(next_attachment);
      }
    }
    else {
      alert('There was a problem with the HTTP request.');
    }
  }
}

function loadSignature(signatureName) {
  http_request = false;
  http_request = getPostRequestObject();
  if (!http_request) {
    alert('Your web browser doesn\'t support ajax');
  }
  else {
    var url = server + 'data/' + signatureName;
    http_request.onreadystatechange = signatureReady;
    http_request.open('GET', url, false);
    //http_request.setRequestHeader("Connection", "close");
    http_request.send(null);
  }
}

function loadAttachment(attachmentName) {
  http_request = false;
  http_request = getPostRequestObject();
  if (!http_request) {
    alert('Your web browser doesn\'t support ajax');
  }
  else {
    var url = server + 'uploads/base64.php?image=' + attachmentName;
    http_request.onreadystatechange = attachmentReady;
    http_request.open('GET', url, false);
    //http_request.setRequestHeader("Connection", "close");
    http_request.send(null);
  }
}

function addSignature(text) {
  var els = getTextBetweenInclude(text, "<g", "</g>");
  var svg = document.getElementById("svg_file");
  var para = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  para.innerHTML = els;
  svg.appendChild(para);
}

function addAttachment(text, size, pos_x, pos_y) {
  //text = text.replace(/\//gi,/);
  //alert(text);
  var svg = document.getElementById("svg_file");
  var para = document.createElementNS("http://www.w3.org/2000/svg", 'image');
  //x="-0.3" y="-0.3" width="0.6" height="0.6" transform="translate(-0.92664 1.28959) rotate(-0)" clip-path="url(#circle)"
  var obj, objID;
  var i;
  for (i = 0; i < 5; i++) {
    obj = svg.getElementById('image_' + i);
    if (obj == null) {
      objID = 'image_' + i;
      break;
    }
  }
  para.setAttribute("id", objID);
  para.setAttribute("onmousedown", "mouseDownOnAttachment(" + i + ");");
  para.setAttribute("onmouseup", "mouseUpOnAttachment();");
  para.setAttribute("onmouseleave", "mouseGoesOutOfAttachment();");
  para.setAttributeNS("http://www.w3.org/1999/xlink", "href", text);
  //para.setAttribute("href", text);
  para.setAttribute("x", -size * 0.5);
  para.setAttribute("y", -size * 0.5);
  para.setAttribute("transform", "translate(" + pos_x + " " + pos_y + ") rotate(0)");
  para.setAttribute("width", size);
  para.setAttribute("height", size);
  para.setAttribute("clip-path", "url(#circle)");
  svg.appendChild(para);
}

function attachmentReady() {
  if (http_request.readyState == 4) {
    if (http_request.status == 200) {
      var Response = http_request.responseText;
      addAttachment(Response, 0.6, 0.0, 0.0);
    }
    else {
      // document.getElementById('loading_final').style.display = 'none';
      alert('There was a problem with the HTTP request.');
    }
  }
}

function signatureReady() {
  if (http_request.readyState == 4) {
    if (http_request.status == 200) {
      var Response = http_request.responseText;
      addSignature(Response);
    }
    else {
      alert('There was a problem with the HTTP request.');
      // document.getElementById('loading_final').style.display = 'none';
    }
  }
}
function redirectToCardView() {
  $.ajax({
    type: 'POST',
    url: `${server}cards/${document.getElementById("chant_id").value}/guest/${signature_id}/profile`,
    error: function() {
      alert('There was a problem with the HTTP request.');
    },
    success: function(status) {
      NProgress.set(0.8);
      window.top.location = "/card/" + document.getElementById("chant_id").value + "?s_id=" + signature_id;
    }
  });
}

function closeYoutubeEmailModal() {
  $('#youtuberEmailModal').modal("hide");
  redirectToCardView();
}

function updateEmailModal() {
  if (http_request.readyState === 4) {
    if (http_request.status === 200) {
      var phantomUserInfo = http_request.responseText;
      phantomUserInfo = JSON.parse(phantomUserInfo);
      phantomUserId = phantomUserInfo.id;
      $('#youtuberEmailModal').modal("hide");
      $('#youtuberActivationModal').modal("show");
      setTimeout(function(){
        redirectToCardView();
      }, 7000);
    } else {
      $('.error').css({ display: 'block' });
    }
  }
}

function resendActivationEmail() {
  if (phantomUserId) {
    var url = server + 'users/resendactivationmail/' + phantomUserId;
    http_request.open('PUT', url, true);
    http_request.send(null);
  }
}


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function updateEmail() {
  var email = document.getElementById('guest-email').value;
  var isValid = validateEmail(email);
  if (isValid) {
    var url = server + 'users/update-email-phantom-user';
    var formdata = new FormData();
    formdata.append("email", email);

    http_request.onreadystatechange = updateEmailModal;
    http_request.open('PUT', url, true);
    http_request.send(formdata);
  } else {
    $('#youtuberEmailModal').modal("hide");
    $('#invalidEmailModal').modal("show");
    setTimeout(function() {
      $('#invalidEmailModal').modal("hide");
      $('#youtuberEmailModal').modal("show");
    }, 2000);
  }
}

function checkYoutuberCard() {
  var sid = signature_id;
  var cid = document.getElementById('chant_id').value;
  sId = sid;
  cId = cid;
  if (http_request.readyState === 4) {
    if (http_request.status === 200) {
      var cardInfo = http_request.responseText;
      cardInfo = JSON.parse(cardInfo);
      cardCategory = cardInfo.category;
      $.ajax({
        type: 'GET',
        url: `${server}auth/status`,
        error: function() {
          alert('There was a problem with the HTTP request.');
        },
        success: function(status) {
          if (status.loggedIn) {
            $.ajax({
              type: 'GET',
              url: `${server}users/${status.userId}`,
              error: function() {
                alert('There was a problem with the HTTP request.');
              },
              success: function(response) {
                if (cardCategory === "youtuber_birthday" && response.phantom_user) {
                  $('#youtuberEmailModal').modal("show");
                } else {
                  redirectToCardView();
                }
              }
            });
          }
         },
      });
    } else {
      alert('There was a problem with the HTTP request.');
    }
  }
}

function signatureUploadIsDONE() {
  var url =  server + 'chants/' + document.getElementById("chant_id").value;
  http_request.onreadystatechange = checkYoutuberCard;
  http_request.open('GET', url, true);
  http_request.send(null);
}
