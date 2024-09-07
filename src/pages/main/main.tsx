import { Card, CardContent } from "@/components/ui/card";
import { FaPlus } from "react-icons/fa";

import { MainLayout } from "./__layout";

import { Button } from "@/components/ui/button";
import { CustomTooltip } from "@/components/custom-tooltip";

export function MainPage() {
  return (
    <MainLayout>
      <main className="flex-1 px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group">
              <img
                src="/placeholder.svg"
                alt="Cover image"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full aspect-[3/2] group-hover:opacity-50 transition-opacity"
              />
              <CardContent className="py-4">
                <h3 className="font-semibold tracking-tight">
                  Explore the Outdoors
                </h3>
                <p className="text-sm leading-none text-muted-foreground">
                  Discover new hiking trails and outdoor adventures.
                </p>
              </CardContent>
            </Card>
            <Card className="group">
              <img
                src="/placeholder.svg"
                alt="Cover image"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full aspect-[3/2] group-hover:opacity-50 transition-opacity"
              />
              <CardContent className="py-4">
                <h3 className="font-semibold tracking-tight">
                  Discover New Recipes
                </h3>
                <p className="text-sm leading-none text-muted-foreground">
                  Find delicious and easy-to-make recipes.
                </p>
              </CardContent>
            </Card>
            <Card className="group">
              <img
                src="/placeholder.svg"
                alt="Cover image"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full aspect-[3/2] group-hover:opacity-50 transition-opacity"
              />
              <CardContent className="py-4">
                <h3 className="font-semibold tracking-tight">
                  Learn a New Skill
                </h3>
                <p className="text-sm leading-none text-muted-foreground">
                  Explore online courses and tutorials.
                </p>
              </CardContent>
            </Card>
            <Card className="group">
              <img
                src="/placeholder.svg"
                alt="Cover image"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full aspect-[3/2] group-hover:opacity-50 transition-opacity"
              />
              <CardContent className="py-4">
                <h3 className="font-semibold tracking-tight">
                  Plan Your Next Trip
                </h3>
                <p className="text-sm leading-none text-muted-foreground">
                  Find inspiration for your next adventure.
                </p>
              </CardContent>
            </Card>
            <Card className="group">
              <img
                src="/placeholder.svg"
                alt="Cover image"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full aspect-[3/2] group-hover:opacity-50 transition-opacity"
              />
              <CardContent className="py-4">
                <h3 className="font-semibold tracking-tight">
                  Improve Your Fitness
                </h3>
                <p className="text-sm leading-none text-muted-foreground">
                  Find workout routines and health tips.
                </p>
              </CardContent>
            </Card>
            <Card className="group">
              <img
                src="/placeholder.svg"
                alt="Cover image"
                width={300}
                height={200}
                className="rounded-lg object-cover w-full aspect-[3/2] group-hover:opacity-50 transition-opacity"
              />
              <CardContent className="py-4">
                <h3 className="font-semibold tracking-tight">
                  Discover New Music
                </h3>
                <p className="text-sm leading-none text-muted-foreground">
                  Explore the latest albums and playlists.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        <CustomTooltip text="Create new event">
          <div className="fixed bottom-16 right-6">
            <Button size="lg" className="h-16 w-16 rounded-full">
              <div>
                <FaPlus size={24} color="#fff" />
              </div>
            </Button>
          </div>
        </CustomTooltip>
      </main>
    </MainLayout>
  );
}
