import { useState } from 'react';

// components
import LayerPopup from '../common/LayerPopup';

// stylesheet
import '../../assets/scss/partials/popup/findAddress.scss';

// 주소 찾기 팝업
const FindAddress = () => {
  // LayerPopup 상태관리
  const [visible, setVisible] = useState(true);

  const close = () => {
    setVisible(false);
  };

  const nonMemberOrder = () => {
    console.log('비회원 구매');
    close();
  };
  const memberOrder = () => {
    console.log('회원 구매');
    close();
  };

  return (
    <>
      {visible && <LayerPopup className="find_address" onClose={close}>
        <>
          <p className="pop_tit">우편번호 찾기</p>
          <form className="search_container">
            <input
              type="text"
              placeholder="도로명,지번,건물명 입력"
              className="search_input"
            />
            <button type="submit"
                    className="search_button button button_negative">검색
            </button>
          </form>

          <div className="tip">
            <p className="tit">
              TIP
            </p>
            <p>
              아래와 같이 검색하면 더욱 정확한 결과가 검색됩니다.
            </p>
            <dl>
              <dt>
                도로명 + 건물번호
              </dt>
              <dd>
                예) 영동대로 513, 제주 첨단로 242
              </dd>
            </dl>
            <dl>
              <dt>
                지역명(동/리) + 번지
              </dt>
              <dd>
                예) 삼성동 25, 제주 영평동 2181
              </dd>
            </dl>
            <dl>
              <dt>
                지역명(동/리) + 건물명(아파트명)
              </dt>
              <dd>
                예) 분당 주공, 삼성동 코엑스
              </dd>
            </dl>
          </div>
        </>
      </LayerPopup>}
      {/*   컴포넌트 내부 마크업   */}
    </>
  );
};

export default FindAddress;
