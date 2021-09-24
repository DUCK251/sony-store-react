import '../../assets/css/demo.css';
import '../../assets/scss/demo.scss';

const EstimateSheet = ({ close }) => {
  return (
    <>
      <div className="layer_mask"
           style={{ display: 'block' }}></div>
      <div className="popup_wrap size_l estimate"
           style={{ display: 'block' }}
           tabIndex="0">
        <div className="pop_inner">
          <div className="pop_head">
          <span className="pop_logo">
            {/*<img src="../../images/common/logo.svg" alt="SONY" />*/}
          </span>
          </div>
          <div className="pop_cont scrollH">
            <p className="pop_tit">견 적 서</p>
            <div className="pop_cont_scroll" style={{ height: '303px' }}>
              <div className="simplified_info">
                <div className="simplified_estimate">
                  <p className="date">2021.06.29</p>
                  <p className="tit"><strong>소니코리아 고객님 귀하,</strong><br /> 아래와 같이
                    견적합니다.</p>
                  <div className="estimate_price">
                    <span className="txt">견적금액 :</span>
                    <span className="price_txt"><strong
                      className="price">4,299,000</strong> 원</span>
                    <span className="s_txt">(부가세 포함)</span>
                  </div>
                </div>
                <div className="estimate_corp">
                  <ul className="corp_list">
                    <li className="name"><strong>소니코리아 주식회사</strong></li>
                    <li className="addr">서울특별시 영등포구 여의도동 국제금융로<br />10 원아이에프씨
                      24F
                      (우)150-876
                    </li>
                    <li className="txt">사업자 등록번호 : 106-81-23810</li>
                    <li className="txt"></li>
                    대표자명 : Okura Kikuo 대표 (직인 생략)
                  </ul>
                </div>
              </div>
              <div className="estimate_detail">
                <div className="all_table_wrap">
                  <p className="s_txt_right">* 아래 견적 금액은 구매 시점에 따라 변동될 수
                    있습니다.</p>
                  <div className="col_table_wrap order_list">
                    <div className="col_table">
                      <div className="col_table_head">
                        <div className="col_table_row">
                          <div className="col_table_cell">제품명</div>
                          <div className="col_table_cell">가격/수량</div>
                          <div className="col_table_cell">공급가액(원)</div>
                          <div className="col_table_cell">비고</div>
                        </div>
                      </div>
                      <div className="col_table_body">
                        <div className="col_table_row">
                          <div className="col_table_cell">
                            <div className="prd">
                              <div className="prd_info">
                                <div className="prd_info_name">PLAYSTATION 5
                                  DIGITAL<br />(CFI-1018B01)
                                </div>
                                <p className="prd_info_option line2">4K
                                  HDR(HLG),
                                  Fast Hybrid AF가 탑재된 전문가급 1인치 핸디캠/ LIMITED
                                  EDITION(사일런트 화이트)</p>
                              </div>
                            </div>
                          </div>
                          <div className="col_table_cell prd_price">
                            4,299,000 <span className="won">원</span><br />
                            <span className="count">1개</span>
                          </div>
                          <div className="col_table_cell prd_price">
                            4,299,000 <span className="won">원</span><br />
                            <span className="s_txt">(부가세 포함)</span>
                          </div>
                          <div className="col_table_cell ">
                            &nbsp;
                          </div>
                        </div>
                        <div className="col_table_row">
                          <div className="col_table_cell">
                            <div className="prd">
                              <div className="prd_info">
                                <div className="prd_info_name">ILCE-7RM4</div>
                                <p className="prd_info_option">블랙</p>
                              </div>
                            </div>
                          </div>
                          <div className="col_table_cell prd_price">
                            4,299,000 <span className="won">원</span><br />
                            <span className="count">1개</span>
                          </div>
                          <div className="col_table_cell prd_price">
                            4,299,000 <span className="won">원</span><br />
                            <span className="s_txt">(부가세 포함)</span>
                          </div>
                          <div className="col_table_cell ">
                            &nbsp;
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col_table_foot">
                      <div className="prd_summary">
                        <p className="prd_total_price">최종 합계 금액 <strong
                          className="prd_summary_price">4,299,000 <span
                          className="won">원</span></strong></p>
                      </div>
                    </div>
                    <p className="sign_txt"><span
                      className="orderer">주문자:</span><span
                      className="name"></span><span className="sign">(서명)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="btn_article">
          <button className="button button_negative button-m closed"
                  type="button" onClick={close}>취소
          </button>
          <button className="button button_positive button-m print"
                  type="button">프린트
          </button>
        </div>
      </div>
    </>
  );
};

export default EstimateSheet;