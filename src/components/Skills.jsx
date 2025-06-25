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

const CategoryContainer = styled.div`
  margin-bottom: 24px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
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
  padding: 8px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`

const Skills = forwardRef(({ skills, onChange }, ref) => {
    const [categories, setCategories] = useState(
        skills.length
            ? skills
            : [
                {
                    categoryName: '',
                    skills: [''],
                },
            ]
    )

    const [errors, setErrors] = useState([])

    useEffect(() => {
        onChange(categories)
    }, [categories])

    const validate = () => {
        const errs = categories.map(cat => {
            const errCat = {}
            if (!cat.categoryName.trim()) errCat.categoryName = 'El nombre de la categoría es obligatorio'

            if (!cat.skills.length) {
                errCat.skills = ['Debe haber al menos una skill']
            } else {
                const skillErrs = cat.skills.map(skill =>
                    skill.trim() ? '' : 'El nombre de la skill es obligatorio'
                )
                errCat.skills = skillErrs
            }

            return errCat
        })

        const hasErrors = errs.some(
            e =>
                e.categoryName ||
                (e.skills && e.skills.some(skillErr => skillErr !== ''))
        )

        setErrors(errs)
        return !hasErrors
    }

    useImperativeHandle(ref, () => ({
        validate,
    }))

    const handleCategoryNameChange = (index, value) => {
        setCategories(prev => {
            const copy = [...prev]
            copy[index].categoryName = value
            return copy
        })
    }

    const handleSkillChange = (catIndex, skillIndex, value) => {
        setCategories(prev =>
            prev.map((cat, i) => {
                if (i !== catIndex) return cat

                const updatedSkills = cat.skills.map((s, idx) =>
                    idx === skillIndex ? value : s
                )
                return { ...cat, skills: updatedSkills }
            })
        )
    }


    const addCategory = () => {
        setCategories(prev => [...prev, { categoryName: '', skills: [''] }])
        setErrors(prev => [...prev, {}])
    }

    const removeCategory = index => {
        setCategories(prev => prev.filter((_, i) => i !== index))
        setErrors(prev => prev.filter((_, i) => i !== index))
    }

    const addSkill = catIndex => {
        setCategories(prev =>
            prev.map((cat, i) => {
                if (i !== catIndex) return cat

                return {
                    ...cat,
                    skills: [...cat.skills, ''],
                }
            })
        )
    }



    const removeSkill = (catIndex, skillIndex) => {
        setCategories(prev => {
            return prev.map((cat, i) => {
                if (i !== catIndex) return cat

                const newSkills = cat.skills.filter((_, idx) => idx !== skillIndex)
                return {
                    ...cat,
                    skills: newSkills,
                }
            })
        })
    }


    return (
        <Section>
            <Legend>Habilidades</Legend>

            {categories.map((cat, catIdx) => (
                <CategoryContainer key={catIdx}>
                    <InputGroup>
                        <Label htmlFor={`cat-name-${catIdx}`}>Nombre de la categoría</Label>
                        <Input
                            id={`cat-name-${catIdx}`}
                            placeholder='Ej: Lenguajes de programación'
                            type="text"
                            value={cat.categoryName}
                            onChange={e => handleCategoryNameChange(catIdx, e.target.value)}
                            error={errors[catIdx]?.categoryName}
                        />
                        {errors[catIdx]?.categoryName && <ErrorMsg>{errors[catIdx].categoryName}</ErrorMsg>}
                    </InputGroup>

                    {cat.skills.map((skill, skillIdx) => (
                        <InputGroup key={`cat-${catIdx}-skill-${skillIdx}`}>
                            <Label>Habilidad</Label>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Input
                                    type="text"
                                    placeholder='Ej: JavaScript'
                                    value={skill}
                                    onChange={e => handleSkillChange(catIdx, skillIdx, e.target.value)}
                                    error={errors[catIdx]?.skills?.[skillIdx]}
                                    style={{ flex: 1 }}
                                />
                                {cat.skills.length > 1 && (
                                    <RemoveButton type="button" onClick={() => removeSkill(catIdx, skillIdx)}>
                                        X
                                    </RemoveButton>
                                )}
                            </div>
                            {errors[catIdx]?.skills?.[skillIdx] && <ErrorMsg>{errors[catIdx].skills[skillIdx]}</ErrorMsg>}
                        </InputGroup>
                    ))}

                    <AddButton type="button" onClick={() => addSkill(catIdx)}>
                        + Agregar skill
                    </AddButton>

                    {categories.length > 1 && (
                        <RemoveButton type="button" onClick={() => removeCategory(catIdx)} style={{ marginLeft: '12px' }}>
                            Eliminar categoría
                        </RemoveButton>
                    )}
                </CategoryContainer>
            ))}

            <AddButton type="button" onClick={addCategory}>
                + Agregar categoría
            </AddButton>
        </Section>
    )
})

export default Skills
