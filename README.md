# Amy Simpson - Portfolio

A modern, high-performance portfolio website built with React, Vite, Tailwind CSS, and Framer Motion.

## Features

- **Responsive Design**: Fully responsive layout that looks great on mobile, tablet, and desktop.
- **Dark Mode**: Built-in dark mode support with a smooth transition.
- **Animations**: Rich, performant animations using Framer Motion and GSAP.
- **Accessibility**: Support for `prefers-reduced-motion` to disable animations for users who prefer it.
- **Performance**: Optimized asset loading and rendering.

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion & GSAP
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kuza-kami/amy-simpson-V2.git
   cd amy-simpson-V2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Deployment

This project is configured for deployment to GitHub Pages.

To deploy the application:

1. Make sure your `homepage` in `package.json` is set correctly:
   ```json
   "homepage": "https://kuza-kami.github.io/amy-simpson-V2/"
   ```

2. Run the deploy script:
   ```bash
   npm run deploy
   ```

This will automatically build the project and push the `dist` folder to the `gh-pages` branch.

## License

This project is open source and available under the [MIT License](LICENSE).
