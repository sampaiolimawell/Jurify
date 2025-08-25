
## Project Structure

```
jurify-platform
├── frontend          # Frontend application
│   ├── public       # Public assets
│   ├── src          # Source code for the frontend
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   ├── postcss.config.js   # PostCSS configuration
│   ├── tsconfig.json        # TypeScript configuration for frontend
│   ├── vite.config.ts       # Vite configuration for frontend
│   └── package.json         # Frontend dependencies and scripts
├── backend           # Backend application
│   ├── src           # Source code for the backend
│   ├── prisma        # Prisma schema and client
│   ├── package.json  # Backend dependencies and scripts
│   ├── tsconfig.json # TypeScript configuration for backend
│   └── .env         # Environment variables for backend
├── .gitignore        # Git ignore file
└── README.md         # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- SQLite (for development)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/jurify-platform.git
   cd jurify-platform
   ```

2. Install dependencies for the frontend:

   ```
   cd frontend
   npm install
   ```

3. Install dependencies for the backend:

   ```
   cd ../backend
   npm install
   ```

### Running the Project

1. Start the backend server:

   ```
   cd backend
   npm run dev
   ```

2. Start the frontend application:

   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` for the frontend.

### Features

- **User Authentication**: Secure login and registration using JWT and bcrypt.
- **Process Analysis**: View and analyze judicial processes.
- **Jurimetrics**: Visualize legal data through graphs and analytics.
- **Jurisprudence Search**: Search and display judicial decisions.
- **Criminal Data**: Access data on crimes and convictions.
- **User Profile Configuration**: Manage user settings and preferences.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.