# Univation Assessment

Univation fullstack coding technical challenge. 

## Prerequisites

To run this project you will need:
- node.js
- npm
- mongodb

## Setting Up
This is a guide to replicate and run the application in development mode.

1. Download the repository to your local machine.

2. Open two terminal windows.

3. Open the 'backend' folder in one terminal and execute the following commands to install backend dependencies and insert test data into MongoDB:
```bash
npm install
nodemon ./loadTestData.js --exec babel-no -e js
npm start
```
4. Open the 'frontend' folder in the other terminal and execute the following commands to install frontend dependencies:
```bash
npm install
npm start
```

## Usage

**Backend**

The backend is hosted on http://localhost:4000/.

http://localhost:4000/cars returns all cars stored in the database.

**Frontend**

The frontend is hosted on http://localhost:3000/.

It displays a list of all cars stored in the database. Click on a car to view its details.

The form on the right can be filled and submitted to add a new car to the database.
