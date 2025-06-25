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

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  flex: 1;
`

const Label = styled.label`
  font-weight: 500;
  color: #2f6591;
  margin-bottom: 4px;
  display: flex;
`

const Input = styled.input`
  padding: 10px;
  color: #2f6591;
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid ${props => (props.error ? '#f17778' : '#ccc')};
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${props => (props.error ? '#f17778' : '#2f6591')};
    outline: none;
  }
`

const ErrorMsg = styled.span`
  color: #f17778;
  font-size: 0.85rem;
  margin-top: 4px;
`

const LinkRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`

const AddButton = styled.button`
  background-color: #2f6591;
  color: white;
  padding: 8px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background-color: #479add;
  }
`

const RemoveButton = styled.button`
  background-color: #f17778;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  height: fit-content;
  margin-top: 30px;

  &:hover {
    background-color: #c82333;
  }
`

function isValidUrl(string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

const Links = forwardRef(({ links, onChange }, ref) => {
  const [linkList, setLinkList] = useState(links.length ? links : [{ name: '', url: '' }])
  const [errors, setErrors] = useState([]) // Array de errores por link [{name: '', url: ''}, ...]

  useEffect(() => {
    onChange(linkList)
  }, [linkList])

  const validate = () => {
    const errs = linkList.map(link => {
      const e = {}
      if (!link.name.trim()) e.name = 'El nombre del link es obligatorio'
      if (!link.url.trim()) e.url = 'La URL es obligatoria'
      else if (!isValidUrl(link.url)) e.url = 'Formato de URL inválido'
      return e
    })

    const hasErrors = errs.some(err => Object.keys(err).length > 0)
    setErrors(errs)

    if (linkList.length === 0) {
      setErrors([{ name: 'Debes agregar al menos un link', url: '' }])
      return false
    }

    return !hasErrors && linkList.length > 0
  }

  useImperativeHandle(ref, () => ({
    validate,
  }))

  const handleChangeField = (index, field, value) => {
    setLinkList(prev => {
      const updated = [...prev]
      updated[index][field] = value
      return updated
    })
  }

  const handleAddLink = () => {
    setLinkList(prev => [...prev, { name: '', url: '' }])
    setErrors(prev => [...prev, {}])
  }

  const handleRemoveLink = index => {
    setLinkList(prev => prev.filter((_, i) => i !== index))
    setErrors(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Section>
      <Legend>Links</Legend>

      {linkList.map((link, idx) => (
        <LinkRow key={idx}>
          <InputGroup style={{ flex: 2 }}>
            <Label htmlFor={`link-name-${idx}`}>Nombre del link</Label>
            <Input
              id={`link-name-${idx}`}
              type="text"
              value={link.name}
              onChange={e => handleChangeField(idx, 'name', e.target.value)}
              error={errors[idx]?.name}
            />
            {errors[idx]?.name && <ErrorMsg>{errors[idx].name}</ErrorMsg>}
          </InputGroup>

          <InputGroup style={{ flex: 3 }}>
            <Label htmlFor={`link-url-${idx}`}>URL</Label>
            <Input
              id={`link-url-${idx}`}
              type="url"
              value={link.url}
              onChange={e => handleChangeField(idx, 'url', e.target.value)}
              error={errors[idx]?.url}
            />
            {errors[idx]?.url && <ErrorMsg>{errors[idx].url}</ErrorMsg>}
          </InputGroup>

          {linkList.length > 1 && (
            <RemoveButton type="button" onClick={() => handleRemoveLink(idx)}>
              X
            </RemoveButton>
          )}
        </LinkRow>
      ))}

      <AddButton type="button" onClick={handleAddLink}>
        + Agregar link
      </AddButton>
    </Section>
  )
})

export default Links
