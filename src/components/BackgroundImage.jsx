import React from 'react'

import { Image } from 'react-konva'
import useImage from 'use-image'

export default function BackgroundImage({ width, height }) {
  const [image] = useImage('/images/BB.png')
  return <Image width={width} height={height} image={image} />
}
