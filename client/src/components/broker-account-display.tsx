import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, User, CreditCard, ArrowUpDown, Calendar, DollarSign, Phone, Mail, MapPin } from "lucide-react";

interface BrokerAccountDisplayProps {
  accountId: string;
}

export function BrokerAccountDisplay({ accountId }: BrokerAccountDisplayProps) {
  const { data: accountData, isLoading } = useQuery<{
    account: any;
    bankAccounts: any[];
    transfers: any[];
  }>({
    queryKey: ["/api/broker-accounts", accountId],
    enabled: !!accountId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-sm text-muted-foreground">Loading account data...</span>
        </CardContent>
      </Card>
    );
  }

  if (!accountData || !accountData.account) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No broker account data found</p>
        </CardContent>
      </Card>
    );
  }

  const { account, bankAccounts = [], transfers = [] } = accountData as {
    account: any;
    bankAccounts: any[];
    transfers: any[];
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'QUEUED': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'SENT': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Broker Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Account Number</p>
              <p className="font-mono text-lg">{account.accountNumber}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge className={getStatusColor(account.status)}>
                {account.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Account Type</p>
              <p className="capitalize">{account.accountType}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Trading Type</p>
              <p className="capitalize">{account.tradingType || 'Not specified'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Currency</p>
              <p>{account.currency}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Equity</p>
              <p className="font-mono">${parseFloat(account.lastEquity || '0').toLocaleString()}</p>
            </div>
          </div>

          {account.enabledAssets && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Enabled Assets</p>
              <div className="flex flex-wrap gap-2">
                {account.enabledAssets.map((asset: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {asset.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      {(account.contactEmail || account.contactPhone || account.contactAddress) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {account.contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{account.contactEmail}</p>
                  </div>
                </div>
              )}
              {account.contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p>{account.contactPhone}</p>
                  </div>
                </div>
              )}
            </div>

            {(account.contactAddress || account.contactCity) && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <div className="space-y-1">
                    {account.contactAddress && Array.isArray(account.contactAddress) && 
                      account.contactAddress.map((line: string, index: number) => (
                        <p key={index}>{line}</p>
                      ))
                    }
                    {(account.contactCity || account.contactState || account.contactPostalCode) && (
                      <p>
                        {[account.contactCity, account.contactState, account.contactPostalCode]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Identity Information */}
      {(account.identityGivenName || account.identityFamilyName || account.identityDateOfBirth) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Identity Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {account.identityGivenName && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Given Name</p>
                  <p>{account.identityGivenName}</p>
                </div>
              )}
              {account.identityFamilyName && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Family Name</p>
                  <p>{account.identityFamilyName}</p>
                </div>
              )}
              {account.identityDateOfBirth && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p>{new Date(account.identityDateOfBirth).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bank Accounts */}
      {bankAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Bank Account Relationships
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bankAccounts.map((bankAccount: any, index: number) => (
              <div key={bankAccount.id || index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{bankAccount.nickname || 'Bank Account'}</h4>
                  <Badge className={getStatusColor(bankAccount.status)}>
                    {bankAccount.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Account Owner</p>
                    <p>{bankAccount.accountOwnerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Type</p>
                    <p className="capitalize">{bankAccount.bankAccountType.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Routing Number</p>
                    <p className="font-mono">{bankAccount.bankRoutingNumber}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Transfer History */}
      {transfers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5" />
              Transfer History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transfers.map((transfer: any, index: number) => (
              <div key={transfer.transferId || index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      transfer.direction === 'INCOMING' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <span className="font-medium">
                      {transfer.direction === 'INCOMING' ? 'Deposit' : 'Withdrawal'}
                    </span>
                  </div>
                  <Badge className={getStatusColor(transfer.status)}>
                    {transfer.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-mono">${parseFloat(transfer.amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="uppercase">{transfer.transferType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p>{new Date(transfer.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fee</p>
                    <p className="font-mono">${parseFloat(transfer.fee || '0').toFixed(2)}</p>
                  </div>
                </div>
                {transfer.reason && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground">Reason: {transfer.reason}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Account Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Account Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p>{new Date(account.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Updated</p>
              <p>{new Date(account.updatedAt || account.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}