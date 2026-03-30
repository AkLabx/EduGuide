const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');

const importAuthStore = `import { useAuthStore } from './store/useAuthStore';
import { supabase } from './lib/supabase';
import Auth from './pages/Auth';`;

const useAuthHook = `  const { theme } = useAppStore();
  const { setSession, setLoading } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);`;

const authRoute = `          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />`;

let updatedContent = content.replace("import { useAppStore } from './store/useAppStore';", "import { useAppStore } from './store/useAppStore';\n" + importAuthStore);
updatedContent = updatedContent.replace("  const { theme } = useAppStore();", useAuthHook);
updatedContent = updatedContent.replace("          <Route path=\"/onboarding\" element={<Onboarding />} />\n          <Route path=\"/home\" element={<Home />} />", authRoute);

fs.writeFileSync('src/App.tsx', updatedContent);
