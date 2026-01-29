import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type NoteProps = {
    title?: string
    content?: string
}

export function Note({ title, content }: NoteProps) {
  return (
    <Card className="mx-auto w-full max-w-sm max-h-80">
      <CardHeader>
        <CardTitle>{title ?? "Empty"}</CardTitle>
      </CardHeader>
      <CardContent className="max-h-full">
        <p className="overflow-y-scroll max-h-52">
          {content ?? "lorem ipsum ".repeat(50)}
        </p>
      </CardContent>
    </Card>
  )
}