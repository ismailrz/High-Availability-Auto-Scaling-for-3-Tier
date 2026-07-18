# 05 — CI/CD Challenges in Auto Scaling Environments

Covers: assignment.md section 6, Task 5. This is a pure writing task —
no console work required.

## Draft essay (personalize before submitting)

> **Why traditional deployment doesn't work in Auto Scaling environments**
>
> Traditional deployment workflows assume a fixed, known set of servers:
> an operator SSHes into each server by IP address, copies the new code
> over, restarts the service, and manually confirms it came back up. This
> approach fundamentally breaks down once Auto Scaling is introduced,
> because the set of servers is no longer fixed or even fully known in
> advance. An Auto Scaling Group can launch or terminate instances at any
> time — in response to a health check failure, a scaling policy, or an
> operator changing desired capacity — and each new instance gets a new
> private IP address that didn't exist when the deployment script was
> written. There is no way to "SSH to all of them" reliably, because the
> list of "all of them" is constantly changing.
>
> Beyond the addressing problem, manual SSH deployment introduces several
> compounding risks at scale. First, **configuration drift**: if a
> deployment step is run slightly differently on one server than another
> (a typo, a skipped step, a different order of operations), the fleet
> silently diverges into inconsistent states that are hard to detect
> until they cause an outage. Second, **human error scales linearly with
> fleet size**: a mistake that costs nothing on one server compounds
> across three, ten, or a hundred servers, and there is no dry-run or
> approval gate to catch it before it reaches production. Third, there is
> **no audit trail**: nobody can later answer "what exact code is running
> on this instance, and who deployed it, and when" without relying on
> operators' memory or ad hoc notes. Fourth, and most severe in an Auto
> Scaling context, manual deployment provides **no rollback mechanism**:
> if a deployment causes issues, reverting means the operator must
> remember and manually re-run the previous version's steps on every
> affected server — again, a moving target.
>
> **What happens when new instances launch without CI/CD integration**
>
> This is where the Auto Scaling and deployment problems intersect most
> visibly. An Auto Scaling Group launches new instances from a Launch
> Template, which references a specific AMI — a frozen snapshot of the
> operating system and application code baked at some point in time,
> call it T0. If code changes after T0 (a bug fix, a new feature, a
> security patch) but nobody re-bakes the AMI or wires up an automated
> deployment mechanism, then every new instance the ASG launches — whether
> from a scale-out event, a health-check-triggered replacement, or simply
> because someone increased desired capacity — will boot running the
> **stale code from T0**, not the latest code the team believes is in
> production. This creates a fleet where different instances are
> silently running different application versions depending on exactly
> when they happened to launch, which is extremely difficult to debug:
> a bug report might only reproduce on some fraction of requests, because
> it depends on which instance answered the load balancer. This is
> precisely the failure mode that CI/CD integration with Auto Scaling
> (via CodeDeploy hooking into the ASG's instance-launch lifecycle, see
> Task 9 in `docs/09-auto-deploy-new-instance-demo.md`) is designed to
> eliminate: every new instance, regardless of when it launches,
> automatically receives the latest successfully-deployed application
> version, keeping the entire fleet consistent.

(Note: there's a stray line "new:" left in mid-paragraph above from
drafting — the student should proofread and remove it before submitting;
it doesn't affect meaning but should be cleaned up.)

This is a single self-contained essay — copy the two sections above
directly into your submission and personalize as needed.

## Deliverables checklist
- [ ] One-page written explanation covering both required points, personalized and proofread
