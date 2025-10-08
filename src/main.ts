import './style.css'
//import { setupCounter } from './counter.ts'   -> kan bruges til modules


//(interfaces can only be objects)
//defining an interface
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

//array of objects that follow the Todo interface
let todos: Todo[] = []; 


//selecting elements from the DOM
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.querySelector('.todo-form') as HTMLFormElement;
const todoList = document.querySelector('.todo-list') as HTMLUListElement;



//---------------- LOCALSTORAGE FUNCTIONS ----------------//

//function to save todos to localStorage
const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos));   //convert array to string and store it
}

//function to load todos from localStorage
const loadTodos = () => {
  const saved = localStorage.getItem('todos');            //get the saved todos (if any)
  if (saved) {                                            //if something is saved, parse it from string to object
    todos = JSON.parse(saved);
  }
}



//---------------- ADD TODO FUNCTION ----------------//

const addTodo = (text:string) => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text,
    completed: false
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
  }
})



//---------------- RENDER TODOS FUNCTION ----------------//

const renderTodos = () => {
  todoList.innerHTML = '';             //clear the list before re-rendering
  
  todos.forEach((todo) => {
    const li = document.createElement('li') //create a new list item for each todo
    li.className = 'todo-item'              //add a class for styling and set the text for the todo
    li.innerHTML = `<span>${todo.text}</span>     
    <button>Remove</button>`;               //add a remove button

    addRemoveButtonListener(li, todo.id);   //add event listener to the remove button
    todoList.appendChild(li)                //append the new list item to the todoList
  })
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



//---------------- INITIAL LOAD ----------------//

loadTodos();     //load any saved todos when the page first loads
renderTodos();   //initial render of the todo list
