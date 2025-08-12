import React, {
  FC,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ReviewsProps } from "./types";
import { ReviewsContext } from "./context";

const LOCAL_STORAGE_KEY = "reviews";

export const ReviewsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Record<string, ReviewsProps>>({});

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse reviews from localStorage");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  const addReview = useCallback((review: ReviewsProps) => {
    setReviews((prev) => ({
      ...prev,
      [review.id]: review,
    }));
  }, []);

  const updateReview = useCallback((id: string, updatedData: Partial<ReviewsProps>) => {
    setReviews((prev) => {
      const existing = prev[id];
      if (!existing) {
        console.warn("❌ Review not found:", id);
        return prev;
      }

      return {
        ...prev,
        [id]: {
          ...existing,
          ...updatedData,
        },
      };
    });
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const resetReviews = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setReviews({});
  }, []);

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        addReview,
        updateReview,
        deleteReview,
        resetReviews,
        setReviews,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};