
import React from "react";
import { User, Search, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OrderSearchFormProps {
  searchUsername: string;
  setSearchUsername: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const OrderSearchForm: React.FC<OrderSearchFormProps> = ({
  searchUsername,
  setSearchUsername,
  handleSearch
}) => {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm animate-fade-in transition-all hover:shadow">
      <form onSubmit={handleSearch} className="space-y-4">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-foreground">
          <History className="h-5 w-5 text-primary" /> Rechercher vos commandes
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Entrez votre pseudo"
              className="ps-10 bg-background border-input focus-visible:ring-primary"
            />
          </div>
          <Button type="submit" size="default" className="min-w-[120px] bg-primary hover:bg-primary/90 transition-colors">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderSearchForm;
