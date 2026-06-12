"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NeonCard } from "@/components/cyber/NeonCard";
import { createThread } from "@/app/actions/threads";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface NewThreadFormProps {
  categories: Category[];
  isLoggedIn: boolean;
}

export function NewThreadForm({ categories, isLoggedIn }: NewThreadFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");

  async function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("categoryId", categoryId);
    const result = await createThread(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <NeonCard className="p-6">
      <form action={handleSubmit} className="space-y-5">
        {!isLoggedIn && (
          <div className="space-y-2">
            <Label htmlFor="guestName">昵称</Label>
            <Input
              id="guestName"
              name="guestName"
              placeholder="匿名读者"
              maxLength={50}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>分类</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">标题</Label>
          <Input
            id="title"
            name="title"
            placeholder="你想讨论什么？"
            maxLength={200}
            required
            minLength={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">内容</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="分享你的想法、建议或疑问...支持 Markdown 格式"
            className="min-h-[200px]"
            required
            minLength={10}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button type="submit" size="lg">
          发布讨论
        </Button>
      </form>
    </NeonCard>
  );
}
