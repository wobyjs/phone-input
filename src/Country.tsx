
export interface Country {
    name?: string
    format?: string
    isAreaCode?: boolean
    areaCodeLength?: number
    iso2?: string
    dialCode?: string
    mainCode?: Country | boolean
    hasAreaCodes?: boolean
    localName?: string
    priority?: number
    regions?: string[]
    // Add other properties as needed
}
