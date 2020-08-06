import React from 'react';

const CarList = (props) => {
    return ( 
        <div>
            <ul className="list-group">
                <li className="list-group-item header"><h4>Cars</h4></li>
                {props.cars.map((item) => (
                    <a href="#!" className="list-group-item" key={item._id}
                    onClick={props.updateCurrentCar.bind(this, item)}>
                        {item.name}
                    </a>
                ))}
            </ul>
        </div>
     );
}
 
export default CarList;