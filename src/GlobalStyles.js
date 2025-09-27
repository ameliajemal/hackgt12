// src/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Import font families */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lexend:wght@600;700&display=swap');

  /* CSS Variables for easy theming */
  :root {
    --color-primary: #7ac77d;
    --color-secondary: #5fa45a;
    --color-bg: #f4f7fc;
    --color-text: #333;
    --font-body: 'Inter', sans-serif;
    --font-heading: 'Lexend', sans-serif;
  }

  /* Reset & box-sizing */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Base body styles */
  body {
    font-family: var(--font-body);
    background-color: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    color: var(--color-primary);
    margin-bottom: 1rem;
  }

  h1 { font-size: 4rem; }
  h2 { font-size: 3rem; }
  h3 { font-size: 2rem; }
  h4 { font-size: 1.5rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  /* Links */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Buttons & form elements inherit body font */
  button,
  input,
  select,
  textarea {
    font-family: var(--font-body);
  }

  /* Images & video responsive */
  img,
  video {
    max-width: 100%;
    display: block;
  }

  /* Remove default list styles */
  ul, ol {
    list-style: none;
  }

  /* Optional: customize scrollbar (WebKit browsers) */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--color-bg);
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--color-primary);
    border-radius: 4px;
  }
`;

export default GlobalStyles;
