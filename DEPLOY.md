# Deploying Polymathics to GitHub Pages

This guide walks you through publishing the Polymathics website to **GitHub Pages** using **GitHub Actions** so it automatically rebuilds whenever you push changes.

---

## Prerequisites

- A GitHub account
- [Git](https://git-scm.com/) installed on your Mac
- [Node.js](https://nodejs.org/) (v18+) installed (you already have this)

---

## 1. Create the GitHub Repository (if you haven't already)

1. Go to [github.com/new](https://github.com/new).
2. Name the repo — for example, `polymathicstrat`.
3. Set it to **Public** (required for free GitHub Pages).
4. **Do NOT** initialize with a README, `.gitignore`, or license (we'll push from your local project).
5. Click **Create repository**.

---

## 2. Initialize Git & Push Your Code

Open a terminal in the project folder (`/Users/dagobertofarias/Desktop/Polymathics`) and run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tenken127/polymathicstrat.git
git push -u origin main
```

> **Note:** If you already have a remote set up, skip the `git remote add` step.

---

## 3. Add the GitHub Actions Workflow

A workflow file has already been created at:

```
.github/workflows/deploy.yml
```

This file tells GitHub to:
1. Install Node.js dependencies (`npm ci`)
2. Build the Vite project (`npm run build`)
3. Deploy the `dist/` folder to GitHub Pages

**No additional configuration is needed** — just commit and push this file.

---

## 4. Enable GitHub Pages in Repository Settings

1. Go to your repo on GitHub → **Settings** → **Pages** (left sidebar).
2. Under **Source**, select **GitHub Actions**.
3. Click **Save**.

---

## 5. Deploy!

Push all your changes (including the workflow file):

```bash
git add .
git commit -m "Add GitHub Actions deploy workflow"
git push
```

GitHub Actions will automatically run the build and deploy. You can monitor progress in the **Actions** tab of your repository.

---

## 6. Access Your Site

Once the workflow completes successfully, your site will be live at:

```
https://tenken127.github.io/polymathicstrat/
```

> **Tip:** It may take 1–2 minutes for the first deployment to propagate.

---

## Updating the Site

After the initial setup, every `git push` to the `main` branch will automatically rebuild and redeploy the site. Just:

```bash
git add .
git commit -m "Your change description"
git push
```

---

## Custom Domain (Optional)

To use a custom domain like `polymathics.ai`:

1. Go to **Settings → Pages** in your repo.
2. Enter your custom domain and click **Save**.
3. Add these DNS records with your domain registrar:

   | Type  | Name | Value                          |
   |-------|------|--------------------------------|
   | CNAME | www  | `tenken127.github.io`          |
   | A     | @    | `185.199.108.153`              |
   | A     | @    | `185.199.109.153`              |
   | A     | @    | `185.199.110.153`              |
   | A     | @    | `185.199.111.153`              |

4. Check **Enforce HTTPS** once the certificate is provisioned.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| **404 on the live site** | Make sure GitHub Pages source is set to **GitHub Actions** (not a branch). |
| **Assets not loading (broken images/CSS)** | Ensure `base` in `vite.config.js` is set to `'/polymathicstrat/'`. |
| **Build fails in Actions** | Check the Actions tab for error logs. Usually a missing dependency — run `npm ci` locally to verify. |
