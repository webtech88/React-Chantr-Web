
wishyooCMSApp.controller('CoverImageController', [
  '$scope', '$timeout', '$modalInstance', 'globals', 'request', 'coverImageForm', 'Upload', 'card_id',
  function ($scope , $timeout, $modalInstance, globals, request, coverImageForm, Upload, card_id) {

    $scope.card_id = card_id;
    var apiUrl = globals.baseUrl + globals.apiPrefix + '/chants/' + $scope.card_id + '/images';

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };


    var handleFileSelect = function(evt) {
      debugger;
      var file=evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.coverImage=evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };

    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    $scope.uploadCoverImage = function (file, name) {
      if ($scope.form.coverImageForm.$valid) {
        console.log('coverImageForm is in scope', file, name);
        if(file) {
          file.upload = Upload.upload({
            url: apiUrl,
            data: { filedata: file }
          });

          file.upload.then(function (response) {
            $timeout(function() {
              file.result = response.data;
              $modalInstance.close();
            })
          }, function (response) {
            if (response.status > 0)
              $scope.errorMsg = response.status + ': ' + response.data;
          }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
        } else {
          console.log('no file found');
        }
      } else {
        console.log('bulk upload is not in scope');
      }
    }

}]);
