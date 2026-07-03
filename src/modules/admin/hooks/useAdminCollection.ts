import { useEffect, useState } from "react";

type Loader<T> = () => Promise<T[]>;

export function useAdminCollection<T>(loader: Loader<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    loader()
      .then((result) => {
        if (active) {
          setItems(result);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [loader]);

  return {
    items,
    isLoading,
  };
}