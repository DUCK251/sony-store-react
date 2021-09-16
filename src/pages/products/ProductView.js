import { React ,useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router';
import { getEventByProductNo } from '../../api/display';

//SEO
import SEOHelmet from '../../components/SEOHelmet';

//lib
import SwiperCore, { Navigation, Pagination, Scrollbar, Autoplay, Controller } from 'swiper/core';

//lib-css
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import "swiper/swiper.scss"

//api
import { getProductDetail, getProductOptions, getProductSearch } from "../../api/product";

//css
import "../../assets/scss/contents.scss"
import "../../assets/scss/product.scss"

//context
import GlobalContext from '../../context/global.context';

//util
import {useWindowSize} from '../../utils/utils';
import { getInfoLinks, mapContents } from '../../const/productView';
import { getMainSliderStyle } from '../../utils/product';


import MainImage from '../../components/products/MainImage';
import TobContent from '../../components/products/ViewTopContent';
import RelatedProducts from '../../components/products/RelatedProducts';
import Event from '../../components/products/Event';
import BottomContent from '../../components/products/ViewBottomContent';




export default function ProductView({ match, ...props }) {
  const { productNo } = match.params;
  const history = useHistory();

  //ui
  const [headerHeight, setHeaderHeight] = useState(0);
  const size = useWindowSize();

  SwiperCore.use([Navigation, Pagination, Scrollbar, Autoplay, Controller]);

  useEffect(()=>{
    const header = document.getElementsByClassName("header").clientHeight;
    setHeaderHeight(header);
  },[]);

  //data
  
  const [productData, setProductData] = useState();
  const [productOptions, setProductOptions] = useState();
  const [contents, setContents] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productEvents, setProductEvents] = useState([]);

  // product init data

  const mapProductData = useCallback(([productData, optionData]) => {
    setProductData(productData);
    setProductOptions(optionData);
    setContents(mapContents(productData.baseInfo));
  }, []);

  const fetchProductData = useCallback(async (productNo) => {
    const ret = await  Promise.all([
      getProductDetail(productNo),
      getProductOptions(productNo),
    ]);
    mapProductData(ret.map(({ data }) => data));
  }, []);

  const fetchRelatedProducts = useCallback(async (categories) => {
    if (!categories) return;
    
    const ret = await getProductSearch({
      'order.by': 'POPULAR',
      categoryNos: categories
                      .flatMap(({ categories }) => categories)
                      .flatMap(({ categoryNo }) => categoryNo)
                      .join()
    });
    setRelatedProducts(ret.data.items);
  }, []);

  const fetchEvent = useCallback(async productNo => {
    if (!productNo) return;

    const ret = await getEventByProductNo({ pathParams: { productNo }});
    setProductEvents(ret.data);
  }, [])

  useEffect(() => productNo > 0 && fetchProductData(productNo), [fetchProductData, productNo]);
  useEffect(() => {
    if (!productData?.categories) return;
    fetchRelatedProducts(productData?.categories);
    fetchEvent(productNo);
  }, [fetchRelatedProducts, fetchEvent, productNo, productData?.categories])

  //
  const showProductDetail = useMemo(() => (headerHeight > 0 || size.height < 1280) && productData, [headerHeight, size.height, productData] )

    return (
      <>        
        <SEOHelmet title={"상품 상세"} />
        <div className="contents product">
        {
          showProductDetail &&
          <div className="product_view_wrap" style={{backgroundColor:"#fff"}}>
            <div className="product_view_main">
              <div className="prd_main_slider" style={getMainSliderStyle(size)}>
                <MainImage imageUrls={ productData.baseInfo.imageUrls } />
              </div>
              <TobContent 
                baseInfo={productData.baseInfo}
                deliveryFee={productData.deliveryFee}
                price={productData.price}
                options={productOptions?.flatOptions}
                productNo={productNo}
              />
            </div>
            <RelatedProducts 
              products={relatedProducts}
            />
            {
              productEvents.length > 0 && <Event events={productEvents} />
            }
            <div className="product_cont full">
              <div className="relation_link">
                <ul className="link_inner">
                  {
                    getInfoLinks().map(({
                      name,
                      href,
                      imgUrl,
                      label
                    }) => (
                      <li key={ name }>
                        <a 
                          href={href} 
                          className="link_btn" 
                          rel="noreferrer"
                          target="_blank" 
                          title="새 창 열림"
                        >
                          <i className="ico">
                            <img src={ imgUrl } alt={ name } />
                          </i>
                          <span className="link_txt">{ label }</span>
                        </a>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
            {/* 제품 탭 정보 */}
            <BottomContent 
              contents={contents}
            />
          </div>
        }
        </div>
      </>  
    )
}