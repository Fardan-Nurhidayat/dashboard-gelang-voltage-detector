# IoT Voltage Detector

## Overview

This project integrates an IoT Voltage Detector with a modern web interface. The application provides real-time monitoring and visualization of voltage data collected from IoT devices.

## Tech Stack

- **React 19**: Latest version of the React library for building user interfaces
- **TypeScript 5**: Strongly typed programming language that builds on JavaScript
- **Vite 6**: Next generation frontend tooling for faster development and optimized builds
- **shadcn/ui 2.5**: High-quality UI components built with Radix UI and Tailwind CSS

## Features

- Real-time voltage monitoring
- Data visualization with interactive charts
- Device management interface
- Historical data analysis
- Alert configuration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Fardan-Nurhidayat/dashboard-gelang-voltage-detector.git
   cd iot-voltage-detector
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
iot-voltage-detector/
├── public/
├── src/
│   ├── app/
    |── dashboard/
        data.json
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Development

### Building for Production

```bash
npm run build
# or
yarn build
```

<!-- ### Running Tests

```bash
npm run test
# or
yarn test
``` -->

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
