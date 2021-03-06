import React, { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import facebook from 'assets/images/common/ic_facebook.svg';
import instagram from 'assets/images/common/ic_instagram.svg';
import youtube from 'assets/images/common/ic_youtube.svg';
import blog from 'assets/images/common/ic_blog.svg';

import InsurePop from 'components/InsurePop';
import Floating from 'components/common/Floating';
import { useClickOutside, useToggle } from 'hooks';
import { MOBILE_WIDTH } from 'utils/constants';
import { SONY_COMPANY, SONY_FAMILY } from 'const/footer';

export default function Footer({ location, isAppBarEnabled, scrollAction }) {
    const footerStyle = useMemo(() => {
        return location.pathname.includes('/order/sheet') ||
            location.pathname.includes('/product-view')
            ? {
                  zIndex: 100,
                  paddingBottom: '64px',
              }
            : {
                  zIndex: 900,
                  paddingBottom: '64px',
              };
    }, [location]);

    const windowWidth = window.innerWidth;
    const isMobile = useMemo(() => windowWidth <= MOBILE_WIDTH, [windowWidth]);

    const [isPop, setPop] = useState(false);

    const [pcActive, setPcActive] = useToggle(false);

    const [moActive, setMoActive] = useToggle(false);

    const footerRef = useRef(null);
    useClickOutside(footerRef, () => setPcActive(false));

    const selectRef = useRef(null);

    let browser = window;
    // child window.
    let popup = null;
    // interval
    let timer = null;

    // This function is what the name says.
    // it checks whether the popup still open or not
    function watcher() {
        // if popup is null then let's clean the intervals.
        if (popup === null) {
            clearInterval(timer);
            timer = null;
            // if popup is not null and it is not closed, then let's set the focus on it... maybe...
        } else if (popup !== null && !popup.closed) {
            popup.focus();
            // if popup is closed, then let's clean errthing.
        } else if (popup !== null && popup.closed) {
            clearInterval(timer);
            browser.focus();
            // the onCloseEventHandler it notifies that the child has been closed.
            browser.onClose('child was closed');
            timer = null;
            popup = null;
        }
    }

    return (
        <>
            <footer className='footer' style={footerStyle}>
                <Floating
                    isAppBarEnabled={isAppBarEnabled}
                    scrollAction={scrollAction}
                    location={location}
                />
                <div className='footer__inner'>
                    <div className='footer__social__wrap'>
                        <div className='footer__social'>
                            <h3 className='footer__social__title'>FOLLOW US</h3>
                            <div className='footer__social__links'>
                                <a
                                    href={'https://www.facebook.com/sonykorea'}
                                    onClick={window.openBrowser}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='footer__social__link'
                                >
                                    <img src={facebook} alt='facebook' />
                                </a>
                                <a
                                    href={'https://www.instagram.com/sonykorea'}
                                    onClick={window.openBrowser}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='footer__social__link'
                                >
                                    <img src={instagram} alt='instagram' />
                                </a>
                                <a
                                    href={
                                        'https://www.youtube.com/user/sonystyleblog'
                                    }
                                    onClick={window.openBrowser}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='footer__social__link'
                                >
                                    <img src={youtube} alt='youtube' />
                                </a>
                                <a
                                    href={
                                        'https://stylezineblog.com/?intcmp=Main_Blog'
                                    }
                                    onClick={window.openBrowser}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='footer__social__link'
                                >
                                    <img src={blog} alt='blog' />
                                </a>
                            </div>
                        </div>
                        <div className='footer__family'>
                            <div
                                className='footer__family__links'
                                ref={footerRef}
                            >
                                <div
                                    className={`footer__family__link footer__pc ${
                                        pcActive &&
                                        'footer__family__link--active'
                                    }`}
                                >
                                    <button
                                        type='button'
                                        className='footer__family__link__trigger'
                                        aria-label='??????????????? ????????? ?????? ??????'
                                        onClick={() =>
                                            isMobile
                                                ? setMoActive()
                                                : setPcActive()
                                        }
                                    >
                                        Sony Family
                                    </button>
                                    <div className='footer__family__link__inner'>
                                        <h4 className='optgroup__label'>
                                            Sony Family
                                        </h4>
                                        <ul className='optgroup'>
                                            {SONY_FAMILY.map(
                                                ({ url, name }) => (
                                                    <li
                                                        className='option'
                                                        key={`footer-ul-family-${name}`}
                                                    >
                                                        <a
                                                            href={
                                                                window.anchorProtocol +
                                                                url.replace(
                                                                    'https://',
                                                                    '',
                                                                )
                                                            }
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                            onClick={() => {
                                                                setPcActive(
                                                                    false,
                                                                );
                                                                window.openBrowser();
                                                            }}
                                                        >
                                                            {name}
                                                        </a>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                        <h4 className='optgroup__label'>
                                            Family Company
                                        </h4>
                                        <ul className='optgroup'>
                                            {SONY_COMPANY.map(
                                                ({ url, name }) => (
                                                    <li
                                                        className='option'
                                                        key={`footer-ul-company-${name}`}
                                                    >
                                                        <a
                                                            href={
                                                                window.anchorProtocol +
                                                                url.replace(
                                                                    'https://',
                                                                    '',
                                                                )
                                                            }
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                            onClick={() => {
                                                                setPcActive(
                                                                    false,
                                                                );
                                                                window.openBrowser();
                                                            }}
                                                        >
                                                            {name}
                                                        </a>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                                <select
                                    defaultValue='default'
                                    ref={selectRef}
                                    onChange={(e) => {
                                        window.openWindow(e.target.value);
                                        selectRef.current.value =
                                            e.target.value;
                                    }}
                                    className={`footer__family__link footer__mo ${
                                        moActive &&
                                        'footer__family__link--active'
                                    }`}
                                >
                                    <option
                                        value='default'
                                        disabled
                                        hidden
                                        style={{ visibility: 'hidden' }}
                                    >
                                        Sony Family
                                    </option>
                                    <optgroup label='Sony Family'>
                                        {SONY_FAMILY.map(({ url, name }) => (
                                            <option
                                                value={url}
                                                key={`footer-option-family-${name}`}
                                            >
                                                {name}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label='Family Company'>
                                        {SONY_COMPANY.map(({ url, name }) => (
                                            <option
                                                value={url}
                                                key={`footer-ul-company-${name}`}
                                            >
                                                {name}
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                            <a
                                href={window.anchorProtocol + 'www.sony.com/'}
                                onClick={window.openBrowser}
                                className='footer__family__global'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Sony Global
                            </a>
                        </div>
                    </div>
                    <div className='footer__legal'>
                        <div className='footer__legal__links'>
                            <Link
                                to='/footer/terms'
                                className='footer__legal__link'
                            >
                                ????????????
                            </Link>
                            <a
                                href={
                                    window.anchorProtocol +
                                    'www.sony.co.kr/handler/ProductInfo-Start?PageName=jsp/footer/CF_policy.jsp'
                                }
                                onClick={window.openBrowser}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='footer__legal__link privacy'
                            >
                                ????????????????????????
                            </a>
                            <a
                                href='/'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPop(true);
                                }}
                                className='footer__legal__link'
                            >
                                ????????? ?????? ????????????
                            </a>
                            <Link
                                to='/footer/sitemap'
                                className='footer__legal__link'
                            >
                                ????????????
                            </Link>
                        </div>
                        <div className='footer__legal__warning'>
                            <p>
                                ??? ???????????? ???????????? ??????????????? ????????? ?????? ???,
                                ????????? ????????? ????????????, ??????, ?????? ??????
                                ????????????.
                            </p>
                            <p>
                                ???????????? ????????? ????????? ?????? ?????? ?????? ?????????
                                ?????? ????????? ?????? ??????,
                                <br /> KG??????????????? ??????
                                ???????????????(??????????????????)??? ???????????? ??? ????????????.
                                <a
                                    className='escrow'
                                    href={
                                        window.anchorProtocol +
                                        'mark.inicis.com/mark/escrow_popup_v3.php?mid=SonyKoreat'
                                    }
                                    onClick={window.openBrowser}
                                    style={{
                                        backgroundImage:
                                            'url(https://image.inicis.com/mkt/certmark/escrow/escrow_43x43_gray.png)',
                                    }}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    ??????????????? ???????????? ?????????????????? ????????????
                                    ???????????? ??? ????????????.
                                </a>
                            </p>
                        </div>
                    </div>
                    <address className='address'>
                        <span>
                            ??????????????? : ??????????????? ???????????? ??????????????? 10
                            ?????????????????? 24F
                        </span>
                        <span>
                            ????????? ???????????? : 106-81-23810 ??????????????????
                            2012-???????????????-1038 ??????????????????
                        </span>
                        <span>???????????? : Okura Kikuo</span>
                        <span>??????????????????????????? : Okura Kikuo</span>
                        {isMobile ? (
                            <span>
                                <a href='tel:1588-0911'>
                                    TEL : ??????????????? ???????????? 1588-0911
                                </a>
                            </span>
                        ) : (
                            <span>TEL : ??????????????? ???????????? 1588-0911</span>
                        )}
                        <span>
                            E-MAIL :{' '}
                            <a href='mailto:cshelp@sony.co.kr'>
                                cshelp@sony.co.kr
                            </a>
                        </span>
                        <span>
                            Copyright ?? Sony Korea Corporation. All rights
                            reserved.
                        </span>
                    </address>
                </div>
            </footer>

            {isPop === true && <InsurePop setPop={setPop} />}
        </>
    );
}
