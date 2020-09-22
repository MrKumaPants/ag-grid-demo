import {
  ColumnApi,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  ModuleRegistry,
} from '@ag-grid-community/core'
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model'
import { AgGridColumn, AgGridReact } from '@ag-grid-community/react'
import React, { useCallback, useMemo, useState } from 'react'

ModuleRegistry.registerModules([InfiniteRowModelModule])

export const Grid = (): JSX.Element => {
  const [, setGridApi] = useState<GridApi | null>(null)
  const [, setGridColumnApi] = useState<ColumnApi | null>(null)

  const onGridReady = useCallback((event: GridReadyEvent): void => {
    setGridApi(event.api)
    setGridColumnApi(event.columnApi)

    const httpRequest = new XMLHttpRequest()
    const updateData = (data) => {
      const dataSource: IDatasource = {
        getRows: (params: IGetRowsParams) => {
          setTimeout(function () {
            const rowsThisPage = data.slice(params.startRow, params.endRow)
            let lastRow = -1
            if (data.length <= params.endRow) {
              lastRow = data.length
            }
            params.successCallback(rowsThisPage, lastRow)
          }, 500)
        },
      }
      event.api.setDatasource(dataSource)
    }

    httpRequest.open(
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinners.json'
    )
    httpRequest.send()
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText))
      }
    }
  }, [])

  const loadingRenderer = useCallback((params) => {
    if (params.value !== undefined) {
      return params.value
    } else {
      return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/images/loading.gif">'
    }
  }, [])

  const gridOptions = useMemo<GridOptions>(
    () => ({
      cacheBlockSize: 100,
      components: { loadingRenderer },
      defaultColDef: {
        resizable: true,
      },
      infiniteInitialRowCount: 1,
      onGridReady,
      paginationPageSize: 100,
      rowBuffer: 0,
      rowModelType: 'infinite',
    }),
    []
  )

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
      <AgGridReact gridOptions={gridOptions} modules={[InfiniteRowModelModule]}>
        <AgGridColumn
          headerName="ID"
          maxWidth={100}
          valueGetter="node.id"
          cellRenderer="loadingRenderer"
        ></AgGridColumn>
        <AgGridColumn field="athlete"></AgGridColumn>
        <AgGridColumn field="age"></AgGridColumn>
        <AgGridColumn field="country" checkboxSelection={true}></AgGridColumn>
        <AgGridColumn field="year"></AgGridColumn>
        <AgGridColumn field="date"></AgGridColumn>
        <AgGridColumn field="sport"></AgGridColumn>
        <AgGridColumn field="gold"></AgGridColumn>
        <AgGridColumn field="silver"></AgGridColumn>
        <AgGridColumn field="bronze"></AgGridColumn>
        <AgGridColumn field="total"></AgGridColumn>
      </AgGridReact>
    </div>
  )
}
