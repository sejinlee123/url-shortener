# FreeUrlShortener

A simple URL shortener: paste a long link, get a short one, and optionally view basic click stats. Built as a hobby project with a React frontend, Go backend, and AWS infrastructure.

**Live site:** [https://urlshortenerfree.xyz](https://urlshortenerfree.xyz)

---

## What it does

- **Shorten** – Enter a URL and get a short link (e.g. `https://urlshortenerfree.xyz/r/abc12345`).
- **Redirect** – Visiting a short link sends you to the original URL.
- **Dashboard** – See your last 5 shortened links (stored in browser local storage).
- **Stats** – View click count and destination for a short code.
- **Legal** – Terms of Service, Privacy Policy, and Cookies Policy; you must accept them before creating a link.

Links expire after 1 week of no use; the create API is rate-limited per IP.

---

## Tech stack

| Layer        | Stack                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS                                                |
| **Backend**  | Go (Gin), PostgreSQL ([Neon](https://neon.tech))                                     |
| **Infra**    | AWS Lambda, API Gateway, S3, CloudFront, Terraform, GitHub Actions                   |

---

## Project structure

- **`url_shortener/`** – React app (Vite). Build output is deployed to S3 and served via CloudFront.
- **`backend/`** – Go API (shorten, resolve, stats). Deployed as a Lambda behind API Gateway.
- **`terraform/`** – AWS resources (Lambda, API Gateway, S3, CloudFront). Neon provides PostgreSQL separately.
- **`.github/workflows/`** – CI/CD (deploy on push to `main`). Set GitHub secret **`NEON_DATABASE_URL`** to your Neon connection string (same format as `DATABASE_URL` in Lambda); replace the old **`DB_PASSWORD`** secret.

---

## License

See [LICENSE](LICENSE).
