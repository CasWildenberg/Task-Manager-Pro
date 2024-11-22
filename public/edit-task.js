const editTaskContainer = document.getElementById('edit-task');
const submitButton = document.getElementById('edit-submit');

const retreiveTask = () => {
    //Retrieve taskfrom script.js via local storage and remove it after setting it to id.
    console.log("Item in local storage: ", localStorage.getItem('taskToEdit'))
    const task = JSON.parse(localStorage.getItem('taskToEdit'));
    localStorage.removeItem('taskToEdit');

    return task;
}


document.addEventListener('DOMContentLoaded', (event) => {
    const task = retreiveTask();

    const taskNameInput = document.getElementById('edit-task-name');
    const dueDateInput = document.getElementById('edit-due-date');
    const priorityInputs = document.querySelectorAll(`input[name="edit-priority"]`)
    console.log("Priority: ", priorityInputs)
    const completionTimeInput = document.getElementById('edit-completion-time');
    
    taskNameInput.value = task.name;
    dueDateInput.value = task.dueDate;
    completionTimeInput.value = task.completionTime;

    priorityInputs.forEach((radio) => {
        if(radio.value === task.priority) {
            radio.checked = true;
        }
    })

    submitButton.addEventListener('click', (event) => {
        console.log("Submit button clicked.")
        event.preventDefault();

        const id = task.id;
        const name = document.getElementById('edit-task-name').value;
        const dueDate = document.getElementById('edit-due-date').value;
        const completionTime = document.getElementById('edit-completion-time').value;

        //Find the checked radio button and save it's value
        const priorities = document.getElementsByName('edit-priority');
        let selectedPriority = null;
        priorities.forEach(priority => {
        if(priority.checked) {
            selectedPriority = priority.value;}
        })

        fetch(`/api/tasks?id=${id}&name=${name}&dueDate=${dueDate}&priority=${selectedPriority}&completionTime=${completionTime}`, {
            method: 'PUT',
        })
        .then(console.log(`Edit request for task with ID ${id} sent to server`))
        .then(response => response.json())
        .then(({task}) => {
            console.log(`Edited task fetched from server successfully.`)
            const changedTask = document.createElement('div');
            changedTask.innerHTML = `
            <h3>Task editted</h3>
            <h4 class='task-name'>Task: ${task.name}</h4>
            <div class="due-date">Due on: ${task.dueDate}</div>
            <div class="priority-rating">Priority: ${task.priority}</div>
            <div class="completion-time">Time to complete: ${task.completionTime} hours</div>
            `;
            editTaskContainer.appendChild(changedTask);
        })
    })  
})
