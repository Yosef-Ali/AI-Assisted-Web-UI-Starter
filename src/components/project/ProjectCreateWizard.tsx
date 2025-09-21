"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { ProjectCreateInput, ProjectType, ProjectPriority } from '@/types/project-management'
import { cn } from '@/lib/utils'
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckIcon,
    CalendarIcon,
    DollarSignIcon,
    CodeIcon,
    SettingsIcon,
    FolderIcon,
    WandIcon,
    XIcon
} from 'lucide-react'

interface ProjectCreateWizardProps {
    onSuccess: (project: ProjectCreateInput) => void
    onCancel: () => void
    className?: string
}

interface WizardStep {
    id: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
}

const WIZARD_STEPS: WizardStep[] = [
    {
        id: 'basic',
        title: 'Basic Information',
        description: 'Project name, type, and description',
        icon: FolderIcon
    },
    {
        id: 'details',
        title: 'Project Details',
        description: 'Priority, timeline, and budget',
        icon: SettingsIcon
    },
    {
        id: 'technical',
        title: 'Technical Setup',
        description: 'Technology stack and repositories',
        icon: CodeIcon
    },
    {
        id: 'review',
        title: 'Review & Create',
        description: 'Review your project settings',
        icon: CheckIcon
    }
]

const TECH_STACK_OPTIONS = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript',
    'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Laravel',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase',
    'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Chakra UI',
    'Docker', 'Kubernetes', 'AWS', 'Vercel', 'Netlify', 'Railway'
]

export function ProjectCreateWizard({ onSuccess, onCancel, className }: ProjectCreateWizardProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<Partial<ProjectCreateInput>>({
        name: '',
        code: '',
        description: '',
        project_type: 'website',
        priority: 'medium',
        budget_cents: undefined,
        hourly_rate_cents: undefined,
        start_date: undefined,
        end_date: undefined,
        github_repo_url: '',
        tech_stack: []
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const updateFormData = (updates: Partial<ProjectCreateInput>) => {
        setFormData(prev => ({ ...prev, ...updates }))
        // Clear related errors
        const newErrors = { ...errors }
        Object.keys(updates).forEach(key => {
            delete newErrors[key]
        })
        setErrors(newErrors)
    }

    const generateProjectCode = (name: string) => {
        return name
            .toUpperCase()
            .replace(/[^A-Z0-9\s]/g, '')
            .split(' ')
            .map(word => word.substring(0, 3))
            .join('')
            .substring(0, 6) || 'PROJ'
    }

    const validateStep = (stepIndex: number): boolean => {
        const newErrors: Record<string, string> = {}

        switch (stepIndex) {
            case 0: // Basic Information
                if (!formData.name?.trim()) {
                    newErrors.name = 'Project name is required'
                }
                if (!formData.code?.trim()) {
                    newErrors.code = 'Project code is required'
                }
                if (!formData.project_type) {
                    newErrors.project_type = 'Project type is required'
                }
                break

            case 1: // Project Details
                if (!formData.priority) {
                    newErrors.priority = 'Priority is required'
                }
                if (formData.start_date && formData.end_date) {
                    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
                        newErrors.end_date = 'End date must be after start date'
                    }
                }
                break

            case 2: // Technical Setup
                // Optional validation for technical details
                if (formData.github_repo_url && !formData.github_repo_url.includes('github.com')) {
                    newErrors.github_repo_url = 'Please enter a valid GitHub URL'
                }
                break
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1))
        }
    }

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0))
    }

    const handleSubmit = () => {
        if (validateStep(currentStep - 1)) {
            onSuccess(formData as ProjectCreateInput)
        }
    }

    const addTechStack = (tech: string) => {
        const currentStack = formData.tech_stack || []
        if (!currentStack.includes(tech)) {
            updateFormData({ tech_stack: [...currentStack, tech] })
        }
    }

    const removeTechStack = (tech: string) => {
        const currentStack = formData.tech_stack || []
        updateFormData({ tech_stack: currentStack.filter(t => t !== tech) })
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Basic Information
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name *</Label>
                            <Input
                                id="name"
                                placeholder="My Awesome Project"
                                value={formData.name || ''}
                                onChange={(e) => {
                                    const name = e.target.value
                                    updateFormData({
                                        name,
                                        code: formData.code || generateProjectCode(name)
                                    })
                                }}
                                className={errors.name ? 'border-red-500' : ''}
                                aria-describedby={errors.name ? 'name-error' : undefined}
                            />
                            {errors.name && (
                                <p id="name-error" className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Project Code *</Label>
                            <Input
                                id="code"
                                placeholder="MYPROJ"
                                value={formData.code || ''}
                                onChange={(e) => updateFormData({ code: e.target.value.toUpperCase() })}
                                className={errors.code ? 'border-red-500' : ''}
                                aria-describedby={errors.code ? 'code-error' : undefined}
                            />
                            {errors.code && (
                                <p id="code-error" className="text-sm text-red-600">{errors.code}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                A unique identifier for your project (e.g., MYPROJ, WEBAPP)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="project_type">Project Type *</Label>
                            <Select
                                value={formData.project_type}
                                onValueChange={(value) => updateFormData({ project_type: value as ProjectType })}
                            >
                                <SelectTrigger className={errors.project_type ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select project type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="website">Website</SelectItem>
                                    <SelectItem value="app">Mobile/Desktop App</SelectItem>
                                    <SelectItem value="api">API/Backend</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.project_type && (
                                <p className="text-sm text-red-600">{errors.project_type}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                className="w-full min-h-[100px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Describe your project goals, features, and requirements..."
                                value={formData.description || ''}
                                onChange={(e) => updateFormData({ description: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">
                                Optional: Provide a detailed description of your project
                            </p>
                        </div>
                    </div>
                )

            case 1: // Project Details
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority *</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) => updateFormData({ priority: value as ProjectPriority })}
                            >
                                <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low - Not urgent</SelectItem>
                                    <SelectItem value="medium">Medium - Normal priority</SelectItem>
                                    <SelectItem value="high">High - Important</SelectItem>
                                    <SelectItem value="urgent">Urgent - Critical</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && (
                                <p className="text-sm text-red-600">{errors.priority}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="start_date" className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    Start Date
                                </Label>
                                <Input
                                    id="start_date"
                                    type="date"
                                    value={formData.start_date || ''}
                                    onChange={(e) => updateFormData({ start_date: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end_date" className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    End Date
                                </Label>
                                <Input
                                    id="end_date"
                                    type="date"
                                    value={formData.end_date || ''}
                                    onChange={(e) => updateFormData({ end_date: e.target.value })}
                                    className={errors.end_date ? 'border-red-500' : ''}
                                />
                                {errors.end_date && (
                                    <p className="text-sm text-red-600">{errors.end_date}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="budget" className="flex items-center gap-2">
                                    <DollarSignIcon className="h-4 w-4" />
                                    Total Budget
                                </Label>
                                <Input
                                    id="budget"
                                    type="number"
                                    placeholder="10000"
                                    value={formData.budget_cents ? formData.budget_cents / 100 : ''}
                                    onChange={(e) => updateFormData({
                                        budget_cents: e.target.value ? parseInt(e.target.value) * 100 : undefined
                                    })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optional: Total project budget in USD
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hourly_rate" className="flex items-center gap-2">
                                    <DollarSignIcon className="h-4 w-4" />
                                    Hourly Rate
                                </Label>
                                <Input
                                    id="hourly_rate"
                                    type="number"
                                    placeholder="75"
                                    value={formData.hourly_rate_cents ? formData.hourly_rate_cents / 100 : ''}
                                    onChange={(e) => updateFormData({
                                        hourly_rate_cents: e.target.value ? parseInt(e.target.value) * 100 : undefined
                                    })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Optional: Hourly billing rate in USD
                                </p>
                            </div>
                        </div>
                    </div>
                )

            case 2: // Technical Setup
                return (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="github_repo_url">GitHub Repository</Label>
                            <Input
                                id="github_repo_url"
                                placeholder="https://github.com/username/repo"
                                value={formData.github_repo_url || ''}
                                onChange={(e) => updateFormData({ github_repo_url: e.target.value })}
                                className={errors.github_repo_url ? 'border-red-500' : ''}
                            />
                            {errors.github_repo_url && (
                                <p className="text-sm text-red-600">{errors.github_repo_url}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Optional: Link to your project&apos;s GitHub repository
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Label>Technology Stack</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {TECH_STACK_OPTIONS.map((tech) => {
                                    const isSelected = formData.tech_stack?.includes(tech)
                                    return (
                                        <Button
                                            key={tech}
                                            variant={isSelected ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => isSelected ? removeTechStack(tech) : addTechStack(tech)}
                                            className="justify-start"
                                        >
                                            {tech}
                                        </Button>
                                    )
                                })}
                            </div>

                            {formData.tech_stack && formData.tech_stack.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-sm">Selected Technologies:</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tech_stack.map((tech) => (
                                            <Badge
                                                key={tech}
                                                variant="secondary"
                                                className="flex items-center gap-1"
                                            >
                                                {tech}
                                                <button
                                                    onClick={() => removeTechStack(tech)}
                                                    className="ml-1 hover:bg-secondary-foreground hover:text-secondary rounded-full p-0.5"
                                                >
                                                    <XIcon className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )

            case 3: // Review & Create
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <WandIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h3 className="text-lg font-semibold">Ready to Create Your Project!</h3>
                            <p className="text-muted-foreground">
                                Please review your project details below
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Name:</span>
                                        <span>{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Code:</span>
                                        <span>{formData.code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Type:</span>
                                        <Badge variant="outline" className="capitalize">
                                            {formData.project_type}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Priority:</span>
                                        <Badge variant="secondary" className="capitalize">
                                            {formData.priority}
                                        </Badge>
                                    </div>
                                    {formData.description && (
                                        <div className="pt-2">
                                            <span className="font-medium">Description:</span>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {formData.description}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {(formData.start_date || formData.end_date || formData.budget_cents || formData.hourly_rate_cents) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Project Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {formData.start_date && (
                                            <div className="flex justify-between">
                                                <span className="font-medium">Start Date:</span>
                                                <span>{new Date(formData.start_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {formData.end_date && (
                                            <div className="flex justify-between">
                                                <span className="font-medium">End Date:</span>
                                                <span>{new Date(formData.end_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                        {formData.budget_cents && (
                                            <div className="flex justify-between">
                                                <span className="font-medium">Budget:</span>
                                                <span>${(formData.budget_cents / 100).toLocaleString()}</span>
                                            </div>
                                        )}
                                        {formData.hourly_rate_cents && (
                                            <div className="flex justify-between">
                                                <span className="font-medium">Hourly Rate:</span>
                                                <span>${(formData.hourly_rate_cents / 100)}/hour</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {(formData.github_repo_url || (formData.tech_stack && formData.tech_stack.length > 0)) && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Technical Setup</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {formData.github_repo_url && (
                                            <div>
                                                <span className="font-medium">GitHub Repository:</span>
                                                <p className="text-sm text-blue-600 break-all">
                                                    {formData.github_repo_url}
                                                </p>
                                            </div>
                                        )}
                                        {formData.tech_stack && formData.tech_stack.length > 0 && (
                                            <div>
                                                <span className="font-medium">Technology Stack:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {formData.tech_stack.map((tech) => (
                                                        <Badge key={tech} variant="secondary" className="text-xs">
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <Dialog open={true} onOpenChange={() => onCancel()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <WandIcon className="h-5 w-5" />
                        Create New Project
                    </DialogTitle>
                    <DialogDescription>
                        Follow the steps below to create your new project
                    </DialogDescription>
                </DialogHeader>

                <div className={cn("space-y-6", className)}>
                    {/* Progress Indicator */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
                            <span>{Math.round(((currentStep + 1) / WIZARD_STEPS.length) * 100)}% Complete</span>
                        </div>
                        <Progress value={((currentStep + 1) / WIZARD_STEPS.length) * 100} className="h-2" />
                    </div>

                    {/* Step Navigation */}
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2">
                            {WIZARD_STEPS.map((step, index) => {
                                const isActive = index === currentStep
                                const isCompleted = index < currentStep
                                const Icon = step.icon

                                return (
                                    <div key={step.id} className="flex items-center">
                                        <div className={cn(
                                            "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                                            isActive && "border-primary bg-primary text-primary-foreground",
                                            isCompleted && "border-green-500 bg-green-500 text-white",
                                            !isActive && !isCompleted && "border-muted-foreground/30"
                                        )}>
                                            {isCompleted ? (
                                                <CheckIcon className="h-4 w-4" />
                                            ) : (
                                                <Icon className="h-4 w-4" />
                                            )}
                                        </div>
                                        {index < WIZARD_STEPS.length - 1 && (
                                            <div className={cn(
                                                "w-8 h-0.5 mx-2",
                                                isCompleted ? "bg-green-500" : "bg-muted-foreground/30"
                                            )} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Step Content */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {React.createElement(WIZARD_STEPS[currentStep].icon, { className: "h-5 w-5" })}
                                {WIZARD_STEPS[currentStep].title}
                            </CardTitle>
                            <CardDescription>
                                {WIZARD_STEPS[currentStep].description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderStepContent()}
                        </CardContent>
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={currentStep === 0 ? onCancel : handlePrev}
                            className="flex items-center gap-2"
                        >
                            {currentStep === 0 ? (
                                <>
                                    <XIcon className="h-4 w-4" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <ArrowLeftIcon className="h-4 w-4" />
                                    Previous
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={currentStep === WIZARD_STEPS.length - 1 ? handleSubmit : handleNext}
                            className="flex items-center gap-2"
                        >
                            {currentStep === WIZARD_STEPS.length - 1 ? (
                                <>
                                    <WandIcon className="h-4 w-4" />
                                    Create Project
                                </>
                            ) : (
                                <>
                                    Next
                                    <ArrowRightIcon className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}