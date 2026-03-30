const fs = require('fs');
let content = fs.readFileSync('src/pages/Splash.tsx', 'utf8');

content = content.replace("import { useAppStore } from '@/store/useAppStore';", "import { useAppStore } from '@/store/useAppStore';\nimport { useAuthStore } from '@/store/useAuthStore';");

content = content.replace("  const { hasSeenOnboarding, selectedBoard, selectedClass } = useAppStore();", "  const { hasSeenOnboarding, selectedBoard, selectedClass } = useAppStore();\n  const { session, isLoading } = useAuthStore();");

const newEffect = `  useEffect(() => {
    if (isLoading) return; // Wait for auth to initialize

    const timer = setTimeout(() => {
      if (!hasSeenOnboarding) {
        navigate('/onboarding');
      } else if (!session) {
        navigate('/auth');
      } else if (!selectedBoard || !selectedClass) {
        navigate('/home');
      } else {
        navigate('/dashboard');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, hasSeenOnboarding, selectedBoard, selectedClass, session, isLoading]);`;

content = content.replace(/  useEffect\(\(\) => \{[\s\S]*?\}, \[navigate, hasSeenOnboarding, selectedBoard, selectedClass\]\);/, newEffect);

fs.writeFileSync('src/pages/Splash.tsx', content);
