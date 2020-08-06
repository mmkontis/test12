import React from 'react';

const Car = (props) => {
    return ( 
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{props.car.name}</h5>
                <p className="card-text">{props.car.brand} {props.car.year}</p>
                <a href="/" className="btn btn-primary">Search</a>
            </div>
        </div>
    );
}
 
export default Car;