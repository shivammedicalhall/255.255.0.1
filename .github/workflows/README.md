# Payment Gateway System (Amount-Specific QR)

This project provides:

- **Backend page** (`admin.html`) to set merchant details and amount.
- **Customer payment page** (`index.html`) that generates a UPI QR for the specific amount.

## Run locally

```bash
python3 -m http.server 8000
```

Open:

- `http://localhost:8000/admin.html` to configure payment.
- `http://localhost:8000/index.html` to view the generated QR page.

## Why it was not working on GitHub Pages

Two common issues were causing this:

1. The generated customer URL in `admin.js` used `window.location.origin + /index.html`, which can break when the site is served from a repository subpath (for example `https://username.github.io/repo-name/`).
2. GitHub Pages deployment was not configured in the repository.

Both are now fixed.

## GitHub Pages hosting steps

1. Push this repository to GitHub.
2. In GitHub repo settings, go to **Pages** and set source to **GitHub Actions**.
3. Ensure default branch is `main` (or keep `master`; workflow supports both).
4. Push a commit. The workflow in `.github/workflows/deploy-pages.yml` will deploy automatically.

After deployment, open:

- `https://<your-username>.github.io/<repo-name>/admin.html`

From there, generated payment links will correctly stay inside the same GitHub Pages repo path.
