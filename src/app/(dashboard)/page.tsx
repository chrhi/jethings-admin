export default function Home() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Bienvenue 👋</h1>
      <p className="text-muted-foreground">
        Voici votre tableau de bord. Ajoutez des widgets et des statistiques rapides ici.
      </p>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Métrique A</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Métrique B</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Métrique C</div>
          <div className="text-2xl font-bold">—</div>
        </div>
      </div>
    </div>
  )
}
