declare module '@/components/*' {
  import { FC } from 'react';
  export const Navigation: FC;
  export const Footer: FC;
  export const LoadingSpinner: FC;
  export const GameCard: FC<{ game: any; featured?: boolean }>;
  export const CourseCard: FC<{ course: any; featured?: boolean }>;
  export const TrainingCard: FC<{ training: any; featured?: boolean }>;
} 