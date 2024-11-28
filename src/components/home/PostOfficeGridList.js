import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';



export default function PostOfficeGridList({postOffices}) {
    console.log(postOffices);
    const rows=postOffices.map((office,index)=>{
        return {
            id:index,
            Pincode:office['pincode'],
            PostName:office['name'],
            ContactNumber:office['contactNo'],
            Address:office['address'],
            Division:office['division_pincode']

        }
    })
    

  return (
    <div style={{ height: 350, width: '100%' }}>
      <DataGrid
        columns={[
          { field: 'Pincode' },
          { field: 'PostName', hideable: false },
          { field: 'ContactNumber' },
          { field: 'Address' },
          { field: 'Division' },
        ]}
        rows={rows}
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </div>
  );
}
