// src/components/CVForm.jsx
import React, { useState, useRef } from 'react'
import styled from 'styled-components'

import PersonalInfo from './PersonalInfo'
import Profile from './Profile'
import Links from './Links'
import Skills from './Skills'
import Experience from './Experience'
import Education from './Education'
import Languages from './Languages'

const FormContainer = styled.div`
  min-height: 100vh;
  padding: 40px;
  background-color: #f4f6f8;
  display: flex;
  justify-content: center;
`

const Form = styled.form`
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
`

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 32px;
  color: #333;
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: ${props => (props.isFirstStep ? 'flex-end' : 'space-between')};
  margin-top: 24px;
`

const NavButton = styled.button`
  background-color: ${props => (props.primary ? '#007bff' : '#ccc')};
  color: white;
  font-size: 1rem;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.primary ? '#0056b3' : '#999')};
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`

export default function CVForm() {
    const [formData, setFormData] = useState({
        personal: {},
        profile: '',
        links: [{ name: '', url: '' }],
        skills: [],
        experience: [],
        education: [],
        languages: [],
    })

    const [step, setStep] = useState(0)
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
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        const currentRef = stepRefs[step].current
        if (currentRef?.validate) {
            const valid = currentRef.validate()
            if (!valid) return
        }
        setStep(s => s + 1)
    }

    const handlePrev = () => setStep(s => s - 1)

    const handleSubmit = async e => {
        e.preventDefault()
        const currentRef = stepRefs[step].current
        if (currentRef?.validate) {
            const valid = currentRef.validate()
            if (!valid) return
        }

        try {
            const res = await fetch('http://localhost:3000/generate', {
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
                />
            ),
        },
    ]

    const isFirstStep = step === 0
    const isLastStep = step === steps.length - 1

    return (
        <FormContainer>
            <Form onSubmit={handleSubmit}>
                <Title>{steps[step].label}</Title>
                <Title>Paso {steps[step].id} de {steps.length}</Title>
                {steps[step].component}

                <ButtonRow isFirstStep={isFirstStep}>
                    {!isFirstStep && (
                        <NavButton type="button" onClick={handlePrev}>
                            Anterior
                        </NavButton>
                    )}
                    {isLastStep ? (
                        <NavButton type="submit" primary>
                            Generar PDF
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
