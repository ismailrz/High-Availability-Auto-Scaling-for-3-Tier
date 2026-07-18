# Submission Checklist

Maps every deliverable required by `assignment.md` to either something
already produced in this repo, or something you must capture yourself in
the AWS Console. Work through this top to bottom before assembling your PDF.

| # | Deliverable | Status |
|---|---|---|
| 1 | Architecture diagram (3-tier) | Produced in this repo: `diagrams/3-tier-architecture.mmd` (render to PNG) |
| 2 | Explanation: why Auto Scaling is mandatory | Produced in this repo: `docs/01-architecture-3tier.md` |
| 3 | Explanation: how HA is achieved | Produced in this repo: `docs/01-architecture-3tier.md` |
| 4 | Explanation: request flow between tiers | Produced in this repo: `docs/01-architecture-3tier.md` |
| 5 | Screenshot: Launch Template | Student must capture — see `docs/02-backend-asg-launch-template-target-group.md`, Step 5 |
| 6 | Screenshot: Auto Scaling Group (min 1 / desired 1 / max 3) | Student must capture — see `docs/02-...md`, Step 8 |
| 7 | Screenshot: Target Group | Student must capture — see `docs/02-...md`, Step 6 |
| 8 | Screenshot: working ALB DNS serving backend responses | Student must capture — see `docs/02-...md`, Step 9 |
| 9 | Screenshots: instance replacement (before/during/after) | Student must capture — see `docs/03-health-checks-self-healing.md`, "Failure simulation" |
| 10 | Explanation: self-healing in cloud infrastructure | Produced in this repo: `docs/03-...md` and `docs/writing-templates/self-healing-explanation.md` |
| 11 | Explanation: role of health checks | Produced in this repo: `docs/03-...md` and `docs/writing-templates/self-healing-explanation.md` |
| 12 | Screenshot: scaling policies | Student must capture — see `docs/04-scaling-policies.md`, "Step scaling policies" |
| 13 | Explanation: manual vs. auto scaling | Produced in this repo: `docs/04-...md` and `docs/writing-templates/manual-vs-auto-scaling.md` |
| 14 | Explanation: real-world auto scaling scenarios | Produced in this repo: `docs/04-...md` and `docs/writing-templates/manual-vs-auto-scaling.md` |
| 15 | One-page CI/CD challenges explanation | Produced in this repo: `docs/05-cicd-challenges-essay.md` (personalize before submitting) |
| 16 | CI/CD architecture diagram | Produced in this repo: `diagrams/cicd-pipeline-flow.mmd` (render to PNG) |
| 17 | CI/CD step-by-step flow description | Produced in this repo: `docs/06-cicd-architecture-design.md` |
| 18 | Screenshot: successful pipeline execution | Student must capture — see `docs/07-cicd-pipeline-setup.md`, Step 6 |
| 19 | Screenshot: CodeDeploy deployment group | Student must capture — see `docs/07-...md`, Step 4 and Step 6 |
| 20 | Proof of updated backend version served through ALB | Student must capture — see `docs/07-...md`, Step 6 |
| 21 | Architecture diagram: Blue/Green environments | Produced in this repo: `diagrams/blue-green-traffic-shift.mmd` (render to PNG) |
| 22 | Explanation: Blue/Green vs. Rolling deployment | Produced in this repo: `docs/08-blue-green-deployment.md` and `docs/writing-templates/bluegreen-vs-rolling.md` |
| 23 | Explanation: how Blue/Green reduces downtime/risk | Produced in this repo: `docs/08-...md` and `docs/writing-templates/bluegreen-vs-rolling.md` |
| 24 | Screenshot: deployment on newly created instance | Student must capture — see `docs/09-auto-deploy-new-instance-demo.md`, "Demo steps" |
| 25 | Explanation: importance of auto-deployment | Produced in this repo: `docs/09-...md` and `docs/writing-templates/importance-of-auto-deployment.md` |
| 26 | Explanation: problems solved by automated deployments | Produced in this repo: `docs/09-...md` and `docs/writing-templates/importance-of-auto-deployment.md` |
| 27 | (Optional) Architecture diagram: frontend ASG | Produced in this repo: `diagrams/frontend-asg-bonus.mmd` (render to PNG) |
| 28 | (Optional) Explanation: frontend scaling use cases | Produced in this repo: `docs/10-frontend-asg-bonus.md` |
| 29 | Challenges faced and lessons learned | Not produced in this repo — write this yourself after completing the console work; it's inherently personal (what actually went wrong for you, what you'd do differently) |

## Assembling the final PDF

1. Render every `.mmd` file in `diagrams/` to PNG (see
   `docs/00-overview-and-checklist.md`, "Rendering the Mermaid diagrams
   to PNG").
2. Create a master document (Google Docs, Word, or Markdown → pandoc)
   in this order:
   1. Title page
   2. Section 2 — Architecture overview (item #1-4 above)
   3. Section 3 — Task 1: Auto Scaling implementation (#5-8)
   4. Section 4 — Tasks 2 & 3: Health checks and self-healing (#9-11)
   5. Section 5 — Task 4: Scaling policies (#12-14)
   6. Section 6 — Task 5: CI/CD challenges (#15)
   7. Section 7 — Task 6: CI/CD architecture design (#16-17)
   8. Section 8 — Task 7: CI/CD pipeline implementation (#18-20)
   9. Section 9 — Task 8: Blue/Green deployment (#21-23)
   10. Section 10 — Task 9: Auto-deployment to new instances (#24-26)
   11. Section 11 — Task 10: Frontend Auto Scaling, if attempted (#27-28)
   12. Challenges faced and lessons learned (#29)
3. Export/print the master document to PDF.
4. Name the file exactly: `AutoScaling_CICD_3Tier_<StudentName>.pdf`
   (replace `<StudentName>` with your actual name).
5. Final proofread pass: confirm every screenshot is legible (not
   cropped/blurry), every explanation section is present, and every
   `<placeholder>` value (ALB DNS names, region names, resource names)
   in your copied draft text has been replaced with your actual values.
