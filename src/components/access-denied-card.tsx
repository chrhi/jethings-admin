import { Button } from "./ui/button";

export default function AccessDeniedCard() {
  return (
    <div className="w-full h-[200px] bg-red-100 dark:bg-red-900/30 flex flex-col items-start justify-start gap-y-4 p-4 border-2 border-red-200 dark:border-red-800 rounded-lg transition-colors duration-200">
      <h2 className="text-red-600 dark:text-red-400 font-bold">ACCESS_DENIED</h2>
      <p className="text-gray-700 dark:text-gray-300">
        You don't have permission to access this resource.
      </p>
      <Button
        variant="outline"
        className="border-red-400 text-red-500 dark:border-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
      >
        Try again
      </Button>
    </div>
  );
}
