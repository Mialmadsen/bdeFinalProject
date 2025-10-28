import { Selector } from 'testcafe';

// Define the page and fixture

fixture `Todo Test`
    .page("https://todo.mialybaek.dk/test/");

// Test 1: Check if new todo can be added
test("Add new todo", async t => {
    await t
        // Arrange
        .typeText(Selector("#todo-input"), "Buy milk")

        // Act
        .click(Selector('button').withText('Add Todo'))

        // Assert
        .expect(Selector('.todo-list li').withText('Buy milk').exists).ok();
}); 


// Test 2: Check if todo can be removed 
test("Remove todo", async t => {
    await t
        // Arrange
        .typeText(Selector("#todo-input"), "Test remove")
        .click(Selector('button').withText('Add Todo'))

        // Act
        .click(Selector('.todo-list li').withText('Test remove').find('button'))

        // Assert
        .expect(Selector('.todo-list li').withText('Test remove').exists).notOk();
});


// Test 3: Mark todo as completed 
test("Mark todo as completed", async t => {
    await t
        // Arrange
        .typeText(Selector("#todo-input"), "Complete this task")
        .click(Selector('button').withText('Add Todo'))

        // Act
        .click(Selector('.todo-list li span').withText('Complete this task')) // klikker for at markere som completed

        // Assert
        .expect(Selector('.todo-list li span.completed').withText('Complete this task').exists).ok();
});


// Test 4: Check stats update
test("Stats overview updates when adding and completing todos", async t => {
    await t
        // Arrange
        .typeText(Selector("#todo-input"), "Stats test")
        .click(Selector('button').withText('Add Todo'))

        // Assert total vises korrekt
        .expect(Selector('#total-count').innerText).contains('Total:')

        // Act
        .click(Selector('.todo-list li span').withText('Stats test')) // markér completed

        // Assert completed vises korrekt
        .expect(Selector('#completed-count').innerText).contains('Completed');
});


// Test 5: Check sorting order 
test("Todos are sorted by status", async t => {
    // Arrange
    await t
        .typeText(Selector("#todo-input"), "Overdue task")
        .typeText(Selector("#todo-due-date"), "2024-01-01") // en gammel dato
        .click(Selector('button').withText('Add Todo'))
        .typeText(Selector("#todo-input"), "Active task")
        .click(Selector('button').withText('Add Todo'))
        .typeText(Selector("#todo-input"), "Completed task")
        .click(Selector('button').withText('Add Todo'));

    // Markér den sidste som completed
    await t
        .click(Selector('.todo-list li span').withText('Completed task'));

    // Assert
    await t
        .expect(Selector('.todo-list li:nth-child(1) span').textContent).contains("Overdue task")
        .expect(Selector('.todo-list li:nth-child(2) span').textContent).contains("Active task")
        .expect(Selector('.todo-list li:nth-child(3) span').textContent).contains("Completed task");
});