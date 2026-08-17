# Captain QA Bot

**Captain QA Bot** is an experimental AI-powered learning assistant for software testing and quality assurance.

> Your slightly obsessive QA learning buddy.

The project is designed to make exploring QA concepts more conversational, practical, and a little less boring.

## What it can help with

Captain QA Bot is primarily focused on:

- Manual and automated testing
- Test automation
- Cypress
- Playwright
- Selenium
- TypeScript and JavaScript
- API testing
- CI/CD
- Performance testing
- Agile and Scrum
- Software testing principles
- ISTQB-related concepts

It can also answer unrelated questions naturally when appropriate.

## Source tree

```text
qa-robot/
├── images/
├── node_modules/
├── server/
│   ├── ai.ts
│   └── index.ts
├── src/
│   ├── main.ts
│   └── style.css
├── .env
├── .gitignore
├── index.html
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

## Tech stack

- Vite
- TypeScript
- HTML
- CSS
- Gemini API

## Running locally

Clone the repository and install the dependencies:

```bash
git clone [https://github.com/eugenrof/qa-robot.git](https://github.com/eugenrof/qa-robot.git)
cd qa-robot
npm install
```

Start the development server:

```bash
npm run dev
```

Then open the local URL shown by Vite, typically:

```text
http://localhost:5173/
```

## API key

Captain QA Bot uses a Gemini API key to generate answers.

### Getting a Gemini API key

You need your **own Gemini API key** to use the bot.

1. Open **[Google AI Studio](https://aistudio.google.com/)**.
2. Go to the **API Keys** page.
3. Click **Create API key** and follow the prompts.
4. Copy the generated key.
5. Open Captain QA Bot and click the **Settings** button.
6. Paste the key into the **Gemini API key** field.
7. Click **Validate & Save**.

Google AI Studio can automatically create a project and API key for new users, and new keys created there are currently created as authorization keys.

### Keep your API key safe

Your API key is stored locally in this browser and is not committed to the repository.

**Never:**

- commit your API key to Git or GitHub;
- publish it in source code, screenshots, or documentation;
- share your API key with other people;
- use someone else's API key in this application.

Because this application is a browser-based client, treat the API key as sensitive even though it is stored locally. Google recommends applying appropriate API-key restrictions and replacing a key if it is exposed or compromised.

> **Tip:** For this project, use a key created specifically for the Gemini API and keep it private.

## GitHub Pages

The project is intended to be published as a static site through GitHub Pages.

The production build can be generated with:

```bash
npm run build
```

The generated files are placed in the Vite `dist/` directory.

> Note: development-only API routes are not available on GitHub Pages. The deployed application uses the client-side Gemini integration.

## Project status

**Experimental / personal project**

This project is primarily a learning experiment and a practical demonstration of building a small AI-powered QA tool.

## Author

**Eugen Rof**

Senior QA Engineer

- GitHub: https://github.com/eugenrof
- Portfolio: https://eugenrof.dev/

## License

Copyright © 2026 Eugen Rof.

See [`LICENSE`](LICENSE) for details.
