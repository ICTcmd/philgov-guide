export default function LoadingSkeleton() {
  return (
    <div className="w-full animate-pulse">
       {/* Mimic the ResultCard header */}
       <div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
       
       <div className="p-6 w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 dark:bg-gray-800 dark:border-gray-700 space-y-4">
          {/* Header line */}
          <div className="h-6 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mb-6"></div>
          
          {/* Paragraphs */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
          </div>
          
          {/* List items */}
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-300 rounded-full dark:bg-gray-600 flex-shrink-0"></div>
                <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-2/3"></div>
              </div>
            ))}
          </div>
       </div>
    </div>
  )
}
