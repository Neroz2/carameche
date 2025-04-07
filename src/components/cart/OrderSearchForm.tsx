
import React from "react";
import { User, Search } from "lucide-react";
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
    <div className="bg-card border rounded-lg p-6 shadow-sm animate-fade-in">
      <form onSubmit={handleSearch} className="space-y-4">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-primary">
          <User className="h-5 w-5" /> Rechercher vos commandes
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
              className="ps-10"
            />
          </div>
          <Button type="submit" size="lg" className="min-w-[120px]">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderSearchForm;
