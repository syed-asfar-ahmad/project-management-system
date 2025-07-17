import {
  ClipboardList,
  BarChart3,
  MessageCircle,
  UserCog,
  Bell,
  CheckCircle,
} from "lucide-react";

export default function Features() {
  return (
    <div className="bg-white text-gray-800 py-16 px-6 space-y-24">

      {/* Intro */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Everything You Need to Work Smarter</h1>
        <p className="text-gray-600 text-lg">
          TaskPilot helps you plan, manage, and track every part of your workflow - no matter your team's size.
        </p>
      </div>

      {/* PLAN */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600">
            <ClipboardList className="w-6 h-6" /> Plan Projects with Ease
          </h2>
          <p className="text-gray-600 mb-4">
            Break down projects into manageable tasks. Set priorities, assign roles, and establish deadlines-all in a few clicks.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Create task lists with custom statuses</li>
            <li>Assign owners and due dates</li>
            <li>Organize with tags and categories</li>
          </ul>
        </div>
        <div className="rounded-xl bg-blue-100 h-[250px] flex items-center justify-center text-blue-600 font-bold text-xl">
          {/* Screenshot placeholder */}
          Project Planning UI
        </div>
      </section>

      {/* COLLABORATE */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div className="order-2 md:order-1 rounded-xl bg-green-100 h-[250px] flex items-center justify-center text-green-600 font-bold text-xl">
          Real-time Chat & Mentions
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-600">
            <MessageCircle className="w-6 h-6" /> Collaborate in Real Time
          </h2>
          <p className="text-gray-600 mb-4">
            Keep everyone on the same page with built-in communication tools and real-time updates.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Comment on tasks and projects</li>
            <li>Mention teammates for quick responses</li>
            <li>See who's working on what</li>
          </ul>
        </div>
      </section>

      {/* TRACK */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-600">
            <BarChart3 className="w-6 h-6" /> Track Progress & Stay Informed
          </h2>
          <p className="text-gray-600 mb-4">
            Visualize your project status at a glance, and never miss a beat with timely alerts and updates.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Progress bars, timelines, and charts</li>
            <li>Real-time notifications</li>
            <li>Dashboard with team performance</li>
          </ul>
        </div>
        <div className="rounded-xl bg-purple-100 h-[250px] flex items-center justify-center text-purple-600 font-bold text-xl">
          Progress Tracking Dashboard
        </div>
      </section>
    </div>
  );
}
