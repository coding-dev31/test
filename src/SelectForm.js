import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth({value, setValue,label,list}) {

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
    <div>
      <FormControl className='select-input'>
        <InputLabel>{label}</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={value}
          onChange={handleChange}
          autoWidth
          label={label}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
            list.map((item,index)=>{
                return(
                    <MenuItem key={index} value={item}>{item.nom}</MenuItem>
                )
            })
          }
        </Select>
      </FormControl>
    </div>
  );
}

