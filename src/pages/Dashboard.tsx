
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTests } from '@/hooks/useTests';
import TestCard from '@/components/TypingTest/TestCard';
import Navbar from '@/components/Layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Keyboard, Clock, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { isLoggedIn, user } = useAuth();
  const { tests, loading, getBestAttemptForTest, attempts } = useTests();

  useEffect(() => {
    // Update page title
    document.title = 'Dashboard | JCA Type-Ace';
  }, []);

  // Redirect if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name || 'Candidate'}</h1>
          <p className="text-muted-foreground">
            Practice your typing skills for the SCI JCA exam
          </p>
        </header>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tests" className="flex items-center">
              <Keyboard className="h-4 w-4 mr-2" />
              <span>Available Tests</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Test History</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              <span>My Statistics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-6">
            <h2 className="text-xl font-semibold">Available Tests</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                  <TestCard 
                    key={test.id} 
                    test={test} 
                    bestAttempt={getBestAttemptForTest(test.id)} 
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <h2 className="text-xl font-semibold mb-4">Test History</h2>
            
            {attempts.length === 0 ? (
              <div className="text-center py-16 border rounded-lg bg-gray-50">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No test history yet</h3>
                <p className="text-muted-foreground mt-1">Complete your first typing test to see your results here.</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WPM</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Errors</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {attempts.map((attempt) => {
                      const test = tests.find(t => t.id === attempt.testId);
                      return (
                        <tr key={attempt.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{test?.title || 'Unknown Test'}</div>
                            <div className="text-sm text-gray-500">{test?.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(attempt.completedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-sm font-medium bg-typeace-lightPurple text-typeace-purple rounded-md">
                              {attempt.wpm} WPM
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attempt.accuracy.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attempt.mistypedWords}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stats">
            <h2 className="text-xl font-semibold mb-4">My Statistics</h2>
            
            {attempts.length === 0 ? (
              <div className="text-center py-16 border rounded-lg bg-gray-50">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No statistics available</h3>
                <p className="text-muted-foreground mt-1">Complete typing tests to see your performance statistics.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-6 bg-white">
                  <h3 className="text-lg font-medium mb-2">Average WPM</h3>
                  <p className="text-3xl font-bold text-typeace-purple">
                    {Math.round(attempts.reduce((acc, curr) => acc + curr.wpm, 0) / attempts.length)}
                  </p>
                </div>
                
                <div className="border rounded-lg p-6 bg-white">
                  <h3 className="text-lg font-medium mb-2">Average Accuracy</h3>
                  <p className="text-3xl font-bold text-typeace-purple">
                    {(attempts.reduce((acc, curr) => acc + curr.accuracy, 0) / attempts.length).toFixed(1)}%
                  </p>
                </div>
                
                <div className="border rounded-lg p-6 bg-white">
                  <h3 className="text-lg font-medium mb-2">Tests Completed</h3>
                  <p className="text-3xl font-bold text-typeace-purple">
                    {attempts.length}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="border-t py-6 bg-gray-50">
        <div className="container text-center text-gray-500 text-sm">
          © 2023 JCA Type-Ace. Designed for SCI JCA exam candidates.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
