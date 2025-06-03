
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RecentJobs } from '@/components/RecentJobs';
import { Video, User, LogOut, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { userData, loading } = useUserData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Video className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold">VideoGen</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {userData?.email || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{userData?.name ? `, ${userData.name}` : ''}!
          </h1>
          <p className="text-gray-600 mt-2">
            Generate stunning real estate videos from property listings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos Used</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData?.videos_used || 0}</div>
              <p className="text-xs text-muted-foreground">
                of {userData?.videos_limit || 3} videos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(userData?.videos_limit || 3) - (userData?.videos_used || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                videos left this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Free</div>
              <p className="text-xs text-muted-foreground">
                3 videos per month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Video</CardTitle>
              <CardDescription>
                Generate a professional real estate video from a property listing URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full sm:w-auto" asChild>
                <Link to="/new-job">
                  <Plus className="h-4 w-4 mr-2" />
                  Start New Project
                </Link>
              </Button>
            </CardContent>
          </Card>

          <RecentJobs />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
