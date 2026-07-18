<!--
Reminder: personalize this before submitting — swap in your actual
region, instance types, and reference your own screenshots where noted.
-->

# Importance of Auto-Deployment in Dynamic Environments

**Importance of auto-deployment in production**

In a dynamic infrastructure where instances are created and destroyed
automatically by an Auto Scaling Group, manually ensuring every new
instance has the correct application version is not practically
possible — instances can be created at any time, including outside
business hours, in response to sudden load or failures. Auto-deployment
via CodeDeploy's Auto Scaling Group integration solves this by making
"the currently deployed version" an intrinsic property of the deployment
group itself, rather than something baked statically into an AMI at one
point in time. Every new instance automatically converges to the
correct, current version the moment it launches, with zero manual steps.

**Problems solved by automated deployments in dynamic environments**

Automated deployment eliminates the exact failure mode where a fleet
silently runs mixed application versions because some instances launched
before a code change and some after. It also removes the operational
burden of having to remember to re-bake an AMI every time code changes
just to keep new instances current — instead, the AMI only needs to
contain the runtime prerequisites (Node.js, the CodeDeploy agent), and
the actual application code is always delivered fresh by CodeDeploy on
every instance launch. This decouples "what's baked into the machine
image" from "what code is running," which is exactly the separation of
concerns that makes Auto Scaling and CI/CD work together reliably.
