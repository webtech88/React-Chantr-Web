
// Account Type Controller
wishyooCMSApp.controller('AccountTypeController', [
  '$scope', '$document', '$window', '$location', '$timeout', 'request', 'globals',
  function ($scope, $document, $window, $location, $timeout, request, globals){

    $scope.setPanelName('Account Types Panel');
    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/account_type';

    function fetchAccountTypesOneTime(){
      request.get(apiUrl)
      .then(function(data) {
        console.log(data)
        $scope.initialRows = data.account_types;
        $scope.account_types = data.account_types;
      })
    }

    fetchAccountTypesOneTime();

    $scope.addAccountType = function (typeName) {
      var body = {
        type_name: $scope.typeName,
        active: true
      };
      request.post(apiUrl, body)
      .then(function (data){
        console.log('response', data);
        data.num_users = 0;
        data.num_cards = 0;
        $scope.account_types.push(data);
      })
      .catch(function (err){
        console.error(err);
        $window.alert(err.statusText);
      })
    }

    $scope.deactivateAccountType = function (row) {
      var body = {
        active: false
      }
      return $scope.updateAccountType(row, body)
    }

    $scope.activateAccountType = function (row) {
      var body = {
        active: true
      }
      return $scope.updateAccountType(row, body)
    }

    $scope.updateAccountTypeName = function (row){
      var body = {
        type_name: row.type_name
      }
      return $scope.updateAccountType(row, body)
    }

    function updateKeys(updateObject, rowTobeEdited){
      Object.keys(updateObject).forEach(function (key){
        if(updateObject.hasOwnProperty(key)) {
          rowTobeEdited[key] = updateObject[key]
        }
      })
    }

    $scope.updateAccountType = function (row, updateObject){
      var url = apiUrl + '/' + row.id
      return request.put(url, updateObject)
      .then(function (body){
        var index = $scope.account_types.indexOf(row);
        if (index !== -1) {
          updateKeys(updateObject, $scope.account_types[index])
        }
      })
      .catch(function (err){
        console.error(err);
        $window.alert(err.statusText);
      })
    }

    $scope.sort = function (key, $event){
      console.log('sort by', key);
      var element = $document[1].getElementById('account_types_header_id');
      console.log('element', element);
    }

}]);
