import React, { useState } from 'react'
import { Grid, ListItem, TextField } from '@material-ui/core'
import { DeleteOutlined, EditOutlined } from '@material-ui/icons'
import { db } from './firebase'
import styles from './TaskItem.module.css'

interface Props {
  id: string
  title: string
}

const TaskItem: React.FC<Props> = (props) => {
  const [title, setTitle] = useState(props.title)

  const editTask = () => {
    db.collection('tasks').doc(props.id).set({ title: title }, { merge: true })
  }

  const deleteTask = () => {
    db.collection('tasks').doc(props.id).delete()
  }

  return (
    <ListItem>
      <h2>{props.title}</h2>
      <Grid container justifyContent="flex-end">
        <TextField
          InputLabelProps={{ shrink: true }}
          value={title}
          label="Edit Task"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
        <button className={styles.taskitem__icon} onClick={editTask}>
          <EditOutlined />
        </button>
        <button className={styles.taskitem__icon} onClick={deleteTask}>
          <DeleteOutlined />
        </button>
      </Grid>
    </ListItem>
  )
}

export default TaskItem
