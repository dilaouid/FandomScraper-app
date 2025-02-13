# FandomScraper App

A **proof-of-concept** demonstration showcasing the capabilities of the [FandomScraper](https://github.com/dilaouid/FandomScraper) library. This application provides a modern interface to interact with fandom data using a monorepo structure powered by Turborepo and pnpm.

[![License: GPL](https://img.shields.io/github/license/dilaouid/FandomScraper-app)](LICENSE)
[![Turbo Repo](https://img.shields.io/badge/TurboRepo-powered-blue.svg)](https://turbo.build/repo)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Usage](#usage)
- [Project structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

The **FandomScraper App** is designed as a demonstration platform for the FandomScraper library. The app enables you to:

1. **List available wikis:** Discover all wikis supported by the scraper.
2. **Character count by language:** Retrieve and display the count of characters for each wiki based on language.
3. **Detailed character view:** Explore detailed information about a character with the ability to toggle between a condensed or extended view.

This project leverages a modern monorepo setup, making it easy to manage both the front-end and back-end applications within a single repository.

---

## Features

- **Wiki listing:** Automatically fetch and display the list of available wikis.
- **Language-Specific character count:** View the number of characters per wiki, segmented by language.
- **Toggleable detailed view:** Access comprehensive character data with an option to reveal more or less information.
- **Interactive Debug mode:** (On the client side) Access a debug view to better understand and experiment with the underlying scraping logic.
- **Monorepo management:** Uses Turborepo and pnpm for efficient development and build orchestration across both applications.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 16+ recommended)
- [pnpm](https://pnpm.io/) package manager
- [Turborepo](https://turbo.build/repo) (for running the monorepo tasks)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dilaouid/FandomScraper-app.git
   cd FandomScraper-app
   ```

2. **Install dependencies:**

   From the root of the monorepo, run:

   ```bash
   pnpm install
   ```

3. **Run the development servers:**

   Use Turborepo to concurrently start both the client and server applications:

   ```bash
   pnpm run dev
   ```

   This command will start:
   - The **front-end** (Vue 3, Vite) application.
   - The **back-end** (Node.js with TypeScript and Hono) API server.

---

## Usage

Once running, the application allows you to:

- **Browse wikis:** View a dynamic list of all supported fandom wikis.
- **See character counts:** For any selected wiki, see the number of characters available per language.
- **Explore character details:** Click on a character to view detailed information. Use the toggle option to control how much data is displayed.

Additionally, an integrated debug mode on the client side gives you insight into how queries are constructed and executed using the FandomScraper library.

---

## Project structure

```
FandomScraper-app/
├── client/                 # Front-end application (Vue 3, Vite, Tailwind CSS, etc.)
├── server/                 # Back-end application (Node.js, TypeScript, Hono)
├── package.json            # Workspace configuration for pnpm
└── turbo.json              # Turborepo configuration
```

This monorepo layout ensures that both applications share common configurations and dependencies, streamlining development and deployment.

---

## Tech Stack

### Front-End

- **Framework:** Vue 3
- **Bundler:** Vite
- **State Management:** Pinia (with persisted state plugin)
- **Routing:** Vue Router
- **Data fetching:** @tanstack/vue-query
- **Styling:** Tailwind CSS, Radix UI, shadcn-vue, etc.

### Back-End

- **Runtime:** Node.js (ES Modules)
- **Framework:** Hono (with @hono/node-server)
- **Language:** TypeScript
- **Build Tools:** tsup, tsx
- **Scraping Library:** [FandomScraper](https://www.npmjs.com/package/fandomscraper)

---

## Contributing

Contributions are welcome! If you have ideas or improvements, please fork the repository and open a pull request. For major changes, start by opening an issue to discuss your proposed changes.

---

## License

Distributed under the [GPL-3.0 License](LICENSE).

---

## Contact

- **Author:** [dilaouid](https://github.com/dilaouid)
- **FandomScraper Library:** [GitHub](https://github.com/dilaouid/FandomScraper) | [npm Package](https://www.npmjs.com/package/fandomscraper)

---

*Happy Scraping!*
