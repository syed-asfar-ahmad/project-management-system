import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import axios from "axios";

function TaskCalendarPage() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/calendar/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Transform tasks to FullCalendar format
        const formattedEvents = res.data.map((task) => ({
          title: task.title,
          date: task.dueDate,
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Failed to fetch tasks for calendar:", err);
      }
    };

    fetchTasks();
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Task Calendar</h2>

      <div className="bg-white p-4 shadow rounded">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height={600}
        />
      </div>
    </div>
  );
}

export default TaskCalendarPage;
