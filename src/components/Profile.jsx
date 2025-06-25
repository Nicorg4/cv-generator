import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import styled from 'styled-components'

const Section = styled.fieldset`
  padding: 24px;
  margin-bottom: 24px;
  border: 2px solid #ddd;
  border-radius: 12px;
  background-color: #fafafa;
`

const Legend = styled.legend`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2f6591;
  margin-bottom: 16px;
  padding-left: 20px;
  padding-right: 20px;
`

const TextArea = styled.textarea`
  width: 90%;
  min-height: 120px;
  padding: 12px;
  border-radius: 8px;
  background-color: transparent;
  color: #2f6591;
  border: 1px solid ${props => (props.error ? '#f17778' : '#ccc')};
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${props => (props.error ? '#f17778' : '#2f6591')};
    outline: none;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #2f6591;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #1d4566;
  }

  scrollbar-width: thin;
  scrollbar-color: #2f6591 #f0f0f0;
`


const ErrorMsg = styled.span`
  color: #f17778;
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
`

const Profile = forwardRef(({ value, onChange }, ref) => {
  const [profileText, setProfileText] = useState(value || '')
  const [error, setError] = useState('')

  useEffect(() => {
    onChange(profileText)
  }, [profileText])

  const validate = () => {
    if (!profileText.trim()) {
      setError('El perfil profesional es obligatorio')
      return false
    }
    if (profileText.length > 500) {
      setError('Máximo 500 caracteres permitidos')
      return false
    }
    setError('')
    return true
  }

  useImperativeHandle(ref, () => ({
    validate,
  }))

  return (
    <Section>
      <Legend>Perfil Profesional</Legend>
      <TextArea
        value={profileText}
        onChange={e => setProfileText(e.target.value)}
        error={error}
        maxLength={500}
        placeholder="Describe tu perfil profesional (máximo 500 caracteres)"
      />
      {error && <ErrorMsg>{error}</ErrorMsg>}
    </Section>
  )
})

export default Profile
