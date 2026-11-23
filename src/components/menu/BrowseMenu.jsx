"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Container from "@/components/common/Container";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import MenuGrid, { MenuGridSkeleton } from "./MenuGrid";
import { useFetch } from "@/hooks/use-fetch";
import { useDebounce } from "@/hooks/use-debounce";
import { CATEGORY_NAMES } from "@/lib/constants";

export default function BrowseMenu({ initialCategory = "all", initialSearch = "" }) {
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(CATEGORY_NAMES.includes(initialCategory) ? initialCategory : "all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);
  const debouncedMin = useDebounce(minPrice);
  const debouncedMax = useDebounce(maxPrice);

  useEffect(() => setPage(1), [debouncedSearch, category, location, sort, debouncedMin, debouncedMax]);

  const meta = useFetch("/menu/meta");
  const { data, loading, error, reload } = useFetch("/menu", {
    params: { search: debouncedSearch, category, location, sort, minPrice: debouncedMin, maxPrice: debouncedMax, page, limit: 9 },
  });

  const clear = () => {
    setSearch("");
    setCategory("all");
    setLocation("all");
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Browse Menu</h1>
        <p className="mt-2 text-muted-foreground">Search pizzas, sides and drinks from local shops.</p>
      </div>

      <div className="mb-8 grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, shop or area" className="pl-9" aria-label="Search menu" />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORY_NAMES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {(meta.data?.locations || []).map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="price_asc">Price: low to high</SelectItem>
            <SelectItem value="price_desc">Price: high to low</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min $" aria-label="Minimum price" />
          <Input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max $" aria-label="Maximum price" />
        </div>
      </div>

      {loading ? (
        <MenuGridSkeleton count={9} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.items.length === 0 ? (
        <EmptyState
          title="No items match your search"
          description="Try a different keyword, category or location."
          action={<Button variant="outline" onClick={clear}>Clear filters</Button>}
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{data.total} item{data.total === 1 ? "" : "s"} found</p>
          <MenuGrid items={data.items} />
          {data.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm text-muted-foreground">Page {data.page} of {data.pages}</span>
              <Button variant="outline" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}
