
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderStatisticsProps {
  orders: Order[];
}

interface DataPoint {
  date: string;
  completed: number;
  pending: number;
  cancelled: number;
  revenue: number;
}

const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6'];

const OrderStatistics = ({ orders }: OrderStatisticsProps) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  
  useEffect(() => {
    if (orders.length === 0) return;
    
    // Group orders by date for bar chart
    const groupedByDate = orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      if (!acc[date]) {
        acc[date] = {
          date,
          completed: 0,
          pending: 0,
          cancelled: 0,
          revenue: 0
        };
      }
      
      // Increment the appropriate counter
      if (order.status === 'completed') {
        acc[date].completed += 1;
        acc[date].revenue += order.totalPrice;
      } else if (order.status === 'pending') {
        acc[date].pending += 1;
      } else if (order.status === 'cancelled') {
        acc[date].cancelled += 1;
      }
      
      return acc;
    }, {} as Record<string, DataPoint>);
    
    // Sort by date (oldest first)
    const formattedData = Object.values(groupedByDate).sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
    
    setData(formattedData);
    
    // Prepare data for the pie chart
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    const completedCount = orders.filter(order => order.status === 'completed').length;
    const cancelledCount = orders.filter(order => order.status === 'cancelled').length;
    
    setPieData([
      { name: 'Complétées', value: completedCount },
      { name: 'En attente', value: pendingCount },
      { name: 'Annulées', value: cancelledCount },
    ]);
    
  }, [orders]);
  
  if (orders.length === 0) {
    return <div className="text-center p-6 text-muted-foreground">Aucune donnée disponible</div>;
  }
  
  return (
    <Tabs defaultValue="evolution">
      <TabsList className="mb-6">
        <TabsTrigger value="evolution">Évolution</TabsTrigger>
        <TabsTrigger value="repartition">Répartition</TabsTrigger>
      </TabsList>
      
      <TabsContent value="evolution" className="mt-0">
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem',
                }} 
              />
              <Legend />
              <Bar yAxisId="left" dataKey="completed" name="Complétées" fill="#22c55e" />
              <Bar yAxisId="left" dataKey="pending" name="En attente" fill="#eab308" />
              <Bar yAxisId="left" dataKey="cancelled" name="Annulées" fill="#ef4444" />
              <Bar yAxisId="right" dataKey="revenue" name="Chiffre d'affaires (€)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="repartition" className="mt-0">
        <div className="w-full h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="80%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  borderRadius: '0.5rem',
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default OrderStatistics;
