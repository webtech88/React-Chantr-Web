import _ from 'lodash';

const initialState = {
  isLogin: false,
  loginUserInfo: {},
  isLoading: false,
  isfeaturedCardsLoading: true,
  isuserCardsLoading: true,
  isloginUserJoinedCardsLoading: true,
  isuserJoinedCardsLoading: true,
  featuredCards: [],
  cardsCategories: [],
  categoryCards: [],
  activeCategory: {
    name: '',
    display_name: '',
  },
  user: {},
  events: [],
  userCards: [],
  loginUserJoinedCards: [],
  userJoinedCards: [],
  userId: 0,
  cardInfo: {},
  cardOwner: {},
  cardBoardInfo: {},
  cardImages: {},
  cardSignatures: {},
  cardUsers: {},
  cardMembers: {},
  loggedUser: {},
  failure: undefined,
  success: undefined,
  BASE_URL: '',
  url: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_PROFILE_DATA':
      return Object.assign({}, state, {
        user: undefined,
        userCards: undefined,
        userJoinedCards: undefined,
        loginUserJoinedCards: undefined,
      });

    case 'IS_FEATURED_CARDS_LOADING':
      return Object.assign({}, state, {
        isfeaturedCardsLoading: action.isfeaturedCardsLoading,
      });

    case 'IS_USER_CARDS_LOADING':
      return Object.assign({}, state, {
        isuserCardsLoading: action.isuserCardsLoading,
      });

    case 'IS_LOGIN_USER_JOINED_CARDS_LOADING':
      return Object.assign({}, state, {
        isloginUserJoinedCardsLoading: action.isloginUserJoinedCardsLoading,
      });

    case 'IS_USER_JOINED_CARDS_LOADING':
      return Object.assign({}, state, {
        isuserJoinedCardsLoading: action.isuserJoinedCardsLoading,
      });

    case 'GET_FEATURED_CARDS':
      if (state.featuredCards) {
        const obj = {
          cards: state.featuredCards.cards.concat(action.featuredCards.cards),
          featured: action.featuredCards.featured,
          metadata: action.featuredCards.metadata,
        };
        return Object.assign({}, state, { featuredCards: obj });
      }
      return Object.assign({}, state, { featuredCards: action.featuredCards });

    case 'RESET_FEATURE_CARDS':
      return Object.assign({}, state, { featuredCards: action.featuredCards });

    case 'GET_CARDS_CATEGORIES':
      return Object.assign({}, state, {
        cardsCategories: action.cardsCategories,
      });

    case 'GET_ACTIVE_CATEGORY':
      return Object.assign({}, state, {
        activeCategory: action.activeCategory,
      });

    case 'GET_CATEGORY_CARDS':
      return Object.assign({}, state, {
        categoryCards: action.categoryCards,
      });

    case 'GET_SETTINGS':
      return Object.assign({}, state, {
        settings: action.settings,
        featuredSettings: action.featuredSettings,
        categorySettings: action.categorySettings,
      });

    case 'GET_USER_DATA':
      return Object.assign({}, state, {
        user: action.user,
      });

    case 'GET_EVENTS':
      return Object.assign({}, state, {
        events: action.events,
      });

    case 'USER_CARDS':
      if (state.userCards) {
        const obj = {
          cards: state.userCards.cards.concat(action.userCards.cards),
          metadata: action.userCards.metadata,
        };
        return Object.assign({}, state, { userCards: obj });
      }
      return Object.assign({}, state, { userCards: action.userCards });

    case 'LOGIN_USER_JOINED_CARDS':
      if (state.loginUserJoinedCards) {
        const obj = {
          cards: state.loginUserJoinedCards.cards.concat(action.loginUserJoinedCards.cards),
          metadata: action.loginUserJoinedCards.metadata,
        };
        return Object.assign({}, state, { loginUserJoinedCards: obj });
      }
      return Object.assign({}, state, { loginUserJoinedCards: action.loginUserJoinedCards });

    case 'USER_JOINED_CARDS':
      if (state.userJoinedCards) {
        const obj = {
          cards: state.userJoinedCards.cards.concat(action.userJoinedCards.cards),
          metadata: action.userJoinedCards.metadata,
        };
        return Object.assign({}, state, { userJoinedCards: obj });
      }
      return Object.assign({}, state, { userJoinedCards: action.userJoinedCards });

    case 'LOGIN':
      return Object.assign({}, state, {
        isLogin: action.isLogin,
      });

    case 'LOGIN_USER_INFO':
      return Object.assign({}, state, {
        loginUserInfo: action.loginUserInfo,
      });

    case 'LOADING':
      return Object.assign({}, state, {
        isLoading: action.isLoading,
      });

    case 'LOADING_CARDS':
      return Object.assign({}, state, {
        isLoadingCards: action.isLoadingCards,
      });
    case 'USER_ID':
      return Object.assign({}, state, { userId: action.userId });

    case 'LOGOUT':
      return Object.assign({}, ...state, {});

    case 'CLEAR_CARD_DATA':
      return Object.assign({}, state, {
        cardInfo: undefined,
        cardOwner: undefined,
        cardBoardInfo: undefined,
        cardImages: undefined,
        cardSignatures: undefined,
        cardUsers: undefined,
        cardMembers: undefined,
      });

    case 'CARD_INFO':
      return Object.assign({}, state, { cardInfo: action.cardInfo });

    case 'GET_CARD_OWNER_DATA':
      return Object.assign({}, state, { cardOwner: action.cardOwner });

    case 'CARD_BOARD_INFO':
      return Object.assign({}, state, { cardBoardInfo: action.cardBoardInfo });

    case 'CARD_IMAGES':
      if (state.cardImages) {
        const obj = {
          images: state.cardImages.images.concat(action.cardImages.images),
          metadata: action.cardImages.metadata,
        };
        return Object.assign({}, state, { cardImages: obj });
      }
      return Object.assign({}, state, { cardImages: action.cardImages });

    case 'CARD_SIGNATURES':
      if (state.cardSignatures) {
        const obj = {
          signatures: state.cardSignatures.signatures.concat(action.cardSignatures.signatures),
          metadata: action.cardSignatures.metadata,
        };
        return Object.assign({}, state, { cardSignatures: obj });
      }
      return Object.assign({}, state, { cardSignatures: action.cardSignatures });

    case 'CARD_USERS':
      return Object.assign({}, state, { cardUsers: action.cardUsers });

    case 'CARD_MEMBERS':
      return Object.assign({}, state, { cardMembers: action.cardMembers });

    case 'LOGGEDIN_USER':
      return Object.assign({}, state, { loggedUser: action.loggedUser });

    case 'UNSUBSCRIBE_DATA':
      return Object.assign({}, state, { unsubscribeData: action.unsubscribeData });

    case 'GET_YOUTUBE_CHANNELS':
      return Object.assign({}, state, { channels: action.channels });

    case 'USERS_JOINED_TO_CARDS':
      const obj = {
        members: state.cardMembers.members.concat(action.usersJoined.members),
        metadata: action.usersJoined.metadata,
      };
      return Object.assign({}, state, { cardMembers: obj });

    case 'SIGNATURES_TO_CARDS':
      const signaturesObj = {
        signatures: state.cardSignatures.signatures.concat(action.signaturesToCards.signatures),
        metadata: action.signaturesToCards.metadata,
      };
      return Object.assign({}, state, { cardSignatures: signaturesObj });

    case 'CARD_SIGNATURE_DELETE_ERROR':
      return Object.assign({}, state, { error: action.error });

    case 'CARD_SIGNATURE_DELETE_SUCCESS':
      return Object.assign({}, state, { response: action.success });

    case 'BASE_URL':
      return Object.assign({}, state, { BASE_URL: action.BASE_URL });

    case 'UPDATE_URL':
      return Object.assign({}, state, { url: action.url });

    case 'FAILURE':
      return Object.assign({}, state, { failure: action.failure });

    case 'SUCCESS':
      return Object.assign({}, state, { success: action.success });

    default:
      return state;
  }
};

export default reducer;
