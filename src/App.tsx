import React, { memo, useState, useEffect } from 'react'
import { addDoc, collection, query, onSnapshot } from 'firebase/firestore'
import { FormControl, List, TextField } from '@mui/material'
import { AddToPhotosOutlined } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

import TaskItem from './TaskItem'
import { db } from './firebase'
import { TaskType } from './types/Task'
import styles from './App.module.css'

const CustomField = styled(TextField)({
  marginTop: 30,
  marginBottom: 20,
})
const CustomList = styled(List)({
  margin: 'auto',
  width: '40%',
})

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([])
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
    <div className={styles.app__root}>
      <h1>Todo App by React</h1>
      <br />
      <FormControl>
        <CustomField
          InputLabelProps={{ shrink: true }}
          label="New Task"
          value={input}
          variant="standard"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosOutlined />
      </button>
      <CustomList>
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </CustomList>
    </div>
  )
}

export default memo(App)
