import React from 'react';
import axios from 'axios';

class CarForm extends React.Component {

    constructor() {
        super();
        this.nameRef = React.createRef();
        this.brandRef = React.createRef();
        this.yearRef = React.createRef();
    }

    submitCar(event) {
        axios.post('http://localhost:4000/cars', {
            name: this.nameRef.current.value,
            brand: this.brandRef.current.value,
            year: this.yearRef.current.value
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
                    <input type="text" className="form-control" id="name" ref={this.nameRef} required/>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputBrand">Brand</label>
                        <input type="text" className="form-control" id="brand" ref={this.brandRef} required/>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="inputYear">Year</label>
                        <input type="text" className="form-control" id="year" ref={this.yearRef} required/>
                    </div>
                 </div>
                 <div className="text-center submit-button">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
         );
    }
}
 
export default CarForm;