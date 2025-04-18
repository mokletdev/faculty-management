import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import type { ElementType } from "react";

const typographyVariants = cva("", {
  variants: {
    variant: {
      // Display styles
      display1: "text-7xl font-bold tracking-tight",

      // Heading styles
      h1: "text-4xl font-bold tracking-tight",
      h2: "text-4xl font-semibold tracking-tight",
      h3: "text-2xl font-semibold tracking-tight",
      h4: "text-xl font-semibold tracking-tight",
      h5: "text-lg font-semibold tracking-tight",
      h6: "text-base font-semibold tracking-tight",

      // Body text styles
      "body-xl": "text-xl leading-relaxed",
      "body-lg": "text-lg leading-relaxed",
      "body-base": "text-base leading-relaxed",
      "body-sm": "text-sm leading-relaxed",
      "body-xs": "text-xs leading-relaxed",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "body-base",
    color: "default",
    weight: "regular",
  },
});

type TypographyVariants = VariantProps<typeof typographyVariants>;

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof TypographyVariants>,
    TypographyVariants {
  asChild?: boolean;
  as?: ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      className,
      variant,
      color,
      weight,
      asChild = false,
      as: Tag = "p",
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : Tag;

    return (
      <Comp
        className={cn(
          typographyVariants({ variant, color, weight, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Typography.displayName = "Typography";

// Preset components for common use cases
export function Display1(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="display1" {...props} />;
}

export function H1(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h1" {...props} />;
}

export function H2(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h2" {...props} />;
}

export function H3(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h3" {...props} />;
}

export function H4(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h4" {...props} />;
}

export function H5(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h5" {...props} />;
}

export function H6(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="h6" {...props} />;
}

export function BodyXL(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="body-xl" {...props} />;
}

export function BodyLG(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="body-lg" {...props} />;
}

export function BodyBase(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="body-base" {...props} />;
}

export function BodySM(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="body-sm" {...props} />;
}

export function BodyXS(props: Omit<TypographyProps, "variant">) {
  return <Typography variant="body-xs" {...props} />;
}

export { Typography, typographyVariants };
