import React from 'react'
import getProperties from 'fusion:properties'
import { useFusionContext } from 'fusion:context'

const PowerupOutputType = ({
  children,
  contextPath,
  deployment,
  CssLinks,
  Fusion,
  Libs,
  MetaTags
}) => {
  const { arcSite } = useFusionContext()
  const { locale, textDirection = 'ltr' } = getProperties(arcSite)
  return (
    <html lang={locale} dir={textDirection}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <MetaTags />
        <Libs />
        <CssLinks />
        <link rel='icon' type='image/x-icon' href={deployment(`${contextPath}/resources/favicon.ico`)} />
      </head>
      <body>
        <div id='fusion-app' className='b-application'>
          {children}
        </div>
        <Fusion />
      </body>
    </html>
  )
}

export default PowerupOutputType
