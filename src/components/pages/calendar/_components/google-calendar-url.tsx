"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { useState, type FC } from "react";

export const GoogleCalendarLink: FC<{ calendarLink: string }> = ({
  calendarLink,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(calendarLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenInGoogle = () => {
    window.open(calendarLink, "_blank");
  };

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Google Calendar</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tambahkan ke Google Calendar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">
              Integrasi Google Calendar
            </h4>
            <p className="text-muted-foreground text-sm">
              Tambahkan agenda-agenda di kalender ini ke Google Calendar anda
              untuk tetap terhubung dengan FEMS.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Input readOnly value={calendarLink} className="text-xs" />
            <Button size="icon" variant="outline" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Button onClick={handleOpenInGoogle} className="w-full gap-2">
            <ExternalLink className="h-4 w-4" />
            Open in Google Calendar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
