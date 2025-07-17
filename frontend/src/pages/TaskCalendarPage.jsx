import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/AuthNavbar";
import Footer from "../components/Footer";
import BackButton from "../components/backButton";
import { CalendarDays } from "lucide-react";
import "../styles/calendar.css"; // <-- Custom styles for arrows, optional

function TaskCalendarPage() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [taskRes, projectRes] = await Promise.all([
          axios.get("http://localhost:5000/api/tasks/calendar/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/projects", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const taskEvents = taskRes.data.map((task) => ({
          id: task._id,
          title: `${task.title}`,
          date: task.dueDate,
          backgroundColor: "#6366f1", // Indigo
          borderColor: "#6366f1",
          type: "task",
          extendedProps: {
            fullTitle: `Task: ${task.title}`,
          },
        }));

        const projectEvents = projectRes.data.map((project) => ({
          id: project._id,
          title: `${project.name}`,
          date: project.deadline,
          backgroundColor: "#10b981", // Emerald
          borderColor: "#10b981",
          type: "project",
          extendedProps: {
            fullTitle: `Project: ${project.name}`,
          },
        }));

        setEvents([...taskEvents, ...projectEvents]);
      } catch (err) {
        console.error("Failed to load calendar data:", err);
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <BackButton/>
      <main className="flex-grow px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6">
          <div className="mb-6 flex items-center gap-2 text-indigo-700">
            <CalendarDays size={28} />
            <h2 className="text-2xl font-bold">Task & Project Calendar</h2>
          </div>

          <div className="border rounded-md overflow-hidden">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              height={600}
              eventClick={handleEventClick}
              eventDidMount={(info) => {
                info.el.setAttribute("title", info.event.extendedProps.fullTitle);
              }}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "",
              }}
              buttonText={{
                today: "This Month",
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default TaskCalendarPage;
