<!--
Reminder: personalize this before submitting — swap in your actual
region, instance types, and reference your own screenshots where noted.
-->

# Self-Healing and the Role of Health Checks

**Self-healing in cloud infrastructure**

Self-healing means the infrastructure automatically detects and recovers
from failures without human intervention. In this architecture,
self-healing is implemented by the Auto Scaling Group: it continuously
monitors the health of every instance it manages, and if an instance
fails a health check or is terminated for any reason (crash, manual
termination, underlying hardware failure), the ASG automatically
launches a replacement instance from the same Launch Template —
including the correct AMI, security groups, and IAM role. This restores
the desired capacity within minutes, with no manual intervention, and is
one of the core reasons cloud infrastructure can achieve higher
availability than a manually managed single server.

**Role of health checks in maintaining availability**

Health checks are what make self-healing possible in the first place —
without them, the ASG would have no way to know an instance had silently
failed (e.g. the app process crashed but the OS is still running and
passing basic EC2 status checks). By combining EC2 status checks with
ELB (Application Load Balancer) health checks against the actual
`/health` endpoint, the system verifies not just that the underlying VM
is alive, but that the *application* running on it is actually able to
serve requests. This two-layer check ensures unhealthy instances are
removed from the load balancer's rotation immediately (so users never
get routed to a broken instance) and are replaced by the Auto Scaling
Group shortly after (so overall capacity is restored).
