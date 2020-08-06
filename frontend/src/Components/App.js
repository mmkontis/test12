import React from 'react';
import axios from 'axios';
import './App.css';
import CarList from './Car/CarList';
import Car from './Car/Car';
import CarForm from './Car/CarForm';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [],
      currentCar: {},
    }

    this.updateCurrentCar = this.updateCurrentCar.bind(this);
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

  updateCurrentCar(item) {
    this.setState({
      currentCar: item,
    })
  }


  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">Menu</div>
        </div>
        <div className="row">
          <div className="col-3">
            <CarList cars={this.state.cars}
              updateCurrentCar={this.updateCurrentCar}
            />
          </div>
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
