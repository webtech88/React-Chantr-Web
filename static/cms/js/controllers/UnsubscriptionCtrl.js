wishyooCMSApp.controller('UnsubscriptionController', [
  '$scope',
  '$modal',
  '$location',
  '$route',
  '$timeout',
  '$modalInstance',
  '$routeParams',
  'globals',
  'request',
  'unsubscriptionForm',
  'row',
  'unsubscribeReasonsMap',
  'unsubscribeOptionsMap',

  function ($scope,
    $modal,
    $location,
    $route,
    $timeout,
    $modalInstance,
    $routeParams,
    globals,
    request,
    unsubscriptionForm,
    row,
    unsubscribeReasonsMap,
    unsubscribeOptionsMap
    ) {

    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/unsubscribe';
    var postApiUrl = globals.baseUrl + globals.apiPrefix + '/users/unsubscribe';
    var postApiUrlNew = globals.baseUrl + globals.apiPrefix + '/admin/unsubscribe';

    var reasonsReverseLookup = {};
    Object.keys(unsubscribeReasonsMap).forEach(function (key){
      reasonsReverseLookup[unsubscribeReasonsMap[key]] = key;
    });

    $scope.row = row;
    $scope.selection = row.options;
    $scope.unsubscribeOptionsMap = unsubscribeOptionsMap;
    $scope.editUnsubscription = editUnsubscription;

    _loadOptionsAndReasons();

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.toggleSelection = function toggleSelection(option) {
      var idx = $scope.selection.indexOf(option);
      // is currently selected
      if (idx > -1) {
        $scope.selection.splice(idx, 1);
      }
      // is newly selected
      else {
        $scope.selection.push(option);
      }
    };

    function _loadOptionsAndReasons () {
      var reasonUrl = apiUrl + '/reasons';
      return request.get(reasonUrl)
      .then(function (response){
        $scope.allReasons = response.map(function (reason){
          return reason.name;
        });
        var optionUrl = apiUrl + '/options';
        return request.get(optionUrl)
      })
      .then(function (response){
        $scope.allOptions = response.map(function (option){
          return option.value;
        });
      });
    }

    function editUnsubscription (row) {
      var url = row.new ? postApiUrlNew : postApiUrl;
      row.reason = reasonsReverseLookup[row.reasonText];
      return request.post(url, {
        email: row.email,
        token: row.token,
        reason: row.reason,
        options: row.options
      })
      .then(function (){
        $modalInstance.close();
      });
    }

}]);
