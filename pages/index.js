import { useState } from 'react'

import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// @mui/icons-material
import { Send } from '@mui/icons-material'

// custom components
import VatField from '../components/VatField/VatField.js'

export default function Home() {
  const [value, setValue] = useState({valid: false})


  const handleSubmit = () => {
    console.log('submit')
  }

  return (
    <div>
      <Grid container  justifyContent="center" alignItems="center" direction="column">
        <h1>vat:</h1>
      </Grid>
      <Box sx={{ marginTop: 20 }}>
        <Grid container  justifyContent="center" alignItems="center" direction="row">
            <VatField vatData={setValue} />
            <Button color='secondary' disabled={value?.valid === false && !value?.loading} onClick={handleSubmit}>
                <Send />
            </Button>
        </Grid>
      </Box>
    </div>
  )
}
