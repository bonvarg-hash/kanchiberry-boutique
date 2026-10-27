# Kanchiberry

A prototype storefront for Kanchiberry, a contemporary saree boutique: "The finest fruit of Indian weave."

Built with Next.js 16, React 19, TypeScript and Tailwind CSS v4.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Notes

- **Prototype content.** Product names, prices, stock counts, colourways and reviews are placeholders. Replace them in `lib/products.ts` with real data before launch.
- **No backend.** The bag and wishlist are saved in the browser, the newsletter only validates the address, and checkout has no payment integration.
- **Images.** Brand photography is Kanchiberry's own. Weave and craft photographs come from Wikimedia Commons under their stated licences, credited on the site (see The Art of Weaving page).
- **Deploy.** Pushing to `main` publishes a static build to GitHub Pages (`.github/workflows/pages.yml`).
