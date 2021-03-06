import React, { useState, useEffect, useContext, useMemo } from 'react';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//api
import { loginApi } from '../../api/auth';
import { getProfile } from '../../api/member';

//css
import '../../assets/scss/contents.scss';

//utils
import { emptyCheck, encodeString } from '../../utils/utils';
import { useHistory } from 'react-router-dom';

//lib
import Cookies from 'js-cookie';

//context
import GlobalContext from '../../context/global.context';
import { setAccessToken, setGuestToken, setItem } from '../../utils/token';
import { fetchProfile, useProileDispatch } from '../../context/profile.context';
import OpenLogin from '../../components/member/OpenLogin';
import { postGuestOrdersOrderNo } from '../../api/order';
import { getAgent } from '../../utils/detectAgent';

export default function Login({ location }) {
  const agent = getAgent();
  const { onChangeGlobal, isLogin } = useContext(GlobalContext);
  const profileDispatch = useProileDispatch();

  // null | 'cart'
  const nextLocation = useMemo(() => {
    const { search } = location;
    if (!search && !search.includes('nextLocation')) {
      return null;
    }
    return search.split('=')[1];
  }, [location]);

  const history = useHistory();

  const [tabState, setTabState] = useState('member');
  const [isPwVisible, setPwVisible] = useState(false);

  //state
  const [email, setEmail] = useState(Cookies.get('sony_email') ?? '');
  const [pw, setPw] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  //validation
  const [isEmail, setIsEmail] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [emptyOrderNo, setEmptyOrderNo] = useState(false);
  const [emptyOrderPw, setEmptyOrderPw] = useState(false);

  //cookie
  const [saveEmail, setSaveEmail] = useState(Cookies.get('sony_email') ?? false);

  const [isNonPwVisible, setIsNonPwVisible] = useState(false);
  const [orderNo, setOrderNo] = useState('');
  const [orderPw, setOrderPw] = useState('');

  //action
  const _loginApi = async (email, password) => {
    let validation = true;
    if (emptyCheck(email)) {
      setIsEmail(true);
      validation = false;
    } else {
      setIsEmail(false);
    }

    if (emptyCheck(password)) {
      setIsPw(true);
      validation = false;
    } else {
      setIsPw(false);
    }

    if (validation) {
      const response = await loginApi(email, password, autoLogin || null);
      const code = response.data?.message ? JSON.parse(response.data.message).errorCode : '';

      if (code === '3000') {
        alert('?????????/??????????????? ??????????????????.');
        //?????? ??????
      } else if (code === '3003') {
        history.push('/member/lockedAccounts');
        //?????? ??????
      } else if (response?.data?.dormantMemberResponse) {
        const { accessToken, expireIn } = response.data;
        setAccessToken(accessToken, expireIn);
        history.push('/member/inactiveAccounts');
      } else if (response.status === 200) {
        const { accessToken, expireIn } = response.data;
        setAccessToken(accessToken, expireIn);
        onChangeGlobal({ isLogin: true });
        // await fetchProfile(profileDispatch);

        if (saveEmail) {
          Cookies.set('sony_email', email);
        } else {
          Cookies.remove('sony_email');
        }
        if (agent.isApp) {
          const value = autoLogin ? 'Y' : 'N';
          window.location = `sonyapp://autoLoginYn?value=${value}&customerid=${email}`;
        }

        if (!!history.location.state?.next) {
          history.push(history.location.state.next);
        } else {
          nextLocation === 'cart' ? history.push(`/${nextLocation}?savingGuestCart=true`) : history.push('/');
        }
      } else {
        const errorMessage = response.data?.message ? JSON.parse(response.data.message).errorMessage : '';
        alert(errorMessage);
      }
    }
  };

  const nonMemberLogin = async () => {
    let validation = true;
    if (emptyCheck(orderNo)) {
      setEmptyOrderNo(true);
      validation = false;
    } else {
      setEmptyOrderNo(false);
    }

    if (emptyCheck(orderPw)) {
      setEmptyOrderPw(true);
      validation = false;
    } else {
      setEmptyOrderPw(false);
    }

    if (validation) {
      const response = await postGuestOrdersOrderNo(orderNo, { orderRequestType: 'ALL', password: orderPw });
      if (response.status === 200) {
        setGuestToken(response.data.guestToken);
        history.push(`/my-page/order-detail?orderNo=${orderNo}`);
      } else {
        alert('????????????/??????????????? ????????? ?????????.');
      }
    }
  };

  //componentDidMount
  useEffect(() => {
    //????????? ????????? ??????, ?????????????????? ?????? ????????????
    if (isLogin) {
      history.push('/');
    }
    setItem('currentPath', window.location.pathname);
  }, []);

  return (
    <>
      <SEOHelmet title={'?????????'} />
      <div className="contents">
        <div className="container" id="container">
          <div className="login">
            <ul className="login__tab">
              <li className={tabState == 'member' ? 'current' : ''} data-tab="tab1">
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    setTabState('member');
                  }}
                >
                  ?????? ?????????
                </a>
              </li>
              <li className={tabState == 'nonmember' ? 'current' : ''} data-tab="tab2">
                <a
                  href="javascript:void(0)"
                  onClick={() => {
                    setTabState('nonmember');
                  }}
                >
                  ????????? ?????????
                </a>
              </li>
            </ul>

            {/* ?????? ?????????  */}
            <div id="tab1" className={`login__tabcont ${tabState == 'member' ? 'current' : ''}`}>
              <div className={`group ${isEmail === true && 'error'}`}>
                <div className="inp_box">
                  <label className="inp_desc" htmlFor="loginName">
                    <input
                      type="text"
                      id="loginName"
                      className="inp"
                      placeholder=" "
                      value={email}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        setEmail(value);
                      }}
                    />
                    <span className="label">
                      ????????? ?????????<span>(??? : sony@sony.co.kr)</span>
                    </span>
                    <span className="focus_bg" />
                  </label>
                </div>
                <div className="error_txt">
                  <span className="ico" />
                  ????????? ???????????? ????????? ?????????.
                </div>
              </div>
              <div className={`group ${isPw === true && 'error'}`}>
                <div className="inp_box password_box">
                  <label className="inp_desc" htmlFor="loginPw">
                    <input
                      type={`${isPwVisible === true ? 'text' : 'password'}`}
                      id="loginPw"
                      className="inp"
                      placeholder=" "
                      value={pw}
                      onChange={(e) => {
                        const value = e.target.value.trim();
                        setPw(value);
                      }}
                      onKeyPress={(event) => {
                        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                          _loginApi(email, pw);
                        }
                      }}
                    />
                    <span className="label">????????????</span>
                    <span className="focus_bg" />
                    <div className="eyes">
                      <button
                        type="button"
                        title={`${isPwVisible === true ? '???????????? ??????' : '???????????? ??????'}`}
                        onClick={() => {
                          setPwVisible(!isPwVisible);
                        }}
                      >
                        <i className={isPwVisible ? 'ico_eyes_open' : 'ico ico_eyes'} />
                      </button>
                    </div>
                  </label>
                </div>
                <div className="error_txt">
                  <span className="ico" />
                  ??????????????? ????????? ?????????.
                </div>
              </div>
              <div className="btn_box full">
                <button
                  type="submit"
                  className="btn btn_dark"
                  title="?????????"
                  onClick={() => {
                    _loginApi(email, pw);
                  }}
                >
                  ?????????
                </button>
              </div>
              <div className="find_box">
                {!agent.isApp ? (
                  <div className="check">
                    <input
                      type="checkbox"
                      className="inp_check"
                      id="chk01"
                      checked={saveEmail}
                      onChange={(e) => setSaveEmail(e.target.checked)}
                    />
                    <label htmlFor="chk01">????????? ????????? ??????</label>
                  </div>
                ) : (
                  <div className="check">
                    <input
                      type="checkbox"
                      className="inp_check"
                      id="chk01"
                      checked={autoLogin}
                      onChange={(e) => setAutoLogin(e.target.checked)}
                    />
                    <label htmlFor="chk01">???????????????</label>
                  </div>
                )}
                <ul className="user_menu">
                  <li>
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        history.push('/member/search');
                      }}
                    >
                      ????????? ?? ???????????? ??????
                    </a>
                  </li>
                  <li>
                    <a
                      href="javascript:void(0)"
                      onClick={() => {
                        history.push('/member/join');
                      }}
                    >
                      ????????????
                    </a>
                  </li>
                </ul>
              </div>
              {autoLogin && (
                <div className="app_txt">
                  ?????? ???????????? ????????? ??????
                  <br />
                  ???????????? ????????? ????????? ????????? ????????? ????????????.
                </div>
              )}
              <div className="txt_or">
                <span className="txt">??????</span>
                <span className="bar" />
              </div>
              <OpenLogin type="login" />
            </div>

            {/* ????????? ????????? */}
            <div id="tab2" className={`login__tabcont ${tabState == 'nonmember' ? 'current' : ''}`}>
              <div className={`group ${emptyOrderNo ? 'error' : ''}`}>
                <div className="inp_box">
                  <label className="inp_desc" htmlFor="loginumber">
                    <input
                      type="text"
                      id="loginumber"
                      className="inp"
                      placeholder=" "
                      value={orderNo}
                      onChange={(e) => setOrderNo(e.target.value.trim())}
                    />
                    <span className="label">????????????</span>
                    <span className="focus_bg" />
                  </label>
                </div>
                <div className="error_txt">
                  <span className="ico" />
                  ??????????????? ????????? ?????????.
                </div>
              </div>
              <div className={`group ${emptyOrderPw ? 'error' : ''}`}>
                <div className="inp_box password_box">
                  <label className="inp_desc" htmlFor="loginumber">
                    <input
                      type={isNonPwVisible ? 'text' : 'password'}
                      id="loginPw_nonmember"
                      className="inp"
                      placeholder=" "
                      value={orderPw}
                      onChange={(e) => setOrderPw(e.target.value.trim())}
                      onKeyPress={(event) => {
                        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                          nonMemberLogin();
                        }
                      }}
                    />
                    <span className="label">????????????</span>
                    <div className="eyes">
                      <button type="button" title="???????????? ??????" onClick={() => setIsNonPwVisible(!isNonPwVisible)}>
                        <i className={isNonPwVisible ? 'ico_eyes_open' : 'ico ico_eyes'} />
                      </button>
                    </div>
                    <span className="focus_bg" />
                  </label>
                </div>
                <div className="error_txt">
                  <span className="ico" />
                  ??????????????? ????????? ?????????.
                </div>
              </div>
              <div className="btn_box full">
                <button type="submit" className="btn btn_dark" title="?????????" onClick={() => nonMemberLogin()}>
                  ?????????
                </button>
              </div>
              <p className="txt_nonmember">
                ?????????????????? ?????? ??? ??????????????? ????????????(?????? ??? ?????? ?????? ??????????????? ??????)??? ???????????????,
                <span className="block">?????? ?????? ????????? ?????? ????????? ???????????? ??? ????????????.</span>
              </p>
              <div className="join_box">
                <strong className="join_title">?????? ??????????????? ????????? ?????????????</strong>
                <p className="join_desc">
                  ??????????????? ?????? ????????????????????? <span className="block">????????? ???????????? ???????????? ??? ????????????.</span>
                </p>
                <div className="btn_box">
                  <a
                    href="javascript:void(0)"
                    onClick={() => {
                      history.push('/member/join');
                    }}
                    className="btn btn_default"
                  >
                    ????????????
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
