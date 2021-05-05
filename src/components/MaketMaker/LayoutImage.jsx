import React from 'react'

import { Image } from 'react-konva'
import useImage from 'use-image'

export default function LayoutImage({ name, setStageWidth, setStageHeight, imageUrl }) {
  const [image] = useImage(imageUrl)
  // const xCenter = stageWidth / 2 - image?.width / 2
  // const yCenter = stageHeight / 2 - image?.height / 2
  // x={xCenter} y={yCenter}
  React.useEffect(() => {
    setStageHeight(image?.height || 0)
    setStageWidth(image?.width || 0)
  }, [setStageHeight, setStageWidth, image])
  return <Image name={name} image={image} />
}
