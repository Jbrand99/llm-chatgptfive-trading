import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { CheckCircle, XCircle, Key, Shield, RefreshCw, AlertTriangle } from 'lucide-react';

interface OAuthStatus {
  configured: boolean;
  authenticated: boolean;
  clientId: string | null;
  tokenExpiry: string | null;
  timestamp: string;
}

export default function OAuthDashboard() {
  const [authToken, setAuthToken] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch OAuth status
  const { data: oauthStatus, isLoading: statusLoading, error: statusError } = useQuery<OAuthStatus>({
    queryKey: ['/api/oauth/status'],
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  // Authentication mutation
  const authenticateMutation = useMutation({
    mutationFn: () => apiRequest('/api/oauth/authenticate', { method: 'POST' }),
    onSuccess: (data) => {
      setAuthToken(data.access_token);
      queryClient.invalidateQueries({ queryKey: ['/api/oauth/status'] });
    }
  });

  // Token validation mutation
  const validateMutation = useMutation({
    mutationFn: (token: string) => 
      apiRequest('/api/oauth/validate', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      }),
  });

  // Test protected endpoint mutation
  const testProtectedMutation = useMutation({
    mutationFn: () => apiRequest('/api/oauth/protected'),
  });

  // Credentials test mutation
  const testCredentialsMutation = useMutation({
    mutationFn: () => apiRequest('/api/oauth/test'),
  });

  if (statusLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div data-testid="loading-oauth" className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading OAuth status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 data-testid="title-oauth" className="text-3xl font-bold tracking-tight">OAuth Authentication</h1>
          <p className="text-muted-foreground">
            Manage OAuth credentials and authentication status for the trading platform
          </p>
        </div>
        <Badge data-testid="badge-status" variant={oauthStatus?.configured ? "default" : "destructive"}>
          {oauthStatus?.configured ? "Configured" : "Not Configured"}
        </Badge>
      </div>

      {statusError && (
        <Alert data-testid="alert-error" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load OAuth status: {statusError instanceof Error ? statusError.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      )}

      {/* OAuth Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            OAuth Service Status
          </CardTitle>
          <CardDescription>
            Current status of OAuth authentication service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              {oauthStatus?.configured ? (
                <CheckCircle data-testid="icon-configured" className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle data-testid="icon-not-configured" className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Credentials Configured</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {oauthStatus?.authenticated ? (
                <CheckCircle data-testid="icon-authenticated" className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle data-testid="icon-not-authenticated" className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Currently Authenticated</span>
            </div>
          </div>

          {oauthStatus?.clientId && (
            <div className="text-sm">
              <strong>Client ID:</strong> {oauthStatus.clientId}
            </div>
          )}

          {oauthStatus?.tokenExpiry && (
            <div className="text-sm">
              <strong>Token Expires:</strong> {new Date(oauthStatus.tokenExpiry).toLocaleString()}
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Last updated: {oauthStatus?.timestamp ? new Date(oauthStatus.timestamp).toLocaleString() : 'Unknown'}
          </div>
        </CardContent>
      </Card>

      {/* OAuth Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            OAuth Actions
          </CardTitle>
          <CardDescription>
            Test OAuth authentication and token management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              data-testid="button-test-credentials"
              onClick={() => testCredentialsMutation.mutate()}
              disabled={testCredentialsMutation.isPending}
              variant="outline"
            >
              {testCredentialsMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Test Credentials
            </Button>

            <Button
              data-testid="button-authenticate"
              onClick={() => authenticateMutation.mutate()}
              disabled={!oauthStatus?.configured || authenticateMutation.isPending}
            >
              {authenticateMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Key className="h-4 w-4 mr-2" />
              )}
              Authenticate
            </Button>

            <Button
              data-testid="button-validate-token"
              onClick={() => validateMutation.mutate(authToken)}
              disabled={!authToken || validateMutation.isPending}
              variant="outline"
            >
              {validateMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Validate Token
            </Button>

            <Button
              data-testid="button-test-protected"
              onClick={() => testProtectedMutation.mutate()}
              disabled={testProtectedMutation.isPending}
              variant="outline"
            >
              {testProtectedMutation.isPending ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Test Protected Endpoint
            </Button>
          </div>

          {/* Results Display */}
          {testCredentialsMutation.data && (
            <Alert data-testid="alert-credentials-result">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Credentials Test Result</AlertTitle>
              <AlertDescription>
                <pre className="text-xs mt-2 p-2 bg-muted rounded">
                  {JSON.stringify(testCredentialsMutation.data, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}

          {authenticateMutation.data && (
            <Alert data-testid="alert-auth-result">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Authentication Result</AlertTitle>
              <AlertDescription>
                <div className="text-sm mt-2">
                  <strong>Status:</strong> {authenticateMutation.data.message}<br />
                  <strong>Token:</strong> {authenticateMutation.data.access_token}<br />
                  <strong>Type:</strong> {authenticateMutation.data.token_type}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {validateMutation.data && (
            <Alert data-testid="alert-validate-result" variant={validateMutation.data.valid ? "default" : "destructive"}>
              {validateMutation.data.valid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>Token Validation Result</AlertTitle>
              <AlertDescription>
                Token is {validateMutation.data.valid ? 'valid' : 'invalid'}
              </AlertDescription>
            </Alert>
          )}

          {testProtectedMutation.data && (
            <Alert data-testid="alert-protected-result">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Protected Endpoint Test</AlertTitle>
              <AlertDescription>
                <pre className="text-xs mt-2 p-2 bg-muted rounded">
                  {JSON.stringify(testProtectedMutation.data, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}

          {/* Error handling */}
          {(testCredentialsMutation.error || authenticateMutation.error || validateMutation.error || testProtectedMutation.error) && (
            <Alert data-testid="alert-error-result" variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {testCredentialsMutation.error?.message || 
                 authenticateMutation.error?.message || 
                 validateMutation.error?.message || 
                 testProtectedMutation.error?.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* OAuth Information */}
      <Card>
        <CardHeader>
          <CardTitle>OAuth Integration Information</CardTitle>
          <CardDescription>
            Understanding the OAuth implementation in your trading platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p><strong>Client ID:</strong> 50b5e6a3-f3f0-47be-8c2a-ccbfd45ef611</p>
            <p><strong>Available Endpoints:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>GET /api/oauth/status - Check OAuth service status</li>
              <li>POST /api/oauth/authenticate - Get access token</li>
              <li>POST /api/oauth/validate - Validate existing token</li>
              <li>POST /api/oauth/refresh - Refresh access token</li>
              <li>GET /api/oauth/protected - Test protected resource</li>
              <li>GET /api/oauth/test - Test credentials configuration</li>
            </ul>
          </div>
          
          <Separator />
          
          <div className="text-xs text-muted-foreground">
            <p><strong>Security Note:</strong> OAuth credentials are securely stored as environment variables and never exposed in client-side code. All authentication flows use industry-standard OAuth 2.0 protocols.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}