import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SURVEY_QUESTIONS } from '../data/survey'
import { storage, STORAGE_KEYS } from '../utils/storage'
import './OnboardingSurvey.css'

function OnboardingSurvey() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [survey, setSurvey] = useState({
    hasPain: null,
    painAreas: [],
    fitnessLevel: null,
    goal: null
  })

  const steps = [
    { key: 'hasPain', question: SURVEY_QUESTIONS.hasPain },
    { key: 'painAreas', question: SURVEY_QUESTIONS.painAreas, conditional: survey.hasPain === true },
    { key: 'fitnessLevel', question: SURVEY_QUESTIONS.fitnessLevel },
    { key: 'goal', question: SURVEY_QUESTIONS.goal }
  ]

  const activeSteps = steps.filter((step, index) => {
    if (step.conditional === false) return false
    return true
  })

  const currentQuestion = activeSteps[currentStep]

  const handleAnswer = (value) => {
    const newSurvey = { ...survey }
    
    if (currentQuestion.key === 'painAreas') {
      // Toggle pour sélection multiple
      const newPainAreas = survey.painAreas.includes(value)
        ? survey.painAreas.filter(area => area !== value)
        : [...survey.painAreas, value]
      newSurvey.painAreas = newPainAreas
    } else {
      newSurvey[currentQuestion.key] = value
    }

    setSurvey(newSurvey)
  }

  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Sauvegarder et rediriger
      storage.set(STORAGE_KEYS.USER_SURVEY, survey)
      navigate('/exercises')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/')
    }
  }

  const isNextDisabled = () => {
    if (currentQuestion.key === 'painAreas') {
      return survey.painAreas.length === 0 && survey.hasPain === true
    }
    return survey[currentQuestion.key] === null
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="survey-page">
      <div className="container">
        <div className="survey-header">
          <button className="btn-back" onClick={handleBack}>
            ← Retour
          </button>
          <div className="survey-progress">
            <div 
              className="survey-progress-bar"
              style={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
            />
          </div>
          <div className="survey-step-indicator">
            Étape {currentStep + 1} sur {activeSteps.length}
          </div>
        </div>

        <div className="survey-content fade-in">
          <h2 className="survey-question">
            {currentQuestion.question.question}
          </h2>

          <div className="survey-options">
            {currentQuestion.question.options.map((option, index) => {
              const optionValue = typeof option === 'string' ? option : option.id
              const optionLabel = typeof option === 'string' ? option : option.label
              const isSelected = currentQuestion.key === 'painAreas'
                ? survey.painAreas.includes(optionValue)
                : survey[currentQuestion.key] === optionValue

              return (
                <div
                  key={index}
                  className={`survey-option card-flip ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleAnswer(optionValue)}
                >
                  <div className="card-flip-inner">
                    <div className="survey-option-front">
                      {optionLabel}
                    </div>
                    <div className="survey-option-back">
                      ✓ {optionLabel}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="survey-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={handleNext}
              disabled={isNextDisabled()}
            >
              {currentStep < activeSteps.length - 1 ? 'Suivant' : 'Terminer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingSurvey

