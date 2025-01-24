# RMIT University Vietnam
# Course: COSC2767 Systems Deployment and Operations
# Semester: 2024C
# Assessment: Assignment 2
# Author: TEAM NEWBIE
# ID:    
# Nguyen Minh Quan - S3927181
# Nguyen Nghia Hiep - S3978270
# Nguyen Le Thu Nhan - S3932151
# Nguyen Phuoc Nhu Phuc - S3819660
#
# Created  date: 3rd Jan 2024
# Last modified: 16th Jan 2024

# Fetching the minified node image on apline linux
FROM node:20 AS builder
ENV NODE_ENV development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .



FROM node:20-slim
ENV NODE_ENV development
WORKDIR /app
COPY --from=builder /app .
EXPOSE 8080
CMD [ "npm", "run", "dev" ]
