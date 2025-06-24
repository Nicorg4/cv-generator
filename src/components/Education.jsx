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

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`

const Label = styled.label`
  font-weight: 500;
  color: #555;
  margin-bottom: 4px;
`

const Input = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${props => (props.error ? '#dc3545' : '#ccc')};
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${props => (props.error ? '#dc3545' : '#007bff')};
    outline: none;
  }
`

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`

const ErrorMsg = styled.span`
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 4px;
`

const EducationItem = styled.div`
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  background: #fff;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`

const AddButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`

const Education = forwardRef(({ education, onChange }, ref) => {
  const [items, setItems] = useState(
    education.length
      ? education
      : [
          {
            name: '',
            institution: '',
            year: '',
            ongoing: false,
          },
        ]
  )

  const [errors, setErrors] = useState([])

  useEffect(() => {
    onChange(items)
  }, [items])

  const validate = () => {
    const errs = items.map(item => {
      const e = {}
      if (!item.name.trim()) e.name = 'El nombre es obligatorio'
      if (!item.institution.trim()) e.institution = 'La entidad es obligatoria'
      if (!item.ongoing && !item.year.trim()) e.year = 'El año es obligatorio o marcar "En curso"'
      return e
    })

    const hasErrors = errs.some(e => Object.keys(e).length > 0)
    setErrors(errs)
    return !hasErrors
  }

  useImperativeHandle(ref, () => ({
    validate,
  }))

  const handleChangeField = (index, field, value) => {
    setItems(prev => {
      const copy = [...prev]
      copy[index][field] = value
      return copy
    })
  }

  const handleCheckboxChange = (index, checked) => {
    setItems(prev => {
      const copy = [...prev]
      copy[index].ongoing = checked
      if (checked) copy[index].year = ''
      return copy
    })
  }

  const addEducation = () => {
    setItems(prev => [
      ...prev,
      {
        name: '',
        institution: '',
        year: '',
        ongoing: false,
      },
    ])
    setErrors(prev => [...prev, {}])
  }

  const removeEducation = index => {
    setItems(prev => prev.filter((_, i) => i !== index))
    setErrors(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Section>
      <Legend>Educación</Legend>

      {items.map((item, idx) => (
        <EducationItem key={idx}>
          <InputGroup>
            <Label htmlFor={`edu-name-${idx}`}>Nombre</Label>
            <Input
              id={`edu-name-${idx}`}
              type="text"
              value={item.name}
              onChange={e => handleChangeField(idx, 'name', e.target.value)}
              error={errors[idx]?.name}
            />
            {errors[idx]?.name && <ErrorMsg>{errors[idx].name}</ErrorMsg>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor={`edu-institution-${idx}`}>Entidad</Label>
            <Input
              id={`edu-institution-${idx}`}
              type="text"
              value={item.institution}
              onChange={e => handleChangeField(idx, 'institution', e.target.value)}
              error={errors[idx]?.institution}
            />
            {errors[idx]?.institution && <ErrorMsg>{errors[idx].institution}</ErrorMsg>}
          </InputGroup>

          <InputGroup>
            <CheckboxGroup>
              <input
                type="checkbox"
                id={`edu-ongoing-${idx}`}
                checked={item.ongoing}
                onChange={e => handleCheckboxChange(idx, e.target.checked)}
              />
              <Label htmlFor={`edu-ongoing-${idx}`} style={{ marginLeft: '8px' }}>
                En curso
              </Label>
            </CheckboxGroup>

            {!item.ongoing && (
              <>
                <Label htmlFor={`edu-year-${idx}`}>Año</Label>
                <Input
                  id={`edu-year-${idx}`}
                  type="text"
                  value={item.year}
                  onChange={e => handleChangeField(idx, 'year', e.target.value)}
                  error={errors[idx]?.year}
                  placeholder="Ej: 2024"
                />
                {errors[idx]?.year && <ErrorMsg>{errors[idx].year}</ErrorMsg>}
              </>
            )}
          </InputGroup>

          {items.length > 1 && (
            <RemoveButton type="button" onClick={() => removeEducation(idx)}>
              Eliminar educación
            </RemoveButton>
          )}
        </EducationItem>
      ))}

      <AddButton type="button" onClick={addEducation}>
        + Agregar educación
      </AddButton>
    </Section>
  )
})

export default Education
