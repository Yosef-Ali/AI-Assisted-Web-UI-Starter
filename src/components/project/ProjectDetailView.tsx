"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Project, ProjectStatus, ProjectPriority, ProjectType } from '@/types/project-management'
import { cn } from '@/lib/utils'
import {
    CalendarIcon,
    DollarSignIcon,
    ExternalLinkIcon,
    GithubIcon,
    ServerIcon,
    EditIcon,
    SaveIcon,
    XIcon,
    ClockIcon,
    UserIcon,
    CodeIcon,
    BarChart3Icon,
    FileTextIcon,
    SettingsIcon
} from 'lucide-react'

interface ProjectDetailViewProps {
    project: Project
    onUpdate?: (id: string, updates: Partial<Project>) => void
    onClose?: () => void
    className?: string
}

export function ProjectDetailView({
    project,
    onUpdate,
    onClose,
    className
}: ProjectDetailViewProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedProject, setEditedProject] = useState<Partial<Project>>(project)

    const handleSave = () => {
        if (onUpdate) {
            onUpdate(project.id, editedProject)
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditedProject(project)
        setIsEditing(false)
    }

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
            low: 'bg-gray-100 text-gray-600',
            medium: 'bg-blue-100 text-blue-700',
            high: 'bg-orange-100 text-orange-700',
            urgent: 'bg-red-100 text-red-700'
        }
        return colors[priority] || colors.medium
    }

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getDuration = () => {
        if (!project.start_date || !project.end_date) return null
        const start = new Date(project.start_date)
        const end = new Date(project.end_date)
        const diffTime = end.getTime() - start.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 30) return `${diffDays} days`
        if (diffDays < 365) return `${Math.round(diffDays / 30)} months`
        return `${Math.round(diffDays / 365)} years`
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">{project.name}</h2>
                        <Badge className={getStatusColor(project.status)}>
                            {project.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                            {project.priority}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">{project.code}</p>
                    {project.description && (
                        <p className="text-sm text-muted-foreground max-w-2xl">
                            {project.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2"
                        >
                            <EditIcon className="h-4 w-4" />
                            Edit
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancel}
                                className="flex items-center gap-2"
                            >
                                <XIcon className="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSave}
                                className="flex items-center gap-2"
                            >
                                <SaveIcon className="h-4 w-4" />
                                Save
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="tech">Tech Stack</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Status Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Select
                                        value={editedProject.status}
                                        onValueChange={(value) => setEditedProject({ ...editedProject, status: value as ProjectStatus })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="planning">Planning</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="review">Review</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="on_hold">On Hold</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Badge className={getStatusColor(project.status)}>
                                        {project.status.replace('_', ' ')}
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>

                        {/* Progress Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Progress</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold">{project.progress_percentage}%</span>
                                        {isEditing && (
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={editedProject.progress_percentage}
                                                onChange={(e) => setEditedProject({
                                                    ...editedProject,
                                                    progress_percentage: parseInt(e.target.value) || 0
                                                })}
                                                className="w-20 h-8"
                                            />
                                        )}
                                    </div>
                                    <Progress value={project.progress_percentage} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Budget Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <DollarSignIcon className="h-4 w-4" />
                                    Budget
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Input
                                        type="number"
                                        placeholder="Budget in dollars"
                                        value={editedProject.budget_cents ? editedProject.budget_cents / 100 : ''}
                                        onChange={(e) => setEditedProject({
                                            ...editedProject,
                                            budget_cents: (parseFloat(e.target.value) || 0) * 100
                                        })}
                                    />
                                ) : (
                                    <span className="text-2xl font-bold">
                                        {project.budget_cents
                                            ? formatCurrency(project.budget_cents)
                                            : 'No budget set'
                                        }
                                    </span>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Start Date</Label>
                                    {isEditing ? (
                                        <Input
                                            type="date"
                                            value={editedProject.start_date || ''}
                                            onChange={(e) => setEditedProject({ ...editedProject, start_date: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm">
                                            {project.start_date ? formatDate(project.start_date) : 'Not set'}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">End Date</Label>
                                    {isEditing ? (
                                        <Input
                                            type="date"
                                            value={editedProject.end_date || ''}
                                            onChange={(e) => setEditedProject({ ...editedProject, end_date: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm">
                                            {project.end_date ? formatDate(project.end_date) : 'Not set'}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <p className="text-sm">
                                        {getDuration() || 'Not calculated'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Links */}
                    {(project.github_repo_url || isEditing) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ExternalLinkIcon className="h-5 w-5" />
                                    Links
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <GithubIcon className="h-4 w-4" />
                                        GitHub Repository
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            placeholder="https://github.com/username/repo"
                                            value={editedProject.github_repo_url || ''}
                                            onChange={(e) => setEditedProject({ ...editedProject, github_repo_url: e.target.value })}
                                        />
                                    ) : project.github_repo_url ? (
                                        <a
                                            href={project.github_repo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                            {project.github_repo_url}
                                            <ExternalLinkIcon className="h-3 w-3" />
                                        </a>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No repository linked</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Project Name</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedProject.name || ''}
                                            onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm">{project.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Project Code</Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedProject.code || ''}
                                            onChange={(e) => setEditedProject({ ...editedProject, code: e.target.value })}
                                        />
                                    ) : (
                                        <p className="text-sm">{project.code}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    {isEditing ? (
                                        <textarea
                                            className="w-full min-h-[100px] p-2 border rounded-md"
                                            value={editedProject.description || ''}
                                            onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                                            placeholder="Project description..."
                                        />
                                    ) : (
                                        <p className="text-sm">{project.description || 'No description provided'}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Project Type</Label>
                                    {isEditing ? (
                                        <Select
                                            value={editedProject.project_type}
                                            onValueChange={(value) => setEditedProject({ ...editedProject, project_type: value as ProjectType })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="website">Website</SelectItem>
                                                <SelectItem value="app">App</SelectItem>
                                                <SelectItem value="api">API</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge variant="outline" className="capitalize">
                                            {project.project_type}
                                        </Badge>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    {isEditing ? (
                                        <Select
                                            value={editedProject.priority}
                                            onValueChange={(value) => setEditedProject({ ...editedProject, priority: value as ProjectPriority })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="urgent">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Badge className={getPriorityColor(project.priority)}>
                                            {project.priority}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Budget</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            placeholder="Budget in dollars"
                                            value={editedProject.budget_cents ? editedProject.budget_cents / 100 : ''}
                                            onChange={(e) => setEditedProject({
                                                ...editedProject,
                                                budget_cents: (parseFloat(e.target.value) || 0) * 100
                                            })}
                                        />
                                    ) : (
                                        <p className="text-sm">
                                            {project.budget_cents
                                                ? formatCurrency(project.budget_cents)
                                                : 'No budget set'
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Hourly Rate</Label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            placeholder="Hourly rate in dollars"
                                            value={editedProject.hourly_rate_cents ? editedProject.hourly_rate_cents / 100 : ''}
                                            onChange={(e) => setEditedProject({
                                                ...editedProject,
                                                hourly_rate_cents: (parseFloat(e.target.value) || 0) * 100
                                            })}
                                        />
                                    ) : (
                                        <p className="text-sm">
                                            {project.hourly_rate_cents
                                                ? `${formatCurrency(project.hourly_rate_cents)}/hour`
                                                : 'No hourly rate set'
                                            }
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3Icon className="h-5 w-5" />
                                Progress Tracking
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold mb-2">{project.progress_percentage}%</div>
                                    <Progress value={project.progress_percentage} className="h-4" />
                                </div>

                                {isEditing && (
                                    <div className="space-y-2">
                                        <Label>Update Progress</Label>
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={editedProject.progress_percentage}
                                            onChange={(e) => setEditedProject({
                                                ...editedProject,
                                                progress_percentage: parseInt(e.target.value)
                                            })}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>0%</span>
                                            <span>{editedProject.progress_percentage}%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tech" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CodeIcon className="h-5 w-5" />
                                Technology Stack
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {project.tech_stack && project.tech_stack.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.tech_stack.map((tech) => (
                                        <Badge key={tech} variant="secondary">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No technologies specified</p>
                            )}
                        </CardContent>
                    </Card>

                    {project.hosting_details && Object.keys(project.hosting_details).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ServerIcon className="h-5 w-5" />
                                    Hosting Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
                                    {JSON.stringify(project.hosting_details, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <SettingsIcon className="h-5 w-5" />
                                Project Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Created At</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(project.created_at)}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Updated</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(project.updated_at)}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Project ID</Label>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        {project.id}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>User ID</Label>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        {project.user_id}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}