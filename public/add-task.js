const submitButton = document.getElementById('submit-task');
const newTaskContainer = document.getElementById('new-task');

submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const name = document.getElementById('taskName').value;
    const dueDate = document.getElementById('dueDate').value;
    const completionTime = document.getElementById('completionTime').value;

    //Find the checked radio button and save it's value
    const priorities = document.getElementsByName('priority');
    let selectedPriority = null;
    priorities.forEach(priority => {
        if(priority.checked) {
            selectedPriority = priority.value;}
        })
    
    fetch(`/api/tasks?name=${name}&dueDate=${dueDate}&priority=${selectedPriority}&completionTime=${completionTime}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(({task}) => {
        const newTask = document.createElement('div');
        newTask.innerHTML = `
        <h3>Task added</h3>
        <h4 class='task-name'>Task: ${task.name}</h4>
        <div class="due-date">Due on: ${task.dueDate}</div>
        <div class="priority-rating">Priority: ${task.priority}</div>
        <div class="completion-time">Time to complete: ${task.completionTime} hours</div>
        `
        newTaskContainer.appendChild(newTask);
    })
})

//Retreive all data from adding a task
const retreiveData = event => {
    event.preventDefault();

    //Return a task object with all retreived data
    return {
        name: taskName,
        dueDate: dueDate,
        priority: selectedPriority,
        timeToComplete: completionTime
    }
}

//const task = document.getElementById('taskForm').addEventListener('submit', retreiveData());