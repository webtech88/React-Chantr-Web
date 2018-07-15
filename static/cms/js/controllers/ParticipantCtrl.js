wishyooCMSApp.controller('ParticipantController', [
  '$scope', '$log', '$window', '$modal', '$route', '$timeout', '$location', '$routeParams', 'Upload', 'request', 'globals', '$sce',
  function ($scope, $log, $window, $modal, $route, $timeout, $location, $routeParams, Upload, request, globals, $sce) {
    console.log('$routeParams', $routeParams);

    $scope.setPanelName('Participants Panel');
    $scope.page_sizes = [10, 25, 50, 100, 200, 1000];
    $scope.numRows = 50;
    $scope.nowShowing = 'All';
    $scope.prefilters = false;

    $scope.card_id = $routeParams.card_id;
    var apiUrl = globals.baseUrl + globals.apiPrefix + '/admin/card/' + $scope.card_id + '/participant';
    var cardApiUrl = globals.baseUrl + globals.apiPrefix + '/admin/card/' + $scope.card_id;
    var publishApiUrl = globals.baseUrl + globals.apiPrefix + '/chants/publish/' + $scope.card_id;
    var submitApiUrl = globals.baseUrl + globals.apiPrefix + '/chants/' + $scope.card_id + '/board/submit';
    var cardBaseUrl = globals.baseUrl + globals.apiPrefix + '/chants/' + $scope.card_id;

    $scope.hideAlert = function (){
      $scope.serverError = false;
      $route.reload();
    }

    $scope.callServer = function (tableState) {

      if(!tableState.search.predicateObject) {
        tableState.search.predicateObject = {}
      }

      if($routeParams.userId) {
        tableState.search.predicateObject = {
          board: $routeParams.userId
        }
      }

      if($routeParams.query) {
        tableState.search.predicateObject = {
          query: $routeParams.query
        }
      }

      if($routeParams.status) {
        tableState.search.predicateObject[$routeParams.status] = '1'
      }

      console.log('tableState', tableState);
      var queryString = getQueryString(tableState);
      console.log('queryString', queryString);
      return fetchParticipants(queryString, tableState);
    }

    $scope.$watch('cardDetails', function (newValue, oldValue){
      if(newValue && newValue.numParticipants === 0){
        $scope.zeroParticipants = true;
        if($scope.currentUser) {
          $scope.showBulkUploadModal();
        }
      }
      console.log('oldValue', oldValue);
      console.log('newValue', newValue);
      if(newValue && oldValue && newValue.dueDate && oldValue.dueDate && newValue.dueDate != oldValue.dueDate) {
        updateCardDueDate(newValue);
      }
    })

    $scope.fetchCardDetails = function (){
      return request.get(cardApiUrl)
      .then(function (cardDetails){
        cardDetails.audioUrl = '../data/audio/chant-' +cardDetails.id+ '/wet-mix-solo.m4a';
        $sce.trustAsResourceUrl(cardDetails.audioUrl);
        $scope.cardDetails = cardDetails;
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

      $scope.prefilters = false;
      queryParams.pageSize = $scope.numRows;

      // search
      if (tableState.search.predicateObject && tableState.search.predicateObject.$) {
        queryParams.query = tableState.search.predicateObject.$
      }

      if (tableState.search.predicateObject && tableState.search.predicateObject.invited) {
        $scope.nowShowing = 'Invited Participants';
        $scope.prefilters = true;
        queryParams.invited = tableState.search.predicateObject.invited;
      }

      if (tableState.search.predicateObject && tableState.search.predicateObject.joined) {
        $scope.nowShowing = 'Joined Participants';
        $scope.prefilters = true;
        queryParams.joined = tableState.search.predicateObject.joined;
      }

      if (tableState.search.predicateObject && tableState.search.predicateObject.pendinginvite) {
        $scope.nowShowing = 'Pending Invites';
        $scope.prefilters = true;
        queryParams.pendinginvite = tableState.search.predicateObject.pendinginvite;
      }

      if (tableState.search.predicateObject && tableState.search.predicateObject.signed) {
        $scope.nowShowing = 'Signed Participants';
        $scope.prefilters = true;
        queryParams.signed = tableState.search.predicateObject.signed;
      }

      if (tableState.search.predicateObject && tableState.search.predicateObject.contributed) {
        $scope.nowShowing = 'Contributed Participants';
        $scope.prefilters = true;
        queryParams.contributed = tableState.search.predicateObject.contributed;
      }

      if (!$scope.prefilters) {
        $scope.nowShowing = 'All Participants';
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

    function fetchParticipants(queryString, tableState){
      var url = apiUrl;
      if (queryString) {
        var url = apiUrl + queryString;
      }
      return request.get(url)
      .then(function(data) {
        console.log('data', data);
        if(tableState.pagination) {
          tableState.pagination.totalItemCount = data.total;
          tableState.pagination.numberOfPages = Math.ceil(data.total / tableState.pagination.number);
        }
        $scope.participants = data.rows;
        data.cardDetails.audioUrl = '../data/audio/chant-' + data.cardDetails.id + '/wet-mix-solo.m4a';
        $sce.trustAsResourceUrl(data.cardDetails.audioUrl);
        $scope.cardDetails = data.cardDetails;
        console.log($scope.participants);
      });
    }

    $scope.removeParticipants = function (boardMembers){
      var participantIds = boardMembers
      .map(function (boardMember){
        return boardMember.id;
      });

      var body = {
        participants: participantIds
      };

      console.log('deleting members', body);
      return request.delete(apiUrl, body)
      .then(function (response){
        console.log('deleted members', response);
        $route.reload();
      })
      .catch(function (err){
        window.alert(err.statusText);
      })
    }


    $scope.uploadParticipantsFile = function (file) {
      console.log(file);

      file.upload = Upload.upload({
        url: apiUrl + '/upload',
        data: { filedata: file }
      });

      file.upload.then(function (response) {
        $timeout(function() {
          file.result = response.data;
          $route.reload();
        })
      }, function (response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

    }

    $scope.addMember = function () {
      if($scope.newMember && $scope.newMember.email) {
        var body = {
          emails: $scope.newMember.email
        }
        return request.post(apiUrl, body)
        .then(function (response){
          $timeout(function() {
            $route.reload();
          });
        });
      }
    }


    $scope.addParticipants = function () {
      if($scope.newParticipants && $scope.newParticipants.trim().length) {
        var body = {
          emails: $scope.newParticipants.trim()
        }
        return request.post(apiUrl, body)
        .then(function (response){
          $timeout(function() {
            $route.reload();
          });
        });
      }
    }

    $scope.showBulkUploadModal = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'views/bulk_upload.html',
        controller: 'BulkUploadController',
        size: 'lg',
        resolve: {
          bulkUploadForm: function () {
            return $scope.bulkUploadForm;
          },
          addParticipantsForm: function () {
            return $scope.addParticipantsForm;
          },
          card_id: function () {
            return $scope.card_id;
          }
        }
      });
      modalInstance.result.then(function (response) {
        console.log('uploaded file', response)
        $route.reload();
      })
      .catch(function (err){
        console.log('error', err);
        if(err !== 'cancel'){
          $route.reload();
        }
      });
    };

    $scope.updateCardDueDate = function (cardDetails){
      var body = {
        dueDate: cardDetails.dueDate
      };
      console.log('updating card due date')
      return request.put(cardApiUrl, body)
      .catch(_errorHandler);
    };

    $scope.updateCardTitle = function (cardDetails){
      var body = {
        title: cardDetails.title
      };
      console.log('updating card title')
      return request.put(cardApiUrl, body)
      .catch(_errorHandler);
    };

    $scope.updateCardDescription = function (cardDetails){
      var body = {
        description: cardDetails.description
      };
      console.log('updating card description')
      return request.put(cardApiUrl, body)
      .catch(_errorHandler);
    };

    $scope.updateCardCreatorName = function (cardDetails){
      var body = {
        creator_name: cardDetails.creator_name
      };
      console.log('updating card creator_name')
      return request.put(cardBaseUrl, body)
      .catch(_errorHandler);
    };

    $scope.updateRecipient = function (cardDetails){
      var body = {
        recipient: [
          {
            name: $scope.cardDetails.recipient_name,
            email: $scope.cardDetails.recipient_email
          }
        ]
      }
      var url = cardBaseUrl + '/board/recipient';
      return request.put(url, body)
      .catch(_errorHandler);
    };

    $scope.updateCardLabel = function (cardDetails){
      var body = {
        label: cardDetails.label
      };
      return request.put(cardApiUrl, body)
      .catch(_errorHandler);
    };

    $scope.togglePrivacy = function (cardDetails){
      var body = {
        isPrivate: cardDetails.isPrivate ? false : true
      };
      var url = cardBaseUrl + '/board/isPrivate';
      return request.put(url, body)
      .then(function (){
        cardDetails.isPrivate = cardDetails.isPrivate ? false : true;
        if (!cardDetails.isPrivate) {
          cardDetails.is_shareable = 1;
        }
      })
      .catch(_errorHandler);
    };

    $scope.toggleShareable = function (cardDetails){
      var body = {
        is_shareable: cardDetails.is_shareable ? false : true
      };
      var url = cardBaseUrl + '/board/isPrivate';
      return request.put(url, body)
      .then(function (){
        cardDetails.is_shareable = cardDetails.is_shareable ? false : true;
      })
      .catch(function (err){
        console.error(err.statusText);
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        $scope.serverError = true;
        $window.scrollTo(0, 0);
      });
    };

    $scope.showGiftDetails = function (cardDetails) {
      var card_id = cardDetails.id;
      var gift_id = cardDetails.gift_id;
      $location.path('/cards/' + card_id + '/gifts').search({gift_id: gift_id});
    };

    $scope.deleteGift = function (cardDetails) {
      var card_id = cardDetails.card_id;
      var gift_id = cardDetails.gift_id;
      var url = globals.baseUrl + globals.apiPrefix + '/gifts/' + gift_id;
      return request.delete(url)
      .then(function (deletedGift){
        console.log('successfully deleted gift', deletedGift);
        $route.reload();
      })
      .catch(function (err){
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        $scope.serverError = true;
        $window.scrollTo(0, 0);
      });
    };

    $scope.showCoverImageUploadModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/add_cover_image.html',
        controller: 'CoverImageController',
        size: size,
        resolve: {
          coverImageForm: function () {
            return $scope.coverImageForm;
          },
          card_id: function () {
            return $scope.card_id;
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


    $scope.showAudioUploadModal = function (size) {
      var modalInstance = $modal.open({
        templateUrl: 'views/add_audio.html',
        controller: 'AudioController',
        size: size,
        resolve: {
          audioForm: function () {
            return $scope.audioForm;
          },
          card_id: function () {
            return $scope.card_id;
          }
        }
      });
      modalInstance.result
      .then(function (addedAudio) {
        console.log('uploaded audio successfully');
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
        templateUrl: 'views/preview_signature_image.html',
        controller: 'SignaturePreviewController',
        resolve: {
          handwritingUrl: function () {
            return row.handwritingUrl;
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


    $scope.deleteSignature = function (row) {
      var url = globals.baseUrl + globals.apiPrefix + '/signatures/' + row.signatureId;
      return request.delete(url)
      .then(function (deleted){
        row.signatureId = null;
        row.handwritingUrl = null;
      })
      .catch(function (err){
        console.error(err.statusText);
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        $scope.serverError = true;
        $window.scrollTo(0, 0);
      });
    };


    $scope.publishCard = function (cardDetails) {
      // send a PUT request to publishApiUrl
      return request.put(publishApiUrl, {})
      .then(function (published){
        console.log('published', published);
        $route.reload();
      })
      .catch(function (err){
        console.error(err.statusText);
        $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
        $scope.serverError = true;
        $window.scrollTo(0, 0);
      });
    }

    $scope.sendToRecipient = function (sendToRecipient) {
      // send a PUT request to publishApiUrl
      return request.put(submitApiUrl, {})
      .then(function (submitted){
        console.log('submitted', submitted);
        $route.reload();
      })
      .catch(_errorHandler);
    }

    function _errorHandler (err) {
      console.error(err.statusText);
      $scope.errorMessage = err.data && err.data.errors && err.data.errors[0] || err.statusText;
      $scope.serverError = true;
      $window.scrollTo(0, 0);
    }

    // due date picker related stuff
    $scope.today = function() {
      $scope.cardDetails.dueDate = new Date();
    };

    // $scope.today();

    $scope.clearDate = function () {
      $scope.cardDetails.dueDate = null;
    };

    $scope.minDate = $scope.minDate || new Date();

    $scope.openDueDatePicker = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.openedDueDatePicker = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.dueDateFormats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.dueDateFormat = $scope.dueDateFormats[0];

    $scope.inviteParticipant = function (participant) {
      var url = cardBaseUrl + '/board/invitebybmid';
      var body = {
        boardMemberIds: [participant.id]
      };
      return request.post(url, body)
      .then(function (response){
        console.log('response', response);
        $route.reload();
      })
      .catch(_errorHandler);
    }

    $scope.inviteAllParticipants = function (participants) {
      // given the card id, invite all the participants
      var uninvited = participants.filter(function (participant){
        return !participant.invited && !participant.joined_at;
      })
      .map(function (participant){
        return participant.id
      });

      if (!uninvited.length) {
        console.error('All participants are either already invited or joined');
        $scope.errorMessage = 'All participants are either already invited or have joined the card';
        $scope.serverError = true;
        $window.scrollTo(0, 0);
        return;
      }

      var url = cardBaseUrl + '/board/invitebybmid';
      var body = {
        boardMemberIds: uninvited
      };
      return request.post(url, body)
      .then(function (response){
        console.log('response', response);
        $route.reload();
      })
      .catch(_errorHandler);
    }

}]);
