import '@ag-grid-community/all-modules/dist/styles/ag-grid.css'
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css'

import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { Fragment } from 'react'

export default function MyApp(props: AppProps): JSX.Element {
  const { Component, pageProps } = props

  return (
    <Fragment>
      <Head>
        <title>ag-Grid Demo</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  )
}
