import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import {AppBar ,Toolbar ,Typography ,Container } from '@mui/material';


export default function Layout({children}) {
  return (
    <div>
        <Head>
            <title>ecommerce</title>
        </Head>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="4"> E-commerce</Typography>
            </Toolbar>
        </AppBar>
        <Container>
            {children}
        </Container>
    </div>
  )
}
