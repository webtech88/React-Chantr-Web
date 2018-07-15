import React from 'react';

const Vivus = require('vivus');

function logo() {
  return (
    <div className="flex-image-center">
      <img alt="WishYoo" src="/static/images/wishyoo_logo.png" className="cimg" style={{ width: '190px' }} />
    </div>
  );
}

function cardBanner({ id }) {
  if (id) {
    const style = {
      backgroundImage: `url(/data/image/${id}.jpg)`,
    };

    return (
      <div className="flex-image-center" style={style} />
    );
  }

  return logo();
}

function profileImage({ id, className }) {
  let imageUrl;
  const imgText = id ? id : `default user image`;
  if (id) {
    imageUrl = `/data/image/${id}.jpg`;
  } else {
    imageUrl = '/static/images/user_default.png';
  }

  return (
    <img src={imageUrl} alt={imgText} className={className} />
  );
}

function cardCover({ id, className, size }) {
  const style = {};
  let imageUrl;
  const imgText = id ? id : `default card image`;
  if (id) {
    imageUrl = `${id}`;
  } else {
    imageUrl = '/static/images/wishyoo_logo.png';
  }

  if (size) {
    style.height = size;
  }

  return (
    <img src={imageUrl} alt={imgText} className={className} style={style} />
  );
}

function audio({ id }) {
  if (id) {
    return `${id}`;
  }

  return '/static/audio/sample.m4a';
}

function youtuber() {
  return (
    <div className="flex-image-center youtuber-logo">
      <img alt="youtuber" src="/static/images/youtuber.png" className="cimg" />
    </div>
  );
}

function generalImage(href) {
  return (
    <div className="" style={{ height: '355px' }}>
      <img alt="youtuber" src={href} className="cimg" style={{ maxWidth: '100%', height: '355px' }} />
    </div>
  );
}

function agree() {
  return (
    '/static/images/agree.png'
  );
}

function disagree() {
  return (
      '/static/images/disagree.png'
  );
}

function paypal() {
  return (
    '/static/images/paypal.png'
  );
}

function bankAccount() {
  return (
    '/static/images/bank_account.png'
  );
}

function prepaidCard() {
  return (
    '/static/images/prepaid_card.png'
  );
}

function caseSpecificImage(href) {
  return (
    <div className="">
      <img alt="youtuber" src={href} className="cimg" style={{ width: '100%' }} />
    </div>
  );
}

// Added to set drawing speed of signature animation for large and small svg's
function setDuration(pathCount) {
  if (pathCount <= 50) {
    return 1000;
  } else if (pathCount > 50 && pathCount <= 100) {
    return 2000;
  } else if (pathCount > 100) {
    return 3000;
  }
  return 2000;
}

export default function genImg(id, type, className, size, elementId) {
  switch (type) {
    case 'cardBanner':
      return cardBanner({ id });

    case 'profileImg':
      return profileImage({ id, className });

    case 'cardCover':
      return cardCover({ id, className, size });

    case 'audio':
      return audio({ id });

    case 'youtuber':
      return youtuber();

    case 'agree':
      return agree();

    case 'disagree':
      return disagree();

    case 'paypal':
      return paypal();

    case 'bank_account':
      return bankAccount();

    case 'prepaid_card':
      return prepaidCard();

    case 'usecases':
      return generalImage(id);

    case 'caseSpecific':
      return caseSpecificImage(id);

    default:
      return logo();
  }
}
