# Academic Timetable Optimization Platform

An intelligent academic scheduling system built with React, TypeScript, and Supabase that optimizes timetables using advanced algorithms.

## 🚀 Features

### Administrator Panel
- **Dashboard** with comprehensive statistics and metrics
- **Timetable Generator** with advanced optimization algorithms
- **Data Management** for departments, classrooms, subjects, and faculty
- **Approval workflow** for generated timetables
- **Export and analytics** capabilities

### Student Panel
- **My Timetable** - Weekly class schedule view with filters
- **Today's Schedule** - Current day's classes with quick stats
- **Search Timetables** - Browse timetables from other departments/batches
- **Export functionality** for personal timetables

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd academic-timetable-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in the `supabase/migrations/` folder
   - Set up authentication users in Supabase Auth dashboard

5. **Start the development server**
   ```bash
   npm run dev
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