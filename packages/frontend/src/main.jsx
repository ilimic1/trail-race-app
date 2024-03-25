import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import { AuthProvider } from "./hooks/useAuth";
import LoginPage from "./routes/login";
import {
  CreateApplication,
  CreateRace,
  ListApplications,
  ListRaces,
  UpdateRace,
  ViewRace,
} from "./routes/races";
import Dashboard from "./routes/dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    // loader: rootLoader(queryClient),
    children: [
      {
        index: true,
        element: <ListRaces />,
        // loader: racesLoader(queryClient),
      },
      {
        path: "races/create",
        element: <CreateRace />,
        // loader: updateRaceLoader(queryClient),
      },
      {
        path: "races/:id",
        element: <ViewRace />,
        // loader: raceLoader(queryClient),
      },
      {
        path: "races/:id/update",
        element: <UpdateRace />,
        // loader: updateRaceLoader(queryClient),
      },
      {
        path: "races/:id/apply",
        element: <CreateApplication />,
        // loader: createApplicationLoader(queryClient),
      },
      {
        path: "applications",
        element: <ListApplications />,
        // loader: listApplicationsLoader(queryClient),
      },
    ],
  },
  {
    path: "login",
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
