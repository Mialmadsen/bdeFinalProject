import './style.css'
//import { setupCounter } from './counter.ts'   -> kan bruges til modules


//(interfaces can only be objects)
//defining an interface
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string | null;
}

//array of objects that follow the Todo interface
let todos: Todo[] = []; 


//selecting elements from the DOM
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoDueDateInput = document.getElementById('todo-due-date') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.querySelector('.todo-list') as HTMLUListElement;



//---------------- LOCALSTORAGE FUNCTIONS ----------------//

//function to save todos to localStorage
const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos));   //convert array to string and store it
}

//function to load todos from localStorage
const loadTodos = () => {
  const saved = localStorage.getItem('todos');            //get the saved todos string  
  if (saved) {
    todos = JSON.parse(saved).map((todo: any) => ({       //parse the string back to array
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      dueDate: todo.dueDate || null, // sikrer at alle todos har dueDate
    }));
  }
}



//---------------- ADD TODO FUNCTION ----------------//

const addTodo = (text:string) => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text,
    completed: false,
    dueDate: todoDueDateInput.value || null
  }
  todos.push(newTodo);                        //push new todo into array
  saveTodos();                                //save updated array to localStorage
  console.log("check to see if push works:", todos);
  renderTodos()                               //call renderTodos to update the list in the DOM  
}



//---------------- FORM SUBMIT LISTENER ----------------//

todoForm.addEventListener('submit', (event:Event) => {
  event.preventDefault();              //stops reloading of page, so we store stuff in array and doesnt delete it when updating
  const text = todoInput.value.trim(); //trim removes spaces before and after text
  if (text !== '') {                   //if the input isnt empty, add the todo
    addTodo(text)        
    todoInput.value = '';              //clear the input field after adding todo
    todoDueDateInput.value = '';       //clear the due date input field after adding todo
  }
})



//---------------- RENDER TODOS FUNCTION ----------------//

const renderTodos = () => {
  todoList.innerHTML = '';             //clear the list before re-rendering
  
  todos.forEach((todo) => {
    const li = document.createElement('li') //create a new list item for each todo
    li.className = 'todo-item'              //add a class for styling

    // Add a class if todo is completed (for styling)
    const completedClass = todo.completed ? 'completed' : '';

    // include completedClass on span & check for overdue

    const overdueClass = todo.dueDate && isOverdue(todo.dueDate) && !todo.completed ? 'overdue' : '';

    li.innerHTML = `
      <span class="${completedClass} ${overdueClass}">${todo.text} ${todo.dueDate ? '- Due: ' + todo.dueDate : ''}</span>   
      <button>Remove</button>
    `;

    addRemoveButtonListener(li, todo.id);   //add event listener to the remove button
    addToggleCompleteListener(li, todo.id); //add event listener to toggle completed state
    todoList.appendChild(li);               //append the new list item to the todoList
  })

  updateStats();   //initial update of stats
  updateProgressBar(); //initial update of progress bar
  updateMotivation(); //initial update of motivational message


}



//---------------- REMOVE TODO FUNCTION ----------------//

const addRemoveButtonListener = (li:HTMLLIElement, id:number) => {
  const removeButton = li.querySelector('button') as HTMLButtonElement; //select the button inside the li
  removeButton?.addEventListener('click', () => {                       //add event listener to the button
    removeTodo(id);                                                     //call removeTodo with the id of the todo to be removed
  })                                              
}

const removeTodo = (id:number) => {
  todos = todos.filter(todo => todo.id !== id);      //filter out the todo with the matching id by going through the array
  saveTodos();                                       //save updated list to localStorage
  renderTodos();                                     //re-render the list after removing the todo
}



//---------------- TOGGLE COMPLETED FUNCTION ----------------//

const addToggleCompleteListener = (li: HTMLLIElement, id: number) => {
  const span = li.querySelector('span') as HTMLSpanElement; //select the text span inside the li
  span?.addEventListener('click', () => {
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo   //toggle completed value
    );
    saveTodos();      //save updated state to localStorage
    renderTodos();    //re-render to update styling
  });
};


//---------------- OVERDUE CHECK FUNCTION ----------------//

const isOverdue = (dueDate: string) => {  // NEW
  const today = new Date().toISOString().split('T')[0];
  return dueDate < today;
}


// ---------------- UPDATE STATS FUNCTION (feature/stats-overview) ---------------- //
const updateStats = () => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const overdue = todos.filter(todo => todo.dueDate && isOverdue(todo.dueDate) && !todo.completed).length;

  const totalEl = document.getElementById('total-count') as HTMLElement | null;
  const completedEl = document.getElementById('completed-count') as HTMLElement | null;
  const overdueEl = document.getElementById('overdue-count') as HTMLElement | null;

  if (totalEl) totalEl.textContent = `Total: ${total}`;
  if (completedEl) completedEl.textContent = `Completed: ${completed}`;
  if (overdueEl) overdueEl.textContent = `Overdue: ${overdue}`;
};

//---------------- PROGRESS BAR ----------------//
const updateProgressBar = () => {
  const progressBar = document.getElementById('progress-bar') as HTMLElement;   // Get the progress bar element
  if (!progressBar) return;                                                     // If it doesn't exist, exit the function 

  const total = todos.length;                                                   // Calculate total todos  
  const completed = todos.filter(todo => todo.completed).length;                // Calculate completed todos
  const progress = total > 0 ? (completed / total) * 100 : 0;                   // Calculate progress percentage

  progressBar.style.width = `${progress}%`;                                     // Update the width of the progress bar 
};

// ---------------- MOTIVATIONAL MESSAGE ---------------- //
const updateMotivation = () => {
  const messageEl = document.getElementById('motivation-message') as HTMLElement;  // Get the motivational message element
  if (!messageEl) return;                                                          // If it doesn't exist, exit the function

  const total = todos.length;                                                      // Calculate total todos    
  const completed = todos.filter(todo => todo.completed).length;                   // Calculate completed todos
  const percent = total > 0 ? (completed / total) * 100 : 0;                       // Calculate completion percentage 

  let message = "Let's get started!";                                              // Default message  

  if (percent === 100) message = "All done! Great job!";                           // If all todos are completed
  else if (percent >= 75) message = "You're almost there!";
  else if (percent >= 50) message = "Almost there, stay focused!";
  else if (percent >= 25) message = "Good progress, keep it up!";
  else if (percent >= 1) message = "Keep going, you're doing great!";

  messageEl.textContent = message;
};



//---------------- INITIAL LOAD ----------------//

loadTodos();     //load any saved todos when the page first loads
renderTodos();   //initial render of the todo list
