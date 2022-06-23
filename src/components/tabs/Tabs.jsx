import React from "react";
import PropTypes from "prop-types";
import {
  handleTabLeftScrolling,
  handleTabRightScrolling,
} from "../../utils/scrollingHandlers";
import tabArrow from "../../assets/images/tab-arrow.svg";
// import './Tabs.scss';

const Tabs = ({ items }) => (
  <div className="container tabs__wrapper">
    <div className="tabs">
      <ul className="tab_items">
        {items.map((tab, index) =>
          tab.name !== "Hidden" && tab.name !== "Liked" ? (
            <li
              key={tab.name}
              className={tab.active ? "active" : ""}
              aria-hidden="true"
              onClick={() => tab.handler && tab.handler(index, tab.name)}
            >
              {tab.label ? (
                <div className="notification">
                  {tab.name}
                  <span>{tab.label}</span>
                </div>
              ) : (
                <>
                  {tab.name} {tab.length ? <span>{tab.length}</span> : null}
                </>
              )}
            </li>
          ) : tab.length ? (
            <li
              key={tab.name}
              className={tab.active ? "active" : ""}
              aria-hidden="true"
              onClick={() => tab.handler && tab.handler(index, tab.name)}
            >
              {tab.label ? (
                <div className="notification">
                  {tab.name}
                  <span>{tab.label}</span>
                </div>
              ) : (
                <>
                  {tab.name} {tab.length && <span>{tab.length}</span>}
                </>
              )}
            </li>
          ) : (
            <></>
          )
        )}
      </ul>
    </div>
  </div>
);

Tabs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      handler: PropTypes.func,
      active: PropTypes.bool.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};

export default Tabs;
