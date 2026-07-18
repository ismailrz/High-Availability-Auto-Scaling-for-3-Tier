# 03 — Health Checks and Self-Healing

Covers: assignment.md section 4, Tasks 2 & 3.

## The health endpoint (already implemented)

`backend/src/server.js` exposes `GET /health`, returning:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "host": "ip-10-0-1-23.ec2.internal",
  "uptimeSeconds": 12.34,
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

It's intentionally dependency-free (no database call) so that a database
outage can't cause a false-positive cascade of instance replacements —
the health check should only reflect whether *this instance's app
process* is up and responsive.

## Configure the ALB Target Group health check

EC2 console → **Target Groups → `backend-tg` → Health checks tab → Edit**:
- Health check protocol: HTTP
- Health check path: `/health`
- Port: matches target group port (3000) or "traffic port"
- Healthy threshold: 2 consecutive successes
- Unhealthy threshold: 2 consecutive failures
- Timeout: 5 seconds
- Interval: 15 seconds
- Success codes: 200

## Configure the ASG health check type

EC2 console → **Auto Scaling Groups → `backend-asg` → Details tab →
Edit** (Health checks section):
- Health check type: **EC2 and ELB** (this is what makes the ASG
  actually react to ALB-reported unhealthy targets, not just EC2 status
  checks — if this is left at EC2-only, a hung app process that still
  responds to ping/status checks will never get replaced)
- Health check grace period: 90 seconds — gives the instance time to
  boot, install dependencies (on first launch) and start the systemd
  service before health check failures start counting against it

## Failure simulation

Two ways to demonstrate self-healing — do both for a more complete
deliverable:

**(a) Kill the app process without terminating the instance.** This
proves the ALB health check → ASG replacement path works even when the
instance itself is fine:

```bash
ssh ec2-user@<instance-private-ip>   # via bastion/SSM if private subnet
sudo systemctl stop backend
```

Watch: EC2 console → Target Groups → `backend-tg` → Targets tab — the
target flips to `unhealthy` within ~30 seconds (2 failed checks × 15s
interval). After the ASG's health check grace period and unhealthy
threshold are exceeded, the ASG terminates this instance and launches a
replacement from the Launch Template.

**(b) Terminate the instance entirely.** EC2 console → Instances →
select the running backend instance → **Instance state → Terminate
instance**. Watch:
- EC2 console → Auto Scaling Groups → `backend-asg` → **Activity tab** —
  shows a "Terminating" activity followed automatically by a "Launching"
  activity for the replacement instance.
- EC2 console → Target Groups → `backend-tg` → Targets tab — shows the
  old target disappear and a new target appear, transitioning
  `initial → healthy`.

Screenshot the Activity tab (showing both the terminate and launch
events) and the Targets tab (showing the new healthy target) as your
"instance replacement" deliverable.

## Written explanation draft

> **Self-healing in cloud infrastructure**
> Self-healing means the infrastructure automatically detects and
> recovers from failures without human intervention. In this
> architecture, self-healing is implemented by the Auto Scaling Group:
> it continuously monitors the health of every instance it manages, and
> if an instance fails a health check or is terminated for any reason
> (crash, manual termination, underlying hardware failure), the ASG
> automatically launches a replacement instance from the same Launch
> Template — including the correct AMI, security groups, and IAM role.
> This restores the desired capacity within minutes, with no manual
> intervention, and is one of the core reasons cloud infrastructure can
> achieve higher availability than a manually managed single server.
>
> **Role of health checks in maintaining availability**
> Health checks are what make self-healing possible in the first place —
> without them, the ASG would have no way to know an instance had
> silently failed (e.g. the app process crashed but the OS is still
> running and passing basic EC2 status checks). By combining EC2 status
> checks with ELB (Application Load Balancer) health checks against the
> actual `/health` endpoint, the system verifies not just that the
> underlying VM is alive, but that the *application* running on it is
> actually able to serve requests. This two-layer check ensures unhealthy
> instances are removed from the load balancer's rotation immediately
> (so users never get routed to a broken instance) and are replaced by
> the Auto Scaling Group shortly after (so overall capacity is restored).

This draft is also available standalone at
`docs/writing-templates/self-healing-explanation.md`.

## Deliverables checklist
- [ ] Screenshot: ASG Activity tab showing terminate + launch events
- [ ] Screenshot: Target Group Targets tab showing unhealthy → new healthy target
- [ ] Written explanation: self-healing in cloud infrastructure
- [ ] Written explanation: role of health checks in maintaining availability
