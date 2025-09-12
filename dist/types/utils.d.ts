import { Observable } from 'woby';
import './utils/prototypes';
import './input.css';
import { Country } from './Country';
export declare const scrollTo: (country: HTMLElement, enableSearch: boolean, container?: Observable<HTMLElement> /**dropdownRef */, middle?: boolean) => void;
export declare const scrollToTop: (container: any) => void;
export declare const getProbableCandidate: any;
export declare const getCountryData: (selectedCountry: Country) => {
    name?: undefined;
    dialCode?: undefined;
    countryCode?: undefined;
    format?: undefined;
} | {
    name: string;
    dialCode: string;
    countryCode: string;
    format: string;
};
export declare const guessSelectedCountry: any;
export declare const concatPreferredCountries: (preferredCountries: Country[], onlyCountries: Country[]) => Country[];
export declare const getDropdownCountryName: (country: Country) => string;
export declare const cursorToEnd: (input: any) => void;
//# sourceMappingURL=utils.d.ts.map