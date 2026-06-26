import { StarIcon, HeartIcon } from "@heroicons/react/24/solid";

interface Props {
  freelancer: any;
}

export default function FreelancerCard({ freelancer }: Props) {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:shadow-xl transition relative">

      {/* IMAGE */}
      <div className="h-52 w-full overflow-hidden relative">
        <img
          src={freelancer.image}
          alt={freelancer.name}
          className="w-full h-full object-cover"
        />

        {/* HEART */}
        <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow">
          <HeartIcon className="h-5 w-5 text-red-500" />
        </button>
      </div>

      <div className="p-5">

        {/* USER */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text">
            {freelancer.name}
          </h3>

          <div className="flex items-center gap-1 text-sm">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span>{freelancer.rating}</span>
          </div>
        </div>

        <p className="text-text-muted text-sm mt-1">
          {freelancer.profession}
        </p>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            React
          </span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            Node.js
          </span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            MongoDB
          </span>
        </div>

        {/* FOOTER */}
        <div className="mt-5 flex items-center justify-between">

          <div>
            <p className="text-primary font-bold text-lg">
              {freelancer.price}
            </p>

            <p className="text-xs text-text-muted">
              {freelancer.delivery || "7 días"}
            </p>
          </div>

          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
            Ver perfil
          </button>

        </div>

      </div>
    </div>
  );
}