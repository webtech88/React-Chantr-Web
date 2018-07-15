// YoutuberController Controller
wishyooCMSApp.controller('YoutuberController', [
  '$scope', '$route', '$modal', '$window', '$location', '$timeout', 'request', 'globals', 'Upload',
  function ($scope, $route, $modal, $window, $location, $timeout, request, globals, Upload){

    $scope.setPanelName('Youtuber Panel');

    function fetchYoutuberStats(){
      var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/youtuber/stats';
      return request.get(apiUrl)
      .then(function(data) {
        console.log(data)
        data.rows = data.rows.map(function (row) {
          row.amount = row.numSigned*0.1;
          return row;
        });
        $scope.initialRows = data.rows;
        $scope.youtuberCards = data.rows;
      })
      .catch(_errorHandler);
    }

    $scope.hideAlert = function (){
      $scope.serverError = false;
      $route.reload();
    }

    function _errorHandler (err) {
      console.error(err.statusText);
      $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
      $scope.serverError = true;
      $window.scrollTo(0, 0);
    }

    fetchYoutuberStats();

    $scope.markAsPaid = function (row) {
      var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/youtuber/mark-paid';
      return request.post(apiUrl, { user_id: row.user_id })
      .then(function(data) {
        console.log(data)
        row.paid = true;
      })
      .catch(_errorHandler);
    }

}]);
