//  RMIT University Vietnam
//   Course: COSC2767 Systems Deployment and Operations
//   Semester: 2024C
//   Assessment: Assignment 2
//   Author: TEAM NEWBIE
//   ID: 	
// Nguyen Minh Quan - S3927181
// Nguyen Nghia Hiep - S3978270
// Nguyen Le Thu Nhan - S3932151
// Nguyen Phuoc Nhu Phuc - S3819660

//   Created  date: 3rd Jan 2024
//   Last modified: 16th Jan 2024


// filepath: cypress/integration/auth.spec.js
describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('http://23.20.223.181:8080/register')
  })


    it('should register a new user', () => {
      cy.intercept('POST', `${Cypress.env('API_URL')}/register`).as('registerRequest');


      const generateRandomEmail = () => {
        const timestamp = Date.now(); // Use current timestamp for uniqueness
        return `user${timestamp}@example.com`;
      };
      
      const newEmail = generateRandomEmail();
      const newFirstName = "Cypress";
      const newLastName = "Cypress";
      const newPassword = "password123";

      cy.get('.row .col-md-6 .input-box .input-text-block input[name="email"]').type(newEmail);
      cy.get('input[name="firstName"]').type(newFirstName);
      cy.get('input[name="lastName"]').type(newLastName);
      cy.get('input[name="password"]').type(newPassword);
  
      cy.get('.d-flex .input-btn[type="submit"]').click();

      cy.url().should('include', '/dashboard');
      // cy.contains('Registration successful');
    });
  });
