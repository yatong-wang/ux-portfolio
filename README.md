# Yatong’s UX Portfolio
[![built-with-cursor](https://github.com/user-attachments/assets/57f2fe7e-8f62-47df-be36-a75602f74d88)](https://forthebadge.com)

> A lightweight static portfolio site using JSON for content management and vanilla JavaScript for rendering.

My personal UX / product design portfolio built from scratch to demonstrate how I design and ship using AI-powered workflows.

I've chosen to build with a simple frontend stack rather than popular frameworks, for the sake of easy maintenance. This project is also a playground for me to tinker with AI tools, use Git for version controls, and get a taste of how web deployment works.

### Current Progress
Homepage is complete.

### Disclaimer
The site is independently developed by me, so no formal peer code review exists in place to ensure code quality, security and maintenability. But I’m aware of the vital importance of readable and clean code; I use my best knowledge to combat AI slop.

---
## Table of Contents
- [Live Site](#live-site)
- [Technical Overview](#technical-overview)
  - [Tech Stack](#tech-stack)
  - [Repository Structure](#repository-structure)
  - [Deployment](#deployment)
- [AI-Powered Design & Coding Flow](#ai-powered-design--coding-flow)
  - [Tools I Use](#tools-i-use)
  - [Workflow](#workflow) 
- [Roadmap](#roadmap)
  - [WIP](#wip)
- [Archive Branch](#archive-branch)
- [License](#license)

## Live Site
[↑ Back to top](#table-of-contents)
URL: https://yatong-wang.netlify.app

### Landing Page Preview
[![thumbnail-yatong-wang-ux-portfolio](https://github.com/user-attachments/assets/2e16f9d6-2e5f-44aa-b128-c95dd39cd718)](https://yatong-wang.netlify.app)


## Technical Overview
[↑ Back to top](#table-of-contents)

### Tech Stack
- **HTML** (semantic structure)
- **Tailwind CSS** + custom `styles.css`
- **Vanilla JavaScript**
- **JSON** for dynamic content management


### Repository Structure
- `assets/` → Images, cursors, and visual assets
- `data/` → Content and copy stored as JSON
- `js/` → Content loaders and interaction scripts

This separation keeps content, logic, and presentation cleanly decoupled.

### Deployment
Deployed on [Netlify](https://www.netlify.com) (free plan) with automatic updates from the `main` branch.


## AI-Powered Design & Coding Flow
[↑ Back to top](#table-of-contents)

### Tools I Use
- **Design:** Stitch with Google, Figma, Pencil
- **Primary IDE:** Cursor
- **Minor coding assistance:** Claude, ChatGPT (Codex)

All AI-generated output is reviewed, modified and checked by me. 

### Workflow
1. Prompt in Stitch with Google for page designs. Draw inspirations from my older portfolio and online examples. Iterate each page until satisfied.
2. Export desired variations from Stitch by Google as HTML files.
3. Create a repo in GitHub. Clone the repo in Cursor to work locally and commit changes when ready.
4. In Cursor, refractor the raw HTML files by setting up the repo structure (external CSS stylesheets.
5. Ask, plan and build in Cursor, and learn by tinkering.
6. Make small code tweaks by asking Claude / ChatGPT, or simply modify them manually...***so that your AI tokens won't be gone in a heartbeat***.

   <img width="515" height="244" alt="image of this is fine meme" src="https://github.com/user-attachments/assets/6d2dba03-dbab-4913-a275-722818e38743" />
7. Create assets and components in Figma.
8. (Currently experimenting) Vibe design using Pencil within Cursor.


## Roadmap
[↑ Back to top](#table-of-contents)

- [ ] Add an "About Me" page
- [ ] Generate templates and components for case studies page
- [ ] Write content for case studies
- [ ] Implement dark mode
- [ ] Add a "Fun / Experiments" page

### WIP
Ongoing work drafts and explorations that are not yet production-ready are stored in `wip` folder for reference.


## Archive Branch
Initial html concept files created with Stitch with Google, past iterations and discarded sections are stored in `archive` branch for reference.


## License
All rights reserved.

[↑ Back to top](#table-of-contents)
