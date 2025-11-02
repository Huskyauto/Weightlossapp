import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { recipes, getAllTags } from '@/lib/recipes';
import type { Recipe } from '@/lib/types';
import { Clock, Users, Flame, ChefHat } from 'lucide-react';

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tags = getAllTags();
  const filteredRecipes =
    selectedTag === 'all'
      ? recipes
      : recipes.filter((r) => r.tags.includes(selectedTag));

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Healthy Recipes</h1>
          <p className="text-gray-600 mt-1">
            Delicious and nutritious recipes to support your weight loss journey
          </p>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTag('all')}
          >
            All Recipes
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className="capitalize"
            >
              {tag.replace('-', ' ')}
            </Button>
          ))}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {recipe.description}
                    </CardDescription>
                  </div>
                  <ChefHat className="h-5 w-5 text-green-600 ml-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {recipe.prepTime + recipe.cookTime} min
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {recipe.servings} servings
                  </div>
                  <div className="flex items-center text-orange-600 font-medium">
                    <Flame className="h-4 w-4 mr-1" />
                    {recipe.calories} cal
                  </div>
                  <div className="text-gray-600">
                    P: {recipe.protein}g C: {recipe.carbs}g F: {recipe.fats}g
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs capitalize">
                      {tag.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recipe Detail Dialog */}
        <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedRecipe && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedRecipe.name}</DialogTitle>
                  <DialogDescription>{selectedRecipe.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Recipe Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-blue-600">Prep Time</div>
                      <div className="text-lg font-bold text-blue-700">
                        {selectedRecipe.prepTime} min
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-green-600">Cook Time</div>
                      <div className="text-lg font-bold text-green-700">
                        {selectedRecipe.cookTime} min
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-purple-600">Servings</div>
                      <div className="text-lg font-bold text-purple-700">
                        {selectedRecipe.servings}
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-orange-600">Calories</div>
                      <div className="text-lg font-bold text-orange-700">
                        {selectedRecipe.calories}
                      </div>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Nutrition per Serving</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-sm text-gray-600">Protein</div>
                        <div className="text-xl font-bold text-blue-600">
                          {selectedRecipe.protein}g
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Carbs</div>
                        <div className="text-xl font-bold text-green-600">
                          {selectedRecipe.carbs}g
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Fats</div>
                        <div className="text-xl font-bold text-yellow-600">
                          {selectedRecipe.fats}g
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2 text-green-600">•</span>
                          <span className="text-gray-700">{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
                    <ol className="space-y-3">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-3 flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 pt-0.5">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="capitalize">
                          {tag.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

