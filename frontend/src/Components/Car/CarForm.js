import React from 'react';
import axios from 'axios';

class CarForm extends React.Component {
    
    submitCar(event) {
        axios.post('http://localhost:4000/cars', {
            name: this.refs.carName.value,
            brand: this.refs.brand.value,
            year: this.refs.year.value
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() { 
        return (
            <form onSubmit={this.submitCar.bind(this)} >
                <div className="form-group">
                    <label htmlFor="inputName">Name</label>
                    <input type="text" className="form-control" id="name" ref="carName" required/>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputBrand">Brand</label>
                        <input type="text" className="form-control" id="brand" ref="brand" required/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="inputYear">Year</label>
                        <input type="text" className="form-control" id="year" ref="year" required/>
                    </div>
                 </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
         );
    }
}
 
export default CarForm;