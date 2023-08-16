Cypress.Commands.add('createUser', ({ userName, password }) => {
    cy.api({
        method: 'POST',
        url: '/Account/v1/User',
        headers: { 'Content-Type': 'application/json ' },
        failOnStatusCode: false,
        body: {
            userName: userName,
            password: password,
        }
    })
})

Cypress.Commands.add('getProfile', (userId, accessToken) => {
    cy.api({
        method: 'GET',
        url:`/Account/v1/User/${userId}`,
        failOnStatusCode: false,
        headers: { Authorization: `Bearer ${accessToken}` }
    })
})

Cypress.Commands.add('login', ({ userName, password }) => {
    cy.api({
        method: 'POST',
        url: '/Account/v1/GenerateToken',
        headers: { 'Content-Type': 'application/json ' },
        failOnStatusCode: false,
        body: {
            userName: userName,
            password: password,
        }
    })
})

Cypress.Commands.add('getBooks', () => {
    cy.api({
        method: 'GET',
        url: '/BookStore/v1/Books',
        failOnStatusCode: false
    })
})

Cypress.Commands.add('getListBooks', () => {
    cy.api({
        method: 'GET',
        url: '/BookStore/v1/Books',
        failOnStatusCode: false
    })
})

Cypress.Commands.add('addBooksFavorites', ( userId, accessToken, firstIsbn ) => {
    cy.api({
        method: 'POST',
        url: '/BookStore/v1/Books',
        failOnStatusCode: false,
        body: {
            userId: userId,
            collectionOfIsbns: [{ isbn: firstIsbn }]
        },
        headers: { Authorization: `Bearer ${accessToken}` }
    });
});

Cypress.Commands.add('removeBooks', (userId, accessToken) => {
    cy.api({
        method: 'DELETE',
        url: `/BookStore/v1/Books?UserId=${userId}`,
        failOnStatusCode: false,
        headers: { Authorization: `Bearer ${accessToken}` }
    });
});

Cypress.Commands.add('deleteAccount', (userId, accessToken) => {
    cy.api({
        method: 'DELETE',
        url: `https://bookstore.toolsqa.com/Account/v1/User/${userId}`,
        headers: { Authorization: `Bearer ${accessToken}` }
    });
});