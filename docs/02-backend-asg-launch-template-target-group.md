# 02 — Backend Auto Scaling Group, Launch Template, Target Group

Covers: assignment.md section 3, Task 1.

## Step 1 — Launch a single backend EC2 instance manually

EC2 console → **Launch instance**:
- Name: `backend-bootstrap`
- AMI: Amazon Linux 2023
- Instance type: `t3.micro` (or `t2.micro` for free tier)
- Key pair: your key pair (for SSH), or skip and plan to use Session
  Manager instead
- Network: `three-tier-vpc`, a **private** subnet if you want to match
  the target architecture (you'll need SSM Session Manager or a bastion
  to reach it in that case), or a **public** subnet with a temporary
  public IP for simplicity while bootstrapping (recommended for this
  one-time step — you can move the ASG's actual instances to private
  subnets afterward)
- Security group: `backend-sg`
- IAM instance profile: none needed yet for this manual bootstrap step

## Step 2 — Install Node.js, the CodeDeploy agent, and the app

SSH into the instance (`ssh -i your-key.pem ec2-user@<public-ip>`), then:

```bash
# Install Node.js 20 via NodeSource-equivalent Amazon Linux 2023 package
sudo dnf install -y nodejs20 nodejs20-npm
sudo alternatives --install /usr/bin/node node /usr/bin/node-20 60 2>/dev/null || true
node -v
npm -v

# Install the CodeDeploy agent (region-specific S3 bucket — replace
# REGION with your chosen region, e.g. us-east-1)
sudo dnf install -y ruby wget
cd /home/ec2-user
wget https://aws-codedeploy-REGION.s3.REGION.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo systemctl enable codedeploy-agent
sudo systemctl start codedeploy-agent
sudo systemctl status codedeploy-agent
```

Copy this repo's `backend/` folder onto the instance (via `scp` from your
laptop, or `git clone` your GitHub repo directly on the instance), then:

```bash
sudo mkdir -p /opt/backend
sudo cp -r backend/* /opt/backend/
sudo chown -R ec2-user:ec2-user /opt/backend
cd /opt/backend
npm ci --omit=dev
node src/server.js &
curl localhost:3000/health
```

You should see `{"status":"healthy", ...}`. Kill the foreground process
(`kill %1`), then install it as a systemd service using
`systemd/backend.service` from this repo (later, CodeDeploy's
`after_install.sh` will write this same file automatically on every
future deploy — for this one-time manual bootstrap, do it by hand):

```bash
sudo cp systemd/backend.service /etc/systemd/system/backend.service
sudo systemctl daemon-reload
sudo systemctl enable backend
sudo systemctl start backend
sudo systemctl status backend
curl localhost:3000/health
```

## Step 3 — Verify

`curl localhost:3000/health` and `curl localhost:3000/` should both
return JSON. This confirms the AMI you're about to bake actually works.

## Step 4 — Create an AMI from this instance

EC2 console → select the `backend-bootstrap` instance → **Actions →
Image and templates → Create image**:
- Image name: `backend-ami-v1`
- No reboot: leave unchecked (allow reboot for a clean, consistent image)
- Create image

Wait for the AMI status to become `available` (EC2 console → AMIs).

## Step 5 — Create a Launch Template from the AMI

EC2 console → **Launch Templates → Create launch template**:
- Name: `backend-lt`
- AMI: `backend-ami-v1` (My AMIs tab)
- Instance type: `t3.micro`
- Key pair: your key pair
- Security groups: `backend-sg`
- **IAM instance profile: this is critical.** Create/attach a role with:
  - `AmazonEC2RoleforAWSCodeDeploy` (or equivalent S3 read-only + the
    CodeDeploy agent's required permissions) so the CodeDeploy agent can
    pull deployment artifacts from S3.
  - Without this, deployments will get stuck with the agent unable to
    reach S3 — one of the most common failure points in this assignment.
- User data: none required (systemd service already baked into the AMI)

## Step 6 — Create a Target Group

EC2 console → **Target Groups → Create target group**:
- Target type: **Instances**
- Name: `backend-tg`
- Protocol: HTTP, Port: **3000**
- VPC: `three-tier-vpc`
- Health check path: **`/health`**
- Health check settings: leave defaults for now (tuned further in doc 03)
- Don't register targets yet — the ASG will do this automatically

## Step 7 — Create the Application Load Balancer

EC2 console → **Load Balancers → Create load balancer → Application Load
Balancer**:
- Name: `backend-alb`
- Scheme: internet-facing (or internal if you're keeping backend fully
  private and only exposing it through the frontend — internet-facing is
  simpler for grading since you can hit the ALB DNS directly)
- VPC: `three-tier-vpc`, select the **public** subnets (2 AZs)
- Security group: `alb-sg`
- Listener: HTTP : 80 → forward to `backend-tg`

## Step 8 — Create the Auto Scaling Group

EC2 console → **Auto Scaling Groups → Create Auto Scaling group**:
- Name: `backend-asg`
- Launch template: `backend-lt`
- VPC: `three-tier-vpc`, subnets: the **private** subnets (2 AZs) —
  this is where your real backend instances should live, since outbound
  internet access for `npm ci` goes through the NAT Gateway
- Load balancing: **Attach to an existing load balancer** → choose the
  existing target group `backend-tg`
- Health checks: turn on **ELB health checks** in addition to EC2 status
  checks (critical — default is EC2-only, which won't catch an
  app-level failure; ties directly into Tasks 2 & 3 in doc 03)
- Health check grace period: 90 seconds (gives the instance time to boot
  and start the app before health checks start counting failures)
- Group size: **Minimum = 1, Desired = 1, Maximum = 3**
- Scaling policies: skip for now (configured in doc 04)
- Create

## Step 9 — Verify end to end

Wait a few minutes for the ASG to launch its first instance and register
it as healthy in the target group (EC2 console → Target Groups →
`backend-tg` → Targets tab → should show `healthy`).

Then, from your local machine:

```bash
curl http://<backend-alb-dns-name>/
curl http://<backend-alb-dns-name>/health
curl http://<backend-alb-dns-name>/api/items
```

All three should return JSON. Take a screenshot of the browser or
terminal showing the ALB DNS name in the URL/command alongside the JSON
response — this is your "working ALB DNS serving backend responses"
deliverable.

## Deliverables checklist
- [ ] Screenshot: Launch Template (`backend-lt`) detail page
- [ ] Screenshot: Auto Scaling Group (`backend-asg`) detail page showing min/desired/max = 1/1/3
- [ ] Screenshot: Target Group (`backend-tg`) showing a healthy target
- [ ] Screenshot: ALB DNS name serving a backend JSON response
