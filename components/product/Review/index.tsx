import Stars from "../Stars";
import { Card, CardContent } from "../../ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Review from "@/lib/models/review";

export default function ReviewDisplay({ review }: { review: Review }) {
  // calculate the initials of the author
  const initials = review.author.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <Card>
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage alt="@jaredpalmer" src="/placeholder-avatar.jpg" />
            {/* display the initials of the author */}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            {/* display the author's name and rating */}
            <h3 className="font-semibold">{review.author.name}</h3>
            <div className="flex items-center gap-0.5">
              <Stars rating={review.rating} />
            </div>
          </div>
        </div>
        <p>
          {/* display the review content */}
          {review.content}
        </p>
      </CardContent>
    </Card>
  );
}
