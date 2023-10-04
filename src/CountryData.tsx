import { Country } from './Country'
import _rawCountries from './rawCountries'
import _rawTerritories from './rawTerritories'

function getMask(prefix: string, dialCode: string, predefinedMask: string, defaultMask: string, alwaysDefaultMask: boolean): string {
    if (!predefinedMask || alwaysDefaultMask) {
        return prefix + ''.padEnd(dialCode.length, '.') + ' ' + defaultMask
    } else {
        return prefix + ''.padEnd(dialCode.length, '.') + ' ' + predefinedMask
    }
}

function initCountries(
    countries: CountryData[],
    enableAreaCodes: boolean | string[],
    prefix: string,
    defaultMask: string,
    alwaysDefaultMask: boolean
) {
    let hiddenAreaCodes: Country[] = []

    let enableAllCodes: boolean
    if (enableAreaCodes === true) {
        enableAllCodes = true
    } else {
        enableAllCodes = false
    }

    const initializedCountries: Country[] = [].concat(...countries.map((country) => {
        const countryItem: Country = {
            name: country[0],
            regions: country[1],
            iso2: country[2],
            countryCode: country[3],
            dialCode: country[3],
            format: getMask(prefix, country[3], country[4], defaultMask, alwaysDefaultMask),
            priority: country[5] || 0,
            mainCode: undefined,
            hasAreaCodes: undefined,
            isAreaCode: undefined,
            areaCodeLength: undefined
        } as any

        const areaItems: Country[] = []

        country[6] &&
            country[6].map((areaCode) => {
                const areaItem: Country = { ...countryItem }
                areaItem.dialCode = country[3] + areaCode
                areaItem.isAreaCode = true
                areaItem.areaCodeLength = areaCode.length

                areaItems.push(areaItem)
            })

        if (areaItems.length > 0) {
            countryItem.mainCode = true
            if (enableAllCodes || (enableAreaCodes.constructor.name === 'Array' && (enableAreaCodes as string[]).includes(country[2]))) {
                countryItem.hasAreaCodes = true
                return [countryItem, ...areaItems]
            } else {
                hiddenAreaCodes = hiddenAreaCodes.concat(areaItems)
                return [countryItem]
            }
        } else {
            return [countryItem]
        }
    }))

    return [initializedCountries, hiddenAreaCodes]
}

function extendUserContent<T>(userContent: [string[], string[]], contentItemIndex: number, extendingObject: T, firstExtension?: boolean): void {
    if (extendingObject === null) return

    const keys = Object.keys(extendingObject)
    const values = Object.values(extendingObject) as string[]

    keys.forEach((iso2, index) => {
        if (firstExtension) {
            return userContent.push([iso2, values[index]])
        }

        const countryIndex = userContent.findIndex(arr => arr[0] === iso2)
        if (countryIndex === -1) {
            const newUserContent = [iso2]
            newUserContent[contentItemIndex] = values[index]
            userContent.push(newUserContent)
        } else {
            userContent[countryIndex][contentItemIndex] = values[index]
        }
    })
}

function initUserContent(masks: any, priority: number, areaCodes: string): [string[], string[]] {
    let userContent = [] as any as [string[], string[]]
    extendUserContent(userContent, 1, masks, true)
    extendUserContent(userContent, 3, priority)
    extendUserContent(userContent, 2, areaCodes)
    return userContent
}

function extendRawCountries(countries: CountryData[], userContent: [string[], string[]]) {
    if (!userContent.length) return countries

    return countries.map(o => {
        const userContentIndex = userContent.findIndex(arr => arr[0] === o[2])
        if (userContentIndex === -1) return o
        const userContentCountry = userContent[userContentIndex]
        if (userContentCountry[1]) o[4] = userContentCountry[1] // mask
        if (userContentCountry[3]) o[5] = userContentCountry[3] // priority
        if (userContentCountry[2]) o[6] = userContentCountry[2] // areaCodes
        return o
    })
}

export default class CountryData {
    onlyCountries: Country[]
    preferredCountries: Country[]
    hiddenAreaCodes: Country[]

    constructor(
        enableAreaCodes: boolean | string[],
        enableTerritories: boolean | string[],
        public regions: string | string[],
        onlyCountries: Country[],
        preferredCountries: Country[],
        excludeCountries: string[],
        preserveOrder: string[],
        masks: any,
        priority: number,
        areaCodes: string,
        localization: Record<string, string>,
        prefix: string,
        defaultMask: string,
        alwaysDefaultMask: boolean
    ) {
        const userContent = initUserContent(masks, priority, areaCodes)
        const rawCountries = extendRawCountries(JSON.parse(JSON.stringify(_rawCountries)), userContent)
        const rawTerritories = extendRawCountries(JSON.parse(JSON.stringify(_rawTerritories)), userContent)

        let [initializedCountries, hiddenAreaCodes] = initCountries(rawCountries, enableAreaCodes, prefix, defaultMask, alwaysDefaultMask)
        if (enableTerritories) {
            let [initializedTerritories, hiddenAreaCodes] = initCountries(rawTerritories, enableAreaCodes, prefix, defaultMask, alwaysDefaultMask)
            initializedCountries = this.sortTerritories(initializedTerritories, initializedCountries)
        }
        if (regions) initializedCountries = this.filterRegions(regions, initializedCountries)

        this.onlyCountries = this.localizeCountries(
            this.excludeCountries(this.getFilteredCountryList(onlyCountries, initializedCountries, preserveOrder.includes('onlyCountries')),
                excludeCountries),
            localization,
            preserveOrder.includes('onlyCountries')
        )

        this.preferredCountries = preferredCountries.length === 0 ? [] :
            this.localizeCountries(
                this.getFilteredCountryList(preferredCountries, initializedCountries, preserveOrder.includes('preferredCountries')),
                localization,
                preserveOrder.includes('preferredCountries')
            )

        this.hiddenAreaCodes = this.excludeCountries(
            this.getFilteredCountryList(onlyCountries, hiddenAreaCodes),
            excludeCountries
        )
    }

    filterRegions = (regions: string | string[], countries: Country[]): Country[] => {
        if (typeof regions === 'string') {
            const region = regions
            return countries.filter((country) => {
                return country.regions.some((element) => {
                    return element === region
                })
            })
        }

        return countries.filter((country) => {
            const matches = regions.map((region) => {
                return country.regions.some((element) => {
                    return element === region
                })
            })
            return matches.some(el => el)
        })
    };

    sortTerritories = (initializedTerritories: Country[], initializedCountries: Country[]): Country[] => {
        const fullCountryList = [...initializedTerritories, ...initializedCountries]
        fullCountryList.sort(function (a, b) {
            if (a.name < b.name) { return -1 }
            if (a.name > b.name) { return 1 }
            return 0
        })
        return fullCountryList
    };

    getFilteredCountryList = (countryCodes: Country[], sourceCountryList: Country[], preserveOrder?: boolean) => {
        if (countryCodes.length === 0) return sourceCountryList

        let filteredCountries: Country[]
        if (preserveOrder) {
            filteredCountries = countryCodes.map(countryCode => {
                const country = sourceCountryList.find(country => country.iso2 === countryCode)
                if (country) return country
            }).filter(country => country)
        } else {
            filteredCountries = sourceCountryList.filter((country) => {
                return countryCodes.some((element) => {
                    return element === country.iso2
                })
            })
        }

        return filteredCountries
    };

    localizeCountries = (countries: Country[], localization: Record<string, string>, preserveOrder?: boolean) => {
        for (let i = 0; i < countries.length; i++) {
            if (localization[countries[i].iso2] !== undefined) {
                countries[i].localName = localization[countries[i].iso2]
            } else if (localization[countries[i].name] !== undefined) {
                countries[i].localName = localization[countries[i].name]
            }
        }
        if (!preserveOrder) {
            countries.sort(function (a, b) {
                if (a.localName < b.localName) { return -1 }
                if (a.localName > b.localName) { return 1 }
                return 0
            })
        }
        return countries
    };

    getCustomAreas = (country: Country, areaCodes: string[]) => {
        let customAreas: Country[] = []
        for (let i = 0; i < areaCodes.length; i++) {
            let newCountry: Country = JSON.parse(JSON.stringify(country))
            newCountry.dialCode += areaCodes[i]
            customAreas.push(newCountry)
        }
        return customAreas
    };

    excludeCountries = (onlyCountries: Country[], excludedCountries: string[]) => {
        if (excludedCountries.length === 0) {
            return onlyCountries
        } else {
            return onlyCountries.filter((country) => {
                return !excludedCountries.includes(country.iso2)
            })
        }
    };
}
