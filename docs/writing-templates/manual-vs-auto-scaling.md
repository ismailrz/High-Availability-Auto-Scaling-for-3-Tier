<!--
Reminder: personalize this before submitting — swap in your actual
region, instance types, and reference your own screenshots where noted.
-->

# Manual Scaling vs. Auto Scaling

**Manual scaling vs. auto scaling**

Manual scaling requires an operator to notice increased load (often
after users are already impacted) and manually launch additional
instances, then manually terminate them again once load subsides. This
is slow, error-prone, and depends on someone being available and paying
attention at the right moment — including at 3 a.m. Auto scaling instead
continuously monitors a real-time metric like CPU utilization and
adjusts capacity automatically based on predefined thresholds, reacting
in minutes rather than however long it takes a human to notice and
respond, and scaling back in automatically to avoid paying for idle
capacity once load drops.

**Real-world scenarios where auto scaling is critical**

- **Flash sale / Black Friday traffic spike**: an e-commerce site can see
  traffic jump 10x for a few hours; auto scaling absorbs this without
  manual intervention and scales back down afterward.
- **Viral social media traffic**: a link to a small app going viral can
  produce an unpredictable, sudden surge with no advance warning —
  there's no time for a human to react manually.
- **Overnight/low-traffic scale-in**: a B2B application with mostly
  business-hours usage can automatically scale down overnight, directly
  reducing cost without anyone needing to schedule it.
