Assignment: Auto Scaling & CI/CD for 3-Tier Applications on AWS


1. Assignment Objective
The objective of this assignment is to help students design and implement a highly available, auto-scalable 3-tier application architecture on AWS and integrate a CI/CD pipeline that supports deployment to Auto Scaling Groups using modern deployment strategies such as Blue/Green deployment.
By completing this assignment, students will gain hands-on experience with:
Auto Scaling for high availability and self-healing


Load balancing in 3-tier architectures


CI/CD challenges in dynamic infrastructures


Automated deployment to new servers



2. Architecture Overview (3-Tier Application)
Students must design and document a 3-tier architecture consisting of:
2.1 Frontend Tier
EC2 instance or Auto Scaling Group (optional)


Web server (Nginx/Apache) or frontend framework (React/Vue)


Exposed to the internet via Application Load Balancer (ALB)


2.2 Backend Tier
EC2 instances behind an Application Load Balancer


Auto Scaling Group (ASG)


REST API service (Django/Spring Boot/Node.js)


2.3 Database Tier
Amazon RDS (MySQL/PostgreSQL) or EC2-based database


Private subnet with restricted access


Deliverable
Architecture diagram


Short explanation of:


Why Auto Scaling is mandatory in production


How high availability is achieved


Request flow between tiers



3. Auto Scaling Implementation (Backend Tier)
Task 1: Convert Backend EC2 into Auto Scaling Group
Launch a backend EC2 instance and deploy a working backend application.


Create an AMI from the configured instance.


Create a Launch Template using the AMI.


Create an Auto Scaling Group with:


Minimum instances: 1


Desired instances: 1


Maximum instances: 3


Attach the Auto Scaling Group to an Application Load Balancer target group.


Deliverables:
Screenshots of:


Launch Template


Auto Scaling Group


Target Group


Working ALB DNS serving backend responses



4. Health Checks and Self-Healing
Task 2: Configure Health Checks
Implement a health endpoint in the backend application (for example, /health).


Configure ALB health checks using this endpoint.


Configure Auto Scaling Group health checks.


Task 3: Failure Simulation
Manually stop or terminate a backend EC2 instance.


Observe and document the Auto Scaling Group launching a new instance.


Deliverables:
Screenshots of instance replacement


Written explanation of:


Self-healing in cloud infrastructure


Role of health checks in maintaining availability


5. Scaling Policies
Task 4: Configure Scaling Policies
Configure scaling policies for the backend Auto Scaling Group:
Scale out when average CPU utilization exceeds 60 percent


Scale in when average CPU utilization falls below 30 percent


Optional:
Implement target tracking scaling policy


Deliverables:
Screenshot of scaling policies


Short explanation of:


Difference between manual scaling and auto scaling


Real-world scenarios where auto scaling is critical









6. CI/CD Challenges in Auto Scaling Environments
Task 5: CI/CD Problem Statement
Write a short explanation addressing the following:
Why traditional deployment (manual SSH and deployment) is not suitable for Auto Scaling environments


What happens when new EC2 instances are launched without CI/CD integration


Deliverable:
One-page written explanation



7. CI/CD Architecture for 3-Tier Application
Task 6: CI/CD Design
Design a CI/CD architecture including:
Source Control: GitHub or GitLab


CI/CD Orchestration: AWS CodePipeline


Build Service: AWS CodeBuild


Deployment Service: AWS CodeDeploy


Deployment Target: Auto Scaling Group


Deliverables:
CI/CD architecture diagram


Step-by-step flow description:
 Code Commit → Build → Deploy → Auto Scaling Group



8. CI/CD Pipeline for Backend
Task 7: Backend CI/CD Implementation
Implement a complete CI/CD pipeline for the backend service:
Configure CodePipeline with source from GitHub/GitLab.


Configure CodeBuild to build and package the backend application.


Configure CodeDeploy to deploy to the backend Auto Scaling Group.


Use appspec.yml and deployment lifecycle hooks (BeforeInstall, AfterInstall, ApplicationStart).


Deliverables:
Screenshot of successful pipeline execution


Screenshot of CodeDeploy deployment group


Proof of updated backend version served through ALB


9. Blue/Green Deployment
Task 8: Implement Blue/Green Deployment
Configure Blue/Green deployment strategy for the backend application:
Blue environment: current production version


Green environment: new version


Traffic shifting using ALB target groups


Deliverables:
Architecture diagram showing Blue and Green environments


Written explanation of:


Blue/Green vs Rolling deployment


How Blue/Green deployment reduces downtime and deployment risk


10. Auto-Deployment to New Instances
Task 9: Auto-Deploy to New Servers
Demonstrate that when a new EC2 instance is launched by the Auto Scaling Group, the latest application version is automatically deployed using CodeDeploy.
Deliverables:
Screenshot showing deployment on newly created instance


Short explanation of:


Importance of auto-deployment in production


Problems solved by automated deployments in dynamic environments


11. Optional: Frontend Auto Scaling
Task 10: Frontend Auto Scaling (Optional Bonus)
Convert frontend EC2 into Auto Scaling Group


Attach to ALB or CloudFront


Configure scaling policy based on request count or CPU utilization


Deliverables:
Architecture diagram
Short explanation of frontend scaling use cases


12. Submission Guidelines
Students must submit a single PDF containing:
Architecture diagrams


All required screenshots


Explanations for each task


Challenges faced and lessons learned


File naming format:
 AutoScaling_CICD_3Tier_<StudentName>.pdf

