
import React from "react";
import { AlertTriangle, CheckCircle, Clock, RotateCw } from "lucide-react";

export const getStatusText = (status: 'pending' | 'completed' | 'cancelled'): string => {
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

export const getStatusColor = (status: 'pending' | 'completed' | 'cancelled'): string => {
  switch (status) {
    case 'pending':
      return 'text-amber-500';
    case 'completed':
      return 'text-green-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return 'text-muted-foreground';
  }
};

export const getStatusIcon = (status: 'pending' | 'completed' | 'cancelled') => {
  switch (status) {
    case 'pending':
      return <Clock className="w-3 h-3" />;
    case 'completed':
      return <CheckCircle className="w-3 h-3" />;
    case 'cancelled':
      return <AlertTriangle className="w-3 h-3" />;
    default:
      return null;
  }
};

export const getStatusBgClass = (status: 'pending' | 'completed' | 'cancelled'): string => {
  switch (status) {
    case 'pending':
      return 'bg-amber-500/20 text-amber-700 dark:text-amber-300';
    case 'completed':
      return 'bg-green-500/20 text-green-700 dark:text-green-300';
    case 'cancelled':
      return 'bg-red-500/20 text-red-700 dark:text-red-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const getStatusBorderClass = (status: 'pending' | 'completed' | 'cancelled'): string => {
  switch (status) {
    case 'pending':
      return 'border-amber-500';
    case 'completed':
      return 'border-green-500';
    case 'cancelled':
      return 'border-red-500';
    default:
      return 'border-muted';
  }
};
