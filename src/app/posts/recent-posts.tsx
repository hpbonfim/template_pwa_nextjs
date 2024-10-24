"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIndexedDB, type IDBDataItem } from "@/hooks/useIndexedDB";

interface IPost extends IDBDataItem {
  title: string;
  body: string;
}

export default function RecentPosts() {
  const { getAllItems } = useIndexedDB<IPost>("posts");
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    getAllItems().then((posts) => setPosts(posts));
  }, [getAllItems]);

  return (
    <main className="container flex grow flex-col py-6">
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
            {posts?.map((post) => (
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
