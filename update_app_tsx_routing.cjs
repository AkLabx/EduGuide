const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace("import { AdminRoute } from './components/AdminRoute';", "import { AdminRoute } from './components/AdminRoute';\nimport { ProtectedRoute } from './components/ProtectedRoute';");

const mainRoutes = `          {/* Main App Routes with Bottom Navigation */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>`;

content = content.replace("          {/* Main App Routes with Bottom Navigation */}\n          <Route element={<MainLayout />}>", mainRoutes);

fs.writeFileSync('src/App.tsx', content);
