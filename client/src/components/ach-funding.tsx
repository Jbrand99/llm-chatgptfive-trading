import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, DollarSign, Clock, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AchRelationship, AchTransfer } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface AchFundingProps {
  accountId: string;
}

const achRelationshipSchema = z.object({
  accountOwnerName: z.string().min(1, "Account owner name is required"),
  bankAccountType: z.enum(["CHECKING", "SAVINGS"], {
    required_error: "Bank account type is required",
  }),
  bankAccountNumber: z.string().min(1, "Bank account number is required"),
  bankRoutingNumber: z.string().min(9, "Routing number must be at least 9 digits"),
  nickname: z.string().optional(),
});

const achTransferSchema = z.object({
  relationshipId: z.number(),
  amount: z.string().refine((val) => {
    const num = parseFloat(val);
    return num > 0 && num <= 50000;
  }, "Amount must be between $0.01 and $50,000"),
  direction: z.enum(["DEPOSIT", "WITHDRAWAL"], {
    required_error: "Transfer direction is required",
  }),
});

type AchRelationshipForm = z.infer<typeof achRelationshipSchema>;
type AchTransferForm = z.infer<typeof achTransferSchema>;

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "APPROVED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "SENT":
      return "bg-green-100 text-green-800 border-green-200";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "PENDING":
      return <Clock className="h-4 w-4" />;
    case "APPROVED":
      return <CheckCircle className="h-4 w-4" />;
    case "SENT":
      return <CheckCircle className="h-4 w-4" />;
    case "FAILED":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

export function AchFunding({ accountId }: AchFundingProps) {
  const { toast } = useToast();
  const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  // Fetch ACH relationships
  const { data: relationships = [], isLoading: relationshipsLoading } = useQuery<AchRelationship[]>({
    queryKey: ["/api/accounts", accountId, "ach-relationships"],
  });

  // Fetch ACH transfers
  const { data: transfers = [], isLoading: transfersLoading } = useQuery<AchTransfer[]>({
    queryKey: ["/api/accounts", accountId, "transfers"],
  });

  // Create ACH relationship mutation
  const createRelationshipMutation = useMutation({
    mutationFn: (data: AchRelationshipForm) =>
      apiRequest("POST", `/api/accounts/${accountId}/ach-relationships`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts", accountId, "ach-relationships"] });
      setRelationshipDialogOpen(false);
      relationshipForm.reset();
      toast({
        title: "Bank account linked",
        description: "Your bank account has been successfully linked for ACH transfers.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error linking bank account",
        description: error.message || "Failed to link bank account. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create ACH transfer mutation
  const createTransferMutation = useMutation({
    mutationFn: (data: AchTransferForm) =>
      apiRequest("POST", `/api/accounts/${accountId}/transfers`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accounts", accountId, "transfers"] });
      setTransferDialogOpen(false);
      transferForm.reset();
      toast({
        title: "Transfer initiated",
        description: "Your ACH transfer has been initiated and is being processed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error initiating transfer",
        description: error.message || "Failed to initiate transfer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const relationshipForm = useForm<AchRelationshipForm>({
    resolver: zodResolver(achRelationshipSchema),
    defaultValues: {
      accountOwnerName: "",
      bankAccountType: "CHECKING",
      bankAccountNumber: "",
      bankRoutingNumber: "",
      nickname: "",
    },
  });

  const transferForm = useForm<AchTransferForm>({
    resolver: zodResolver(achTransferSchema),
    defaultValues: {
      relationshipId: 0,
      amount: "",
      direction: "DEPOSIT",
    },
  });

  const approvedRelationships = relationships.filter((r: AchRelationship) => r.status === "APPROVED");

  return (
    <div className="space-y-6">
      {/* Bank Accounts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Bank Accounts</CardTitle>
            <CardDescription>
              Manage your linked bank accounts for ACH transfers
            </CardDescription>
          </div>
          <Dialog open={relationshipDialogOpen} onOpenChange={setRelationshipDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Link Bank Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Link Bank Account</DialogTitle>
                <DialogDescription>
                  Add a bank account for ACH deposits and withdrawals
                </DialogDescription>
              </DialogHeader>
              <Form {...relationshipForm}>
                <form onSubmit={relationshipForm.handleSubmit((data) => createRelationshipMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={relationshipForm.control}
                    name="accountOwnerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Owner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={relationshipForm.control}
                    name="bankAccountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CHECKING">Checking</SelectItem>
                            <SelectItem value="SAVINGS">Savings</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={relationshipForm.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={relationshipForm.control}
                    name="bankRoutingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter 9-digit routing number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={relationshipForm.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nickname (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Primary Checking" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setRelationshipDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createRelationshipMutation.isPending}>
                      {createRelationshipMutation.isPending ? "Linking..." : "Link Account"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {relationshipsLoading ? (
            <div className="text-sm text-muted-foreground">Loading bank accounts...</div>
          ) : relationships.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bank accounts linked</p>
              <p className="text-sm">Link a bank account to start making transfers</p>
            </div>
          ) : (
            <div className="space-y-3">
              {relationships.map((relationship: AchRelationship) => (
                <div key={relationship.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {relationship.nickname || `${relationship.bankAccountType} Account`}
                      </span>
                      <Badge variant="outline" className={getStatusColor(relationship.status)}>
                        {getStatusIcon(relationship.status)}
                        <span className="ml-1">{relationship.status}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {relationship.accountOwnerName} • ****{relationship.bankAccountNumber.slice(-4)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ACH Transfers Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">ACH Transfers</CardTitle>
            <CardDescription>
              Deposit or withdraw funds using ACH transfers
            </CardDescription>
          </div>
          {approvedRelationships.length > 0 && (
            <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Transfer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Initiate ACH Transfer</DialogTitle>
                  <DialogDescription>
                    Transfer funds between your bank account and trading account
                  </DialogDescription>
                </DialogHeader>
                <Form {...transferForm}>
                  <form onSubmit={transferForm.handleSubmit((data) => createTransferMutation.mutate(data))} className="space-y-4">
                    <FormField
                      control={transferForm.control}
                      name="relationshipId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Account</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select bank account" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {approvedRelationships.map((relationship) => (
                                <SelectItem key={relationship.id} value={relationship.id.toString()}>
                                  {relationship.nickname || `${relationship.bankAccountType} Account`} (****{relationship.bankAccountNumber.slice(-4)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={transferForm.control}
                      name="direction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transfer Direction</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select direction" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DEPOSIT">Deposit (Bank → Trading)</SelectItem>
                              <SelectItem value="WITHDRAWAL">Withdrawal (Trading → Bank)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={transferForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="0.00" 
                                className="pl-9" 
                                type="number" 
                                step="0.01" 
                                min="0.01" 
                                max="50000" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setTransferDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createTransferMutation.isPending}>
                        {createTransferMutation.isPending ? "Processing..." : "Initiate Transfer"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {transfersLoading ? (
            <div className="text-sm text-muted-foreground">Loading transfers...</div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No transfers found</p>
              {approvedRelationships.length === 0 ? (
                <p className="text-sm">Link and verify a bank account first</p>
              ) : (
                <p className="text-sm">Click "New Transfer" to get started</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {transfers
                .sort((a: AchTransfer, b: AchTransfer) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((transfer: AchTransfer) => {
                  const relationship = relationships.find((r: AchRelationship) => r.id === transfer.relationshipId);
                  return (
                    <div key={transfer.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            ${parseFloat(transfer.amount).toFixed(2)}
                          </span>
                          <Badge variant={transfer.direction === "DEPOSIT" ? "default" : "secondary"}>
                            {transfer.direction}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(transfer.status)}>
                            {getStatusIcon(transfer.status)}
                            <span className="ml-1">{transfer.status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {relationship?.nickname || `${relationship?.bankAccountType} Account`} • 
                          {formatDistanceToNow(new Date(transfer.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}