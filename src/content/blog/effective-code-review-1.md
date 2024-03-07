---
title: "Effective code review (part 1): requesting code review"
description: ""
pubDate: "March 9, 2024"
tags: ["code-review", "github"]
---

## Why do we code review? 

There are two main reasons why code review is important:

- Shifting left: finding issues earlier. many production bugs could be prevented during the code review stage.
- Learning and knowledge sharing: code review is a great opportunity for team members to learn from each other.


## What could go wrong?

![code review](/code-review-spectrum.png)
There is a spectrum of code review styles:

- On one end, code review could become a rubber-stamping process, where people review the code and approve it without investing much time in the review. This could be because they don't know how to review a pull request (PR) effectively or because they are concerned about offending the code author when pointing out issues in the code.
- On the other extreme, code review could turn into a lengthy process where people argue about technical details. Sometimes, this can go on for days and end up damaging team relationships.


The best code review lies somewhere in between, but what does a good code review look like?

## Code review is a two-way street

A successful review requires good interactions between the author and the reviewer:

- As an author, you should facilitate the work of the reviewers and make the review process easier. After all, you are asking for a favor from your peers.
- As a reviewer, you should provide clear and constructive feedback so that the code author can take action easily.

In the rest of this post, we will discuss tips that you can use when requesting a code review.

# Principles for requesting a code review:

### 1. Make the pull request (PR) small

Avoid gigantic PRs. It is a disastrous feeling to see a PR with 100+ file changes. Some colleagues might actually rubberstamp the PR because it is simply too difficult to review. Try to break big changes into smaller PRs. In fact, the task ticket itself should be broken down into smaller tickets in the first place.

### 2. Write clean git commits

A clean git commit history (see the post "[Writing atomic commits](/blog/atomic-commit)" for details) makes it much easier to understand the changes. It requires additional effort to maintain a clean commit history, but the reviewer and your future colleagues will thank you for it.

### 3. Provide context to the PR

Add additional context to the PR, such as the link to the JIRA ticket, related PRs, and a brief explanation of the implementation. Ideally, your team should have a PR template in the repository that prompts the code author to fill in this information when creating a PR. These are the important information that a reviewer will read before diving into the code changes.

### 4. Use draft PR to do a self-review

It is not uncommon to make some obvious mistakes in the PR. For example, you might accidentally push a secret or some dummy code. A good practice is to do a self-review before sending it out to your peers. One good way to do this is to use a draft PR.

- A draft PR allows the code author to examine the code on the UI.
- A draft PR usually triggers the GitHub checks (usually automated tests), so we can find out if the changes break anything.
- A draft PR does not spam notifications to the reviewers. 

Once the author thinks everything is ready, the PR can be undrafted, and notification will be sent to the reviewers.

## Waiting for feedback

Now that you have sent out the PR, what is next?

- How fast should I expect to get feedback?
- Should I always nudge my peers to review so they won't forget?

Well, it depends on your team culture. In my current team, we expect team members to review their PR queue first thing in the morning. I can expect someone on the team to give feedback on my PR within one working day. If the PR stays quiet for more than one working day, you should shout.

However, I wouldn't expect my peers to review my code immediately after I send the PR. After all, distraction is the worst productivity killer for developers. I won't interrupt my peers unless the PR is urgent.

If it is urgent, don't hold back. You have a good reason to nudge the reviewers earlier, but do explain the situation.

## Summary

This post discusses practical tips for requesting a code review. As the requester, it's important to take ownership of the review process and facilitate the work to make it easier for everyone involved to provide feedback.

In the next post, we will explore effective techniques for code reviewers to review and provide feedback.