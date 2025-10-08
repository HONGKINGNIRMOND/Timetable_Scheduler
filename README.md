# Academic Timetable Optimization Platform

An intelligent academic scheduling system built with React, TypeScript, and Supabase that optimizes timetables using advanced algorithms.

## 🚀 Features

### Administrator Panel
- **Dashboard** with comprehensive statistics and metrics
- **Timetable Generator** with advanced optimization algorithms
  - Custom time slot configuration
  - Configurable lunch hours (default: 11:30 AM - 12:20 PM)
  - Date range selection for academic terms
  - Multiple optimization strategies
- **Data Management** for departments, classrooms, subjects, and faculty
- **Approval workflow** for generated timetables
- **PDF Export** with preview functionality
- **Export and analytics** capabilities

### Student Panel
- **My Timetable** - Weekly class schedule view with filters
- **Today's Schedule** - Current day's classes with quick stats
- **Search Timetables** - Browse timetables from other departments/batches
- **Export functionality** for personal timetables

### New Features
- ✨ **Custom Time Slots** - Configure hourly class schedules
- 🍽️ **Flexible Lunch Hours** - Set custom lunch break times
- 📅 **Date Management** - Set start and end dates for timetables
- 📄 **PDF Generation** - Professional PDF export with preview
- 🎓 **Student Registration** - Self-service student account creation

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **PDF Generation**: jsPDF, jspdf-autotable
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/academic-timetable-platform.git
   cd academic-timetable-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   This will install all required dependencies including:
   - React & React DOM
   - TypeScript
   - Supabase Client
   - jsPDF & jspdf-autotable (for PDF generation)
   - Tailwind CSS
   - Lucide React (icons)
   - Vite (build tool)

3. **Set up environment variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```

4. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API to get your URL and anon key
   - Run the migration files in the `supabase/migrations/` folder in order:
     1. `20250927050120_yellow_pine.sql`
     2. `20250927050135_navy_moon.sql`
     3. `20250927050637_shrill_scene.sql`
     4. `20250927051324_misty_bonus.sql`
     5. `20250930121128_floating_brook.sql`
     6. `20250930122142_maroon_thunder.sql`
   - You can run these in the Supabase SQL Editor

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

6. **Build for production**
   ```bash
   npm run build
   ```

## 🔐 Demo Credentials

### Administrator Panel
- **Email**: `admin@university.edu`
- **Password**: `admin123`

### Student Panel
- **Email**: `student@university.edu`
- **Password**: `student123`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── AdminDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── Login.tsx
│   └── UserSetupGuide.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── lib/               # Utilities and configurations
│   └── supabase.ts
├── services/          # Business logic
│   └── optimizationAlgorithm.ts
├── types/             # TypeScript type definitions
│   ├── index.ts
│   └── database.ts
└── App.tsx            # Main application component
```

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main tables:

- **users** - User accounts and roles
- **departments** - Academic departments
- **classrooms** - Physical classroom resources
- **subjects** - Course subjects and requirements
- **faculty** - Teaching staff and preferences
- **batches** - Student groups
- **time_slots** - Available time periods
- **generated_timetables** - Optimized schedules
- **timetable_entries** - Individual schedule entries

## 🤖 Optimization Algorithm

The timetable generator uses advanced optimization techniques:

- **Multi-objective optimization** balancing classroom utilization, faculty workload, and preference matching
- **Conflict resolution** for scheduling conflicts
- **Resource allocation** considering equipment and capacity constraints
- **Preference matching** for faculty time slot preferences

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform**
   - Vercel, Netlify, or any static hosting service
   - Make sure to set environment variables in your deployment platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the setup guide in the application
- Review the Supabase documentation for database setup

## 🔄 Version History

- **v1.0.0** - Initial release with core timetable optimization features
- **v1.1.0** - Added student dashboard and search functionality
- **v1.2.0** - Enhanced optimization algorithms and conflict resolution