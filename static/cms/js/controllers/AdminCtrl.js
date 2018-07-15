wishyooCMSApp
.controller('AdminController', ['$scope', '$rootScope', '$location', 'USER_ROLES', 'AuthService', 'UserSettingService', '$route',
  function($scope, $rootScope, $location, USER_ROLES, AuthService, UserSettingService, $route) {

    $scope.currentUser = JSON.parse(localStorage.getItem('user')) || null
    $scope.userRoles = USER_ROLES;
    console.log('AuthService', AuthService);
    $scope.isAuthorized = AuthService.isAuthorized;

    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
    };

    $scope.setPanelName = function (name) {
      $scope.panelName = name;
    };

    $scope.setPanelName('Admin Panel');

    $scope.logout = function () {
      $scope.setCurrentUser(null);
      $location.path('/login').search({});
    }

    $scope.clearPreferences = function () {
      return UserSettingService.saveUserSettings({})
      .then(function (){
        return $route.reload();
      })
    }

}]);
