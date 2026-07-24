import {
  StarIcon as StarOutlineIcon,
} from "@heroicons/react/24/outline";

import {
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";

import type {
  ReviewRating,
} from "../models/review";

interface Props {
  value: number;

  editable?: boolean;
  disabled?: boolean;

  size?: "sm" | "md" | "lg";

  showValue?: boolean;
  showLabel?: boolean;

  onChange?: (
    rating: ReviewRating,
  ) => void;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const ratingLabels: Record<
  ReviewRating,
  string
> = {
  1: "Muy mala",
  2: "Mala",
  3: "Regular",
  4: "Buena",
  5: "Excelente",
};

function normalizeRating(
  value: number,
): number {
  if (
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.min(
    Math.max(value, 0),
    5,
  );
}

export default function ReviewStars({
  value,
  editable = false,
  disabled = false,
  size = "md",
  showValue = false,
  showLabel = false,
  onChange,
}: Props) {
  const normalizedValue =
    normalizeRating(value);

  const selectedRating =
    Math.round(
      normalizedValue,
    ) as ReviewRating;

  const handleChange = (
    rating: ReviewRating,
  ): void => {
    if (
      !editable ||
      disabled
    ) {
      return;
    }

    onChange?.(rating);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="flex items-center gap-0.5"
        role={
          editable
            ? "radiogroup"
            : "img"
        }
        aria-label={
          editable
            ? "Seleccionar calificación"
            : `Calificación: ${normalizedValue} de 5`
        }
      >
        {(
          [1, 2, 3, 4, 5] as ReviewRating[]
        ).map((rating) => {
          const isSelected =
            rating <=
            normalizedValue;

          if (!editable) {
            return (
              <span
                key={rating}
                aria-hidden="true"
                className="flex items-center justify-center"
              >
                {isSelected ? (
                  <StarSolidIcon
                    className={[
                      sizeClasses[
                        size
                      ],
                      "text-warning",
                    ].join(" ")}
                  />
                ) : (
                  <StarOutlineIcon
                    className={[
                      sizeClasses[
                        size
                      ],
                      "text-border",
                    ].join(" ")}
                  />
                )}
              </span>
            );
          }

          return (
            <button
              key={rating}
              type="button"
              role="radio"
              aria-checked={
                selectedRating ===
                rating
              }
              aria-label={`${rating} ${
                rating === 1
                  ? "estrella"
                  : "estrellas"
              }: ${
                ratingLabels[
                  rating
                ]
              }`}
              title={
                ratingLabels[
                  rating
                ]
              }
              disabled={disabled}
              onClick={() =>
                handleChange(
                  rating,
                )
              }
              className="group rounded-md p-0.5 transition focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSelected ? (
                <StarSolidIcon
                  className={[
                    sizeClasses[size],
                    "text-warning transition group-hover:scale-110",
                  ].join(" ")}
                />
              ) : (
                <StarOutlineIcon
                  className={[
                    sizeClasses[size],
                    "text-text-muted transition group-hover:scale-110 group-hover:text-warning",
                  ].join(" ")}
                />
              )}
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-text">
          {normalizedValue.toFixed(
            normalizedValue %
              1 ===
              0
              ? 0
              : 1,
          )}
          /5
        </span>
      )}

      {showLabel &&
        selectedRating >= 1 && (
          <span className="text-sm text-text-muted">
            {
              ratingLabels[
                selectedRating
              ]
            }
          </span>
        )}
    </div>
  );
}