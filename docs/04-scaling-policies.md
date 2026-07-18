# 04 — Scaling Policies

Covers: assignment.md section 5, Task 4.

## Policy types

The assignment requires **step scaling** thresholds (scale out above
60% CPU, scale in below 30% CPU). It lists **target tracking** as an
optional bonus. Implement both — the required step scaling policies, and
the optional target tracking policy as an alternative you can also
screenshot and discuss.

## Step scaling policies (required)

EC2 console → **Auto Scaling Groups → `backend-asg` → Automatic scaling
tab → Create dynamic scaling policy**:

**Scale-out policy:**
- Policy type: Step scaling
- Name: `backend-scale-out`
- CloudWatch alarm: **Create a new alarm**
  - Metric: `CPUUtilization`, Average
  - Threshold: **Greater than 60%**
  - Period: 5 minutes, 2 consecutive periods (avoids flapping on brief spikes)
  - Alarm name: `backend-cpu-high`
- Take the action: **Add** 1 capacity unit when alarm threshold is breached
- Instances need: 60 seconds warm-up

**Scale-in policy:**
- Policy type: Step scaling
- Name: `backend-scale-in`
- CloudWatch alarm: **Create a new alarm**
  - Metric: `CPUUtilization`, Average
  - Threshold: **Less than 30%**
  - Period: 5 minutes, 2 consecutive periods
  - Alarm name: `backend-cpu-low`
- Take the action: **Remove** 1 capacity unit when alarm threshold is breached

## Target tracking policy (optional bonus)

Same screen → **Create dynamic scaling policy** → Policy type: **Target
tracking scaling**:
- Name: `backend-target-tracking-cpu`
- Metric type: Average CPU Utilization
- Target value: `45` (a value between the 30/60 step thresholds, so it
  doesn't conflict with them — in practice you'd normally pick one
  strategy or the other; discuss this trade-off in your write-up)
- Instance warm-up: 60 seconds

## Generating load to trigger a scale-out (for your screenshot)

**Option A — stress the CPU directly on an instance:**
```bash
ssh ec2-user@<instance-ip>
sudo dnf install -y stress-ng
stress-ng --cpu 2 --timeout 300s
```

**Option B — hammer the ALB from your local machine** (also proves the
whole request path works under load):
```bash
# macOS/Homebrew
brew install hey
hey -z 5m -c 50 http://<backend-alb-dns-name>/api/items
```

Either approach should push `CPUUtilization` above 60% for 2 consecutive
5-minute periods, triggering the CloudWatch alarm and the scale-out
policy. Watch EC2 console → Auto Scaling Groups → `backend-asg` →
Activity tab for a new "Launching a new EC2 instance" event, and
CloudWatch console → Alarms for `backend-cpu-high` transitioning to
`ALARM`.

## Written explanation draft

> **Manual scaling vs. auto scaling**
> Manual scaling requires an operator to notice increased load (often
> after users are already impacted) and manually launch additional
> instances, then manually terminate them again once load subsides. This
> is slow, error-prone, and depends on someone being available and
> paying attention at the right moment — including at 3 a.m. Auto
> scaling instead continuously monitors a real-time metric like CPU
> utilization and adjusts capacity automatically based on predefined
> thresholds, reacting in minutes rather than however long it takes a
> human to notice and respond, and scaling back in automatically to
> avoid paying for idle capacity once load drops.
>
> **Real-world scenarios where auto scaling is critical**
> - **Flash sale / Black Friday traffic spike**: an e-commerce site can
>   see traffic jump 10x for a few hours; auto scaling absorbs this
>   without manual intervention and scales back down afterward.
> - **Viral social media traffic**: a link to a small app going viral can
>   produce an unpredictable, sudden surge with no advance warning —
>   there's no time for a human to react manually.
> - **Overnight/low-traffic scale-in**: a B2B application with mostly
>   business-hours usage can automatically scale down overnight,
>   directly reducing cost without anyone needing to schedule it.

This draft is also available standalone at
`docs/writing-templates/manual-vs-auto-scaling.md`.

## Deliverables checklist
- [ ] Screenshot: scale-out and scale-in step scaling policies
- [ ] Screenshot: CloudWatch alarms (`backend-cpu-high`, `backend-cpu-low`)
- [ ] (Optional) Screenshot: target tracking policy
- [ ] Written explanation: manual vs. auto scaling
- [ ] Written explanation: real-world scenarios where auto scaling is critical
