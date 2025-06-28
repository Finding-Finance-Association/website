# 🐳 Docker Setup Guide for Finding Finance Association

## Quick Setup for New Developers

### 1. Install Docker Desktop

**Windows:**
- Download: https://docs.docker.com/desktop/install/windows-install/
- Run the installer and restart your computer if prompted

**Mac:**
- Download: https://docs.docker.com/desktop/install/mac-install/
- Drag Docker to Applications folder

**Linux:**
- Follow: https://docs.docker.com/desktop/install/linux-install/

### 2. Start Docker Desktop

- Launch Docker Desktop from your applications
- Wait for it to fully start (Docker icon appears in system tray/menu bar)
- You'll see "Docker Desktop is running" when ready

### 3. Clone and Run the Project

```bash
# Clone the repository
git clone <your-repo-url>
cd finding-finance-association

# Start the development environment
docker-compose up --build
```

### 4. Open the Application

- Go to: http://localhost:3000
- You should see the Finding Finance Association app running!

## Daily Development Commands

```bash
# Start development (first time or after changes to dependencies)
docker-compose up --build

# Start development (regular use)
docker-compose up

# Stop the application
docker-compose down

# Run in background
docker-compose up -d
```

## Troubleshooting

### ❌ "docker-compose up --build" fails with connection errors
**Fix:** Make sure Docker Desktop is running. Look for the Docker whale icon in your system tray.

### ❌ Port 3000 already in use
**Fix:** Stop other applications using port 3000, or change the port in docker-compose.yml

### ❌ Changes not showing in browser
**Fix:** 
1. Hard refresh (Ctrl+F5 or Cmd+Shift+R)
2. If still not working: `docker-compose down && docker-compose up`

### ❌ "Dockerfile not found" error
**Fix:** Make sure the file is named exactly `Dockerfile` (capital D, lowercase f)

## Why Docker?

- **Consistent Environment:** Everyone runs the same setup regardless of OS
- **Easy Setup:** No need to install Node.js, npm, or manage versions
- **Isolated:** Won't conflict with other projects on your machine
- **Production-like:** Matches our deployment environment

## Need Help?

1. Check this guide first
2. Make sure Docker Desktop is running and updated
3. Try `docker-compose up --build` to rebuild everything
4. Ask in the team chat if still stuck

---

**Remember:** Always make sure Docker Desktop is running before using docker-compose commands!
