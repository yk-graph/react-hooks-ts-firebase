import React, { useState, useEffect } from 'react'
import './App.css'
import { db } from './firebase'
import { collection, onSnapshot, query } from 'firebase/firestore'

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: '', title: '' }])

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

  return (
    <div className="App">
      {tasks.map((task) => (
        <h3 key={task.id}>{task.title}</h3>
      ))}
    </div>
  )
}

export default App
