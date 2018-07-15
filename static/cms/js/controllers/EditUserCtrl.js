
wishyooCMSApp.controller('EditUserController', [
  '$scope','$window', '$location', '$modalInstance', 'globals', 'request', 'account_types', 'accountTypeMap', 'userForm', 'userRef',
  function ($scope , $window, $location, $modalInstance, globals, request, account_types, accountTypeMap, userForm, userRef) {

    var editableFields = {
      activated: true,
      password: true,
      confirmPassword: true,
      account_type: true
    };

    function getUpdateObject(user) {
      var updateObject = {}
      Object.keys(user).forEach(function (key){
        if (editableFields.hasOwnProperty(key)) {
          updateObject[key] = user[key];
        }
      });
      if (updateObject.account_type && typeof updateObject.account_type === 'object') {
        updateObject.account_type = updateObject.account_type.id;
      }
      return updateObject;
    }

    function updateUserRef(updatedUser){
      Object.keys(editableFields).forEach(function (key){
        userRef[key] = updatedUser[key];
        if (userRef.account_type) {
          userRef.type_name = accountTypeMap[userRef.account_type] && accountTypeMap[userRef.account_type].type_name;
        }
      })
    }

    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/user';

    $scope.account_types = account_types;
    $scope.user = angular.copy(userRef);
    $scope.user.account_type = accountTypeMap[$scope.user.account_type];

    console.log('account_types', $scope.account_types);
    console.log('user', $scope.user);

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.editUser = function () {
      var userId = $scope.user.id;
      var updateObject = getUpdateObject($scope.user);
      console.log('EditUserController editUser', $scope.user);
      var user = $scope.user;
      user.account_type = user.account_type && user.account_type.id;
      Object.keys(user).forEach(function (key){
        console.log(key, user[key]);
        if (user.hasOwnProperty(key) && user[key] !== null && typeof user[key] === 'string') {
          user[key] = user[key].trim();
        }
      });

      if ($scope.form.userForm.$valid) {
        console.log('user form is in scope');
        var url = apiUrl + '/' + userId;
        console.log('updateObject', updateObject);
        return request.put(url, updateObject)
        .then(function(editedUser) {
          updateUserRef(editedUser);
          $modalInstance.close(editedUser);
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
