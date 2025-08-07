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
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Settings,
  Lock,
  Smartphone,
  Clock,
  Award,
  Heart,
  Sparkles,
  Layers,
  Cpu,
  Database,
  Network,
  LayoutDashboard
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Features() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section - Clean Green Theme */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background with Light Green */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-green-50"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium mb-8">
            <Layers size={18} className="mr-2" />
            Feature Showcase
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 leading-tight">
            Discover the Power of
            <span className="block text-green-600">Modern Project Management</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
            TaskPilot helps you plan, manage, and track every part of your workflow - no matter your team's size.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="https://project-management-system-1emk.vercel.app/signup"
              className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get Started Now
              <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-10 py-5 border-2 border-green-300 text-green-600 rounded-2xl font-semibold text-lg hover:border-green-500 hover:text-green-700 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Grid - Clean Green Cards */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">Core Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful tools that make TaskPilot the perfect solution for modern teams.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Management */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Project Management</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Create and manage projects with team members, deadlines, and status tracking.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Project creation and setup
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Team member assignment
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Status tracking
                </li>
              </ul>
            </div>

            {/* Task Management */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-teal-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <ClipboardList className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Task Management</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Create, assign, and track tasks with priorities, due dates, and status updates.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Task creation and assignment
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Priority levels
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Due date tracking
                </li>
              </ul>
            </div>

            {/* Team Collaboration */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Comment on tasks and projects, share files, and work together in real time.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Task and project comments
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  File attachments
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Real-time updates
                </li>
              </ul>
            </div>

            {/* Role Management */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <UserCog className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Role Management</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Admin, Manager, and Team Member roles with appropriate permissions and access.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Admin controls
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Manager permissions
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Team member access
                </li>
              </ul>
            </div>

            {/* Dashboard Analytics */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <LayoutDashboard className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Dashboard Analytics</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Visualize project progress and team performance with comprehensive dashboards.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Project overview
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Performance metrics
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Progress tracking
                </li>
              </ul>
            </div>

            {/* Calendar View */}
            <div className="group relative bg-green-50 border border-green-200 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-cyan-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Calendar View</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Visualize your tasks and projects in an intuitive calendar interface.
              </p>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Task scheduling
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Due date tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                  Project timelines
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Feature Sections - Side by Side */}
      <section className="py-24 px-6 bg-green-50">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* PROJECT MANAGEMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-medium mb-8">
                <Target size={18} className="mr-2" />
                Project Management
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Manage Projects with Ease</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Create and manage projects with team members, set deadlines, and track progress efficiently.
              </p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Create projects with descriptions and deadlines</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Assign team members and project managers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Track project status and progress</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Add comments and collaborate on projects</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Project Dashboard</h3>
                <p className="text-gray-600">Comprehensive project management interface</p>
              </div>
            </div>
          </div>

          {/* TASK MANAGEMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className="order-2 lg:order-1 bg-white rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ClipboardList className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Task Management</h3>
                <p className="text-gray-600">Efficient task creation and tracking system</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-teal-100 text-green-700 rounded-full text-sm font-medium mb-8">
                <ClipboardList size={18} className="mr-2" />
                Task Management
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Organize Tasks Efficiently</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Create, assign, and track tasks with priorities, due dates, and status updates.
              </p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Create tasks with titles, descriptions, and priorities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Assign tasks to team members</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Set due dates and track progress</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Add comments and attachments to tasks</span>
                </li>
              </ul>
            </div>
          </div>

          {/* TEAM COLLABORATION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm font-medium mb-8">
                <Users size={18} className="mr-2" />
                Team Collaboration
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Collaborate Seamlessly</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Work together with comments, file sharing, and real-time updates across projects and tasks.
              </p>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Add comments to projects and tasks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Share files and attachments</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Real-time updates and notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Team member management and roles</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Collaboration Tools</h3>
                <p className="text-gray-600">Built-in communication and file sharing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features - Grid Layout */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">Additional Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover additional tools that make TaskPilot the complete solution for your team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-cyan-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Calendar className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Calendar View</h3>
              <p className="text-gray-600">Visualize tasks and deadlines in calendar format</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <LayoutDashboard className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Dashboard Analytics</h3>
              <p className="text-gray-600">Comprehensive project and team analytics</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-purple-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <UserCog className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Role Management</h3>
              <p className="text-gray-600">Admin, Manager, and Team Member roles</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Secure Access</h3>
              <p className="text-gray-600">Protected user accounts and data</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean Green Theme */}
      <section className="py-24 px-6 bg-gradient-to-br from-green-600 to-green-700 text-white relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to experience these features?</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Start using TaskPilot today and discover how these powerful features can transform your team's productivity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="https://project-management-system-1emk.vercel.app/signup"
              className="group inline-flex items-center px-10 py-5 bg-white text-green-600 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Try It Free
              <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-10 py-5 border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Contact Us
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
