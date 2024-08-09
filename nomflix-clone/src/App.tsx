import React from 'react';
import { BrowserRouter as Router, Routes, BrowserRouter, Route } from 'react-router-dom';
import Search from './Routes/Search';
import Tv from './Routes/Tv';
import Home from './Routes/Home';
import Header from './Components/Header';




function App() {
  return (
    <>
    <BrowserRouter>
      <Header/>
      <Routes>
      
        <Route path="/tv" element={<Tv></Tv>}></Route>
        <Route path="/search" element={<Search></Search>}></Route>
        <Route path="/" element={<Home></Home>}></Route>
        < Route path="movies/:id" element={< Home />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
