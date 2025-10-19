import DKCard from "../components/DKCard";
import { Button } from "../components/ui/button";

const HomePage = () => {
  // Dados mockados para demonstração
  const dks = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      location: "São Paulo, SP",
      size: "Senior",
      country: "Brasil",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      location: "Rio de Janeiro, RJ",
      size: "Mid-level",
      country: "Brasil",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      location: "Belo Horizonte, MG",
      size: "Junior",
      country: "Brasil",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      location: "Porto Alegre, RS",
      size: "Senior",
      country: "Brasil",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      location: "Brasília, DF",
      size: "Mid-level",
      country: "Brasil",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      location: "Salvador, BA",
      size: "Junior",
      country: "Brasil",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light text-gray-900">100 DKs</h1>
          <Button className="bg-black hover:bg-gray-800 text-white">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Adicionar DK
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dks.map((dk) => (
            <DKCard
              key={dk.id}
              image={dk.image}
              location={dk.location}
              size={dk.size}
              country={dk.country}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
