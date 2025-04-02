
import { Clock, CheckCircle, X } from "lucide-react";
import React from "react";

type OrderStatus = 'pending' | 'completed' | 'cancelled';

export const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'completed':
      return 'Complétée';
    case 'cancelled':
      return 'Annulée';
    default:
      return status;
  }
};

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'text-yellow-500';
    case 'completed':
      return 'text-green-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return '';
  }
};

export const getStatusIcon = (status: OrderStatus): React.ReactNode => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <X className="h-4 w-4" />;
    default:
      return null;
  }
};

export const getStatusBgClass = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return '';
  }
};

export const getStatusBorderClass = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'border-l-yellow-500';
    case 'completed':
      return 'border-l-green-500';
    case 'cancelled':
      return 'border-l-red-500';
    default:
      return '';
  }
};
