import { Link } from 'react-router-dom';
import {
  ClipboardList,
  BarChart3,
  MessageCircle,
  UserCog,
  Bell,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Zap,
  Shield,
  Globe,
  Play,
  Quote,
  ChevronRight,
  Calendar,
  Target,
  TrendingUp,
  Rocket,
  Award,
  Heart,
  Sparkles,
  LayoutDashboard
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section - Clean Green Theme */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Background Image with Green Overlay */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/80 to-green-700/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-8 border border-white/30">
            <Sparkles size={18} className="mr-2" />
            The Future of Project Management
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white leading-tight">
            Transform Your
            <span className="block text-green-200">Workflow Today</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-green-100 max-w-4xl mx-auto mb-10 leading-relaxed">
            TaskPilot revolutionizes how teams collaborate, plan, and deliver projects. 
            Experience the power of intelligent project management with our cutting-edge platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="https://project-management-system-1emk.vercel.app/signup"
              className="group inline-flex items-center px-10 py-5 bg-white text-green-600 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Start Your Journey
              <Rocket size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="https://project-management-system-1emk.vercel.app/login"
              className="inline-flex items-center px-10 py-5 border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - Light Green Theme */}
      <section className="py-20 bg-green-50 relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Teams Worldwide</h2>
            <p className="text-gray-600 text-lg">Join thousands of teams already transforming their workflow</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">1K+</div>
              <div className="text-gray-600 font-medium">Active Teams</div>
            </div>
            <div className="text-center bg-white rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-3">5K+</div>
              <div className="text-gray-600 font-medium">Projects Completed</div>
            </div>
            <div className="text-center bg-white rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-3">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
            <div className="text-center bg-white rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-3">4.9★</div>
              <div className="text-gray-600 font-medium">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Actual Project Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium mb-8">
              <Zap size={18} className="mr-2" />
              Core Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the essential tools that make TaskPilot the perfect solution for modern teams.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Project Management */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Project Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Create and manage projects with team members, deadlines, and status tracking.
              </p>
            </div>

            {/* Task Management */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ClipboardList className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Task Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Create, assign, and track tasks with priorities, due dates, and status updates.
              </p>
            </div>

            {/* Team Collaboration */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Work together with comments, file sharing, and real-time updates.
              </p>
            </div>

            {/* Role Management */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserCog className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Role Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Admin, Manager, and Team Member roles with appropriate permissions.
              </p>
            </div>

            {/* Dashboard Analytics */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Dashboard Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize project progress and team performance with comprehensive dashboards.
              </p>
            </div>

            {/* Calendar View */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-cyan-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Calendar View</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize your tasks and projects in an intuitive calendar interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Green Theme */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-600 to-green-700 text-white relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-8 border border-white/30">
              <Target size={18} className="mr-2" />
              Getting Started
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Your Journey to Success</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              From setup to success - TaskPilot makes project management effortless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="w-24 h-24 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Create Your Account</h3>
              <p className="text-green-100">
                Sign up and set up your profile with your role and preferences.
              </p>
            </div>
            
            <div className="text-center relative">
              <div className="w-24 h-24 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Start Your Projects</h3>
              <p className="text-green-100">
                Create projects, add team members, and assign tasks to get started.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-white text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-2xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Track & Collaborate</h3>
              <p className="text-green-100">
                Monitor progress, communicate with your team, and deliver on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Light Green Theme */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium mb-8">
              <Quote size={18} className="mr-2" />
              Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">What Our Users Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-green-100 relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                </div>
                <p className="text-gray-600 mb-8 italic text-lg">
                  "TaskPilot has completely transformed our workflow. The project management features are excellent!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                    AH
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Asfar</div>
                    <div className="text-sm text-gray-500">Project Manager</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-green-100 relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                </div>
                <p className="text-gray-600 mb-8 italic text-lg">
                  "Finally, a tool that understands how teams actually work. Simple and effective!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                    HT
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Hussnain</div>
                    <div className="text-sm text-gray-500">Team Lead</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-green-100 relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                  </div>
                </div>
                <p className="text-gray-600 mb-8 italic text-lg">
                  "The task management and collaboration features have increased our productivity significantly!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-purple-600 rounded-full flex items-center justify-center mr-4 text-white font-bold">
                    TQ
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Taqi</div>
                    <div className="text-sm text-gray-500">Developer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean Green Theme */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-600 to-green-700 text-white relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Join thousands of teams already experiencing the future of project management. 
            Start your journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="https://project-management-system-1emk.vercel.app/signup"
              className="group inline-flex items-center px-10 py-5 bg-white text-green-600 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Start Your Journey
              <Rocket size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center px-10 py-5 border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Explore Features
              <ChevronRight size={22} className="ml-3" />
            </Link>
          </div>
          
          <div className="mt-10 text-green-100 text-sm">
            Completely free • No credit card required • Start using immediately
          </div>
        </div>
      </section>
    </div>
  );
}
