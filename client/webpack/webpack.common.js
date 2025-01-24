// RMIT University Vietnam
// Course: COSC2767 Systems Deployment and Operations
// Semester: 2024C
// Assessment: Assignment 2
// Author: TEAM NEWBIE
// ID:    
// Nguyen Minh Quan - S3927181
// Nguyen Nghia Hiep - S3978270
// Nguyen Le Thu Nhan - S3932151
// Nguyen Phuoc Nhu Phuc - S3819660
//
// Created  date: 3rd Jan 2024
// Last modified: 16th Jan 2024

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const CURRENT_WORKING_DIR = process.cwd();

module.exports = {
  // Entry point for the application
  entry: [path.join(CURRENT_WORKING_DIR, 'app/index.js')],
  resolve: {
    // File extensions to resolve
    extensions: ['.js', '.json', '.css', '.scss', '.html'],
    alias: {
      // Alias for app directory
      app: 'app'
    }
  },
  module: {
    rules: [
      {
        // Process JavaScript and JSX files with Babel
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: [
    // Copy static files from public directory to output directory
    new CopyWebpackPlugin([
      {
        from: 'public'
      }
    ])
  ]
};
