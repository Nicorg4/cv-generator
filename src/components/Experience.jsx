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

  &::-webkit-calendar-picker-indicator {
    filter: invert(32%) sepia(29%) saturate(838%) hue-rotate(166deg) brightness(92%) contrast(89%);
  }
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

const ExperienceItem = styled.div`
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

function isValidDate(dateStr) {
  // Formato YYYY-MM o YYYY-MM-DD
  return /^\d{4}-(0[1-9]|1[0-2])(-\d{2})?$/.test(dateStr)
}

const Experience = forwardRef(({ experience, onChange }, ref) => {
  const [items, setItems] = useState(
    experience.length
      ? experience
      : [
          {
            position: '',
            company: '',
            startDate: '',
            endDate: '',
            currentlyWorking: false,
            description: '',
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
      if (!item.position.trim()) e.position = 'El puesto es obligatorio'
      if (!item.company.trim()) e.company = 'La empresa es obligatoria'
      if (!item.startDate.trim()) e.startDate = 'La fecha de inicio es obligatoria'
      else if (!isValidDate(item.startDate)) e.startDate = 'Formato de fecha inválido (YYYY-MM o YYYY-MM-DD)'

      if (!item.currentlyWorking) {
        if (!item.endDate.trim()) e.endDate = 'La fecha de finalización es obligatoria o marcar que trabaja actualmente'
        else if (!isValidDate(item.endDate)) e.endDate = 'Formato de fecha inválido (YYYY-MM o YYYY-MM-DD)'
      }

      if (!item.description.trim()) e.description = 'La descripción es obligatoria'
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
      copy[index].currentlyWorking = checked
      if (checked) copy[index].endDate = ''
      return copy
    })
  }

  const addExperience = () => {
    setItems(prev => [
      ...prev,
      {
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
      },
    ])
    setErrors(prev => [...prev, {}])
  }

  const removeExperience = index => {
    setItems(prev => prev.filter((_, i) => i !== index))
    setErrors(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Section>
      <Legend>Experiencia Laboral</Legend>

      {items.map((item, idx) => (
        <ExperienceItem key={idx}>
          <InputGroup>
            <Label htmlFor={`position-${idx}`}>Puesto</Label>
            <Input
              id={`position-${idx}`}
              placeholder='Puesto de trabajo'
              type="text"
              value={item.position}
              onChange={e => handleChangeField(idx, 'position', e.target.value)}
              error={errors[idx]?.position}
            />
            {errors[idx]?.position && <ErrorMsg>{errors[idx].position}</ErrorMsg>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor={`company-${idx}`}>Empresa</Label>
            <Input
              id={`company-${idx}`}
              placeholder='Nombre de la empresa'
              type="text"
              value={item.company}
              onChange={e => handleChangeField(idx, 'company', e.target.value)}
              error={errors[idx]?.company}
            />
            {errors[idx]?.company && <ErrorMsg>{errors[idx].company}</ErrorMsg>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor={`startDate-${idx}`}>Fecha de inicio</Label>
            <Input
              id={`startDate-${idx}`}
              type="month"
              value={item.startDate}
              onChange={e => handleChangeField(idx, 'startDate', e.target.value)}
              error={errors[idx]?.startDate}
            />
            {errors[idx]?.startDate && <ErrorMsg>{errors[idx].startDate}</ErrorMsg>}
          </InputGroup>

          <InputGroup>
            <CheckboxGroup>
              <input
                type="checkbox"
                id={`currentlyWorking-${idx}`}
                checked={item.currentlyWorking}
                onChange={e => handleCheckboxChange(idx, e.target.checked)}
                style={{ marginRight: '5px', width: '15px', height: '15px' }}
              />
              <Label htmlFor={`currentlyWorking-${idx}`} style={{ marginLeft: '5px' }}>
                Actualmente trabajo acá
              </Label>
            </CheckboxGroup>

            {!item.currentlyWorking && (
              <>
                <Label htmlFor={`endDate-${idx}`}>Fecha de finalización</Label>
                <Input
                  id={`endDate-${idx}`}
                  type="month"
                  value={item.endDate}
                  onChange={e => handleChangeField(idx, 'endDate', e.target.value)}
                  error={errors[idx]?.endDate}
                />
                {errors[idx]?.endDate && <ErrorMsg>{errors[idx].endDate}</ErrorMsg>}
              </>
            )}
          </InputGroup>

          <InputGroup>
            <Label htmlFor={`description-${idx}`}>Descripción</Label>
            <TextArea
              id={`description-${idx}`}
              placeholder='Descripción de tus responsabilidades y logros'
              value={item.description}
              onChange={e => handleChangeField(idx, 'description', e.target.value)}
              error={errors[idx]?.description}
            />
            {errors[idx]?.description && <ErrorMsg>{errors[idx].description}</ErrorMsg>}
          </InputGroup>

          {items.length > 1 && (
            <RemoveButton type="button" onClick={() => removeExperience(idx)}>
              Eliminar experiencia
            </RemoveButton>
          )}
        </ExperienceItem>
      ))}

      <AddButton type="button" onClick={addExperience}>
        + Agregar experiencia
      </AddButton>
    </Section>
  )
})

export default Experience