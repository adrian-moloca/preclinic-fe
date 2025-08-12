export interface ReviewsProps {
id: string;
review: string;
rating: string;
date: string;
}

export interface ReviewsContextType {
  reviews: Record<string, ReviewsProps>;
  addReview: (review: ReviewsProps) => void;
  updateReview: (id: string, updatedData: Partial<ReviewsProps>) => void;
  deleteReview: (id: string) => void;
  resetReviews: () => void;
  setReviews: React.Dispatch<React.SetStateAction<Record<string, ReviewsProps>>>;
}