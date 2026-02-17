import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            ReactCampus
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/colleges" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Colleges
            </Link>
            <Link to="/courses" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Courses
            </Link>
            <Link to="/exams" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Exams
            </Link>
          </nav>
          <div>
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
