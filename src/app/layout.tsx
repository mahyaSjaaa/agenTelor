'use client'
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ReactNode } from "react";
import MiniDrawer from "@/component/sidebar";

export default function RootLayout({children}: {children:ReactNode}){
  return(
    <html lang="en">
    <head>
      <title>Document</title>
    </head>
      <body>
        <main>
        <AppRouterCacheProvider>
        <MiniDrawer/>
        {children}
      </AppRouterCacheProvider>
        </main>
      </body>
    </html>
  )
}