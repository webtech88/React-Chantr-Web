
wishyooCMSApp.controller('CardController', [
  '$scope',
  '$route',
  '$location',
  '$routeParams',
  '$modal',
  'request',
  'globals',
  'deleted',

  function ($scope,
    $route,
    $location,
    $routeParams,
    $modal,
    request,
    globals,
    deleted
  ) {

    $scope.setPanelName('Cards Panel');
    $scope.deleted = deleted;
    $scope.page_sizes = [10, 25, 50, 100, 200, 1000];
    $scope.numRows = 50;
    $scope.showCreateCardModal = showCreateCardModal;

    $scope.displayCategories = [
      { short: 'BI', long: 'Birthday' },
      { short: 'BR', long: 'Bridal Shower' },
      { short: 'AN', long: 'Anniversary' },
      { short: 'CH', long: 'Christmas' },
      { short: 'AP', long: 'Appreciation' },
      { short: 'FA', long: 'Farewell' },
      { short: 'EN', long: 'Engagement' },
      { short: 'GE', long: 'Get Well' },
      { short: 'UN', long: 'Unspecified' },
      { short: 'BA', long: 'Baby Shower' },
      { short: 'CO', long: 'Congratulations' },
      { short: 'WE', long: 'Wedding' },
      { short: 'GR', long: 'Graduation' },
      { short: 'NE', long: 'New Home' },
      { short: 'TH', long: 'Thank You' },
      { short: 'HO', long: 'Holiday' },
      { short: 'YE', long: 'Yearbook' }
    ];

    $scope.displayTypes = [
      { short: 'SC', long: 'Schools' },
      { short: 'CI', long: 'Cities' },
      { short: 'MA', long: 'Mayors' }
    ];

    $scope.displayStatus = [
      { short: 'PE', long: 'Pending' },
      { short: 'VA', long: 'Validated' },
      { short: 'PU', long: 'Published' },
      { short: 'PR', long: 'Prepublish' },
      { short: 'IN', long: 'Invalid' },
      { short: 'AB', long: 'Abusive' },
      { short: 'RE', long: 'Removed' }
    ];

    console.log('$routeParams', $routeParams);
    console.log('deleted', deleted);

    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/card';

    if ($routeParams.userId) {
      var queryString = '?owner=' + $routeParams.userId
    }

    function fetchCards(queryString, tableState){
      var url = apiUrl;
      if (queryString) {
        var url = apiUrl + queryString
      }
      return request.get(url)
      .then(function(data) {
        console.log('data', data);
        if(tableState.pagination) {
          tableState.pagination.totalItemCount = data.total;
          tableState.pagination.numberOfPages = Math.ceil(data.total / tableState.pagination.number);
        }
        $scope.cards = data.rows
        console.log($scope.cards);
      })
    }


    $scope.incFeatured = function (row){
      row.updatingFeatured = true;
      var body = {
        featured: 1
      };
      return updateCard(row, body)
      .then(function (row){
        row.updatingFeatured = false;
      })
      .catch(function (err){
        row.updatingFeatured = false;
      });
    }

    $scope.setFeatured = function (row){
      row.updatingFeatured = true;
      var body = {
        featured: row.featured,
        setFeaturedToAbsoluteValue: true
      }
      return updateCard(row, body)
      .then(function (row){
        row.updatingFeatured = false;
      })
      .catch(function (err){
        row.updatingFeatured = false;
      });
    }

    $scope.decFeatured = function (row){
      row.updatingFeatured = true;
      var body = {
        featured: 0
      };
      return updateCard(row, body)
      .then(function (row){
        row.updatingFeatured = false;
      })
      .catch(function (err){
        row.updatingFeatured = false;
      });
    }

    $scope.updateCardTitle = function (row){
      row.updatingTitle = true;
      var body = {
        title: row.title
      }
      return updateCard(row, body)
      .then(function (row){
        row.updatingTitle = false;
      })
      .catch(function (err){
        row.updatingTitle = false;
      });
    }

    $scope.updateCardLabel = function (row){
      row.updatingLabel = true;
      var body = {
        label: row.label
      }
      return updateCard(row, body)
      .then(function (row){
        row.updatingLabel = false;
      })
      .catch(function (err){
        row.updatingLabel = false;
      });
    }

    function updateCard(row, body){
      var url = apiUrl + '/' + row.id;
      return request.put(url, body)
      .then(function (editedCard){
        row.featured = editedCard.featured;
        row.label = editedCard.label;
        row.title = editedCard.title;
        console.log('successfully updated card');
        return row;
      })
      .catch(function (err){
        $scope.updateFailed = true;
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        throw err;
      });
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

      if (tableState.search.predicateObject && tableState.search.predicateObject.owner) {
        queryParams.owner = tableState.search.predicateObject.owner
      }

      if (deleted) {
        queryParams.deleted = 1;
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

    $scope.callServer = function (tableState) {

      if($routeParams.userId) {
        tableState.search.predicateObject = {
          owner: $routeParams.userId
        }
      }

      console.log('tableState', tableState);
      var queryString = getQueryString(tableState);
      console.log('queryString', queryString);
      return fetchCards(queryString, tableState)
    }

    $scope.showParticipants = function (row, status){
      var card_id = row.id;
      $location.path('/cards/' + card_id + '/participant').search({'status': status});
    }

    function showCreateCardModal (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/new_card.html',
        controller: 'NewCardController',
        size: size,
        resolve: {
          cardForm: function () {
            return $scope.cardForm;
          }
        }
      });

      modalInstance.result.then(function (newCard) {
        // set any attributes here
        // $scope.cards.push(newCard);
        $route.reload();
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };


    $scope.selected = [];
    $scope.selectAll = function (collection) {
      // if there are no items in the 'selected' array,
      // push all elements to 'selected'
      if ($scope.selected.length === 0) {
        angular.forEach(collection, function(val) {
          $scope.selected.push(val.id);
        });
      // if there are items in the 'selected' array,
      // add only those that ar not
      } else if ($scope.selected.length > 0 && $scope.selected.length != $scope.cards.length) {
        angular.forEach(collection, function(val) {
          var found = $scope.selected.indexOf(val.id);
          if(found == -1) $scope.selected.push(val.id);
        });
      // Otherwise, remove all items
      } else  {
        $scope.selected = [];
      }
    };

    // Function to get data by selecting a single row
    $scope.select = function(id) {
      var found = $scope.selected.indexOf(id);
      if(found == -1) $scope.selected.push(id);
      else $scope.selected.splice(found, 1);
    }

    $scope.deleteSelectedCards = function (selected) {
      var url = apiUrl;
      return request.delete(url, { cardIds: selected })
      .then(function (response){
        console.log('removed cards', response.data);
        $route.reload();
      })
      .catch(function (err){
        $scope.updateFailed = true;
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        throw err;
      });
    }

    $scope.undeleteSelectedCards = function (selected) {
      $scope.updateFailed = true;
      $scope.errorMessage = 'This feature is not yet implemented since we are not sure what status to assign to the card in this case';
      // var url = apiUrl;
      // return request.delete(url, { cardIds: selected })
      // .then(function (response){
      //   console.log('removed cards', response.data);
      //   $route.reload();
      // })
      // .catch(function (err){
      //   $scope.updateFailed = true;
      //   $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
      //   throw err;
      // });
    }


}]);
