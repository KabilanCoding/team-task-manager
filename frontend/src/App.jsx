import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { Tasks } from "./pages/Tasks";
import { Team } from "./pages/Team";
import { dataApi } from "./services/api";
import { buildSummary } from "./services/summary";

function Shell() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [remoteSummary, setRemoteSummary] = useState(null);
  const [notice, setNotice] = useState("");

  const loadRemoteData = useCallback(async () => {
    if (!isAuthenticated) return;

    const [dashboardData, projectsData, tasksData, usersData] = await Promise.all([
      dataApi.dashboard(),
      dataApi.projects(),
      dataApi.tasks(),
      user?.role === "admin" ? dataApi.users() : Promise.resolve({ users: user ? [user] : [] })
    ]);

    setRemoteSummary(dashboardData.summary);
    setProjects(projectsData.projects);
    setTasks(tasksData.tasks);
    setUsers(usersData.users);
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadRemoteData().catch((error) => {
      setNotice(error.message);
    });
  }, [loadRemoteData]);

  useEffect(() => {
    if (user?.role !== "admin" && activeTab === "team") {
      setActiveTab("dashboard");
    }
  }, [activeTab, user]);
  const visibleTasks = user?.role === "admin"
    ? tasks
    : tasks.filter((task) => task.assigned_to === user?.id);
  const summary = useMemo(() => remoteSummary || buildSummary(visibleTasks), [remoteSummary, visibleTasks]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const createProject = (payload) => {
    dataApi.createProject(payload)
      .then(loadRemoteData)
      .catch((error) => setNotice(error.message));
  };

  const createTask = (payload) => {
    dataApi.createTask(payload)
      .then(loadRemoteData)
      .catch((error) => setNotice(error.message));
  };

  const updateTaskStatus = (id, status) => {
    dataApi.updateTaskStatus(id, status)
      .then(loadRemoteData)
      .catch((error) => setNotice(error.message));
  };

  const views = {
    dashboard: <Dashboard summary={summary} tasks={visibleTasks} user={user} />,
    projects: <Projects projects={projects} users={users} user={user} onCreateProject={createProject} />,
    tasks: <Tasks tasks={visibleTasks} projects={projects} users={users} user={user} onCreateTask={createTask} onUpdateStatus={updateTaskStatus} />,
    team: <Team users={users} />
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogout={() => {
          setActiveTab("dashboard");
          logout();
        }}
      />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {notice && (
          <div className="mb-4 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-danger">
            {notice}
          </div>
        )}
        {views[activeTab] || views.dashboard}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
