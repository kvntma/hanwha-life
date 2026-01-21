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
              className="w-full justify-start font-bold uppercase italic tracking-tighter"
              onClick={() => setActiveCategory(null)}
            >
              All Drops
            </Button>
            <Button
              variant={activeCategory === 'Signature' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start font-bold uppercase italic tracking-tighter"
              onClick={() => setActiveCategory('Signature')}
            >
              Signature Series
            </Button>
            <Button
              variant={activeCategory === 'Elite' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start font-bold uppercase italic tracking-tighter"
              onClick={() => setActiveCategory('Elite')}
            >
              Elite Vault
            </Button>
            <Button
              variant={activeCategory === 'Standard' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start font-bold uppercase italic tracking-tighter"
              onClick={() => setActiveCategory('Standard')}
            >
              Standard Issue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
