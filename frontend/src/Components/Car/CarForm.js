import React from 'react';

class CarForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (
            <form>
                <div className="form-group">
                    <label htmlFor="inputName">Name</label>
                    <input type="text" className="form-control" id="name" ref="name" />
                </div>
                <div class="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputBrand">Brand</label>
                        <input type="text" className="form-control" id="brand" ref="brand" />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="inputYear">Year</label>
                        <input type="text" className="form-control" id="year" ref="year" />
                    </div>
                 </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
         );
    }
}
 
export default CarForm;