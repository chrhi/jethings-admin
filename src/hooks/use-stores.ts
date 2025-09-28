import { useState, useEffect } from 'react'
import { storeService } from '@/lib/store-service'
import { Store, StoreStats, StoreFilters, CreateStoreData, UpdateStoreData } from '@/features/stores/types'

export function useStores(filters: StoreFilters) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await storeService.getStores(filters)
      setStores(result.stores)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des magasins')
    } finally {
      setLoading(false)
    }
  }

  const createStore = async (data: CreateStoreData) => {
    try {
      setLoading(true)
      setError(null)
      await storeService.createStore(data)
      await fetchStores() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du magasin')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateStore = async (data: UpdateStoreData) => {
    try {
      setLoading(true)
      setError(null)
      await storeService.updateStore(data)
      await fetchStores() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du magasin')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteStore = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await storeService.deleteStore(id)
      await fetchStores() // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression du magasin')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStores()
  }, [filters])

  return {
    stores,
    loading,
    error,
    total,
    refetch: fetchStores,
    createStore,
    updateStore,
    deleteStore
  }
}

export function useStoreStats() {
  const [stats, setStats] = useState<StoreStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await storeService.getStoreStats()
      setStats(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}
