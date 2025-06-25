import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

import PersonalInfo from './PersonalInfo'
import Profile from './Profile'
import Links from './Links'
import Skills from './Skills'
import Experience from './Experience'
import Education from './Education'
import Languages from './Languages'

const FormContainer = styled.div`
  padding: 40px;
  background-color: transparent;
  display: flex;
  justify-content: center;
`

const Form = styled.form`
  width: 100%;
  max-width: 800px;
  min-width: 500px;
  background-color: #fff;
  padding: 20px 50px 20px 50px;
  border-radius: 16px;
  border: 1px solid #ddd;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  color: #2f6591;
  margin-bottom: 10px;
`
const Steps = styled.h2`
  font-size: 1.3;
  text-align: center;
  color: #479add;
  margin-top: 0px;
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: ${props => (props.isFirstStep ? 'flex-end' : 'space-between')};
  margin-top: 24px;
`

const NavButton = styled.button`
  background-color: ${props => (props.primary ? '#2f6591' : '#ccc')};
  color: white;
  font-size: 1rem;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

  &:hover {
    background-color: ${props => (props.primary ? '#479add' : '#999')};
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`

const SpinningLoader = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2f6591;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const LanguageButton = styled.button`
  background-color: #ffffff;
  color: #2f6591;
  font-size: 1.2rem;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  transition: all 0.3s ease;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  &:hover {
    background-color: #479add;
    color: #ffffff;
  }
`

export default function CVForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        personal: {},
        profile: '',
        links: [{ name: '', url: '' }],
        skills: [],
        experience: [],
        education: [],
        languages: [],
        language: 'es'
    })

    const [step, setStep] = useState(0)
    const [hasInteracted, setHasInteracted] = useState(false)
    const stepRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ]

    const updateField = (field, value) => {
        setHasInteracted(true)
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const toggleLanguage = () => {
        setFormData(prev => ({
            ...prev,
            language: prev.language === 'es' ? 'en' : 'es'
        }))
    }

    const handleNext = () => {
        const currentRef = stepRefs[step].current
        if (currentRef?.validate) {
            const valid = currentRef.validate()
            if (!valid) return
        }
        setStep(s => s + 1)
        setHasInteracted(false)
    }

    const handlePrev = () => {
        setStep(s => s - 1)
        setHasInteracted(false)
    }

    const URL = import.meta.env.VITE_API_URL

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)
        setHasInteracted(true)
        const currentRef = stepRefs[step].current
        if (currentRef?.validate) {
            const valid = currentRef.validate()
            if (!valid) {
                setIsLoading(false)
                return
            }
        }

        try {
            const res = await fetch(`${URL}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Error generando PDF')

            const blob = await res.blob()
            const url = window.URL.createObjectURL(blob)
            window.open(url, '_blank')
        } catch (err) {
            console.error('Error al generar el PDF:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const steps = [
        {
            id: 1,
            label: 'Información Personal',
            component: (
                <PersonalInfo
                    ref={stepRefs[0]}
                    data={formData.personal}
                    onChange={data => updateField('personal', data)}
                />
            ),
        },
        {
            id: 2,
            label: 'Perfil Profesional',
            component: (
                <Profile
                    ref={stepRefs[1]}
                    value={formData.profile}
                    onChange={data => updateField('profile', data)}
                />
            ),
        },
        {
            id: 3,
            label: 'Links',
            component: (
                <Links
                    ref={stepRefs[2]}
                    links={formData.links}
                    onChange={data => updateField('links', data)}
                />
            ),
        },
        {
            id: 4,
            label: 'Skills',
            component: (
                <Skills
                    ref={stepRefs[3]}
                    skills={formData.skills}
                    onChange={data => updateField('skills', data)}
                />
            ),
        },
        {
            id: 5,
            label: 'Experiencia Laboral',
            component: (
                <Experience
                    ref={stepRefs[4]}
                    experience={formData.experience}
                    onChange={data => updateField('experience', data)}
                />
            ),
        },
        {
            id: 6,
            label: 'Educación',
            component: (
                <Education
                    ref={stepRefs[5]}
                    education={formData.education}
                    onChange={data => updateField('education', data)}
                />
            ),
        },
        {
            id: 7,
            label: 'Idiomas',
            component: (
                <Languages
                    ref={stepRefs[6]}
                    languages={formData.languages}
                    onChange={data => updateField('languages', data)}
                    hasInteracted={hasInteracted}
                />
            ),
        },
    ]

    const isFirstStep = step === 0
    const isLastStep = step === steps.length - 1

    return (
        <FormContainer>
            <Form
                onSubmit={handleSubmit}
                autoComplete="off"
                onKeyDown={e => {
                    if (isLastStep && e.key === 'Enter') {
                        e.preventDefault()
                    }
                }}
            >
                <input type="submit" style={{ display: 'none' }} disabled />

                <LanguageButton type="button" onClick={toggleLanguage}>
                    {formData.language === 'es' ? 'Crear en inglés' : 'Crear en español'}
                </LanguageButton>
                <Title>{steps[step].label}</Title>
                <Steps>Paso {steps[step].id} de {steps.length}</Steps>
                {steps[step].component}
                <ButtonRow isFirstStep={isFirstStep}>
                    {!isFirstStep && (
                        <NavButton type="button" onClick={handlePrev}>
                            Anterior
                        </NavButton>
                    )}
                    {isLastStep ? (
                        <NavButton type="submit" primary>
                            {isLoading ? <SpinningLoader /> : 'Generar PDF'}
                        </NavButton>
                    ) : (
                        <NavButton type="button" primary onClick={handleNext}>
                            Siguiente
                        </NavButton>
                    )}
                </ButtonRow>
            </Form>
        </FormContainer>
    )
}