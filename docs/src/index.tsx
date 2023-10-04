import './index.css'
import { $, render } from 'voby'
import { PhoneInput } from '../../src/index'
import '../../src/style/material.css'

export const App = () => {
    const phone = $('')
    return <PhoneInput
        country={'us'}
        value={phone}
        onChange={p => phone(p)}
        isValid={(value, country) => {
            // if (value.match(/12345/))
            //     return 'Invalid value: ' + value + ', ' + country.name
            // else if (value.match(/1234/))
            //     return false
            // else
            return true

        }}
    />
}

render(<App />, document.getElementById('app'))
