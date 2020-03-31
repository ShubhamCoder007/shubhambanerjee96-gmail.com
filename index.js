const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

let courses = [
    {
        id: 1,
        name: 'ML'
    },
    {
        id: 2,
        name: 'DL'
    },
    {
        id: 3,
        name: 'CV'
    },
    {
        id: 4,
        name: 'AI'
    }
];


app.get('/', (req, res) => {
    res.send('Shubham Banerjee...');
});

app.get('/api/courses/', (req, res) => {
    //res.send([1,2,3,4,5,6,7,8]);
    //res.send(req.query);
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('Could not find...');
    res.send(course);
});

app.post('/api/courses/', (req, res) => {
    //Joi takes schema and does all the validation
    // const schema = {
    //     name: Joi.string().min(3).required()
    // };
    // const result = Joi.validate(req.body, schema);
    //destructuring 
    const {error} = validateCourse(req.body);

    if(error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    //manual validation
    // if(!req.body.name || req.body.name.length < 2){
    //     res.status(400).send("Name is required with min length of 2");
    //     return;
    // }
   
    const course = {
        id: courses.length + 1,
        name: req.body.name 
    };
    courses.push(course);
    res.send(course);
});


//updating a course, put request
app.put('/api/courses/:id', (req, res) => {
    //find the id, if not valid then 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        res.status(404).send("Could not find...");
        return;
    }

    //validate the data for updation
    // const schema = {
    //     name: Joi.string().min(3).required()
    // }
    // const result = Joi.validate(req.body, schema);
    const {error} = validateCourse(req.body);
    if(error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    //update the data
    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    //find the course, if not found send 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send("could not find...");

    //delete the course
    //find the id of the course in the array
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

const validateCourse = (course) => {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}

const port = process.env.port || 3000;
app.listen(port, () => console.log('Listening...'));