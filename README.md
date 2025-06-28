# Finding Finance Association

A Next.js application for the Finding Finance Association platform.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Docker Desktop** (recommended for consistent development environment)
- **Node.js 18+** (if running without Docker)
- **npm** or **yarn** (if running without Docker)

## 🐳 Docker Development Setup (Recommended)

We use Docker to ensure all developers have the same development environment, regardless of their operating system.

### Step 1: Install Docker Desktop

1. **Download Docker Desktop:**
   - Windows: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - Mac: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
   - Linux: [Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/)

2. **Install and Start Docker Desktop:**
   - Run the installer and follow the setup wizard
   - Launch Docker Desktop after installation
   - Wait for Docker Desktop to fully start (you'll see the Docker icon in your system tray/menu bar)
   - Verify installation by opening a terminal and running: `docker --version`

### Step 2: Clone and Run the Project

```bash
# Clone the repository
git clone <repository-url>
cd <repository-folder>

# Start the development environment
docker-compose up --build
```

### Step 3: Access the Application

- Open your browser and navigate to: `http://localhost:3000`
- The application will automatically reload when you make changes to the code

### Common Docker Commands

```bash
# Start the development server
docker-compose up

# Start with rebuilding the image (use when dependencies change)
docker-compose up --build

# Run in background (detached mode)
docker-compose up -d

# Stop the containers
docker-compose down

# View running containers
docker ps

# View logs
docker-compose logs

# Access the container shell
docker-compose exec web bash
```

## 💻 Local Development Setup (Alternative)

If you prefer to run the project locally without Docker:

### Step 1: Install Dependencies

```bash
# Install project dependencies
npm install
```

### Step 2: Run Development Server

```bash
# Start the development server
npm run dev
```

### Step 3: Access the Application

- Open your browser and navigate to: `http://localhost:3000`

## 📁 Project Structure

```
finding-finance-association/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # Reusable React components
│   ├── context/            # React context providers
│   ├── lib/                # Utility functions and configurations
│   ├── services/           # API services and external integrations
│   └── styles/             # Global styles and CSS modules
├── public/                 # Static assets
├── docker-compose.yml      # Docker composition configuration
├── Dockerfile             # Docker image configuration
├── package.json           # Project dependencies and scripts
└── README.md              # This file
```

## 🛠️ Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 🔧 Troubleshooting

### Docker Issues

**Problem: `docker-compose up --build` fails with connection errors**
- **Solution:** Make sure Docker Desktop is running. Look for the Docker icon in your system tray/menu bar.

**Problem: Port 3000 is already in use**
- **Solution:** Stop any other applications using port 3000, or modify the port in `docker-compose.yml`

**Problem: Changes not reflecting in the browser**
- **Solution:** The project uses hot reload. If changes aren't appearing, try:
  1. Hard refresh the browser (Ctrl+F5 or Cmd+Shift+R)
  2. Restart the Docker containers: `docker-compose down && docker-compose up`

### Local Development Issues

**Problem: `npm install` fails**
- **Solution:**
  1. Delete `node_modules` folder and `package-lock.json`
  2. Run `npm install` again
  3. Ensure you're using Node.js 18 or higher

**Problem: Module not found errors**
- **Solution:** Run `npm install` to ensure all dependencies are installed

## 🤝 Development Workflow

1. **Start your development environment:**
   ```bash
   docker-compose up --build
   ```

2. **Make your changes** in the `src/` directory

3. **Test your changes** by viewing them at `http://localhost:3000`

4. **Commit your changes** following the project's git workflow

5. **Stop the development environment** when done:
   ```bash
   docker-compose down
   ```

## 📝 Important Notes

- **Always use Docker for development** to ensure consistency across the team
- **The application uses hot reload** - your changes will appear automatically
- **Port 3000** is used for the development server
- **Node modules are cached** in a Docker volume for faster rebuilds

## 🆘 Getting Help

If you encounter any issues:

1. Check this README for common solutions
2. Ensure Docker Desktop is running and up to date
3. Try rebuilding the Docker containers: `docker-compose up --build`
4. Ask the team in our development chat/channel

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)