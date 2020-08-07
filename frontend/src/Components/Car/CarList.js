import React from 'react';
import moment from 'moment';

const CarList = (props) => {
    return ( 


        <div>
            <div className="accordion" id="accordion">
                {props.cars.map((item) => (
                    <div className="card" key={item._id}>
                        <div className="card-header" id={"heading"+item._id}>
                        <h2 className="mb-0 car-name">
                            <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target={"#collapse"+item._id}  aria-expanded="true" aria-controls={"#collapse"+item._id} >
                                {item.name}
                            </button>
                        </h2>
                        </div>

                        <div id={"collapse"+item._id} className="collapse" aria-labelledby={"heading"+item._id} data-parent="#accordion">
                        <div className="card-body">
                           <div>Brand:</div><div className="brand">{item.brand}</div>
                           <div>Year:</div><div className="year"> {moment(item.year).format('YYYY')}</div> 
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>



        // <div>
        //     <ul className="list-group">
        //         <li className="list-group-item header"><h4>Cars</h4></li>
        //         {props.cars.map((item) => (
        //             <a href="#!" className="list-group-item" key={item._id}
        //             onClick={props.updateCurrentCar.bind(this, item)}>
        //                 {item.name}
        //             </a>
        //         ))}
        //     </ul>
        // </div>
     );
}
 
export default CarList;