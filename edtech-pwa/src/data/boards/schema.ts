export interface Chapter {
  id: string;
  title: string;
  description: string;
  resources: {
    pdf?: string;
    video?: string;
    worksheet?: string;
  };
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: Chapter[];
}

export interface ClassData {
  className: string;
  subjects: Subject[];
}

export interface BoardData {
  boardName: string;
  classes: Record<string, ClassData>;
}
