const express = require('express');
const app = express();

const { tasks, completedTasks } = require('./data');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

//Get all tasks
app.get('/api/tasks', (req, res, next) => {
    console.log("GET request fired..");
    if(req.query.id) {
        const id = parseInt(req.query.id);
        console.log("ID received by server: ", id);
        const foundTask = tasks.find(task => task.id === id);
        if (foundTask){
            console.log("Sending task: ", foundTask)
            res.status(200).send({taskToEdit: foundTask});
        } else {
            res.status(404).send()
        }
    } else {
        console.log("Sending all tasks...")
        res.status(200).send({tasks: tasks, completedTasks: completedTasks}) //FIXEN ZODAT COMPLETEDTASKS MEEVERZONDEN WORDT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }
    
});

app.post('/api/tasks', (req, res, next) => {

    //Extract all data from the query
    const name = req.query.name;
    const dueDate = req.query.dueDate;
    const priority = req.query.priority;
    const completionTime = req.query.completionTime;

    let idCounter;

    if (tasks.length > 0) {
        idCounter = tasks[tasks.length - 1].id + 1;
    } else {
        idCounter = 1;
    }

    if(name === ''){
        res.status(404).send()
    }

    tasks.push({id: idCounter, name: name, dueDate: dueDate, priority: priority, completionTime: completionTime});
    console.log(tasks);
    res.status(201).send({task: {id: idCounter, name: name, dueDate: dueDate, priority: priority, completionTime: completionTime}})
});

app.put('/api/tasks', (req, res, next) => {
    const id = parseInt(req.query.id);
    console.log(`Task with ID ${id} reived by server to edit`);
    const index = tasks.findIndex(task => task.id === id);

    const name = req.query.name;
    const dueDate = req.query.dueDate;
    const priority = req.query.priority;
    const completionTime = req.query.completionTime;

    if (index !== -1) {
        tasks[index] = {id: id, name: name, dueDate: dueDate, priority: priority, completionTime: completionTime}
        console.log(`Task with ID ${id} was succesfully edited: ${tasks[index]}`);
        res.status(200).send({task: {id: id, name: name, dueDate: dueDate, priority: priority, completionTime: completionTime}})
    } else {
        res.status(404).send(`ID ${id} was not found in tasks`);
    }
})

app.delete('/api/tasks', (req, res, next) => {
    const id = parseInt(req.query.id);
    const index = tasks.findIndex(task => task.id === id);
    
    if (index !== -1) {
        const removedTask = tasks.splice(index,1)[0];
        if(req.query.completed === 'true'){
            completedTasks.push(removedTask);
            console.log('completed tasks: ', completedTasks);
            res.status(200).send({completedTasks: completedTasks});
        } else if (req.query.completed === 'false'){
            res.status(200).send(`Task with ID ${id} was successfully deleted from task list.`)
        }
    } else {
        res.status(404).send(`${id} was not found`)
    }
})



app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}.`);
})