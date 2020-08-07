import React from 'react';
import axios from 'axios';
import './App.css';
import CarList from './Car/CarList';
import CarForm from './Car/CarForm';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: []
    }
  }

  componentDidMount() {
    const url = 'http://localhost:4000/cars';

    axios.get(url)
      .then((Response) => {
        this.setState({
          cars: Response.data
        })
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="App">
        <div className="container-fluid">
          <div className="row navbar-row">
            <nav className="navbar">
              <span className="navbar-brand mb-0 h1">Knowledge Base for Automobiles</span>
            </nav>
          </div>
          <div className="body">
            <div className="row">
              <div className="col-7 mr-5">
                <CarList cars={this.state.cars}
                  updateCurrentCar={this.updateCurrentCar}
                />
              </div>
              <div className="col-4 ml-3 form-area">
                <div className="row nav"><h3>Add A New Car</h3></div>
                <div className="row nav"><CarForm /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
