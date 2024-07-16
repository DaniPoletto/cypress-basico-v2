/// <reference types="Cypress" />

// descrição da suite
describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000

    //executa antes de cada teste
    this.beforeEach(function() {
        cy.visit('./src/index.html')
    })

    //descrição do teste
    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const longText = "teste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, testeteste, teste"
        
        // congela relogio
        cy.clock()
        
        cy.get('#firstName').type('Daniela')
        cy.get('#lastName').type('Poletto')
        cy.get('#email').type('email@hotmail.com')
        cy.get('#phone').type('4848484848484')
        cy.get('#open-text-area').type(longText, {delay: 0})

        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        //avança no tempo
        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock()

        cy.get('#firstName').type('Daniela')
        cy.get('#lastName').type('Poletto')
        cy.get('#email').type('email@hotmail,com')
        cy.get('#phone').type('4848484848484')
        cy.get('#open-text-area').type('Teste')

        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('campo telefone continua vazio se preenchido incorretamente', function() {
        cy.get('#phone')
            .type('ghdjjdfjd')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.clock()

        cy.get('#firstName').type('Daniela')
        cy.get('#lastName').type('Poletto')
        cy.get('#email').type('email@hotmail.com')
        cy.get("#phone-checkbox").check()
        cy.get('#open-text-area').type('Teste')

        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName')
            .type('Daniela')
            .should('have.value', 'Daniela')
            .clear()
            .should('have.value', '')

        cy.get('#lastName').type('Poletto')            
            .should('have.value', 'Poletto')
            .clear()
            .should('have.value', '')

        cy.get('#email').type('email@hotmail.com')            
            .should('have.value', 'email@hotmail.com')
            .clear()
            .should('have.value', '')

        cy.get('#phone').type('4848484848484')            
            .should('have.value', '4848484848484')
            .clear()
            .should('have.value', '')
        
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.clock()
        
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product')
            .select('YouTube') //seleciona por texto
            .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product')
            .select('mentoria') //seleciona por valor
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product')
            .select(1) //seleciona por indice
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function($radio) {
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            }) 
    })

    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('sampleFile')

        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function() {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('Talking About Testing').should('be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
    })

    it('preenche a area de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('0123456789', 20)
        
        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)

    })

    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(response) {
                const {status, statusText, body} = response
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })
    })

    it.only('encontra o gato escondido', function() {
        cy.get('#cat')
            .invoke('show')
            .should('be.visible')
        cy.get('#title')
            .invoke('text', 'CAT TAT')
    })

  })
  
