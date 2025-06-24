import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import styled from 'styled-components'

const Section = styled.fieldset`
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fafafa;
`

const Legend = styled.legend`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${props => (props.error ? '#dc3545' : '#ccc')};
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${props => (props.error ? '#dc3545' : '#007bff')};
    outline: none;
  }
`

const ErrorMsg = styled.span`
  color: #dc3545;
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
