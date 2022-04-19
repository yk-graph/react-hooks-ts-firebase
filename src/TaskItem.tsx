import React, { memo, useState } from 'react'
import { DeleteOutline, EditOutlined } from '@mui/icons-material'
import { Grid, ListItem, TextField } from '@mui/material'
import { doc, setDoc, deleteDoc } from 'firebase/firestore'

import { db } from './firebase'
import { TaskType } from './types/Task'

interface Props {
  task: TaskType
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const [title, setTitle] = useState(task.title)

  const taskRef = doc(db, 'tasks', task.id)

  const editTask = async () =>
    await setDoc(taskRef, { title: title }, { merge: true })

  const deleteTask = async () => await deleteDoc(taskRef)

  return (
    <ListItem>
      <h2>{task.title}</h2>
      <Grid container justifyContent="flex-end">
        <TextField
          InputLabelProps={{ shrink: true }}
          label="Edit Task"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
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

export default memo(TaskItem)
