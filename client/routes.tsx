import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthProvider/AuthProvider';

export default () => {
  return (
    <Routes>
      <Route path="*" element={<AuthProvider />} />
    </Routes>
  );
};
