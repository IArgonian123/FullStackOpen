describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.signIn({
      name: 'John Doe',
      username: 'johnny1932',
      password: 'tr3nCh'
    })
    cy.signIn({
      name: 'intruse',
      username: '131d',
      password: 'woPsss'
    })
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('johnny1932')
      cy.get('#password').type('tr3nCh')
      cy.get('#login-button').click()

      cy.get('.success')
        .should('contain', 'logged in')

      cy.contains('John Doe logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('johNny1932')
      cy.get('#password').type('tr3nCh')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username:'johnny1932', password:'tr3nCh' })
    })

    it('A blog can be created', function() {
      cy.contains('Create new blog').click()

      cy.get('#title').type('A blog')
      cy.get('#author').type('cypress')
      cy.get('#url').type('http://url.com')

      cy.get('#create-button').click()
      cy.contains('A blog')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.addBlog({
          title: 'a blog',
          author: 'auto',
          url: 'an_url'
        })
      })

      it('can be liked', function() {
        cy.contains('a blog').parent().as('theBlog')
         
        cy.get('@theBlog')
          .show()

        cy.get('@theBlog')
          .get('.likeButton')
          .click()

        cy.get('@theBlog')
          .should('contain', 'likes 1')
      })

      it('can be deleted by its owner', function() {
        cy.contains('a blog').parent().as('theBlog')

        cy.get('@theBlog')
          .show()

        cy.get('@theBlog')
          .get('#remove')
          .click()

        cy.should('not.contain', 'a blog')
      })

      describe('when another user logs in', function() {
        beforeEach(function () {
          cy.login({ username:'131d', password:'woPsss' }) 
        })

        it('cant be deleted', function() {
          cy.contains('a blog').parent().as('theBlog')

          cy.get('@theBlog')
            .show()

          cy.get('@theBlog')
            .contains('remove')
            .should('have.css', 'display', 'none')
        })
      })
    })

    describe('several blogs exist', function() {
      beforeEach(function() {
        cy.addBlog({ title: 'blog1', author: 'auto', url: 'an_url'})
        cy.addBlog({ title: 'blog2', author: 'auto', url: 'an_url'})
        cy.addBlog({ title: 'blog3', author: 'auto', url: 'an_url'})
      })
      
      it('are sorted correctly', function() {
        cy.like('blog2', 5)
        cy.like('blog1', 3)
        cy.like('blog3', 2)

        cy.get('.blog:first')
          .contains('likes 5')
      })
    })
  })
})