import { Selector } from 'testcafe';

// Define the page and fixture

fixture `Todo Test`
    .page("http://mialybaek.dk/todo/test/")
    .beforeEach(async t => {
        await t.setNativeDialogHandler(() => true);
    });

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


