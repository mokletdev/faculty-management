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
  initialSelectedItems?: T[]; // Add initialSelectedItems for initialization
};

type SingleSelectProps<T extends SearchResult> =
  BaseSearchableSelectProps<T> & {
    value: string;
    displayValue?: SearchResult; // Required when value is a string
    multiSelect?: false;
  };

type MultiSelectProps<T extends SearchResult> = BaseSearchableSelectProps<T> & {
  value: string[];
  displayValue?: never; // Not used in multi-select mode
  multiSelect: true;
};

type EmptyValueProps<T extends SearchResult> = BaseSearchableSelectProps<T> & {
  value: null | undefined;
  displayValue?: SearchResult; // Optional when value is null/undefined
  multiSelect?: boolean;
};

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
  initialSelectedItems = [], // Use initialSelectedItems instead of selectedItems
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

  // Store selected items internally
  const [internalSelectedItems, setInternalSelectedItems] =
    useState<T[]>(initialSelectedItems);

  const { query, setQuery, results, setResults, isLoading } =
    useDebouncedSearch((q: string) => searchFunction(q, searchParams));

  // Initialize from value on mount and when initialSelectedItems changes
  useEffect(() => {
    if (multiSelect && Array.isArray(value)) {
      // Map initialSelectedItems to the current value array
      const initialItems = initialSelectedItems.filter(
        (item) => Array.isArray(value) && value.includes(item.id),
      );
      setInternalSelectedItems(initialItems);
    }
  }, []);

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
      const matchingItem = internalSelectedItems.find(
        (item) => item.id === value,
      );
      if (
        matchingItem &&
        (!selectedItem || selectedItem.id !== matchingItem.id)
      ) {
        setSelectedItem(matchingItem);
      } else if (
        displayValue &&
        (!selectedItem || selectedItem.id !== displayValue.id)
      ) {
        setSelectedItem(displayValue);
      }
    }
  }, [value, multiSelect, displayValue]);

  // Sync value changes with internal state for multi-select
  useEffect(() => {
    if (multiSelect && Array.isArray(value)) {
      // Keep selected items in sync with value
      const validItems = internalSelectedItems.filter((item) =>
        value.includes(item.id),
      );

      // Check if we need to update (avoid infinite loop)
      if (validItems.length !== internalSelectedItems.length) {
        setInternalSelectedItems(validItems);
      }
    }
  }, [value, multiSelect]);

  const handleItemClick = (item: T) => {
    if (multiSelect) {
      // For multi-select mode, add to array if not already selected
      const valueArray = Array.isArray(value) ? value : [];
      if (!valueArray.includes(item.id)) {
        const newValue = [...valueArray, item.id];

        // Update both the parent value and our internal state
        onChange(newValue);
        setInternalSelectedItems([...internalSelectedItems, item]);
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

      // Update internal state
      setInternalSelectedItems(
        internalSelectedItems.filter((item) => item.id !== itemId),
      );
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

  // Function to handle fetching and adding an item when we only have its ID
  const addItemById = async (id: string) => {
    try {
      // Use searchFunction to find the item
      const items = await searchFunction("", { ...searchParams, id });
      const item = items.find((i) => i.id === id);

      if (item && !internalSelectedItems.some((si) => si.id === id)) {
        setInternalSelectedItems([...internalSelectedItems, item]);
      }
    } catch (error) {
      console.error("Failed to fetch item details:", error);
    }
  };

  // When value changes and we don't have the corresponding items, fetch them
  useEffect(() => {
    if (multiSelect && Array.isArray(value) && value.length > 0) {
      const missingIds = value.filter(
        (id) => !internalSelectedItems.some((item) => item.id === id),
      );

      // Fetch missing items
      missingIds.forEach((id) => addItemById(id));
    }
  }, [value]);

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
