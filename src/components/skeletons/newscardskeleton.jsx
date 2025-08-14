import { Skeleton } from "@/components/ui/skeleton"

export function NewsCardSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, index) =>
                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow" key={index}>
                    <Skeleton className="h-52 w-full rounded-t-lg" /> {/* Skeleton for image */}
                    <div className="p-4">
                        <Skeleton className="h-6 w-[200px] mb-2" /> {/* Skeleton for title */}
                        <Skeleton className="h-4 w-[150px] mb-3" /> {/* Skeleton for description */}
                        <Skeleton className="h-4 w-[100px]" /> {/* Skeleton for date */}
                    </div>
                </div>
            )}
        </div>
    )
}
