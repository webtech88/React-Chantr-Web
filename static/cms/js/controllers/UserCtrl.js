wishyooCMSApp
  .controller('UserController', ['$scope', '$window', '$location', '$timeout', '$modal', '$log', 'request', 'globals',
  function ($scope, $window, $location, $timeout, $modal, $log, request, globals){

    $scope.setPanelName('Users Panel');

    $scope.page_sizes = [10, 25, 50, 100, 200, 1000];
    $scope.numRows = 50;

    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/user';
    var accountTypeApiUrl = globals.baseUrl + globals.apiPrefix + '/admin/account_type';
    var userBaseUrl = globals.baseUrl + globals.apiPrefix + '/users/';

    function fetchAccountTypes() {
      return request.get(accountTypeApiUrl + '?active=1')
      .then(function (response){
        console.log('response', response);
        $scope.account_types = response.account_types;
        $scope.accountTypeMap = {};
        response.account_types.forEach(function (account_type){
          $scope.accountTypeMap[account_type.id] = account_type;
        })
      })
    }

    fetchAccountTypes();

    $scope.showCreateUserModal = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'views/new_user.html',
        controller: 'NewUserController',
        size: size,
        resolve: {
          account_types: function (){
            return $scope.account_types
          },
          userForm: function () {
            return $scope.userForm;
          }
        }
      });

      modalInstance.result.then(function (newUser) {
        newUser.numCards = 0;
        newUser.type_name = $scope.accountTypeMap[newUser.account_type] && $scope.accountTypeMap[newUser.account_type].type_name;
        $scope.users.rows.push(newUser);
        $scope.users.total += 1
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


    $scope.showEditUserModal = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'views/edit_user.html',
        controller: 'EditUserController',
        resolve: {
          account_types: function (){
            return $scope.account_types;
          },
          userForm: function () {
            return $scope.userForm;
          },
          userRef: function () {
            return row;
          },
          accountTypeMap: function (){
            return $scope.accountTypeMap;
          }
        }
      });

      modalInstance.result.then(function (editedUser) {
        console.log('edited user', editedUser)
        $log.info('User edited at: ' + new Date());
      })
      .catch(function (err){
        $log.info('Modal dismissed at: ' + new Date());
      })
    };


    function fetchUsers(queryString, tableState){
      var url = apiUrl
      if (queryString) {
        var url = apiUrl + queryString
      }
      return request.get(url)
      .then(function(data) {
        console.log('data', data);
        tableState.pagination.totalItemCount = data.total;
        tableState.pagination.numberOfPages = Math.ceil(data.total / tableState.pagination.number);
        $scope.users = data
        console.log($scope.users.rows);
      })
    }


    $scope.deleteUser = function (userId){
      console.log(userId);
    }

    $scope.showUserCards = function (user){
      $location.path('/cards').search({'userId':user.id});
    }

    $scope.callServer = function (tableState) {
      console.log('tableState', tableState);
      var queryString = getQueryString(tableState);
      console.log('queryString', queryString);
      return fetchUsers(queryString, tableState);
    }

    $scope.activateUser = function (row){
      row.updatingUser = true;
      var body = {
        activated: true
      };
      return updateUser(row, body);
    }

    $scope.deactivateUser = function (row){
      row.updatingUser = true;
      var body = {
        activated: false
      };
      return updateUser(row, body);
    }


    $scope.markAsCampaignUser = function (row){
      row.updatingCampaignUser = true;
      var body = {
        campaign_user: true
      };
      return updateUser(row, body);
    }

    $scope.blockUser = function (row) {
      row.updatingBlocked = true;
      var url = userBaseUrl + 'block/' + row.id;
      return request.put(url)
      .then(function (){
        row.isBlocked = true;
        row.updatingBlocked = false;
      })
      .catch(function (err){
        row.updatingBlocked = false;
        console.log(err);
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        $scope.serverError = true;
        $window.scrollTo(0, 0);
      })
    };

    $scope.unblockUser = function (row) {
      row.updatingBlocked = true;
      var url = userBaseUrl + 'unblock/' + row.id;
      return request.put(url)
      .then(function (){
        row.isBlocked = false;
        row.updatingBlocked = false;
      })
      .catch(function (err){
        row.updatingBlocked = false;
        console.log(err);
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        $scope.serverError = true;
        $window.scrollTo(0, 0);
      })
    };

    $scope.unmarkAsCampaignUser = function (row){
      row.updatingCampaignUser = true;
      var body = {
        campaign_user: false
      };
      return updateUser(row, body);
    }

    $scope.grantAdminAccess = function (row){
      row.updatingAdminStatus = true;
      return updateAdminStatus(row, true);
    }

    $scope.revokeAdminAccess = function (row){
      row.updatingAdminStatus = true;
      return updateAdminStatus(row, false);
    }

    function updateAdminStatus(row, makeAdmin){
      var url = apiUrl + '/' + row.id;
      if (makeAdmin) {
        url += '/grantadminaccess'
      } else {
        url += '/revokeadminaccess'
      }
      console.log('changing admin status', url);
      return request.put(url, {})
      .then(function (response){
        if(response.status === 'ok') {
          if(makeAdmin) {
            row.isAdmin = true;
          } else {
            row.isAdmin = false;
          }
        }
        row.updatingAdminStatus = false;
        console.log('successfully updated user');
      })
      .catch(function (err){
        row.updatingAdminStatus = false;
        console.log(err);
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        $scope.serverError = true;
        $window.scrollTo(0, 0);
      });
    }

    $scope.hideAlert = function (){
      $scope.serverError = false;
    }

    function updateUser(row, body){
      var url = apiUrl + '/' + row.id;
      return request.put(url, body)
      .then(function (editedUser){
        row.activated = editedUser.activated;
        row.campaign_user = editedUser.campaign_user;
        row.updatingUser = false;
        row.updatingCampaignUser = false;
        console.log('successfully updated user');
      })
      .catch(function (err){
        row.updatingUser = false;
        row.updatingCampaignUser = false;
        window.alert(err.statusText);
      })
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

  }]);
