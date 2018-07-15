
wishyooCMSApp.controller('BulkUploadController', [
  '$scope', '$timeout', '$window', '$location', '$modalInstance', 'globals', 'request', 'card_id', 'bulkUploadForm', 'Upload',
  function ($scope , $timeout, $window, $location, $modalInstance, globals, request, card_id, bulkUploadForm, Upload) {

    $scope.card_id = card_id;
    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/card/' + $scope.card_id + '/participant';

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.uploadParticipantsFile = function (file, newParticipants) {
      console.log('bulk upload form is in scope', file);
      if ($scope.form.bulkUploadForm.$valid) {
        console.log('bulk upload form is in scope', file, newParticipants);
        if(file) {
          file.upload = Upload.upload({
            url: apiUrl + '/upload',
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
        } else if(newParticipants && newParticipants.trim()){
          var body = {
            emails: newParticipants.trim()
          };
          return request.post(apiUrl, body)
          .then(function (response){
            $timeout(function() {
              $modalInstance.close();
            });
          });
        }
      } else {
        console.log('bulk upload is not in scope');
      }
    }

    $scope.addParticipants = function () {
      if ($scope.form.addParticipantsForm.$valid) {
        console.log('bulk upload form is in scope');
        // perform the request and then call $modalInstance.close(editedUser);
      } else {
        console.log('bulk upload is not in scope');
      }
    }

}]);
