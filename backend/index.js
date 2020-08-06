import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';

const app = express();
const PORT = 3000;

// Mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/carsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Body parser setup
app.use(bodyparser.urlencoded({ extended: true}));
app.use(bodyparser.json());

app.get('/', (req, res) =>
    res.send(`Node and Express running on port ${PORT}`)
);

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);