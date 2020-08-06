import React from 'react';
import './App.css';
import CarList from './Car/CarList';
import Car from './Car/Car';
import CarForm from './Car/CarForm';


class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">Menu</div>
        </div>
        <div className="row">
          <div className="col-3"><CarList /></div>
          <div className="col-9"><Car /></div>
        </div>
        <div className="row">
          <div className="col-12"><CarForm /></div>
        </div>
      </div>
    );
  }
}

export default App;
