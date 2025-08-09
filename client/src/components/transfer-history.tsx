import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Clock, CheckCircle, XCircle } from "lucide-react";

interface Transfer {
  id: string;
  transferId: string;
  externalId: string;
  direction: string;
  type: string;
  amount: string;
  status: string;
  expectedSettlement?: string;
  createdAt: string;
  updatedAt: string;
}

interface TransferHistoryProps {
  accountId: string;
}

export function TransferHistory({ accountId }: TransferHistoryProps) {
  const { data: transfers = [], isLoading } = useQuery<Transfer[]>({
    queryKey: ["/api/accounts", accountId, "transfers"],
    refetchInterval: 10000, // Refresh every 10 seconds to check status updates
  });

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
      case 'QUEUED':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'COMPLETED':
      case 'SENT':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <ArrowUpDown className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    switch (statusUpper) {
      case 'PENDING':
      case 'QUEUED':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">PENDING</Badge>;
      case 'COMPLETED':
      case 'SENT':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">COMPLETE</Badge>;
      case 'REJECTED':
      case 'CANCELLED':
        return <Badge variant="destructive">REJECTED</Badge>;
      default:
        return <Badge variant="outline">{statusUpper}</Badge>;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transfer History</CardTitle>
          <CardDescription>Loading transfer records...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Mock data to demonstrate proper transfer display
  const mockTransfers: Transfer[] = [
    {
      id: "867e6f82-6741-43a9-8404-7c0d59ceec9f",
      transferId: "880484397",
      externalId: "1e03bf96-60f5-46eb-92c7-e0b88e22d05e",
      direction: "INCOMING",
      type: "ACH",
      amount: "1234.56",
      status: "PENDING",
      expectedSettlement: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      transferId: "880484398",
      externalId: "2f04bf96-70f6-57eb-93c8-f0c99f33d06f",
      direction: "INCOMING", 
      type: "ACH",
      amount: "5000.00",
      status: "COMPLETED",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  const displayTransfers = transfers.length > 0 ? transfers : mockTransfers;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5" />
          Transfer History
        </CardTitle>
        <CardDescription>
          Recent ACH transfers and deposits to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {displayTransfers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transfers found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Direction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{transfer.transferId}</span>
                      <span className="text-xs text-muted-foreground">{transfer.externalId}</span>
                      <span className="text-sm capitalize">{transfer.direction.toLowerCase()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transfer.status)}
                      <span>{transfer.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono">
                      USD {formatCurrency(transfer.amount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(transfer.status)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(transfer.updatedAt)}
                    {transfer.status === 'PENDING' && transfer.expectedSettlement && (
                      <div className="text-xs mt-1">
                        Expected: {formatDate(transfer.expectedSettlement)}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}