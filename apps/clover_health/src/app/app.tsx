// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCallback, useEffect, useState } from 'react';
import styles from './app.module.css';
import { Button, Card, Ribbon, Input, Checkbox, ToastContainer, useToast } from '@rewind-ui/core';

interface Journal {
  count: number; eventName: string; valid: boolean
}
const DEFAULT_DATA = { eventName: "", valid: true, count: 0 }

const API = {
  postToCreate: (payload: Journal[]) => {
    return fetch('http://localhost:3000/data/save_file', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((response) => response.text())
  },
  processData: () => {
    return fetch('http://localhost:3000/data/process').then((response) => response.text())
  }
}

// @ts-ignore
const toastFunc = (good, text, taost) => {
  if (good) {
    return taost.add({
      id: 'bla1',
      color: 'green',
      closeOnClick: true,
      duration: 2000,
      iconType: 'success',
      pauseOnHover: true,
      radius: 'lg',
      shadow: 'none',
      shadowColor: 'none',
      showProgress: true,
      title: text,
    });
  }
  return taost.add({
    id: 'bla2',
    color: 'red',
    closeOnClick: true,
    duration: 2000,
    iconType: 'error',
    pauseOnHover: true,
    radius: 'lg',
    shadow: 'none',
    shadowColor: 'none',
    showProgress: true,
    title: text,
  });
}

export function App() {
  const [data, setData] = useState<Journal[]>([DEFAULT_DATA])
  const addRow = useCallback(() => setData((prevDatas) => {
    return prevDatas.concat(DEFAULT_DATA)
  }), [setData])
  const toast = useToast();
  const submit = useCallback(async () => {
    const response = await API.postToCreate(data)
    if (response === 'true') {
      toastFunc(true, 'Success! Check in file system /apps/convert/data folder', toast)
    } else {
      toastFunc(false, 'Failed!', toast)
    }
  }, [data])
  const process = async () => {
    const res = await API.processData()
    if (res === 'true') {
      toastFunc(true, 'File processed! Check in file system /apps/convert/output folder', toast)
    } else {
      toastFunc(false, 'Processing failed!', toast)
    }
  }

  const changeHandler = useCallback((indexPos: number, key: string, newValue: unknown) => {
    setData((prevData) => {

      const newDataArray = prevData.map((item, index) =>
        index === indexPos ? { ...item, [key]: newValue } : item
      );

      return newDataArray
    })
  }, [])
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="min-w-500">
        <Card.Header className="relative">
          <Ribbon radius="md" shadow="none">Clover Health</Ribbon>
          <div className="gap-4 flex">
            <Button onClick={submit} >Submit</Button>
            <Button onClick={process} >Process</Button>
          </div>
        </Card.Header>
        <Card.Body >
          {data.map((item, index) => <Row key={index} indexPos={index} item={item} changeHandler={changeHandler} />)}
          <Button className="rounded-full font-bold text-2xl" variant="primary" onClick={addRow}>+</Button>
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  );
}

const Row: React.FC<{ item: Journal, changeHandler: (indexPos: number, key: string, value: unknown) => void; indexPos: number }> = ({ item, changeHandler, indexPos }) => {
  const { eventName, valid, count } = item

  return (<div className="flex  items-center gap-4">
    <Input className="my-3" placeholder="Event Name" value={eventName} onChange={(e) => changeHandler(indexPos, "eventName", e.target.value)} />
    <div className="flex">
      <Checkbox checked={valid} onChange={(e) => changeHandler(indexPos, "valid", e.target.checked)} /> Valid
    </div>
    <Input className="my-3" placeholder="Count" type="number" value={count} onChange={(e) => changeHandler(indexPos, "count", e.target.value)} />
  </div>)
}

export default App;
