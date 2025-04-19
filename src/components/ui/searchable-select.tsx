"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SearchResult = {
  id: string;
  display: string;
};

type SearchableSelectProps<T extends SearchResult> = {
  placeholder: string;
  searchPlaceholder: string;
  value: string | string[] | null | undefined;
  onChange: (value: string | string[]) => void;
  getDisplayValue: (value: string | string[]) => string;
  searchFunction: (
    query: string,
    extraParams?: Record<string, any>,
  ) => Promise<T[]>;
  searchParams?: Record<string, any>;
  multiSelect?: boolean;
  selectedItems?: T[];
  onItemRemove?: (id: string) => void;
  renderSelectedItems?: (
    selectedItems: T[],
    onRemove: (id: string) => void,
  ) => React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export function SearchableSelect<T extends SearchResult>({
  placeholder,
  searchPlaceholder,
  value,
  onChange,
  getDisplayValue,
  searchFunction,
  searchParams = {},
  multiSelect = false,
  selectedItems = [],
  onItemRemove,
  renderSelectedItems,
  disabled = false,
  className,
}: SearchableSelectProps<T>) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { query, setQuery, results, isLoading } = useDebouncedSearch(
    (q: string) => searchFunction(q, searchParams),
  );

  useEffect(() => {
    if (popoverOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [popoverOpen]);

  const handleItemClick = (item: T) => {
    if (multiSelect) {
      // For multi-select mode, add to array if not already selected
      const valueArray = Array.isArray(value) ? value : [];
      if (!valueArray.includes(item.id)) {
        onChange([...valueArray, item.id]);
      }
    } else {
      // For single select mode, just set the value
      onChange(item.id);
      setPopoverOpen(false);
    }
    setQuery("");
  };

  const handleRemoveItem = (itemId: string) => {
    if (multiSelect && Array.isArray(value)) {
      onChange(value.filter((id) => id !== itemId));
    }
    if (onItemRemove) {
      onItemRemove(itemId);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            role="combobox"
            className={cn(
              "w-full justify-between pl-3 text-left font-normal",
              (!value || (Array.isArray(value) && value.length === 0)) &&
                "text-muted-foreground",
            )}
            onClick={() => setPopoverOpen(true)}
            disabled={disabled}
          >
            {value && value.length > 0 ? getDisplayValue(value) : placeholder}
            <Search className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <div className="p-2">
            <Input
              ref={inputRef}
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mb-2"
            />
          </div>
          <div className="max-h-[200px] overflow-auto">
            {isLoading ? (
              <div className="text-muted-foreground p-4 text-center text-sm">
                Loading...
              </div>
            ) : results.length > 0 ? (
              results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="w-full cursor-pointer px-4 py-2 text-left hover:bg-neutral-100"
                  onClick={() => handleItemClick(item)}
                >
                  {item.display}
                </button>
              ))
            ) : (
              <div className="text-muted-foreground p-4 text-center text-sm">
                No results found
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {multiSelect && selectedItems.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {renderSelectedItems
            ? renderSelectedItems(selectedItems, handleRemoveItem)
            : selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-accent flex items-center gap-2 rounded-full px-3 py-1 text-sm"
                >
                  <span>{item.display}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
