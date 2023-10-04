import { $, $$, Observable, CSSProperties, type JSX, useEffect, ObservableMaybe } from 'voby'
import debounce from 'lodash.debounce'
import memoize from 'lodash.memoize'
import reduce from 'lodash.reduce'
import startsWith from 'lodash.startswith'
import './utils/prototypes'
import '../dist/output.css'
import { flag as fg } from './high-res-flags'
import CountryData from './CountryData.js'
import { Country } from './Country'

// View methods
export const scrollTo = (country: HTMLElement, enableSearch: boolean, container?: Observable<HTMLElement> /**dropdownRef */, middle?: boolean,) => {
    if (!country) return
    // const container = $$(dropdownRef)
    if (!container || !document.body) return

    const containerHeight = $$(container).offsetHeight
    const containerOffset = $$(container).getBoundingClientRect()
    const containerTop = containerOffset.top + document.body.scrollTop
    const containerBottom = containerTop + containerHeight

    const element = country
    const elementOffset = element.getBoundingClientRect()

    const elementHeight = element.offsetHeight
    const elementTop = elementOffset.top + document.body.scrollTop
    const elementBottom = elementTop + elementHeight

    let newScrollTop = elementTop - containerTop + $$(container).scrollTop
    const middleOffset = (containerHeight / 2) - (elementHeight / 2)

    if (enableSearch ? elementTop < containerTop + 32 : elementTop < containerTop) {
        // scroll up
        if (middle) {
            newScrollTop -= middleOffset
        }
        $$(container).scrollTop = newScrollTop
    }
    else if (elementBottom > containerBottom) {
        // scroll down
        if (middle) {
            newScrollTop += middleOffset
        }
        const heightDifference = containerHeight - elementHeight
        $$(container).scrollTop = newScrollTop - heightDifference
    }
}

export const scrollToTop = (container) => {
    // const container = $$(dropdownRef)
    if (!container || !document.body) return
    container.scrollTop = 0
}
export const getProbableCandidate = memoize((queryString: string, onlyCountries: Country[]) => {
    if (!queryString || queryString.length === 0) {
        return null
    }
    // don't include the preferred countries in search
    const probableCountries = $$(onlyCountries).filter((country: Country) => {
        return startsWith(country.name.toLowerCase(), queryString.toLowerCase())
    }, this)
    return probableCountries[0]
})


// return country data from state
export const getCountryData = (selectedCountry: Country) => {
    if (!selectedCountry) return {}
    return {
        name: selectedCountry.name || '',
        dialCode: selectedCountry.dialCode || '',
        countryCode: selectedCountry.iso2 || '',
        format: selectedCountry.format || ''
    }
}

// if enableAreaCodes == false, try to search in hidden area codes to detect area code correctly
export const guessSelectedCountry = memoize((inputNumber, country: Country, onlyCountries: Country[], hiddenAreaCodes, enableAreaCodes, THIS: any): Country => {
    // then search and insert main country which has this area code
    // https://github.com/bl00mber/voby-phone-input-2/issues/201
    if (enableAreaCodes === false) {
        let mainCode
        $$(hiddenAreaCodes).some(country => {
            if (startsWith(inputNumber, country.dialCode)) {
                $$(onlyCountries).some(o => {
                    if (country.iso2 === o.iso2 && o.mainCode) {
                        mainCode = o
                        return true
                    }
                })
                return true
            }
        })
        if (mainCode) return mainCode
    }

    const secondBestGuess = $$(onlyCountries).find(o => o.iso2 == country)
    if (inputNumber.trim() === '') return secondBestGuess

    const bestGuess = onlyCountries.reduce(
        (selectedCountry, country) => {
            if (startsWith(inputNumber, country.dialCode)) {
                if (country.dialCode.length > selectedCountry.dialCode.length) {
                    return country
                }
                if (
                    country.dialCode.length === selectedCountry.dialCode.length &&
                    country.priority < selectedCountry.priority
                ) {
                    return country
                }
            }
            return selectedCountry
        },
        { dialCode: "", priority: 10001 },
        /* THIS */)

    if (!bestGuess.name) return secondBestGuess
    return bestGuess
})

export const concatPreferredCountries = (preferredCountries: Country[], onlyCountries: Country[]) => {
    if (preferredCountries.length > 0) { return [...new Set(preferredCountries.concat(onlyCountries))] }
    else { return onlyCountries }
}

export const getDropdownCountryName = (country: Country) => {
    return country.localName || country.name
}

// Put the cursor to the end of the input (usually after a focus event)
export const cursorToEnd = (input) => {
    // const input = $$(numberInputRef)
    if (document.activeElement !== input) return
    input.focus()
    let len = input.value.length
    if (input.value.charAt(len - 1) === ')') len = len - 1
    input.setSelectionRange(len, len)
}

