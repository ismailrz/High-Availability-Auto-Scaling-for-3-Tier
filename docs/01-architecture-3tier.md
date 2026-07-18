# 01 — Architecture Overview (3-Tier Application)

Covers: assignment.md section 2.

## Why the three tiers are separated

Splitting frontend, backend, and database into independent tiers gives
three concrete benefits:

- **Blast radius containment.** A crash or bug in the frontend tier
  cannot directly take down the database; each tier fails independently.
- **Independent scaling.** The backend tier under CPU load can scale out
  without touching the frontend or database, avoiding wasted spend on
  tiers that aren't the bottleneck.
- **Security boundary.** Each tier sits in its own subnet with its own
  security group, so access is restricted to only the traffic that tier
  actually needs (e.g. the database only ever accepts connections from
  the backend, never directly from the internet).

## Diagram

See `diagrams/3-tier-architecture.mmd` — render to PNG per doc 00's
instructions and embed it in your submission.

The diagram shows:
- Internet → Internet Gateway → Frontend ALB (public subnets)
- Frontend ASG (EC2 running Nginx/React) — optional per Task 10
- Backend ALB → Backend ASG (EC2 running Node.js/Express) — private subnets
- Backend ASG → Amazon RDS (private subnets)
- A NAT Gateway so private-subnet backend instances can still reach the
  internet for `npm ci` / OS package updates (this trips people up: if
  your backend instances are in a *private* subnet, they need a NAT
  Gateway for outbound internet access, since they have no public IP)
- Security groups: `alb-sg` allows 80/443 from `0.0.0.0/0`; `backend-sg`
  allows port 3000 from `alb-sg` only; `rds-sg` allows 3306/5432 from
  `backend-sg` only

## VPC setup (console walkthrough)

The fastest correct path is the VPC creation wizard, which auto-creates
subnets, route tables, and a NAT Gateway for you:

1. VPC console → **Create VPC**
2. Choose **VPC and more** (not "VPC only")
3. Name tag auto-generation: `three-tier`
4. IPv4 CIDR: `10.0.0.0/16`
5. Number of Availability Zones: **2**
6. Number of public subnets: **2**
7. Number of private subnets: **2** (you'll actually want a 3rd
   private-subnet pair for the database tier if you want DB fully
   isolated from backend subnets — for this assignment's scope, 2
   private subnets shared by backend + RDS is acceptable; call this out
   as a simplification in your write-up if you use it)
8. NAT gateways: **1 per AZ** (or "1" to save cost — note this as a
   single point of failure trade-off you're accepting for the assignment)
9. VPC endpoints: none needed
10. Click **Create VPC**

## Security groups (console walkthrough)

VPC console → **Security Groups** → **Create security group**, three times:

1. **alb-sg** — VPC = `three-tier-vpc`. Inbound rules: HTTP (80) from
   `0.0.0.0/0`, HTTPS (443) from `0.0.0.0/0` (optional if you set up TLS).
2. **backend-sg** — Inbound rules: Custom TCP (3000) from source =
   `alb-sg` (select the security group, not a CIDR). Also add SSH (22)
   from **My IP** temporarily, for the manual bootstrap in doc 02 — you
   can remove this rule after AMI creation.
3. **rds-sg** — Inbound rules: MySQL/Aurora (3306) or PostgreSQL (5432)
   from source = `backend-sg`.

## Written explanation draft

Use this as a starting point — personalize with your actual resource
names/region before submitting.

> **Why Auto Scaling is mandatory in production**
> A single EC2 instance is a single point of failure: if it crashes, is
> terminated, or the underlying host fails, the application goes down
> completely with no automatic recovery. Auto Scaling Groups solve this by
> maintaining a desired number of healthy instances at all times — if one
> instance fails, the ASG launches a replacement automatically, without
> human intervention. Beyond availability, Auto Scaling also matches
> capacity to real demand: provisioning for peak traffic at all times
> wastes money during quiet periods, while provisioning for average
> traffic causes outages during spikes. Auto Scaling lets the
> infrastructure grow and shrink automatically based on real load.
>
> **How high availability is achieved**
> High availability in this architecture comes from three layers working
> together: (1) the Auto Scaling Group spans multiple Availability Zones,
> so the failure of an entire data center does not take down the
> application; (2) the Application Load Balancer only routes traffic to
> instances that pass health checks, so a failing instance is
> automatically taken out of rotation before it can serve errors to
> users; (3) the ASG's self-healing behavior replaces unhealthy or
> terminated instances automatically, restoring full capacity without
> manual action.
>
> **Request flow between tiers**
> A user's request first reaches the Frontend ALB, which forwards it to a
> healthy instance in the Frontend Auto Scaling Group (serving the
> static site or SPA). The frontend, in turn, calls the Backend ALB's DNS
> name to reach the REST API, which forwards the request to a healthy
> instance in the Backend Auto Scaling Group. The backend instance
> processes the request, optionally reading/writing to the Amazon RDS
> database in the private data subnet, and returns a response back up
> the chain: backend instance → Backend ALB → frontend instance →
> Frontend ALB → user.

## Deliverables checklist
- [ ] Architecture diagram (rendered from `diagrams/3-tier-architecture.mmd`)
- [ ] Explanation: why Auto Scaling is mandatory
- [ ] Explanation: how high availability is achieved
- [ ] Explanation: request flow between tiers
