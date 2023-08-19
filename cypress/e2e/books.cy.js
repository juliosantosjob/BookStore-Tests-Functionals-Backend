import { radomNumber } from '../support/randomData';

describe('Books', () => {
    let token, numberIsbn;
    const radomBook = radomNumber();
    const name = Cypress.env('NAME');
    const passwd = Cypress.env('PASSWORD');
    const userId = Cypress.env('USER_ID');

    beforeEach(() => {
        cy.loginUser({ userName: name, password: passwd }).then((resp) => {
            token = resp.body.token;
        });
    });

    // tenho que ajustar esse cara
    it('Access a list of available books', () => {
        cy.getBookList().then((resp) => {
            expect(resp.status).to.equal(200);
            expect(resp.body).to.have.property('books');
            expect(resp.body.books[0].isbn).to.equal('9781449325862');
            expect(resp.body.books[0].title).to.equal('Git Pocket Guide');
            expect(resp.body.books[0].subTitle).to.equal('A Working Introduction');
            expect(resp.body.books[0].author).to.equal('Richard E. Silverman');
        });
    });

    it('Add and Remove a book from the favorites list', () => {
        cy.getBookList().then((resp) => {
            numberIsbn = resp.body.books[radomBook].isbn;
            cy.addBooksFavorites(
                userId,
                token,
                numberIsbn
            );
        }).then((resp) => {
            expect(resp.status).to.equal(201);
            expect(resp.body).to.have.property('books');
            expect(resp.body.books[0].isbn).to.equal(numberIsbn);

            cy.removeBooks(userId, token).then((resp) => {
                expect(resp.status).to.equal(204);

                cy.getProfile(userId, token).then((resp) => {
                    expect(resp.status).to.equal(200);
                    expect(resp.body.books).to.be.an('array');
                    expect(resp.body.books).to.have.length(0);
                });
            });
        });
    });

    it('Add non-existent book', () => {
        numberIsbn = 'invalid_isbn';

        cy.addBooksFavorites(
            userId,
            token,
            numberIsbn
        ).then((resp) => {
            expect(resp.status).to.equal(400);
            expect(resp.body.code).to.equal('1205');
            expect(resp.body.message).to.equal('ISBN supplied is not available in Books Collection!');
        });
    });
});