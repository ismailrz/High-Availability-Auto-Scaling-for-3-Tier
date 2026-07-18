# 06 — CI/CD Architecture for the 3-Tier Application

Covers: assignment.md section 7, Task 6.

## Diagram

See `diagrams/cicd-pipeline-flow.mmd` (sequence diagram) — render to PNG
per doc 00's instructions and embed it in your submission.

## Step-by-step flow: Commit → Build → Deploy → Auto Scaling Group

1. **Commit** — a developer pushes code to the `main` branch of the
   GitHub repository.
2. **Source (CodePipeline)** — a CodeStar Connection webhook notifies
   CodePipeline of the new commit, which pulls the latest source and
   passes it as an artifact to the next stage.
3. **Build (CodeBuild)** — CodeBuild runs `codebuild/buildspec.yml`:
   installs backend dependencies (`npm ci`), runs tests (`npm test`),
   makes the CodeDeploy lifecycle scripts executable, and assembles a
   deployment artifact zip containing `appspec.yml`, `scripts/`, and
   `backend/` at its root.
4. **Deploy (CodeDeploy)** — CodePipeline passes the build artifact to
   CodeDeploy, which deploys it to the `backend-asg` deployment group by
   running the lifecycle hooks in order on each instance: `ApplicationStop`
   → `BeforeInstall` → `AfterInstall` → `ApplicationStart` →
   `ValidateService`.
5. **Auto Scaling Group** — once `ValidateService` confirms `/health`
   responds with 200, the instance is marked healthy and the ALB routes
   live traffic to it. If the deployment type is Blue/Green (Task 8),
   CodeDeploy shifts ALB traffic from the old target group to the new one
   instead of updating instances in place.

## Role of each service

- **CodePipeline** is the orchestrator: it defines the stages (Source →
  Build → Deploy), moves artifacts between them, and provides the
  execution history/console view used for the Task 7 "successful
  pipeline execution" screenshot.
- **CodeBuild** is the build compute: it runs an isolated, ephemeral
  container per build, driven entirely by `buildspec.yml`, producing a
  versioned build artifact with no dependency on any specific developer's
  machine.
- **CodeDeploy** is the deployment orchestrator: it knows how to install
  an artifact onto EC2 instances (via `appspec.yml` + lifecycle hooks),
  understands Auto Scaling Group deployment groups (including
  automatically deploying to newly launched instances — see Task 9), and
  supports Blue/Green traffic shifting via ALB target groups (Task 8) —
  none of which CodeBuild or CodePipeline handle on their own.

## Deliverables checklist
- [ ] CI/CD architecture diagram (rendered from `diagrams/cicd-pipeline-flow.mmd`)
- [ ] Step-by-step flow description: Commit → Build → Deploy → Auto Scaling Group
