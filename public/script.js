const tasksContainer = document.getElementById('tasks-container')
const completedTasksContainer = document.getElementById('completed-tasks-container')


const renderTasks = (tasks = []) => {
    
    //Reset tasks to render new task list
    tasksContainer.innerHTML = '';


    if (tasks.length > 0) {
        tasks.forEach(task => {
            const newTask = document.createElement('div');
            newTask.className = 'single-task';
            newTask.id = task.id;
            newTask.innerHTML = `
            <h4 class='task-name'>Task: ${task.name}</h4>
            <div class="due-date">Due on: ${task.dueDate}</div>
            <div class="priority-rating">Priority: ${task.priority}</div>
            <div class="completion-time">Time to complete: ${task.completionTime} hours</div>
            <button class="delete-button">
                <img src="/img/trash_can.svg" alt="Delete">
            </button>
            <button class="edit-button">
                <img src="/img/pencil.svg" alt="Edit">
            </button>
            <button class="complete-button">
                <img src="/img/checkmark.svg" alt="Delete">
            </button>
            `
            tasksContainer.appendChild(newTask);
        })
    }

    // After rendering tasks, attach delete button event listeners
    attachDeleteButtons();
    attachEditButtons();
    attachCompletionButtons();

};

const renderCompletedTasks = (completedTasks = []) => {
    
    //Reset tasks to render new task list
    completedTasksContainer.innerHTML = '';
    if(completedTasks.length > 0) {
        completedTasks.forEach(task => {
            const newCompletedTask = document.createElement('div');
            newCompletedTask.className = 'single-task';
            newCompletedTask.id = task.id;
            newCompletedTask.innerHTML = `
                <div class="task-name">${task.name}</div>
            `;
            completedTasksContainer.appendChild(newCompletedTask);
        })
    }
    
       
}

const attachDeleteButtons = () => {
    const deleteButtons = document.querySelectorAll('.delete-button');

    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Delete button clicked!');
            
            //Select ID of the task connected to a specific button for later referral
            const parentElement = button.closest('.single-task');
            const id = parentElement.id;
            console.log("ID of parent element: ", id);

            fetch(`/api/tasks?id=${id}&completed=false`, {
                method: 'DELETE',
            })
            .then(response => {
                if(response.ok) {
                    parentElement.remove();
                    console.log(`Task with id ${id} deleted`)
                } else {
                    console.error('Error deleting task')
                }
            }); 
        });
    });
}

const attachEditButtons = () => {
    const editButtons = document.querySelectorAll('.edit-button');
    
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Edit button clicked');

            //Select ID of the task connected to a specific button for later referral
            const parentElement = button.closest('.single-task');
            const id = parseInt(parentElement.id);
            console.log("ID of parent Element: ", id);

            if(isNaN(id)) {
                console.error("Invalid or no ID retreived from localStorage")
            }
        
            fetch(`/api/tasks?id=${id}`, {
            method: 'GET', 
            })
            .then(response => {

                if(!response.ok) {
                    console.error("Task not found with ID: ", id);
                    throw new Error("Task not found");
                }

                return response.json();
            })
            .then(({taskToEdit}) => {
                console.log("Fetched task: ", taskToEdit)
                localStorage.setItem('taskToEdit', JSON.stringify(taskToEdit));
                window.location.href = 'edit-task.html';
            })
            .catch(error => {
                console.error("Error fetching task: ", error)
            });
        
        })  
    })
}

const attachCompletionButtons = () => {
    const completionButtons = document.querySelectorAll('.complete-button');

    completionButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            console.log('Complete button clicked');

            //Select ID of the task connected to a specific button for later referral
            const parentElement = button.closest('.single-task');
            const id = parseInt(parentElement.id);
            console.log("ID of parent Element: ", id);

            fetch(`/api/tasks?id=${id}&completed=true`, {
                method: 'DELETE',
            })
            .then(response => {

                if (!response.ok) {
                    throw new Error('Error removing task from task list.')
                } 
                return response.json();
            })
            .then(({completedTasks}) => {
                
                console.log('Updated completed tasks:', completedTasks);
                
                parentElement.remove();

                renderCompletedTasks(completedTasks);

                })
                .catch(error => {
                    console.error('Error marking task as complete: ', error)
                })      
        })
    })
}


//Render all tasks into the page after it is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/tasks') //fetch as JSON if /api/tasks is a valid path
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            renderError(response);
        }
    })
    .then(response => {
        renderTasks(response.tasks);
        renderCompletedTasks(response.completedTasks);
        console.log('Renderding all tasks and completed tasks...')
    }) 
    .catch(error => {
        console.error('Error fetching tasks:', error)
    });      
});  























































    


    
