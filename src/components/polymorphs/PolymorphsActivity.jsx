import React, { useState } from 'react';
import PropTypes from 'prop-types';
import WrapperCenter from './WrapperCenter';
import PolymorphsActivityTable from './PolymorphsActivityTable';
import PolymorphsActivityTableRow from './PolymorphsActivityTableRow';
import PolymorphsActivityTableRowMobile from './PolymorphsActivityTableRowMobile';
// import './styles/PolymorphsActivity.scss';
import SimplePagination from '../pagination/SimplePaginations';

const tableHead = [
  { labelText: '', className: '' },
  { labelText: 'Name', className: '' },
  { labelText: 'Base Skin', className: '' },
  { labelText: 'Event', className: '' },
  { labelText: 'Price', className: '' },
];

const getRows = (dataObject, dataKeys, ethPrice) =>
  dataKeys.map((elem, i) => {
    const item = dataObject[elem];
    return <PolymorphsActivityTableRow data={item} key={i} ethPrice={ethPrice} />;
  });

const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce(
    (obj, item) => ({
      ...obj,
      [item[key]]: item,
    }),
    initialValue
  );
};

const PolymorphsActivity = (props) => {
  const { mobile, morphEntities, ethPrice } = props;
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);
  const morphEntitiesData = convertArrayToObject(morphEntities, 'id');
  const dataKeys = Object.keys(morphEntitiesData);

  return (
    <WrapperCenter className="polymorphs--activity--wrapper--center">
      <h2>Polymorph Activity</h2>
      {!mobile && (
        <PolymorphsActivityTable
          className="table--polymorphs--activity"
          tableHead={!mobile ? tableHead : []}
          rows={getRows(morphEntitiesData, dataKeys.slice(offset, offset + 5), ethPrice)}
        />
      )}
      {mobile && (
        <div className="mobile--table--polymorphs--activity">
          {dataKeys.slice(offset, offset + 5).map((elem, i) => {
            const item = morphEntitiesData[elem];
            return <PolymorphsActivityTableRowMobile data={item} key={i} ethPrice={ethPrice} />;
          })}
        </div>
      )}
      <div className="pagination__container">
        <SimplePagination
          data={dataKeys}
          perPage={5}
          setOffset={setOffset}
          page={page}
          setPage={setPage}
        />
      </div>
    </WrapperCenter>
  );
};

PolymorphsActivity.propTypes = {
  mobile: PropTypes.bool,
  morphEntities: PropTypes.oneOfType([PropTypes.array]),
  ethPrice: PropTypes.string,
};

PolymorphsActivity.defaultProps = {
  mobile: false,
  morphEntities: [],
  ethPrice: '',
};

export default PolymorphsActivity;
