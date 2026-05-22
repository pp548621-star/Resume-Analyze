import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  // Custom variants simplified
  let variantClasses = ""
  if (variant === "default") variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"
  if (variant === "outline") variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  if (variant === "ghost") variantClasses = "hover:bg-accent hover:text-accent-foreground"
  
  let sizeClasses = ""
  if (size === "default") sizeClasses = "h-10 px-4 py-2"
  if (size === "sm") sizeClasses = "h-9 rounded-md px-3"
  if (size === "lg") sizeClasses = "h-11 rounded-md px-8"
  if (size === "icon") sizeClasses = "h-10 w-10"

  return (
    <Comp
      className={cn(buttonVariants, variantClasses, sizeClasses, className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
