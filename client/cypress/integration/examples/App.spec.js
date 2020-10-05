describe("App render", () => {
  it('clicks the link "type"', () => {
    cy.visit("/screener");

    cy.get("#criteriaButton").click();
  });
});
