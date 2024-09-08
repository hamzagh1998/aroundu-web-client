export function Greeting() {
  return (
    <div className="w-full h-full space-y-6">
      <img src="party.png" className="m-auto lg:h-[560px]" />
      <h1 className="text-2xl lg:text-4xl font-semibold">Welcome to AroundU</h1>
      <p className="text-lg text-muted-foreground">
        Discover a world of events happening around you! Whether you're
        passionate about music, art, sports, or technology, our platform helps
        you find and connect with events tailored to your interests.
      </p>
    </div>
  );
}
