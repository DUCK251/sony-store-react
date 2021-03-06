import React, { useState, useContext, useEffect, useRef } from 'react';

//images
import logo from '../assets/images/common/logo.svg';
import search from '../assets/images/common/ic_search.svg';
import mypage from '../assets/images/common/ic_mypage.svg';
import cart from '../assets/images/common/ic_cart.svg';
import menu from '../assets/images/common/ic_menu.svg';
import close from '../assets/images/common/ic_close.svg';

//component
import Gnb from './Gnb';
import Search from './Search';
import CartCount from './cart/CartCount';

//context
import GlobalContext from '../context/global.context';
import { useHeaderDispatch, useHeaderState, openSideBar, closeSideBar } from '../context/header.context';

//utils
import { Link, useHistory, useLocation } from 'react-router-dom';
import { removeAccessToken } from '../utils/token';
import { resetProfile, useProfileState, useProileDispatch } from '../context/profile.context';
import { useAlert, useClickOutside, useMediaQuery, useScroll } from '../hooks';
import { getAgent } from '../utils/detectAgent';
import Alert from './common/Alert';

export default function Header(location) {
  const { openAlert, closeModal, alertVisible, alertMessage } = useAlert();
  const history = useHistory();
  const currLocation = useLocation();
  const { onChangeGlobal, isLogin } = useContext(GlobalContext);
  const { profile, my } = useProfileState();
  const { isSiderbarOpen } = useHeaderState();
  const profileDispatch = useProileDispatch();
  const headerDispatch = useHeaderDispatch();

  const [visible, setVisible] = useState(true);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isInfoOpen, setInfoOpen] = useState(false);

  const { scrollY } = useScroll();
  const agent = getAgent();
  const underPc = useMediaQuery('(max-width: 1280px)');

  const [prevScrollY, setPrevScrollY] = useState(window.scrollY);

  const header = useRef();

  useEffect(() => {
    const menuOpen = history.location.state?.menuOpen;
    menuOpen && openSideBar(headerDispatch);
    if (agent.isApp && currLocation.pathname.includes('/app/terms/')) {
      setVisible(false);
    }
  }, [location, currLocation]);

  useEffect(() => {
    if (agent.isApp && window.location.href.includes('/app/terms/')) {
      setVisible(false);
      return;
    }
    if (prevScrollY > window.scrollY || header.current.offsetHeight > window.scrollY) {
      setVisible(true);
    } else {
      setVisible(false);
    }

    setPrevScrollY(window.scrollY);
  }, [scrollY]);

  const closeSubSlider = () => {
    setInfoOpen(false);
    closeSideBar(headerDispatch);
  };

  const hideBodyScroll = (hide) => {
    const body = document.querySelector('body');
    if (underPc) {
      body.style.overflow = hide ? 'hidden' : 'auto';
    } else {
      body.style.overflow = 'auto';
    }
  };

  useEffect(() => {
    hideBodyScroll(isSiderbarOpen);
  }, [isSiderbarOpen, underPc]);

  useEffect(() => {
    const $body = document.querySelector('body');
    $body.setAttribute('style', isSearchOpen ? 'overflow: hidden' : 'overflow: auto');
    !isSearchOpen && closeSubSlider();
  }, [isSearchOpen]);

  const sideRef = useRef(null);
  useClickOutside(sideRef, () => isInfoOpen && setInfoOpen(false));

  return (
    <>
      <header
        ref={header}
        id="header"
        className={`header ${visible ? 'header--visible' : 'header--invisible'} ${
          isSiderbarOpen ? 'header--active' : ''
        } ${isSearchOpen ? 'header--search' : ''}`}
      >
        {alertVisible && <Alert onClose={() => closeModal()}>{alertMessage}</Alert>}
        <div className="header__wrapper">
          <h1 className="header__logo">
            <Link to="/">
              <img src={logo} alt="SONY" />
            </Link>
          </h1>
          <div className="header__menu">
            <button
              className="btn btn__mo__hidden btn__search"
              onClick={() => {
                setSearchOpen(true);
              }}
            >
              <img src={search} alt="????????? ??????" />
            </button>
            <a
              href="#"
              className="btn btn__desktop btn__mypage"
              onClick={(e) => {
                e.preventDefault();
                setInfoOpen(!isInfoOpen);
              }}
            >
              <img src={mypage} alt="???????????????" />
            </a>
            <a
              href="#"
              className="btn btn__cart"
              onClick={(e) => {
                e.preventDefault();
                history.push('/cart');
              }}
            >
              <img src={cart} alt="????????????" />
              <CartCount isOpened={isSiderbarOpen} className="badge" />
            </a>
            <button
              type="button"
              className="btn btn__mo btn__menu__open"
              onClick={() => {
                openSideBar(headerDispatch);
              }}
            >
              <img src={menu} alt="?????? ??????" />
            </button>
            <button
              type="button"
              className="btn btn__mo btn__mo__hidden btn__menu__close"
              onClick={() => {
                closeSideBar(headerDispatch);
              }}
            >
              <img src={close} alt="?????? ??????" />
            </button>
          </div>

          <div className="header__inner">
            {/* ?????????/????????? ??? */}
            {!isLogin && (
              <>
                <div ref={sideRef} className={`member ${isInfoOpen && 'member--visible'}`}>
                  <div className="member__inner">
                    <Link to="/member/login" onClick={closeSubSlider} className="member__msg member__msg__login">
                      ????????????
                      <br />
                      ???????????????
                    </Link>
                    <button
                      type="button"
                      className="btn btn__login"
                      onClick={() => {
                        history.push('/member/login');
                        setInfoOpen(false);
                      }}
                    >
                      ?????????
                    </button>
                    <div className="member__menu">
                      <ul>
                        <li className="member__menu__mypage">
                          <Link to="/member/join" onClick={closeSubSlider}>
                            ????????????
                          </Link>
                        </li>
                        <li className="member__menu__order">
                          <Link to={isLogin ? '/my-page/order-list' : '/member/login'} onClick={closeSubSlider}>
                            ??????/?????? ??????
                          </Link>
                        </li>
                        <li className="member__menu__cart">
                          <Link to="/cart" onClick={closeSubSlider}>
                            ????????????
                            <span className="badge">
                              <CartCount isOpened={isSiderbarOpen} />
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ??????/????????? */}
            {isLogin && (
              <>
                <div ref={sideRef} className={`member ${isInfoOpen && 'member--visible'}`}>
                  <div className="member__inner">
                    <p className="member__msg">
                      {my?.firstname ?? profile?.memberName}???<br />
                      ???????????????!
                    </p>
                    <div className="member__menu">
                      <ul>
                        <li className="member__menu__mypage">
                          <Link to="/my-page" onClick={closeSubSlider}>
                            ???????????????
                          </Link>
                        </li>
                        <li className="member__menu__order">
                          <Link to={isLogin ? '/my-page/order-list' : '/member/login'} onClick={closeSubSlider}>
                            ??????/?????? ??????
                          </Link>
                        </li>
                        <li className="member__menu__cart">
                          <Link to="/cart" onClick={closeSubSlider}>
                            ????????????
                            <span className="badge">
                              <CartCount isOpened={isSiderbarOpen} />
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      className="btn btn__logout"
                      onClick={() => {
                        setInfoOpen(false);
                        removeAccessToken();
                        onChangeGlobal({ isLogin: false });
                        resetProfile(profileDispatch);
                        closeSubSlider();
                        history.push('/');
                      }}
                    >
                      ????????????
                    </button>
                  </div>
                </div>
              </>
            )}

            <Gnb />

            {/* ??? ?????? ?????? */}
            <div className="appmenu">
              <ul>
                <li className="appmenu__qr">
                  <a>QR??????</a>
                </li>
                <li className="appmenu__setting">
                  <a>??????</a>
                </li>
              </ul>
            </div>
          </div>
          {/* ?????? */}
          {isSearchOpen === true && <Search setSearchOpen={setSearchOpen} />}
          {/* ?????? */}
        </div>
      </header>
    </>
  );
}
