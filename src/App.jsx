import { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import TestingPages from "./pages/TestingPages";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <TestingPages />,
      errorElement: <NotFound />,
    },
    {
      path: "/testing",
      element: <TestingPages />,
    },
  ]);

  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
