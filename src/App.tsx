import React, { useState, useEffect } from 'react'
import TaskItem from './TaskItem'
import { db, auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { addDoc, collection, onSnapshot, query } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { FormControl, List, TextField } from '@material-ui/core'
import { AddToPhotosOutlined, ExitToAppOutlined } from '@material-ui/icons'
import styles from './App.module.css'

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: 'auto',
    width: '40%',
  },
})

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: '', title: '' }])
  const [input, setInput] = useState('')
  const classes = useStyles()

  const navigate = useNavigate()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      !user && navigate('/login')
    })
    return () => unSub()
  })

  // 初回のみ情報を取得したいので、第二引数は[]にしておく
  useEffect(() => {
    // 取得したいコレクションである'tasks'を指定して、コレクションのクエリを取得する
    // query collection とかは、firebase/firestoreからimportする必要がある
    const tasksCollection = query(collection(db, 'tasks'))

    // unSubscribe(登録解除)として、firestoreからの返り値を受け取る変数を用意しておく
    // onSnapshotもfirebase/firestoreからimportする必要がある
    // onSnapshotは、firestoreからデータを取得してくための関数で、第一引数には取得したいコレクションのクエリを指定する
    // onSnapshotを使うと、firestoreに何かしらの変更が起こった際に毎回情報を取得してきてくれる
    const unSub = onSnapshot(tasksCollection, (querySnapshot) => {
      // setTasks関数の中で取得してきた情報(querySnapshot)をループさせて情報を更新させる処理をする
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
        }))
      )
    })
    // このページから離脱する時やリロードされる時(このコンポーネントからunMountする時)にDOM情報を一度開放する必要がある
    // 開放する時に開放する関数をクリーンナップ関数として指定する
    // firestoreからの情報の取得を停止させるための関数がfirestoreのcollectionの帰り値(この場合、unSub)で渡ってきているので、それを指定する
    return () => unSub()
  }, [])

  const addTask = async () => {
    // firestoreにデータを追加したいときはaddDoc関数をimportして、第一引数には「どこに」を指定、第二引数には「何を」を指定する
    await addDoc(collection(db, 'tasks'), { title: input })
    setInput('')
  }

  return (
    <div className={styles.app__root}>
      <h1>Todo App by React/Firebase</h1>

      <button
        className={styles.app__logout}
        onClick={async () => {
          try {
            await signOut(auth)
            navigate('/login')
          } catch (error: any) {
            alert(error.message)
          }
        }}
      >
        <ExitToAppOutlined />
      </button>
      <br />
      <FormControl>
        <TextField
          className={classes.field}
          InputLabelProps={{ shrink: true }}
          label="New Task"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button className={styles.app__icon} disabled={!input} onClick={addTask}>
        <AddToPhotosOutlined />
      </button>

      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} />
        ))}
      </List>
    </div>
  )
}

export default App
