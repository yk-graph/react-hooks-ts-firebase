import React, { memo, useState, useEffect } from 'react'
import { addDoc, collection, query, onSnapshot } from 'firebase/firestore'
import { FormControl, TextField } from '@mui/material'
import { AddToPhotosOutlined } from '@mui/icons-material'

import { db } from './firebase'

interface Task {
  id: string
  title: string
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const q = query(collection(db, 'tasks'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }))
      )
    })
    return () => unsubscribe()
  }, [])

  const newTask = async () => {
    await addDoc(collection(db, 'tasks'), {
      title: input,
    })
    setInput('')
  }

  return (
    <div>
      <h1>Todo App by React</h1>
      <FormControl>
        <TextField
          InputLabelProps={{ shrink: true }}
          label="New Task"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button disabled={!input} onClick={newTask}>
        <AddToPhotosOutlined />
      </button>
      {tasks.map((task) => (
        <p key={task.id}>{task.title}</p>
      ))}
    </div>
  )
}

export default memo(App)
