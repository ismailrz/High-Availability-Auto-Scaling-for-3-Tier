# 09 — Auto-Deployment to New Instances

Covers: assignment.md section 10, Task 9.

## Concept

Once a deployment group is attached to an Auto Scaling Group (as
configured in doc 07), CodeDeploy automatically hooks into the ASG's
instance lifecycle: whenever the ASG launches a brand-new instance — for
any reason, whether a scale-out event, a health-check-triggered
replacement (doc 03), or simply increasing desired capacity manually —
CodeDeploy automatically triggers a deployment of the **most recent
successfully-deployed application revision** to that new instance. No
additional configuration beyond what's already set up in doc 07 is
required; this behavior is automatic for ASG-integrated deployment
groups.

This is the concrete fix for the exact problem described in doc 05's
essay: without CI/CD integration, a new instance launched from a stale
AMI would serve outdated code. With CodeDeploy's ASG hook in place, new
instances always converge to the current, correct version.

## Demo steps

1. Confirm the pipeline has already run at least one successful
   deployment (from doc 07/08), so there's a "most recent successful
   revision" for CodeDeploy to deploy to new instances.
2. Trigger a new instance launch, either way:
   - **Scale-out**: EC2 console → Auto Scaling Groups → `backend-asg` →
     Edit → increase Desired capacity by 1, or
   - **Forced replacement**: terminate an existing instance (as in doc
     03's failure simulation) so the ASG launches a replacement
3. Watch EC2 console → Instances — a new instance appears with state
   transitioning `pending → running`.
4. Watch CodeDeploy console → `backend-app` → `backend-dg` → Deployments
   — a new deployment automatically appears, scoped to just the new
   instance, running through the same lifecycle hooks
   (`ApplicationStop` → `BeforeInstall` → `AfterInstall` →
   `ApplicationStart` → `ValidateService`). **Screenshot this deployment
   entry.**
5. Once healthy, repeatedly `curl http://<backend-alb-dns-name>/version`
   until the `host` field in the response matches the new instance's
   hostname (the ALB round-robins across all healthy targets, so you may
   need several requests) — confirm its `version` matches the rest of the
   fleet, proving the new instance received the current deployed version
   automatically rather than whatever was baked into the AMI.

## Written explanation draft

> **Importance of auto-deployment in production**
> In a dynamic infrastructure where instances are created and destroyed
> automatically by an Auto Scaling Group, manually ensuring every new
> instance has the correct application version is not practically
> possible — instances can be created at any time, including outside
> business hours, in response to sudden load or failures. Auto-deployment
> via CodeDeploy's Auto Scaling Group integration solves this by making
> "the currently deployed version" an intrinsic property of the
> deployment group itself, rather than something baked statically into
> an AMI at one point in time. Every new instance automatically converges
> to the correct, current version the moment it launches, with zero
> manual steps.
>
> **Problems solved by automated deployments in dynamic environments**
> Automated deployment eliminates the exact failure mode described in the
> CI/CD challenges essay (doc 05): a fleet silently running mixed
> application versions because some instances launched before a code
> change and some after. It also removes the operational burden of
> having to remember to re-bake an AMI every time code changes just to
> keep new instances current — instead, the AMI only needs to contain
> the runtime prerequisites (Node.js, the CodeDeploy agent), and the
> actual application code is always delivered fresh by CodeDeploy on
> every instance launch. This decouples "what's baked into the machine
> image" from "what code is running," which is exactly the separation of
> concerns that makes Auto Scaling and CI/CD work together reliably.

This draft is also available standalone at
`docs/writing-templates/importance-of-auto-deployment.md`.

## Deliverables checklist
- [ ] Screenshot: CodeDeploy deployment automatically triggered on a newly launched instance
- [ ] Written explanation: importance of auto-deployment in production
- [ ] Written explanation: problems solved by automated deployments in dynamic environments
