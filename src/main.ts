//@ts-nocheck

import "./style.css";

const chatForm =
    document.querySelector<HTMLFormElement>("#chat-form");

const chatInput =
    document.querySelector<HTMLInputElement>("#message-input");

const chatMessages =
    document.querySelector<HTMLElement>("#chat");

const backToTopButton =
    document.querySelector<HTMLButtonElement>("#back-to-top");

const settingsButton =
    document.querySelector<HTMLButtonElement>("#settings-button");

const settingsPanel =
    document.querySelector<HTMLElement>("#settings-panel");

const settingsClose =
    document.querySelector<HTMLButtonElement>("#settings-close");

const apiKeyInput =
    document.querySelector<HTMLInputElement>("#api-key-input");

const settingsSave =
    document.querySelector<HTMLButtonElement>("#save-api-key");

const settingsClear =
    document.querySelector<HTMLButtonElement>("#clear-api-key");

const API_KEY_STORAGE_KEY =
    "captain-qa-bot-gemini-api-key";

const GEMINI_MODEL =
    "gemini-3.5-flash-lite";

const GEMINI_API_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `
You are Captain QA Bot, an AI assistant specialized in software testing and quality assurance.

Your areas of expertise include:
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
- Software testing principles and ISTQB concepts

You are primarily a QA and software testing assistant, but you are not restricted
to QA topics.

For unrelated questions, answer helpfully and naturally. When appropriate, use
your QA personality to make playful connections between the user's topic and
software testing, but do not force a QA analogy into every response.

Maintain a slightly obsessive, witty QA personality while remaining useful.

Give practical, technically accurate answers.
Prefer examples when they help.
If the user asks about an official standard, certification, or documentation,
clearly distinguish between your explanation and authoritative references.
`;


/* =========================================================
   Page scrolling / Back to Top
   ========================================================= */

function scrollPageToBottom(
    smooth = false
): void {
    requestAnimationFrame(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: smooth
                ? "smooth"
                : "auto",
        });
    });
}

function scrollPageToTop(): void {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

function updateBackToTopVisibility(): void {
    if (!backToTopButton) {
        return;
    }

    const shouldShow =
        window.scrollY > 300;

    backToTopButton.hidden =
        !shouldShow;
}

window.addEventListener(
    "scroll",
    updateBackToTopVisibility,
    { passive: true }
);

backToTopButton?.addEventListener(
    "click",
    scrollPageToTop
);


/* =========================================================
   Messages
   ========================================================= */

function addMessage(
    message: string,
    sender: "user" | "bot"
): void {
    if (!chatMessages) return;

    const messageElement =
        document.createElement("div");

    messageElement.className =
        sender === "bot"
            ? "message robot-message"
            : "message user-message";

    const authorElement =
        document.createElement("div");

    authorElement.className =
        "message-author";

    if (sender === "bot") {
        const avatar =
            document.createElement("img");

        avatar.className =
            "message-avatar";

        avatar.src =
            "https://raw.githubusercontent.com/eugenrof/captain-qa-bot/refs/heads/main/images/qa_bot_logo.png";

        avatar.alt = "";

        const name =
            document.createElement("span");

        name.textContent =
            "Captain QA Bot";

        authorElement.appendChild(
            avatar
        );

        authorElement.appendChild(
            name
        );
    } else {
        authorElement.textContent =
            "You";
    }

    const contentElement =
        document.createElement("div");

    contentElement.className =
        "message-content";

    contentElement.textContent =
        message;

    messageElement.appendChild(
        authorElement
    );

    messageElement.appendChild(
        contentElement
    );

    chatMessages.appendChild(
        messageElement
    );

    scrollPageToBottom();
}

function addLoadingMessage(): HTMLElement | null {
    if (!chatMessages) return null;

    const messageElement =
        document.createElement("div");

    messageElement.className =
        "message robot-message loading-message";

    const authorElement =
        document.createElement("div");

    authorElement.className =
        "message-author";

    const avatar =
        document.createElement("img");

    avatar.className =
        "message-avatar";

    avatar.src =
        "/images/qa_bot_logo.png";

    avatar.alt = "";

    const name =
        document.createElement("span");

    name.textContent =
        "Captain QA Bot";

    authorElement.appendChild(
        avatar
    );

    authorElement.appendChild(
        name
    );

    const contentElement =
        document.createElement("div");

    contentElement.className =
        "message-content thinking";

    contentElement.innerHTML = `
        <span class="thinking-text">Thinking</span>
        <span class="thinking-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </span>
    `;

    messageElement.appendChild(
        authorElement
    );

    messageElement.appendChild(
        contentElement
    );

    chatMessages.appendChild(
        messageElement
    );

    scrollPageToBottom(true);

    return messageElement;
}


/* =========================================================
   Settings helpers
   ========================================================= */

function showSettingsError(
    message: string
): void {
    let errorElement =
        document.querySelector<HTMLElement>(
            ".settings-error"
        );

    if (!errorElement) {
        errorElement =
            document.createElement("p");

        errorElement.className =
            "settings-error";

        apiKeyInput?.insertAdjacentElement(
            "afterend",
            errorElement
        );
    }

    errorElement.textContent =
        message;

    errorElement.hidden =
        false;
}

function clearSettingsError(): void {
    const errorElement =
        document.querySelector<HTMLElement>(
            ".settings-error"
        );

    if (errorElement) {
        errorElement.hidden =
            true;

        errorElement.textContent =
            "";
    }
}

function openSettings(): void {
    if (!settingsPanel) return;

    settingsPanel.hidden =
        false;

    settingsButton?.setAttribute(
        "aria-expanded",
        "true"
    );

    clearSettingsError();

    apiKeyInput?.focus();
}

function closeSettings(): void {
    if (!settingsPanel) return;

    settingsPanel.hidden =
        true;

    settingsButton?.setAttribute(
        "aria-expanded",
        "false"
    );

    clearSettingsError();
}

function loadApiKey(): void {
    const savedKey =
        localStorage.getItem(
            API_KEY_STORAGE_KEY
        );

    if (apiKeyInput && savedKey) {
        apiKeyInput.value =
            savedKey;
    }
}


/* =========================================================
   Gemini API key validation
   ========================================================= */

function isValidApiKeyFormat(
    apiKey: string
): boolean {
    if (!apiKey.startsWith("AIza")) {
        return false;
    }

    if (
        apiKey.length < 30 ||
        apiKey.length > 100
    ) {
        return false;
    }

    return true;
}

async function validateApiKey(
    apiKey: string
): Promise<void> {
    const response =
        await fetch(
            `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        "Reply with exactly: OK",
                                },
                            ],
                        },
                    ],
                }),
            }
        );

    const data =
        await response.json();

    if (!response.ok) {
        const apiError =
            data?.error?.message ||
            `Gemini returned HTTP ${response.status}.`;

        throw new Error(
            apiError
        );
    }

    const answer =
        data?.candidates?.[0]
            ?.content?.parts?.[0]?.text;

    if (!answer) {
        throw new Error(
            "Gemini accepted the request but returned no response."
        );
    }
}


/* =========================================================
   Save / Clear API key
   ========================================================= */

async function saveApiKey(): Promise<void> {
    if (!apiKeyInput || !settingsSave) {
        return;
    }

    const apiKey =
        apiKeyInput.value.trim();

    clearSettingsError();

    if (!apiKey) {
        showSettingsError(
            "Please enter a Gemini API key."
        );

        apiKeyInput.focus();

        return;
    }

    if (!isValidApiKeyFormat(apiKey)) {
        showSettingsError(
            "That doesn't look like a valid Gemini API key."
        );

        apiKeyInput.focus();

        return;
    }

    const originalButtonText =
        settingsSave.textContent ||
        "Validate & Save";

    settingsSave.disabled =
        true;

    settingsSave.textContent =
        "Validating…";

    apiKeyInput.disabled =
        true;

    try {
        await validateApiKey(
            apiKey
        );

        localStorage.setItem(
            API_KEY_STORAGE_KEY,
            apiKey
        );

        closeSettings();
    } catch (error) {
        console.error(
            "Gemini API key validation failed:",
            error
        );

        let errorMessage =
            "The Gemini API key could not be validated.";

        if (error instanceof Error) {
            errorMessage =
                error.message;
        }

        showSettingsError(
            `API key validation failed: ${errorMessage}`
        );

        apiKeyInput.focus();
    } finally {
        settingsSave.disabled =
            false;

        settingsSave.textContent =
            originalButtonText;

        apiKeyInput.disabled =
            false;
    }
}

function clearApiKey(): void {
    localStorage.removeItem(
        API_KEY_STORAGE_KEY
    );

    if (apiKeyInput) {
        apiKeyInput.value =
            "";
    }

    clearSettingsError();

    apiKeyInput?.focus();
}


/* =========================================================
   Gemini chat
   ========================================================= */

async function askGeminiDirectly(
    message: string
): Promise<string> {
    const apiKey =
        localStorage.getItem(
            API_KEY_STORAGE_KEY
        );

    if (!apiKey) {
        throw new Error(
            "No Gemini API key is configured. Open Settings and add your API key."
        );
    }

    const response =
        await fetch(
            `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    system_instruction: {
                        parts: [
                            {
                                text:
                                    SYSTEM_PROMPT,
                            },
                        ],
                    },

                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        message,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data?.error?.message ||
                `Gemini request failed with status ${response.status}.`
        );
    }

    const answer =
        data?.candidates?.[0]
            ?.content?.parts?.[0]?.text;

    if (!answer) {
        throw new Error(
            "Gemini returned an empty response."
        );
    }

    return answer;
}


/* =========================================================
   Chat API
   ========================================================= */

async function askCaptainQABot(
    message: string
): Promise<string> {
    if (import.meta.env.DEV) {
        const response =
            await fetch(
                "/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        message,
                    }),
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ||
                    "Local API request failed."
            );
        }

        return data.answer;
    }

    return askGeminiDirectly(
        message
    );
}


/* =========================================================
   Settings events
   ========================================================= */

settingsButton?.addEventListener(
    "click",
    () => {
        if (settingsPanel?.hidden) {
            openSettings();
        } else {
            closeSettings();
        }
    }
);

settingsClose?.addEventListener(
    "click",
    closeSettings
);

settingsSave?.addEventListener(
    "click",
    () => {
        void saveApiKey();
    }
);

settingsClear?.addEventListener(
    "click",
    clearApiKey
);


/* =========================================================
   Close settings with Escape
   ========================================================= */

document.addEventListener(
    "keydown",
    (event: KeyboardEvent) => {
        if (
            event.key === "Escape" &&
            settingsPanel &&
            !settingsPanel.hidden
        ) {
            closeSettings();
        }
    }
);


/* =========================================================
   Chat
   ========================================================= */

chatForm?.addEventListener(
    "submit",
    async (event) => {
        event.preventDefault();

        const message =
            chatInput?.value.trim();

        if (!message) return;

        addMessage(
            message,
            "user"
        );

        if (chatInput) {
            chatInput.value =
                "";

            chatInput.disabled =
                true;
        }

        const loadingMessage =
            addLoadingMessage();

        try {
            const answer =
                await askCaptainQABot(
                    message
                );

            loadingMessage?.remove();

            addMessage(
                answer,
                "bot"
            );
        } catch (error) {
            console.error(
                "Chat error:",
                error
            );

            loadingMessage?.remove();

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred.";

            addMessage(
                `Oops. Captain QA Bot encountered an error. 🤖💥\n\n${errorMessage}`,
                "bot"
            );
        } finally {
            if (chatInput) {
                chatInput.disabled =
                    false;

                chatInput.focus();
            }
        }
    }
);


/* =========================================================
   Initialization
   ========================================================= */

loadApiKey();
updateBackToTopVisibility();
