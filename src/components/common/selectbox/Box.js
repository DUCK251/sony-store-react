import { useRef, useState } from 'react';

export default function BoxSelector({
  selectOptions,
  onToggleHandler,
  onClickHandler,
  display,
  selectedLabel,
  tag,
  open,
}) {
  const [bg, setBg] = useState(null);
  const selectRef = useRef(null);
  const setSelectClassName = () => {
    const currentClassList = selectRef.current.classList;
    const isOpened = currentClassList.contains('open');
    !isOpened ? currentClassList.add('open') : currentClassList.remove('open');
  };
  return (
    <div ref={selectRef} className="select_ui_zone select_zone">
      <div>
        <a
          href="#select"
          className="selected_btn"
          onClick={(event) => {
            onToggleHandler(event);
            setSelectClassName();
          }}
        >
          {bg && (
            <span className="circle_color">
              <span className="c_bg" style={{ background: bg }}></span>
            </span>
          )}
          {selectedLabel}
        </a>
        <div className="select_inner" style={{ display, zIndex: 100 }}>
          <p className="prd_tag">{tag}</p>
          <ul className="select_opt">
            {selectOptions.map((option) => {
              const { label, optionNo } = option;
              return (
                <li key={optionNo}>
                  <a
                    href={`#${label}`}
                    className={`opt_list ${option?.disabled && 'disabled'}`}
                    onClick={(event) => {
                      onClickHandler(event, option);
                      setBg(option?.background);
                    }}
                  >
                    <div className="item">
                      {option?.background && (
                        <span className="circle_color">
                          <span className="c_bg" style={{ background: option?.background }}></span>
                        </span>
                      )}
                      <span className="opt_name">
                        {label}
                        {option?.disabledLabel && ` (${option.disabledLabel})`}
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

BoxSelector.defaultProps = {
  defaultInfo: {
    type: 'box',
    placeholder: '????????? ??????????????????.',
    tag: '??????',
  },
};
