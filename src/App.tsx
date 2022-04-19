import React, { memo, useState, useEffect } from 'react'
import { addDoc, collection, query, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { FormControl, List, TextField } from '@mui/material'
import { AddToPhotosOutlined, ExitToAppOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'

import TaskItem from './TaskItem'
import { db, auth } from './firebase'
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
  const navigate = useNavigate()

  const [tasks, setTasks] = useState<TaskType[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      !user && navigate('/login')
    })
    return () => unsubscribe()
  }, [navigate])

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

  const logout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch {
      alert('ログアウトできませんでした')
    }
  }

  return (
    <div className={styles.app__root}>
      <h1>Todo App by React</h1>
      <button className={styles.app__logout} onClick={logout}>
        <ExitToAppOutlined />
      </button>
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
