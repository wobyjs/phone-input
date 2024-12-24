import { $, $$, Observable, CSSProperties, type JSX, useEffect, ObservableMaybe, isObservable } from 'woby'
import debounce from 'lodash.debounce'
import memoize from 'lodash.memoize'
import reduce from 'lodash.reduce'
import startsWith from 'lodash.startswith'
import './utils/prototypes'
import '../dist/output.css'
import { flag as fg } from './high-res-flags'
import CountryData from './CountryData.js'
import { Country } from './Country'
import { getCountryData, guessSelectedCountry, getProbableCandidate, concatPreferredCountries, scrollTo, cursorToEnd, scrollToTop, getDropdownCountryName } from './utils'



interface PhoneInputProps {
    country?: ObservableMaybe<string | number>
    value?: Observable<string>
    onlyCountries?: Observable<Country[]>
    preferredCountries?: Observable<Country[]>
    excludeCountries?: ObservableMaybe<string[]>
    placeholder?: ObservableMaybe<string>
    searchPlaceholder?: ObservableMaybe<string>
    searchNotFound?: ObservableMaybe<string>
    disabled?: ObservableMaybe<boolean>
    containerStyle?: ObservableMaybe<CSSProperties>
    inputStyle?: ObservableMaybe<CSSProperties>
    buttonStyle?: ObservableMaybe<CSSProperties>
    dropdownStyle?: ObservableMaybe<CSSProperties>
    searchStyle?: ObservableMaybe<CSSProperties>
    containerClass?: ObservableMaybe<string>
    inputClass?: ObservableMaybe<string>
    buttonClass?: ObservableMaybe<string>
    dropdownClass?: ObservableMaybe<string>
    searchClass?: ObservableMaybe<string>
    className?: ObservableMaybe<string>
    autoFormat?: ObservableMaybe<boolean>
    enableAreaCodes?: ObservableMaybe<boolean | string[]>
    enableTerritories?: ObservableMaybe<boolean | string[]>
    disableCountryCode?: ObservableMaybe<boolean>
    disableDropdown?: ObservableMaybe<boolean>
    enableLongNumbers?: ObservableMaybe<boolean | number>
    countryCodeEditable?: ObservableMaybe<boolean>
    enableSearch?: ObservableMaybe<boolean>
    disableSearchIcon?: ObservableMaybe<boolean>
    disableInitialCountryGuess?: ObservableMaybe<boolean>
    disableCountryGuess?: ObservableMaybe<boolean>
    regions?: ObservableMaybe<string | string[]>
    inputProps?: ObservableMaybe<{ ref?: JSX.Ref }>
    localization?: ObservableMaybe<Record<string, string>>
    masks?: ObservableMaybe<object>
    areaCodes?: ObservableMaybe<string>
    preserveOrder?: ObservableMaybe<string[]>
    defaultMask?: ObservableMaybe<string>
    alwaysDefaultMask?: ObservableMaybe<boolean>
    prefix?: Observable<string>
    copyNumbersOnly?: ObservableMaybe<boolean>
    renderStringAsFlag?: ObservableMaybe<string>
    autocompleteSearch?: ObservableMaybe<boolean>
    jumpCursorToEnd?: ObservableMaybe<boolean>
    priority?: ObservableMaybe<number>
    enableAreaCodeStretch?: ObservableMaybe<boolean>
    enableClickOutside?: ObservableMaybe<boolean>
    showDropdown?: ObservableMaybe<boolean>
    onChange?: (formattedNumber: string, country: ReturnType<typeof getCountryData>, num: string) => void
    onFocus?: (...args: any[]) => void
    onBlur?: (...args: any[]) => void
    onClick?: (...args: any[]) => void
    onKeyDown?: (...args: any[]) => void
    onEnterKeyPress?: (...args: any[]) => void
    onMount?: (formattedNumber: string, countryData: any, fullNumber: string) => void
    isValid?: ObservableMaybe<boolean> | ((value: string, selectedCountry: Country, onlyCountries: Country[], hiddenAreaCodes: string[]) => boolean | string)
    defaultErrorMessage?: ObservableMaybe<string>
    specialLabel?: ObservableMaybe<string>
    style?: JSX.Style
}

export const PhoneInput = (propertis: PhoneInputProps) => {
    const props = {
        country: $(''),
        value: $(''),

        onlyCountries: $([]),
        preferredCountries: $([]),
        excludeCountries: $([]),

        placeholder: $('1 (702) 123-4567'),
        searchPlaceholder: $('search'),
        searchNotFound: $('No entries to show'),
        flagsImagePath: $('./flags.png'),
        disabled: $(false),

        containerStyle: $({}),
        inputStyle: $({}),
        buttonStyle: $({}),
        dropdownStyle: $({}),
        searchStyle: $({}),

        containerClass: $(''),
        inputClass: $<string>(null),
        buttonClass: $<string>(null),
        dropdownClass: $<string>(null),
        searchClass: $<string>(null),
        className: $<string>(null),

        autoFormat: $(true),
        enableAreaCodes: $(false),
        enableTerritories: $(false),
        disableCountryCode: $(false),
        disableDropdown: $(false),
        enableLongNumbers: $(false),
        countryCodeEditable: $(true),
        enableSearch: $(false),
        disableSearchIcon: $(false),
        disableInitialCountryGuess: $(false),
        disableCountryGuess: $(false),

        regions: $(''),

        inputProps: $({}),
        localization: $({}),

        masks: $(null),
        priority: $(null),
        areaCodes: $(null),

        preserveOrder: $([]),

        defaultMask: $('... ... ... ... ..'), // prefix+dialCode+' '+defaultMask
        alwaysDefaultMask: $(false),
        prefix: $('+'),
        copyNumbersOnly: $(true),
        renderStringAsFlag: $(''),
        autocompleteSearch: $(false),
        jumpCursorToEnd: $(true),
        enableAreaCodeStretch: $(false),
        enableClickOutside: $(true),
        showDropdown: $(false),

        isValid: $(true), // (value, $$(selectedCountry), $$(onlyCountries), hiddenAreaCodes) => true | false | 'Message'
        defaultErrorMessage: $(''),
        specialLabel: $('Phone'),

        onEnterKeyPress: null, // null or function
        ...propertis
    } as PhoneInputProps

    const keys = {
        UP: 38, DOWN: 40, RIGHT: 39, LEFT: 37, ENTER: 13,
        ESC: 27, PLUS: 43, A: 65, Z: 90, SPACE: 32, TAB: 9,
    }

    const showDropdown = isObservable(props.showDropdown) ? props.showDropdown : $(props.showDropdown)
    const formattedNumber = $('')
    // const onlyCountries = $<Country[]>([])
    // const preferredCountries = $<Country[]>([])
    const hiddenAreaCodes = $([])
    const selectedCountry = $<Country>(null)
    const highlightCountryIndex = $<string | number>(null)
    const queryString = $('')
    const freezeSelection = $(false)
    const searchValue = $('')
    const debouncedQueryStingSearcher = $()

    const dropdownRef = $<HTMLElement>(null)
    const numberInputRef = $<HTMLInputElement>(null)
    const dropdownContainerRef = $<HTMLDivElement>(null)
    const countryGuess = $<string | number | Country>()
    const placeholder = $('')
    const THIS: Record<string, HTMLElement> = {}

    const { disableDropdown, renderStringAsFlag, isValid, defaultErrorMessage, specialLabel,
        disableCountryCode, enableAreaCodeStretch, enableLongNumbers, autoFormat, country, prefix, enableAreaCodes,
        enableTerritories, regions, onlyCountries, preferredCountries, excludeCountries, preserveOrder, masks, priority, areaCodes,
        localization, defaultMask, alwaysDefaultMask, enableSearch,
        searchNotFound, disableSearchIcon, searchClass, searchStyle, searchPlaceholder, autocompleteSearch,
        onChange, onEnterKeyPress, onKeyDown } = props

    const { onlyCountries: oc, preferredCountries: pc, hiddenAreaCodes: ha } = new CountryData(
        $$(enableAreaCodes), $$(enableTerritories), $$(regions),
        $$(onlyCountries), $$(preferredCountries), $$(excludeCountries), $$(preserveOrder),
        $$(masks), $$(priority), $$(areaCodes), $$(localization),
        $$(prefix), $$(defaultMask), $$(alwaysDefaultMask),
    )

    onlyCountries(oc)
    preferredCountries(pc)
    hiddenAreaCodes(ha)

    const inputNumber = $$(props.value) ? $$(props.value).replace(/\D/g, '') : ''

    if ($$(props.disableInitialCountryGuess)) {
        countryGuess(0)
    } else if (inputNumber.length > 1) {
        // Country detect by phone
        countryGuess(guessSelectedCountry(inputNumber.substring(0, 6), $$(props.country), $$(onlyCountries), $$(hiddenAreaCodes), $$(props.enableAreaCodes), THIS) || 0)
    } else if ($$(props.country)) {
        // Default country
        countryGuess($$(onlyCountries).find(o => o.iso2 == $$(props.country)) || 0)
    } else {
        // Empty params
        countryGuess(0)
    }

    const dialCode = (
        inputNumber.length < 2 &&
        $$(countryGuess) &&
        !startsWith(inputNumber, ($$(countryGuess) as Country).dialCode)
    ) ? ($$(countryGuess) as Country).dialCode : ''


    const formatNumber = (text, country: Country,) => {
        if (!country) return text

        const { format } = country

        let pattern
        if ($$(disableCountryCode)) {
            pattern = format.split(' ')
            pattern.shift()
            pattern = pattern.join(' ')
        } else {
            if ($$(enableAreaCodeStretch) && country.isAreaCode) {
                pattern = format.split(' ')
                pattern[1] = pattern[1].replace(/\.+/, ''.padEnd(country.areaCodeLength, '.'))
                pattern = pattern.join(' ')
            } else {
                pattern = format
            }
        }

        if (!text || text.length === 0) {
            return $$(disableCountryCode) ? '' : $$(props.prefix)
        }

        // for all strings with length less than 3, just return it (1, 2 etc.)
        // also return the same text if the selected country has no fixed format
        if ((text && text.length < 2) || !pattern || !$$(autoFormat)) {
            return $$(disableCountryCode) ? text : $$(props.prefix) + text
        }

        const formattedObject = reduce(pattern, (acc, character) => {
            if (acc.remainingText.length === 0) {
                return acc
            }

            if (character !== '.') {
                return {
                    formattedText: acc.formattedText + character,
                    remainingText: acc.remainingText
                }
            }

            const [head, ...tail] = acc.remainingText

            return {
                formattedText: acc.formattedText + head,
                remainingText: tail
            }
        }, {
            formattedText: '',
            remainingText: text.split('')
        })

        let formattedNumber_
        if ($$(enableLongNumbers)) {
            formattedNumber_ = formattedObject.formattedText + formattedObject.remainingText.join('')
        } else {
            formattedNumber_ = formattedObject.formattedText
        }

        // Always close brackets
        if (formattedNumber_.includes('(') && !formattedNumber_.includes(')')) formattedNumber_ += ')'
        return formattedNumber_
    }

    formattedNumber((inputNumber === '' && $$(countryGuess) === 0) ? '' :
        formatNumber(
            ($$(props.disableCountryCode) ? '' : dialCode) + inputNumber,
            ($$(countryGuess) as Country).name ? ($$(countryGuess) as Country) : undefined
        )
    )


    const searchCountry = () => {
        const probableCandidate = getProbableCandidate($$(queryString), $$(onlyCountries)) || $$(onlyCountries)[0]
        const probableCandidateIndex = $$(onlyCountries).findIndex(o => o == probableCandidate) + $$(preferredCountries).length

        scrollTo(getElement(probableCandidateIndex), $$(props.enableSearch), dropdownRef, true)

        queryString('')
        highlightCountryIndex(probableCandidateIndex)
    }


    highlightCountryIndex($$(onlyCountries).findIndex(o => o == $$(countryGuess)))

    // showDropdown($$(props.showDropdown))

    selectedCountry($$(countryGuess) as Country)

    queryString('')
    freezeSelection(false)
    debouncedQueryStingSearcher(debounce(searchCountry, 250))
    searchValue('')



    // Hooks for updated props
    const updateCountry = (country) => {
        let newSelectedCountry
        if (country.indexOf(0) >= '0' && country.indexOf(0) <= '9') { // digit
            newSelectedCountry = $$(onlyCountries).find(o => +o.dialCode == +country)
        } else {
            newSelectedCountry = $$(onlyCountries).find(o => o.iso2 == country)
        }
        if (newSelectedCountry && newSelectedCountry.dialCode) {
            selectedCountry(newSelectedCountry)
            formattedNumber($$(props.disableCountryCode) ? '' : formatNumber(newSelectedCountry.dialCode, newSelectedCountry))
        }
    }

    function updateFormattedNumber(value: Observable<string>) {
        if (!$$(value)) {
            selectedCountry(null)
            formattedNumber('')
            return
        }


        if ($$(value) === '') { formattedNumber(''); return }

        let inputNumber = $$(value).replace(/\D/g, '')
        let newSelectedCountry

        // if new value start with selectedCountry.dialCode, format number, otherwise find newSelectedCountry
        if ($$(selectedCountry) && startsWith($$(value), $$(prefix) + $$(selectedCountry).dialCode)) {
            formattedNumber(formatNumber(inputNumber, $$(selectedCountry)))
        }
        else {
            if ($$(props.disableCountryGuess)) { newSelectedCountry = $$(selectedCountry) }
            else {
                newSelectedCountry = guessSelectedCountry(inputNumber.substring(0, 6), $$(country), $$(onlyCountries), $$(hiddenAreaCodes), $$(props.enableAreaCodes), THIS) || $$(selectedCountry)
            }
            const dialCode = newSelectedCountry && startsWith(inputNumber, $$(prefix) + newSelectedCountry.dialCode) ? newSelectedCountry.dialCode : ''

            formattedNumber(formatNumber(
                ($$(props.disableCountryCode) ? '' : dialCode) + inputNumber,
                newSelectedCountry ? (newSelectedCountry) : undefined
            ))
            selectedCountry(newSelectedCountry)
        }
    }



    const getElement = (index) => {
        return THIS[`flag_no_${index}`]
    }


    const handleFlagDropdownClick = (e) => {
        e.preventDefault()
        if (!$$(showDropdown) && $$(props.disabled)) return
        const allCountries = concatPreferredCountries($$(preferredCountries), $$(onlyCountries))

        const highlightCountryIndex_ = allCountries.findIndex(o =>
            o.dialCode === $$(selectedCountry).dialCode && o.iso2 === $$(selectedCountry).iso2)

        highlightCountryIndex(highlightCountryIndex_)
        showDropdown(!$$(showDropdown))
    }

    useEffect(() => {
        if ($$(showDropdown)) {
            scrollTo(getElement($$(highlightCountryIndex)), $$(props.enableSearch), dropdownRef)
        }
    })

    const handleInput = (e) => {
        let { value } = e.target

        let formattedNumber_ = $$(props.disableCountryCode) ? '' : $$(prefix)
        let newSelectedCountry = $$(selectedCountry)
        let freezeSelection_ = $$(freezeSelection)

        if (!$$(props.countryCodeEditable)) {
            const mainCode = newSelectedCountry.hasAreaCodes ?
                $$(onlyCountries).find(o => o.iso2 === newSelectedCountry.iso2 && o.mainCode).dialCode :
                newSelectedCountry.dialCode

            const updatedInput = $$(prefix) + mainCode
            if (value.slice(0, updatedInput.length) !== updatedInput) return
        }

        if (value === $$(prefix)) {
            // we should handle change when we delete the last digit
            onChange?.('', getCountryData($$(selectedCountry)), '')
            return formattedNumber('')
        }

        // Does exceed default 15 digit phone number limit
        if (value.replace(/\D/g, '').length > 15) {
            // if ($$(props.enableLongNumbers)) return
            // if (typeof $$(props.enableLongNumbers) === 'number') {
            //     if (value.replace(/\D/g, '').length > $$(props.enableLongNumbers)) return
            // }

            value = value.replace(/\D/g, '').substring(0, Math.max(+$$(props.enableLongNumbers), 15))
        }

        // if the input is the same as before, must be some special key like enter etc.
        if (value === $$(formattedNumber_)) return

        // ie hack
        if (e.preventDefault) {
            e.preventDefault()
        } else {
            e.returnValue = false
        }

        // if (onChange) e.persist()

        if (value.length > 0) {
            // before entering the number in new format, lets check if the dial code now matches some other country
            const inpNum = value.replace(/\D/g, '')

            // we don't need to send the whole number to guess the country... only the first 6 characters are enough
            // the guess country function can then use memoization much more effectively since the set of input it
            // gets has drastically reduced
            // if (!$$(formattedNumber) || ($$(selectedCountry)?.dialCode.length > inpNum.length)) {
            if ($$(props.disableCountryGuess)) { newSelectedCountry = $$(selectedCountry) }
            else {
                newSelectedCountry = guessSelectedCountry(inpNum.substring(0, 6), $$(country), $$(onlyCountries), $$(hiddenAreaCodes), $$(props.enableAreaCodes), THIS) || $$(selectedCountry)
            }
            freezeSelection_ = false
            // }
            formattedNumber_ = formatNumber(inpNum, newSelectedCountry)
            newSelectedCountry = newSelectedCountry.dialCode ? newSelectedCountry : $$(selectedCountry)
        }

        const oldCaretPosition = e.target.selectionStart
        let caretPosition = e.target.selectionStart
        const oldFormattedText = $$(formattedNumber_)
        const diff = formattedNumber_.length - oldFormattedText.length

        formattedNumber(formattedNumber_)
        freezeSelection(freezeSelection_)
        selectedCountry(newSelectedCountry)
        e.target.value = (formattedNumber_)

        // useEffect(() => {
        if (diff > 0) {
            caretPosition = caretPosition - diff
        }

        const lastChar = $$(formattedNumber).charAt($$(formattedNumber).length - 1)

        if (lastChar == ')') {
            $$(numberInputRef).setSelectionRange($$(formattedNumber).length - 1, $$(formattedNumber).length - 1)
        } else if (caretPosition > 0 && oldFormattedText.length >= $$(formattedNumber).length) {
            $$(numberInputRef).setSelectionRange(caretPosition, caretPosition)
        } else if (oldCaretPosition < oldFormattedText.length) {
            $$(numberInputRef).setSelectionRange(oldCaretPosition, oldCaretPosition)
        }

        onChange?.($$(formattedNumber).replace(/[^0-9]+/g, ''), getCountryData($$(selectedCountry)), $$(formattedNumber))
        // })
    }



    const handleInputClick = (e) => {
        showDropdown(false)
        props.onClick?.(e, getCountryData($$(selectedCountry)))
    }

    const handleDoubleClick = (e) => {
        const len = e.target.value.length
        e.target.setSelectionRange(0, len)
    }

    const handleFlagItemClick = (country, e) => {
        const currentSelectedCountry = $$(selectedCountry)
        const newSelectedCountry = $$(onlyCountries).find(o => o == country)
        if (!newSelectedCountry) return

        const unformattedNumber = $$(formattedNumber).replace(' ', '').replace('(', '').replace(')', '').replace('-', '')
        const newNumber = unformattedNumber.length > 1 ? unformattedNumber.replace(currentSelectedCountry.dialCode, newSelectedCountry.dialCode) : newSelectedCountry.dialCode
        formattedNumber(formatNumber(newNumber.replace(/\D/g, ''), newSelectedCountry))

        showDropdown(false)
        selectedCountry(newSelectedCountry)
        freezeSelection(true)
        searchValue('')

    }

    useEffect(() => {
        cursorToEnd($$(numberInputRef))
        props.onChange?.($$(formattedNumber).replace(/[^0-9]+/g, ''), getCountryData($$(selectedCountry)), $$(formattedNumber))
    })

    const handleInputFocus = (e) => {
        // if the input is blank, insert dial code of the selected country
        if ($$(numberInputRef)) {
            if ($$(numberInputRef).value === $$(props.prefix) && $$(selectedCountry) && !$$(props.disableCountryCode)) {
                formattedNumber($$(props.prefix) + $$(selectedCountry).dialCode)
            }
        }

        placeholder('')

        props.onFocus?.(e, getCountryData($$(selectedCountry)))
        $$(props.jumpCursorToEnd) && setTimeout(() => cursorToEnd($$(numberInputRef)), 0)
    }

    useEffect(() => { $$(props.jumpCursorToEnd) && setTimeout(() => cursorToEnd($$(numberInputRef)), 0) })


    const handleInputBlur = (e) => {
        if (!e.target.value) placeholder($$(props.placeholder))
        props.onBlur?.(e, getCountryData($$(selectedCountry)))
    }

    const handleInputCopy = (e) => {
        if (!$$(props.copyNumbersOnly)) return
        const text = window.getSelection().toString().replace(/[^0-9]+/g, '')
        e.clipboardData.setData('text/plain', text)
        e.preventDefault()
    }

    const getHighlightCountryIndex = (direction) => {
        // had to write own function because underscore does not have findIndex. lodash has it
        const highlightCountryIndex_ = $$(highlightCountryIndex) + direction

        if (highlightCountryIndex_ < 0 || highlightCountryIndex_ >= ($$(onlyCountries).length + $$(preferredCountries).length)) {
            return highlightCountryIndex_ - direction
        }

        if ($$(props.enableSearch) && highlightCountryIndex_ > getSearchFilteredCountries().length) return 0 // select first country
        return highlightCountryIndex_
    }


    useEffect(() => {
        scrollTo(getElement($$(highlightCountryIndex)), $$(props.enableSearch), dropdownRef, true)
    })

    const handleKeydown = (e) => {
        const { target: { className } } = e

        if (className.includes('selected-flag') && e.which === keys.ENTER && !$$(showDropdown)) return handleFlagDropdownClick(e)
        if (className.includes('form-control') && (e.which === keys.ENTER || e.which === keys.ESC)) return e.target.blur()

        if (!$$(showDropdown) || $$(props.disabled)) return
        if (className.includes('search-box')) {
            if (e.which !== keys.UP && e.which !== keys.DOWN && e.which !== keys.ENTER) {
                if (e.which === keys.ESC && e.target.value === '') {
                    // do nothing // if search field is empty, pass event (close dropdown)
                } else {
                    return // don't process other events coming from the search field
                }
            }
        }

        // ie hack
        if (e.preventDefault) { e.preventDefault() }
        else { e.returnValue = false }

        const moveHighlight = (direction) => {
            highlightCountryIndex(getHighlightCountryIndex(direction))
        }

        switch (e.which) {
            case keys.DOWN:
                moveHighlight(1)
                break
            case keys.UP:
                moveHighlight(-1)
                break
            case keys.ENTER:
                if ($$(props.enableSearch)) {
                    handleFlagItemClick(getSearchFilteredCountries()[$$(highlightCountryIndex)] || getSearchFilteredCountries()[0], e)
                } else {
                    handleFlagItemClick([...$$(preferredCountries), ...$$(onlyCountries)][$$(highlightCountryIndex)], e)
                }
                break
            case keys.ESC:
            case keys.TAB:
                showDropdown(false)
                cursorToEnd($$(numberInputRef))
                break
            default:
                if ((e.which >= keys.A && e.which <= keys.Z) || e.which === keys.SPACE) {
                    queryString($$(queryString) + String.fromCharCode(e.which))
                    $$(debouncedQueryStingSearcher)
                }
        }
    }

    const handleInputKeyDown = (e) => {
        if (e.which === keys.ENTER) onEnterKeyPress?.(e)
        onKeyDown?.(e)
    }

    const handleClickOutside = (e) => {
        if ($$(dropdownRef) && !$$(dropdownContainerRef).contains(e.target)) {
            $$(showDropdown) && showDropdown(false)
        }
    }

    useEffect(() => {
        if (document.addEventListener && $$(props.enableClickOutside)) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        props.onMount?.($$(formattedNumber).replace(/[^0-9]+/g, ''), getCountryData($$(selectedCountry)), $$(formattedNumber))

        return () => {
            if (document.removeEventListener && $$(props.enableClickOutside)) {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    })

    useEffect(() => { updateCountry($$(props.country)) })
    useEffect(() => { updateFormattedNumber(props.value) })

    const handleSearchChange = (e) => {
        const { currentTarget: { value: searchValue } } = e
        let highlightCountryIndex_ = 0

        if (searchValue === '' && $$(selectedCountry)) {
            highlightCountryIndex_ = concatPreferredCountries($$(preferredCountries), $$(onlyCountries)).findIndex(o => o == $$(selectedCountry))
            // wait asynchronous search results re-render, then scroll
            setTimeout(() => scrollTo(getElement(highlightCountryIndex_), $$(props.enableSearch), dropdownRef), 100)
        }
        highlightCountryIndex(highlightCountryIndex_)
        // this.setState({ searchValue, })
    }


    const getSearchFilteredCountries = () => {
        const allCountries = concatPreferredCountries($$(preferredCountries), $$(onlyCountries))
        const sanitizedSearchValue = $$(searchValue).trim().toLowerCase().replace('+', '')
        if ($$(enableSearch) && sanitizedSearchValue) {
            // [...new Set()] to get rid of duplicates
            // firstly search by iso2 code
            if (/^\d+$/.test(sanitizedSearchValue)) { // contains digits only
                // values wrapped in ${} to prevent undefined
                return allCountries.filter(({ dialCode }) =>
                    [`${dialCode}`].some(field => field.toLowerCase().includes(sanitizedSearchValue)))
            } else {
                const iso2countries = allCountries.filter(({ iso2 }) =>
                    [`${iso2}`].some(field => field.toLowerCase().includes(sanitizedSearchValue)))
                // || '' - is a fix to prevent search of 'undefined' strings
                // Since all the other values shouldn't be undefined, this fix was accepte
                // but the structure do not looks very good
                const searchedCountries = allCountries.filter(({ name, localName, iso2 }) =>
                    [`${name}`, `${localName || ''}`].some(field => field.toLowerCase().includes(sanitizedSearchValue)))
                scrollToTop($$(dropdownRef))
                return [...new Set([].concat(iso2countries, searchedCountries))]
            }
        } else {
            return allCountries
        }
    }


    const getCountryDropdownList = () => {

        const searchedCountries = getSearchFilteredCountries()

        let countryDropdownList = searchedCountries.map((country, index) => {
            const highlight = $$(highlightCountryIndex) === index
            const itemClasses = [{
                country: true,
                preferred: country.iso2 === 'us' || country.iso2 === 'gb',
                active: country.iso2 === 'us',
                highlight
            },
                'relative pl-[46px] pr-[9px] pt-3 pb-[13px] hover:bg-[#f1f1f1]',
            () => highlight ? 'bg-[#f1f1f1]' : ''
            ]

            const inputFlagClasses = ['flag', 'w-[25px] h-5 bg-no-repeat', () => fg[country.iso2], /* 'bg-[url(./style/common/high-res.png)] ' */
                'inline-block absolute left-[13px] top-2 mr-[7px] mt-0.5',
                'mr-[7px] mt-0.5',
            ]

            return (
                <li
                    ref={el => THIS[`flag_no_${index}`] = el}
                    key={`flag_no_${index}`}
                    data-flag-key={`flag_no_${index}`}
                    class={itemClasses}
                    data-dial-code='1'
                    tabIndex={() => $$(disableDropdown) ? -1 : 0}
                    data-country-code={country.iso2}
                    onClick={e => handleFlagItemClick(country, e)}
                    role='option'
                    {...highlight ? { "aria-selected": true } : {}}
                >
                    <div class={inputFlagClasses} />
                    <span class='country-name mr-1.5'>{getDropdownCountryName(country)}</span>
                    <span class='dial-code text-[#6b6b6b]'>{country.format ? formatNumber(country.dialCode, country) : ($$(prefix) + country.dialCode)}</span>
                </li>
            )
        })

        const dashedLi = (<li key={'dashes'} class='divider mb-[5px] pb-[5px] border-b-[#ccc] border-b border-solid' />);
        // let's insert a dashed line in between preffered countries and the rest
        ($$(preferredCountries).length > 0) && (!$$(enableSearch) || $$(enableSearch) && !$$(searchValue).trim()) &&
            countryDropdownList.splice($$(preferredCountries).length, 0, dashedLi)

        const dropDownClasses = [{
            'country-list': true,
            'hide hidden': () => !$$(showDropdown),
        },
        props.dropdownClass,
            `z-[1] absolute shadow-[1px_2px_18px_rgba(0,0,0,0.25)] bg-[white] w-[300px] max-h-[220px] overflow-y-scroll -ml-px mr-0 mt-0 mb-2.5 p-0 rounded-[7px]
  [outline:none] list-none`
        ]
        return (
            <ul
                ref={el => {
                    !$$(enableSearch) && el && el.focus()
                    return dropdownRef(el)
                }}
                class={dropDownClasses}
                style={props.dropdownStyle}
                role='listbox'
                tabIndex={0}
            >
                {() => $$(enableSearch) && (
                    <li
                        class={[{
                            search: true,
                        },
                            searchClass,
                            'z-[2] sticky bg-white pl-2.5 pr-0 pt-2.5 pb-1.5 top-0',
                        ]}>
                        {!$$(disableSearchIcon) &&
                            <span
                                class={[{
                                    'search-emoji': true,
                                    [`${() => $$(searchClass)}-emoji`]: !!$$(searchClass),
                                },
                                    'hidden text-[15px]'
                                ]}
                                role='img'
                                aria-label='Magnifying glass'
                            >
                                &#128270;
                            </span>}
                        <input
                            class={[{
                                'search-box': true,
                                [`${() => $$(searchClass)}-box`]: !!$$(searchClass),
                            },
                                'border text-[15px] leading-[15px] ml-1.5 pt-[3px] pb-[5px] px-2 rounded-[3px] border-solid border-[#cacaca] hover:border-[#505050]'
                            ]}
                            style={searchStyle}
                            type='search'
                            placeholder={searchPlaceholder}
                            autoFocus={true}
                            autoComplete={() => $$(autocompleteSearch) ? 'on' : 'off'}
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                    </li>
                )}
                {countryDropdownList.length > 0
                    ? countryDropdownList
                    : (
                        <li class='no-entries-message opacity-70 pt-[7px] pb-[11px] px-2.5'>
                            <span>{searchNotFound}</span>
                        </li>
                    )}
            </ul>
        )
    }


    const isValidValue = $<boolean>()
    const errorMessage = $<string>()

    useEffect(() => {
        // console.log($$(formattedNumber), $$(selectedCountry))
        if (isObservable(isValid as any)) {
            isValidValue($$(isValid as ObservableMaybe<boolean>))
        } else if (typeof isValid === 'function') {
            const isValidProcessed = isValid($$(formattedNumber).replace(/\D/g, ''), $$(selectedCountry), $$(onlyCountries), $$(hiddenAreaCodes))
            if (typeof isValidProcessed === 'boolean') {
                isValidValue(isValidProcessed)
                if ($$(isValidValue) === false) errorMessage($$(defaultErrorMessage))
            } else { // typeof === 'string'
                isValidValue(false)
                errorMessage(isValidProcessed)
            }
        }
    })

    const containerClasses = [
        props.containerClass,
        `voby-tel-input text-[15px] relative w-full disabled:cursor-not-allowed`
    ]
    const arrowClasses = { 'arrow': true, 'up border-t-[none] border-b-4 border-b-[#555] border-solid': showDropdown }
    const inputClasses = [{
        'form-control': true,
        'invalid-number border border-solid border-[#f44336] focus:shadow-[0_0_0_1px_#f44336] [&+div]:before:content-["Error"] [&+div]:before:hidden [&+div]:before:text-[#f44336] [&+div]:before:w-[27px]': () => !$$(isValidValue),
        'open': $$(showDropdown),
        'here': true,

    },
    props.inputClass,
        `text-base bg-white border w-[300px] pl-[58px] pr-3.5 py-[10.5px] rounded-[5px] border-solid border-[#CACACA] hover:border-black focus:shadow-[0_0_0_1px_#1976d2] focus:border-[#1976d2]
  [outline:none]
  [transition:box-shadow_ease_0.25s,border-color_ease 0.25s]
  [&:focus+div]:before:text-[#1976d2]
  `
    ]
    const selectedFlagClasses = [{
        'selected-flag': true,
        'open': $$(showDropdown),
    },
        'relative w-[52px] h-full pl-[11px] pr-0 py-0 rounded-[3px_0_0_3px] [outline:none]',
        // `[&:focus_.arrow]:border-t-[5px] [&:focus_.arrow]:border-t-[#1976d2] [&:focus_.arrow]:border-x-4 [&:focus_.arrow]:border-solid`,
        '[&_.flag]:absolute [&_.flag]:-mt-3 [&_.flag]:top-2/4',
        // '[&_.arrow]:relative [&_.arrow]:w-0 [&_.arrow]:h-0 [&_.arrow]:-mt-px [&_.arrow]:border-t-4 [&_.arrow]:border-t-[#555] [&_.arrow]:border-x-[3px] [&_.arrow]:border-x-transparent [&_.arrow]:border-solid [&_.arrow]:left-[29px] [&_.arrow]:top-2/4',
    ]
    const flagViewClasses = [{
        'flag-dropdown absolute p-0 rounded-[3px_0_0_3px] inset-y-0 hover:cursor-pointer focus:cursor-pointer': true,
        'invalid-number border border-solid border-[#f44336] focus:shadow-[0_0_0_1px_#f44336] [&+div]:before:content-["Error"] [&+div]:before:hidden [&+div]:before:text-[#f44336] [&+div]:before:w-[27px]': () => !isValidValue,
        'open z-[2]': $$(showDropdown),
    },
    props.buttonClass,
    ]
    const inputFlagClasses = ['flag w-[25px] h-5 bg-no-repeat', () => fg[$$(selectedCountry)?.iso2]] //bg-[url("./style/common/high-res.png")]

    return (
        <div
            class={[containerClasses, props.className]}
            style={props.style || props.containerStyle}
            onKeyDown={handleKeydown}>
            {() => $$(specialLabel) && <div class='special-label absolute z-[1] top-[-7px] block bg-[white] text-[13px] whitespace-nowrap px-[5px] py-0 left-[25px]'>{specialLabel}</div>}
            {() => $$(errorMessage) && <div class='invalid-number-message absolute z-[1] text-[13px] top-[-7px] bg-white text-[#de0000] px-[5px] py-0 left-[25px]'>{errorMessage}</div>}
            <input
                class={inputClasses}
                style={props.inputStyle}
                onChange={handleInput}
                onClick={handleInputClick}
                onDblClick={handleDoubleClick}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onCopy={handleInputCopy}
                value={formattedNumber}
                onKeyDown={handleInputKeyDown}
                placeholder={props.placeholder}
                disabled={props.disabled}
                type='tel'
                {...props.inputProps}
                ref={el => {
                    numberInputRef(el)
                    // if (props.inputProps.ref) // === 'function') {
                    //     props.inputProps.ref(el)
                    // // } else if (typeof props.inputProps.ref === 'object') {
                    // //     props.inputProps.ref.current = el
                    // //}
                }}
            />

            <div
                class={[flagViewClasses, '[&:disabled+.flag-dropdown:hover]:cursor-default [&:disabled+.flag-dropdown:hover]:border-[#CACACA]',
                    '[&:disabled+.flag-dropdown:hover.selected-flag]:bg-transparent']}
                style={props.buttonStyle}
                ref={dropdownContainerRef}
            >
                {() => $$(renderStringAsFlag) ?
                    <div class={selectedFlagClasses}>{renderStringAsFlag}</div>
                    :
                    <div
                        onClick={() => $$(disableDropdown) ? undefined : handleFlagDropdownClick}
                        class={[selectedFlagClasses]}
                        title={() => $$(selectedCountry) ? `${$$(selectedCountry).localName || $$(selectedCountry).name}: + ${$$(selectedCountry).dialCode}` : ''}
                        tabIndex={() => $$(disableDropdown) ? -1 : 0}
                        role='button'
                        aria-haspopup="listbox"
                        aria-expanded={() => $$(showDropdown) ? true : undefined}
                    >
                        <div class={inputFlagClasses}>
                            {!$$(disableDropdown) && <div class={arrowClasses}></div>}
                        </div>
                    </div>}

                {showDropdown && getCountryDropdownList()}
            </div>
        </div>
    )
}

