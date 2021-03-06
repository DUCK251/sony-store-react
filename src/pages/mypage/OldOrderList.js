import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { addMonth, changeDateFormat } from '../../utils/dateFormat';
import DateBox from '../../components/myPage/DateBox';
import OldOrderListItem from '../../components/myPage/order/OldOrderListItem';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//api
import { getOldOrders } from '../../api/sony/order';

//css
import '../../assets/scss/contents.scss';
import '../../assets/scss/mypage.scss';

export default function OldOrderList() {
  const [searchPeriod, setSearchPeriod] = useState({
    startDate: new Date(addMonth(new Date(), -3)),
    endDate: new Date(),
  });
  const [loadMoreBtnVisible, setLoadMoreBtnVisible] = useState(false);
  const nextPage = useRef(2);

  const [oldOrderProducts, setOldOrderProducts] = useState([]);

  useEffect(() => {
    search({
      startDate: new Date(addMonth(new Date(), -3)),
      endDate: new Date(),
      pageNumber: 1,
      pageSize: 10,
      orderType: null,
    });
  }, []);

  const search = async ({ startDate, endDate, pageNumber, pageSize }) => {
    const schStrtDt = changeDateFormat(startDate, 'YYYY-MM-DD').replaceAll('-', '');
    const schEndDt = changeDateFormat(endDate, 'YYYY-MM-DD').replaceAll('-', '');

    const res = await getOldOrders({
      requsetBody: { schStrtDt, schEndDt, pageIdx: pageNumber, rowsPerPage: pageSize, orderType: null },
    });

    showLoadMoreBtn(res.data.body);
    setOldOrderProducts(res.data.body);
    setSearchPeriod({ startDate, endDate });
    nextPage.current = 2;
  };

  const onClickLoadMore = (e) => {
    e.preventDefault();
    loadMore(nextPage.current, 10);
  };

  const loadMore = async (pageIdx, rowsPerPage) => {
    const { startDate, endDate } = searchPeriod;
    const schStrtDt = changeDateFormat(startDate, 'YYYY-MM-DD').replaceAll('-', '');
    const schEndDt = changeDateFormat(endDate, 'YYYY-MM-DD').replaceAll('-', '');

    const res = await getOldOrders({
      requsetBody: { schStrtDt, schEndDt, pageIdx, rowsPerPage, orderType: null },
    });
    showLoadMoreBtn(res.data.body);
    setOldOrderProducts([...oldOrderProducts, ...res.data.body]);

    nextPage.current += 1;
  };

  // ?????? ???????????? ?????? ?????? loadmore ?????? ??????
  const showLoadMoreBtn = (newOldOrderProducts) => {
    if (newOldOrderProducts.length === 0) {
      setLoadMoreBtnVisible(false);
      return;
    }

    setLoadMoreBtnVisible(true);
  };

  return (
    <>
      <SEOHelmet title={'??????????????? : ?????? ??????/?????? ??????'} />
      <div className="contents mypage">
        <div className="container my">
          <div className="content">
            <div className="common_head">
              <Link to="/my-page/order-list" className="common_head_back">
                ??????/????????????
              </Link>
              <h1 className="common_head_name">?????? ??????/????????????</h1>
            </div>

            <div className="cont recent_order prev_order">
              <div className="tit_head mileage_inquiry">
                <h3 className="cont_tit">2021??? 11??? ?????? ?????? ??????</h3>
                <DateBox search={search} />
              </div>

              <div className="col_table_wrap order_list">
                <div className="col_table">
                  <div className="col_table_head">
                    <div className="col_table_row">
                      <div className="col_table_cell">????????????/??????</div>
                      <div className="col_table_cell">??????</div>
                      <div className="col_table_cell">????????????</div>
                    </div>
                  </div>
                  {oldOrderProducts.length > 0 && (
                    <div className="col_table_body">
                      {oldOrderProducts.map((oldOrderProduct) => (
                        <OldOrderListItem
                          orderid={oldOrderProduct.orderid}
                          createdate={oldOrderProduct.createdate}
                          status={oldOrderProduct.status}
                          seqno={oldOrderProduct.seqno}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {loadMoreBtnVisible && (
                  <div className="my btn_article" style={{ textAlign: 'center' }}>
                    <a href="#" className="more_btn" onClick={onClickLoadMore}>
                      ?????????
                    </a>
                  </div>
                )}

                {/* ?????? ?????? ?????? .col_table_body, .btn_article ?????? ???????????? ?????????.  */}
                {oldOrderProducts.length === 0 && <div className="no-data">????????? ????????????</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
