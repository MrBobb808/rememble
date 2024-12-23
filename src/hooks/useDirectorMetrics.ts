import { useMemo } from "react";

export const useDirectorMetrics = (memorials: any[], surveys: any[]) => {
  return useMemo(() => {
    const totalMemorials = memorials.length;
    const activeMemorials = memorials.filter(m => !m.is_complete).length;
    const completedMemorials = memorials.filter(m => m.is_complete).length;
    const newMemorialsToday = memorials.filter(m => {
      const today = new Date();
      const createdAt = new Date(m.created_at);
      return (
        createdAt.getDate() === today.getDate() &&
        createdAt.getMonth() === today.getMonth() &&
        createdAt.getFullYear() === today.getFullYear()
      );
    }).length;

    return {
      totalMemorials,
      activeMemorials,
      completedMemorials,
      newMemorialsToday,
      surveysCompleted: surveys.length,
      pendingSurveys: totalMemorials - surveys.length
    };
  }, [memorials, surveys]);
};