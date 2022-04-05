import React from 'react';
import PropTypes from 'prop-types';

const TwitterIcon = ({ width, height, fillColor }) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 1.66066C17.3381 1.94128 16.627 2.1309 15.8794 2.2166C16.6508 1.77503 17.2278 1.08003 17.503 0.261302C16.7783 0.673137 15.9851 0.963023 15.158 1.11836C14.6018 0.550172 13.8651 0.173569 13.0623 0.0470186C12.2594 -0.0795316 11.4354 0.0510517 10.7181 0.418495C10.0007 0.785938 9.43028 1.36968 9.09525 2.0791C8.76022 2.78852 8.67936 3.58391 8.86523 4.3418C7.39683 4.27126 5.96033 3.90611 4.64898 3.27003C3.33762 2.63395 2.18071 1.74117 1.25332 0.649633C0.936228 1.17297 0.753898 1.77973 0.753898 2.42594C0.753544 3.00767 0.903276 3.58049 1.18981 4.09358C1.47634 4.60667 1.89082 5.04416 2.39646 5.36724C1.81005 5.34938 1.23658 5.19778 0.723773 4.92506V4.97056C0.723714 5.78647 1.0187 6.57726 1.55868 7.20877C2.09865 7.84027 2.85036 8.27359 3.68625 8.43519C3.14226 8.57605 2.57192 8.5968 2.01832 8.49587C2.25416 9.19791 2.71355 9.81181 3.33219 10.2516C3.95082 10.6915 4.69772 10.9352 5.46833 10.9487C4.16018 11.9312 2.54461 12.4642 0.881529 12.4618C0.586931 12.4619 0.292582 12.4455 0 12.4125C1.68813 13.451 3.65322 14.0021 5.66018 14C12.454 14 16.168 8.61647 16.168 3.9474C16.168 3.79571 16.164 3.6425 16.1569 3.49081C16.8793 2.99097 17.5029 2.37201 17.9984 1.66293L18 1.66066Z"
      fill={fillColor}
    />
  </svg>
);

TwitterIcon.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fillColor: PropTypes.string,
};

TwitterIcon.defaultProps = {
  width: '16',
  height: '16',
  fillColor: 'black',
};

export default TwitterIcon;