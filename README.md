# Yatong’s UX Portfolio
[![built-with-cursor](https://github.com/user-attachments/assets/57f2fe7e-8f62-47df-be36-a75602f74d88)](https://forthebadge.com)

> A lightweight static portfolio site using JSON for content management and vanilla JavaScript for rendering.

My personal UX / product design portfolio built from scratch to demonstrate how I design and ship using AI-powered workflows.

I've chosen to build with a simple frontend stack rather than popular frameworks, for the sake of easy maintenance. This project is also a playground for me to tinker with AI tools, use Git for version controls, and get a taste of how web deployment works.

### Live Site

🔗 URL: https://lab.yatongwang.com 
>(redirects to https://yatong-wang.netlify.app)

>  Landing Page Preview
[![thumbnail-yatong-wang-ux-portfolio](https://github.com/user-attachments/assets/2e16f9d6-2e5f-44aa-b128-c95dd39cd718)](https://yatong-wang.netlify.app)


### Disclaimer
The site is *independently* developed by me, so no formal peer code review exists in place to ensure code quality. But I’m aware of the vital importance of readable and clean code; I use my best knowledge to combat AI slop.

---
## Table of Contents
- [Technical Overview](#technical-overview)
  - [Tech Stack](#tech-stack)
  - [Repository Structure](#repository-structure)
  - [Branch](#branch)
  - [Deployment](#deployment)
- [AI-Powered Design & Coding Flow](#ai-powered-design--coding-flow)
  - [Tools I Use](#tools-i-use)
  - [Workflow](#workflow) 
- [To Dos](#to-dos)
- [License](#license)
- [AI Usage Disclosure](#ai-usage-disclosure)


## Technical Overview
[↑ Back to TOC](#table-of-contents)

### Tech Stack
[![Tech Stack](https://skillicons.dev/icons?i=html,css,tailwind,js)](https://skillicons.dev)
- **HTML** (semantic structure)
- **Tailwind CSS** + custom `styles.css`
- **Vanilla JavaScript**
- **JSON** for dynamic content management


### Repository Structure
- `public/` → 
  - `assets/` → Images, cursors, and visual assets
  - `data/` → Content and copy stored as JSON
  - `js/` → Content loaders and interaction scripts

### Branch
- `main` → production (auto-deployed via Netlify)
- `dev`  → release candidates
- `wip`  → drafts and sandbox work
- `archive` → storage for initial concepts and references


### Deployment
- **Hosting**: Netlify (Free Plan)
- **Production Branch**: `main`
- **Preview / Staging**: `dev` via pull requests
- **Auto Deploy**: Enabled for `main` only


## AI-Powered Design & Coding Flow
[↑ Back to TOC](#table-of-contents)

### Tools I Use
- **Design:** Stitch with Google, Figma, Pencil
- **Primary IDE:** Cursor
- **Coding & Engineering Guidance:** Claude, ChatGPT  
  - (for minor coding problem assistance, Git/GitHub best practices, repo architecture, version control workflows, etc.)

All AI-generated output is reviewed and fine tuned before being committed.

### Workflow
1. Prompt in Stitch with Google for page designs. Draw inspirations from my older portfolio and online examples. Iterate each page until satisfied.
2. Export desired variations from Stitch by Google as HTML files.
3. Create a repo in GitHub. Clone the repo in Cursor to work locally and commit changes when ready.
4. In Cursor, refractor the raw HTML files by setting up the repo structure (external CSS stylesheets.
5. Ask, plan and build in Cursor, and learn by tinkering.
6. Make small code tweaks by asking Claude / ChatGPT, or modify them manually...***so that your AI tokens won't be gone in a heartbeat***.

   <img width="515" height="244" alt="image of this is fine meme" src="https://github.com/user-attachments/assets/6d2dba03-dbab-4913-a275-722818e38743" />
7. Create assets and components in Figma.
8. (Currently experimenting) Vibe design using Pencil within Cursor.


## To Dos
[↑ Back to TOC](#table-of-contents)

- [x] Add an "About Me" page
- [ ] Generate templates and components for case studies page
- [ ] Write content for case studies
- [ ] Build and publish one case study
- [ ] Build remaining case studies
- [ ] Evaluate and implement analytics tools
- [ ] Design and implement dark mode
- [ ] Add a "Fun / Experiments" page


## License
[↑ Back to TOC](#table-of-contents)

See the [LICENSE.md](LICENSE.md) for details. In short, the repo is publicly viewable for evaluation only. All rights reserved.


## AI Usage Disclosure
[↑ Back to TOC](#table-of-contents)

This portfolio is being built in public using AI tools including Cursor, Claude, ChatGPT, Stitch with Google and more.

AI was used to accelerate scaffolding, refactoring, technical exploration and copywriting.

All design decisions, system architecture choices and final implementations were reviewed, modified and validated by me.

This project is intended to showcase my ability to apply AI tools in a production-ready UX and frontend development workflow.

[↑ Back to top](#yatongs-ux-portfolio)