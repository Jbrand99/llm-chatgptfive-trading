import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Upload, UserCheck, CreditCard, ArrowUpDown, Building2 } from "lucide-react";

interface BrokerAccountManagerProps {
  connections: any[];
}

export function BrokerAccountManager({ connections }: BrokerAccountManagerProps) {
  const [accountDataText, setAccountDataText] = useState('');
  const [bankAccountDataText, setBankAccountDataText] = useState('');
  const [transferDataText, setTransferDataText] = useState('');
  const [assetsDataText, setAssetsDataText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const processAccountDataMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/process-account-data", data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      toast({
        title: "Account data processed successfully",
        description: `Account: ${response.results.account ? '✓' : '✗'}, Bank: ${response.results.bankAccount ? '✓' : '✗'}, Transfer: ${response.results.transfer ? '✓' : '✗'}, Assets: ${response.results.assets ? '✓' : '✗'}`,
      });
      // Clear forms after successful processing
      setAccountDataText('');
      setBankAccountDataText('');
      setTransferDataText('');
      setAssetsDataText('');
    },
    onError: (error: any) => {
      toast({
        title: "Error processing account data",
        description: error.message || "Failed to process account data",
        variant: "destructive",
      });
    },
  });

  const handleProcessData = () => {
    try {
      const data: any = {};

      if (accountDataText.trim()) {
        data.accountData = JSON.parse(accountDataText);
      }

      if (bankAccountDataText.trim()) {
        data.bankAccountData = JSON.parse(bankAccountDataText);
      }

      if (transferDataText.trim()) {
        data.transferData = JSON.parse(transferDataText);
      }

      if (assetsDataText.trim()) {
        const assetsArray = JSON.parse(assetsDataText);
        data.assetsData = Array.isArray(assetsArray) ? assetsArray : [assetsArray];
      }

      if (Object.keys(data).length === 0) {
        toast({
          title: "No data provided",
          description: "Please enter at least one type of data to process",
          variant: "destructive",
        });
        return;
      }

      processAccountDataMutation.mutate(data);
    } catch (error) {
      toast({
        title: "Invalid JSON data",
        description: "Please check that all JSON data is properly formatted",
        variant: "destructive",
      });
    }
  };

  const loadSampleData = () => {
    // Load the real broker account data you provided
    setAccountDataText(`{
  "id": "030f9db0-4313-42ed-bbd1-36b5bd83c185",
  "account_number": "892784016",
  "status": "SUBMITTED",
  "crypto_status": "INACTIVE",
  "currency": "USD",
  "last_equity": "0",
  "created_at": "2025-07-24T21:23:17.233431Z",
  "contact": {
    "email_address": "boring_euclid_39946181@example.com",
    "phone_number": "634-555-5371",
    "street_address": ["20 N San Mateo Dr"],
    "city": "San Mateo",
    "state": "CA",
    "postal_code": "94401",
    "country": "USA"
  },
  "identity": {
    "given_name": "Boring",
    "family_name": "Euclid",
    "date_of_birth": "1970-01-01",
    "country_of_citizenship": "USA",
    "country_of_birth": "USA",
    "party_type": "natural_person",
    "tax_id_type": "USA_SSN",
    "country_of_tax_residence": "USA",
    "funding_source": ["employment_income"]
  },
  "account_type": "trading",
  "trading_type": "margin",
  "enabled_assets": ["us_equity"]
}`);

    setBankAccountDataText(`{
  "id": "9f5ed7e9-66de-47c9-881f-1e31ff7e95f9",
  "account_owner_name": "Boring Euclid",
  "bank_account_type": "CHECKING",
  "bank_account_number": "32131231abc",
  "bank_routing_number": "123103716",
  "nickname": "Bank of America Checking",
  "status": "QUEUED"
}`);

    setTransferDataText(`{
  "id": "cba00bcc-22bc-4da1-a963-08e1a6e0d91b",
  "relationship_id": "9f5ed7e9-66de-47c9-881f-1e31ff7e95f9",
  "type": "ach",
  "status": "QUEUED",
  "currency": "USD",
  "amount": "1234.56",
  "instant_amount": "0",
  "direction": "INCOMING",
  "created_at": "2025-07-24T17:24:33.12150483-04:00",
  "updated_at": "2025-07-24T17:24:33.12150483-04:00",
  "expires_at": "2025-07-31T17:24:33.120995971-04:00",
  "requested_amount": "1234.56",
  "fee": "0",
  "fee_payment_method": "user"
}`);

    toast({
      title: "Sample data loaded",
      description: "Real Alpaca broker account data has been loaded into the forms",
    });
  };

  const brokerConnection = connections.find(c => c.type === 'broker');
  const hasConnection = brokerConnection && brokerConnection.status === 'connected';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Broker Account Data Manager
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Process real Alpaca broker account data including account details, bank relationships, transfers, and trading assets
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!hasConnection && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Broker connection required to process account data. Please set up your broker connection first.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={loadSampleData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Load Sample Data
            </Button>
            <Button 
              onClick={handleProcessData}
              disabled={processAccountDataMutation.isPending || !hasConnection}
              className="flex items-center gap-2"
            >
              {processAccountDataMutation.isPending ? "Processing..." : "Process Account Data"}
            </Button>
          </div>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Broker Account Data */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                <h3 className="font-medium">Broker Account Data</h3>
              </div>
              <Textarea
                placeholder="Paste broker account JSON data here..."
                value={accountDataText}
                onChange={(e) => setAccountDataText(e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Account information including contact details, identity, and account status
              </p>
            </div>

            {/* Bank Account Data */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <h3 className="font-medium">Bank Account Relationship</h3>
              </div>
              <Textarea
                placeholder="Paste bank account relationship JSON data here..."
                value={bankAccountDataText}
                onChange={(e) => setBankAccountDataText(e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Bank account details for ACH transfers and funding
              </p>
            </div>

            {/* Transfer Data */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <h3 className="font-medium">Transfer Data</h3>
              </div>
              <Textarea
                placeholder="Paste transfer JSON data here..."
                value={transferDataText}
                onChange={(e) => setTransferDataText(e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                ACH transfer information including amounts, status, and timing
              </p>
            </div>

            {/* Assets Data */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <h3 className="font-medium">Trading Assets</h3>
              </div>
              <Textarea
                placeholder="Paste trading assets JSON array here..."
                value={assetsDataText}
                onChange={(e) => setAssetsDataText(e.target.value)}
                rows={8}
                className="font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Trading assets data including symbols, exchanges, and trading permissions
              </p>
            </div>
          </div>

          <Separator />

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Processing Information</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Account data will be stored in the broker accounts table</li>
              <li>• Bank account relationships will be linked to the broker account</li>
              <li>• Transfer history will be recorded with proper status tracking</li>
              <li>• Trading assets will be available for search and reference</li>
              <li>• All data is processed securely and stored locally</li>
            </ul>
          </div>

          {processAccountDataMutation.isPending && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-sm text-muted-foreground">Processing account data...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}