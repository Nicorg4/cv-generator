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
  margin-bottom: 16px;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  justify-content: center;
`

const ErrorMsg = styled.span`
  color: #f17778;
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
            startYear: '',
            endYear: '',
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
      if (!item.startYear.trim()) e.startYear = 'El año de inicio es obligatorio'
      if (!item.ongoing && !item.endYear.trim()) e.endYear = 'El año de finalización es obligatorio o marcar "En curso"'
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
      if (checked) copy[index].endYear = ''
      return copy
    })
  }

  const addEducation = () => {
    setItems(prev => [
      ...prev,
      {
        name: '',
        institution: '',
        startYear: '',
        endYear: '',
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
              placeholder='Ej: Ingeniería Informática'
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
              placeholder='Ej: Universidad Católica Argentina'
              error={errors[idx]?.institution}
            />
            {errors[idx]?.institution && <ErrorMsg>{errors[idx].institution}</ErrorMsg>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor={`edu-startYear-${idx}`}>Año de inicio</Label>
            <Input
              id={`edu-startYear-${idx}`}
              type="text"
              value={item.startYear}
              onChange={e => handleChangeField(idx, 'startYear', e.target.value)}
              placeholder="Ej: 2020"
              error={errors[idx]?.startYear}
            />
            {errors[idx]?.startYear && <ErrorMsg>{errors[idx].startYear}</ErrorMsg>}
          </InputGroup>

          <InputGroup>
            <CheckboxGroup>
              <input
                type="checkbox"
                id={`edu-ongoing-${idx}`}
                checked={item.ongoing}
                onChange={e => handleCheckboxChange(idx, e.target.checked)}
                style={{ marginRight: '5px', width: '15px', height: '15px' }}
              />
              <Label htmlFor={`edu-ongoing-${idx}`} style={{ marginLeft: '8px' }}>
                En curso
              </Label>
            </CheckboxGroup>

            {!item.ongoing && (
              <>
                <Label htmlFor={`edu-endYear-${idx}`}>Año de finalización</Label>
                <Input
                  id={`edu-endYear-${idx}`}
                  type="text"
                  value={item.endYear}
                  onChange={e => handleChangeField(idx, 'endYear', e.target.value)}
                  error={errors[idx]?.endYear}
                  placeholder="Ej: 2024"
                />
                {errors[idx]?.endYear && <ErrorMsg>{errors[idx].endYear}</ErrorMsg>}
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