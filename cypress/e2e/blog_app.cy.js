describe('Blog app', function () {
    beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            username: 'minerwa',
            name: 'Mirka Väänänen',
            password: 'salasana'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function () {
        cy.contains('log in').click()
        cy.contains('username')
        cy.contains('password')
        cy.contains('login')
        cy.contains('cancel')
    })

    describe('Login', function () {
        beforeEach(function () {
            cy.contains('log in').click()
            cy.get('#username').type('minerwa')
        })

        it('succeeds with correct credentials', function () {
            cy.get('#password').type('salasana')
            cy.get('#loginButton').click()

            cy.contains('Logged in as Mirka Väänänen')
        })

        it('fails with wrong credentials', function () {
            cy.get('#password').type('väärä')
            cy.get('#loginButton').click()

            cy.contains('wrong credentials')
        })

        describe('When logged in', function () {
            beforeEach(function () {
                cy.login({ username: 'minerwa', password: 'salasana' })
            })

            it('A blog can be created', function () {
                cy.contains('add a new blog').click()
                cy.get('#title').type('cypress title')
                cy.get('#author').type('cypress author')
                cy.get('#url').type('cypress url')
                cy.get('#addButton').click()
                cy.contains('cypress title cypress author')
            })

            describe('When there is a blog', function () {
                beforeEach(function () {
                    cy.contains('add a new blog').click()
                    cy.createBlog({ title: 'testTitle', author: 'testAuthor', url: 'www.testUrl.fi' })
                    cy.contains('view').click()
                })

                it('A blog can be liked', function () {
                    cy.contains('likes 0')
                    cy.contains('like').click()
                    cy.contains('likes 1')
                })

                it('A blog can be Deleted', function () {
                    cy.contains('testTitle testAuthor')
                    cy.contains('delete').click()
                    cy.get('html').should('not.contain', 'testTitle testAuthor')
                })
            })

            describe('When there are multiple blogs', function () {
                beforeEach(function () {
                    cy.createBlog({ title: 'MostLiked', author: 'testAuthor', url: 'www.testUrl.fi', likes: 20 })
                    cy.createBlog({ title: 'secondMostLiked', author: 'testAuthor', url: 'www.testUrl.fi', likes: 19 })
                    cy.createBlog({ title: 'LeastLiked', author: 'testAuthor', url: 'www.testUrl.fi', likes: 2 })
                })

                it('Blogs are arranged according to likes', function () {
                    cy.get('.blog').eq(0).should('contain', 'MostLiked')
                    cy.get('.blog').eq(1).should('contain', 'secondMostLiked')
                    cy.get('.blog').eq(2).should('contain', 'LeastLiked')

                    cy.get('.blog').eq(1).contains('view').click()
                    cy.get('#likeButton').click()
                    cy.wait(1500)
                    cy.get('#likeButton').click()
                    cy.wait(1500)
                    cy.contains('hide').click()

                    cy.get('.blog').eq(0).should('contain', 'secondMostLiked')
                    cy.get('.blog').eq(1).should('contain', 'MostLiked')
                    cy.get('.blog').eq(2).should('contain', 'LeastLiked')

                })

            })
        })

    })

})