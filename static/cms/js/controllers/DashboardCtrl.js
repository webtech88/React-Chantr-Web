wishyooCMSApp.controller('DashboardController', [
  '$scope', '$window', '$route', '$location', '$routeParams', 'request', 'globals',
  function ($scope, $window, $route, $location, $routeParams, request, globals) {

    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/dashboard';

    // due date picker related stuff
    $scope.minDate = $scope.minDate || new Date('2016-01-01');
    $scope.toDate = new Date();
    $scope.fromDate = $scope.minDate;
    $scope.fetchStats = fetchStats;

    $scope.fetchStats();

    $scope.openDueDatePickerFrom = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedDueDatePickerFrom = true;
    };

    $scope.openDueDatePickerTo = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedDueDatePickerTo = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.dueDateFormats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.dueDateFormat = $scope.dueDateFormats[0];

    function fetchStats() {
      var url = apiUrl + '/stats?q=1';
      if($scope.fromDate) {
        url += '&fromdate='+ $scope.fromDate.toISOString();
      }
      if($scope.toDate) {
        url += '&todate='+ $scope.toDate.toISOString();
      }
      request.get(url)
      .then(function (result){
        console.log('result', result);
        $scope.cardsStats = result.cardsStats;
        $scope.userStats = result.userStats;
        $scope.participantDistribution = result.participantDistribution
      })
      .catch(function (err){
        console.log(err);
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        $scope.serverError = true;
        $window.scrollTo(0, 0);
      })
    }

    $scope.hideAlert = function (){
      $scope.serverError = false;
    }

}]);
