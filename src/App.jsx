import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TestingPages from "./pages/TestingPages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/testing",
    element: <TestingPages />,
  },
]);

function App() {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
