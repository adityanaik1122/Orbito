import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { DollarSign, TrendingUp, MousePointerClick, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CommissionDashboardPage() {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [conversions, setCon]