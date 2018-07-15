import request from 'superagent';

export function success(response) {
  const server = !!process.env.BASE_URL;
  if (!server && response && response.body) {
    if (response.body.success && response.body.success.length > 0) {
      window.store.dispatch({ type: 'FAILURE', failure: undefined });
      window.store.dispatch({ type: 'SUCCESS', success: response.body.success });
    }
  }
}

export function failure(response) {
  const server = !!process.env.BASE_URL;
  if (!server && response && response.body) {
    if (response.body.error && response.body.error.length > 0) {
      window.store.dispatch({ type: 'SUCCESS', success: undefined });
      window.store.dispatch({ type: 'FAILURE', failure: response.body.error });
    }
  }
}

export function apiGet(url) {
  return new Promise((resolve, reject) => {
    return request
      .get(url)
      .withCredentials()
      .end((error, response) => {
        if (!error) {
          success(response);
          resolve(response);
        } else {
          failure(response);
          reject(response);
        }
      });
  });
}

export function apiPost(url, data) {
  return new Promise((resolve, reject) => {
    return request
      .post(url)
      .withCredentials()
      .send(data)
      .end((error, response) => {
        if (!error) {
          success(response);
          resolve(response);
        } else {
          failure(response);
          reject(response);
        }
      });
  });
}

export function apiDelete(url) {
  return new Promise((resolve, reject) => {
    return request
      .delete(url)
      .withCredentials()
      .end((error, response) => {
        if (!error) {
          success(response);
          resolve(response);
        } else {
          failure(response);
          reject(response);
        }
      });
  });
}

export function apiPut(url, data) {
  return new Promise((resolve, reject) => {
    return request
      .put(url)
      .withCredentials()
      .send(data)
      .end((error, response) => {
        if (!error) {
          success(response);
          resolve(response);
        } else {
          failure(response);
          reject(response);
        }
      });
  });
}

export function getFeaturedCards(limit, offset) {
  return (dispatch) => {
    dispatch({ type: 'IS_FEATURED_CARDS_LOADING', isfeaturedCardsLoading: true });
    apiGet(`/api/v3/cards/featured?limit=${limit}&offset=${offset}`)
      .then((res) => {
        dispatch({ type: 'IS_FEATURED_CARDS_LOADING', isfeaturedCardsLoading: false });
        dispatch({ type: 'GET_FEATURED_CARDS', featuredCards: res.body });
      })
      .catch(() => {

      });
  };
}

export function resetFeatureCards(limit, offset) {
  return (dispatch) => {
    dispatch({ type: 'IS_FEATURED_CARDS_LOADING', isfeaturedCardsLoading: true });
    apiGet(`/api/v3/cards/featured?limit=${limit}&offset=${offset}`)
      .then((res) => {
        dispatch({ type: 'IS_FEATURED_CARDS_LOADING', isfeaturedCardsLoading: false });
        dispatch({ type: 'RESET_FEATURE_CARDS', featuredCards: res.body });
      })
      .catch(() => {

      });
  };
}

export function getCategoryCards(category) {
  return (dispatch) => {
    dispatch({
      type: 'GET_ACTIVE_CATEGORY',
      activeCategory: { name: category.name, display_name: category.display_name },
    });
    dispatch({ type: 'GET_CATEGORY_CARDS', categoryCards: undefined });
    apiGet(`/api/v3/chants?category=${category.name}`)
      .then((res) => {
        dispatch({ type: 'GET_CATEGORY_CARDS', categoryCards: res.body });
      })
      .catch(() => {

      });
  };
}

export function getUserData(userId) {
  return (dispatch) => {
    apiGet(`/api/v3/users/${userId}`)
      .then((res) => {
        dispatch({ type: 'GET_USER_DATA', user: res.body });
        dispatch({ type: 'LOADING', isLoading: false });
      })
      .catch(() => {

      });
  };
}

export function getUserCards(limit, skip, userId, callback) {
  return (dispatch) => {
    dispatch({ type: 'IS_USER_CARDS_LOADING', isuserCardsLoading: true });
    apiGet(`/api/v3/chants?status=published&owner=${userId}&limit=${limit}&skip=${skip}`)
      .then((res) => {
        dispatch({ type: 'IS_USER_CARDS_LOADING', isuserCardsLoading: false });
        dispatch({ type: 'USER_CARDS', userCards: res.body });
        if (callback) { callback(); }
      })
      .catch(() => {

      });
  };
}

export function getLoginUserJoinedCards(limit, skip, userId, callback) {
  return (dispatch) => {
    dispatch({ type: 'IS_LOGIN_USER_JOINED_CARDS_LOADING', isloginUserJoinedCardsLoading: true });
    apiGet(`/api/v3/chants/myjoins?limit=${limit}&skip=${skip}`)
      .then((res) => {
        dispatch({ type: 'IS_LOGIN_USER_JOINED_CARDS_LOADING', isloginUserJoinedCardsLoading: false });
        dispatch({ type: 'LOGIN_USER_JOINED_CARDS', loginUserJoinedCards: res.body });
        if (callback) { callback(); }
      })
      .catch(() => {

      });
  };
}

export function getUserJoinedCards(limit, skip, userId, callback) {
  return (dispatch) => {
    dispatch({ type: 'IS_USER_JOINED_CARDS_LOADING', isuserJoinedCardsLoading: true });
    apiGet(`/api/v3/chants/joins/${userId}?limit=${limit}&skip=${skip}`)
      .then((res) => {
        dispatch({ type: 'IS_USER_JOINED_CARDS_LOADING', isuserJoinedCardsLoading: false });
        dispatch({ type: 'USER_JOINED_CARDS', userJoinedCards: res.body });
        if (callback) { callback(); }
      })
      .catch(() => {

      });
  };
}

export function login(data, callback) {
  return (dispatch) => {
    apiPost(`/api/v3/auth/local`, data).then((res) => {
      dispatch({ type: 'LOGIN_USER_INFO', loginUserInfo: res.body });
      dispatch({ type: 'LOGIN', isLogin: true });
      callback(res);
    })
    .catch(() => {

    });
  };
}

export function logout(data, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    apiPost(`/api/v3/auth/local/logout`)
      // eslint-disable-next-line no-unused-vars
      .then((res) => {
        if (callback) { callback(res); }
      })
      .catch(() => {

      });
  };
}

export function isLogin(data, callback) {
  return (dispatch) => {
    apiGet(`/api/v3/auth/status`)
      .then((res) => {
        if (callback) {
          callback(res.body);
        } else if (res.body.loggedIn) {
          dispatch({ type: 'LOGIN', isLogin: true });
          data.url.push('/profile');
        } else {
          dispatch({ type: 'LOGIN', isLogin: false });
          data.url.push('/login');
        }
      })
      .catch(() => {

      });
  };
}

export function getLoggedInUserInfo(callback) {
  return (dispatch) => {
    apiGet(`/api/v3/auth/status`)
      .then((res) => {
        if (res.body.loggedIn) {
          dispatch({ type: 'LOGIN', isLogin: true });
          apiGet(`/api/v3/users/${res.body.userId}`).then((response) => {
            dispatch({ type: 'LOGGEDIN_USER', loggedUser: response.body });
            if (callback) { callback(response.body); }
          });
        } else {
          dispatch({ type: 'LOGIN', isLogin: false });
          dispatch({ type: 'LOGGEDIN_USER', loggedUser: undefined });
          if (callback) { callback(res.body); }
        }
      })
      .catch(() => {

      });
  };
}

export function followUser(userId, callback) {
  return (dispatch) => {
    dispatch({ type: 'LOADING', isLoading: true });
    apiPost(`/api/v3/users/${userId}/follow`)
      // eslint-disable-next-line no-unused-vars
      .then((res) => {
        if (callback) { callback(); }
      })
      .catch(() => {

      });
  };
}

export function unfollowUser(userId, callback) {
  return (dispatch) => {
    dispatch({ type: 'LOADING', isLoading: true });
    apiDelete(`/api/v3/users/${userId}/follow`)
      // eslint-disable-next-line no-unused-vars
      .then((res) => {
        if (callback) { callback(); }
      })
      .catch(() => {

      });
  };
}

export function getCardOwnerInfo(userId) {
  return (dispatch) => {
    apiGet(`/api/v3/users/${userId}`)
      .then((res) => {
        dispatch({ type: 'GET_CARD_OWNER_DATA', cardOwner: res.body });
        dispatch({ type: 'LOADING', isLoading: false });
      })
      .catch(() => {

      });
  };
}

export function getCardInfo(cardId, callback) {
  return (dispatch) => {
    apiGet(`/api/v3/chants/${cardId}`)
      .then((res) => {
        dispatch({ type: 'CARD_INFO', cardInfo: res.body });
        dispatch(getCardOwnerInfo(res.body.owner));
        if (callback) { callback(res.body); }
      })
      .catch(() => {

      });
  };
}

export function getCardImages(limit, skip, cardId, callback) {
  return (dispatch) => {
    apiGet(`/api/v3/chants/${cardId}/images?limit=${limit}&skip=${skip}`)
      .then((res) => {
        dispatch({ type: 'CARD_IMAGES', cardImages: res.body });
        if (callback) { callback(res.body); }
      })
      .catch(() => {

      });
  };
}

export function getCardSignatures(limit, skip, cardId, callback) {
  return (dispatch) => {
    apiGet(`/api/v3/chants/${cardId}/signatures?limit=${limit}&skip=${skip}`)
      .then((res) => {
        dispatch({ type: 'CARD_SIGNATURES', cardSignatures: res.body });
        if (callback) { callback(res.body); }
      })
      .catch(() => {

      });
  };
}

export function like(cardId) {
  return (dispatch) => {
    apiPut(`/api/v3/chants/like/${cardId}`)
      // eslint-disable-next-line no-unused-vars
      .then((res) => {
        dispatch(getCardInfo(cardId));
      })
      .catch(() => {

      });
  };
}

export function unlike(cardId) {
  return (dispatch) => {
    apiPut(`/api/v3/chants/unlike/${cardId}`)
      // eslint-disable-next-line no-unused-vars
      .then((res) => {
        dispatch(getCardInfo(cardId));
      })
      .catch(() => {

      });
  };
}

export function usernameEmailAvailable(data, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    apiPost(`/api/v3/users/check`, data)
      .then((res) => {
        if (callback) { callback(res.body); }
      })
      .catch((err) => {
        if (callback) { callback(err.body); }
      });
  };
}

export function register(data, callback) {
  return (dispatch) => {
    apiPost(`/api/v3/auth/local/register`, data)
      .then((res) => {
        dispatch({ type: 'LOGIN_USER_INFO', loginUserInfo: res.body });
        dispatch({ type: 'LOGIN', isLogin: true });
        if (callback) { callback(res); }
      })
      .catch((err) => {
        if (callback) { callback(err); }
      });
  };
}

export function forgotPassword(data, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    apiPut(`/api/v3/users/resetpassword`, data)
      .then((res) => {
        if (callback) { callback(res.body); }
      })
      .catch(() => {

      });
  };
}

export function getUnsubscribeData(token, callback) {
  return (dispatch) => {
    apiGet(`/api/v3/users/unsubscribe?token=${token}`)
      .then((res) => {
        res.body.options.forEach((option) => {
          const temp = option;
          if (temp.selected === undefined) {
            temp.selected = false;
          }
          return temp;
        });
        res.body.reasons.forEach((reason) => {
          const temp = reason;
          if (temp.selected === undefined) {
            temp.selected = false;
          }
          return temp;
        });
        dispatch({ type: 'UNSUBSCRIBE_DATA', unsubscribeData: res.body });
        if (callback) { callback(res.body); }
      })
      .catch(() => {

      });
  };
}

export function changeUnsubscribeData(data) {
  return (dispatch) => {
    dispatch({ type: 'UNSUBSCRIBE_DATA', unsubscribeData: data });
  };
}

export function unsubscribeSubmitOption(selectedOptions, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    apiPost(`/api/v3/users/unsubscribe`, selectedOptions)
      .then((res) => {
        if (callback) { callback(res.body); }
      })
      .catch(() => {

      });
  };
}

export function unsubscribeSubmitReason(selectedReason, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    apiPost(`/api/v3/users/unsubscribe/reason`, selectedReason)
      .then((res) => {
        if (callback) { callback(res.body); }
      })
      .catch(() => {

      });
  };
}

export function searchCards(cardName, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    apiGet(`/api/v3/chants?status=published&limit=20&search=${cardName}`)
      .then((res) => {
        if (callback) { callback(res.body.cards); }
      })
      .catch(() => {

      });
  };
}

export function searchUsers(userName, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    if (userName) {
      apiGet(`/api/v3/users/search?username=${userName}`)
        .then((res) => {
          if (callback) { callback(res.body); }
        })
        .catch(() => {

        });
    }
  };
}

export function submitUserNameEmail(id, query, data, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    apiPost(`/api/v3/cards/${id}/guest/${query}/profile`, data)
      .then((res) => {
        if (callback) { callback(res); }
      })
      .catch(() => {

      });
  };
}

export function getYoutubeChannel(callback) {
  return ((dispatch) => {
    apiGet(`/api/v3/users/fetch-youtube-channels`)
      .then((res) => {
        dispatch({ type: 'GET_YOUTUBE_CHANNELS', channels: res.body });
      })
      .catch((err) => {
        if (callback) { callback(err); }
      });
  });
}

export function saveChannelForContest(data, callback) {
  return (() => {
    apiPost(`/api/v3/users/save-channel-for-contest`, data)
      .then((res) => {
        localStorage.removeItem('youtuber_channels');
        if (callback) { callback(res); }
      })
      .catch((err) => {
        if (callback) { callback(err); }
      });
  });
}

export function checkYoutubeLinkage(callback) {
  return (() => {
    apiGet(`/api/v3/users/check-youtube-linkage`)
      .then((res) => {
        if (callback) { callback(res); }
      })
      .catch((err) => {
        if (callback) { callback(err); }
      });
  });
}

export function getUserInformation(userId, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    apiGet(`/api/v3/users/${userId}`)
      .then((res) => {
        const response = JSON.parse(res.text);
        if (response.activated) {
          callback(response.activated);
        } else {
          callback(false);
        }
      })
      .catch(() => {

      });
  };
}

export function checkSignatureAdded(cardId, userId, callback) {
  // eslint-disable-next-line no-unused-vars
  return (dispatch) => {
    apiGet(`/api/v3/chants/${cardId}/board/has_signed`)
      .then((res) => {
        callback(res.body);
      })
      .catch(() => {

      });
  };
}

export function resetPassword(passwordDetails, callback) {
  return (dispatch) => {
    apiPost(`/api/v3/users/resetpassword`, passwordDetails)
      .then((res) => {
        if (callback) {
          callback(null, res);
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err, null);
        }
      });
  };
}

export function downloadSignatures(cardId, callback) {
  return (dispatch) => {
    window.location.href = `/api/v3/cards/${cardId}/download-all-signatures`;
  };
}

export function deleteSignature(signatureId, callback) {
  return () => {
    apiDelete(`/api/v3/signatures/${signatureId}`)
      .then(() => {
        if (callback) {
          callback();
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err);
        }
      });
  };
}

export function blockUser(signatureId, callback) {
  return () => {
    apiPut(`/api/v3/signatures/${signatureId}/block_participant`)
      .then((res) => {
        if (callback) {
          callback(res.body);
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err);
        }
      });
  };
}

export function reportSignature(signatureId, callback) {
  return () => {
    apiPut(`/api/v3/signatures/${signatureId}/isabuse`)
      .then((res) => {
        if (callback) {
          callback(res.body);
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err.body);
        }
      });
  };
}

export function addGiftContribution(giftId, amount, callback) {
  return () => {
    apiPost(`/api/v3/gifts/${giftId}/contributions`, amount)
      .then((res) => {
        if (callback) {
          callback(res);
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err);
        }
      });
  };
}

export function editGiftContribution(giftId, amount, callback) {
  return () => {
    apiPut(`/api/v3/gifts/${giftId}/contributions`, amount)
      .then((res) => {
        if (callback) {
          callback(res);
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err);
        }
      });
  };
}

export function getUpdatedCardInfo(cardId, callback) {
  return (dispatch) => {
    apiGet(`/api/v3/chants/${cardId}/board?hull=true`)
      .then((res) => {
        dispatch({ type: 'CARD_BOARD_INFO', cardBoardInfo: res.body });
        callback(res.body);
      })
      .catch((err) => {
        if (callback) {
          callback(err);
        }
      });
  };
}

export function getUsersJoinedCard(limit, skip, cardId) {
  return (dispatch) => {
    dispatch({ type: 'LOADING_CARDS', isLoadingCards: true });
    apiGet(`/api/v3/chants/${cardId}/board/members?limit=${limit}&skip=${skip}`)
      .then((res) => {
        dispatch({ type: 'USERS_JOINED_TO_CARDS', usersJoined: res.body });
        dispatch({ type: 'LOADING_CARDS', isLoadingCards: false });
      })
      .catch((err) => {

      });
  };
}

export function deleteAttachment(attachmentId, callback) {
  return () => {
    apiDelete(`/api/v3/attachments/${attachmentId}`)
      .then(() => {
        if (callback) {
          callback();
        }
      })
      .catch((err) => {
        if (callback) {
          callback(err);
        }
      });
  };
}

export function deleteCardSignature(cardId) {
  return (dispatch) => {
    apiDelete(`/api/v3/signatures/${cardId}`)
      .then((response) => {
        dispatch({ type: 'CARD_SIGNATURE_DELETE_SUCCESS', success: response.body });
      })
      .catch((err) => {
        const error = err.body;
        Object.defineProperty(error, 'display_message',
          Object.getOwnPropertyDescriptor(error, 'display-message'));
        delete error['display-message'];
        dispatch({ type: 'CARD_SIGNATURE_DELETE_ERROR', error: error });
      });
  };
}

export function deleteSignatureAndBlockUser(cardId) {
  return (dispatch) => {
    apiPut(`/api/v3/signatures/${cardId}/block_participant`)
      .then((response) => {
        dispatch({ type: 'CARD_SIGNATURE_DELETE_SUCCESS', success: response.body });
      })
      .catch((err) => {
        const error = err.body;
        Object.defineProperty(error, 'display_message',
          Object.getOwnPropertyDescriptor(error, 'display-message'));
        delete error['display-message'];
        dispatch({ type: 'CARD_SIGNATURE_DELETE_ERROR', error: error });
      });
  };
}

export function reportAbuseCard(cardId, description, callback) {
  return (dispatch) => {
    apiPut(`/api/v3/cards/${cardId}/report-abuse`, {description})
      .then((response) => {
        if (callback) {
          callback(null, response.body)
        }
      })
      .catch((err) => {
        callback(err.body, null)
      });
  };
}

export function createPhantomUser(guestName, cardId) {
  return (dispatch) => {
    apiGet(`/api/v3/auth/create-phantom-user?activated=true&username=${guestName}`)
      .then((response) => {
        if(response.status === 200) {
          console.log("resp", response)
          window.top.location = `/card/${cardId}/signature`;
        }
      })
      .catch((err) => {
      });
  };
}

export function resendActivationLink(userId, callback) {
  return (dispatch) => {
    apiPut(`/api/v3/users/resendactivationmail/${userId}`, {youtuber: 1})
      .then((response) => {
        if(response.status === 200) {
          if (callback) {
            callback(null, response);
          }
        }
      })
      .catch((err) => {
      });
  };
}

export function getCardSignaturesPageWise(limit, skip, cardId, callback) {
  return (dispatch) => {
    apiGet(`/api/v3/chants/${cardId}/signatures?limit=${limit}&skip=${skip}`)
      .then((res) => {
        dispatch({ type: 'SIGNATURES_TO_CARDS', signaturesToCards: res.body });
        if (callback) {
          callback(res.body);
        }
      })
      .catch((err) => {
      });
  };
}
