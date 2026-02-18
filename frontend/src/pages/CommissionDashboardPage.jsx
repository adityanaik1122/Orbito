import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  MousePointerClick, 
  CheckCircle,
  Clock,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../components/ui/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CommissionDashboardPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [conversions, setConversions] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [dateRange, setDateRange] = useState('30'); // days

  useEffect(() => {
    fetchDashboardData();
  }, [selectedProvider, dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch summary stats
      const statsRes = await fetch(`${API_URL}/affiliate/stats`);
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch performance data
      const perfRes = await fetch(
        `${API_URL}/affiliate/performance?${selectedProvider !== 'all' ? `provider=${selectedProvider}` : ''}`
      );
      const perfData = await perfRes.json();
      setPerformance(perfData);

      // Fetch recent conversions
      const convRes = await fetch(
        `${API_URL}/affiliate/conversions?${selectedProvider !== 'all' ? `provider=${selectedProvider}` : ''}`
      );
      const convData = await convRes.json();
      setConversions(convData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load dashboard data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    toast({
      title: 'Refreshed',
      description: 'Dashboard data updated'
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Preparing your commission report...'
    });
    // TODO: Implement CSV export
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Commission Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your affiliate earnings and performance</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mt-6">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Providers</option>
              <option value="getyourguide">GetYourGuide</option>
              <option value="viator">Viator</option>
              <option value="premiumtours">Premium Tours</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Commission
              </CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                £{stats?.totalCommission?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                From {stats?.totalConversions || 0} conversions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Commission
              </CardTitle>
              <Clock className="w-5 h-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                £{stats?.pendingCommission?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Paid Commission
              </CardTitle>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                £{stats?.paidCommission?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Successfully paid out
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                £{stats?.totalRevenue?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Total booking value
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Provider Breakdown */}
        {stats?.byProvider && Object.keys(stats.byProvider).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Performance by Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.byProvider).map(([provider, data]) => (
                  <div key={provider} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900 capitalize">{provider}</h3>
                      <p className="text-sm text-gray-600">{data.conversions} conversions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">£{data.commission.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">from £{data.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for detailed views */}
        <Tabs defaultValue="conversions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="conversions">Recent Conversions</TabsTrigger>
            <TabsTrigger value="performance">Tour Performance</TabsTrigger>
          </TabsList>

          {/* Conversions Tab */}
          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Conversions</CardTitle>
              </CardHeader>
              <CardContent>
                {conversions.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No conversions yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Start promoting tours to earn commissions
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Booking Ref</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Commission</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversions.slice(0, 20).map((conversion) => (
                          <tr key={conversion.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {format(new Date(conversion.created_at), 'MMM dd, yyyy')}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm font-medium capitalize">{conversion.provider}</span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {conversion.booking_reference || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-medium">
                              £{parseFloat(conversion.booking_amount).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-bold text-green-600">
                              £{parseFloat(conversion.commission_amount).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className={getStatusColor(conversion.status)}>
                                {conversion.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Tour Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {performance.length === 0 ? (
                  <div className="text-center py-12">
                    <MousePointerClick className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No performance data yet</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Generate affiliate links to start tracking
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Tour</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Provider</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Clicks</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Conversions</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Conv. Rate</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {performance.slice(0, 20).map((item, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div className="text-sm font-medium text-gray-900">{item.tour_title}</div>
                              <div className="text-xs text-gray-500">{item.destination}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-sm capitalize">{item.provider}</span>
                            </td>
                            <td className="py-3 px-4 text-right text-sm">
                              {item.total_clicks || 0}
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-medium">
                              {item.total_conversions || 0}
                            </td>
                            <td className="py-3 px-4 text-right text-sm">
                              <span className={`font-medium ${
                                parseFloat(item.conversion_rate) > 5 ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {item.conversion_rate || 0}%
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right text-sm font-bold text-green-600">
                              £{parseFloat(item.total_commission || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
