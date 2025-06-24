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

const Select = styled.select`
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

const ErrorMsg = styled.span`
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 4px;
`

const LanguageItem = styled.div`
  border: 1px solid #ccc;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  background: #fff;
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

const languageLevels = [
    'Básico',
    'Intermedio',
    'Avanzado',
    'Nativo',
]

const Languages = forwardRef(({ languages, onChange }, ref) => {
    const [hasTriedSubmit, setHasTriedSubmit] = useState(false)

    const [items, setItems] = useState(
        languages.length
            ? languages
            : [
                {
                    language: '',
                    level: '',
                },
            ]
    )

    const [errors, setErrors] = useState([])

    useEffect(() => {
        onChange(items)
    }, [items])

    const validate = () => {
        setHasTriedSubmit(true)
        const errs = items.map(item => {
            const e = {}
            if (!item.language.trim()) e.language = 'El idioma es obligatorio'
            if (!item.level.trim()) e.level = 'El nivel es obligatorio'
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

    const addLanguage = () => {
        setItems(prev => [
            ...prev,
            {
                language: '',
                level: '',
            },
        ])
        setErrors(prev => [...prev, {}])
    }

    const removeLanguage = index => {
        setItems(prev => prev.filter((_, i) => i !== index))
        setErrors(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <Section>
            <Legend>Idiomas</Legend>

            {items.map((item, idx) => (
                <LanguageItem key={idx}>
                    <InputGroup>
                        <Label htmlFor={`language-${idx}`}>Idioma</Label>
                        <Input
                            id={`language-${idx}`}
                            type="text"
                            value={item.language}
                            onChange={e => handleChangeField(idx, 'language', e.target.value)}
                            error={errors[idx]?.language}
                        />
                        {hasTriedSubmit && errors[idx]?.language && <ErrorMsg>{errors[idx].language}</ErrorMsg>}
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor={`level-${idx}`}>Nivel</Label>
                        <Select
                            id={`level-${idx}`}
                            value={item.level}
                            onChange={e => handleChangeField(idx, 'level', e.target.value)}
                            error={errors[idx]?.level}
                        >
                            <option value="">Selecciona un nivel</option>
                            {languageLevels.map(level => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </Select>
                        {hasTriedSubmit && errors[idx]?.level && <ErrorMsg>{errors[idx].level}</ErrorMsg>}
                    </InputGroup>

                    {items.length > 1 && (
                        <RemoveButton type="button" onClick={() => removeLanguage(idx)}>
                            Eliminar idioma
                        </RemoveButton>
                    )}
                </LanguageItem>
            ))}

            <AddButton type="button" onClick={addLanguage}>
                + Agregar idioma
            </AddButton>
        </Section>
    )
})

export default Languages
