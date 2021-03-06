import React, { useState, useEffect } from 'react';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//api
import { sendSMS, verifySMS } from '../../api/auth';
import { getMemberInfo } from '../../api/sony/member';

//css
import '../../assets/scss/contents.scss';
import { emptyCheck, timeFormat } from '../../utils/utils';
import Alert from '../../components/common/Alert';
import { Link, useHistory } from 'react-router-dom';
import { getUrlParam } from '../../utils/location';

export default function Search() {
  const history = useHistory();
  const [tabState, setTabState] = useState(getUrlParam('type') || 'id');

  const initSearchValue = { mobileNo: '', memberName: '', email: '' };
  const [searchValue, setSearchValue] = useState(initSearchValue);
  const [result, setResult] = useState(null);

  const [emptyMobile, setEmptyMobile] = useState(false);
  const [emptySearchValue, setEmptySearchValue] = useState(false);

  const [time, setTime] = useState(179);
  const [expireAt, setExpireAt] = useState('');
  const [authAvailable, setAuthAvailable] = useState(false);
  const [authSent, setAuthSent] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authCheck, setAuthCheck] = useState(false);
  // alert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [afterAlert, setAfterAlert] = useState(false);

  const openAlert = (message, afterProcess = false) => {
    setAlertVisible(true);
    setAlertMessage(message);
    if (afterProcess) {
      setAfterAlert(true);
    }
  };
  const closeModal = () => {
    setAlertVisible(false);
    if (afterAlert) {
      history.push('/');
    }
  };
  const onChangeValues = (type, value) => {
    setSearchValue({
      ...searchValue,
      [type]: value,
    });
  };

  const validationSearch = (mobile, searchValue) => {
    let validation = true;
    if (emptyCheck(searchValue)) {
      setEmptySearchValue(true);
      validation = false;
    } else {
      setEmptySearchValue(false);
    }

    if (emptyCheck(mobile)) {
      setEmptyMobile(true);
      validation = false;
    } else {
      setEmptyMobile(false);
    }

    return validation;
  };

  const searchMember = async () => {
    if (!authSent || !authCheck) {
      openAlert('????????? ?????? ????????? ????????????.');
      return;
    }
    if (tabState === 'id') {
      if (!validationSearch(searchValue.mobileNo, searchValue.memberName)) return;
      const { data: response } = await getMemberInfo({
        type: '10',
        firstname: searchValue.memberName,
        mobile: searchValue.mobileNo,
      });
      if (response.errorCode === '0000') {
        setResult(response.body.customerid);
      } else {
        openAlert(response.errorMessage);
      }
    } else {
      if (!validationSearch(searchValue.mobileNo, searchValue.email)) return;
      const { data: response } = await getMemberInfo({
        type: '20',
        customerid: searchValue.email,
        mobile: searchValue.mobileNo,
      });
      if (response.errorCode === '0000') {
        openAlert(`${response.body.customerid} ????????? ???????????????.`, true);
      } else {
        openAlert(response.errorMessage);
      }
    }
  };

  const _sendSMS = async (phoneNum) => {
    const response = await sendSMS(phoneNum, 'JOIN');
    if (response.status === 200) {
      //????????????
      setAuthSent(true);
    } else {
      openAlert(response.data.message);
    }
  };

  const _verifySMS = async (phoneNum, code) => {
    const response = await verifySMS(phoneNum, code, 'JOIN');
    if (response.status === 200) {
      //????????????
      setAuthCheck(true);
      openAlert('?????????????????????.');
    } else {
      openAlert(response.data.message);
    }
  };

  useEffect(() => {
    setSearchValue(initSearchValue);
    setExpireAt('');
    setTime(179);
    setAuthAvailable(false);
    setAuthSent(false);
    setAuthCode('');
    setAuthCheck(false);
    setResult(null);
    setEmptyMobile(false);
    setEmptySearchValue(false);
  }, [tabState]);

  useEffect(() => {
    if (searchValue.mobileNo.match(/^\d{2,3}\d{3,4}\d{4}$/)) {
      setAuthAvailable(true);
    } else {
      setAuthAvailable(false);
    }
  }, [searchValue.mobileNo]);

  useEffect(() => {
    if (authSent === true) {
      if (time > 0) {
        const Counter = setInterval(() => {
          const gap = Math.floor((new Date(expireAt).getTime() - new Date().getTime()) / 1000);
          setTime(gap);
        }, 1000);
        return () => clearInterval(Counter);
      }
    }
  }, [expireAt, time, authSent]);

  return (
    <>
      <SEOHelmet title={'????????? ?? ???????????? ??????'} />
      {alertVisible && <Alert onClose={closeModal}>{alertMessage}</Alert>}
      <div className="contents">
        <div className="container" id="container">
          <div className="login">
            <h2 className="login__title">????????? ?? ???????????? ??????</h2>
            <p className="login__desc">
              ?????????????????????????? ???????????? ???????????????? <br />
              <span>???????????? ????????? ???????????? ??????????????? ????????? ??? ????????????.</span>
            </p>
            <div className="login__search_box">
              <ul className="login__tab search_type">
                <li className={tabState === 'id' ? 'current' : ''}>
                  <a href="javascript:void(0)" onClick={() => setTabState('id')}>
                    ????????? ??????
                  </a>
                </li>
                <li className={tabState === 'password' ? 'current' : ''}>
                  <a href="javascript:void(0)" onClick={() => setTabState('password')}>
                    ???????????? ??????
                  </a>
                </li>
              </ul>

              <div className="tabResult">
                {!result ? (
                  <div className="result_cont tab2 on">
                    <div className={`group ${emptySearchValue ? 'error' : ''}`}>
                      <div className="inp_box">
                        <label className="inp_desc" htmlFor="loginName">
                          <input
                            type="text"
                            id="loginName"
                            className="inp"
                            placeholder="&nbsp;"
                            autoComplete="off"
                            value={tabState === 'id' ? searchValue.memberName : searchValue.email}
                            tabIndex={1}
                            onChange={(e) =>
                              onChangeValues(tabState === 'id' ? 'memberName' : 'email', e.target.value.trim())
                            }
                          />
                          {tabState === 'id' ? (
                            <span className="label">
                              ??????<span>(???????????? ?????? ???????????????.)</span>
                            </span>
                          ) : (
                            <span className="label">
                              ????????? ?????????<span>(??? : sony@sony.co.kr)</span>
                            </span>
                          )}
                          <span className="focus_bg" />
                        </label>
                      </div>
                      <div className="error_txt">
                        <span className="ico" />
                        ????????? ????????? ?????????. (???????????? ?????? ???????????????.)
                      </div>
                    </div>
                    <div className={`group btn_type ${emptyMobile ? 'error' : ''}`}>
                      <div className="inp_box">
                        <label className="inp_desc" htmlFor="phonenumber">
                          <input
                            type="text"
                            id="phonenumber"
                            className="inp"
                            placeholder=" "
                            autoComplete="off"
                            tabIndex={2}
                            value={searchValue.mobileNo}
                            onChange={(e) => onChangeValues('mobileNo', e.target.value.trim())}
                          />
                          <span className="label">
                            ????????? ??????<span>(-?????? ???????????????.)</span>
                          </span>
                          <span className="focus_bg" />
                        </label>
                        <div className="btn_box">
                          {authSent && authCheck == false ? (
                            <button
                              type="button"
                              className={`btn btn_default`}
                              onClick={() => {
                                if (authAvailable === true) {
                                  //???????????? ??????
                                  let now = new Date().getTime();
                                  const target = new Date(now + 3 * 60000);
                                  setTime(179);
                                  setExpireAt(target);

                                  //???????????? ??????
                                  _sendSMS(searchValue.mobileNo);
                                }
                              }}
                            >
                              ?????????
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={`btn ${
                                authAvailable == true && authCheck == false ? 'btn_primary' : 'btn_disable'
                              }`}
                              onClick={() => {
                                if (authAvailable === true) {
                                  //???????????? ??????
                                  let now = new Date().getTime();
                                  const target = new Date(now + 3 * 60000);
                                  setTime(179);
                                  setExpireAt(target);

                                  //???????????? ??????
                                  _sendSMS(searchValue.mobileNo);
                                }
                              }}
                            >
                              ????????????
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="error_txt">
                        <span className="ico" />
                        ????????? ????????? ??????????????????. (-?????? ???????????????.)
                      </div>
                    </div>
                    {authSent === true && (
                      <div className="group btn_type">
                        <div className="inp_box">
                          <label className="inp_desc" htmlFor="certifynumber">
                            <input
                              type="text"
                              id="certifynumber"
                              className="inp"
                              placeholder=" "
                              autoComplete="off"
                              tabIndex={6}
                              value={authCode}
                              onChange={(e) => {
                                setAuthCode(e.target.value);
                              }}
                              readOnly={authCheck}
                            />
                            <span className="label">????????????</span>
                            {authCheck === false && (
                              <span className="timer" id="timer">
                                {timeFormat(time)}
                              </span>
                            )}
                            <span className="focus_bg" />
                          </label>
                          <div className="btn_box">
                            <button
                              type="button"
                              className={`btn ${authCheck !== true ? 'btn_primary' : 'btn_disable'}`}
                              onClick={() => {
                                if (authCheck !== true) {
                                  if (time === 0) {
                                    openAlert('??????????????? ?????????????????????. ????????? ??? ??????????????????.');
                                  } else {
                                    if (authCode === '') {
                                      openAlert('??????????????? ??????????????????.');
                                      return;
                                    }
                                    _verifySMS(searchValue.mobileNo, authCode, 'JOIN');
                                  }
                                }
                              }}
                            >
                              ??????
                            </button>
                          </div>
                        </div>
                        <div className="certify_txt">??? ???????????? ????????? ??????????????? ?????????????????????.</div>
                      </div>
                    )}
                    <div className="btn_box full">
                      <button type="button" className="btn btn_dark" onClick={() => searchMember()}>
                        ??????
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="id_result">
                    <span className="ico_id_result"></span>
                    <p className="info">???????????? ????????? ????????? ?????? ???????????????.</p>
                    <p className="mailaddress">{result}</p>
                    <div className="btn_box full">
                      <Link to={'/member/login'} className="btn btn_dark">
                        ?????????
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className="caution_txt">
                <p>?? ???????????? ????????? ???????????? ?????? ?????? ????????? ?????? ??? ????????????.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
