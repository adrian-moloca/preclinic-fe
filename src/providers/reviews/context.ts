import { createContext, useContext } from "react";
import { ReviewsContextType } from "./types";

export const ReviewsContext = createContext<ReviewsContextType>({
  reviews: {},
  addReview: () => {},
  updateReview: () => {},
  deleteReview: () => {},
  resetReviews: () => {},
  setReviews: () => {},
});

export const useReviewsContext = () => useContext(ReviewsContext);
