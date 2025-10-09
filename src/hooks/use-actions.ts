"use client"

import { useState, useEffect, useCallback } from "react"
import { Action, ActionFilters, ActionResponse, CreateActionRequest, UpdateActionRequest } from "@/features/actions/types"
import { actionService } from "@/lib/action-service"

export function useActions() {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchActions = useCallback(async (filters: ActionFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const data = await actionService.getActions(filters)
      setActions(data.data)
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch actions")
    } finally {
      setLoading(false)
    }
  }, [])

  const createAction = async (actionData: CreateActionRequest): Promise<Action | null> => {
    try {
      const newAction = await actionService.createAction(actionData)
      setActions(prev => [newAction, ...prev])
      return newAction
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create action")
      return null
    }
  }

  const updateAction = async (id: string, actionData: UpdateActionRequest): Promise<Action | null> => {
    try {
      const updatedAction = await actionService.updateAction(id, actionData)
      setActions(prev => prev.map(a => a.id === id ? updatedAction : a))
      return updatedAction
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update action")
      return null
    }
  }

  const deleteAction = async (id: string): Promise<boolean> => {
    try {
      await actionService.deleteAction(id)
      setActions(prev => prev.filter(a => a.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete action")
      return false
    }
  }

  return {
    actions,
    loading,
    error,
    pagination,
    fetchActions,
    createAction,
    updateAction,
    deleteAction,
  }
}
