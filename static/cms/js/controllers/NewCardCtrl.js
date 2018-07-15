wishyooCMSApp.controller('NewCardController', [
  '$scope','$window', '$location', '$modalInstance', 'globals', 'request', 'cardForm',
  function ($scope , $window, $location, $modalInstance, globals, request, cardForm) {

    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/card';

    $scope.categories = [
      'birthday',
      'bridal_shower',
      'anniversary',
      'christmas',
      'appreciation',
      'farewell',
      'engagement',
      'get_well',
      'unspecified',
      'baby_shower',
      'congratulations',
      'wedding',
      'graduation',
      'new_home',
      'thank_you',
      'holiday',
      'yearbook'
    ];

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.createCard = function () {
      var newCard = $scope.newCard;
      console.log('NewCardController createCard', $scope.newCard);
      if(!newCard.isPrivate) {
        newCard.is_shareable = true;
      }
      console.log('NewCardController createCard', newCard);

      if ($scope.form.cardForm.$valid) {
        console.log('cardForm is in scope');
        return request.post(apiUrl, newCard)
        .then(function(data) {
          console.log('successfully created card', data);
          $modalInstance.close(data);
        })
        .catch(function (err){
          console.error('error occured', err);
          $window.alert(err.statusText);
        })

      } else {
        console.log('cardForm is not in scope');
      }
    }

}]);
