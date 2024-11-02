import React from 'react';
import {Routes,Route } from 'react-router-dom'
import './App.css'
import Form from './components/Form';

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Form/>} />
    </Routes>
  );
};

export default App;
