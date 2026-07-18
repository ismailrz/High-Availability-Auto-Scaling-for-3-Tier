# Auto Scaling & CI/CD for 3-Tier Applications on AWS

Scaffold and runbooks for the "Auto Scaling & CI/CD for 3-Tier
Applications on AWS" assignment (see `assignment.md`).

**Start here:** `docs/00-overview-and-checklist.md`

## What's in this repo

- `backend/` — Node.js/Express REST API with `/health` and `/version`
  endpoints, deployable to EC2. Run locally with:
  ```
  cd backend
  npm install
  npm start
  curl localhost:3000/health
  ```
- `codedeploy/` — `appspec.yml` and lifecycle hook scripts for AWS CodeDeploy.
- `codebuild/` — `buildspec.yml` for AWS CodeBuild.
- `systemd/` — reference systemd unit file for running the backend as a service.
- `diagrams/` — Mermaid (`.mmd`) source for architecture diagrams.
- `docs/` — step-by-step AWS Console runbooks for every assignment task,
  numbered to match `assignment.md`'s sections, plus draft written
  explanations in `docs/writing-templates/`.
- `submission/SUBMISSION_CHECKLIST.md` — deliverable-by-deliverable
  checklist and PDF assembly instructions.

## Why no Terraform/CloudFormation

Infrastructure is provisioned manually through the AWS Console by
design — the docs in `docs/` are written as console click-path
runbooks, not as IaC to `apply`. This matches the assignment's
screenshot-driven grading model.
# High-Availability-Auto-Scaling-for-3-Tier
