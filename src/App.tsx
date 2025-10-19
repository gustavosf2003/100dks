import { BrowserRouter, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<div>Hello World</div>} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
