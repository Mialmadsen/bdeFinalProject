import { describe, it, expect } from "vitest";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const addTodo =  (todos: Todo[], text:string) => {
    const newTodo: Todo = {
        id: 123,
        text,
        completed: false
    }
    return [...todos, newTodo];                      //spread operator to return a new array with the new todo added
}

const removeTodo = (todos: Todo[], id:number) => {
    return todos.filter(todo => todo.id !== id);     //filter out the todo with the given id
}

describe('addTodo', () => {
    it('should add a new todo', () => {
        const todos: Todo[] = [];
        const result = addTodo(todos, 'Test todo')   //call addTodo with an empty array and a test todo
        expect(result.length).toBe(1);               //expect the result to have a length of 1
        expect(result[0].text).toBe('Test todo');    //expect the text of the first item of the array to be 'Test todo'
        expect(result[0].completed).toBe(false);     //expect the completed property of the first item to be false
    })
})

//"npx vitest" in terminal to run the tests

describe('removeTodo', () => {
    it('should remove a todo',() => {
        const todos: Todo[] = [{
            id: 123,
            text: 'Test todo',
            completed: false
        },
        {
            id: 456,
            text: 'Another todo',
            completed: false
        }]
        const result = removeTodo(todos, 123);         //call removeTodo with an array of two todos and the id of the first todo
        expect(result.length).toBe(1);                 //expect the result to have a length of 1
        expect(result[0].id).toBe(456);                //expect the id of the first item of the array to be 456
    })

    it('should do nothing if the id is not found'), () => {
        const todos: Todo[] = [{
            id: 123,
            text: 'Test todo',
            completed: false
        },
        {
            id: 456,
            text: 'Another todo',
            completed: false
        }]
        const result = removeTodo(todos, 999)
        expect(result.length).toBe(2);                 //expect the result to have a length of 2
        expect(result[0].id).toBe(123);                //expect the id of the first item of the array to be 123
    }
})