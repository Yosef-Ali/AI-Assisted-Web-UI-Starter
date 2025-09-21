"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Project, ProjectStatus, ProjectPriority } from '@/types/project-management'
import { ProjectDetailView } from './ProjectDetailView'
import { cn } from '@/lib/utils'
import {
    CalendarIcon,
    DollarSignIcon,
    ExternalLinkIcon,
    MoreHorizontalIcon,
    EditIcon,
    TrashIcon,
    PlayIcon,
    PauseIcon,
    CheckCircleIcon
} from 'lucide-react'

interface ProjectCardProps {
    project: Project
    onUpdate?: (id: string, updates: Partial<Project>) => void
    onDelete?: (id: string) => void
    className?: string
    showActions?: boolean
}

export function ProjectCard({
    project,
    onUpdate,
    onDelete,
    className,
    showActions = true
}: ProjectCardProps) {
    const [showDetails, setShowDetails] = useState(false)
    const [showActions_internal, setShowActions] = useState(false)

    const getStatusColor = (status: ProjectStatus) => {
        const colors = {
            planning: 'bg-blue-100 text-blue-800 border-blue-200',
            active: 'bg-green-100 text-green-800 border-green-200',
            review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            completed: 'bg-gray-100 text-gray-800 border-gray-200',
            on_hold: 'bg-red-100 text-red-800 border-red-200',
            archived: 'bg-gray-100 text-gray-600 border-gray-200'
        }
        return colors[status] || colors.planning
    }

    const getPriorityColor = (priority: ProjectPriority) => {
        const colors = {
            low: 'bg-gray-100 text-gray-600 border-gray-200',
            medium: 'bg-blue-100 text-blue-700 border-blue-200',
            high: 'bg-orange-100 text-orange-700 border-orange-200',
            urgent: 'bg-red-100 text-red-700 border-red-200'
        }
        return colors[priority] || colors.medium
    }

    const getPriorityIcon = (priority: ProjectPriority) => {
        switch (priority) {
            case 'urgent':
                return '🔥'
            case 'high':
                return '⚡'
            case 'medium':
                return '📋'
            case 'low':
                return '📝'
            default:
                return '📋'
        }
    }

    const getStatusIcon = (status: ProjectStatus) => {
        switch (status) {
            case 'active':
                return <PlayIcon className="h-3 w-3" />
            case 'on_hold':
                return <PauseIcon className="h-3 w-3" />
            case 'completed':
                return <CheckCircleIcon className="h-3 w-3" />
            case 'planning':
                return <CalendarIcon className="h-3 w-3" />
            default:
                return <CalendarIcon className="h-3 w-3" />
        }
    }

    const handleStatusChange = (newStatus: ProjectStatus) => {
        if (onUpdate) {
            onUpdate(project.id, { status: newStatus })
        }
    }

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(cents / 100)
    }

    const getDaysUntilDue = () => {
        if (!project.end_date) return null
        const today = new Date()
        const dueDate = new Date(project.end_date)
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const daysUntilDue = getDaysUntilDue()

    return (
        <>
            <Card
                className={cn(
                    "group relative overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer",
                    project.status === 'completed' && "opacity-75",
                    className
                )}
                onClick={() => setShowDetails(true)}
            >
                {/* Priority Indicator */}
                <div
                    className={cn(
                        "absolute top-0 right-0 w-0 h-0 border-l-[20px] border-t-[20px] border-l-transparent",
                        project.priority === 'urgent' && "border-t-red-500",
                        project.priority === 'high' && "border-t-orange-500",
                        project.priority === 'medium' && "border-t-blue-500",
                        project.priority === 'low' && "border-t-gray-400"
                    )}
                />

                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold truncate">
                                {project.name}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground mt-1">
                                {project.code}
                            </CardDescription>
                        </div>
                        {showActions && (
                            <div className="flex items-center gap-1 ml-2">
                                <span className="text-xs">{getPriorityIcon(project.priority)}</span>
                                {project.github_repo_url && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            window.open(project.github_repo_url!, '_blank')
                                        }}
                                    >
                                        <ExternalLinkIcon className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                            {project.description}
                        </p>
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Status and Type */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={cn("text-xs flex items-center gap-1", getStatusColor(project.status))}>
                            {getStatusIcon(project.status)}
                            {project.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                            {project.project_type}
                        </Badge>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{project.progress_percentage}%</span>
                        </div>
                        <Progress
                            value={project.progress_percentage}
                            className="h-2"
                            aria-label={`Project progress: ${project.progress_percentage}%`}
                        />
                    </div>

                    {/* Budget and Due Date */}
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSignIcon className="h-3 w-3" />
                            <span>
                                {project.budget_cents
                                    ? formatCurrency(project.budget_cents)
                                    : 'No budget'
                                }
                            </span>
                        </div>

                        {project.end_date && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <CalendarIcon className="h-3 w-3" />
                                <span className={cn(
                                    "text-xs",
                                    daysUntilDue !== null && daysUntilDue < 0 && "text-red-600 font-medium",
                                    daysUntilDue !== null && daysUntilDue <= 7 && daysUntilDue >= 0 && "text-orange-600 font-medium"
                                )}>
                                    {daysUntilDue !== null && (
                                        daysUntilDue < 0
                                            ? `${Math.abs(daysUntilDue)} days overdue`
                                            : daysUntilDue === 0
                                                ? 'Due today'
                                                : `${daysUntilDue} days left`
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Tech Stack */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {project.tech_stack.slice(0, 3).map((tech) => (
                                <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="text-xs px-2 py-0 h-5"
                                >
                                    {tech}
                                </Badge>
                            ))}
                            {project.tech_stack.length > 3 && (
                                <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                                    +{project.tech_stack.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>

                {/* Quick Actions */}
                {showActions && project.status !== 'completed' && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {project.status === 'active' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleStatusChange('on_hold')
                                }}
                                title="Pause project"
                            >
                                <PauseIcon className="h-3 w-3" />
                            </Button>
                        )}
                        {project.status === 'on_hold' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleStatusChange('active')
                                }}
                                title="Resume project"
                            >
                                <PlayIcon className="h-3 w-3" />
                            </Button>
                        )}
                        {project.status === 'review' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleStatusChange('completed')
                                }}
                                title="Mark as completed"
                            >
                                <CheckCircleIcon className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                )}
            </Card>

            {/* Project Details Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{project.name}</DialogTitle>
                        <DialogDescription>
                            Project details and information
                        </DialogDescription>
                    </DialogHeader>
                    <ProjectDetailView
                        project={project}
                        onUpdate={onUpdate}
                        onClose={() => setShowDetails(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}