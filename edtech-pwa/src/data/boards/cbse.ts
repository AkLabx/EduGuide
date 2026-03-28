import type { BoardData } from './schema';

export const cbseData: BoardData = {
  boardName: "CBSE",
  classes: {
    "10": {
      className: "Class 10",
      subjects: [
        {
          id: "math10",
          name: "Mathematics",
          icon: "calculator",
          color: "bg-blue-500",
          chapters: [
            { id: "m10-c1", title: "Real Numbers", description: "Euclid's division lemma, Fundamental Theorem of Arithmetic", resources: { pdf: "#" } },
            { id: "m10-c2", title: "Polynomials", description: "Zeros of a polynomial, Relationship between zeros and coefficients", resources: { pdf: "#", video: "#" } },
          ]
        },
        {
          id: "sci10",
          name: "Science",
          icon: "flask-conical",
          color: "bg-emerald-500",
          chapters: [
            { id: "s10-c1", title: "Chemical Reactions and Equations", description: "Chemical equations, Balanced chemical equations", resources: { pdf: "#" } },
            { id: "s10-c2", title: "Acids, Bases and Salts", description: "Their definitions in terms of furnishing of H+ and OH- ions", resources: { pdf: "#" } },
          ]
        }
      ]
    }
  }
};
