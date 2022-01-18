describe("addEquipment", () => {
  it("user wants to add equipment", () => {
    //login
    cy.visit("localhost:3000");
    cy.findByRole("textbox").clear().type("koenraad@marinminds.com");
    cy.findByDisplayValue(/marinminds2020#/i)
      .clear()
      .type("Mm%12345");

    //go to PMS module
    cy.findByRole("button", { name: /login/i }).click();
    cy.findByRole("menuitem", { name: /ellipsis/i }).click();
    cy.findByRole("link", { name: /reconciliation pms/i }).click();

    //Go to task form and add task
    cy.findByRole("button", { name: /add equipment/i }).click();
    cy.findByRole("textbox", { name: /name/i }).type("dummydata");
    cy.findByRole("textbox", { name: /supplier/i }).type("dummydata");
    cy.findByRole("textbox", { name: /make/i }).type("dummydata");
    cy.findByRole("textbox", { name: /categorie/i }).type("dummydata");
    cy.findByRole("textbox", { name: /subcategory/i }).type("dummydata");
    cy.findByRole("textbox", { name: /model/i }).type("dummydata");
    cy.findByRole("textbox", { name: /partnumber/i }).type("dummydata");
    cy.findByRole("spinbutton", { name: /usage hours/i }).type("100");
    cy.findByText(/create equipment/i).click();
  });
});
