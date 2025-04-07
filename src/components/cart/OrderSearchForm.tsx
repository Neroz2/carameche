
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
    <div className="bg-card border rounded-lg p-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
          <User className="h-4 w-4" /> Rechercher vos commandes
        </h3>
        <div className="flex gap-2">
          <Input
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            placeholder="Entrez votre pseudo"
            className="flex-1"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OrderSearchForm;
