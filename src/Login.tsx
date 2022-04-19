import React, { memo, useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Button, FormControl, TextField, Typography } from '@mui/material'

import { auth } from './firebase'
import styles from './Login.module.css'

const Login: React.FC = () => {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user && navigate('/')
    })
    return () => unsubscribe()
  }, [navigate])

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch {
      alert('ログインできませんでした')
    }
  }
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch {
      alert('ログインできませんでした')
    }
  }

  return (
    <div className={styles.login__root}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="email"
          label="E-mail"
          value={email}
          variant="standard"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value)
          }}
        />
      </FormControl>
      <br />
      <FormControl>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          name="password"
          label="Password"
          type="password"
          variant="standard"
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value)
          }}
        />
      </FormControl>
      <br />
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={isLogin ? handleLogin : handleRegister}
      >
        {isLogin ? 'login' : 'register'}
      </Button>
      <br />
      <Typography align="center">
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Create new account ?' : 'Back to login'}
        </span>
      </Typography>
    </div>
  )
}

export default memo(Login)
