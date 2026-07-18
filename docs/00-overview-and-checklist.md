# 00 — Overview & Checklist

This doc is the starting point. Read it before touching the AWS Console.

## What this repo contains vs. what you must do yourself

This repo contains everything that can be prepared **before** you touch the
AWS Console:

- A working Node.js/Express backend (`backend/`) with a `/health` endpoint,
  a `/version` endpoint, and a small REST resource (`/api/items`).
- All CodeDeploy artifacts (`codedeploy/appspec.yml` + lifecycle scripts).
- A CodeBuild `buildspec.yml` (`codebuild/buildspec.yml`).
- Mermaid architecture diagrams (`diagrams/*.mmd`).
- Step-by-step console runbooks for every assignment task (`docs/01`
  through `docs/10`).
- Draft written explanations you can personalize and paste into your
  submission (`docs/writing-templates/`).
- A deliverable-by-deliverable checklist (`submission/SUBMISSION_CHECKLIST.md`).

**What you must do yourself, in the AWS Console:** create the VPC, subnets,
security groups, EC2 instance, AMI, Launch Template, Target Group, ALB, ASG,
scaling policies, CodePipeline, CodeBuild project, CodeDeploy application —
and take the screenshots. No Terraform/CloudFormation is used by design,
since you chose the manual-console path. Every doc below tells you exactly
which console screen to use.

## Prerequisites

- An AWS account with permission to create: VPC/subnets/security groups,
  EC2 instances, AMIs, Launch Templates, ALBs/Target Groups, Auto Scaling
  Groups, CloudWatch alarms, IAM roles, S3 buckets, CodePipeline,
  CodeBuild, CodeDeploy, and (optionally) RDS.
- A GitHub repository containing this project (push this repo as-is to
  your own GitHub repo — CodePipeline will pull from it).
- A key pair for SSH access (or plan to use AWS Systems Manager Session
  Manager instead of SSH).
- AWS CLI configured locally is optional — everything here is written for
  the console, but CLI commands are equally valid if you prefer them.

## Pick one region and use it everywhere

Recommended: `us-east-1` (has full service availability and is the most
commonly documented region). Whichever region you pick, use the **same
region** for every resource in this assignment — ALB, ASG, CodeDeploy,
CodeBuild, CodePipeline, and the CodeDeploy agent's S3 install bucket are
all region-scoped.

## Naming conventions

Keeping names consistent makes your screenshots coherent and your
write-up easier to follow:

| Resource | Name |
|---|---|
| VPC | `three-tier-vpc` |
| ALB security group | `alb-sg` |
| Backend security group | `backend-sg` |
| RDS security group | `rds-sg` |
| Backend AMI | `backend-ami-v1` |
| Launch Template | `backend-lt` |
| Target Group | `backend-tg` |
| Application Load Balancer | `backend-alb` |
| Auto Scaling Group | `backend-asg` |
| CodeBuild project | `backend-build` |
| CodeDeploy application | `backend-app` |
| CodeDeploy deployment group | `backend-dg` |
| CodePipeline pipeline | `backend-pipeline` |

## Rendering the Mermaid diagrams to PNG

The diagrams in `diagrams/*.mmd` are plain-text Mermaid source. Render
them for your PDF using either:

1. **mermaid.live** (no install): open https://mermaid.live, paste the
   `.mmd` file contents into the editor, then use "Actions → Download
   PNG/SVG".
2. **mermaid-cli** (if you have Node.js locally):
   ```
   npx -p @mermaid-js/mermaid-cli mmdc -i diagrams/3-tier-architecture.mmd -o diagrams/3-tier-architecture.png
   ```
   Repeat for each `.mmd` file.

GitHub and most Markdown editors (VS Code with the Mermaid extension)
also render `.mmd`/fenced-mermaid blocks directly, which is useful while
you're iterating.

## Map of docs to assignment sections

| Doc | Assignment section(s) | Task # | Deliverable |
|---|---|---|---|
| `01-architecture-3tier.md` | 2 | — | Architecture diagram + explanation |
| `02-backend-asg-launch-template-target-group.md` | 3 | Task 1 | Launch Template, ASG, Target Group, ALB screenshots |
| `03-health-checks-self-healing.md` | 4 | Tasks 2 & 3 | Instance replacement screenshots + explanation |
| `04-scaling-policies.md` | 5 | Task 4 | Scaling policy screenshot + explanation |
| `05-cicd-challenges-essay.md` | 6 | Task 5 | One-page explanation |
| `06-cicd-architecture-design.md` | 7 | Task 6 | CI/CD diagram + flow description |
| `07-cicd-pipeline-setup.md` | 8 | Task 7 | Pipeline execution, deployment group, updated version screenshots |
| `08-blue-green-deployment.md` | 9 | Task 8 | Blue/Green diagram + explanation |
| `09-auto-deploy-new-instance-demo.md` | 10 | Task 9 | New-instance deployment screenshot + explanation |
| `10-frontend-asg-bonus.md` | 11 | Task 10 (optional) | Frontend diagram + explanation |

When you're done, go to `submission/SUBMISSION_CHECKLIST.md` for the full
deliverable-by-deliverable mapping and PDF assembly instructions.

## Deliverables checklist
- [ ] Read this doc fully before starting console work
- [ ] Repo pushed to your own GitHub repository
- [ ] Region chosen and noted for consistent use
