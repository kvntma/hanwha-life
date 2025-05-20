import { Button } from '@/components/ui/button';

interface ProductFiltersProps {
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  showFilters: boolean;
}

export const ProductFilters = ({
  activeCategory,
  setActiveCategory,
  showFilters,
}: ProductFiltersProps) => {
  return (
    <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
      <div className="sticky top-20 rounded-lg bg-card border border-border p-4">
        <h2 className="font-semibold text-lg mb-4">Filters</h2>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Category</h3>
          <div className="space-y-2">
            <Button
              variant={activeCategory === null ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveCategory(null)}
            >
              All Meals
            </Button>
            <Button
              variant={activeCategory === 'Bestseller' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveCategory('Bestseller')}
            >
              Bestseller
            </Button>
            <Button
              variant={activeCategory === 'Plant-Based' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveCategory('Plant-Based')}
            >
              Plant-Based
            </Button>
            <Button
              variant={activeCategory === 'High Calorie' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveCategory('High Calorie')}
            >
              High Calorie
            </Button>
            <Button
              variant={activeCategory === 'International' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveCategory('International')}
            >
              International
            </Button>
            <Button
              variant={activeCategory === 'Keto' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveCategory('Keto')}
            >
              Keto
            </Button>
            <Button
              variant={activeCategory === 'Spicy' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
              onClick={() => setActiveCategory('Spicy')}
            >
              Spicy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
