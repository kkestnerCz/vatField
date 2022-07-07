import React from '@emotion/react'
import { useEffect, useState } from 'react'

// @mui/material components
import TextField from '@mui/material/TextField'
import { InputAdornment, IconButton } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

// @mui/icons-material
import { Today, HourglassEmpty, Check, Send } from '@mui/icons-material'

// @mui/styles
import { styled } from '@mui/material/styles'

const TextFieldStyle = styled(TextField)({
    '& label.Mui-focused': {
      color: '#000'
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: '#000'
      }
    }
  })

export default function VatField(props, vatData) {
  const [vatValidation, setVatValidation] = useState({})
  const [debouncedTxtValue, setDebouncedTxtValue] = useState('')
  const [txtValue, setTxtValue] = useState('')
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const delay = 1000  // debounce delay

  // useEffect for handling debounce of textInput
  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedTxtValue(txtValue)
      }, delay)
      return () => {
        clearTimeout(handler)
      }
    },
    [txtValue]
  )

  // useEffect for handling logic
  useEffect(
    () => {
      if(debouncedTxtValue !== '' && debouncedTxtValue.toLocaleLowerCase() !== vatValidation.query?.toLocaleLowerCase() && !vatValidation.loading) {
        handleVat(debouncedTxtValue)
      }
    },
    [debouncedTxtValue]
  )

  const handleVat = async (vatString) => {
    //loading
    setVatValidation(prevState => ({
          ...prevState,
          loading: true
    }))

    try {
        const res = await fetch(`http://apilayer.net/api/validate?access_key=${process.env.NEXT_PUBLIC_VATLAYER_API_KEY}&vat_number=${vatString}`)
        const data = await res.json()

        setVatValidation(prevState => ({
          ...prevState,
          data,
          loading: false // end of loading
        }))

        if (data?.valid) {
          props.vatData({ valid: true })
          setTooltipOpen(true)
        } else {
          props.vatData({ valid: false })
          setTooltipOpen(false)
        }
    } catch (e) {
      console.log('[ERR]', e)
      setVatValidation(prevState => ({
        ...prevState,
        data: {},
        loading: false // end of loading
      }))
      setTooltipOpen(false)
    }
  }

  return (
    <div>
      <Tooltip open={tooltipOpen} title={`${vatValidation?.data?.company_name}, ${vatValidation?.data?.company_address}`}>
        <TextFieldStyle
          label="VAT number"
          id="vat-number" 
          value={txtValue}
          onChange={(e) => setTxtValue(e.target.value)}
          error={!vatValidation?.data?.valid}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  aria-label="VAT status"
                >
                  {vatValidation?.loading ? <HourglassEmpty style={{color: '#ff9800'}} /> : ''}
                  {vatValidation?.data?.valid && !vatValidation?.loading ? <Check style={{ color: '#4caf50'}}/> : ''}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Tooltip>
    </div>
  )
}