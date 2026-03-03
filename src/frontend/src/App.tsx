import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AdminPage from "./pages/AdminPage";
import IncorporatePage from "./pages/IncorporatePage";
import LandingPage from "./pages/LandingPage";

// Root route
const rootRoute = createRootRoute();

// Child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const incorporateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/incorporate",
  component: () => <IncorporatePage step={1} />,
});

const shareholdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/incorporate/shareholders",
  component: () => <IncorporatePage step={2} />,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

// Router
const routeTree = rootRoute.addChildren([
  indexRoute,
  incorporateRoute,
  shareholdersRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
