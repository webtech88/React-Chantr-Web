wishyooCMSApp.controller('GiftCardProviderImagePreviewController', [
  '$scope', '$modalInstance', 'globals', 'gift_card_provider_id',
  function ($scope, $modalInstance, globals, gift_card_provider_id) {
    $scope.random = parseInt(Math.random()*100, 10);
    $scope.gift_card_provider_id = gift_card_provider_id;

    console.log('$scope', $scope);

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

}]);
