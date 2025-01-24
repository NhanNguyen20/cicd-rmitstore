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


const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:8080',
    supportFile: false
  },
});
