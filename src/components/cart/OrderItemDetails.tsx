
import React from "react";
import { RotateCw } from "lucide-react";
import { CartItem } from "@/lib/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface OrderItemDetailsProps {
  items: CartItem[];
}

const OrderItemDetails: React.FC<OrderItemDetailsProps> = ({ items }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Image</TableHead>
          <TableHead>Carte</TableHead>
          <TableHead>Numéro</TableHead>
          <TableHead className="text-right">Qté</TableHead>
          <TableHead className="text-right">Prix</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.card.id}>
            <TableCell>
              <div className="relative w-14 h-20">
                <img 
                  src={item.card.image} 
                  alt={item.card.nameFr || item.card.name}
                  className="w-14 h-20 object-cover rounded"
                />
                {item.card.isReverse && (
                  <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full p-0.5">
                    <RotateCw size={12} />
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="font-medium">
              {item.card.nameFr || item.card.name}
              {item.card.isReverse && (
                <span className="ml-2 text-xs bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded inline-flex items-center gap-1">
                  <RotateCw size={10} />
                  Reverse
                </span>
              )}
            </TableCell>
            <TableCell>{item.card.number}</TableCell>
            <TableCell className="text-right">{item.quantity}</TableCell>
            <TableCell className="text-right">{(item.card.price * item.quantity).toFixed(2)} €</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrderItemDetails;
