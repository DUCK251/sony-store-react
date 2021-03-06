import React, { useState, useEffect, useContext } from 'react';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//lib
import SwiperCore, { Navigation, Pagination, Scrollbar, Autoplay, Controller } from 'swiper/core';

//css
import "../../assets/scss/category.scss";
import "../../assets/scss/contents.scss";
import "../../assets/scss/esp.scss";


//lib-css
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import "swiper/swiper.scss"

import GlobalContext from '../../context/global.context';
import { getRegisteredProduct } from '../../api/sony/product';
import { useProfileState } from '../../context/profile.context';
import EspAddCart from '../../components/popup/esp/EspAddCart';
import qs from 'qs';
import { getProductDetail } from '../../api/product';

export default function EspList({history}) {

  const { isLogin } = useContext(GlobalContext);

  if (!isLogin) {
    history.replace('/');
  }

  const { profile } = useProfileState();

  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [initial, setInitial] = useState(false);

  const [targetProduct, setTargetProduct] = useState(null);

  useEffect(async () => {
    if (!profile) {
      return;
    }

    const isExist = await _isExistProduct();
    if (!isExist) {
      history.replace('/');
      return;
    }

    const result = await _getRegisteredProduct();

    setInitial(true);
    setTotalCount(result.totalCount);

    if (pageIndex === 1) {
      setProducts([...result.list]);
    } else {
      setProducts([...products, ...result.list]);
    }
  },[pageIndex, profile]);

  const _isExistProduct = async () => {
    const query = qs.parse(history.location.search, {
      ignoreQueryPrefix: true,
    });

    if (!query?.productNo) {
      return false;
    }

    try {
      const { data } = await getProductDetail(query.productNo);

      if (data?.stock?.stockCnt > 0) {
        return true;
      }
    }
    catch (e) {
      console.error(e);
    }

    return false;
  }

  const _getRegisteredProduct = async () => {
    const query = qs.parse(history.location.search, {
      ignoreQueryPrefix: true,
    });

    const result = {list: [], totalCount: 0};
    const requsetBody = {
      customerid: profile?.memberId || '',
      espProductid: query?.productNo || '',
      rowsPerPage: 10,
      pageIdx: pageIndex
    };

    try {
      const { data } = await getRegisteredProduct({ requsetBody });

      if (data?.errorCode === '0000') {
        result.totalCount = data?.paginationInfo?.totalCount || totalCount;
        result.list = data?.body || [];
      }
    }
    catch (e) {
      console.error(e);

      // const testResponse = {"errorCode":"0000","errorMessage":"??????","responseTime":"2021-10-19 15:52:52","paginationInfo":{"rowsPerPage":10,"pageIdx":1,"totalCount":26},"body":[{"modelcod":"80814680","serialno":"1135699","lastdate":"2021-10-12 17:32:27","slipReceiveDate":"2021-10-12 17:32:28","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-W810","purSgtPsbYn":"Y","mallProductNo":"102007713"},{"modelcod":"80814680","serialno":"1121679","lastdate":"2021-10-12 17:32:28","slipReceiveDate":"2021-10-12 17:32:28","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-W810","purSgtPsbYn":"Y","mallProductNo":"102007713"},{"modelcod":"80814680","serialno":"1122550","lastdate":"2021-10-12 17:32:29","slipReceiveDate":"2021-10-12 17:32:28","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-W810","purSgtPsbYn":"Y","mallProductNo":"102007713"},{"modelcod":"80814680","serialno":"1122536","lastdate":"2021-10-12 17:32:30","slipReceiveDate":"2021-10-12 17:32:28","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-W810","purSgtPsbYn":"Y","mallProductNo":"102007713"},{"modelcod":"80815580","serialno":"4741026","lastdate":"2021-10-12 17:33:59","slipReceiveDate":"2021-10-12 17:33:59","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-HX400V","purSgtPsbYn":"Y","mallProductNo":"102007710"},{"modelcod":"80815580","serialno":"4741131","lastdate":"2021-10-12 17:33:59","slipReceiveDate":"2021-10-12 17:33:59","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-HX400V","purSgtPsbYn":"Y","mallProductNo":"102007710"},{"modelcod":"80815580","serialno":"4741206","lastdate":"2021-10-12 17:33:59","slipReceiveDate":"2021-10-12 17:33:59","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-HX400V","purSgtPsbYn":"Y","mallProductNo":"102007710"},{"modelcod":"80815580","serialno":"4741218","lastdate":"2021-10-12 17:33:59","slipReceiveDate":"2021-10-12 17:33:59","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-HX400V","purSgtPsbYn":"Y","mallProductNo":"102007710"},{"modelcod":"80815381","serialno":"4993898","lastdate":"2021-10-12 17:39:28","slipReceiveDate":"2021-10-12 17:39:28","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-W830","purSgtPsbYn":"Y","mallProductNo":"102007711"},{"modelcod":"80815381","serialno":"4993752","lastdate":"2021-10-12 17:39:28","slipReceiveDate":"2021-10-12 17:39:28","customernr":"2780336","customerid":"scs@test.com","modelname":"DSC-W830","purSgtPsbYn":"Y","mallProductNo":"102007711"}]};
      // testResponse.body = testResponse.body.map((t, i) => ({...t, purSgtPsbYn: i % 3 === 0 ? 'Y' : i % 3 === 1 ? 'E' : 'N'}));
      // result.totalCount = testResponse?.paginationInfo?.totalCount || totalCount;
      // result.list = testResponse?.body || [];
    }

    return result;
  }

  const _openGenuineRegisterSite = () => {
    window.openWindow("https://www.sony.co.kr/scs/handler/SCSWarranty-Start", "_blank");
  }

  const _closePopup = () => {
    setTargetProduct(null);
  }

  // ??? ????????? ??????????????? ???????????? ??? ????????? ??????????????????.
  SwiperCore.use([Navigation, Pagination, Scrollbar, Autoplay, Controller]);

  return (
    <>
      <SEOHelmet title={`?????? ????????? ?????? ESP`} />
      <div className="category">
        <div className="contents">
          <div className="container">
            <div className="content esp_page">
              <div className="common_head first_tit">
                <a href="#" className="common_head_back" onClick={e => {
                  history.goBack();
                  e.preventDefault();
                }}>?????? ????????? ?????? ESP</a>
                <h1 className="common_head_name">??????/????????????/?????? ????????? ??????</h1>
              </div>
              {
                products?.length === 0 &&
                <div className="empty_buy_box">
                  {
                    initial &&
                    <>
                      <i className="empty_buy_ico"></i>
                      <strong className="empty_tit">?????? ????????? ESP??? ????????????.</strong>
                      <p className="empty_desc">My SCS?????? ???????????? ????????? ?????? ???????????????!</p>
                      <div className="button_wrap">
                        <button type="button" className="button button_negative" onClick={() => {
                          _openGenuineRegisterSite();
                        }}>???????????? ????????????</button>
                      </div>
                    </>
                  }

                </div>
              }
              {
                products?.length > 0 &&
                <div className="esp_list_box">
                  <div className="esp_tbl_wrap">
                    <div className="col_table_wrap">
                      <div className="col_table">
                        <div className="col_table_head">
                          <div className="col_table_row">
                                <div className="col_table_cell">?????????</div>
                                <div className="col_table_cell">???????????????</div>
                                <div className="col_table_cell">???????????? ????????? (????????????)</div>
                                <div className="col_table_cell">?????? ????????? ?????? ?????? ??????</div>
                            </div>
                        </div>
                        <div className="col_table_body">
                          {
                            products.map((product, index) => {
                              return <div className="col_table_row" key={`esp-product-${index}`}>
                                <div className="col_table_cell">
                                  <div className="prd_name">{product.modelname}</div>
                                </div>
                                <div className="col_table_cell">
                                  <div className="prd_date">{product.slipReceiveDate}</div>
                                </div>
                                <div className="col_table_cell">
                                  <div className="prd_num">{`${product.lastdate} (${product.serialno})`}</div>
                                </div>
                                <div className="col_table_cell">
                                  {
                                    product.purSgtPsbYn === 'Y' &&
                                    <button className="button button_primary button-s popup_comm_btn" type="button" onClick={() => {
                                      setTargetProduct(product);
                                    }}>?????? ??????
                                    </button>
                                  }
                                  {
                                    product.purSgtPsbYn === 'E' &&
                                    <button className="button button_secondary button-s popup_comm_btn" type="button" disabled>????????????</button>
                                  }
                                  {
                                    product.purSgtPsbYn === 'N' &&
                                    <button className="button button_secondary button-s popup_comm_btn" type="button" disabled>????????????</button>
                                  }
                                </div>
                              </div>
                            })
                          }
                        </div>
                      </div>
                    </div>
                    {
                      products.length < totalCount &&
                      <div className="btn_area">
                        <button type="button" className="btn_more" title="????????? ?????????" onClick={() => {
                          setPageIndex(pageIndex + 1);
                        }}>?????????<span className="ico_plus"></span></button>
                      </div>
                    }
                  </div>
                  <div className="esp_info">
                    <strong className="esp_tit">[??????]</strong>
                    <ul className="list_dot">
                      <li>???????????? ???????????? ???????????? ????????? ????????? ?????? ???????????????.</li>
                      <li>?????? ????????? ????????? ???????????? ??? ?????? ?????? &lt;????????????&gt;????????? ????????????, ??????????????? ???????????? ???????????? ???????????????.</li>
                      <li><em className="color">???????????? : ESP ????????? ????????? ??? ?????? ???????????? ????????? ????????????.</em></li>
                      <li><em className="color">???????????? : ?????????????????? ????????? ???????????? ESP ????????? ???????????? ????????????.</em></li>
                      <li className="bar">????????? ????????? ??????????????? ?????? ?????? ?????? ????????????.</li>
                    </ul>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      {
        targetProduct && 
        <EspAddCart product={targetProduct} onClose={_closePopup} history={history} />
      }
      
    </>
  );
}