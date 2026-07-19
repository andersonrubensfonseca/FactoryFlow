# FactoryFlow

Full-stack e-commerce platform with real payment processing, live shipping integration, and a complete admin back office.

## Overview

FactoryFlow is a complete e-commerce platform built with Laravel + Inertia + React. It covers the full purchase journey — from browsing the catalog to payment and delivery tracking — plus an admin panel for managing products, orders, and store configuration. The project started with a broader vision: evolving into a production-management tool triggered by each sale (tracking a made-to-order item through manufacturing stages). That layer is on the roadmap, not yet implemented — what exists today is a fully functional storefront and order pipeline.

## Key Features

**Storefront**
- Product catalog with category filtering, customer reviews, and images hosted on Cloudflare R2
- Session-based shopping cart (Redis-backed)
- Checkout with 3 real payment methods via [ASAAS](https://www.asaas.com/): Pix (embedded QR code), Boleto (embedded PDF), and credit card (secure hosted redirect — card data never touches our servers)
- Real-time shipping quotes and delivery tracking via OAuth2 integration with [Melhor Envio](https://melhorenvio.com.br/)
- Customer order history with payment and shipping status updating automatically
- Transactional emails (account verification, order confirmation, payment confirmed, shipping updates)

**Admin Panel**
- Product and category CRUD, with low-stock visual alerts
- Order management, with a full label generation and pickup scheduling workflow
- Live store color theme editor, applied instantly without a new deploy
- Role-based access control (admin vs. customer)

**Infrastructure**
- Containerized deployment (multi-stage Docker build) on a self-managed VPS via Coolify
- Async queue (Redis) for background email and job processing
- Signature-verified webhooks (HMAC-SHA256) for both ASAAS and Melhor Envio

## Tech Stack

| Layer | Technologies |
|---|---|
| Backend | PHP 8.4, Laravel 13, Laravel Fortify (auth), Pest (testing) |
| Frontend | React 19, Inertia.js v3, TypeScript, Tailwind CSS v4, shadcn/ui |
| Data | PostgreSQL, Redis (cache, session, queue) |
| Integrations | ASAAS (payments), Melhor Envio (shipping/tracking), Cloudflare R2 (image storage) |
| Infrastructure | Docker, Nginx, Coolify |

## Architecture Highlights

- Full OAuth2 flow with Melhor Envio, including automatic token refresh via Laravel's scheduler
- Webhook signature verification across two different formats (hex vs. base64) — each third-party integration follows its own convention
- Sensitive credentials (OAuth tokens) encrypted at rest via Laravel's native attribute casting
- Transactional emails dispatched through the queue, never blocking the user-facing request
- Multi-stage Docker build (Composer → Node → runtime) for a lean production image

## Getting Started

**Requirements:** PHP 8.4, Composer, Node.js 22+, PostgreSQL, Redis.

```bash
git clone <repository-url>
cd factoryflow

composer install
npm install

cp .env.example .env
php artisan key:generate

# Configure DB_*, REDIS_*, MAIL_*, and (optionally) R2_*, ASAAS_*, MELHOR_ENVIO_*
# in your .env before continuing

php artisan migrate
php artisan db:seed # optional: sample categories/products + an admin account

composer run dev
```

The app will be available at `http://localhost:8000`. If you ran the seeder, log in with `admin@factoryflow.test` / `password` to access the admin panel (local development only).

## Roadmap

- Sale-triggered production management pipeline (the project's original vision)
- Automated test coverage
- Production-grade SMTP provider
- Product search, discount coupons, multiple images per product

## Development Notes

This project was built through hands-on collaboration with Claude Code as a development tool — I made all product and architecture decisions (payment and shipping providers, database design, infrastructure choices), implemented and reviewed the code, and debugged production issues directly (including tracing a webhook signature mismatch down to a hex-vs-base64 encoding difference between two third-party APIs). AI accelerated the writing and research; the engineering judgment and validation were mine.
