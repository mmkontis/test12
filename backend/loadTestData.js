import mongoose from 'mongoose';
import { CarSchema } from './models/carModel';

// Mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/carsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

CarSchema.insertMany([
    {
      "name": "575 M Maranello",
      "brand": "Ferrari",
      "year": "2003-01-01T00:00:00.000Z",
  },
  {
      "name": "M5",
      "brand": "BMW",
      "year": "1998-01-01T00:00:00.000Z",
  },
  {
      "name": "RX8",
      "brand": "Mazda",
      "year": "1997-01-01T00:00:00.000Z",
  },
  {
      "name": "Avalon",
      "brand": "Toyota",
      "year": "2011-01-01T00:00:00.000Z",
  },
  {
      "name": "Gallardo",
      "brand": "Lamborghini",
      "year": "2012-01-01T00:00:00.000Z",
  }
]).then(function(){ 
    console.log("Data inserted")
}).catch(function(error){ 
    console.log(error)
}); 