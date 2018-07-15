// Category Controller
wishyooCMSApp.controller('CategoryController', [
  '$scope', '$route', '$modal', '$window', '$location', '$timeout', 'request', 'globals', 'Upload',
  function ($scope, $route, $modal, $window, $location, $timeout, request, globals, Upload){

    $scope.setPanelName('Categories Panel');
    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/category';

    function fetchCategories(){
      return request.get(apiUrl)
      .then(function(data) {
        console.log(data)
        $scope.initialRows = data.categories;
        $scope.categories = data.categories;
      });
    }

    $scope.hideAlert = function (){
      $scope.serverError = false;
      $route.reload();
    }

    function _errorHandler (err) {
      console.error(err.statusText);
      $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
      $scope.serverError = true;
      $window.scrollTo(0, 0);
    }

    fetchCategories();

    $scope.addCategory = function (name) {
      var body = {
        name: $scope.categoryName,
        display_name: $scope.display_name
      };
      return request.post(apiUrl, body)
      .then(function (data){
        console.log('response', data);
        $route.reload();
      })
      .catch(_errorHandler);
    }

    $scope.disableCategory = function (row) {
      var url = apiUrl + '/' + row.id + '/disable';
      return request.put(url)
      .then(function (response) {
        row.active = false;
      })
      .catch(_errorHandler);
    }

    $scope.enableCategory = function (row) {
      var url = apiUrl + '/' + row.id + '/enable';
      return request.put(url)
      .then(function (response) {
        row.active = true;
      })
      .catch(_errorHandler);
    }

    $scope.decreaseRank = function (row) {
      var url = apiUrl + '/' + row.id + '/decrease_rank';
      return request.put(url)
      .then(function (response) {
        row.rank = response.rank;
        return fetchCategories();
      })
      .catch(_errorHandler);
    }

    $scope.increaseRank = function (row) {
      var url = apiUrl + '/' + row.id + '/increase_rank';
      return request.put(url)
      .then(function (response) {
        row.rank = response.rank;
        return fetchCategories();
      })
      .catch(_errorHandler);
    }

    $scope.changeDisplayName = function (row){
      var body = {
        display_name: row.display_name
      }
    }

    $scope.showImagePreviewModal = function (url) {
      console.log('url', url)
      var modalInstance = $modal.open({
        templateUrl: 'views/preview_image.html',
        controller: 'ImagePreviewController',
        resolve: {
          url: function () {
            return url;
          }
        }
      });
      modalInstance.result
      .then(function () {
        console.log('nothing');
      }).catch(function (err) {
        console.log('error', err);
      });
    };

    $scope.upload = function (file, row) {
      row.uploading = true;
      var url = apiUrl + '/' + row.id + '/upload_image';
      return Upload.upload({
        url: url,
        method: 'PUT',
        data: { filedata: file }
      })
      .then(function (resp) {
        row.uploading = false;
        return fetchCategories();
      })
      .catch(function (error){
        row.uploading = false;
        return _errorHandler(error)
      });
    };

}]);
