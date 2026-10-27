import FluxOrb from "@/components/ui/FluxOrb";

function FluxOrbDemo() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
          Flux Orb Demo
        </h1>
        <FluxOrb className="h-[80vh]" />
      </div>
    </div>
  );
}

export default FluxOrbDemo;
