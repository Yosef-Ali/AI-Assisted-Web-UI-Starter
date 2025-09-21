"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProjectCard } from './ProjectCard'
import { ProjectCreateWizard } from './ProjectCreateWizard'
import { Project, ProjectStatus, ProjectPriority, ProjectType, ProjectCreateInput } from '@/types/project-management'
import { cn } from '@/lib/utils'
import {
    PlusIcon,
    SearchIcon,
    FilterIcon,
    LayoutGridIcon,
    ListIcon,
    CalendarIcon,
    DollarSignIcon,
    UsersIcon,
    TrendingUpIcon
} from 'lucide-react'

interface ProjectOverviewDashboardProps {
    projects: Project[]
    onCreateProject?: (project: ProjectCreateInput) => void
    onUpdateProject?: (id: string, updates: Partial<Project>) => void
    onDeleteProject?: (id: string) => void
    className?: string
}

export function ProjectOverviewDashboard({
    projects,
    onCreateProject,
    onUpdateProject,
    onDeleteProject,
    className
}: ProjectOverviewDashboardProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')
    const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | 'all'>('all')
    const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all')
    const [showCreateWizard, setShowCreateWizard] = useState(false)

    // Filter projects based on search and filters
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter
        const matchesType = typeFilter === 'all' || project.project_type === typeFilter

        return matchesSearch && matchesStatus && matchesPriority && matchesType
    })

    // Calculate metrics
    const metrics = {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length,
        onHold: projects.filter(p => p.status === 'on_hold').length,
        totalBudget: projects.reduce((sum, p) => sum + (p.budget_cents || 0), 0) / 100,
        avgProgress: projects.length > 0
            ? projects.reduce((sum, p) => sum + p.progress_percentage, 0) / projects.length
            : 0
    }

    const getStatusColor = (status: ProjectStatus) => {
        const colors = {
            planning: 'bg-blue-100 text-blue-800',
            active: 'bg-green-100 text-green-800',
            review: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-gray-100 text-gray-800',
            on_hold: 'bg-red-100 text-red-800',
            archived: 'bg-gray-100 text-gray-600'
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

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage and track your project portfolio
                    </p>
                </div>
                <Button
                    onClick={() => setShowCreateWizard(true)}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    New Project
                </Button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <LayoutGridIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics.active} active, {metrics.completed} completed
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${metrics.totalBudget.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Across all projects
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
                        <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.avgProgress.toFixed(1)}%</div>
                        <Progress value={metrics.avgProgress} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On Hold</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.onHold}</div>
                        <p className="text-xs text-muted-foreground">
                            {metrics.onHold > 0 ? 'Need attention' : 'All on track'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-2 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ProjectStatus | 'all')}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as ProjectPriority | 'all')}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ProjectType | 'all')}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="app">App</SelectItem>
                            <SelectItem value="api">API</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGridIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                    >
                        <ListIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Projects Content */}
            <div className="space-y-4">
                {filteredProjects.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <LayoutGridIcon className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                            <p className="text-muted-foreground mb-4 text-center">
                                {projects.length === 0
                                    ? "Get started by creating your first project"
                                    : "Try adjusting your search or filter criteria"
                                }
                            </p>
                            {projects.length === 0 && (
                                <Button onClick={() => setShowCreateWizard(true)}>
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Create First Project
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onUpdate={onUpdateProject}
                                onDelete={onDeleteProject}
                            />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Project List</CardTitle>
                            <CardDescription>
                                Showing {filteredProjects.length} of {projects.length} projects
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Budget</TableHead>
                                        <TableHead>Due Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProjects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div className="font-semibold">{project.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {project.code}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(project.status)}>
                                                    {project.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getPriorityColor(project.priority)}>
                                                    {project.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="capitalize">{project.project_type}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={project.progress_percentage} className="flex-1" />
                                                    <span className="text-sm font-medium min-w-[3rem]">
                                                        {project.progress_percentage}%
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {project.budget_cents
                                                    ? `$${(project.budget_cents / 100).toLocaleString()}`
                                                    : '—'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {project.end_date
                                                    ? new Date(project.end_date).toLocaleDateString()
                                                    : '—'
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Create Project Wizard */}
            {showCreateWizard && (
                <ProjectCreateWizard
                    onSuccess={(project) => {
                        onCreateProject?.(project)
                        setShowCreateWizard(false)
                    }}
                    onCancel={() => setShowCreateWizard(false)}
                />
            )}
        </div>
    )
}