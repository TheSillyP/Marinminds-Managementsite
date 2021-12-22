import React, { useState, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { RocketOutlined, UserOutlined, FileImageOutlined, CodeOutlined } from '@ant-design/icons'
import { Row, Col, Upload } from 'antd'

import { ECRUDState } from '../../../data/types'
import { TYachtModel } from '../../../data/models/yachts'
import { useMst } from '../../../data'
import { StyledInput } from '../styled-input'

import './create-yacht.less'

export interface IPropTypes {
  loading: boolean,
  edit?: string,
}

export const CreateYacht: React.FC<IPropTypes> = observer(({ loading }) => {
  const { yachts } = useMst()

  const [ fileList, setFileList ] = useState([] as any)
  const [ editing, setEditing ] = useState('')

  const getBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }, [])

  const setTargetValue = useCallback((key: string) => ({ target }: any) => yachts.setField(key, target.value), [ yachts ])
  const replaceFileList = useCallback(async (file: File) => {
    const data = await getBase64(file)
    setFileList([{ file, data }])
    yachts.setField('addYacht', data)
  }, [ yachts, getBase64 ])

  const clearYachtImage = () => setFileList([])

  const uploader = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    disabled: loading,
    fileList,
    beforeUpload: (file: File) => {
      replaceFileList(file)
      return false
    },
  }

  useEffect(() => {
    if (yachts.state === ECRUDState.FETCHED && yachts.editing && yachts.editing !== editing) {
      const yacht: TYachtModel | undefined = yachts.yachts.find((candidate: TYachtModel) => (candidate.id === yachts.editing))

      if (yacht) {
        yachts.setField('addName', yacht.name)
        yachts.setField('addOwner', yacht.owner)
        yachts.setField('addBlackboxId', yacht.blackboxId)
        yachts.setField('addYacht', yacht.image)
      }
    } else {
      setEditing('')
    }
  }, [ editing, setEditing, yachts ])

  return (
    <section className='create-yacht'>
      <div className='create-yacht create-yacht--outer'>
        <Row>
          <Col span={12}>
            <StyledInput
              label='Yacht name'
              block={true}
              icon={<RocketOutlined />}
              disabled={loading}
              inputProps={{ value: yachts.addName, onChange: setTargetValue('addName') }}
              style={{ marginBottom: '1.5em' }} />

            <StyledInput
              label='Owner'
              block={true}
              icon={<UserOutlined />}
              disabled={loading}
              inputProps={{ value: yachts.addOwner, onChange: setTargetValue('addOwner') }}
              style={{ marginBottom: '1.5em' }} />

            <StyledInput
              label='Blackbox ID'
              block={true}
              icon={<CodeOutlined />}
              disabled={loading}
              inputProps={{ value: yachts.addBlackboxId, onChange: setTargetValue('addBlackboxId') }}
              style={{ marginBottom: '1.5em' }} />
          </Col>
          <Col span={12}>
            {fileList.length === 0 && (
              <div className='create-yacht create-yacht--uploader-wrapper'>
                <Upload.Dragger {...uploader} className='create-yacht create-yacht--uploader-dropper'>
                  <FileImageOutlined />
                  <p style={{ padding: '0 2em' }}>Drag and drop, or click here, to upload an image of the yacht with a 2.8:1 ratio and a minimum width of 1280px (e.g. 1280x457 px)</p>
                </Upload.Dragger>
              </div>
            )}

            {fileList.length > 0 && (
              <div className='create-yacht create-yacht--uploader-wrapper'>
                <img className='create-yacht create-yacht--uploader-preview' src={fileList[0].data} alt={fileList[0].filename} onClick={clearYachtImage} />
              </div>
            )}
          </Col>
        </Row>
      </div>
    </section>
  )
})
