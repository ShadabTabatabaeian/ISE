# ISE Interface (GitHub Pages)

This folder contains a static app that matches your two-column interface:
- Left: chat with bot
- Right: sketchpad, copy button, final submission, submit-and-score, status, submission history

## Run locally

Open `index.html` directly in a browser, or run a static server from this folder.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In GitHub, open `Settings > Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to `main` (or `master`) branch.
5. The workflow `.github/workflows/deploy-ise-pages.yml` will deploy the `ISE` folder.

Your site URL will be:
`https://<your-github-username>.github.io/<repo-name>/`

## Notes

- This version uses a client-side bot (no backend/API key required).
- Distinctiveness score is a simple local heuristic for demo/prototyping.
