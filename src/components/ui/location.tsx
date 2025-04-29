import { useEffect, useState } from "react";
import Axios from "axios";
import Select from "react-select";

interface LocationProps {
  className?: string;
  onCountryChange?: (country: string) => void;
  onCityChange?: (city: string) => void;
  initialCountry?: string;
  initialCity?: string;
}

const Location: React.FC<LocationProps> = ({
  className,
  onCountryChange,
  onCityChange,
  initialCountry,
  initialCity,
}) => {
  interface Country {
    country: string;
    cities: string[];
  }

  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{
    label: string;
    value: string;
  } | null>(null);

  // Fetch countries from API
  const fetchCountries = async () => {
    try {
      const response = await Axios.get(
        "https://countriesnow.space/api/v0.1/countries"
      );
      setCountries(response.data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Fetch cities for a given country
  const fetchCities = (countryName: string) => {
    const country = countries.find((c) => c.country === countryName);
    if (country) {
      setCities(country.cities);
    } else {
      setCities([]);
    }
  };

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Update selected country and city when props change
  useEffect(() => {
    if (countries.length > 0 && initialCountry) {
      const countryOption = {
        label: initialCountry,
        value: initialCountry,
      };

      // Only update if changed
      if (!selectedCountry || selectedCountry.value !== initialCountry) {
        setSelectedCountry(countryOption);
        fetchCities(initialCountry);
        onCountryChange?.(initialCountry);
      }
    }
  }, [initialCountry, countries]);

  // Update city when cities list or initialCity changes
  useEffect(() => {
    if (cities.length > 0 && initialCity) {
      const cityOption = {
        label: initialCity,
        value: initialCity,
      };

      // Only update if changed
      if (!selectedCity || selectedCity.value !== initialCity) {
        setSelectedCity(cityOption);
        onCityChange?.(initialCity);
      }
    }
  }, [initialCity, cities]);

  // Handle country change by user
  const handleCountryChange = (
    selectedOption: { label: string; value: string } | null
  ) => {
    setSelectedCountry(selectedOption);
    setSelectedCity(null);
    if (selectedOption) {
      fetchCities(selectedOption.value);
    }
    if (selectedOption) {
      onCountryChange?.(selectedOption.value);
    }
  };

  // Handle city change by user
  const handleCityChange = (
    selectedOption: { label: string; value: string } | null
  ) => {
    setSelectedCity(selectedOption);
    if (selectedOption) {
      onCityChange?.(selectedOption.value);
    }
  };

  // Prepare react-select options
  const countryOptions = countries.map((country) => ({
    label: country.country,
    value: country.country,
  }));

  const cityOptions = cities.map((city) => ({
    label: city,
    value: city,
  }));

  return (
    <div className={`flex space-x-4 ${className}`}>
      <div className="w-1/2">
        <Select
          options={countryOptions}
          value={selectedCountry}
          onChange={handleCountryChange}
          placeholder="Select a country"
          className="text-xs placeholder:text-xs"
          classNamePrefix="react-select"
        />
      </div>
      <div className="w-1/2">
        <Select
          options={cityOptions}
          value={selectedCity}
          onChange={handleCityChange}
          placeholder="Select a city"
          className="text-xs placeholder:text-xs"
          classNamePrefix="react-select"
          isDisabled={!selectedCountry}
        />
      </div>
    </div>
  );
};

export default Location;
