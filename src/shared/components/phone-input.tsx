import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/shared/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command";
import { Input } from "@/shared/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { cn } from "@/shared/lib/utils";

type PhoneInputProps = Omit<
    React.ComponentProps<"input">,
    "onChange" | "value" | "ref"
> &
    Omit<React.ComponentProps<typeof RPNInput.default>, "onChange"> & {
        onChange?: (value: RPNInput.Value) => void;
    };

const PhoneInput = React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, ...props }, ref) => {
        return (
            <RPNInput.default
                className={cn("flex", className)}
                flagComponent={FlagComponent}
                countrySelectComponent={CountrySelect}
                inputComponent={InputComponent}
                smartCaret={false}
                countryCallingCodeEditable={false}
                ref={ref}
                initialValueFormat="national"
                defaultCountry="EG"
                /**
                 * Handles the onChange event.
                 *
                 * react-phone-number-input might trigger the onChange event as undefined
                 * when a valid phone number is not entered. To prevent this,
                 * the value is coerced to an empty string.
                 *
                 * @param {RFC3966 | undefined} value - The entered value
                 */
                onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
                {...props}
            />
        );
    },
);
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
    <Input
        className={cn("border border-gray-200 focus-visible:ring", className)}
        {...props}
        ref={ref}
        placeholder="1012345678"
    />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
    disabled?: boolean;
    value: RPNInput.Country;
    options: CountryEntry[];
    onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
    disabled,
    value: selectedCountry,
    options: countryList,
    onChange,
}: CountrySelectProps) => {
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const [searchValue, setSearchValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Popover
            open={isOpen}
            modal
            onOpenChange={(open) => {
                setIsOpen(open);
                if (open) {
                    setSearchValue("");
                }
            }}
        >
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="default"
                    className="flex gap-1 border-gray-200 px-2 bg-accent hover:bg-accent"
                    disabled={disabled}
                >
                    <FlagComponent
                        country={selectedCountry}
                        countryName={selectedCountry}
                    />
                    <span className="text-sm text-muted-foreground">
                        {selectedCountry ? `${selectedCountry} (+${RPNInput.getCountryCallingCode(selectedCountry)})` : ""}
                    </span>
                    <ChevronsUpDown
                        className={cn(
                            "size-4 opacity-50",
                            disabled ? "hidden" : "opacity-100",
                        )}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 bg-gray-200" align="start">
                <Command>
                    <CommandInput
                        value={searchValue}
                        onValueChange={(value) => {
                            setSearchValue(value);
                            setTimeout(() => {
                                if (scrollAreaRef.current) {
                                    const viewportElement = scrollAreaRef.current.querySelector(
                                        "[data-radix-scroll-area-viewport]",
                                    );
                                    if (viewportElement) {
                                        viewportElement.scrollTop = 0;
                                    }
                                }
                            }, 0);
                        }}
                        placeholder="Search country..."
                    />
                    <CommandList>
                        <ScrollArea ref={scrollAreaRef} className="h-72">
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {countryList.map(({ value, label }) =>
                                    value ? (
                                        <CountrySelectOption
                                            key={value}
                                            country={value}
                                            countryName={label}
                                            selectedCountry={selectedCountry}
                                            onChange={onChange}
                                            onSelectComplete={() => setIsOpen(false)}
                                        />
                                    ) : null,
                                )}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
    selectedCountry: RPNInput.Country;
    onChange: (country: RPNInput.Country) => void;
    onSelectComplete: () => void;
}

const CountrySelectOption = ({
    country,
    countryName,
    selectedCountry,
    onChange,
    onSelectComplete,
}: CountrySelectOptionProps) => {
    const handleSelect = () => {
        onChange(country);
        onSelectComplete();
    };

    return (
        <CommandItem className="gap-2" onSelect={handleSelect}>
            <FlagComponent country={country} countryName={countryName} />
            <span className="flex-1 text-sm">{countryName}</span>
            <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
            <CheckIcon
                className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
            />
        </CommandItem>
    );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
    const Flag = flags[country];

    return (
        <span className="flex w-5.75 h-4 overflow-hidden bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
            {Flag && <Flag title={countryName} />}
        </span>
    );
};

export { PhoneInput };