describe("Login Test", () => {

  it("should login user successfully", () => {

    // Intercept login request
    cy.intercept("POST", "**/auth/login").as("login");

    // Intercept workspace fetch request
    cy.intercept("GET", "**/workspaces").as("workspaces");

    // Visit login page
    cy.visit("http://localhost:5173/login");

    // Enter email
    cy.get('input[type="email"]')
      .type("test13@gmail.com");

    // Enter password
    cy.get('input[type="password"]')
      .type("123456");

    // Click login button
    cy.get("button[type='submit']").click();

    // Wait for login API
    cy.wait("@login").then((interception) => {

      expect(interception.response.statusCode)
        .to.eq(200);

    });

    // Verify dashboard redirect
    cy.location("pathname", { timeout: 10000 })
      .should("eq", "/dashboard");

    // Wait for workspace API
    cy.wait("@workspaces").then((interception) => {

      expect(interception.response.statusCode)
        .to.eq(200);

    });

  });

});