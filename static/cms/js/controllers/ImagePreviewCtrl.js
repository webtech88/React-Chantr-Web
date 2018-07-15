wishyooCMSApp.controller('ImagePreviewController', [
  '$scope', '$modalInstance', 'url',
  function ($scope, $modalInstance, url) {
    $scope.random = parseInt(Math.random()*100, 10);
    $scope.url = url;

    console.log('$scope', $scope);

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

}]);

