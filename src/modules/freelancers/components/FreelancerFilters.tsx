import type {
  AvailabilityFilter,
  RateTypeFilter,
  WorkModeFilter,
} from "../hooks/userFreelancer";

interface Props {
  filter: string;
  setFilter: (value: string) => void;
  categories: string[];

  workMode: WorkModeFilter;
  setWorkMode: (value: WorkModeFilter) => void;

  rateType: RateTypeFilter;
  setRateType: (value: RateTypeFilter) => void;

  availability: AvailabilityFilter;
  setAvailability: (value: AvailabilityFilter) => void;

  minimumRating: number;
  setMinimumRating: (value: number) => void;

  maximumRate: number | null;
  setMaximumRate: (value: number | null) => void;
  maximumAvailableRate: number;

  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const workModes: {
  value: WorkModeFilter;
  label: string;
}[] = [
  { value: "Todos", label: "Todas las modalidades" },
  { value: "remote", label: "Remoto" },
  { value: "on_site", label: "Presencial" },
  { value: "hybrid", label: "Híbrido" },
  { value: "home_service", label: "A domicilio" },
];

const rateTypes: {
  value: RateTypeFilter;
  label: string;
}[] = [
  { value: "Todos", label: "Todos los tipos" },
  { value: "hourly", label: "Por hora" },
  { value: "daily", label: "Por día" },
  { value: "project", label: "Por proyecto" },
  { value: "negotiable", label: "Precio negociable" },
];

const availabilityOptions: {
  value: AvailabilityFilter;
  label: string;
}[] = [
  { value: "Todos", label: "Todos" },
  { value: "available", label: "Disponibles" },
  { value: "unavailable", label: "No disponibles" },
];

const ratingOptions = [
  { value: 0, label: "Cualquier calificación" },
  { value: 3, label: "3 estrellas o más" },
  { value: 4, label: "4 estrellas o más" },
  { value: 4.5, label: "4.5 estrellas o más" },
];

export default function FreelancerFilters({
  filter,
  setFilter,
  categories,
  workMode,
  setWorkMode,
  rateType,
  setRateType,
  availability,
  setAvailability,
  minimumRating,
  setMinimumRating,
  maximumRate,
  setMaximumRate,
  maximumAvailableRate,
  hasActiveFilters,
  clearFilters,
}: Props) {
  const rangeMaximum = Math.max(maximumAvailableRate, 1);

  const selectedMaximumRate =
    maximumRate ?? maximumAvailableRate;

  const formattedMaximumRate = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(selectedMaximumRate);

  return (
    <div className="w-full space-y-6">
      {/* Categoría */}
      <div>
        <label
          htmlFor="freelancer-category"
          className="block text-sm font-medium text-text mb-2"
        >
          Categoría
        </label>

        <select
          id="freelancer-category"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2.5 bg-surface text-text text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "Todos"
                ? "Todas las categorías"
                : category}
            </option>
          ))}
        </select>
      </div>

      {/* Modalidad */}
      <div>
        <label
          htmlFor="freelancer-work-mode"
          className="block text-sm font-medium text-text mb-2"
        >
          Modalidad de trabajo
        </label>

        <select
          id="freelancer-work-mode"
          value={workMode}
          onChange={(event) =>
            setWorkMode(event.target.value as WorkModeFilter)
          }
          className="w-full border border-border rounded-lg px-3 py-2.5 bg-surface text-text text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        >
          {workModes.map((mode) => (
            <option key={mode.value} value={mode.value}>
              {mode.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo de tarifa */}
      <div>
        <label
          htmlFor="freelancer-rate-type"
          className="block text-sm font-medium text-text mb-2"
        >
          Tipo de tarifa
        </label>

        <select
          id="freelancer-rate-type"
          value={rateType}
          onChange={(event) =>
            setRateType(event.target.value as RateTypeFilter)
          }
          className="w-full border border-border rounded-lg px-3 py-2.5 bg-surface text-text text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
        >
          {rateTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tarifa máxima */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-sm font-medium text-text">
            Tarifa máxima
          </p>

          <button
            type="button"
            onClick={() => setMaximumRate(null)}
            disabled={maximumRate === null}
            className="text-xs text-primary hover:underline disabled:text-text-muted disabled:no-underline disabled:cursor-not-allowed"
          >
            Sin límite
          </button>
        </div>

        {maximumAvailableRate > 0 ? (
          <>
            <input
              type="range"
              min={0}
              max={rangeMaximum}
              step={50}
              value={selectedMaximumRate}
              onChange={(event) =>
                setMaximumRate(Number(event.target.value))
              }
              className="w-full accent-primary cursor-pointer"
            />

            <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
              <span>$0</span>

              <span className="font-medium text-primary">
                {maximumRate === null
                  ? "Sin límite"
                  : `Hasta ${formattedMaximumRate}`}
              </span>
            </div>
          </>
        ) : (
          <p className="text-sm text-text-muted">
            No hay tarifas numéricas disponibles.
          </p>
        )}
      </div>

      {/* Disponibilidad */}
      <div>
        <p className="text-sm font-medium text-text mb-3">
          Disponibilidad
        </p>

        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-text cursor-pointer"
            >
              <input
                type="radio"
                name="freelancer-availability"
                value={option.value}
                checked={availability === option.value}
                onChange={() =>
                  setAvailability(option.value)
                }
                className="accent-primary"
              />

              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Calificación */}
      <div>
        <p className="text-sm font-medium text-text mb-3">
          Calificación mínima
        </p>

        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-text cursor-pointer"
            >
              <input
                type="radio"
                name="freelancer-rating"
                value={option.value}
                checked={minimumRating === option.value}
                onChange={() =>
                  setMinimumRating(option.value)
                }
                className="accent-primary"
              />

              <span>
                {option.value > 0 && "⭐ "}
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Limpiar filtros */}
      <button
        type="button"
        onClick={clearFilters}
        disabled={!hasActiveFilters}
        className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Limpiar filtros
      </button>
    </div>
  );
}