import { Country } from './Country';
export default class CountryData {
    regions: string | string[];
    onlyCountries: Country[];
    preferredCountries: Country[];
    hiddenAreaCodes: Country[];
    constructor(enableAreaCodes: boolean | string[], enableTerritories: boolean | string[], regions: string | string[], onlyCountries: Country[], preferredCountries: Country[], excludeCountries: string[], preserveOrder: string[], masks: any, priority: number, areaCodes: string, localization: Record<string, string>, prefix: string, defaultMask: string, alwaysDefaultMask: boolean);
    filterRegions: (regions: string | string[], countries: Country[]) => Country[];
    sortTerritories: (initializedTerritories: Country[], initializedCountries: Country[]) => Country[];
    getFilteredCountryList: (countryCodes: Country[], sourceCountryList: Country[], preserveOrder?: boolean) => Country[];
    localizeCountries: (countries: Country[], localization: Record<string, string>, preserveOrder?: boolean) => Country[];
    getCustomAreas: (country: Country, areaCodes: string[]) => Country[];
    excludeCountries: (onlyCountries: Country[], excludedCountries: string[]) => Country[];
}
