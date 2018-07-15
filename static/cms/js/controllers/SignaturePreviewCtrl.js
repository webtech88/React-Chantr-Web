wishyooCMSApp.controller('SignaturePreviewController', [
  '$scope', '$modalInstance', 'handwritingUrl',
  function ($scope, $modalInstance, handwritingUrl) {
    $scope.random = parseInt(Math.random()*100, 10);
    $scope.handwritingUrl = handwritingUrl;

    console.log('$scope', $scope);

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

}]);
