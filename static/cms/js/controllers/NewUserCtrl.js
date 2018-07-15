wishyooCMSApp.controller('NewUserController', [
  '$scope','$window', '$location', '$modalInstance', 'globals', 'request', 'account_types', 'userForm',
  function ($scope , $window, $location, $modalInstance, globals, request, account_types, userForm) {
    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/user';

    $scope.account_types = account_types;

    console.log('account_types', $scope.account_types);

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.createUser = function () {
      console.log('NewUserController createUser', $scope.newUser);
      var newUser = $scope.newUser;

      if (newUser.hasOwnProperty('account_type')) {
        newUser.account_type = newUser.account_type.id;
      }

      Object.keys(newUser).forEach(function (key){
        if (newUser.hasOwnProperty(key) && typeof newUser[key] === 'string') {
          newUser[key] = newUser[key].trim();
        }
      });

      if ($scope.form.userForm.$valid) {
        console.log('user form is in scope');

        request.post(apiUrl, newUser)
        .then(function(data) {
          console.log('successfully created user', data);
          $modalInstance.close(data.user);
        })
        .catch(function (err){
          console.error('error occured', err);
          $window.alert(err.statusText);
        })

      } else {
          console.log('userform is not in scope');
      }

    }

}]);
