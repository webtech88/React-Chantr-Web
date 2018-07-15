// GiftCardProviderController
wishyooCMSApp.controller('GiftCardProviderController', [
  '$scope', '$modal', '$route', '$document', '$window', '$location', '$timeout', 'request', 'globals',
  function ($scope, $modal, $route, $document, $window, $location, $timeout, request, globals){

    $scope.setPanelName('Gift Card Providers Panel');
    var apiUrl = globals.baseUrl + globals.apiPrefix + '/gift_card_providers';

    function fetchProvidersOneTime(){
      request.get(apiUrl+'/all')
      .then(function(data) {
        console.log(data)
        $scope.initialRows = data.gift_card_providers;
        $scope.gift_card_providers = data.gift_card_providers;
      });
    }

    fetchProvidersOneTime();

    $scope.addGiftCardProvider = function (providerName) {
      var body = {
        provider_name: $scope.providerName,
        display_name: $scope.displayName,
        active: true
      };
      request.post(apiUrl, body)
      .then(function (data){
        console.log('response', data);
        data.num_gifts = 0;
        $scope.gift_card_providers.push(data);
      })
      .catch(function (err){
        console.error(err);
        $window.alert(err.statusText);
      })
    };

    $scope.deactivateGiftCardProvider = function (row) {
      var body = {
        active: false
      }
      return $scope.updateGiftCardProvider(row, body)
    };

    $scope.activateGiftCardProvider = function (row) {
      var body = {
        active: true
      }
      return $scope.updateGiftCardProvider(row, body)
    }

    $scope.updateProviderName = function (row){
      var body = {
        provider_name: row.provider_name
      };
      return $scope.updateGiftCardProvider(row, body);
    }

    function updateKeys(updateObject, rowTobeEdited){
      Object.keys(updateObject).forEach(function (key){
        if(updateObject.hasOwnProperty(key)) {
          rowTobeEdited[key] = updateObject[key]
        }
      })
    }

    $scope.updateGiftCardProvider = function (row, updateObject){
      var url = apiUrl + '/' + row.id
      return request.put(url, updateObject)
      .then(function (body){
        var index = $scope.gift_card_providers.indexOf(row);
        if (index !== -1) {
          updateKeys(updateObject, $scope.gift_card_providers[index])
        }
      })
      .catch(function (err){
        console.error(err);
        $window.alert(err.statusText);
      })
    }

    $scope.showImageUploadModal = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'views/add_gift_card_provider_image.html',
        controller: 'GiftCardProviderImageController',
        resolve: {
          imageForm: function () {
            return $scope.imageForm;
          },
          gift_card_provider_id: function () {
            return row.id;
          }
        }
      });
      modalInstance.result
      .then(function (addedGift) {
        console.log('uploaded image successfully');
        $route.reload();
      }).catch(function (err) {
        console.log('error', err);
        if(err !== 'cancel'){
          $route.reload();
        }
      });
    };

    $scope.showImagePreviewModal = function (row) {
      console.log('row', row)
      var modalInstance = $modal.open({
        templateUrl: 'views/preview_gift_card_provider_image.html',
        controller: 'GiftCardProviderImagePreviewController',
        resolve: {
          gift_card_provider_id: function () {
            return row.id;
          }
        }
      });
      modalInstance.result
      .then(function (addedGift) {
        console.log('uploaded image successfully');
        $route.reload();
      }).catch(function (err) {
        console.log('error', err);
        if(err !== 'cancel'){
          $route.reload();
        }
      });
    };


}]);
