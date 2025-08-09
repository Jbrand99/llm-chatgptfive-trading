import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { DollarSign, CreditCard, AlertTriangle } from "lucide-react";

interface RealAchFundingProps {
  accountId: string;
}

export function RealAchFunding({ accountId }: RealAchFundingProps) {
  const [amount, setAmount] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankRoutingNumber, setBankRoutingNumber] = useState("");
  const [accountOwnerName, setAccountOwnerName] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const achTransferMutation = useMutation({
    mutationFn: async (data: {
      amount: number;
      bank_account_number: string;
      bank_routing_number: string;
      account_owner_name: string;
    }) => {
      return await apiRequest(`/api/accounts/${accountId}/ach-transfer`, "POST", data);
    },
    onSuccess: (data: any) => {
      toast({
        title: "ACH Transfer Initiated",
        description: data.message,
      });
      // Reset form
      setAmount("");
      setBankAccountNumber("");
      setBankRoutingNumber("");
      setAccountOwnerName("");
      // Refresh account data
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
    },
    onError: (error: any) => {
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to initiate ACH transfer",
        variant: "destructive",
      });
    },
  });

  const handleAchTransfer = () => {
    if (!amount || !bankAccountNumber || !bankRoutingNumber || !accountOwnerName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0 || transferAmount > 50000) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be between $1 and $50,000",
        variant: "destructive",
      });
      return;
    }

    achTransferMutation.mutate({
      amount: transferAmount,
      bank_account_number: bankAccountNumber,
      bank_routing_number: bankRoutingNumber,
      account_owner_name: accountOwnerName,
    });
  };

  return (
    <div className="space-y-6">
      {/* Real ACH Transfer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Real ACH Bank Transfer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Transfer Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="25000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                max="50000"
              />
            </div>
            <div>
              <Label htmlFor="owner-name">Account Owner Name</Label>
              <Input
                id="owner-name"
                placeholder="John Doe"
                value={accountOwnerName}
                onChange={(e) => setAccountOwnerName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="routing">Bank Routing Number</Label>
              <Input
                id="routing"
                placeholder="121000358"
                value={bankRoutingNumber}
                onChange={(e) => setBankRoutingNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="account">Bank Account Number</Label>
              <Input
                id="account"
                placeholder="32131231abc"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <p className="font-medium">Real Money Transfer</p>
                <p>This will initiate an actual ACH transfer from your bank account. Funds typically arrive in 1-3 business days.</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleAchTransfer} 
            disabled={achTransferMutation.isPending}
            className="w-full"
          >
            {achTransferMutation.isPending ? "Processing..." : "Initiate ACH Transfer"}
          </Button>
        </CardContent>
      </Card>


    </div>
  );
}