var wishyooCMSApp = angular.module('wishyoocms', [
  'ngRoute',
  'smart-table-improved',
  'ui.bootstrap',
  'xeditable',
  'ngFileUpload'
]);

wishyooCMSApp.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

wishyooCMSApp.constant('_', window._);

wishyooCMSApp.factory('globals', function() {
  var baseUrl = ''
  // var baseUrl = 'http://localhost:1338'
  var apiPrefix = '/api/v3'
  return {
    baseUrl: baseUrl,
    apiPrefix: apiPrefix
  };
});


wishyooCMSApp.factory('interceptorFor403', ['$log', '$location', '$q', function($log, $location, $q) {
  var interceptor = {
    responseError: function (res) {
      $log.error('received response status', res.status);
      if (res.status === 403) {
        $location.search({});
        return $location.path('/login').search({});
      } else {
        // return res;
        return $q.reject(res);
      }
    }
  };
  return interceptor;
}]);


wishyooCMSApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.interceptors.push('interceptorFor403');
}]);


wishyooCMSApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
  $locationProvider.hashPrefix('');
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'DashboardController'
  })
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginController'
  })
  .when('/account_types', {
    templateUrl: 'views/list_account_types.html',
    controller: 'AccountTypeController'
  })
  .when('/users', {
    templateUrl: 'views/users.html',
    controller: 'UserController'
  })
  .when('/cards', {
    templateUrl: 'views/list_cards.html',
    controller: 'CardController',
    resolve: {
      deleted: function() {
        return false;
      }
    }
  })
  .when('/deleted_cards', {
    templateUrl: 'views/list_cards.html',
    controller: 'CardController',
    resolve: {
      deleted: function() {
        return true;
      }
    }
  })
  .when('/youtuber_cards', {
    templateUrl: 'views/list_youtuber_cards.html',
    controller: 'YoutuberController',
    resolve: {
      deleted: function() {
        return true;
      }
    }
  })
  .when('/cards/:card_id/participant', {
    templateUrl: 'views/list_participants.html',
    controller: 'ParticipantController'
  })
  .when('/cards/:card_id/move_signature', {
    templateUrl: 'views/move_signature.html',
    controller: 'MoveSignatureController'
  })
  .when('/cards/:card_id/gifts', {
    templateUrl: 'views/gift_details.html',
    controller: 'GiftController'
  })
  .when('/gift_card_providers', {
    templateUrl: 'views/list_gift_providers.html',
    controller: 'GiftCardProviderController'
  })
  .when('/categories', {
    templateUrl: 'views/list_categories.html',
    controller: 'CategoryController'
  })
  .when('/unsubscribe', {
    templateUrl: 'views/list_unsubscribe.html',
    controller: 'UnsubscribeController'
  });


}]);

wishyooCMSApp.factory('request', function($http) {
  return {
    get: function (url) {
      return $http.get(url)
      .then(function (response) {
        return response.data;
      });
    },
    post: function (url, body, headers) {
      return $http({
        method: 'POST',
        url: url,
        data: body,
        headers: headers || {'Content-Type': 'application/json;charset=utf-8'}
      })
      .then(function (response) {
        return response.data;
      });
    },
    put: function (url, body) {
      return $http.put(url, body)
      .then(function (response) {
        return response.data;
      });
    },
    patch: function (url, body, headers) {
      return $http({
        method: 'PATCH',
        url: url,
        data: body,
        headers: headers || {'Content-Type': 'application/json;charset=utf-8'}
      })
      .then(function (response) {
        return response.data;
      });
    },
    delete: function (url, body) {
      return $http({
        method: 'DELETE',
        url: url,
        data: body,
        headers: {'Content-Type': 'application/json;charset=utf-8'}
      })
      .then(function (response) {
        return response.data;
      });
    }
  };
});


wishyooCMSApp.factory('AuthService', ['request', 'Session', 'globals', function (request, Session, globals) {

  var authService = {};
  var apiUrl = globals.baseUrl + globals.apiPrefix + '/auth/local';

  authService.login = function (credentials) {
    return request.post(apiUrl, {
      identifier: credentials.email, password: credentials.password
    })
    .then(function (user){
      Session.create(user.id, user.id, user.admin && 'admin' || '');
      return user;
    });
  };

  authService.isAuthenticated = function () {
    return !!Session.userId;
  };

  authService.isAuthorized = function (authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
      authorizedRoles.indexOf(Session.userRole) !== -1);
  };

  return authService;
}]);




wishyooCMSApp.directive('passwordVerify', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, elem, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('passwordVerify', function(val) {
        validate();
      });

      var validate = function() {
        // values
        var val1 = ngModel.$viewValue;
        var val2 = attrs.passwordVerify;

        // set validity
        ngModel.$setValidity('passwordVerify', !val1 || !val2 || val1 === val2);
      };
    }
  }
});


wishyooCMSApp
.directive('chantAudios', function($sce) {
  return {
    restrict: 'AE',
    scope: { code:'=' },
    replace: true,
    template: '<audio ng-src="{{url}}" controls></audio>',
    link: function (scope) {
      scope.$watch('code', function (newVal, oldVal) {
        if (newVal !== undefined) {
          scope.url = $sce.trustAsResourceUrl("../data/audio/chant-" + newVal + '/wet-mix-solo.m4a');
        }
      });
    }
  };
});



wishyooCMSApp.directive('toggleClass', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        element.toggleClass(attrs.toggleClass);
      });
    }
  };
});



wishyooCMSApp.directive('toggleClass', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        element.toggleClass(attrs.toggleClass);
      });
    }
  };
});



wishyooCMSApp.directive('stSearchAll', [function() {
  return {
    restrict: 'AE',
    require: '^stTable',
    scope: {
      query: '@'
    },
    template: '<button type="button" class="btn btn-default" ng-click="fetchAllParticipants()">{{query | titleCase}}</button>',
    link: function(scope, element, attr, table) {
      scope.fetchAllParticipants = function() {
        console.log('scope.query', scope.query);
        var tableState = table.tableState();
        if(!tableState.search.predicateObject) {
          tableState.search.predicateObject = {}
        } else {
          tableState.pagination.start = 0;
          delete tableState.search.predicateObject.invited;
          delete tableState.search.predicateObject.joined;
          delete tableState.search.predicateObject.signed;
          delete tableState.search.predicateObject.contributed;
          delete tableState.search.predicateObject.pendinginvite;
        }
        if (scope.query !== 'all') {
          tableState.search.predicateObject[scope.query] = 1
        }
        table.pipe(tableState);
      };
    }
  }
}]);


wishyooCMSApp
.directive('confirmedClick', [
  function(){
    return {
      restrict: 'AE',
      link: function (scope, element, attr) {
        var msg = attr.myConfirmClick || "Are you sure?";
        var clickAction = attr.confirmedClick;
        element.bind('click',function (event) {
          if ( window.confirm(msg) ) {
            scope.$eval(clickAction)
          }
        });
      }
    };
  }
]);


wishyooCMSApp.filter('titleCase', function() {
  return function(input) {
    input = input || '';
    return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };
});


wishyooCMSApp
.service('Session', function () {
  this.create = function (sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function () {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
});



wishyooCMSApp
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
});


wishyooCMSApp
.factory('AudioService', [ '$window', '$http',
  function ($window, $http) {

    navigator.getUserMedia = (
      $window.navigator.getUserMedia ||
      $window.navigator.webkitGetUserMedia || /*Chrome*/
      $window.navigator.mozGetUserMedia ||
      $window.navigator.msGetUserMedia);

    navigator.getUserMedia({
      audio:true, video:false
    },function (stream) {
      $window.recordRTC = RecordRTC(stream)
      return
    },function (err) {
      console.log(err)
      return
    });

    return {
      UploadLastRecording: function () {
        blob = $window.recordRTC.getBlob()
        fd = new FormData()
        fd.append('audio', blob)
        $http.post('/path/to/server', fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type' : undefined }
        })
        .then(function (data){
          console.log("Posted sound")
          return
        });
      }
    }
  }
])


wishyooCMSApp
.factory('UserSettingService', [ 'request', 'globals',
  function (request, globals) {


    const apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/user-settings/';

    return {
      getUserSettings: getUserSettings,
      saveUserSettings: saveUserSettings,
      getCurrentUser: getCurrentUser
    };

    function getCurrentUser () {
      var user = localStorage.getItem('user');
      return user && JSON.parse(user);
    }

    function getUserSettings () {
      const userId = getCurrentUser().id;
      const url = apiUrl + userId;
      console.log('calling getUserSettings', url);
      return request.get(url)
      .then(function (userSettings) {
        return userSettings.settings || {};
      });
    }

    function saveUserSettings (userSettings) {
      const userId = getCurrentUser().id;
      console.log('userId', userId);
      console.log('userSettings', userSettings);
      console.log('apiUrl', apiUrl);
      const url = apiUrl + userId;
      return request.put(url, {
        settings: userSettings
      });
    }
  }
]);



wishyooCMSApp.directive('stPersist', function (_, UserSettingService){

  // this directive will save the tableState as used by smart table
  // However, the tableState does not save the ordering of columns
  // For saving that, we are using lrDragNDrop's dropSuccess method
  // inside the controller for which we are implementing drag and drop
  // we can use this directive to store table states of different tables
  // under user settings. This is controlled by the st-persist attribute
  // in the view whose value is translated to nameSpace. For example,
  // in campaigns table, we set st-persist="campaigns". Now the tableState
  // for that table will be stored under userSettings.campaigns.tableState
  return {
    require: '^stTable',
    restrict: 'A',
    link: function (scope, element, attr, ctrl) {
      var nameSpace = attr.stPersist;
      //save the table state every time it changes
      scope.$watch(function () {
        return ctrl.tableState();
      }, function (newValue, oldValue) {
        if (newValue !== oldValue) {
          UserSettingService.getUserSettings()
          .then(function (userSettings){
            if (userSettings) {
              if (!userSettings[nameSpace]) {
                userSettings[nameSpace] = {};
              }
              // Updated to only save table sort
              // Search and Pagination shouldn't be saved to the settings
              userSettings[nameSpace].tableState = newValue;
              UserSettingService.saveUserSettings(userSettings);
            }
          });
        }
      }, true);

      //fetch the table state when the directive is loaded
      UserSettingService.getUserSettings()
      .then(function (userSettings){
        var tableState = ctrl.tableState();
        if (userSettings && userSettings[nameSpace] && userSettings[nameSpace].tableState) {
          var savedState = userSettings[nameSpace].tableState;
          angular.extend(tableState, savedState);
          if ((!tableState.sort || _.isEmpty(tableState.sort)) && attr.defaultSortColumn) {
            _setDefaultSort(tableState, attr.defaultSortColumn, attr.defaultSortDirection);
          }
          ctrl.pipe();
        } else {
          angular.extend(tableState);
          _setDefaultSort(tableState, attr.defaultSortColumn, attr.defaultSortDirection);
          ctrl.pipe();
        }
      });

      function _setDefaultSort(tableState, sortColumn, sortDirection) {
        tableState.sort = {
          predicate: sortColumn,
          reverse: (sortDirection && sortDirection.toLowerCase() === 'desc') ? true : false
        };
      }
    }
  };
})



function rowSelect() {
  return {
    require: '^stTable',
    template: '<input type="checkbox">',
    scope: {
        row: '=rowSelect'
    },
    link: function (scope, element, attr, ctrl) {

      element.bind('click', function (evt) {
        scope.$apply(function () {
          ctrl.select(scope.row, 'multiple');
        });
      });

      scope.$watch('row.isSelected', function (newValue) {
        if (newValue === true) {
          element.parent().addClass('st-selected');
          element.find('input').prop('checked', true);
        } else {
          element.parent().removeClass('st-selected');
          element.find('input').prop('checked', false);
        }
      });
    }
  };
}

wishyooCMSApp.directive('rowSelect', rowSelect);


function rowSelectAll() {
  return {
    require: '^stTable',
    template: '<input type="checkbox">',
    scope: {
      all: '=rowSelectAll',
      selected: '='
    },

    link: function (scope, element, attr) {
      scope.isAllSelected = false;
      scope.all = scope.all || [];
      element.bind('click', function (evt) {
        scope.$apply(function () {
          scope.all.forEach(function (val) {
            val.isSelected = scope.isAllSelected;
          });
        });
      });

      scope.$watchCollection('selected', function(newVal) {
        var s = newVal.length;
        var a = scope.all.length;
        if ((s == a) && s > 0 && a > 0) {
          element.find('input').attr('checked', true);
          scope.isAllSelected = false;
        } else {
          element.find('input').attr('checked', false);
          scope.isAllSelected = true;
        }
      });
    }
  };
}

wishyooCMSApp.directive('rowSelectAll', rowSelectAll);
