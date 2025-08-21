const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 15000;

const mongoURL = 'mongodb://localhost:27017/todos';

app.use(cors());
app.use(express.json());

// Mongoose Scema
const Task = mongoose.model('Task', new mongoose.Schema({
    text: String,
    compleated: Boolean
}));

// Routes
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
    const task = await Task.create(req.body);
    res.json(task);
});

app.put('/api/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body);
    res.json(task);
});

app.delete('tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// Connect to MongoDB and start sever only when ready
const connectWithRetry = () => {
    console.log('Trying to connect to MongoDB...');
    mongoose.connect(mongoURL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log('Backend runing on port', PORT);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error. Retrying in 5s...', err);
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
