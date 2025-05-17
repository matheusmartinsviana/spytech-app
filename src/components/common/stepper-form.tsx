'use client'

import { useEffect, useState } from 'react'
import StepCompany from './stepper/company'
import StepSegment from './stepper/segment'
import StepWebsite from './stepper/website'
import StepDescription from './stepper/description'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { saveCompanyProfile } from '@/actions/user-company-profile'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'

type Props = {
    email: string
}

const StepperForm = ({ email }: Props) => {
    const [data, setData] = useState({
        company_name: '',
        segment: '',
        website: '',
        description: '',
        filled: true,
    })
    const [seconds, setSeconds] = useState(4)
    const [activeStep, setActiveStep] = useState(0)
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (showSuccess) {
            timer = setInterval(() => {
                setSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [showSuccess])

    const steps = [
        <StepCompany data={data} setData={setData} />,
        <StepSegment data={data} setData={setData} />,
        <StepWebsite data={data} setData={setData} />,
        <StepDescription data={data} setData={setData} />,
    ]

    const stepMessages = [
        'Qual o nome da sua empresa?',
        'Em que segmento você atua?',
        'Você já tem um site? Insira aqui.',
        'Fale um pouco sobre sua empresa.',
    ]

    const validateStep = () => {
        switch (activeStep) {
            case 0:
                if (!data.company_name.trim()) {
                    toast.warning('Ops! O nome da empresa é essencial para continuar.')
                    return false
                }
                break
            case 1:
                if (!data.segment.trim()) {
                    toast.warning('Nos diga qual o segmento da sua empresa.')
                    return false
                }
                break
            case 2:
                const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-]*)*\/?$/
                if (!data.website.trim()) {
                    toast.warning('Seu site ajuda a gente a entender mais sobre você.')
                    return false
                }
                if (!websiteRegex.test(data.website.trim())) {
                    toast.warning('Por favor, insira um website válido.')
                    return false
                }
                break
            case 3:
                if (!data.description.trim()) {
                    toast.warning('Uma boa descrição faz toda a diferença.')
                    return false
                }
                break
        }
        return true
    }

    const handleNext = () => {
        if (validateStep()) {
            setActiveStep((prev) => prev + 1)
        }
    }

    const handleSubmit = async () => {
        if (!validateStep()) return

        try {
            await saveCompanyProfile({ ...data }, email)
            setShowSuccess(true)
            toast.success('Seu perfil foi salvo com sucesso!')
            setTimeout(() => redirect('/'), 4000)
        } catch (error) {
            toast.error('Algo deu errado ao salvar 😢')
            console.error(error)
        }
    }

    return (
        <motion.div
            className="flex flex-col items-center justify-center w-full min-h-screen p-6 bg-gray-50 dark:bg-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {showSuccess ? (
                <motion.div
                    className="bg-white dark:bg-gray-800 border border-green-400 px-8 py-6 rounded-2xl shadow-xl text-center max-w-xl mx-auto"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="flex justify-center mb-5 relative"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: 'easeInOut',
                        }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            {['✨', '🚀', '🎉', '🌟'].map((emoji, index) => (
                                <motion.div
                                    key={index}
                                    className="absolute text-2xl"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0.5, 1.2, 1],
                                        x: [0, (index - 1.5) * 30],
                                        y: [0, -50 - index * 10],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: index * 0.2,
                                        repeat: Infinity,
                                    }}
                                >
                                    {emoji}
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full z-10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-12 h-12 text-green-600 dark:text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 12l5 5L20 7"
                                />
                            </svg>
                        </div>
                    </motion.div>

                    <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 mb-2">Tudo certo! 🚀</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Agora você pode explorar sua concorrência e tomar decisões com mais segurança.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Você será redirecionado em instantes... {seconds}s
                    </p>
                </motion.div>
            ) : (
                <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Perfil da Empresa</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-base mt-1">{stepMessages[activeStep]}</p>
                    </div>
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6"
                    >
                        {steps[activeStep]}
                    </motion.div>
                    <div className="flex justify-between">
                        <Button
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep((prev) => prev - 1)}
                            variant="outline"
                            className="text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            Voltar
                        </Button>
                        {activeStep < steps.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Avançar
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Finalizar
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    )
}

export default StepperForm
