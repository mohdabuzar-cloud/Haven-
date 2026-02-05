import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  Building2, 
  Users, 
  MessageSquare, 
  Settings,
  Plus,
  TrendingUp,
  Calendar,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '@/context/OnboardingContext';
import { NewListingModal } from '@/components/modals/NewListingModal';
import { cn } from '@/lib/utils';

export const Screen10Dashboard = () => {
  const navigate = useNavigate();
  const { canAccessDashboard, getLastIncompleteScreen, state, logoutUser, isInitialized } = useOnboarding();
  const [showNewListingModal, setShowNewListingModal] = useState(false);

  // Check if user can access dashboard - only after data is initialized
  useEffect(() => {
    if (!isInitialized) return; // Wait for data to load

    if (!canAccessDashboard()) {
      const redirectScreen = getLastIncompleteScreen();
      const screenRoutes = {
        2: '/onboarding/eligibility',
        3: '/onboarding/details',
        4: '/onboarding/documents',
        5: '/onboarding/verification',
        8: '/onboarding/activate',
      };
      navigate(screenRoutes[redirectScreen] || '/');
    }
  }, [isInitialized, canAccessDashboard, getLastIncompleteScreen, navigate]);

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Building2, label: 'Listings', badge: '0' },
    { icon: Users, label: 'Leads', badge: '0' },
    { icon: MessageSquare, label: 'Messages', badge: '0' },
    { icon: Calendar, label: 'Schedule' },
    { icon: Settings, label: 'Settings' },
  ];

  const quickActions = [
    { icon: Plus, label: 'New Listing', primary: true },
    { icon: Users, label: 'Add Lead' },
    { icon: Calendar, label: 'Schedule Tour' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-primary" />
            </div>
            <span className="font-serif text-xl font-semibold text-heading tracking-tight">
              Haven
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-body hover:bg-secondary hover:text-heading"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-helper">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {state.basicDetails.fullName?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-heading truncate">
                  {state.basicDetails.fullName || 'Agent'}
                </p>
                <p className="text-xs text-helper truncate">
                  {state.basicDetails.email || 'agent@haven.ae'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logoutUser}
              className="text-muted-foreground hover:text-foreground"
            >
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-helper" />
            <Input
              placeholder="Search properties, leads..."
              className="pl-10 h-10 bg-secondary/50 border-0"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-body" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-8 animate-slide-up">
            <h1 className="text-2xl font-serif font-semibold text-heading mb-2">
              Welcome back, {state.basicDetails.fullName?.split(' ')[0] || 'Agent'}!
            </h1>
            <p className="text-body">
              Your account is <span className="text-primary font-medium">Active</span>. Here's what's happening today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Active Listings', value: '0', icon: Building2, change: null },
              { label: 'Total Leads', value: '0', icon: Users, change: null },
              { label: 'This Month', value: 'AED 0', icon: TrendingUp, change: null },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="p-5 bg-card rounded-xl shadow-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-helper">{stat.label}</p>
                    <p className="text-2xl font-serif font-semibold text-heading">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State / Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Getting Started */}
            <div className="p-6 bg-card rounded-xl shadow-card animate-slide-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-lg font-serif font-semibold text-heading mb-4">
                Get Started
              </h2>
              <p className="text-sm text-body mb-6">
                Complete these steps to start using Haven effectively.
              </p>
              
              <div className="space-y-3">
                {[
                  { label: 'Complete profile setup', done: true },
                  { label: 'Add your first listing', done: false },
                  { label: 'Connect with leads', done: false },
                  { label: 'Set up notifications', done: false },
                ].map((task) => (
                  <div
                    key={task.label}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                      task.done
                        ? "bg-accent/50 border-primary/20"
                        : "bg-secondary/30 border-border hover:border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                      task.done
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border"
                    )}>
                      {task.done && (
                        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={cn(
                      "text-sm flex-1",
                      task.done ? "text-helper line-through" : "text-body"
                    )}>
                      {task.label}
                    </span>
                    {!task.done && (
                      <ChevronRight className="w-4 h-4 text-helper" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-card rounded-xl shadow-card animate-slide-up" style={{ animationDelay: '400ms' }}>
              <h2 className="text-lg font-serif font-semibold text-heading mb-4">
                Quick Actions
              </h2>
              <p className="text-sm text-body mb-6">
                Common tasks to help you get things done faster.
              </p>
              
              <div className="grid gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant={action.primary ? "haven" : "haven-outline"}
                    size="lg"
                    className="w-full justify-start"
                    onClick={() => action.primary && setShowNewListingModal(true)}
                  >
                    <action.icon className="w-5 h-5 mr-3" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Prototype Notice */}
          <div className="mt-8 p-4 bg-secondary/50 rounded-xl border border-border/50 text-center animate-fade-in">
            <p className="text-sm text-helper">
              <span className="font-medium">End of onboarding flow</span> — This is a UI prototype. Dashboard features are simulated.
            </p>
          </div>
        </div>
      </main>

      {/* New Listing Modal */}
      <NewListingModal
        isOpen={showNewListingModal}
        onClose={() => setShowNewListingModal(false)}
        onSelect={(type) => {
          console.log('Selected listing type:', type);
          // TODO: Handle listing creation based on type
        }}
      />
    </div>
  );
};

export default Screen10Dashboard;
