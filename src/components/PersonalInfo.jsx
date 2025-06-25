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

const ErrorMsg = styled.span`
  color: #f17778;
  font-size: 0.875rem;
  margin-top: 4px;
`

const PersonalInfo = forwardRef(({ data, onChange }, ref) => {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    phone: data.phone || '',
    email: data.email || '',
    city: data.city || '',
    province: data.province || '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    onChange(formData)
  }, [formData])

  const validate = () => {
    const errs = {}

    if (!formData.fullName.trim()) errs.fullName = 'El nombre completo es obligatorio'
    if (!formData.phone.trim()) errs.phone = 'El teléfono es obligatorio'
    else if (!/^\+?[\d\s\-]{7,15}$/.test(formData.phone))
      errs.phone = 'Formato de teléfono inválido'

    if (!formData.email.trim()) errs.email = 'El email es obligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Formato de email inválido'

    if (!formData.city.trim()) errs.city = 'La ciudad es obligatoria'
    if (!formData.province.trim()) errs.province = 'La provincia es obligatoria'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  useImperativeHandle(ref, () => ({
    validate,
  }))

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Section>
      <Legend>Información Personal</Legend>
      <InputGroup>
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input
          id="fullName"
          placeholder='Ej: Juan Pérez'
          type="text"
          value={formData.fullName}
          onChange={e => handleChange('fullName', e.target.value)}
          error={errors.fullName}
        />
        {errors.fullName && <ErrorMsg>{errors.fullName}</ErrorMsg>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          placeholder='Ej: +54 9 11 2345-6789'
          type="tel"
          value={formData.phone}
          onChange={e => handleChange('phone', e.target.value)}
          error={errors.phone}
        />
        {errors.phone && <ErrorMsg>{errors.phone}</ErrorMsg>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder='Ej: juanperez@mail.com'
          type="email"
          value={formData.email}
          onChange={e => handleChange('email', e.target.value)}
          error={errors.email}
        />
        {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="city">Ciudad</Label>
        <Input
          id="city"
          placeholder='Ej: Capital Federal'
          type="text"
          value={formData.city}
          onChange={e => handleChange('city', e.target.value)}
          error={errors.city}
        />
        {errors.city && <ErrorMsg>{errors.city}</ErrorMsg>}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="province">Provincia</Label>
        <Input
          id="province"
          placeholder='Ej: Buenos Aires'
          type="text"
          value={formData.province}
          onChange={e => handleChange('province', e.target.value)}
          error={errors.province}
        />
        {errors.province && <ErrorMsg>{errors.province}</ErrorMsg>}
      </InputGroup>
    </Section>
  )
})

export default PersonalInfo
