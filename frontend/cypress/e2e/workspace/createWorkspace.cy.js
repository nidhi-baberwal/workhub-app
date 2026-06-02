describe("Workspace Test", ()=> {
    it("should create a worksapce", ()=> {


// Login API
cy.intercept("POST", "**/auth/login").as("login");

// Workspace APIS
cy.intercept("GET", "**/workspaces").as("getworkspaces");
cy.intercept("POST", "**/workspaces", (req) => {
console.log("WORKSPACE API HIT", req.body);
  }).as("createWorkspace");

// Visit login page
cy.visit("http://localhost:5173/login");

// Login
cy.get('input[type="email"]')
  .type("test13@gmail.com");

cy.get('input[type = "password"]')
  .type("123456");
    
cy.get("button[type ='submit']").click();
  
// Wait Login
cy.wait("@login");

// Verify dashboard
cy.location("pathname", {timeout: 10000})
  .should("eq", "/dashboard");

// Wait existing workspaces Load
cy.wait("@getworkspaces");
  
// Open create workspace page
cy.contains("Create Workspace").first().click();

// Verify page opened
cy.location("pathname")
  .should("eq", "/create-workspace");

// Type workspace name
cy.get('input[placeholder="workspace name"]')
  .type("Cypress Workspace");

// Intercept create request
cy.intercept("POST", "**/workspaces")
  .as("createWorkspace");

// Click actual submit button
cy.get(".workspace-btn").click();
  
// Wait create workspace API
  cy.wait("@createWorkspace").then((interception) => {

     expect(interception.response.statusCode)
        .to.eq(201);

    });
  
   //verify workspace visible
   cy.contains("Cypress Workspace")
     .should("exist"); 
    });
});