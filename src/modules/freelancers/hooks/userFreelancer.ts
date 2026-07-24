import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  Freelancer,
  RateType,
  WorkMode,
} from "../models/freelancer";

import { getFreelancers } from "../services/freelancerService";

export type WorkModeFilter = "Todos" | WorkMode;
export type RateTypeFilter = "Todos" | RateType;
export type AvailabilityFilter =
  | "Todos"
  | "available"
  | "unavailable";

export function useFreelancers() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  const [workMode, setWorkMode] =
    useState<WorkModeFilter>("Todos");

  const [rateType, setRateType] =
    useState<RateTypeFilter>("Todos");

  const [availability, setAvailability] =
    useState<AvailabilityFilter>("Todos");

  const [minimumRating, setMinimumRating] = useState(0);
  const [maximumRate, setMaximumRate] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFreelancers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFreelancers();
      setFreelancers(data);
    } catch (error) {
      console.error("Error al cargar freelancers:", error);
      setError("No se pudieron cargar los freelancers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFreelancers();
  }, [loadFreelancers]);

  const categories = useMemo(() => {
    const specialties = freelancers
      .map((freelancer) => freelancer.profession.trim())
      .filter(Boolean);

    return [
      "Todos",
      ...Array.from(new Set(specialties)).sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    ];
  }, [freelancers]);

  const maximumAvailableRate = useMemo(() => {
    const rates = freelancers
      .map((freelancer) => freelancer.rateValue)
      .filter((rate): rate is number => rate !== null);

    if (rates.length === 0) {
      return 0;
    }

    return Math.ceil(Math.max(...rates));
  }, [freelancers]);

  const filteredFreelancers = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    const normalizedFilter = filter.toLowerCase().trim();

    return freelancers.filter((freelancer) => {
      const searchableContent = [
        freelancer.name,
        freelancer.profession,
        freelancer.location,
        freelancer.description,
        freelancer.serviceArea,
        freelancer.experience,
        ...(freelancer.languages ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchSearch =
        normalizedSearch === "" ||
        searchableContent.includes(normalizedSearch);

      const matchCategory =
        filter === "Todos" ||
        freelancer.profession.toLowerCase() === normalizedFilter;

      const matchWorkMode =
        workMode === "Todos" ||
        freelancer.workMode === workMode;

      const matchRateType =
        rateType === "Todos" ||
        freelancer.rateType === rateType;

      const matchAvailability =
        availability === "Todos" ||
        (availability === "available" &&
          freelancer.available) ||
        (availability === "unavailable" &&
          !freelancer.available);

      const matchRating =
        freelancer.rating >= minimumRating;

      const matchMaximumRate =
        maximumRate === null ||
        (freelancer.rateValue !== null &&
          freelancer.rateValue <= maximumRate);

      return (
        matchSearch &&
        matchCategory &&
        matchWorkMode &&
        matchRateType &&
        matchAvailability &&
        matchRating &&
        matchMaximumRate
      );
    });
  }, [
    freelancers,
    search,
    filter,
    workMode,
    rateType,
    availability,
    minimumRating,
    maximumRate,
  ]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setFilter("Todos");
    setWorkMode("Todos");
    setRateType("Todos");
    setAvailability("Todos");
    setMinimumRating(0);
    setMaximumRate(null);
  }, []);

  const hasActiveFilters =
    search.trim() !== "" ||
    filter !== "Todos" ||
    workMode !== "Todos" ||
    rateType !== "Todos" ||
    availability !== "Todos" ||
    minimumRating > 0 ||
    maximumRate !== null;

  return {
    freelancers,
    filteredFreelancers,

    search,
    setSearch,

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

    loading,
    error,
    reloadFreelancers: loadFreelancers,
  };
}