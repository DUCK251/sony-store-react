import { useEffect, useMemo, useState } from 'react';

import { Link } from 'react-router-dom';
import { toCurrencyString } from '../../../utils/unit';
import { getCouponsSummary } from '../../../api/promotion';

const memberGradeClassName = {
  membership: 'family',
  vip: 'vip',
  vvip: 'vvip',

};

const MemberSummary = ({ tabChange, profile, availablemileage, wishCount }) => {
  const [couponCount, setCouponCount] = useState(0);

  const gradeClassName = useMemo(() => {
    const grade = profile?.memberGradeName?.toLowerCase();
    const key = Object.keys(memberGradeClassName).find(k => k === grade);

    return key ? 'val ' + memberGradeClassName[key] : 'val';

  }, [profile]);

  useEffect(() => {
    Promise.all([
      fetchCouponCount(),
    ]).catch(console.error);
  }, []);

  async function fetchCouponCount () {
    const { data: { usableCouponCnt } } = await getCouponsSummary();
    setCouponCount(usableCouponCnt);
  }

  return (
    <div className="my_user">
      <div className="user_profile">
        <p className="user_name"><span className="name">{profile?.memberName ||
        ''}</span>님
          안녕하세요 :)</p>
        <Link to="/my-page/member" className="user_modify under_line">회원정보
          수정</Link>
      </div>
      <div className="user_info">
        <ul>
          <li className="user_item grade">
            <Link to="/membership/benefit" className="user_tabs">
                      <span className="ico_txt"><span
                        className="txt_arrow">회원등급</span></span>
              <span className="val_txt">
                            <span
                              className={gradeClassName}>{profile?.memberGradeName ||
                            ''}</span>
                        </span>
            </Link>
          </li>
          <li className="user_item mileage">
            <a href="#mileage-tit" className="user_tabs"
               onClick={() => tabChange('mileage')}>
                      <span className="ico_txt"><span
                        className="txt_arrow">마일리지</span></span>
              <span className="val_txt"><span
                className="val">{toCurrencyString(
                availablemileage)}</span>M</span>
            </a>
          </li>
          <li className="user_item coupon">
            <a href="#coupon-tit" className="user_tabs"
               onClick={() => tabChange('coupon')}>
                      <span className="ico_txt"><span
                        className="txt_arrow">쿠폰</span></span>
              <span className="val_txt"><span
                className="val">{couponCount}</span> 장</span>
            </a>
          </li>
          <li className="user_item like">
            <a href="#wish-tit" className="user_tabs"
               onClick={() => tabChange('wish')}>
                      <span className="ico_txt"><span
                        className="txt_arrow">찜</span></span>
              <span className="val_txt"><span
                className="val">{wishCount}</span></span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MemberSummary;