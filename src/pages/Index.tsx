
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from '@/components/Auth/LoginForm';
import SignupForm from '@/components/Auth/SignupForm';
import { Keyboard } from 'lucide-react';

const Index = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isLoggedIn } = useAuth();

  // Redirect if already logged in
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container flex flex-col md:flex-row py-12 gap-8 items-center">
        {/* Hero Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="flex items-center">
            <Keyboard className="h-10 w-10 text-typeace-purple mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">TypingKaro</h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            Master Your Typing for the <span className="text-typeace-purple">SCI JCA Exam</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Improve your typing speed and accuracy with practice tests designed specifically for SCI JCA candidates. Track your progress and ace the typing section of your exam.
          </p>

          <div className="pt-4 space-y-4">
            <div className="flex items-start">
              <div className="bg-typeace-lightPurple p-2 rounded-full">
                <Keyboard className="h-5 w-5 text-typeace-purple" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">Real Exam-Like Content</h3>
                <p className="text-gray-600">Practice with passages similar to those found in the actual exam.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-typeace-lightPurple p-2 rounded-full">
                <Keyboard className="h-5 w-5 text-typeace-purple" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">Track Your Progress</h3>
                <p className="text-gray-600">Monitor your typing speed, accuracy, and improvement over time.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-typeace-lightPurple p-2 rounded-full">
                <Keyboard className="h-5 w-5 text-typeace-purple" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">Focused Practice</h3>
                <p className="text-gray-600">Target specific areas of improvement with categorized tests.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-md">
            {showLogin ? (
              <LoginForm onToggleForm={() => setShowLogin(false)} />
            ) : (
              <SignupForm onToggleForm={() => setShowLogin(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6 bg-gray-50">
        <div className="container text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} TypingKaro. Designed for SCI JCA exam candidates.
        </div>
      </footer>
    </div>
  );
};

export default Index;
