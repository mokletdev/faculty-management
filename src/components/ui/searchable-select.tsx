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

// Create a base props type without the conditional props
type BaseSearchableSelectProps<T extends SearchResult> = {
  placeholder: string;
  searchPlaceholder: string;
  onChange: (value: string | string[]) => void;
  searchFunction: (
    query: string,
    extraParams?: Record<string, any>,
  ) => Promise<T[]>;
  searchParams?: Record<string, any>;
  onItemRemove?: (id: string) => void;
  renderSelectedItems?: (
    selectedItems: T[],
    onRemove: (id: string) => void,
  ) => React.ReactNode;
  disabled?: boolean;
  className?: string;
};

// Define props specifically for single-select mode (string value)
type SingleSelectProps<T extends SearchResult> =
  BaseSearchableSelectProps<T> & {
    value: string;
    displayValue?: SearchResult; // Required when value is a string
    multiSelect?: false;
    selectedItems?: T[];
  };

// Define props specifically for multi-select mode (string[] value)
type MultiSelectProps<T extends SearchResult> = BaseSearchableSelectProps<T> & {
  value: string[];
  displayValue?: never; // Not used in multi-select mode
  multiSelect: true;
  selectedItems: T[]; // Required in multi-select mode
};

// Define props for empty/null value case
type EmptyValueProps<T extends SearchResult> = BaseSearchableSelectProps<T> & {
  value: null | undefined;
  displayValue?: SearchResult; // Optional when value is null/undefined
  multiSelect?: boolean;
  selectedItems?: T[];
};

// Combine these into a union type
export type SearchableSelectProps<T extends SearchResult> =
  | SingleSelectProps<T>
  | MultiSelectProps<T>
  | EmptyValueProps<T>;

export function SearchableSelect<T extends SearchResult>({
  placeholder,
  searchPlaceholder,
  value,
  displayValue,
  onChange,
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
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(
    typeof value === "string" && displayValue ? displayValue : null,
  );

  // Initialize internal state once
  const [internalSelectedItems, setInternalSelectedItems] = useState<T[]>([]);

  const { query, setQuery, results, setResults, isLoading } =
    useDebouncedSearch((q: string) => searchFunction(q, searchParams));

  // Sync internal state with prop only when selectedItems changes
  useEffect(() => {
    setInternalSelectedItems(selectedItems);
  }, [JSON.stringify(selectedItems.map((item) => item.id))]);

  useEffect(() => {
    if (popoverOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [popoverOpen]);

  useEffect(() => {
    if (
      !isLoading &&
      results.length > 0 &&
      multiSelect &&
      internalSelectedItems.length > 0
    ) {
      const filteredResults = results.filter(
        (result) =>
          !internalSelectedItems.some((item) => item.id === result.id),
      );

      // Only update if different to avoid loops
      if (JSON.stringify(filteredResults) !== JSON.stringify(results)) {
        setResults(filteredResults);
      }
    }
  }, [isLoading, JSON.stringify(results.map((r) => r.id))]);

  useEffect(() => {
    if (!multiSelect && !Array.isArray(value) && value) {
      const matchingItem = selectedItems.find((item) => item.id === value);
      if (
        matchingItem &&
        (!selectedItem || selectedItem.id !== matchingItem.id)
      ) {
        setSelectedItem(matchingItem);
      }
    }
  }, [value, multiSelect]);

  const handleItemClick = (item: T) => {
    if (multiSelect) {
      // For multi-select mode, add to array if not already selected
      const valueArray = Array.isArray(value) ? value : [];
      if (!valueArray.includes(item.id)) {
        const newValue = [...valueArray, item.id];
        onChange(newValue);

        // We don't need to update internalSelectedItems here
        // as the parent will update selectedItems prop and our useEffect will handle it
      }
    } else {
      // For single select mode, just set the value
      onChange(item.id);
      setPopoverOpen(false);
      setSelectedItem(item);
    }
    setQuery("");
  };

  const handleRemoveItem = (itemId: string) => {
    if (multiSelect && Array.isArray(value)) {
      const newValue = value.filter((id) => id !== itemId);
      onChange(newValue);

      // Let the parent update the selectedItems prop, which will trigger our useEffect
    }
    if (onItemRemove) {
      onItemRemove(itemId);
    }
  };

  const getButtonText = () => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return placeholder;
    }

    if (multiSelect && internalSelectedItems.length > 0) {
      return `${internalSelectedItems.length} items selected`;
    }

    // Single select mode - find the corresponding selectedItem
    return selectedItem ? selectedItem.display : placeholder;
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
            {getButtonText()}
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

      {multiSelect && internalSelectedItems.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {renderSelectedItems
            ? renderSelectedItems(internalSelectedItems, handleRemoveItem)
            : internalSelectedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-primary-800 hover:bg-primary-900 flex items-center gap-2 rounded-full px-3 py-2 text-sm text-white transition-colors duration-300"
                >
                  <span>{item.display}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-white"
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
