import React, { useState } from 'react'
import { db } from './firebase'
import { doc, collection, setDoc, deleteDoc } from 'firebase/firestore'
import { DeleteOutline, EditOutlined } from '@material-ui/icons'
import { Grid, ListItem, TextField } from '@material-ui/core'

interface Props {
  id: string
  title: string
}

const TaskItem: React.FC<Props> = (props) => {
  const [title, setTitle] = useState(props.title)

  // Firebaseのコレクションの値をRefとして取得する記述
  const tasksRef = collection(db, 'tasks')

  const editTask = async () => {
    // setDoc関数を使って、値を更新するための記述。第一引数には更新したい対象を指定、第二引数には更新したい値を指定
    await setDoc(doc(tasksRef, props.id), { title: title }, { merge: true })
  }

  const deleteTask = async () => {
    // deleteDoc関数を使って、削除したいアイテムを指定。
    await deleteDoc(doc(tasksRef, props.id))
  }

  return (
    <ListItem>
      <h2>{props.title}</h2>
      <Grid container justifyContent="flex-end">
        <TextField
          InputLabelProps={{ shrink: true }}
          label="Edit Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Grid>
      <button onClick={editTask}>
        <EditOutlined />
      </button>
      <button onClick={deleteTask}>
        <DeleteOutline />
      </button>
    </ListItem>
  )
}

export default TaskItem
