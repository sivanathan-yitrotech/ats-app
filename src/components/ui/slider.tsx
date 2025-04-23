import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  // Ensure that value and defaultValue are both arrays of length 2 (from and to)
  const _values = React.useMemo(
    () => 
      Array.isArray(value)
        ? value.length === 2
          ? value
          : [min, max]
        : Array.isArray(defaultValue)
        ? defaultValue.length === 2
          ? defaultValue
          : [min, max]
        : [min, max],
    [value, defaultValue, min, max]
  )

  // Update the range based on the 'from' and 'to' values
  const [from, to] = _values

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={_values}
      onValueChange={(newValues) => {
        // Update the value whenever either thumb is moved
        if (Array.isArray(newValues) && newValues.length === 2) {
          // Pass back the updated values to parent
          if (props.onValueChange) {
            props.onValueChange(newValues)
          }
        }
      }}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            {
              "left-[0%]": from === min,
              "right-[100%]": to === max,
            }
          )}
          style={{
            left: `${((from - min) / (max - min)) * 100}%`,
            width: `${((to - from) / (max - min)) * 100}%`,
          }}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: 2 }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          style={{
            left: `${((index === 0 ? from : to) - min) / (max - min) * 100}%`,
          }}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
