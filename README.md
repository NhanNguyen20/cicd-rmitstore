# RMIT Store CI/CD Pipeline

This repository demonstrates the implementation of a complete CI/CD pipeline for the **RMIT Store project**, a group assignment project by the Newbie Team from the **RMIT COSC2767 - System Deployment and Operations** course. The origin website source code is sourced from [COSC2767-RMIT-Store](https://github.com/TomHuynhSG/COSC2767-RMIT-Store).

## Authors

The project was developed by the following team members:
- **Nguyen Minh Quan**
- **Nguyen Phuoc Nhu Phuc**
- **Nguyen Le Thu Nhan**
- **Nguyen Nghia Hiep**

## Pipeline Workflow

The **Jenkins** pipeline automates the following stages, ensuring a streamlined CI/CD process for the RMIT Store project:

1. **Clean Workspace**:
   - Ensures a clean working environment by removing any residual artifacts from previous builds.

2. **Checkout Source Code**:
   - Retrieves the latest version of the RMIT Store project from the Git repository.

3. **Run Unit Tests**:
   - Executes unit tests using **Jest** to validate application functionality and ensure code reliability.

4. **Build and Push Docker Image**:
   - Packages the application into a Docker container using the provided **Dockerfile**.
   - Pushes the Docker image to **Docker Hub** for deployment.

6. **Manipulate Development Environment**:
   - Use **Ansible** playbook to control the development environment for testing stage.

7. **Run Integration and UI Tests**:
   - Executes automated integration and UI tests to validate the application’s end-to-end functionality and user experience.

8. **Create or Update Production Environment**:
   - Utilizes **AWS CloudFormation** to create or update the production environment infrastructure.

9. **Deploy with Docker Swarm**:
   - Deploys the Docker container to the production environment using **Docker Swarm**, ensuring scalability and high availability.

10. **Monitor Failures**:
   - Integrates **Amazon SNS (Simple Notification Service)** to send email notifications in case of build failures, ensuring prompt attention to issues.

## Application Flow Diagram
<img width="897" alt="Screenshot 2025-01-25 at 00 45 41" src="https://github.com/user-attachments/assets/304021f9-ee60-4a57-861d-3d8cd7030dd9" />

