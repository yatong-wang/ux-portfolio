## Branch workflow diagram
             (never merged)
wip  ── commits ── commits ───────────────┐
                                          │  (copy only finished work)
                                          └──► dev ── commits ──► PR ──► main ──► Netlify deploy
                                                          (release tags here)

## Daily Flow
### 1 - Draft + experiment (WIP)

    ```
    git checkout wip
    # edit files (wip/ etc.)

    git add -A
    git commit -m "WIP: draft case2 layout"
    git push
    ```

### 2) Move finished work from `wip` → `dev`
Pick one of these:

    #### 2A) Cherry-pick a specific commit (cleanest)

        ```
        git checkout dev
        git cherry-pick <commit_sha>
        git push
        ```
    #### 2B) Copy just a folder/file from `wip` (no commit history)

        ```
        git checkout dev
        git checkout wip -- public/data/projects.json public/assets/projects/
        git commit -m "Add project assets + data"
        git push
        ```

### 3) Ship from `dev` → `main`

- Open PR on GitHub: `dev` → `main`
- Merge
- Netlify deploys automatically

### 4) Tag releases on `main` (milestones only)

    ```
    git checkout main
    git pull
    git tag -a v0.3.0 -m "About page live"
    git push origin v0.3.0
    ```
