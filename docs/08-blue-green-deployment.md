# 08 — Blue/Green Deployment

Covers: assignment.md section 9, Task 8.

## Concept

Blue = the current production environment (existing `backend-asg`
instances running the current version). Green = a new environment
CodeDeploy provisions running the new version. Instead of updating
instances in place, CodeDeploy shifts ALB traffic from Blue's target
group to Green's target group once Green passes its health checks.

**Important mechanic to understand and describe correctly in your
write-up:** for EC2/ASG deployment groups, CodeDeploy's Blue/Green mode
doesn't just flip a config flag on existing instances — it actually
provisions a **new, temporary copy of the Auto Scaling Group** (the
"replacement environment"), launches new instances into it, runs the
full lifecycle hook sequence (including `ValidateService`) against those
new instances while they receive zero live traffic, and only then shifts
the ALB's target group association. The original (Blue) instances are
kept running for a configurable wait period — to allow instant rollback
by shifting traffic back — before being terminated.

## Diagram

See `diagrams/blue-green-traffic-shift.mmd` — render to PNG per doc 00's
instructions and embed it in your submission.

## Console steps: convert the deployment group to Blue/Green

CodeDeploy console → `backend-app` → `backend-dg` → **Edit**:
- Deployment type: **Blue/green**
- Environment configuration: **Automatically copy Amazon EC2 Auto
  Scaling group** → original ASG = `backend-asg`
- Load balancer / target group: `backend-tg`
- Traffic rerouting: **Reroute traffic immediately** (recommended for
  this assignment's demo simplicity — shifts 100% of traffic to Green as
  soon as it passes health checks). Note **Reroute traffic manually**
  as the production-realistic alternative, where a human approves the
  shift after manually verifying Green — mention this trade-off in your
  write-up.
- Termination wait time: e.g. **5 minutes** — long enough to screenshot
  both Blue (draining) and Green (active) target group states before
  Blue's instances are terminated
- Save

## Demo script

1. Bump `APP_VERSION` (e.g. edit the default value in
   `backend/src/server.js` or set it via the Launch Template/instance
   `.env` file) to simulate a new release, commit, and push to `main`.
2. Watch CodePipeline trigger automatically → CodeDeploy performs a
   Blue/Green deployment instead of in-place.
3. Watch EC2 console → Target Groups → `backend-tg` (or the
   CodeDeploy-created replacement target group, depending on how you
   configured target groups) — you'll see the new Green instances appear
   and become healthy while Blue instances are still serving traffic.
4. Once CodeDeploy reroutes traffic, take a screenshot of the target
   group view showing Green as the active/healthy target and Blue as
   draining/deregistering.
5. Repeatedly `curl http://<backend-alb-dns-name>/version` during the
   transition — you should see the `version` (and `host`) field flip
   from the old value/instance to the new one as traffic shifts.

## Written explanation draft

> **Blue/Green vs. Rolling deployment**
> A rolling deployment updates instances in place, a few at a time,
> gradually replacing the old version with the new one across the fleet.
> This means that during the rollout, the fleet is in a mixed state —
> some instances serving the old version, some serving the new one — for
> the entire duration of the deployment. A Blue/Green deployment instead
> provisions an entirely separate, fully new environment (Green) running
> the new version, verifies it's healthy, and then shifts all traffic to
> it in one coordinated cutover, leaving no window where the fleet is
> split between two versions from the load balancer's perspective.
>
> **How Blue/Green reduces downtime and deployment risk**
> Rollback in a rolling deployment means reversing the rollout
> instance-by-instance, which takes time proportional to fleet size and
> can leave the system in yet another mixed state during the rollback
> itself. Rollback in a Blue/Green deployment is nearly instant: because
> the old (Blue) environment is kept running and untouched during the
> transition, reverting is just a matter of shifting the ALB's traffic
> back to Blue — no redeployment needed. This also means a bad release is
> caught and fully isolated before it ever receives live traffic (during
> the Green environment's health-check validation phase), rather than
> being discovered mid-rollout after it's already served some fraction of
> production traffic. The trade-off is cost and resource usage: Blue/Green
> requires briefly running double the capacity (both environments alive
> simultaneously), whereas rolling deployment never exceeds normal fleet
> size.

This draft is also available standalone at
`docs/writing-templates/bluegreen-vs-rolling.md`.

## Deliverables checklist
- [ ] Architecture diagram showing Blue and Green environments (rendered from `diagrams/blue-green-traffic-shift.mmd`)
- [ ] Written explanation: Blue/Green vs. Rolling deployment
- [ ] Written explanation: how Blue/Green reduces downtime and deployment risk
