Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Daniela')
    cy.get('#lastName').type('Poletto')
    cy.get('#email').type('email@hotmail.com')
    cy.get('#phone').type('4848484848484')
    cy.get('#open-text-area').type('Teste')

    cy.contains('button', 'Enviar').click()
})
