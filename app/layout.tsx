import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MatchViz',
  description: 'MatchViz is a real-time football visualization platform that brings every match to life with animated player tracking, live event overlays, and an interactive timeline — all in a sleek, responsive interface built for fans, analysts, and enthusiasts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="MatchViz is a real-time football visualization platform that brings every match to life with animated player tracking, live event overlays, and an interactive timeline — all in a sleek, responsive interface built for fans, analysts, and enthusiasts" />
        <title>MatchViz</title>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
