# 10 — Frontend Auto Scaling (Optional Bonus)

Covers: assignment.md section 11, Task 10. This is optional — skip it if
you're not pursuing the bonus, or implement it lightweight as described
here.

## Scope note

This repo doesn't include a frontend application (out of scope for the
required tasks). For this bonus, a minimal static page is enough — you
don't need a full React/Vue build. A simple `index.html` served by Nginx
that calls the backend ALB DNS via `fetch()` satisfies the assignment's
intent of demonstrating frontend Auto Scaling mechanics, which is the
actual point being graded here (not frontend engineering).

Example minimal `index.html` (create this yourself, e.g. in a new
`frontend/` folder, if you pursue this bonus):

```html
<!DOCTYPE html>
<html>
<head><title>Frontend Demo</title></head>
<body>
  <h1>Frontend</h1>
  <pre id="output">Loading...</pre>
  <script>
    fetch('http://<backend-alb-dns-name>/version')
      .then((r) => r.json())
      .then((data) => {
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
      });
  </script>
</body>
</html>
```

Install Nginx on Amazon Linux 2023 (`sudo dnf install -y nginx`), drop
this file at `/usr/share/nginx/html/index.html`, `sudo systemctl enable
--now nginx`.

## Console steps (same pattern as doc 02, abbreviated)

1. Bootstrap one EC2 instance with Nginx + the static page, verify it
   serves correctly, create an AMI (`frontend-ami-v1`).
2. Create a Launch Template (`frontend-lt`) from that AMI, security
   group allowing port 80 from `alb-sg` only (or from `0.0.0.0/0` if this
   ALB is the public entry point instead of a separate frontend ALB).
3. Create a Target Group (`frontend-tg`), health check path `/` (or a
   dedicated static health file).
4. Create a Frontend ALB (`frontend-alb`) or, alternatively, put
   CloudFront in front of it for CDN caching of static assets.
5. Create the Frontend ASG (`frontend-asg`), min/desired/max e.g. 1/1/2,
   attached to `frontend-tg`.

Full detail for each of these steps mirrors doc 02 exactly — refer back
to it rather than duplicating instructions here.

## Scaling policy

EC2 console → Auto Scaling Groups → `frontend-asg` → Automatic scaling
tab → Create dynamic scaling policy → **Target tracking** on either:
- `ALBRequestCountPerTarget` (scales based on request volume per
  instance — a good fit for a traffic-driven static/frontend tier), or
- Average CPU Utilization (simpler, consistent with the backend tier's
  approach in doc 04)

## Diagram

See `diagrams/frontend-asg-bonus.mmd` — render to PNG per doc 00's
instructions and embed it in your submission.

## Written explanation draft

> **Frontend scaling use cases**
> Frontend tiers typically see very different load patterns than backend
> APIs: a marketing campaign or a link shared on social media can drive a
> sudden burst of visitors requesting the same static assets (HTML, CSS,
> JS, images) simultaneously. Auto Scaling the frontend tier — combined
> with CloudFront caching static assets at edge locations — offloads
> repeated requests away from origin servers entirely, meaning the
> frontend ASG itself often needs to scale less aggressively than the
> backend tier, since CloudFront absorbs the bulk of read-heavy traffic.
> Where frontend Auto Scaling remains valuable is for dynamic
> server-rendered pages or heavy client-facing traffic spikes that bypass
> the CDN cache (e.g. cache misses, personalized content, or the initial
> wave of a viral spike before CDN caches warm up) — for these cases,
> request-count-based target tracking scaling reacts directly to real
> user traffic volume rather than an indirect proxy metric like CPU.

This draft is also available standalone (no separate writing-templates
file for this optional doc — copy directly from here).

## Deliverables checklist
- [ ] Architecture diagram (rendered from `diagrams/frontend-asg-bonus.mmd`)
- [ ] Written explanation: frontend scaling use cases
