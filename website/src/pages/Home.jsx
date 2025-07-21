import { Link } from 'react-router-dom';
import {
  ClipboardList,
  BarChart3,
  MessageCircle,
  UserCog,
  Bell,
  CheckCircle,
} from "lucide-react";


export default function Home() {
  return (
    <div className="bg-white text-gray-800">
    <section
        className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 bg-cover bg-center"
        style={{
            backgroundImage:
            "url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1470&q=80')",
        }}
        >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 animate-fade-in-up">
            Simplify Your Project Management
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 animate-fade-in-up delay-200">
            TaskPilot helps teams collaborate, plan, and deliver projects faster - all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up delay-300">
            <a
                href="https://project-management-system-1emk.vercel.app/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow hover:bg-blue-700 transition"
            >
                Get Started
            </a>
            <a
                href="https://project-management-system-1emk.vercel.app/login"
                className="border border-white text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
                Login
            </a>
            </div>
        </div>
    </section>

      {/* Features Section */}
    <section className="py-12 px-6 bg-gradient-to-b from-white to-blue-50">
    <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">
        Key Features
        </h2>
        <p className="text-gray-600 text-lg mb-12 animate-fade-in-up delay-200">
        Everything you need to manage projects efficiently, in one sleek platform.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Feature Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 animate-fade-in-up delay-300 text-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mx-auto mb-4">
            <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-gray-600">
            Easily create, assign, and track tasks with deadlines and priorities.
            </p>
        </div>

        {/* Feature Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 animate-fade-in-up delay-400 text-center">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full mx-auto mb-4">
            <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Project Dashboards</h3>
            <p className="text-gray-600">
            Visualize project progress with timelines, stats, and overviews.
            </p>
        </div>

        {/* Feature Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 animate-fade-in-up delay-500 text-center">
            <div className="w-14 h-14 bg-green-100 text-green-600 flex items-center justify-center rounded-full mx-auto mb-4">
            <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
            Comment, tag teammates, and work together in real time.
            </p>
        </div>

        {/* Feature Card 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 animate-fade-in-up delay-600 text-center">
            <div className="w-14 h-14 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-full mx-auto mb-4">
            <UserCog className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Role Management</h3>
            <p className="text-gray-600">
            Give admins, managers, and members the right permissions.
            </p>
        </div>

        {/* Feature Card 5 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 animate-fade-in-up delay-700 text-center">
            <div className="w-14 h-14 bg-pink-100 text-pink-600 flex items-center justify-center rounded-full mx-auto mb-4">
            <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-Time Alerts</h3>
            <p className="text-gray-600">
            Stay updated with instant notifications and alerts.
            </p>
        </div>

        {/* Feature Card 6 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 animate-fade-in-up delay-800 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 flex items-center justify-center rounded-full mx-auto mb-4">
            <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
            Monitor milestones and task completion across all projects.
            </p>
        </div>
        </div>
    </div>
    </section>


    </div>
  );
}
