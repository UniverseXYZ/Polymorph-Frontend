import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router';
import AppContext from '../../ContextAPI';

function AuthenticatedRoute({ component: Component, ...restOfProps }) {
  const { isAuthenticated, isWalletConnected } = useContext(AppContext);
  const accessToken = localStorage.getItem('access_token');

  return accessToken || (isAuthenticated && isWalletConnected) ? (
    <Route {...restOfProps}>
      <Component />
    </Route>
  ) : (
    <Redirect to="/" />
  );
}
AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType(PropTypes.elementType).isRequired,
};
export default AuthenticatedRoute;
