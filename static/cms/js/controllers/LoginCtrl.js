wishyooCMSApp
.controller('LoginController', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService', '$location',
  function ($scope, $rootScope, AUTH_EVENTS, AuthService, $location) {

    $scope.insideLoginCtrl = true;
    $location.search({});
    $scope.checkIfInsideLoginCtrl = function (){
      if($location.url().indexOf('/login') >= 0) {
        return true;
      } else {
        return $location.path('/login');
      }
    };
    $scope.setCurrentUser(null);
    $scope.credentials = {
      username: '',
      password: ''
    };
    $scope.login = function (credentials) {
      AuthService.login(credentials)
      .then(function (user) {
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        console.log('user.admin', user.admin);
        if(!user.admin){
          throw new Error('nonAdmin');
        }
        $scope.setCurrentUser(user);
        $location.path('/cards');
      })
      .catch(function (err){
        console.log(err.message);
        if (err.message === 'nonAdmin'){
          $scope.nonAdmin = true;
        } else {
          $scope.loginFailed = true
        }
        $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
      });
    };
}])
