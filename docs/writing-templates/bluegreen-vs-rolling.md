<!--
Reminder: personalize this before submitting — swap in your actual
region, instance types, and reference your own screenshots where noted.
-->

# Blue/Green vs. Rolling Deployment

**Blue/Green vs. Rolling deployment**

A rolling deployment updates instances in place, a few at a time,
gradually replacing the old version with the new one across the fleet.
This means that during the rollout, the fleet is in a mixed state — some
instances serving the old version, some serving the new one — for the
entire duration of the deployment. A Blue/Green deployment instead
provisions an entirely separate, fully new environment (Green) running
the new version, verifies it's healthy, and then shifts all traffic to
it in one coordinated cutover, leaving no window where the fleet is
split between two versions from the load balancer's perspective.

**How Blue/Green reduces downtime and deployment risk**

Rollback in a rolling deployment means reversing the rollout
instance-by-instance, which takes time proportional to fleet size and
can leave the system in yet another mixed state during the rollback
itself. Rollback in a Blue/Green deployment is nearly instant: because
the old (Blue) environment is kept running and untouched during the
transition, reverting is just a matter of shifting the ALB's traffic
back to Blue — no redeployment needed. This also means a bad release is
caught and fully isolated before it ever receives live traffic (during
the Green environment's health-check validation phase), rather than
being discovered mid-rollout after it's already served some fraction of
production traffic. The trade-off is cost and resource usage: Blue/Green
requires briefly running double the capacity (both environments alive
simultaneously), whereas rolling deployment never exceeds normal fleet
size.
