wishyooCMSApp.controller('MoveSignatureController', [
  '$scope', '$routeParams', 'request', 'globals', '$timeout',
  function ($scope, $routeParams, request, globals, $timeout) {
  	console.log('MoveSignatureController');
  	$scope.board_width  = 10.0;
		$scope.board_height = 10.0;
		$scope.board_pixels = 800;
		$scope.message = '';
		$scope.baseUrl = globals.baseUrl;
  	$scope.card_id = $routeParams.card_id;
  	var getAllSignatureUrl = globals.baseUrl + globals.apiPrefix + '/admin/board/' + $scope.card_id + '/all_signatures';
  	var moveSignatureUrl = globals.baseUrl + globals.apiPrefix + '/admin/move_signature';

  	function getAllSignatures() {
  		return request.get(getAllSignatureUrl)
	  		.then(function (res){
	  			$scope.board_width = res.board.width;
	  			$scope.board_height = res.board.height;

	        $scope.signatures = res.signatures.map(function(signature) {
	        	return {
	        		pos_x: signature.handwriting.x,
					    pos_y: signature.handwriting.y,
					    size_x:0.8,
							size_y: 0.8,
							id : signature.id,
							moved_to_x: 0.0,
							moved_to_y: 0.0,
							moved:0,
							image: signature.handwriting.imageUrl
	        	}
	        });
	      })
  	}

  	getAllSignatures();
  	$scope.moveSignatureView = true;

  	$scope.checkIfInsideLoginCtrl = function (){
      if($location.url().indexOf('/move_signature') >= 0) {
        return true;
      }
    };

    $scope.lastEle = function ($last) {
    	if ($last) {
	    	$timeout(function () {
	    		var zz;
	    		for(zz = 0;zz<$scope.signatures.length;zz++) {
						translatePositionToSvg($scope.signatures[zz]);
					}
					$( ".movable_signature" ).draggable({
				    start: function() {},
				    drag: function() {},
				    stop: function() {
				   		translateBack(this);
				    }
				  });
					}, 100);
    	}
    }

  	function translatePositionToSvg(obj) {
  		var sig = document.getElementById("signature_" + obj.id);
  		
			var pos_x = (obj.pos_x - ($scope.board_width * -0.5)) /  $scope.board_width;
			pos_x = Math.round(pos_x * $scope.board_pixels);

			var pos_y = (obj.pos_y - ($scope.board_height * -0.5)) /  $scope.board_height;
			pos_y = $scope.board_pixels - Math.round(pos_y * $scope.board_pixels);


			var sig_size_x = obj.size_x /  $scope.board_width ;
			var sig_size_y = obj.size_y /  $scope.board_height;

			var sig_size_x = Math.round(sig_size_x * $scope.board_pixels);
			var sig_size_y = Math.round(sig_size_y * $scope.board_pixels);



			sig.style.left = (pos_x -  Math.round(0.5 * sig_size_x)) + "px";
			sig.style.top  = (pos_y - Math.round(0.5 * sig_size_y)) + "px";

			sig.style.height 	= sig_size_x + "px";
			sig.style.width 	= sig_size_x + "px";

		}


		function setSignatureSize(iid, doc) {
			var i;
			for(i=0; i<$scope.signatures.length; i++)
			{
				if(iid == $scope.signatures[i].id)
				{
					var doc1 = doc.firstChild;
					//console.log("Obj has [" + doc1.childElementCount + "] children.");
					var viewbox = doc1.getAttribute('viewBox');

					var res = viewbox.split(" ");
					$scope.signatures[i].size_x = res[2];
					$scope.signatures[i].size_y = res[3];
					console.log("Setting size [" + res[2] + "," + res[3] + "]");
					translatePositionToSvg(signatures[i]);
					//signatures[i].

				}

			}

		}
		$scope.setSignatureSize = setSignatureSize;
	  function translateBack(obj) {
			var i;
			for(i=0; i<$scope.signatures.length; i++)
			{
				console.log("COmparing ===["+"signature_" + $scope.signatures[i].id+"]=====["+obj.getAttribute("id")+"]====");

				var str = "signature_" + $scope.signatures[i].id;
				var compare_result = str.localeCompare( obj.getAttribute("id"));

				if( compare_result  == 0)
				{
					var new_pos_x = obj.style.left.replace("px","") / $scope.board_pixels;
					new_pos_x = $scope.board_width * -0.5 + new_pos_x * $scope.board_width;
					var new_pos_y = obj.style.top.replace("px","") / $scope.board_pixels;
					new_pos_y = $scope.board_width * -0.5 + new_pos_y * $scope.board_height;
					new_pos_y*=-1.0;

					console.log("Setting new position to [" + new_pos_x + "," + new_pos_y + "]");

					$scope.signatures[i].moved = 1;
					$scope.signatures[i].moved_to_x = new_pos_x;
					$scope.signatures[i].moved_to_y = new_pos_y;


					break;
				}
			}
		}


		$scope.createMoveList = function (event) {
			var movedsignatures = [];

			for(i=0; i< $scope.signatures.length; i++) {

				if($scope.signatures[i].moved > 0 ) {

					var move_x = $scope.signatures[i].moved_to_x;
					var move_y = $scope.signatures[i].moved_to_y;
					movedsignatures.push({
						signature_id: $scope.signatures[i].id,
						x: $scope.signatures[i].moved_to_x,
						y: $scope.signatures[i].moved_to_y
					})

				}
			}
			var promises = [];

			movedsignatures.forEach(function (signature) {
				promises.push(request.post(moveSignatureUrl, signature));
			})

			return Promise.all(promises)
				.then(function (res) {
					$scope.message = "Signatures moved successfully.";
					$scope.$apply();
					return true;
				}).catch(function (error) {
					$scope.message = error.message;
					$scope.$apply();
				});
		}

}]);
