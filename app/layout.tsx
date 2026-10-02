import {Analytics} from '@vercel/analytics/next'
import {Inter} from 'next/font/google'
import type {Metadata,Viewport} from 'next'
import './globals.css'

const inter=Inter({subsets:['latin'],display:'swap'})

export const metadata:Metadata={title:'Secure Video Upload',description:'Upload and securely send your video in a few taps.'}

export const viewport:Viewport={colorScheme:'dark',themeColor:'#0e1621',userScalable:false}

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
return(<html lang="en"><body className={`${inter.className} antialiased`}>{children}{process.env.NODE_ENV==='production'&&<Analytics/>}</body></html>)}
