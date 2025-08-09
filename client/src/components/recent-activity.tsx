import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { ApiActivity } from "@shared/schema";

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery<ApiActivity[]>({
    queryKey: ["/api/activity"],
  });

  const getStatusBadgeColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'bg-success/10 text-success';
    if (statusCode >= 400 && statusCode < 500) return 'bg-warning/10 text-warning';
    if (statusCode >= 500) return 'bg-error/10 text-error';
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <Card className="mb-8">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent API Activity</h3>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex space-x-4 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Timestamp</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Endpoint</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Method</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-slate-600 dark:text-slate-400">Response Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="py-3 text-sm text-slate-900 dark:text-slate-100">
                      {new Date(activity.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 text-sm text-slate-900 dark:text-slate-100 font-mono">
                      {activity.endpoint}
                    </td>
                    <td className="py-3 text-sm text-slate-900 dark:text-slate-100">
                      {activity.method}
                    </td>
                    <td className="py-3 text-sm">
                      <Badge variant="secondary" className={getStatusBadgeColor(activity.statusCode)}>
                        {activity.statusCode}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-slate-900 dark:text-slate-100">
                      {activity.responseTime}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">No API activity recorded yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Activity will appear here once connections are established</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
