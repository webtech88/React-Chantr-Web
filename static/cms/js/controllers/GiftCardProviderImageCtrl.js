wishyooCMSApp.controller('GiftCardProviderImageController', [
  '$scope', '$timeout', '$modalInstance', 'globals', 'request', 'imageForm', 'Upload', 'gift_card_provider_id',
  function ($scope, $timeout, $modalInstance, globals, request, imageForm, Upload, gift_card_provider_id) {

    $scope.gift_card_provider_id = gift_card_provider_id;
    var apiUrl = globals.baseUrl + globals.apiPrefix + '/gift_card_providers/' + $scope.gift_card_provider_id + '/image';

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.uploadImage = function (file) {
      if ($scope.form.imageForm.$valid) {
        console.log('imageForm is in scope', file);
        if(file) {
          file.upload = Upload.upload({
            url: apiUrl,
            data: { filedata: file },
            method: 'PUT'
          });

          file.upload
          .then(function (response) {
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
        console.log('imageForm is not in scope');
      }
    }
}]);
