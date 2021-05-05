import React from 'react'

import { Image } from 'react-konva'
import useImage from 'use-image'

export default function BackgroundImage({ width, height, imageUrl }) {
  const [image] = useImage(imageUrl)
  return <Image width={width} height={height} image={image} />
}
