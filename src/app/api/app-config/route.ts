import { NextRequest, NextResponse } from "next/server"
import { AppConfig, CreateAppConfigRequest } from "@/types/app-config"

// Mock data - replace with actual database calls
let appConfig: AppConfig | null = {
  id: "config_1",
  min_version: "1.0.0",
  current_version: "1.2.0",
  release_notes: "Nouvelles fonctionnalités et corrections de bugs",
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export async function GET() {
  try {
    if (!appConfig) {
      return NextResponse.json(
        { error: "Configuration non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json(appConfig)
  } catch (error) {
    console.error("Error fetching app config:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateAppConfigRequest = await request.json()
    
    // Validate required fields
    if (!body.min_version || !body.current_version) {
      return NextResponse.json(
        { error: "Les champs min_version et current_version sont requis" },
        { status: 400 }
      )
    }

    // Validate version format (basic validation)
    const versionRegex = /^\d+\.\d+\.\d+$/
    if (!versionRegex.test(body.min_version) || !versionRegex.test(body.current_version)) {
      return NextResponse.json(
        { error: "Format de version invalide. Utilisez le format X.Y.Z" },
        { status: 400 }
      )
    }

    // Create or update configuration
    const now = new Date().toISOString()
    const newConfig: AppConfig = {
      id: appConfig?.id || `config_${Date.now()}`,
      min_version: body.min_version,
      current_version: body.current_version,
      release_notes: body.release_notes || "",
      is_active: body.is_active ?? true,
      created_at: appConfig?.created_at || now,
      updated_at: now
    }

    appConfig = newConfig

    return NextResponse.json(newConfig, { status: 201 })
  } catch (error) {
    console.error("Error creating/updating app config:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Partial<CreateAppConfigRequest> = await request.json()
    
    if (!appConfig) {
      return NextResponse.json(
        { error: "Configuration non trouvée" },
        { status: 404 }
      )
    }

    // Validate version format if provided
    if (body.min_version && !/^\d+\.\d+\.\d+$/.test(body.min_version)) {
      return NextResponse.json(
        { error: "Format de version invalide pour min_version. Utilisez le format X.Y.Z" },
        { status: 400 }
      )
    }

    if (body.current_version && !/^\d+\.\d+\.\d+$/.test(body.current_version)) {
      return NextResponse.json(
        { error: "Format de version invalide pour current_version. Utilisez le format X.Y.Z" },
        { status: 400 }
      )
    }

    // Update configuration
    const updatedConfig: AppConfig = {
      ...appConfig,
      ...body,
      updated_at: new Date().toISOString()
    }

    appConfig = updatedConfig

    return NextResponse.json(updatedConfig)
  } catch (error) {
    console.error("Error updating app config:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
