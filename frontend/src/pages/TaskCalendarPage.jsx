import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { CalendarDays } from "lucide-react";

import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import BackButton from "../components/backButton";

import "../styles/calendar.css";

const API = process.env.REACT_APP_API_BASE_URL;

function TaskCalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

    useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const [taskRes, projectRes] = await Promise.all([
          axios.get(`${API}/tasks/calendar/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

                 const taskEvents = taskRes.data.map((task) => ({
           id: task._id,
           title: task.title,
           start: task.dueDate,
           allDay: true,
           backgroundColor: "#16a34a", // Green
           borderColor: "#16a34a",
           type: "task",
           extendedProps: {
             fullTitle: `Task: ${task.title}`,
           },
         }));

                  const projectEvents = projectRes.data.map((project) => ({
             id: project._id,
             title: project.name,
             start: project.deadline,
             allDay: true,
             backgroundColor: "#7c3aed", // Purple
             borderColor: "#7c3aed",
             type: "project",
             extendedProps: {
               fullTitle: `Project: ${project.name}`,
             },
           }));

                 setEvents([...taskEvents, ...projectEvents]);
       } catch (error) {
         console.error("Failed to load calendar data:", error);
       } finally {
         setLoading(false);
       }
     };

     fetchEvents();
   }, [token]);

  const handleEventClick = (info) => {
    const { id, extendedProps } = info.event;
    if (extendedProps.type === "task") {
      navigate(`/tasks/${id}`);
    } else if (extendedProps.type === "project") {
      navigate(`/projects/${id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />
      <BackButton />

      <main className="flex-grow px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-green-100">
              <CalendarDays size={32} className="text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">Task & Project Calendar</h1>
            </div>
            <p className="mt-4 text-gray-600 text-lg">Stay organized with your project timeline</p>
          </div>

          {loading ? (
            /* Loading State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                {/* Spinning Circle */}
                <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                {/* Calendar Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <CalendarDays size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Calendar</h3>
                <p className="text-gray-600">Fetching your tasks and projects...</p>
              </div>
              {/* Loading Dots */}
              <div className="flex space-x-2 mt-4">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : (
            <>
              {/* Calendar Container */}
              <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-green-100">
                <div className="p-2">
                  <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height={650}
                    eventClick={handleEventClick}
                    eventDidMount={(info) => {
                      info.el.setAttribute("title", info.event.extendedProps.fullTitle);
                      // Add custom classes for different event types
                      if (info.event.extendedProps.type === "task") {
                        info.el.classList.add("fc-event-task");
                      } else if (info.event.extendedProps.type === "project") {
                        info.el.classList.add("fc-event-project");
                      }
                    }}
                    headerToolbar={{
                      left: "prev",
                      center: "title",
                      right: "next",
                    }}
                    dayMaxEvents={3}
                    moreLinkClick="popover"
                    eventDisplay="block"
                    allDaySlot={false}
                    lazyFetching={true}
                    rerenderDelay={10}
                    eventMinHeight={20}
                  />
                </div>
              </div>

              {/* Enhanced Legend */}
              <div className="mt-8 flex justify-center">
                <div className="bg-white px-8 py-6 rounded-2xl shadow-xl border border-green-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Calendar Legend
                  </h3>
                  <div className="flex gap-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-green-500 to-green-600 shadow-md"></div>
                      <div>
                        <span className="text-sm font-semibold text-gray-800">Tasks</span>
                        <p className="text-xs text-gray-500">Individual tasks</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 shadow-md"></div>
                      <div>
                        <span className="text-sm font-semibold text-gray-800">Projects</span>
                        <p className="text-xs text-gray-500">Project deadlines</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TaskCalendarPage;
