import { dynamicUser, authUser } from '../payloads/users';
import { StatusCodes } from 'http-status-codes';

describe('User registration', () => {
    let userId, token, randomUser, authorizedUser;

    beforeEach(() => { 
        randomUser = dynamicUser();
        authorizedUser = authUser();
    });

    it('Deve registrar um novo usuário', () => {
        cy.createUser(randomUser).then(({ status, body }) => {
            expect(status).to.equal(StatusCodes.CREATED);
            expect(body.userID).to.not.be.empty;
            expect(body.books).to.have.length(0);
            expect(body.username).to.equal(randomUser.userName);
            userId = body.userID;
    
            cy.loginUser(randomUser)
                .its('body.token')
                .then((resp) => {
                    token = resp; // Chamada para excluir a conta criada para não bagunçar o banco de dados.
                    cy.deleteAccount({ userId, token }); 
                });
        });
    });

    it('Does not register with a blank username', () => {
        randomUser.userName = '';

        cy.createUser(randomUser).then(({ body, status }) => {
            expect(status).to.equal(StatusCodes.BAD_REQUEST);
            expect(body.message).to.equal('UserName and Password required.');
        });
    });

    it('Does not register with a blank password and username', () => {
        randomUser.userName = '';
        randomUser.password = '';

        cy.createUser(randomUser).then(({ body, status }) => {
            expect(status).to.equal(StatusCodes.BAD_REQUEST);
            expect(body.message).to.equal('UserName and Password required.');
        });
    });

    it('Do not register a user with a password that does not contain special characters', () => {   
        randomUser.password = 'invalid_password';

        cy.createUser(randomUser).then(({ body, status }) => {
            expect(status).to.equal(StatusCodes.BAD_REQUEST);
            expect(body.message).to.equal(
                'Passwords must have at least one non alphanumeric character, ' +
                'one digit (\'0\'-\'9\'), one uppercase (\'A\'-\'Z\'), ' +
                'one lowercase (\'a\'-\'z\'), one special character and ' +
                'Password must be eight characters or longer.'
            );
        });
    });

    it('Does not create an account with the same data as an existing account', () => {
        cy.createUser(authorizedUser).then(({ body, status }) => {
            expect(status).to.equal(StatusCodes.NOT_ACCEPTABLE);
            expect(body.message).to.equal('User exists!');
        });
    });
});
