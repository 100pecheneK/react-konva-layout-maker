import { nanoid } from 'nanoid'
import React from 'react'
import { Layer, Stage } from 'react-konva'
import './MaketMaker.css'
import BackgroundImage from './BackgroundImage'
import LayoutImage from './LayoutImage'
import ResizableImage from './ResizableImage'

const settings = {
  initialResizeImage: {
    x: 0,
    y: 0,
  },
}

export default function MaketMaker({ onExport, backgroundImage, layoutImage }) {
  const [stageWidth, setStageWidth] = React.useState(0)
  const [stageHeight, setStageHeight] = React.useState(0)
  const [selectedId, selectShape] = React.useState(null)
  const [files, setFiles] = React.useState([])
  const [orderInputs, setOrderInputs] = React.useState([nanoid()])
  const [isExporting, setIsExporting] = React.useState(false)
  const stageRef = React.useRef(null)

  function checkDeselect(e) {
    if (e.target?.attrs?.name === 'bg') {
      selectShape(null)
    }
  }
  function moveForward(e) {
    const id = e.target.id()
    setFiles(prevFiles => {
      const file = prevFiles.find(f => f.id === id)
      const fileIndex = prevFiles.indexOf(file)
      return [
        ...prevFiles.slice(0, fileIndex),
        ...prevFiles.slice(fileIndex + 1),
        file,
      ]
    })
  }
  function onInputChange(e, orderNumber) {
    // get file from input
    const file = e.target.files[0]
    // if file input cancel then delete them
    if (!file) {
      deleteFileByOrderNumber(orderNumber)
      return
    }
    const reader = new FileReader()

    // check if file exist
    const fileAlreadyExist = files.find(f => f.orderNumber === orderNumber)

    if (fileAlreadyExist) {
      reader.onload = () => {
        const img = new window.Image()
        img.src = reader.result
        // replace prevfile by newfile
        setFiles(prevFiles =>
          prevFiles.map(prevFile => {
            if (prevFile.orderNumber === orderNumber) {
              return {
                ...prevFile,
                orderNumber,
                x: settings.initialResizeImage.x,
                y: settings.initialResizeImage.y,
                img: img,
                name: file.name,
                file: reader.result,
              }
            }
            return prevFile
          })
        )
      }
    } else {
      reader.onload = () => {
        const img = new window.Image()
        img.src = reader.result
        // append new file
        setFiles(prev => [
          ...prev,
          {
            orderNumber,
            x: settings.initialResizeImage.x,
            y: settings.initialResizeImage.y,
            img: img,
            id: nanoid(),
            name: file.name,
            file: reader.result,
          },
        ])
      }
      setOrderInputs(prev => [...prev, nanoid()])
    }
    reader.readAsDataURL(file)
  }
  function deleteFileByOrderNumber(orderNumber) {
    setFiles(prevFiles => prevFiles.filter(f => f.orderNumber !== orderNumber))
    setOrderInputs(prev => prev.filter(o => o !== orderNumber))
  }

  function handleExport() {
    selectShape(null)
    setIsExporting(true)
  }
  function exportStageToPng() {
    const exported = [
      {
        type: 'layout',
        file: stageRef.current.toDataURL(),
        name: 'layout.png',
      },
      ...files.map((file, i) => ({
        type: 'asset',
        file: file.file,
        name: `${i}-${file.name}`,
        width: file.width,
        height: file.height,
        x: file.x,
        y: file.y,
      })),
    ]
    onExport(exported)
  }
  React.useEffect(() => {
    if (!isExporting) return
    exportStageToPng()
    setIsExporting(false)
  }, [isExporting])

  return (
    <div className='wrapper'>
      <button onClick={handleExport}>Export</button>
      <div className='inputs'>
        {orderInputs
          .slice(0)
          .reverse()
          .map(orderNumber => {
            const currentFile = files.find(f => f.orderNumber === orderNumber)
            return (
              <div key={orderNumber} className='input'>
                <input
                  accept='image/*'
                  type='file'
                  id={`input-file-${orderNumber}`}
                  onChange={e => onInputChange(e, orderNumber)}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor={`input-file-${orderNumber}`}
                  className='input-file-label'
                >
                  {currentFile?.name ? '' : 'Выберите файл'}
                  {currentFile && (
                    <img
                      className='input-file-preview'
                      src={currentFile.img.src}
                      alt={currentFile.name}
                    />
                  )}
                  {currentFile && (
                    <button
                      onClick={() => deleteFileByOrderNumber(orderNumber)}
                    >
                      Delete
                    </button>
                  )}
                </label>
              </div>
            )
          })}
      </div>
      <div className='stage'>
        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          name='bg'
          style={{ border: '1px solid black' }}
        >
          <Layer layerName='background'>
            <BackgroundImage
              width={stageWidth}
              height={stageHeight}
              imageUrl={backgroundImage}
            />
          </Layer>
          <Layer layerName='resizableImages'>
            <LayoutImage
              name='bg'
              setStageHeight={setStageHeight}
              setStageWidth={setStageWidth}
              imageUrl={layoutImage}
            />
            {files.map((file, i) => {
              return (
                <ResizableImage
                  stageHeight={stageHeight}
                  stageWidth={stageWidth}
                  key={file.id}
                  file={file}
                  isSelected={file.id === selectedId}
                  onSelect={e => {
                    moveForward(e)
                    selectShape(file.id)
                  }}
                  onChange={newAttrs => {
                    setFiles(prevFiles => {
                      return prevFiles.map(f => {
                        if (f.id === newAttrs.id) {
                          return { ...f, ...newAttrs }
                        }
                        return f
                      })
                    })
                  }}
                />
              )
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
