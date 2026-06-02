describe("Task Test", () => {

  it("should create a task", () => {

    // Login API
    cy.intercept("POST", "**/auth/login")
      .as("login");

    // Workspace API
    cy.intercept("GET", "**/workspaces")
      .as("getWorkspaces");

    // Task API
    cy.intercept("POST", "**/tasks/**")
      .as("createTask");

    // Visit login page
    cy.visit("http://localhost:5173/login");

    // Login
    cy.get('input[type="email"]')
      .type("test13@gmail.com");

    cy.get('input[type="password"]')
      .type("123456");

    cy.get("button[type='submit']")
      .click();

    // Wait login
    cy.wait("@login");

    // Verify dashboard
    cy.location("pathname", { timeout: 10000 })
      .should("eq", "/dashboard");

    // Wait workspace load
    cy.wait("@getWorkspaces");

    // Select workspace
    cy.contains("pheonix workspace")
      .click();

    // Type task title
    cy.get('input[placeholder="Enter task..."]')
      .type("Cypress Task");

    // Select member
    cy.get(".task-select")
      .select(1);

    // Submit task
    cy.contains("Add Task")
      .click();

    // Verify task API
    cy.wait("@createTask").then((interception) => {

      expect(interception.response.statusCode)
        .to.eq(201);

    });

    // Verify task visible
    cy.contains("Cypress Task")
      .should("exist");

  });

});