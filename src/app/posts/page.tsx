import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "All Posts"
};

const URL = "https://jsonplaceholder.typicode.com/posts";

export default async function Page() {
  const data = await fetch(URL, { cache: "no-store" });
  const posts = await data.json();

  return (
    <main className="container flex grow flex-col py-6">
      <Separator />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Posts</CardTitle>
            <Button asChild>Create a new post</Button>
          </div>
        </CardHeader>
        <hr className="w-full border" />
        <CardContent>
          <ul className="mt-6 grid justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map((post: Record<string, never>) => (
              <li className="max-w-xs rounded-md border p-6" key={post.id}>
                <h2 className="text-lg font-medium">{post.title}</h2>
                <p className="text-sm">{post.body}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}

export const dynamic = "force-dynamic";
