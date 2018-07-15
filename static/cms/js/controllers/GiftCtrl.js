wishyooCMSApp.controller('GiftController', [
  '$scope', '$modal', '$location', '$route', '$timeout', '$routeParams', 'globals', 'request', 'Upload',
  function ($scope , $modal, $location, $route, $timeout, $routeParams, globals, request, Upload) {

    $scope.random = parseInt(Math.random()*100, 10);

    $scope.setPanelName('Gift Panel');
    $scope.card_id = $routeParams.card_id;
    $scope.gift_id = $routeParams.gift_id;
    $scope.page_sizes = [10, 25, 50, 100, 200];
    $scope.numRows = 50;
    $scope.gift_contributions = [];

    var createUrl = globals.baseUrl + globals.apiPrefix + '/chants/' + $scope.card_id + '/board/gifts';
    var editUrl = globals.baseUrl + globals.apiPrefix + '/gifts/' + $scope.gift_id;
    var contributionsUrl = globals.baseUrl + globals.apiPrefix + '/gifts/' + $scope.gift_id + '/contributions';

    // What all actions can be performed in this view ?
    // Adding/Changing a gift image -- updateGiftPhoto
    // setting paylink -- updateGift
    // changing gift amount -- updateGift
    // changing gift type -- updateGift
    // changing gift description -- updateGift
    // changing gift card provider (if typeGiftCard) -- updateGift
    // message field is now deprecated
    // delete a gift from a card -- deleteGift

    $scope.editView = false;
    $scope.createUpdateGift = createUpdateGift;
    $scope.giftCardMap = {};
    $scope.gift_contributions = [];

    function loadGiftCardProviders() {
      var url = globals.baseUrl + globals.apiPrefix + '/gift_card_providers';
      return request.get(url)
      .then(function(data) {
        console.log(data)
        $scope.gift_cards = data.gift_card_providers;
        angular.forEach($scope.gift_cards, function (value, index){
          $scope.giftCardMap[value.provider_name] = value;
        });
      });
    }

    loadGiftCardProviders()
    .then(function (){
      // fetch gift when the controller is loaded
      if ($scope.gift_id) {
        fetchGift();
      } else {
        $scope.editView = true;
        $scope.gift = {};
      }
    });

    var apiUrl = globals.baseUrl + globals.apiPrefix + '/gifts/' + $scope.gift_id;

    $scope.giftTypeTranslationMap = {
      'typeGift': 'Stuff',
      'typeGiftCard': 'Gift Card'
    }

    $scope.cancel = function () {
      $scope.editView = !$scope.editView;
    };

    function fetchGift (gift_id) {
      return request.get(apiUrl)
      .then(function (gift){
        gift.targetAmountType = gift.amountTarget && 'fixed' || 'no_limit';
        gift.providerObject = $scope.giftCardMap[gift.provider];
        $scope.gift = gift;
      });
    }


    $scope.callServer = function (tableState) {
      if(!tableState.search.predicateObject) {
        tableState.search.predicateObject = {}
      }

      if($routeParams.query) {
        tableState.search.predicateObject = {
          query: $routeParams.query
        }
      }

      console.log('tableState', tableState);
      var queryString = getQueryString(tableState);
      console.log('queryString', queryString);
      return fetchGiftContributions(queryString, tableState);
    }


    function getQueryString(tableState){
      serialize = function(obj) {
        var str = [];
        for(var p in obj)
          if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
        return str.join("&");
      }

      // pagination
      var page = 1
      var queryString = ''
      var queryParams = {}
      if (tableState.pagination.start && tableState.pagination.number) {
        page += tableState.pagination.start / tableState.pagination.number;
      }
      console.log('page', page);
      if (page > 1) {
        queryParams.page = page
      }

      queryParams.pageSize = $scope.numRows;

      // search
      if (tableState.search.predicateObject && tableState.search.predicateObject.$) {
        queryParams.query = tableState.search.predicateObject.$
      }

      // sort
      if (tableState.sort && tableState.sort.predicate) {
        queryParams.sort = tableState.sort.predicate;
        if (tableState.sort.reverse) {
          queryParams.order = 'desc'
        }
      }

      var queryString = '?' + serialize(queryParams)
      return queryString
    }


    function fetchGiftContributions (queryString, tableState) {
      var url = contributionsUrl;
      if (queryString) {
        var url = contributionsUrl + queryString;
      }
      return request.get(url)
      .then(function(data) {
        console.log('data', data);
        if(tableState.pagination) {
          tableState.pagination.totalItemCount = data.total;
          tableState.pagination.numberOfPages = Math.ceil(data.total / tableState.pagination.number);
        }
        $scope.gift_contributions = data.rows;
        console.log($scope.gift_contributions);
      });
    }

    $scope.uploadCoverImage = function (file) {
      if ($scope.form.giftForm.$valid) {
        console.log('giftForm is in scope', file);
        if(file) {
          file.upload = Upload.upload({
            url: apiUrl,
            data: { filedata: file }
          });

          file.upload.then(function (response) {
            $timeout(function() {
              file.result = response.data;
              $modalInstance.close();
            })
          }, function (response) {
            if (response.status > 0)
              $scope.errorMsg = response.status + ': ' + response.data;
          }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
        } else {
          console.log('no file found');
        }
      } else {
        console.log('bulk upload is not in scope');
      }
    }

    function createUpdateGift (gift) {
      console.log(gift);
      setDependentFields(gift);
      if (!gift.id) {
        return createGift(gift);
      } else {
        return updateGift(gift);
      }
    }

    function createGift (gift) {
      var body = gift;
      var headers = {
        'imitate-owner': true
      }
      return request.post(createUrl, body, headers)
      .then(function (newgift){
        return $location.path('/cards/' + $scope.card_id + '/participant');
      });
    }

    function updateGift (gift) {
      var editableFields = {
        cardType: true,
        description: true,
        amountTarget: true,
        provider: true,
        payLink: true
      };
      var body = {};
      angular.forEach(editableFields, function (value, key){
        body[key] = gift[key];
      });
      return request.patch(editUrl, body)
      .then(function (updated){
        $route.reload();
      })
    }

    function setDependentFields (gift) {
      if (gift.cardType === 'typeGift') {
        gift.provider = null;
      } else {
        gift.provider = gift.providerObject.provider_name;
      }
      if (gift.targetAmountType === 'no_limit') {
        gift.amountTarget = null;
      }
    }

    $scope.showGiftImageUploadModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/add_gift_image.html',
        controller: 'GiftImageController',
        size: size,
        resolve: {
          giftImageForm: function () {
            return $scope.giftImageForm;
          },
          gift_id: function () {
            return $scope.gift_id;
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
