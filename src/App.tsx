import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import CreateClient from "./pages/CreateClient";
import CreateArticle from "./pages/CreateArticle";
import ClientPage from "./pages/ClientPage";
import ArticlePage from "./pages/ArticlePage";
import DatasetPage from "./pages/DatasetPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/client/:clientId",
    element: <ClientPage />,
  },
  {
    path: "/client/:clientId/dataset",
    element: <DatasetPage />,
  },
  {
    path: "/article/:articleId",
    element: <ArticlePage />,
  },
  {
    path: "/create",
    element: <CreateArticle />,
  },
  {
    path: "/create-client",
    element: <CreateClient />,
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;