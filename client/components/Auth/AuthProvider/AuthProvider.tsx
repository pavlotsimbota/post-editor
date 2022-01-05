import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { AuthPanel } from '../AuthPanel/AuthPanel';
import { App } from '../../App/App';
import { fetchUser } from '../../../api/user';

export const AuthProvider = () => {
  const [state, setState] = useState({ loading: false, user: {} as any });

  const getUser = async () => {
    if (typeof window === 'undefined' || !localStorage.getItem('token')) return;
    setState(prev => ({ ...prev, loading: true }));

    const user = await fetchUser();
    setState(prev => ({ ...prev, loading: false, user }));
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div
      className={classnames({
        pending: state.loading,
      })}
    >
      {!!state.user.token && <App />}
      {!state.user.token && <AuthPanel updateUser={setState} />}
    </div>
  );
};
