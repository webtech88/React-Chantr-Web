wishyooCMSApp.controller('UnsubscribeController', [
  '$scope', '$modal', '$location', '$route', '$timeout', '$routeParams', 'globals', 'request',
  function ($scope , $modal, $location, $route, $timeout, $routeParams, globals, request) {

    $scope.setPanelName('Unsubscribe Panel');
    $scope.editUnsubscription = editUnsubscription;
    $scope.removeUnsubscription = removeUnsubscription;

    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/unsubscribe';

    function _loadUnsubscriptions () {
      var url = apiUrl + '/list';
      return request.get(url)
      .then(function (result){
        $scope.unsubscribeReasonsMap = result.unsubscribeReasonsMap;
        $scope.unsubscribeOptionsMap = result.unsubscribeOptionsMap;
        $scope.initialRows = result.rows;
        $scope.unsubscriptions = result.rows;
        $scope.initialRows.forEach(function (row){
          row.reasonText = $scope.unsubscribeReasonsMap[row.reason];
        });
      });
    }

    _loadUnsubscriptions();

    function editUnsubscription (row) {
      row = row || {
        new: true,
        options: []
      };
      $scope.currentRow = row;
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/unsubscription.html',
        controller: 'UnsubscriptionController',
        size: 'lg',
        resolve: {
          row: function () {
            return row;
          },
          unsubscriptionForm: function () {
            return $scope.unsubscriptionForm;
          },
          unsubscribeOptionsMap: function () {
            return $scope.unsubscribeOptionsMap;
          },
          unsubscribeReasonsMap: function () {
            return $scope.unsubscribeReasonsMap;
          },
        }
      });

      $scope.modalInstance.result.then(function (response) {
        $scope.currentRow = null;
        $route.reload();
      })
      .catch(function (err){
        $scope.currentRow = null;
        $route.reload();
      });
    }

    function removeUnsubscription (row) {
      return request.delete(apiUrl, { email: row.email })
      .then(function (){
        $route.reload();
      });
    }


}]);

