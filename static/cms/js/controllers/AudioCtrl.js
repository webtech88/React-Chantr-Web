wishyooCMSApp.controller('AudioController', [
  '$scope', '$timeout', '$modalInstance', 'globals', 'request', 'audioForm', 'Upload', 'card_id',
  function ($scope , $timeout, $modalInstance, globals, request, audioForm, Upload, card_id) {

    $scope.card_id = card_id;
    var apiUrl = globals.baseUrl + globals.apiPrefix + '/chants/' + $scope.card_id + '/upload';

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.uploadAudio = function (file) {
      if ($scope.form.audioForm.$valid) {
        console.log('audioForm is in scope', file);
        if(file) {
          file.upload = Upload.upload({
            url: apiUrl,
            data: { filedata: file },
            method: 'PUT'
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
