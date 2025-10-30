import './style.css'
//import { setupCounter } from './counter.ts'   -> kan bruges til modules



//---------------- 1. INTERFACE & VARIABLES -------------------------------------------------------//

// (interfaces can only be objects)
// defining an interface
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string | null;
}

// array of objects that follow the Todo interface
let todos: Todo[] = []; 


// selecting fixed elements from the DOM
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoDueDateInput = document.getElementById('todo-due-date') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.querySelector('.todo-list') as HTMLUListElement;
const totalEl = document.getElementById('total-count') as HTMLElement | null;
const completedEl = document.getElementById('completed-count') as HTMLElement | null;
const overdueEl = document.getElementById('overdue-count') as HTMLElement | null;
const progressBar = document.getElementById('progress-bar') as HTMLElement;
const messageEl = document.getElementById('motivation-message') as HTMLElement;




//---------------- 2. LOCALSTORAGE FUNCTIONS -------------------------------------------------------//
// Feature 1
// function to save todos to localStorage
const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos));   // convert array to string and store it
}

// function to load todos from localStorage
const loadTodos = () => {
  const saved = localStorage.getItem('todos');            // get the saved todos string  
  if (saved) {
    todos = JSON.parse(saved).map((todo: any) => ({       // parse the string back to array
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      dueDate: todo.dueDate || null,                      // sikrer at alle todos har dueDate
    }));
  }
}




//---------------- 3. CRUD-FUNKTIONER --------------------------------------------------------------//

// --- Add Todo ---
const addTodo = (text:string) => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text,
    completed: false,
    dueDate: todoDueDateInput.value || null
  }
  todos.push(newTodo);                        // push new todo into array
  saveTodos();                                // save updated array to localStorage
  console.log("check to see if push works:", todos);
  renderTodos();                              // call renderTodos to update the list in the DOM  
}

// --- Form Submit Listener ---
todoForm.addEventListener('submit', (event:Event) => {
  event.preventDefault();              // stops reloading of page, so we store stuff in array and it doesn’t delete when updating
  const text = todoInput.value.trim(); // trim removes spaces before and after text
  if (text !== '') {                   // if the input isn’t empty, add the todo
    addTodo(text)        
    todoInput.value = '';              // clear the input field after adding todo
    todoDueDateInput.value = '';       // clear the due date input field after adding todo
  }
})

// --- Remove Todo ---
const addRemoveButtonListener = (li:HTMLLIElement, id:number) => {
  const removeButton = li.querySelector('button') as HTMLButtonElement; // select the button inside the li
  removeButton?.addEventListener('click', () => {                       // add event listener to the button
    removeTodo(id);                                                     // call removeTodo with the id of the todo to be removed
  })                                              
}

const removeTodo = (id:number) => {
  todos = todos.filter(todo => todo.id !== id);      // filter out the todo with the matching id
  saveTodos();                                       // save updated list to localStorage
  renderTodos();                                     // re-render the list after removing the todo
}

// --- Toggle Completed ---
// Feature 2
const addToggleCompleteListener = (li: HTMLLIElement, id: number) => {
  const span = li.querySelector('span') as HTMLSpanElement; // select the text span inside the li
  span?.addEventListener('click', () => {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo   // toggle completed value
    );
    saveTodos();      // save updated state to localStorage
    renderTodos();    // re-render to update styling
  });
};




//---------------- 4. HELPER-FUNKTIONER -------------------------------------------------------------//

// --- Check if overdue ---
// Feature 3
const isOverdue = (dueDate: string) => {                          
  const today = new Date().toISOString().split('T')[0];     // get today's date in YYYY-MM-DD format
  return dueDate < today;                                   // return true if dueDate is before today
}

// --- Update Stats ---
// Feature 4  
const updateStats = () => {
  if (!totalEl || !completedEl || !overdueEl) return;       // safety check if elements exist

  const total = todos.length;                               // total number of todos
  const completed = todos.filter(todo => todo.completed).length;    // number of completed todos
  const overdue = todos.filter(todo => todo.dueDate && isOverdue(todo.dueDate) && !todo.completed).length;    // number of overdue todos

  totalEl.textContent = `Total: ${total}`;                  // update the text content of the elements
  completedEl.textContent = `Completed: ${completed}`;      // update completed count
  overdueEl.textContent = `Overdue: ${overdue}`;            // update overdue count
};

// --- Progress Bar ---
// Feature 5
const updateProgressBar = () => {
  if (!progressBar) return;                                 // safety check if element exists         

  const total = todos.length;                               // total number of todos
  const completed = todos.filter(todo => todo.completed).length;    // number of completed todos
  const progress = total > 0 ? (completed / total) * 100 : 0;       // calculate progress percentage

  progressBar.style.width = `${progress}%`;                         // update the width of the progress bar                          
};

// --- Motivational Message ---
// Feature 6
const updateMotivation = () => {
  if (!messageEl) return;                                               // safety check if element exists       

  const total = todos.length;                                           // total number of todos 
  const completed = todos.filter(todo => todo.completed).length;        // number of completed todos
  const percent = total > 0 ? (completed / total) * 100 : 0;            // calculate completion percentage

  let message = "Let's get started!";                                   // default message          

  if (percent === 100) message = "All done! Great job!";                // messages based on completion percentage
  else if (percent >= 75) message = "You're almost there!";
  else if (percent >= 50) message = "Almost there, stay focused!";
  else if (percent >= 25) message = "Good progress, keep it up!";
  else if (percent >= 1) message = "Keep going, you're doing great!";

  messageEl.textContent = message;
};

// --- Sort Todos by Status ---
// Feature 7
const getSortedTodos = (): Todo[] => {                                                        
  return [...todos].sort((a: Todo, b: Todo) => {                                // create a copy of array and sort it                      
    const getPriority = (todo: Todo): number => {                               // function to determine priority  
      if (todo.dueDate && isOverdue(todo.dueDate) && !todo.completed) return 1; // Overdue    
      if (!todo.completed) return 2;                                            // Active                                                
      return 3;                                                                 // Completed                                                                  
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) return priorityA - priorityB;                  // if priorities differ, put lower priority first, 1,2,3

    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);      // sort by due date if same priority

    return 0;                                                                   // maintain original order if no due dates       
  });
};




//---------------- 5. UI-OPDATERINGER --------------------------------------------------------------//

const renderTodos = () => {
  todoList.innerHTML = '';                  // clear the list before re-rendering
  
  const sortedTodos = getSortedTodos();     // get todos sorted by status
  sortedTodos.forEach((todo) => {           // loop through each todo in the array
    const li = document.createElement('li') // create a new list item for each todo
    li.className = 'todo-item'              // add a class for styling

    // Add classes based on status
    const completedClass = todo.completed ? 'completed' : '';
    const overdueClass = todo.dueDate && isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : '';

    // Dynamic HTML elements inside the li
    li.innerHTML = `
      <span class="${completedClass} ${overdueClass}">
        ${todo.text} ${todo.dueDate ? '- Due: ' + todo.dueDate : ''}
      </span>   
      <button>Remove</button>
    `;

    addRemoveButtonListener(li, todo.id);   
    addToggleCompleteListener(li, todo.id); 
    todoList.appendChild(li);               
  })

  updateStats();         
  updateProgressBar();   
  updateMotivation();    
};




//---------------- 6. INITIAL LOAD --------------------------------------------------------------//

loadTodos();     
renderTodos();   
