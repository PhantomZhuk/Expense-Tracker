import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import AuthGuard from './components/AuthGuard/AuthGuard';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route element={<AuthGuard />}>
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path='*' element={<Navigate to="/auth" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
