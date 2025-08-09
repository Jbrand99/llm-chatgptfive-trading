import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Building2 } from "lucide-react";

export function TradingAssetsSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: assets = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/trading-assets/search", searchQuery],
    enabled: searchQuery.length >= 2,
  });

  const { data: allAssets = [] } = useQuery<any[]>({
    queryKey: ["/api/trading-assets"],
    enabled: searchQuery.length < 2,
  });

  const displayAssets = searchQuery.length >= 2 ? assets : allAssets.slice(0, 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trading Assets Search
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Search through available trading assets
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search assets by symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading && searchQuery.length >= 2 && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-sm text-muted-foreground">Searching...</span>
          </div>
        )}

        {displayAssets.length === 0 && searchQuery.length >= 2 && !isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            No assets found for "{searchQuery}"
          </div>
        )}

        {displayAssets.length === 0 && searchQuery.length < 2 && (
          <div className="text-center p-8 text-muted-foreground">
            Enter at least 2 characters to search assets
          </div>
        )}

        <div className="space-y-3">
          {displayAssets.map((asset: any, index: number) => (
            <div key={asset.assetId || index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-bold text-lg">{asset.symbol}</span>
                    <Badge 
                      variant={asset.tradable ? "default" : "secondary"}
                      className={asset.tradable ? "bg-green-100 text-green-800" : ""}
                    >
                      {asset.tradable ? 'Tradable' : 'Not Tradable'}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{asset.name}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-muted-foreground">Class: {asset.assetClass}</span>
                    {asset.exchange && (
                      <span className="text-muted-foreground">Exchange: {asset.exchange}</span>
                    )}
                    {asset.cusip && (
                      <span className="text-muted-foreground">CUSIP: {asset.cusip}</span>
                    )}
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={
                    asset.status === 'active' 
                      ? 'border-green-200 text-green-700' 
                      : 'border-gray-200 text-gray-600'
                  }
                >
                  {asset.status}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Marginable</p>
                  <p>{asset.marginable ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shortable</p>
                  <p>{asset.shortable ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Easy to Borrow</p>
                  <p>{asset.easyToBorrow ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fractionable</p>
                  <p>{asset.fractionable ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {asset.attributes && asset.attributes.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Attributes:</p>
                  <div className="flex flex-wrap gap-1">
                    {asset.attributes.map((attr: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {searchQuery.length < 2 && allAssets.length > 20 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing 20 of {allAssets.length} assets. Search to find specific assets.
          </div>
        )}
      </CardContent>
    </Card>
  );
}