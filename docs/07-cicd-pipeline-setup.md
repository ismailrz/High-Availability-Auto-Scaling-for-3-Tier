# 07 — Backend CI/CD Pipeline Implementation

Covers: assignment.md section 8, Task 7. This is the longest and most
operational doc — follow it in order.

## Prerequisite: push this repo to GitHub

Push this repo (as-is, including `backend/`, `codedeploy/`,
`codebuild/buildspec.yml`) to your own GitHub repository, `main` branch.
CodePipeline will pull directly from it.

## Step 1 — Create IAM roles

You need three service roles. CodePipeline's and CodeBuild's creation
wizards can auto-generate a role with the right permissions for you —
recommended for simplicity. CodeDeploy needs one created explicitly:

**CodeDeploy service role:**
- IAM console → Roles → Create role → Trusted entity: **CodeDeploy** →
  Use case: **CodeDeploy**
- Attach policy: `AWSCodeDeployRole` (AWS managed policy)
- Name: `CodeDeployServiceRole`

**CodeBuild service role:** created automatically when you create the
CodeBuild project in Step 3 below (choose "New service role" in the
wizard) — it gets S3 and CloudWatch Logs permissions automatically.

**CodePipeline service role:** created automatically when you create the
pipeline in Step 5 below (choose "New service role" in the wizard) — it
gets S3 artifact bucket, CodeBuild-start, and CodeDeploy-trigger
permissions automatically.

## Step 2 — Create a GitHub connection

Developer Tools console → **Settings → Connections → Create connection**:
- Provider: GitHub
- Connection name: `github-connection`
- Click **Connect to GitHub**, authorize via OAuth in the popup, install
  the AWS Connector app on your repository (or all repos)
- Wait until the connection status shows **Available** — a pipeline
  cannot be created against a `Pending` connection

## Step 3 — Create the CodeBuild project

CodeBuild console → **Create build project**:
- Project name: `backend-build`
- Source: GitHub (via the connection from Step 2), repository = your repo,
  branch = `main`
- Environment: Managed image, Amazon Linux, standard runtime, Node.js
  (or just use the standard image and let `buildspec.yml`'s
  `runtime-versions: nodejs: 20` handle it)
- Service role: New service role (auto-generated)
- Buildspec: **Use a buildspec file** → Buildspec name:
  **`codebuild/buildspec.yml`** — this must be set explicitly since our
  buildspec is not at the repo root (default path expected is
  `buildspec.yml` at root; ours is `codebuild/buildspec.yml`)
- Create build project

## Step 4 — Create the CodeDeploy application and deployment group

CodeDeploy console → **Applications → Create application**:
- Application name: `backend-app`
- Compute platform: **EC2/On-premises**

Then **Create deployment group**:
- Deployment group name: `backend-dg`
- Service role: `CodeDeployServiceRole` (from Step 1)
- Deployment type: **In-place** (Blue/Green is set up separately in doc 08)
- Environment configuration: **Amazon EC2 Auto Scaling groups** → select
  `backend-asg`
- Load balancer: **Enable load balancing**, select target group
  `backend-tg`
- Deployment settings: `CodeDeployDefault.AllAtOnce` (acceptable for a
  small ASG in this assignment; `OneAtATime` is a safer alternative worth
  discussing in your write-up as a trade-off between deployment speed and
  blast radius if something goes wrong)
- Create deployment group

## Step 5 — Create the CodePipeline

CodePipeline console → **Create pipeline**:
- Pipeline name: `backend-pipeline`
- Service role: New service role (auto-generated)
- **Source stage**: Source provider = GitHub (via CodeStar connections),
  connection = `github-connection`, repository = your repo, branch =
  `main`, trigger = "Start the pipeline on source code change"
- **Build stage**: Build provider = AWS CodeBuild, project = `backend-build`
- **Deploy stage**: Deploy provider = AWS CodeDeploy, application name =
  `backend-app`, deployment group = `backend-dg`
- Create pipeline

## Step 6 — Trigger and verify

Make a trivial commit (e.g. bump `APP_VERSION` in `backend/.env.example`
or hardcode a version bump directly in `backend/src/server.js`'s default
value) and push to `main`. Watch:

- CodePipeline console → `backend-pipeline` — Source, Build, and Deploy
  stages should each turn green in sequence. **Screenshot this as your
  "successful pipeline execution" deliverable.**
- CodeDeploy console → `backend-app` → `backend-dg` — shows the
  deployment's status and lifecycle event log. **Screenshot the
  deployment group page as your deliverable.**

Then verify the updated version is actually live:

```bash
curl http://<backend-alb-dns-name>/version
```

Compare the `version` field before and after your commit — **screenshot
both curl outputs (or one before/after pair) as proof of the updated
backend version served through the ALB.**

## Troubleshooting appendix

| Symptom | Likely cause / fix |
|---|---|
| Deployment stuck, agent never picks up job | CodeDeploy agent not installed or not running — SSH in and run `sudo systemctl status codedeploy-agent` |
| `InvalidSignatureException` or agent can't reach S3 | Launch Template's IAM instance profile is missing or lacks the `AmazonEC2RoleforAWSCodeDeploy` policy (see doc 02, Step 5) |
| `appspec.yml` not found at artifact root | Buildspec's `artifacts.base-directory` doesn't match where `appspec.yml` was staged — check `dist/appspec.yml` exists after the build phase's staging commands |
| `LifecycleEvent - ApplicationStop / script does not exist` | Zip artifact shape is wrong — `appspec.yml` must be at the zip root with `scripts/` and `backend/` as siblings, not nested one level deeper |
| Script fails with exit code 126 | Lifecycle script isn't executable in the artifact — confirm buildspec's `chmod +x codedeploy/scripts/*.sh` step ran before packaging |
| CodeBuild can't find buildspec | Buildspec name field in the CodeBuild project must be set to `codebuild/buildspec.yml`, not left at the default `buildspec.yml` |

## Deliverables checklist
- [ ] Screenshot: successful pipeline execution (all 3 stages green)
- [ ] Screenshot: CodeDeploy deployment group (`backend-dg`)
- [ ] Screenshot(s): proof of updated backend version served through the ALB
