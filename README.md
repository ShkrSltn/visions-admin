# Visions Portfolio Admin Panel

Vue.js + Vuetify admin panel for managing portfolio data through the Visions API.

## 🚀 Features

- **Project Management**: Create, edit, delete, and manage portfolio projects
- **Multi-language Support**: Manage projects in English, Russian, German, Turkish, and Ukrainian
- **Real-time API Integration**: Direct connection to the NestJS backend API
- **Modern UI**: Built with Vuetify 3 and Material Design
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **State Management**: Pinia for reactive state management

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Running Visions API server (see `../visions-server`)

## 🛠 Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run dev
   ```

3. **Access the admin panel:**

   Open http://localhost:5173 in your browser

## ⚙️ Configuration

The admin panel is configured to connect to the API at `http://localhost:3000/api`. Make sure your backend server is running on this address.

To change the API endpoint, update the `API_BASE_URL` in `src/services/api.ts`.

## 🎯 Available Pages

- **Dashboard**: Overview of projects and system status
- **Projects**: Full CRUD management for portfolio projects
- **CV Management**: Coming soon
- **Skills Management**: Coming soon
- **Settings**: Coming soon

## 📦 Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm run test:unit    # Run unit tests
```

## 🔧 Project Structure

```
src/
├── components/          # Reusable Vue components
├── views/              # Page components
├── stores/             # Pinia stores for state management
├── services/           # API service layers
├── types/              # TypeScript type definitions
├── router/             # Vue Router configuration
└── main.ts            # Application entry point
```

## 🎨 Tech Stack

- **Vue 3**: Progressive JavaScript framework
- **Vuetify 3**: Material Design component framework
- **TypeScript**: Type-safe JavaScript
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Vite**: Fast build tool and development server

## 🚦 Current Status

- ✅ **Project Management**: Full CRUD operations
- ✅ **Dashboard**: Statistics and overview
- ✅ **Responsive UI**: Mobile-friendly design
- ✅ **API Integration**: Real-time backend connection
- 🔄 **CV Management**: In development
- 🔄 **Skills Management**: In development
- 🔄 **User Authentication**: Planned
- 🔄 **File Upload**: Planned

## 🔗 API Integration

The admin panel integrates with the following API endpoints:

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PATCH /api/projects/:id/toggle-featured` - Toggle featured status
- `GET /api/projects/by-language/:code` - Get projects by language

## 🚀 Getting Started

1. Make sure the backend API server is running:

   ```bash
   cd ../visions-server
   npm run start:dev
   ```

2. Start the admin panel:

   ```bash
   npm run dev
   ```

3. Navigate to Projects page to begin managing your portfolio data.

## 🔜 Upcoming Features

- User authentication and authorization
- CV and skills management
- File upload for project images
- Bulk operations for projects
- Dark/light theme switcher
- Advanced filtering and search
- Project analytics and insights

## 📝 Development Notes

- The admin panel uses TypeScript for type safety
- All API calls are handled through the centralized API service
- State management is implemented with Pinia stores
- Components follow Vue 3 Composition API patterns
- UI components are from Vuetify 3 with Material Design Icons
