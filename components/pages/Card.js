import React from 'react';
import Slider from 'react-slick';
import { Modal, Tabs, Tab, Tooltip, OverlayTrigger } from 'react-bootstrap';
import SweetAlert from 'sweetalert-react';

import Login from './Login';
import Register from './Register';
import genImg from '../../lib';
import { Link} from '../../routes';
import Router from 'next/router'
import ModalSlick from '../ModalSlick';
import UserFollow from '../UserFollow';
import CardHead from '../layouts/CardHead';
import AppNavbar from '../layouts/Navbar';
import HandleError from '../HandleError';
import FooterInnerPage from '../layouts/FooterInnerPage';
import SignatureBoard from '../SignatureBoard';
import CopyToClipboard from 'react-copy-to-clipboard';
import _ from 'lodash';

let Wavesurfer;
let fullURL = '';
const baseTreeSavedRange = 30;
export default class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showImageModal: false,
      showSignatureModal: false,
      showSignModel: false,
      playing: false,
      pos: 0,
      isClient: false,
      iFrameUrl: props.url.query.id && props.cardBoardInfo && props.cardBoardInfo.theme ? `/static/drawing/index.html?chant_id=${props.url.query.id}&theme=${props.cardBoardInfo.theme}` : `/static/drawing/index.html?chant_id=${props.url.query.id}&theme=0`,
      popUpregistration: false,
      alertVisibleSuccess: false,
      alertVisibleForVerifyEmail: false,
      needLoginModel: false,
      needAccountVerifiedModel: false,
      isSignBoardButtonClick: false,
      alreadyAddedSignByLoggedInUser: false,
      redirectToAddSignPage: false,
      navMembers: [],
      searchMemberValue: '',
      showReportSignatureModal: '',
      alertsForReportSignature: '',
      selectedReportSignatureId: '',
      totalTreeSaved: '',
      showGiftModal: false,
      giftModalButtonText: 'Submit',
      giftModalPledgeAmount: undefined,
      needGiftLoginModal: false,
      needReportAbuseLoginModel: false,
      treesSavedCount: '',
      showDonateModal: false,
      showAudioModal: false,
      isPopupAudioPlaying: false,
      selectedAttachmentId: '',
      alertsforAttachmentSignature: '',
      selectedReportObjType: '',
      reportDescription: '',
      reportAbuseModal: false,
      guestName: '',
      signLoginRegisterModal: false,
      donationAwesomeModal: false,
      giftAwesomeModal: false,
      giftContributionModal: false,
      thanksAwesomeModal: false,
      showHowContribute: false,
      showAlreadySubmittedCardModal: false,
      inviteLinkPopupFlag: false,
      showSignatureGridModal: false,
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.openSignBoard = this.openSignBoard.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handlePosChange = this.handlePosChange.bind(this);
    this.popUpAction = this.popUpAction.bind(this);
    this.addSignatureFn = this.addSignatureFn.bind(this);
    this.downloadSignatures = this.downloadSignatures.bind(this);
    this.memberClicked = this.memberClicked.bind(this);
    this.searchMembers = this.searchMembers.bind(this);
    this.searchInputChange = this.searchInputChange.bind(this);
    this.setModalSlick = this.setModalSlick.bind(this);
    this.reportBtnClicked = this.reportBtnClicked.bind(this);
    this.deleteSignature = this.deleteSignature.bind(this);
    this.blockUser = this.blockUser.bind(this);
    this.reportSignature = this.reportSignature.bind(this);
    this.giftPledgeInputChange = this.giftPledgeInputChange.bind(this);
    this.addUpdateGiftContribution = this.addUpdateGiftContribution.bind(this);
    this.loginModalAlert = this.loginModalAlert.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.redirectToDonationLink = this.redirectToDonationLink.bind(this);
    this.handlePopupToggle = this.handlePopupToggle.bind(this);
    this.deleteAttachment = this.deleteAttachment.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleReportAbuseCardModal = this.toggleReportAbuseCardModal.bind(this);
    this.handleSignSubmit = this.handleSignSubmit.bind(this);
    this.webSignButton = this.webSignButton.bind(this);
  }

  componentWillMount() {
    if (this.props.cardSignatures && this.props.cardSignatures.metadata) {
      this.setState({ treesSavedCount: Math.ceil(Number(this.props.cardSignatures.metadata.total) / baseTreeSavedRange) });
    }
  }

  componentDidMount() {
    // eslint-disable-next-line global-require
    Wavesurfer = require('react-wavesurfer').default;
    fullURL = window.location.href.split("?")[0];
    this.setState({ isClient: true });
    if (this.props.isLogin && this.props.url.query.s_id) {
      if (this.props.loggedUser) {
        this.props.actions.checkSignatureAdded(
          this.props.cardInfo.id,
          this.props.loggedUser.id,
          (res) => {
            if (!res.has_signed) {
              this.props.actions.submitUserNameEmail(
              this.props.url.query.id,
              this.props.url.query.s_id,
                {
                  username: this.props.loggedUser.username,
                  email: this.props.loggedUser.email,
                  agreedToTerms: true,
                },
              (response) => {
                if (response.statusCode === 200) {
                  if (this.props.cardInfo && this.props.cardInfo.category === 'youtuber_birthday' && this.props.loggedUser && !this.props.loggedUser.activated) {
                    this.setState({ alertVisibleForVerifyEmail: true });
                    this.checkAwesomeModal();
                  } else {
                    this.setState({ alertVisibleSuccess: true });
                    this.checkAwesomeModal();
                  }
                }
              });
            } else {
              if (this.props.cardInfo && this.props.cardInfo.category === 'youtuber_birthday' && this.props.loggedUser && !this.props.loggedUser.activated) {
                this.setState({ alertVisibleForVerifyEmail: true });
                this.checkAwesomeModal();
              } else {
                this.setState({ alertVisibleSuccess: true });
                this.checkAwesomeModal();
              }
            }
          },
        );
      }
    }
    if (!this.props.isLogin && this.props.url.query.s_id) {
      this.setState({ popUpregistration: true });
    }

    if (this.props.cardMembers && this.props.cardMembers.metadata) {
      this.props.actions.getUsersJoinedCard(
        this.props.cardMembers.metadata.limit,
        this.props.cardMembers.metadata.skip + this.props.cardMembers.metadata.limit,
        this.props.cardInfo.id
      );
    }
  }

  afterChange(current) {
    const totalCards = this.props.cardMembers.metadata.total;
    const loadedCards = this.props.cardMembers.members.length;

    // If total card count is more than currently loaded card count AND
    if (totalCards > loadedCards &&
      ((loadedCards - current) <= this.props.cardMembers.metadata.limit) ) {
      this.props.actions.getUsersJoinedCard(
        this.props.cardMembers.metadata.limit,
        this.props.cardMembers.metadata.skip + this.props.cardMembers.metadata.limit,
        this.props.cardInfo.id
      );
    }
  }

  next(type, smallScreen) {
    if (type === null) {
      this.userSlider.slickNext();
    } else {
      if (smallScreen === 'mobile') {
        this.innerMobileSlider.slickNext();
      } else {
        this.innerSlider.slickNext();
      }
    }
  }

  previous(type, smallScreen) {
    if (type === null) {
      this.userSlider.slickPrev();
    } else {
      if (smallScreen === 'mobile') {
        this.innerMobileSlider.slickPrev();
      } else {
        this.innerSlider.slickPrev();
      }
    }
  }

  loginModalAlert() {
    this.setState({ needLoginModel: true });
  }

  downloadSignatures() {
    this.props.actions.downloadSignatures(this.props.url.query.id);
  }

  close(type) {
    if (type === 'images') {
      this.setState({ showImageModal: false });
    } else if (type === 'signatures') {
      if (window.matchMedia("(min-width: 992px)").matches) {
        this.setState({ showSignatureModal: false, showSignatureGridModal: true });
      } else {
        this.setState({ showSignatureModal: false });
      }
    } else if (type === 'addSign') {
      this.setState({ showSignModel: false });
    } else if (type === 'gift') {
      this.setState({ showGiftModal: false });
    } else if (type === 'donate') {
      this.setState({ showDonateModal: false });
    } else if (type === 'audio') {
      this.setState({ showAudioModal: false });
    } else {
      this.setState({ popUpregistration: false });
    }
  }

  handleToggle() {
    if (this.state.playing) {
      this.setState({ playing: false });
      this.cardView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.setState({ playing: true });
      this.audio.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  handlePopupToggle() {
    if (this.state.isPopupAudioPlaying) {
      this.setState({ isPopupAudioPlaying: false });
      this.cardView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.setState({ isPopupAudioPlaying: true });
      this.audio.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  handlePosChange(e) {
    this.setState({ pos: e.originalArgs[0] });
  }

  filterImageMembers() {
    if (this.props.cardBoardInfo && this.props.cardBoardInfo.members.length > 0) {
      const imageMembers = _.filter(this.props.cardBoardInfo.members, (a) => {
        return _.find(this.props.cardImages.images, (b) => {
          return b.user_id === a.userId;
        });
      });
      return _.orderBy(imageMembers, 'name');
    }
    return [];
  }

  filterSignatureMembers() {
    if (this.props.cardBoardInfo && this.props.cardBoardInfo.members.length > 0) {
      const signatureMembers = _.filter(this.props.cardBoardInfo.members, (a) => {
        return _.find(this.props.cardSignatures.signatures, (b) => {
          return b.user_id === a.userId;
        });
      });
      return _.orderBy(signatureMembers, 'name');
    }
    return [];
  }

  sortGiftMembers() {
    if (this.props.cardBoardInfo && this.props.cardBoardInfo.members.length > 0) {
      const giftMembers = _.orderBy(this.props.cardBoardInfo.members, 'giftAmount', 'desc');
      return giftMembers;
    }
    return [];
  }

  open(type, selectedSignature, isFromSignatureGrid) {
    if (type === 'images' &&
      (this.props.cardImages && this.props.cardImages.metadata.total > 0)) {
      this.setState({ showImageModal: true, showSignatureGridModal: false });

      const imageMembers = this.filterImageMembers();
      this.setState({ navMembers: imageMembers });

      if (this.props.cardImages && this.props.cardImages.images.length > 0) {
        this.setState({ selectedImageUserId: this.props.cardImages.images[0].user_id });
      }
    } else if (type === "signature" && this.props.cardSignatures && this.props.cardSignatures.metadata.total > 0) {
      this.setState({ searchMemberValue: '' });

      const signatureMembers = this.filterSignatureMembers();
      if (selectedSignature) {
        const userSignature = _.find(this.props.cardSignatures.signatures, { image_url: selectedSignature.imageUrl });
        this.setState({ selectedSignatureUserId: userSignature.user_id });
        this.setState({ showSignatureModal: true });
      } else {
        // isFromSignatureGrid added to open grid modal only from outside signature click , not from strip inside card modal
        if (window.matchMedia("(min-width: 992px)").matches && isFromSignatureGrid) {
          this.setState({ showSignatureGridModal: true });
        } else {
          if (this.props.cardSignatures && this.props.cardSignatures.signatures.length > 0) {
            this.setState({ selectedSignatureUserId: this.props.cardSignatures.signatures[0].userId });
          }
          this.setState({ showSignatureModal: true });
        }
      }
      if (this.props.cardBoardInfo && this.props.cardBoardInfo.members.length > 0) {
        this.setState({ navMembers: signatureMembers });
      }
    } else if (type === "gift" && this.props.cardBoardInfo && this.props.cardBoardInfo.gifts.length > 0) {
      this.setState({ showGiftModal: true, showSignatureGridModal: false });
      const giftMembers = this.sortGiftMembers();
      if (this.props.loggedUser) {
        const currUser = _.find(giftMembers, (member) => {
          return member.email === this.props.loggedUser.email;
        });
        if (currUser) {
          this.setState({
            giftModalButtonText: currUser.hasContributedToGift ? 'Update' : 'Submit',
            giftModalPledgeAmount: currUser.hasContributedToGift ? currUser.giftAmount : undefined
          });
        }
      }
      this.setState({
        navMembers: giftMembers,
        giftModalPledgeText: '',
      });
    } else if (type === "donate" && this.props.cardBoardInfo && this.props.cardBoardInfo.gifts.length > 0) {
      this.setState({
        showDonateModal: true,
        showSignatureGridModal: false,
        navMembers: this.props.cardBoardInfo.members,
      });
    } else if (type === "audio") {
      this.setState({
        showAudioModal: true,
        showSignatureGridModal: false,
        isPopupAudioPlaying: true,
        navMembers: [],
      });
    }
  }

  openSignBoard() {
    this.setState({ showSignModel: true });
  }

  popUpAction(response) {
    if (response.activated && response.duplicate_sign) {
      this.setState({ popUpregistration: false, alreadyAddedSignByLoggedInUser: true });
      this.checkAwesomeModal();
    } else if (response.activated && !response.duplicate_sign) {
      this.setState({ popUpregistration: false, alertVisibleSuccess: true });
      this.checkAwesomeModal();
    } else {
      this.setState({ popUpregistration: false, alertVisibleForVerifyEmail: true });
      this.checkAwesomeModal();
    }
  }

  addSignatureFn() {
    this.props.actions.checkSignatureAdded(
      this.props.cardInfo.id,
      this.props.loggedUser.id,
      (res) => {
        if (res.has_signed) {
          this.setState({ alreadyAddedSignByLoggedInUser: true });
          this.checkAwesomeModal();
        } else {
          window.top.location = `/card/${this.props.url.query.id}/signature`;
        }
      },
    );
  }

  signIconClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.props.loggedUser && !this.props.loggedUser.activated) {
      this.setState({ isSignBoardButtonClick: true });
      this.addSignatureFn();
    } else if (this.props.loggedUser && this.props.loggedUser.activated) {
      this.addSignatureFn();
    } else {
      this.setState({ signLoginRegisterModal: true });
    }
  }

  setModalSlick(modalSlick, type, prevIndex, index) {
    if (modalSlick != null) {
      this.setState({ modalSlick });
    }
    if (type === 'signatures') {
      if (index === this.props.cardSignatures.signatures.length - 1) {
        const totalSignatures = this.props.cardSignatures.metadata.total;
        const loadedSignatures = this.props.cardSignatures.signatures.length;

        // If total signature count is more than currently loaded signature count AND
        if (totalSignatures > loadedSignatures &&
          ((loadedSignatures - index) <= this.props.cardSignatures.metadata.limit)) {

          this.props.actions.getCardSignaturesPageWise(
            this.props.cardSignatures.metadata.limit,
            this.props.cardSignatures.metadata.skip + this.props.cardSignatures.metadata.limit,
            this.props.cardInfo.id, (res) => {
              if (res) {
                this.setState({ navMembers: this.filterSignatureMembers()})

                // Added to scroll the member list to active member in mobile view for images
                setTimeout(() => {
                  const memberSliderIndex = _.findIndex(this.state.navMembers, { userId: this.props.cardSignatures.signatures[index].user_id},  )
                  if (window.matchMedia("(min-width: 992px)").matches) {
                    if (this.innerSlider) {
                      this.innerSlider.slickGoTo(memberSliderIndex);
                    }
                  } else if (this.innerMobileSlider) {
                    this.innerMobileSlider.slickGoTo(memberSliderIndex);
                  }
                }, 0);
              }
            }
          );
        }
      }

      if (index > -1) {
        if (index >= 0 && index <= this.props.cardSignatures.signatures.length - 1) {
          this.setState({ selectedSignatureUserId: this.props.cardSignatures.signatures[index].user_id });
          const sliderIndex = _.findIndex(this.state.navMembers, { userId: this.props.cardSignatures.signatures[index].user_id})
          if (window.matchMedia("(min-width: 992px)").matches) {
            if (this.innerSlider) {
              this.innerSlider.slickGoTo(sliderIndex);
            }
          } else if (this.innerMobileSlider) {
            this.innerMobileSlider.slickGoTo(sliderIndex);
          }
        }
      } else {
        if (this.state.selectedSignatureUserId) {
          const userSignatureIndex = _.findIndex(this.props.cardSignatures.signatures, { user_id: this.state.selectedSignatureUserId });

          setTimeout(() => {
            if (this.state.modalSlick != null) {
              this.state.modalSlick.slickGoTo(userSignatureIndex);
            } else if (modalSlick != null) {
              modalSlick.slickGoTo(userSignatureIndex);
            }
          }, 0);
        }
      }
    } else if (type === 'image') {
      if (index <= this.props.cardImages.images.length - 1) {
        this.setState({ selectedImageUserId: this.props.cardImages.images[index].user_id });

        // Added to scroll the member list to active member in mobile view for images
        const imageMemberSliderIndex = this.state.navMembers.map((a) => {
          return a.userId;
        }).indexOf(this.props.cardImages.images[index].user_id);


        if (window.matchMedia("(min-width: 992px)").matches) {
          if (this.innerSlider) {
            this.innerSlider.slickGoTo(imageMemberSliderIndex);
          }
        } else if (this.innerMobileSlider) {
          this.innerMobileSlider.slickGoTo(imageMemberSliderIndex);
        }
      }
    }
  }


  memberClicked(d, type) {
    if (type === 'signatures') {
      const userSignatureIndex = _.findIndex(this.props.cardSignatures.signatures, { user_id: d.userId });
      if (this.state.modalSlick != null) {
        this.state.modalSlick.slickGoTo(userSignatureIndex);
      }
    } else if (type === 'images') {
      const userImageIndex = _.findIndex(this.props.cardImages.images, { user_id: d.userId });
      if (this.state.modalSlick != null) {
        this.state.modalSlick.slickGoTo(userImageIndex);
      }
    }
  }

  setInitialFilterMembers() {
    let members = [];
    if (this.state.showSignatureModal) {
      members = this.filterSignatureMembers();
    } else if (this.state.showImageModal) {
      members = this.filterImageMembers();
    } else if (this.state.showGiftModal) {
      members = this.sortGiftMembers();
    } else if (this.state.showDonateModal) {
      members = this.props.cardBoardInfo.members;
    }
    return members;
  }

  setMembersType() {
    let type;
    if (this.state.showSignatureModal) {
      type = 'signatures';
    } else if (this.state.showImageModal) {
      type = 'images';
    } else if (this.state.showGiftModal) {
      type = 'gift';
    } else if (this.state.showDonateModal) {
      type = 'donate';
    } else if (this.state.showAudioModal) {
      type = 'audio';
    }
    return type;
  }

  giftPledgeInputChange(event) {
    this.setState({ giftModalPledgeAmount: event.target.value });
  }

  giftContributionPledgeInputChange(event) {
    this.setState({ giftContributionModalPledgeAmount: event.target.value });
  }

  showGiftContribeSuccess() {
    this.setState({ showGiftContribeSuccess: true });
    setTimeout(() => {
      this.setState({ showGiftContribeSuccess: false });
    }, 5000);
  }

  showDonationInvalidURL() {
    this.setState({ showDonateInvalidUrl: true });
    setTimeout(() => {
      this.setState({ showDonateInvalidUrl: false });
    }, 5000);
  }

  showLinkCopied() {
    this.setState({ isLinkCopied: true });
    setTimeout(() => {
      this.setState({ isLinkCopied: false });
    }, 5000);
  }

  submitGiftContribution() {
    let giftId;

    if (this.props.cardBoardInfo && this.props.cardBoardInfo.gifts.length > 0) {
      giftId = this.props.cardBoardInfo.gifts[0].id;
    }
    const amount = {
      amount: this.state.giftContributionModalPledgeAmount,
    };
    if (giftId && amount) {
      this.props.actions.addGiftContribution(giftId, amount, (res) => {
        if (res) {
          this.setState({
            giftContributionModal: false,
            thanksAwesomeModal: 'true'
          });
          const cardId = this.props.cardBoardInfo.page.board;
          this.props.actions.getUpdatedCardInfo(cardId);
        }
      });
    }
  }

  addUpdateGiftContribution(type) {
    if (this.props.isLogin) {
      let giftId;


      if (this.props.cardBoardInfo && this.props.cardBoardInfo.isSubmited) {
        this.setState({
          showAlreadySubmittedCardModal: true,
          showGiftModal: false
        });
      } else {
        if (this.props.cardBoardInfo && this.props.cardBoardInfo.gifts.length > 0) {
          giftId = this.props.cardBoardInfo.gifts[0].id;
        }
        const amount = {
          amount: this.state.giftModalPledgeAmount,
        };
        if (giftId && amount) {
          if (type === 'submit') {
            this.props.actions.addGiftContribution(giftId, amount, (res) => {
              if (res) {
                this.setState({ giftModalButtonText: 'Update' });
                const cardId = this.props.cardBoardInfo.page.board;
                this.props.actions.getUpdatedCardInfo(cardId, () => {
                  this.setState({
                    navMembers: this.sortGiftMembers(),
                    showHowContribute: true
                  });
                  this.showGiftContribeSuccess();
                });
              }
            });
          } else if (type === 'update') {
            this.props.actions.editGiftContribution(giftId, amount, (res) => {
              if (res) {
                const cardId = this.props.cardBoardInfo.page.board;
                this.props.actions.getUpdatedCardInfo(cardId, () => {
                  this.setState({
                    navMembers: this.sortGiftMembers(),
                    showHowContribute: true
                  });
                  this.showGiftContribeSuccess();
                });
              }
            });
          }
        }
      }
    } else {
      this.setState({ needGiftLoginModal: true });
    }
  }

  searchInputChange(event) {
    this.setState({ searchMemberValue: event.target.value });
  }

  searchMembers() {
    let user;
    const searchUser = this.state.searchMemberValue;
    const members = this.setInitialFilterMembers();
    if (searchUser) {
      user = _.filter(members, (ur) => {
        return ur.name.toLowerCase().indexOf(searchUser.toLowerCase()) > -1;
      });
      this.setState({ navMembers: user });
    } else {
      this.setState({ navMembers: members });
    }
  }

  setModalToOpen(type) {
    this.setState({ searchMemberValue: '' });
    if (type === 'images') {
      this.close('signatures');
      this.close('gift');
      this.close('donate');
      this.close('audio');
      this.open('images');
    } else if (type === 'signature') {
      this.close('images');
      this.close('gift');
      this.close('donate');
      this.close('audio');
      this.open('signature');
    } else if (type === 'audio') {
      this.close('images');
      this.close('signatures');
      this.close('gift');
      this.close('donate');
      this.open('audio');
    } else if (type === 'gift') {
      this.close('images');
      this.close('audio');
      this.close('signatures');
      this.close('donate');
      this.open('gift');
    } else if (type === 'donate') {
      this.close('images');
      this.close('signatures');
      this.close('gift');
      this.close('audio');
      this.open('donate');
    }
  }

  checkAwesomeModal() {
    if (this.props.cardBoardInfo && this.props.cardBoardInfo.gifts.length > 0 &&
      this.props.cardBoardInfo.gifts[0].cardType === 'typeGiftDonation') {
      this.setState({ donationAwesomeModal: true });
    } else if (this.props.cardBoardInfo && this.props.cardBoardInfo.gifts.length > 0 &&
      (this.props.cardBoardInfo.gifts[0].cardType === 'typeGiftCard' ||
      this.props.cardBoardInfo.gifts[0].cardType === 'typeGift')) {
      this.setState({ giftAwesomeModal: true });
    } else {
      this.setState({ thanksAwesomeModal: true });
    }
  }

  reportBtnClicked(selectedObj, type) {
    if (type === 'signature') {
      this.setState({
        selectedReportObjType: type,
        selectedReportSignatureId: selectedObj.id
      });
      if (this.props.loggedUser && this.props.loggedUser.id === this.props.cardBoardInfo.ownedBy) {
        this.setState({ showReportSignatureModal: 'creator' });
      } else {
        this.setState({ showReportSignatureModal: 'visitor' });
      }
    }
    if (type === 'image') {
      this.setState({ selectedReportObjType: type });
      if (selectedObj && selectedObj.hasOwnProperty('signature_id')) {
        this.setState({
          selectedReportSignatureId: selectedObj.signature_id,
          selectedAttachmentId: selectedObj.id,
          selectedReportImageObj: selectedObj
        });
        if (this.props.loggedUser && this.props.loggedUser.id === this.props.cardBoardInfo.ownedBy) {
          this.setState({ showReportAttachmentModal: 'creator' });
        } else {
          this.setState({ showReportAttachmentModal: 'visitor' });
        }
      } else if (selectedObj && selectedObj.hasOwnProperty('card_id')) {
        this.setState({
          showReportAttachmentModal: 'visitor',
          selectedReportImageObj: selectedObj
        });
      }
    }
  }
  reportSignature() {
    this.setState({
      showReportSignatureModal: '',
      showReportAttachmentModal: ''
    });
    // To report abuse the card if the attachment belong to the creator, or if it is an image
    if (this.state.selectedReportObjType === 'image') {
      if ((this.state.selectedReportImageObj.user_id === this.props.cardBoardInfo.ownedBy)
        || this.state.selectedReportImageObj.hasOwnProperty('card_id')) {
        const url = `mailto:abuse@wishyoo.com?subject=WishYoo - Report Abuse. ID: ${this.props.cardInfo.id}&body=${encodeURIComponent(`WishYoo Title : ${this.props.cardInfo.title}\n\nPlease describe the nature of the abusive material on this Wishyoo Card:`)}`;
        window.location.href = url;
      } else {
        this.reportSignatureAction();
      }
    } else {
      this.reportSignatureAction();
    }
  }

  reportSignatureAction() {
    this.props.actions.reportSignature(this.state.selectedReportSignatureId, (res) => {
      if (res.status) {
        this.setState({
          alertsForReportSignature: 'report',
          alertMsgForReport: 'Signature has been reported !!!'
        });
        setTimeout(() => {
          this.setState({ alertsForReportSignature: '' });
        }, 5000);
      } else if (res.error) {
        this.setState({
          alertsForReportSignature: 'report',
          alertMsgForReport: res.error
        });
        setTimeout(() => {
          this.setState({ alertsForReportSignature: '' });
        }, 5000);
      }
    });
  }

  deleteSignature() {
    this.props.actions.deleteSignature(this.state.selectedReportSignatureId, () => {
      this.setState({
        showReportSignatureModal: '',
        alertsForReportSignature: 'delete'
      });
      setTimeout(() => {
        window.location = `/card/${this.props.url.query.id}`;
      }, 5000);
    });
  }

  deleteAttachment() {
    this.props.actions.deleteAttachment(this.state.selectedAttachmentId, () => {
      this.setState({
        showReportAttachmentModal: '',
        alertsforAttachmentSignature: 'delete'
      });
      setTimeout(() => {
        window.location = `/card/${this.props.url.query.id}`;
      }, 5000);
    });
  }

  blockUser() {
    this.props.actions.blockUser(this.state.selectedReportSignatureId, (res) => {
      if (res) {
        this.setState({
          showReportSignatureModal: '',
          showReportAttachmentModal: '',
          alertsForReportSignature: 'block'
        });
        setTimeout(() => {
          window.location = `/card/${this.props.url.query.id}`;
        }, 5000);
      }
    });
  }

  showGiftMenuStrip() {
    return (this.props.cardBoardInfo && this.props.cardBoardInfo.gifts.length > 0 &&
    (this.props.cardBoardInfo.gifts[0].cardType === 'typeGiftCard' ||
    this.props.cardBoardInfo.gifts[0].cardType === 'typeGift'));
  }

  showDonateMenuStrip() {
    return (this.props.cardBoardInfo && this.props.cardBoardInfo.gifts.length > 0 &&
    this.props.cardBoardInfo.gifts[0].cardType === 'typeGiftDonation');
  }

  redirectToDonationLink() {
    const donateLinK = this.props.cardBoardInfo.gifts[0].payLink;
    const valid = this.isDonationUrlValid(donateLinK);
    if (valid) {
      if (donateLinK.indexOf('http') < 0) {
        window.open("http://" + donateLinK, '_blank');
      } else {
        window.open(donateLinK, '_blank');
      }
      if (this.state.showDonateModal) {
        this.close('donate');
      } else {
        this.setState({ donationAwesomeModal: false });
      }
    } else {
      this.showDonationInvalidURL();
    }
  }

  redirectToMusicLink(type) {
    if (type === "spotify") {
      window.open("https://open.spotify.com/album/4XE0rnDhOQejKOUeDu6n4V", '_blank');
    } else if (type === "google") {
      window.open("https://play.google.com/store/music/album?id=Bpepambynhk7qfmzhhuyjhnhdme&tid=song-Txh6a7vgfwolzebuyu3wgeeb5aa", '_blank');
    } else if (type === "deezer") {
      window.open("http://www.deezer.com/soon", '_blank');
    } else if (type === "itunes") {
      window.open("https://itunes.apple.com/us/album/luna-llena-single/id1277887345?app=itunes&ign-mpt=uo%3D4", '_blank');
    } else if (type === "music") {
      window.open("https://www.amazon.com/Luna-Llena/dp/B0758KRZR9?tag=univemusic0c-20&ie=UTF8&linkCode=as2&ascsubtag=97ac41a77801feb4ed51ec082cc904e4", '_blank');
    }
  }

  isDonationUrlValid(donateLinK) {
    if (donateLinK) {
      const res = donateLinK.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      if (res == null) {
        return false;
      }
      return true;
    }
    return false;
  }

  toggleReportAbuseCardModal() {
    if (this.state.reportAbuseModal) {
      this.setState({ reportAbuseModal: false });
    } else {
      this.setState({ reportAbuseModal: true });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.actions.reportAbuseCard(
      this.props.cardInfo.id,
      this.state.reportDescription,
      (err, resp) => {
        this.setState({ reportAbuseModal: false });
    })
  }

  handleChange(event) {
    if (event.target['id'] === 'guest-name') {
      this.setState({ guestName: event.target.value });
    } else {
      this.setState({ reportDescription: event.target.value });
    }
  }

  handleSignSubmit(event) {
    event.preventDefault();
    this.props.actions.createPhantomUser(this.state.guestName, this.props.url.query.id);
  }

  webSignButton() {
    if (this.props.isLogin) {
      window.top.location = `/card/${this.props.url.query.id}/signature`;
      this.setState({ signLoginRegisterModal: false });
    } else {
      this.setState({
        signLoginRegisterModal: true,
        redirectToAddSignPage: false,
      });
    }
  }

  subscribeYoutube() {
    const subscribeLink = this.props.cardInfo.channel_url && this.props.cardInfo.channel_url;
    if (subscribeLink) {
      window.open(subscribeLink, '_blank');
    }
  }

  gridSignatureClicked(signature) {
    this.setState({ showSignatureGridModal: false, showSignatureModal: true });
    const userSignatureIndex = _.findIndex(this.props.cardSignatures.signatures, { user_id: signature.user_id });

    setTimeout(() => {
      if (this.state.modalSlick != null) {
        this.state.modalSlick.slickGoTo(userSignatureIndex);
      }
    }, 0);
  }

  awesomeModalGiftContribution() {
    this.setState({
      giftAwesomeModal: false,
      giftContributionModal: true
    });
  }

  render() {
    const cardBoardInfoGifts = this.props.cardBoardInfo && this.props.cardBoardInfo.gifts.length > 0 &&
                                this.props.cardBoardInfo.gifts[0];

    const cardOwnerName = () => {
      if (this.props.cardOwner && this.props.loggedUser) {
        if (this.props.loggedUser.id === this.props.cardOwner.id) {
          return (
            <Link href="/profile"><a>@{_.truncate(this.props.cardOwner.username, {'length': 9, 'omission': '...' })}</a></Link>
          );
        }
        return (
          <div className="name-content">
            <Link
              route="profile"
              params={{ id: this.props.cardOwner.id }}
            >
              <a><span>@{_.truncate(this.props.cardOwner.username, {'length': 9, 'omission': '...' })}</span></a>
            </Link>
          </div>
        );
      }
      return false;
    };

    const cardCoverImage = () => {
      if (this.props.cardInfo) {
        let cardCover = this.props.cardInfo.image_url;
        if (!cardCover) {
          const category = _.find(this.props.cardsCategories, (b) => {
            return b.name === this.props.cardInfo.category;
          });
          cardCover = category.icon_url;
        }
        return (
          genImg(cardCover, 'cardCover')
        );
      }
      return false;
    };

    const cardSignaturesBoard = () => {
      if (this.props.cardBoardInfo) {
        return (
          <SignatureBoard data={this.props.cardBoardInfo} clickSignature={this.open} cardId={this.props.cardInfo.id} {...this.props} />
        );
      }
      return (
        <div>
          <img src="/static/images/wishyoo_logo.png" height="100px" alt="wishyoo logo" />
          <h4>this card has no signature board yet</h4>
        </div>
      );
    };

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 9,
      slidesToScroll: 9,
      swipe: true,
      arrows: false,
      responsive: [
        { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 4 } },
        { breakpoint: 992, settings: { slidesToShow: 5, slidesToScroll: 5 } },
        { breakpoint: 1200, settings: { slidesToShow: 7, slidesToScroll: 7 } },
      ],
    };

    const mobileSettings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 9,
      slidesToScroll: 9,
      swipe: true,
      arrows: false,
      responsive: [
        { breakpoint: 400, settings: { slidesToShow: 2, slidesToScroll: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 3, slidesToScroll: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 4, slidesToScroll: 4 } },
        { breakpoint: 992, settings: { slidesToShow: 5, slidesToScroll: 5 } },
        { breakpoint: 1200, settings: { slidesToShow: 7, slidesToScroll: 7 } },
        { breakpoint: 1200, settings: { slidesToShow: 7, slidesToScroll: 7 } },
        { breakpoint: 1360, settings: { slidesToShow: 7, slidesToScroll: 7 } },
      ],
    };

    const sliderMemberUI = (member, list, type) => {
      if (member.userId) {
        let selectUser;
        if (type === 'signatures') {
          selectUser = this.state.selectedSignatureUserId;
          if (!selectUser) {
            selectUser = this.props.cardSignatures.signatures[0].user_id;
          }
        } else if (type === 'images') {
          selectUser = this.state.selectedImageUserId;
        }
        list.push(
          <div className="people "
               style={{ marginTop: type !== null ? "15px" : "0px" }}
               key={member.userId + Math.random()} onClick={() => { this.memberClicked(member, type); }}>
            {member.hasJoinedVoice === 1 ?
              <div className="sound text-left">
               {
                this.props.isLogin ?
                  this.props.loggedUser && this.props.loggedUser.activated
                     && type === null ?
                  <Link route="profile" params={{ id: member.userId }} >
                    <button className="btn-style orange">
                      <i className="fa fa-microphone fa-2x" aria-hidden="true" />
                    </button>
                  </Link>
                  :
                    <button
                      className="btn-style orange"
                      onClick={() => { type === null &&
                        this.setState({
                          needAccountVerifiedModel: true,
                          isSignBoardButtonClick: false,
                        });
                      }}
                    >
                      <i className="fa fa-microphone fa-2x" aria-hidden="true" />
                    </button>
                  :
                  <button
                    className="btn-style orange"
                    onClick={() => { type === null && this.setState({ needLoginModel: true }); }}
                  >
                    <i className="fa fa-microphone fa-2x" aria-hidden="true" />
                  </button>
                }
              </div> : undefined
            }
            {
              this.props.isLogin ?
                this.props.loggedUser && this.props.loggedUser.activated
                && (type === null) ?
                  <Link route="profile" params={{ id: member.userId }} >
                    <a>
                      {genImg(member.image, 'profileImg', 'card_joined_user_style')}
                    </a>
                  </Link> :
                    <button
                      className="btn-name"
                      onClick={() => { type === null &&
                        this.setState({
                          needAccountVerifiedModel: true,
                          isSignBoardButtonClick: false,
                        });
                      }}
                    >
                      {genImg(member.image, 'profileImg', 'card_joined_user_style')}
                    </button>
                :
                <button
                  className="btn-name"
                  onClick={() => { type === null && this.setState({ needLoginModel: true });}}
                >
                  {genImg(member.image, 'profileImg', 'card_joined_user_style')}
                </button>
            }
            {
              this.props.isLogin ?
                <span>
                  {
                    this.props.loggedUser && this.props.loggedUser.activated
                    && (type === null) ?
                      <Link route="profile" params={{ id: member.userId }}>
                        <a>@{_.truncate(member.name, {'length': 9, 'omission': '...' })}</a>
                      </Link> :
                      <button
                        className={"btn-name " + (selectUser === member.userId ? 'joinedPeopleActive' : '')}
                        onClick={() => { type === null &&
                          this.setState({
                            needAccountVerifiedModel: true,
                            isSignBoardButtonClick: false,
                          });
                        }}
                      >
                        @{_.truncate(member.name, {'length': 9, 'omission': '...' })}
                      </button>
                  }
                </span> :
                <button
                  className={"btn-name " + (selectUser === member.userId ? 'joinedPeopleActive' : '')}
                  onClick={() => {
                    type === null && this.setState({ needLoginModel: true }); }}
                >
                  @{_.truncate(member.name, {'length': 9, 'omission': '...' })}
                </button>
            }
          </div>
        );
        return list;
      }
      return [];
    };

    const createSlider = (list, type, smallScreen, isPopUpModal) => {
      const sliderSettings = type !== null ? mobileSettings : settings;
      sliderSettings.afterChange = !isPopUpModal ? sliderSettings.afterChange = this.afterChange.bind(this) : undefined;
      if (list.length > 0) {
        return (
          <section className="joined-people">
            <div className={type !== null ? "" : "container "} style={{ position: 'relative' }} >
              <div>
                <button type="button" className="slick-btn left" onClick={() => { this.previous(type, smallScreen); }}>
                  <img src="/static/images/carousel/arrow_left_for_carousel.png" height="50" alt="arrow-left" />
                </button>
                <div className="slickStyle users-joined-slick">
                  <Slider ref={(c) => { type === null ? this.userSlider = c : (smallScreen === 'mobile' ? this.innerMobileSlider = c : this.innerSlider = c); }} {...sliderSettings}>
                    {list}
                  </Slider>
                </div>
                <button type="button" className="slick-btn right" onClick={() => { this.next(type, smallScreen); }}>
                  <img src="/static/images/carousel/arrow_right_for_carousel.png" height="50" alt="arrow-right" />
                </button>
                {this.props.isLoadingCards === false ? '' :
                <div
                  className="textcenter"
                  style={{
                    top: '0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    zIndex: '300000',
                    width: '100%',
                  }}
                >
                  <img src="/static/images/loader-red-1.gif" height="100" alt="loading cards" />
                </div>
                }
              </div>
            </div>
          </section>
        );
      }
      return (
        <section className="joined-people">
          <div
            className="container text-center"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: type === null ? '128px' : '100px' }}>
            <div>No friends have joined your wishyoo card yet ..</div>
          </div>
        </section>
      );
    };

    const joinedSignatureUsers = (type, smallScreen, isPopUpModal) => {
      if (this.state.navMembers && this.state.navMembers.length > 0) {
        const list = [];
        this.state.navMembers.forEach((member) => {
          sliderMemberUI(member, list, type);
        });
        return createSlider(list, type, smallScreen, isPopUpModal);
      }

      return (
        <section className="joined-people">
          <div
            className="container text-center"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px', width: '100%' }}>
            <div className="no-found">Oops! No Users Found</div>
          </div>
        </section>
      );
    };

    const joinedUsers = () => {
      if (this.props.cardMembers && this.props.cardMembers.members.length > 0) {
        const list = [];
        this.props.cardMembers.members.forEach((member) => {
          sliderMemberUI(member, list, null);
        });
        return createSlider(list, null);
      }
      return (
        <section className="joined-people">
          <div className="container text-center" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '128px' }}>
            <div>No friends have joined your wishyoo card yet ..</div>
          </div>
        </section>
      );
    };

    const showGiftIcon = (member) => {
      if (member.hasContributedToGift) {
        if (this.props.loggedUser && (this.props.loggedUser.id === this.props.cardOwner.id)) {
          return (
            <div className="giftAmount">
              <div>${member.giftAmount}</div>
            </div>
          );
        } else {
          return (
            <div className="pull-right">
              <img src="/static/images/gift_green.png" height="40px" alt="gift" />
            </div>
          );
        }
      } else {
        return (
          <div className="pull-right">
            <img src="/static/images/gift_gray.png" height="40px" alt="gift" />
          </div>
        );
      }
    };

    const share = (type, title, imageUrl, sharedFrom) => {
      console.log("imageUrl", imageUrl);
      const w = 580;
      const h = 470;

      let sURL = '';
      const url = window.location.href;
      let baseUrl = window.location.href.split('/card/')[0];
      if (type === 'facebook' && !imageUrl && sharedFrom === 'header') {
        const category = _.find(this.props.cardsCategories, (b) => {
          return b.name === this.props.cardInfo.category;
        });
        imageUrl = category.icon_url;
      } else if ((type === 'facebook' || type === 'google+') && imageUrl && sharedFrom === 'modal') {
        imageUrl = imageUrl;
      } else {
        imageUrl = undefined;
      }

      if (type === 'email') {
        sURL = `mailto:?subject=WishYooCard&amp;body=${url}`;
        window.location.href = sURL;
      } else if (type === 'facebook') {
        if (sharedFrom === 'header') {
          if (imageUrl) {
            sURL = `https://www.facebook.com/sharer/sharer.php?u=${url}&picture=${imageUrl}`;
          } else {
            sURL = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          }
        } else {
          if (imageUrl) {
            baseUrl =  baseUrl + imageUrl;
            sURL = `https://www.facebook.com/sharer/sharer.php?u=${baseUrl}`;
          }
        }

      } else if (type === 'twitter') {
        sURL = `https://twitter.com/intent/tweet?text=You've got to check this awesome card. ${url}`;
      } else {
        if (sharedFrom === "header") {
          sURL = `https://plus.google.com/share?url=${url}`;
        } else {
          baseUrl =  baseUrl + imageUrl;
          sURL = `https://plus.google.com/share?url=${baseUrl}`;
        }
      }

      if (type !== 'email') {
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        const width = window.innerWidth ?
          window.innerWidth : document.documentElement.clientWidth ?
          document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ?
          window.innerHeight :
          document.documentElement.clientHeight ?
            document.documentElement.clientHeight : screen.height;

        const left = ((width / 2) - (w / 2)) + dualScreenLeft;
        const top = ((height / 3) - (h / 3)) + dualScreenTop;

        const newWindow = window.open(sURL, title, `scrollbars=yes,width=${w},height=${h},top=${top},left=${left}`);

        // Puts focus on the newWindow
        if (newWindow && newWindow.focus) {
          newWindow.focus();
        }
      }
    };

    const modalSlick = (type) => {
      if (type === 'images' &&
        (this.props.cardImages &&
          this.props.actions.getCardImages &&
          this.props.cardInfo)) {
        return (
          <ModalSlick
            data={this.props.cardImages}
            actions={this.props.actions.getCardImages}
            cardId={this.props.cardInfo.id}
            type="image"
            modalSlick={this.setModalSlick}
            report={this.reportBtnClicked}
            loginModalAlert={this.loginModalAlert}
            isLogin={this.props.isLogin}
          />
        );
      } else if (this.props.cardSignatures &&
          this.props.cardInfo) {
        return (
          <ModalSlick
            data={this.props.cardSignatures}
            isPrivateChantCard={this.props.cardInfo.isPrivateChantCard}
            cardId={this.props.cardInfo.id}
            type="signatures"
            modalSlick={this.setModalSlick}
            report={this.reportBtnClicked}
            share={share}
            loginModalAlert={this.loginModalAlert}
            isLogin={this.props.isLogin}
          />
        );
      }
      return false;
    };

    const memberList = (type) => {
      if (this.state.navMembers && this.state.navMembers.length > 0 && (this.props.cardSignatures || this.props.cardImages)) {
        const list = [];
        let selectUser = '';
        if (type === 'signatures') {
          selectUser = this.state.selectedSignatureUserId;
          if (!selectUser) {
            selectUser = this.props.cardSignatures.signatures[0].user_id;
          }
        } else if (type === 'images') {
          selectUser = this.state.selectedImageUserId;
        }
        this.state.navMembers.forEach((member) => {
          if (member.userId) {
            list.push(
              <div>
                <li id={member.userId} className={selectUser === member.userId ? 'active' : ''} onClick={() => { this.memberClicked(member, type); }}>
                  <div style={{ display: "inline" }}>
                    <div style={{ display: "inline" }}>
                      {genImg(member.image, 'profileImg', 'memberListImg')}
                      {_.truncate(member.name, {'length': 9, 'omission': '...' })}
                    </div>
                    { this.state.showGiftModal ? showGiftIcon(member) : '' }
                  </div>
                </li>
              </div>
            );
          }
        });
        // Added to scroll the member list
        if (this.signatureUserListModelUL) {
          this.signatureUserListModelUL.scrollTop = document.getElementById(selectUser) && document.getElementById(selectUser).offsetTop - 50;
        }
        return list;
      }
      return null;
    };

    const audioConfiguration = {
      waveColor: '#999',
      progressColor: 'coral',
      cursorColor: '#FF8A15',
      barWidth: 2,
      hideScrollbar: false,
      autoCenter: true,
      cursorWidth: 1,
      backend: 'MediaElement',
    };

   /* const CardAudio = () => {
      return (
        <div className={this.state.playing ? 'showAudio' : 'hideAudio'}>
          <div className="container">
            <Wavesurfer audioFile={genImg(this.props.cardInfo.mix_url, 'audio')} playing={this.state.playing} pos={this.state.pos} onPosChange={this.handlePosChange} options={audioConfiguration} />
          </div>
        </div>
      );
    };*/

    const CardPopupAudio = () => {
      return (
        <div className="audioContainer">
          <Wavesurfer
            audioFile={genImg(this.props.cardInfo.mix_url, 'audio')}
            playing={this.state.isPopupAudioPlaying} pos={this.state.pos}
            onPosChange={this.handlePosChange} options={audioConfiguration} />
        </div>
      );
    };

    const createGiftModal = () => {
      const giftWrapper = {
        border: 'none',
        borderRadius: 'none'
      }

      if (cardBoardInfoGifts.cardType === 'typeGiftCard') {
        return (
          <div>
            <div className="giftImageContainer" style={!cardBoardInfoGifts.photoUrl && cardBoardInfoGifts.provider && cardBoardInfoGifts.provider.toLowerCase().indexOf('amazon') !== -1 ? giftWrapper : undefined}>
              { cardBoardInfoGifts.photoUrl ?
                <img src={cardBoardInfoGifts.photoUrl} alt="wishyoo logo" />
                :
                undefined
              }
              {
                !cardBoardInfoGifts.photoUrl && cardBoardInfoGifts.provider && cardBoardInfoGifts.provider.toLowerCase().indexOf('amazon') !== -1 ?
                  <img src="https://s3-us-west-2.amazonaws.com/chantr-template-files/g/amazon_gift_card.jpg" alt="wishyoo logo" />
                :
                  undefined
              }
              {
                !cardBoardInfoGifts.photoUrl && !cardBoardInfoGifts.provider && cardBoardInfoGifts.provider.toLowerCase().indexOf('amazon') === -1?
                  <img className="photoImage" src="/static/images/wishyoo_logo.png" alt="wishyoo logo" />
                :
                undefined
              }
            </div>
          </div>);
      } else if (cardBoardInfoGifts.cardType === 'typeGift') {
        return(
          <div className="stuff-gift-wrapper">
            <div className="stuffGiftImageContainer">
                <img className="bowImage" src="/static/images/bow-01.png" alt="stuff gift" />
                { cardBoardInfoGifts.photoUrl ?
                  <img className="photoImage" src={cardBoardInfoGifts.photoUrl} alt="wishyoo logo" />
                  :
                  <img className="photoImage" src="/static/images/wishyoo_logo.png" alt="wishyoo logo" />
                }
              </div>
          </div>
        );
      }
    }

    const giftContribution = () => {
      return (
        <div className="chipinIcon">
          <div>
            { Number(cardBoardInfoGifts.amountContributions) === 0 &&
            <span className="m-r-5">Nobody contributed yet</span>
            }
            { Number(cardBoardInfoGifts.amountContributions) === 1 &&
            <span className="m-r-5">One person contributed</span>
            }
            { Number(cardBoardInfoGifts.amountContributions) > 1 &&
            <span>
              <span className="m-r-5">{cardBoardInfoGifts.amountContributions}</span>
              <span className="m-r-5">people contributed</span>
              </span>
            }
            { Number(cardBoardInfoGifts.amountContributions) >= 1 &&
            <span>{cardBoardInfoGifts.symbol}{cardBoardInfoGifts.amountCurrent}</span>
            }
          </div>
          <img src="/static/images/chipin_orange.png" alt="wishyoo logo" />
        </div>
      );
    }

    const isAddSignatureButtonClick = () => {
      if (this.props.loggedUser && !this.props.loggedUser.activated) {
        return (
          <button
            className="action text-center"
            onClick={() => {
              this.setState({ needAccountVerifiedModel: true, isSignBoardButtonClick: true });
            }}
          >
            <i className="fa fa-pencil-square-o" aria-hidden="true" />
            <br />Sign<br />Board
          </button>
        );
      } else if (this.props.loggedUser && this.props.loggedUser.activated) {
        return (
          <button
            className="action text-center"
            onClick={this.addSignatureFn}
          >
            <i className="fa fa-pencil-square-o" aria-hidden="true" />
            <br />Sign<br />Board
          </button>
        );
      } else {
        return (
          <button
            className="action text-center"
            onClick={() => {
              this.setState({ redirectToAddSignPage: true });
            }}
          >
            <i className="fa fa-pencil-square-o" aria-hidden="true" />
            <br />Sign<br />Board
          </button>
        );
      }
    };

    const signatureGridList = this.props.cardSignatures.signatures.map((signature, index) => {
      if (index <= 20) {
        return (
          <div key={signature.image_url + Math.random()} className="col-sm-3 gridSignature" onClick={() => { this.gridSignatureClicked(signature); }}>
            <div className={"signatureContainer" + signature.id} style={{ height: '100%', width: '100%' }}>
              <img src={signature.image_url} alt={`signature - ${signature.id}`}
                   style={{ height: '100%', width: '100%' }} />
              <div>{_.truncate(signature.owner_name, {'length': 12, 'omission': '...' })}</div>
            </div>
          </div>
        );
      }
    });


    const tooltip = (
      <Tooltip id="tooltip">This is a { this.props.cardInfo && this.props.cardInfo.isPrivateChantCard ? <strong>Private</strong> : <strong>Public</strong>} Wishyoo card</Tooltip>
    );
    return (
      <div ref={(c) => { this.cardView = c; }}>
        <CardHead {...this.props} />
        <AppNavbar {...this.props} />
        {
          (this.props.success || this.props.failure) && !this.props.url.query.s_id ?
            <div style={{ marginBottom: '-64px' }}>
              <HandleError {...this.props} />
            </div> : null
        }
        <div className="bk-flower">
          <section className="card-header">
            <div className="container">
              <div className="card-info-wrapper">
                <div className="type-wrapper">
                  <div>
                    <div className="type-text">
                      <p style={{ fontSize: 'small', color: 'darkgray', lineHeight: '1'}}>
                        <strong>This WishYOO is</strong>
                      </p>
                    </div>
                    {this.props.cardInfo && this.props.cardInfo.isPrivateChantCard ?
                      <div className="type-badge">
                        <button className="badge private-badge">
                          Private
                        </button>
                      </div>
                      :
                      <div className="type-badge">
                        <button className="badge public-badge">
                          Public
                        </button>
                      </div>
                    }
                  </div>
                </div>
                <div className="card-info">
                  <div className="card-name">
                    <span className="card-title">{this.props.cardInfo ? this.props.cardInfo.title : ''}</span>
                  </div>
                  <div>
                    <ul className="sharing">
                      <li>{this.props.cardInfo ? this.props.cardInfo.num_likes : ''} likes</li>
                      <li>&nbsp;&nbsp;/&nbsp;&nbsp;</li>
                      <li>{this.props.cardInfo ? this.props.cardInfo.num_joins : ''} joins</li>
                      <li>&nbsp;&nbsp;/&nbsp;&nbsp;</li>
                      <li><strong>Share : </strong></li>
                      <li className="icon facebook">
                        <button onClick={() => { share('facebook', 'facebook', this.props.cardInfo.image_url, 'header'); }}>
                          <i className="fa fa-facebook-square" aria-hidden="true" />
                        </button>
                      </li>
                      <li className="icon twitter">
                        <button onClick={() => { share('twitter', 'twitter', null, 'header'); }}>
                          <i className="fa fa-twitter-square" aria-hidden="true" />
                        </button>
                      </li>
                      <li className="icon google">
                        <button onClick={() => { share('google+', 'google+', null, 'header'); }}>
                          <i className="fa fa-google-plus-square" aria-hidden="true" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="user-profile">
                  <div>
                    <div className="follow-like">
                      <div className="card-owner">
                        <span>By</span>
                        {this.props.cardOwner ? <div>{genImg(this.props.cardOwner.image, 'profileImg', 'card-owner')}</div> : ''}
                        {
                          this.props.isLogin ?
                            <div className="name-follow-wrapper">
                              {
                                this.props.loggedUser && this.props.loggedUser.activated ?
                                  <div className="name-wrap">
                                    {cardOwnerName()}
                                    <UserFollow
                                      user={this.props.cardOwner}
                                      actions={this.props.actions}
                                      actionType="card"
                                      isLoading={this.props.isLoading}
                                    />
                                  </div> :
                                  <button
                                    className="btn-name truncate"
                                    onClick={() => {
                                      this.setState({
                                        needAccountVerifiedModel: true,
                                        isSignBoardButtonClick: false,
                                      });
                                    }}
                                  >
                                    { this.props.cardOwner ? `@${_.truncate(this.props.cardOwner.username, {'length': 9, 'omission': '...' })}` : '' }
                                  </button>
                              }
                            </div> :
                            <div className="name-follow-wrapper">
                              <div className="name-wrap">
                                <button
                                  className="btn-name truncate"
                                  onClick={() => {
                                    this.setState({ needLoginModel: true });
                                  }}
                                >
                                  { this.props.cardOwner ? `@${_.truncate(this.props.cardOwner.username, {'length': 9, 'omission': '...' })}` : '' }
                                </button>
                              </div>
                            </div>
                        }
                        <div className="like-button">
                          {this.props.isLogin && this.props.loggedUser && this.props.loggedUser.activated ?
                          <div className="cifoot text-center clearfix">
                            {this.props.cardInfo && this.props.cardInfo.user_can_like === 'true' ?
                              <button
                                className="col"
                                onClick={() => {
                                  this.props.actions.like(this.props.cardInfo.id);
                                }}
                              >
                                <i className="fa fa-heart-o chant-social-button" aria-hidden="true" />
                              </button> :
                              <button
                                className="col"
                                onClick={() => {
                                  this.props.actions.unlike(this.props.cardInfo.id);
                                }}
                              >
                                <i
                                  className="fa fa-heart chant-social-button on red"
                                  aria-hidden="true"
                                />
                              </button>
                            }
                          </div>
                          : undefined
                          }
                        </div>
                        <CopyToClipboard text={fullURL}>
                          <div className="type-badge invite-badge">
                            <button className="badge public-badge" onClick={ () => this.setState({ inviteLinkPopupFlag: true }) }>
                              INVITE
                            </button>
                          </div>
                        </CopyToClipboard>
                        <SweetAlert
                          show={this.state.inviteLinkPopupFlag}
                          // type="success"
                          title="Success!"
                          text="The link to this card is now in your Clipbopard"
                          imageUrl="/static/images/wishyoo_logo.png"
                          onConfirm={ () => this.setState({ inviteLinkPopupFlag: false }) }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="download-apps">
                  <div className="text-center">
                      <div>To create a card, download the app!</div>
                      <div>
                        <a
                          href="https://itunes.apple.com/app/wishyoo/id1125036797?mt=8"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ margin: '5px' }}
                        >
                          <img
                            src="/static/images/download-on-the-app-store-apple.svg"
                            alt="download app from apple app store" width="120"
                            style={{width: '90px'}}
                          />
                        </a>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.wishyoo.src"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src="/static/images/google-play-badge.svg"
                            alt="download app from google play store" width="120"
                            style={{width: '90px'}}
                          />
                        </a>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </section>


          <section className="card-images">
            <div className="container">
              <div className="center-options">

              {/*
              <Alert bsStyle="success" style={this.state.alertVisibleSuccess ? { display: 'block' } : { display: 'none' }}>
                <strong>Success!</strong> You have successfully submited your signeture.
              </Alert>

              <Alert bsStyle="success" style={this.state.alertVisibleForVerifyEmail ? { display: 'block' } : { display: 'none' }}>
                <strong>Success!</strong> Please check your email to verify your account.
              </Alert>
              */}

                <div className="center-align">
                  {
                    this.props.cardImages && this.props.cardImages.metadata.total > 0 ?
                      <div className="menu-strip-wrapper" id="first-menu">
                        <button
                          onClick={() => { this.open('images', null, false); }}
                          className="btn_cover_style"
                        >
                          <div className="bk_image bg_for_images">
                            <span className="text-options">Images</span>
                          </div>
                        </button>
                      </div>
                    : ''
                  }
                  {
                    this.props.cardSignatures && this.props.cardSignatures.metadata.total > 0 ?
                      <div className="menu-strip-wrapper">
                        <button
                          onClick={() => { this.open('signature', null, true); }}
                          className="btn_cover_style"
                        >
                          <div className="bk_image bg_for_signatures">
                            <span className="text-options">Signatures</span>
                          </div>
                        </button>
                      </div>
                    : ''
                  }
                  {
                    this.props.cardInfo && this.props.cardInfo.mix_url ?
                      <div className="menu-strip-wrapper">
                        <button
                          onClick={() => { this.open('audio', null, false); }}
                          className="btn_cover_style"
                        >
                          <div className="bk_image bg_for_audio">
                            <span className="text-options">Audio</span>
                          </div>
                        </button>
                      </div>
                    : ''
                  }
                  { this.showGiftMenuStrip() ?
                    <div className="menu-strip-wrapper">
                      <button
                        onClick={() => { this.open('gift', null, false); }}
                        className="btn_cover_style"
                      >
                        <div className="bk_image bg_for_gift">
                          <span className="text-options">Gift</span>
                        </div>
                      </button>
                    </div>
                    : ''
                  }
                  { this.showDonateMenuStrip() ?
                    <div className="menu-strip-wrapper">
                      <button
                        onClick={() => { this.open('donate', null, false); }}
                        className="btn_cover_style"
                      >
                        <div className="bk_image bg_for_gift">
                          <span className="text-options">Donate</span>
                        </div>
                      </button>
                    </div>
                    : ''
                  }
                </div>
                <div>
                 <div className='card-images-view' >
                    <div className="img-container cover-image animated bounceInLeft">
                      <div className="coverButton" onClick={() => { this.open('images', null, false); }} >
                        <img src="/static/images/cover.png" alt="cover" />
                        {
                          this.props.cardInfo && this.props.cardInfo.hasBoard && !this.props.cardInfo.isSubmitted ?
                            <button className="sign-button" onClick={(e) => { this.signIconClick(e); }}>
                              <span className="sign-button-text">Sign</span>
                            </button>
                          :
                          undefined
                        }

                        {cardCoverImage()}
                      </div>
                      { this.props.cardSignatures &&  Number(this.props.cardSignatures.metadata.total) > 0 ?
                          <span className="tree-view">
                          <img src='/static/images/tree.svg' className="trees-saved" alt="tree_full" />
                          <p className="tree-des">
                            {
                              this.state.treesSavedCount === 1 ? `Almost 1 tree saved so far` : `Almost ${this.state.treesSavedCount} trees saved so far`
                            }
                          </p>
                        </span>
                        :
                        undefined
                      }
                    </div>
                  </div>
                </div>
                { this.props.cardInfo && this.props.cardInfo.include_subscription_link &&
                  <div className="subscribeBtn">
                    <img src="/static/images/subscribe-min.png" className="img-responsive" alt="subscribe"
                         width="130" onClick={() => { this.subscribeYoutube(); }} />
                  </div>
                }
                <div>
                  <div className='card-board-view' style={{ display: 'grid', justifyContent: 'center' }} >
                    <div
                      style={{ outline: 'none', position: 'relative' }}
                      className="img-container pointer signeture_board animated bounceInRight"
                      >
                      {cardSignaturesBoard()}
                    </div>
                    { this.props.cardInfo && (this.props.cardInfo.id === 163343 || this.props.cardInfo.id === 1441) &&
                      <div className="music_bar mobileViewHidden">
                        <img
                          src="/static/images/spotify.png" alt="spotify" className="clickable music_image p-b-10"
                          onClick={() => {
                            this.redirectToMusicLink('spotify');
                          }}
                        />
                        <img
                          src="/static/images/music_google.png" alt="music_google" className="clickable deezer_music_image"
                          onClick={() => {
                            this.redirectToMusicLink('google');
                          }}
                        />
                        <img
                          src="/static/images/deezer.png" alt="deezer" className="clickable deezer_music_image p-b-5"
                          onClick={() => {
                            this.redirectToMusicLink('deezer');
                          }}
                        />
                        <img
                          src="/static/images/itunes.png" alt="itunes" className="clickable music_image p-b-8"
                          onClick={() => {
                            this.redirectToMusicLink('itunes');
                          }}
                        />
                        <img
                          src="/static/images/music.png" alt="music" className="clickable amazon_music_image"
                          onClick={() => {
                            this.redirectToMusicLink('music');
                          }}
                        />
                      </div>
                    }
                  </div>
                </div>

              </div>

             {/* <div ref={(c) => { this.audio = c; }}>
                { this.state.isClient && this.props.cardInfo ? CardAudio() : '' }
              </div>

              { this.state.playing ?
                <div className="audioButtons text-center" style={{ marginTop: '10px' }}>
                  <button className="btnAction" onClick={this.handleToggle}>
                    <i className="fa fa-stop" aria-hidden="true" />
                  </button>
                </div> : undefined
              }*/}

              {/*
              <div className="container text-left">
                <div><strong>12</strong> {12 > 1 ? 'people' : 'person'} joined your card</div>
              </div>
              <div className="h20" />
              */}
              <div className="report-abuse">
              {
                <button className="abuse-link" onClick={this.toggleReportAbuseCardModal}><a>REPORT ABUSE</a></button>
              }
              </div>
            </div>
          </section>

          {
            this.state.isClient ?
              joinedUsers() :
              <div className="text-center" style={{ padding: '30px 0' }}>
                <img src="/static/images/loader-red-1.gif" height="50" alt="loading cards" />
              </div>
          }

        </div>

        <FooterInnerPage />

        <Modal
          show={this.state.showSignatureModal || this.state.showImageModal || this.state.showGiftModal
                      || this.state.showDonateModal || this.state.showAudioModal}
          dialogClassName="galaryModal "
          onHide={() => { this.close(this.setMembersType()); }}
        >
          <div>
            <button onClick={() => { this.close(this.setMembersType()); }} className="closeModalButton">
              X
            </button>
            <div className="popupModalContainer">
              <div className="mobileViewHidden row text-center topMenu" style={{ marginTop:'7px'}}>
                <div className="btn-group">
                  {this.props.cardImages && this.props.cardImages.metadata.total > 0 ?
                    <button
                      className={"btn_cover_style " + (this.state.showImageModal ? 'active' : '')}
                      onClick={() => { this.setModalToOpen('images'); }} >
                      <div>
                        <span className="popup-text-options" >Images</span>
                        <img src="/static/images/menu-images-mobile.png" height="30" alt="images" />
                      </div>
                    </button>
                    : ''
                  }
                  { this.props.cardSignatures && this.props.cardSignatures.metadata.total > 0 ?
                    <button
                      className={"btn_cover_style " + (this.state.showSignatureModal ? 'active' : '')}
                      onClick={() => { this.setModalToOpen('signature'); }} >
                      <div>
                        <span className="popup-text-options">Signatures</span>
                        <img src="/static/images/menu-signatures-mobile.png" height="30" alt="signatures" />
                      </div>
                    </button>
                    : ''
                  }
                  { this.props.cardInfo && this.props.cardInfo.mix_url ?
                    <button className={"btn_cover_style " + (this.state.showAudioModal ? 'active' : '')}
                            onClick={() => { this.setModalToOpen('audio'); }} >
                      <div>
                        <span className="popup-text-options">Audio</span>
                        <img src="/static/images/menu-audio-mobile.png" height="30" alt="audio" />
                      </div>
                    </button>
                    : ''
                  }
                  { this.showGiftMenuStrip() ?
                    <button
                      className={"btn_cover_style " + (this.state.showGiftModal ? 'active' : '')}
                      onClick={() => { this.setModalToOpen('gift'); }} >
                      <div>
                        <span className="popup-text-options">Gift</span>
                        <img src="/static/images/menu-gift-mobile.png" height="30" alt="gift" />
                      </div>
                    </button>
                    : ''
                  }
                  { this.showDonateMenuStrip() ?
                    <button
                      className={"btn_cover_style " + (this.state.showDonateModal ? 'active' : '')}
                      onClick={() => { this.setModalToOpen('donate'); }} >
                      <div>
                        <span className="popup-text-options">Donate</span>
                        <img src="/static/images/menu-gift-mobile.png" height="30" alt="donate" />
                      </div>
                    </button>
                    : ''
                  }
                </div>
              </div>
              {(this.state.showSignatureModal || this.state.showImageModal) ?
                <div className="pr">
                  {modalSlick(this.state.showSignatureModal ? 'signatures' : 'images')}
                </div> : ''
              }
              { this.state.showAudioModal ?
                <div>
                  <div ref={(c) => { this.audio = c; }}>
                    {CardPopupAudio()}
                  </div>
                  { this.state.isPopupAudioPlaying ?
                    <div style={{ marginTop: '10px' }} onClick={() => { this.handlePopupToggle(); }}>
                      <i className="fa fa-stop-circle-o audioModalBtn" aria-hidden="true" />
                    </div> :
                    <div style={{ marginTop: '10px' }} onClick={() => { this.handlePopupToggle(); }}>
                      <i className="fa fa-play-circle-o audioModalBtn" aria-hidden="true" />
                    </div>
                }
                </div> : ''
              }
              { this.state.showGiftModal ?
                <div className="giftModal row">
                  { this.state.showGiftContribeSuccess ?
                    <div className="resStyle successStyle giftContributeSuccess">
                      <div className="msg">Contribution Successful</div>
                    </div>
                    :
                    <div className="m-t-10"></div>
                  }
                  <div className="col-md-6">
                    {createGiftModal()}
                    <div>
                      {cardBoardInfoGifts.description}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="gift-contribution-wrapper">
                      {giftContribution()}
                      { this.state.giftModalButtonText === 'Submit' &&
                      <p className="chipin-text">Want to chip in? Enter your gift pledge here!</p>
                      }
                      { this.state.giftModalButtonText === 'Update' &&
                      <p style={{ color: "#FF8A15" }}>Your pledge has been saved.</p>
                      }
                      <div className="chipin-amount-box">
                        $ <input type="number"
                                 placeholder="0.00"
                                 value={this.state.giftModalPledgeAmount}
                                 onChange={(event) => {
                                   this.giftPledgeInputChange(event); }}
                                 className="giftModalInput"/>
                        <button type="button" className="giftSubmitbutton" disabled={!this.state.giftModalPledgeAmount} onClick={() => {
                          this.addUpdateGiftContribution(this.state.giftModalButtonText === 'Submit' ? 'submit' : 'update'); }}
                        >
                          {this.state.giftModalButtonText}
                        </button>
                      </div>
                      {
                        this.state.showHowContribute ?
                        <div className="contribute-text-wrapper">
                          <div className="contribute-text-cover">
                            <p className="contribute-text">
                              <span style={{ fontSize: '18px' }}><b>{this.props.cardInfo.ownerName}</b></span> will buy this gift and wants to collect the contributions this way: <br />
                              <span><u><b>{this.props.cardBoardInfo.gifts[0].payLink}</b></u></span>
                            </p>
                          </div>
                        </div>

                        : undefined
                      }
                    </div>
                  </div>
                </div>: ''
              }
              { this.state.showDonateModal ?
                <div className="giftModal donateModal row">
                  { this.state.showDonateInvalidUrl &&
                  <div className="resStyle failureStyle giftContributeSuccess">
                    <div className="msg">Invalid Donation URL</div>
                  </div>
                  }
                  <div className="col-md-6" style={{ marginTop: '18px' }}>
                    { cardBoardInfoGifts.cardType === 'typeGiftDonation' &&
                    <div>
                      <div className="donation-wrapper">
                        { cardBoardInfoGifts.photoUrl ?
                          <img src={cardBoardInfoGifts.photoUrl} alt="wishyoo logo" />
                          :
                          <img className="photoImage" src="/static/images/wishyoo_logo.png" alt="wishyoo logo" style={{ maxWidth: '170px' }} />
                        }
                      </div>
                    </div>
                    }
                  </div>
                  <div className="col-md-6" style={{ marginTop: "20px" }}>
                    <div style={{ marginTop: "50px" }}>
                      <div style={{ lineHeight: "20px", fontFamily: "century gothic" }}>Please consider donating to:</div>
                      <div style={{ fontSize: "24px", fontWeight: 400, fontFamily: "century gotchic" }}>{cardBoardInfoGifts.description}</div>
                    </div>
                    <button style={{ marginTop: "20px" }} type="button" onClick={() => { this.redirectToDonationLink(); }}>Donate Now!
                    </button>
                    <img src="/static/images/tip_jar.png" alt="wishyoo logo" style={{ width: '50px' }}/>
                  </div>
                </div> : ''
              }
            </div>
            { this.state.showSignatureModal || this.state.showImageModal || this.state.showGiftModal
            || this.state.showDonateModal ?
              <div className="popupModalMember">
                <div className="mobileViewVisible mobileCenterModel">
                  { joinedSignatureUsers(this.setMembersType(), 'mobile', true) }
                  <div style={{ margin: "5px 33px", position: "relative" }}>
                    <div className="searchIconDiv">
                      <i className="fa fa-search" aria-hidden="true" />
                    </div>
                    <div>
                      <input type="text" className="searchInput" placeholder="Search User"
                             value={this.state.searchMemberValue}
                             onChange={(event) => { this.searchInputChange(event); }}
                             onKeyUp={() => { this.searchMembers(); }} />
                    </div>
                  </div>
                </div>
                <div style={{ margin: '10px', position: "relative", width: '30%' }} className="mobileViewHidden">
                  <div className="searchIconDiv">
                    <i className="fa fa-search" aria-hidden="true" />
                  </div>
                  <div>
                    <input type="text" className="searchInput" placeholder="Search User"
                           value={this.state.searchMemberValue}
                           onChange={(event) => { this.searchInputChange(event); }}
                           onKeyUp={() => { this.searchMembers(); }} />
                  </div>
                </div>
                <div className="mobileCenterModel mobileViewHidden">
                  {joinedSignatureUsers(this.setMembersType(), undefined, true) }
                </div>
              </div> : ''
            }
            <div>
            </div>
          </div>
        </Modal>


        <Modal
          show={this.state.showSignatureGridModal}
          onHide={() => {
            this.setState({ showSignatureGridModal: false });
          }}
          dialogClassName="signatureGridModal"
        >
          <div>

            <button onClick={() => { this.setState({ showSignatureGridModal: false }); }} className="closeModalButton">
              X
            </button>
            <div className="popupModalContainer">
              <div className="text-center row topMenu" style={{ marginTop: '7px'}}>
                <div className="btn-group">
                  {this.props.cardImages && this.props.cardImages.metadata.total > 0 ?
                    <button
                      className={"btn_cover_style " + (this.state.showImageModal ? 'active' : '')}
                      onClick={() => { this.setModalToOpen('images'); }} >
                      <div>
                        <span className="popup-text-options" >Images</span>
                        <img src="/static/images/menu-images-mobile.png" height="30" alt="images" />
                      </div>
                    </button>
                    : ''
                  }
                  { this.props.cardInfo && this.props.cardInfo.mix_url ?
                    <button className={"btn_cover_style " + (this.state.showAudioModal ? 'active' : '')}
                            onClick={() => { this.setModalToOpen('audio'); }} >
                      <div>
                        <span className="popup-text-options">Audio</span>
                        <img src="/static/images/menu-audio-mobile.png" height="30" alt="audio" />
                      </div>
                    </button>
                    : ''
                  }
                  { this.showGiftMenuStrip() ?
                    <button
                      className={"btn_cover_style " + (this.state.showGiftModal ? 'active' : '')}
                      onClick={() => { this.setModalToOpen('gift'); }} >
                      <div>
                        <span className="popup-text-options">Gift</span>
                        <img src="/static/images/menu-gift-mobile.png" height="30" alt="gift" />
                      </div>
                    </button>
                    : ''
                  }
                  { this.showDonateMenuStrip() ?
                    <button
                      className={"btn_cover_style " + (this.state.showDonateModal ? 'active' : '')}
                      onClick={() => { this.setModalToOpen('donate'); }} >
                      <div>
                        <span className="popup-text-options">Donate</span>
                        <img src="/static/images/menu-gift-mobile.png" height="30" alt="donate" />
                      </div>
                    </button>
                    : ''
                  }
                </div>
              </div>
              <div>
                {signatureGridList}
              </div>
            </div>
          </div>
        </Modal>

        {this.state.isClient && this.props.cardBoardInfo ?
          <Modal show={this.state.showSignModel} onHide={() => { this.close('addSign'); }} dialogClassName="signModel">
            <button onClick={() => { this.close('addSign'); }} className="closeSignBoard">
              <i className="fa fa-times-circle-o" aria-hidden="true" />
            </button>
            <iframe src={this.state.iFrameUrl} height="100%" width="100%" />
          </Modal>
        : null}

        {this.state.isClient ?
          <Modal
            show={this.state.popUpregistration}
            dialogClassName="signModel popUpReg"
          >
            <div className="text-center">
              <img src="/static/drawing/images/logo.png" alt="wishyoo logo" />
            </div>
            <p>
              Please login/register to add your signature to this
              <br />
              <span style={{ color: '#FF8A15' }}>
                {this.props.cardInfo.title}
              </span>
            </p>
            {
              (this.props.success || this.props.failure) && this.props.url.query.s_id ?
                <div style={{ marginTop: '-64px' }}>
                  <hr />
                  <HandleError {...this.props} />
                </div> : null
            }
            <hr />
            <Tabs defaultActiveKey={1} className="registrationTab" id="registrationForAddSignature">
              <Tab eventKey={1} title="Login">
                <Login {...this.props} popUpAction={this.popUpAction} />
              </Tab>
              <Tab eventKey={2} title="Register">
                <Register {...this.props} popUpAction={this.popUpAction} />
              </Tab>
            </Tabs>
            <a
              href={`/card/${this.props.cardInfo.id}`}
              style={{ color: '#aaa', fontSize: '14px' }}
            >
              cancel
            </a>
          </Modal> : null
        }

        <Modal
          show={this.state.needLoginModel || this.state.needGiftLoginModal}
          onHide={() => {
            this.setState({ needLoginModel: false, needGiftLoginModal: false });
          }}
        >
          <div className="mt30">
            <img
              src="/static/images/wishyoo_logo.png"
              alt="wishyoo smile"
              style={{ height: '150px', marginBottom: '20px' }}
            />
            <br />
            Please&nbsp;
            <Link href="/login">
              <a>login</a>
            </Link>&nbsp;/&nbsp;
            <Link href="/register">
              <a>register</a>
            </Link>&nbsp;
            {this.state.needLoginModel &&
              <p style={{ display: "inline" }}>
                to see user information
              </p>
            }
            {this.state.needGiftLoginModal &&
            <p style={{ display: "inline" }}>
              to contribute for a gift
            </p>
            }
          </div>
        </Modal>

        <Modal
          show={this.state.needAccountVerifiedModel}
          onHide={() => {
            this.setState({ needAccountVerifiedModel: false });
          }}
          dialogClassName="accountVerifyModelDialogStyle"
        >
          {
            this.state.isSignBoardButtonClick ?
              <button
                className="btn-remove-default-style"
                onClick={() => {
                  this.setState({ needAccountVerifiedModel: false });
                }}
              >
                <div>
                  <img
                    src="/static/images/notification_2.png"
                    alt="account verify for add signature"
                  />
                  <div className="notification-text">
                    <p>
                      Please check your email and validate the account to add your dedication
                    </p>
                  </div>
                </div>
              </button> :
              <button
                className="btn-remove-default-style"
                onClick={() => {
                  this.setState({ needAccountVerifiedModel: false });
                }}
              >
              <div>
                <img
                  src="/static/images/notification_1.png"
                  alt="account verify for view profile imformation"
                />
                <div className="notification-text">
                  <p>
                    Please check your email and validate the account to see user information
                  </p>
                </div>
              </div>
              </button>
          }
        </Modal>

        <Modal
          show={this.state.donationAwesomeModal}
          onHide={() => {
            Router.replaceRoute(`/card/${this.props.url.query.id}`, { shallow: true })
            this.setState({ donationAwesomeModal: false });
          }}
          dialogClassName="donationAwesomeModal"
        >

          <button onClick={() => { this.setState({ donationAwesomeModal: false });
            if (this.props.url.query.s_id) {
              Router.replaceRoute(`/card/${this.props.url.query.id}`, { shallow: true })
            } }} className="closeModalButton">
            X
          </button>
          { this.state.showDonateInvalidUrl &&
          <div className="resStyle failureStyle giftContributeSuccess m-t-10">
            <div className="msg">Invalid Donation URL</div>
          </div>
          }
          <div style={{ marginTop: "50px" }}>
            <div>
              <h1>
                <img src="/static/images/party_icon.png" alt="party_icon" height="70" style={{ marginTop: "-30px" }} />
                {(this.state.alertVisibleForVerifyEmail || this.state.alertVisibleSuccess) ? 'Great !!' : 'Oops !!'}</h1>
            </div>
            <div style={{ paddingTop: "20px" }}>
              <p className="text-uppercase">
                {this.state.alreadyAddedSignByLoggedInUser &&
                  <span>It seems you have already signed the WishYoo</span>}
                {this.state.alertVisibleSuccess &&
                  <span>NOW YOU ARE A PART OF THIS AWESOME CARD</span>}
                {this.state.alertVisibleForVerifyEmail &&
                <span>Please check your email and validate the account to see your dedication</span>}
              </p>
            </div>
            <div style={{ marginTop: "20px" }}>
              <div>
                <div style={{ lineHeight: "10px" }}>The creator of this card is asking for donations to </div>
                <div style={{ fontSize: "20px", fontWeight: "400", paddingTop: "20px" }}>{cardBoardInfoGifts.description}</div>
              </div>
              <button className="submitButton" style={{ marginTop: "20px" }} type="button" onClick={() => { this.redirectToDonationLink(); }}>Donate Here!
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          show={this.state.giftAwesomeModal}
          onHide={() => {
            Router.replaceRoute(`/card/${this.props.url.query.id}`, { shallow: true })
            this.setState({ giftAwesomeModal: false });
          }}
          dialogClassName="donationAwesomeModal"
        >

          <button onClick={() => { this.setState({ giftAwesomeModal: false });
            if (this.props.url.query.s_id) {
              Router.replaceRoute(`/card/${this.props.url.query.id}`, { shallow: true })
          }}} className="closeModalButton">
            X
          </button>
          <div style={{ marginTop: "50px" }}>
            <div>
              <h1>
                <img src="/static/images/party_icon.png" alt="party_icon" height="70" style={{ marginTop: "-30px" }} />
                {(this.state.alertVisibleForVerifyEmail || this.state.alertVisibleSuccess) ? 'Great !!' : 'Oops !!'}</h1>
            </div>
            <div style={{ paddingTop: "20px" }}>
              <p>
                {this.state.alreadyAddedSignByLoggedInUser &&
                <span>It seems you have already signed the WishYoo</span>}
                {this.state.alertVisibleSuccess &&
                <span>NOW YOU ARE A PART OF THIS AWESOME CARD</span>}
                {this.state.alertVisibleForVerifyEmail &&
                <span>Please check your email and validate the account to see your dedication</span>}
              </p>
            </div>
            <div style={{ marginTop: "20px" }}>
              <div>
                <div style={{ lineHeight: "10px" }}>This card has a gift</div>
              </div>
              <button className="contributeButton" style={{ marginTop: "20px" }} type="button" onClick={() => { this.awesomeModalGiftContribution(); }}>Contribute Here!
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          show={(this.state.giftContributionModal)}
          onHide={() => {
            this.setState({ giftContributionModal: false });
          }}
          dialogClassName="giftContributionModal"
        >

          <button onClick={() => { this.setState({ giftContributionModal: false });
            if (this.props.url.query.s_id) {
              window.location = `/card/${this.props.url.query.id}`;
            } }} className="closeModalButton">
            X
          </button>
          <div>
            <div>
              {createGiftModal()}
              <div className="orangeColor">
                {cardBoardInfoGifts.description}
              </div>
            </div>
            <div>
              {giftContribution()}
              <p>Want to chip in? Enter your gift pledge here!</p>
              <div>
                $ <input type="text"
                         placeholder="0.00"
                         value={this.state.giftContributionModalPledgeAmount}
                         onChange={(event) => {
                           this.giftContributionPledgeInputChange(event); }}
                          className="giftModalInput" />
                <button type="button" className="giftSubmitbutton" disabled={!this.state.giftContributionModalPledgeAmount} onClick={() => {
                  this.submitGiftContribution() }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          show={this.state.thanksAwesomeModal}
          onHide={() => { this.setState({ thanksAwesomeModal: false }); }}
          dialogClassName="donationAwesomeModal"
        >

          <button onClick={() => { this.setState({ thanksAwesomeModal: false });
            if (this.props.url.query.s_id) {
              window.location = `/card/${this.props.url.query.id}`;
            } }} className="closeModalButton">
            X
          </button>
          { this.state.isLinkCopied &&
          <div className="resStyle successStyle giftContributeSuccess">
            <div className="msg">Link copied successfully.</div>
          </div>
          }
          <div style={{ marginTop: "50px" }}>
            <div>
              <h1>
                <img src="/static/images/party_icon.png" alt="party_icon" height="70" style={{ marginTop: "-30px" }} />
                Thanks</h1>
            </div>
            <div style={{ paddingTop: "20px" }}>
              <p>
                SHARE THIS CARD AND INVITE FRIENDS TO SIGN IT
              </p>
            </div>
            <div style={{ marginTop: "20px" }}>
             <CopyToClipboard text={fullURL}>
                <button type="button" className="contributeButton" style={{ marginTop: "20px" }}
                        onClick={() => { this.showLinkCopied(); }}>Copy Link
                </button>
             </CopyToClipboard>
            </div>
          </div>
        </Modal>

        <Modal
          show={this.state.showReportSignatureModal === 'visitor' || this.state.showReportAttachmentModal === 'visitor'}
          onHide={() => {
            this.setState({ showReportSignatureModal: '', showReportAttachmentModal: '' });
          }}
          dialogClassName="reportModal">
          <div className="create-card-wrapper">
            <button className="close-create-card-modal"
                    onClick={() => { this.setState({ showReportSignatureModal: '', showReportAttachmentModal: '' }); }}
            >X</button>
            <div className="report_creator_heading">
              <div className="brain-image-wrapper">
                <img
                  src="/static/images/face.png"
                  alt="face"
                  className="brain-image"
                />
              </div>
              <div className="heading-text-wrapper">
                <p className="heading-text" style={{ fontSize: "20px" }}>
                  Are you sure you want to report this ?
                </p>
              </div>
            </div>
            <div className="app-download">
              <div>
                <span type="button" className="m-r-10 clickable" onClick={this.reportSignature} >
                  <img
                    src="/static/images/yes.png"
                    alt="yes"
                    width="100"/>
                </span>
                <span type="button" className="clickable">
                  <img src="/static/images/no.png" width="100"
                       onClick={() => { this.setState({ showReportSignatureModal: '', showReportAttachmentModal: '' }); }}
                  />
                </span>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          show={this.state.showReportSignatureModal === 'creator' || this.state.showReportAttachmentModal === 'creator'}
          onHide={() => {
            this.setState({ showReportSignatureModal: '', showReportAttachmentModal: '' });
          }}
          dialogClassName="reportModal"
        >
          <div className="mt30">
            <p>
              What would you like to do ?
            </p>
            <div style={{ paddingBottom: "10px" }}>
              { this.state.showReportSignatureModal === 'creator' &&
                <button
                  type="button" className="smallGenericBtn"
                  onClick={this.deleteSignature}
                >
                  Delete Signature
                </button>
              }
              { this.state.showReportAttachmentModal === 'creator' &&
                <button
                  type="button" className="smallGenericBtn"
                  onClick={this.deleteAttachment}
                >
                  Delete Attachment
                </button>
              }
            </div>
            <div>
              <button
                type="button" className="smallGenericBtn"
                onClick={this.blockUser}
              >
                Block User</button>
            </div>
          </div>
        </Modal>
        <Modal
          show={this.state.alertsForReportSignature === "delete" || this.state.alertsForReportSignature === "block" ||
                this.state.alertsForReportSignature === "report" || this.state.alertsforAttachmentSignature === "delete"}
          onHide={() => {
            this.setState({ alertsForReportSignature: '', alertsforAttachmentSignature: '' });
          }}
        >
          <div className="mt30">
            <img
              src="/static/images/wishyoo_logo.png"
              alt="wishyoo smile"
              style={{ height: '150px', marginBottom: '20px' }}
            />
            <br />
            { this.state.alertsForReportSignature === "delete" &&
              <p>
                Signature has been deleted !!!
              </p>
            }
            { this.state.alertsforAttachmentSignature === "delete" &&
              <p>
                Attachment has been deleted !!!
              </p>
            }
            { this.state.alertsForReportSignature === "block" &&
              <p>
                User has been blocked !!!
              </p>
            }
            { this.state.alertsForReportSignature === "report" &&
              <p>
                { this.state.alertMsgForReport }
              </p>
            }
          </div>
        </Modal>


        <Modal
          show={this.state.reportAbuseModal}
          onHide={() => {
            this.setState({ reportAbuseModal: false });
          }}
          dialogClassName="report-modal" >
          <div className="report-modal-wrap">
            <div className="heading">
              <p className="report-heading">
                Abuse report
              </p>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="report-desc">
                <textarea
                  rows="4"
                  cols="40"
                  placeholder="Please, help us to understand the problem"
                  id="report-desc"
                  style={{ position: 'relative', padding: '15px' }}
                  value={this.state.reportDescription}
                  onChange={this.handleChange}
                  required
                >
                </textarea>
              </div>
              <div className="submit">
                <button id="report-submit" type="submit">
                  SUBMIT
                </button>
              </div>
            </form>
            <button className="close-report-button" onClick={ this.toggleReportAbuseCardModal}>X</button>
          </div>
        </Modal>

        {/* login/sign as guest modal*/}

        <Modal
          show={this.state.signLoginRegisterModal}
          onHide={() => {
            this.setState({ signLoginRegisterModal: false });
          }}
          dialogClassName="sign-login-register" >
          <div className="guest-login-form">
            <div className="sign-desc">
              <p className="sign-text">
                Sign as a Guest!
              </p>
            </div>
            <div className="sign-box">
              <form onSubmit={this.handleSignSubmit}>
                <div className="form-wrapper">
                  <div className="guest-text">
                    <input id="guest-name" type="text" placeholder="We just need your first name..." value={this.state.guestName} className="guest-name" onChange={this.handleChange}/>
                  </div>
                  <div className="go-submit">
                    <button id="GO" type="submit">
                      GO!
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="other">
              <div>
                <p className="login-text">
                  Or <Link href={`/login?card_id=${this.props.url.query.id}`}><a>login</a></Link> / <Link href={`/register?card_id=${this.props.url.query.id}`}><a>register!</a></Link>
                </p>
              </div>
              <div className="social-login">
                <div>
                  <a href={`/api/v3/auth/facebook?card_id=${this.props.url.query.id}`}><img src="/static/images/facebook.png" className="facebook-login" /></a>
                </div>
                <div>
                  <a href={`/api/v3/auth/twitter?card_id=${this.props.url.query.id}`}><img src="/static/images/twitter.png" className="twitter-login" /></a>
                </div>
                <div>
                  <a href={`/api/v3/auth/google?card_id=${this.props.url.query.id}`}><img src="/static/images/google.png" className="google-login" /></a>
                </div>
              </div>
            </div>
          </div>
        </Modal>


        <Modal
          show={this.state.showAlreadySubmittedCardModal}
          onHide={() => {
            this.setState({ showAlreadySubmittedCardModal: false });
          }}
          dialogClassName="create-card-modal"
        >
          <div className="create-card-wrapper">
            <button className="close-create-card-modal"
                    onClick={() => { this.setState({ showAlreadySubmittedCardModal: false, showGiftModal: false }); }}
            >X</button>
            <div className="creator-heading">
              <div className="brain-image-wrapper">
                <img
                  src="/static/images/monkey.png"
                  alt="monkey"
                  className="brain-image"
                />
              </div>
              <div className="heading-text-wrapper">
                <p className="heading-text">
                  Sorry!
                </p>
              </div>
            </div>
            <div className="creator-desc-wrapper">
              <p className="creator-desc">
                This card has been already sent and cannot accept more contributions...next time!
              </p>
            </div>
            <div className="app-download">
              <div className="ios-app-download">
                <a
                  href="https://itunes.apple.com/app/wishyoo/id1125036797?mt=8"
                  target="_blank"
                  type="button"
                  rel="noopener noreferrer"
                  style={{ margin: '3px', display: 'inline-block' }}
                >
                  <img
                    src="/static/images/app_store.png"
                    alt="download app from apple app store"
                    height="60"
                    style={{ width: '160px', height: '55px' }}
                  />
                </a>
              </div>
              <div className="android-app-download">
                <a
                  href="https://play.google.com/store/apps/details?id=com.wishyoo.src"
                  target="_blank"
                  type="button"
                  rel="noopener noreferrer"
                  style={{ margin: '3px', display: 'inline-block' }}
                >
                  <img
                    src="/static/images/google_play.png"
                    alt="download app from google play store"
                    height="60"
                    style={{ width: '160px', height: '55px' }}
                  />
                </a>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
