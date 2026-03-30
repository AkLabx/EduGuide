const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace("import { useAppStore } from '@/store/useAppStore';", "import { useAppStore } from '@/store/useAppStore';\nimport { useAuthStore } from '@/store/useAuthStore';\nimport { supabase } from '@/lib/supabase';\nimport { useEffect } from 'react';");

const newSelect = `  const { session } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If the user already has a board and class saved in Supabase, sync it
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('board, class_name')
          .eq('id', session.user.id)
          .single();

        if (data && data.board && data.class_name && !selectedBoard && !selectedClass) {
           setSelectedBoard(data.board as 'CBSE' | 'STATE');
           setSelectedClass(data.class_name);
           navigate('/dashboard');
        }
      }
    };
    fetchProfile();
  }, [session, selectedBoard, selectedClass, navigate, setSelectedBoard, setSelectedClass]);

  const handleClassSelect = async (cls: string) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to save your selection.');
      navigate('/auth');
      return;
    }

    setLoading(true);
    setSelectedClass(cls);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ board: selectedBoard, class_name: cls, updated_at: new Date().toISOString() })
        .eq('id', session.user.id);

      if (error) throw error;

      toast.success(\`Class \${cls} \${selectedBoard} selected!\`);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to save selection. Please try again.');
      setLoading(false);
    }
  };`;

content = content.replace("  const handleClassSelect = (cls: string) => {\n    setSelectedClass(cls);\n    toast.success(`Class ${cls} ${selectedBoard} selected!`);\n    navigate('/dashboard');\n  };", newSelect);

content = content.replace("<button\n                  key={cls}\n                  onClick={() => handleClassSelect(cls)}", "<button\n                  key={cls}\n                  onClick={() => handleClassSelect(cls)}\n                  disabled={loading}");

fs.writeFileSync('src/pages/Home.tsx', content);
