import React, { useState } from 'react';
import classnames from 'classnames';
import { authUser } from '../../../api/user';

import s from './styles.module.css';

export const AuthPanel = ({ updateUser }) => {
  const [state, setState] = useState({
    username: '',
    password: '',
    loading: false,
  });

  const onChange = ({ target: { value, name } }) => {
    setState(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    const { username, password } = state;
    setState(prev => ({ ...prev, loading: true }));

    const user = await authUser({ username, password });
    localStorage.setItem('token', user.token);
    updateUser(prev => ({ ...prev, user }));
  };

  return (
    <div className="container">
      <h1>AuthPanel</h1>
      <div
        className={classnames({
          [s.form]: true,
          penging: state.loading,
        })}
      >
        <input
          type="text"
          value={state.username}
          onChange={onChange}
          name="username"
        />
        <input
          type="text"
          value={state.password}
          onChange={onChange}
          name="password"
        />
        <button onClick={onSubmit}>Enter</button>
      </div>
    </div>
  );
};
