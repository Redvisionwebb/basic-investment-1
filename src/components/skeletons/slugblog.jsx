import { Skeleton } from "@/components/ui/skeleton"

export function SlugBlog() {
    return (
        <div className="items-center">
            <div className="grid md:grid-cols-3 grid-cols-1 gap-3">

                <Skeleton className="h-30 w-full rounded"/>
            </div>
        </div>
    )
}
