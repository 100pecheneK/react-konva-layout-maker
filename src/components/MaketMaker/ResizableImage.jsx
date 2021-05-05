import React from 'react'
import { Image, Transformer } from 'react-konva'

function getSize(size, stageHeight, stageWidth) {
  if (size.height === size.width) {
    const widthDiff = size.width - stageWidth
    const heightDiff = size.height - stageHeight
    if (widthDiff > heightDiff) {
      return {
        width: stageWidth,
        height: stageWidth,
      }
    }
    return {
      width: stageHeight,
      height: stageHeight,
    }
  }
  if (size.width > size.height) {
    if (stageWidth < size.width) {
      const widthDiff = size.width - stageWidth
      size = {
        width: size.width - widthDiff,
        height: size.height - widthDiff / (size.width / size.height),
      }
    }
  }
  if (size.height > size.width) {
    if (stageHeight < size.height) {
      const heightDiff = size.height - stageHeight
      size = {
        width: size.width - heightDiff / (size.height / size.width),
        height: size.height - heightDiff,
      }
    }
  }
  return size
}

export default function ResizableImage({
  file,
  isSelected,
  onSelect,
  onChange,
  stageHeight,
  stageWidth,
}) {
  const shapeRef = React.useRef()
  const trRef = React.useRef()
  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])
  React.useEffect(() => {
    if (file.img) {
      const size = getSize(
        {
          width: file.img.naturalWidth,
          height: file.img.naturalHeight,
        },
        stageHeight,
        stageWidth
      )
      onChange({
        ...file,
        ...size,
      })
    }
  }, [])
  return (
    <>
      <Image
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
        globalCompositeOperation='source-atop'
        // {...file}
        id={file.id}
        x={file.x}
        y={file.y}
        image={file.img}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        width={file.width}
        height={file.height}
        draggable
        onDragEnd={e => {
          onChange({
            ...file,
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={e => {
          const node = shapeRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)
          onChange({
            ...file,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          })
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}
